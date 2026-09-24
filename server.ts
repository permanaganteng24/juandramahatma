import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Body parser for JSON with 50mb limit for high-res photo uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  const DATA_DIR = path.resolve(process.cwd(), 'data');
  const UPLOADS_DIR = path.resolve(process.cwd(), 'public/uploads');

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  // Serve static files from public folder (including /uploads)
  app.use(express.static(path.resolve(process.cwd(), 'public')));

  const DB_FILE = path.join(DATA_DIR, 'database.json');

  // GET /api/database
  app.get('/api/database', (req, res) => {
    if (fs.existsSync(DB_FILE)) {
      try {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        return res.json({
          success: true,
          source: 'server-file',
          data: JSON.parse(content),
        });
      } catch (err) {
        console.error('Error reading db file:', err);
      }
    }
    return res.json({
      success: true,
      source: 'initial-empty',
      data: null,
    });
  });

  // POST /api/database
  app.post('/api/database', (req, res) => {
    try {
      const payload = req.body;
      if (!payload) {
        return res.status(400).json({ success: false, error: 'Payload data is required' });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
      return res.json({
        success: true,
        message: 'Database berhasil disimpan permanen di server',
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error saving db file:', err);
      return res.status(500).json({ success: false, error: 'Failed to save database' });
    }
  });

  // POST /api/upload-photo - Saves image permanently to disk
  app.post('/api/upload-photo', (req, res) => {
    try {
      const { dataUrl, filename } = req.body;
      if (!dataUrl) {
        return res.status(400).json({ success: false, error: 'dataUrl is required' });
      }

      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ success: false, error: 'Invalid data URL format' });
      }

      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');
      const ext = mimeType.includes('png') ? 'png' : 'jpg';

      const cleanName = filename
        ? filename.replace(/[^a-zA-Z0-9_-]/g, '_')
        : `photo_${Date.now()}`;
      const finalFileName = `${cleanName}_${Date.now()}.${ext}`;
      const targetPath = path.join(UPLOADS_DIR, finalFileName);

      fs.writeFileSync(targetPath, buffer);
      const publicUrl = `/uploads/${finalFileName}`;

      return res.json({
        success: true,
        url: publicUrl,
        filename: finalFileName,
        size: buffer.length,
      });
    } catch (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ success: false, error: 'Gagal mengunggah foto ke server' });
    }
  });

  // GET /api/status - Health check
  app.get('/api/status', (req, res) => {
    const hasDb = fs.existsSync(DB_FILE);
    const uploadsCount = fs.existsSync(UPLOADS_DIR) ? fs.readdirSync(UPLOADS_DIR).length : 0;
    return res.json({
      status: 'ok',
      hasDb,
      uploadsCount,
      timestamp: new Date().toISOString(),
    });
  });

  // Mount Vite dev server in non-production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist/index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server permanen aktif di http://0.0.0.0:${PORT}`);
  });
}

startServer();
