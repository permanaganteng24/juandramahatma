// Vercel Serverless Function for Aqiqah Juandra Database
// Supports Vercel KV / Edge Config / Blob if configured in environment, or Node memory fallback

let inMemoryStorage: any = null;

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  if (req.method === 'GET') {
    // 1. Try Vercel KV if environment variables are provided
    if (kvUrl && kvToken) {
      try {
        const kvRes = await fetch(`${kvUrl}/get/aqiqah_app_database`, {
          headers: { Authorization: `Bearer ${kvToken}` },
        });
        const kvData = await kvRes.json();
        if (kvData && kvData.result) {
          const parsed = typeof kvData.result === 'string' ? JSON.parse(kvData.result) : kvData.result;
          return res.status(200).json({
            success: true,
            source: 'vercel-kv',
            data: parsed,
          });
        }
      } catch (err) {
        console.error('Vercel KV read error:', err);
      }
    }

    // 2. Return memory storage if present
    if (inMemoryStorage) {
      return res.status(200).json({
        success: true,
        source: 'vercel-memory',
        data: inMemoryStorage,
      });
    }

    return res.status(200).json({
      success: true,
      source: 'initial-empty',
      data: null,
    });
  }

  if (req.method === 'POST') {
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        // use as is
      }
    }

    if (!payload) {
      return res.status(400).json({ success: false, error: 'Payload data is required' });
    }

    inMemoryStorage = payload;

    // Persist to Vercel KV if enabled
    if (kvUrl && kvToken) {
      try {
        await fetch(`${kvUrl}/set/aqiqah_app_database`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${kvToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(JSON.stringify(payload)),
        });
      } catch (err) {
        console.error('Vercel KV write error:', err);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Database berhasil disimpan di Vercel',
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
