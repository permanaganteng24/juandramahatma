import React, { useState } from 'react';
import { useAppData } from '../../../context/AppDataContext';
import {
  Database,
  Download,
  Upload,
  RotateCcw,
  KeyRound,
  Check,
  AlertCircle,
  Cloud,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const VercelDatabaseTab: React.FC = () => {
  const {
    db,
    syncStatus,
    saveToVercel,
    exportDatabaseJson,
    importDatabaseJson,
    resetToDefault,
    updateAdminPin,
  } = useAppData();

  const [pinCurrent, setPinCurrent] = useState('');
  const [pinNew, setPinNew] = useState('');
  const [pinStatus, setPinStatus] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleManualSaveToVercel = async () => {
    setIsSaving(true);
    setSaveStatus('Menyimpan ke Vercel & LocalStorage...');
    const ok = await saveToVercel();
    setIsSaving(false);
    if (ok) {
      setSaveStatus('Database berhasil disinkronkan ke Vercel!');
    } else {
      setSaveStatus('Database tersimpan di LocalStorage (Offline mode).');
    }
    setTimeout(() => setSaveStatus(null), 3500);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDatabaseJson(content);
      if (success) {
        alert('Database JSON berhasil diimpor & dipulihkan!');
      } else {
        alert('Gagal mengimpor database. Pastikan file JSON valid!');
      }
    };
    reader.readAsText(file);
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCurrent !== db.adminPin) {
      setPinStatus('PIN saat ini salah!');
      return;
    }
    if (pinNew.trim().length < 4) {
      setPinStatus('PIN baru minimal 4 angka/karakter!');
      return;
    }
    updateAdminPin(pinNew.trim());
    setPinStatus('PIN Admin berhasil diperbarui!');
    setPinCurrent('');
    setPinNew('');
    setTimeout(() => setPinStatus(null), 3000);
  };

  return (
    <div className="space-y-5">
      {/* 1. Status Penyimpanan Vercel */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-sm">
              ▲
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Penyimpanan Database Vercel
              </h4>
              <p className="text-[11px] text-slate-500">
                Endpoint API: <code className="text-sky-700 font-mono">/api/database</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{syncStatus === 'saving' ? 'Menyimpan...' : 'Sinkron'}</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Seluruh data (foto, nama ananda, rekening DANA, ucapan tamu, dan pengaturan acara) tersimpan secara permanen dan otomatis sinkron dengan Vercel saat dideploy.
        </p>

        {saveStatus && (
          <div className="p-2.5 bg-sky-50 border border-sky-200 text-sky-800 text-xs font-medium rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-sky-600 shrink-0" />
            <span>{saveStatus}</span>
          </div>
        )}

        <button
          onClick={handleManualSaveToVercel}
          disabled={isSaving}
          className="w-full py-2.5 bg-black hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <Cloud className="w-4 h-4 text-sky-400" />
          <span>{isSaving ? 'Menyimpan...' : 'Simpan Sekarang ke Vercel'}</span>
        </button>
      </div>

      {/* 2. Backup & Restore Database */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <Database className="w-4 h-4 text-sky-600" />
          <span>Backup &amp; Restore Database</span>
        </h4>
        <p className="text-xs text-slate-500">
          Unduh salinan cadangan (*backup*) data ke file JSON atau pulihkan data dari file sebelumnya.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {/* Download JSON */}
          <button
            onClick={exportDatabaseJson}
            className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-sky-600" />
            <span>Download Backup (.JSON)</span>
          </button>

          {/* Import JSON */}
          <label className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all">
            <Upload className="w-4 h-4 text-sky-600" />
            <span>Upload / Restore (.JSON)</span>
            <input
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleFileImport}
            />
          </label>
        </div>
      </div>

      {/* 3. Ganti PIN Admin */}
      <form onSubmit={handleChangePin} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <Lock className="w-4 h-4 text-sky-600" />
          <span>Ubah PIN Akses Panel Admin</span>
        </h4>

        {pinStatus && (
          <div
            className={`p-2.5 text-xs font-medium rounded-xl flex items-center gap-2 ${
              pinStatus.includes('berhasil')
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {pinStatus.includes('berhasil') ? (
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            )}
            <span>{pinStatus}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              PIN Saat Ini:
            </label>
            <input
              type="password"
              value={pinCurrent}
              onChange={(e) => setPinCurrent(e.target.value)}
              placeholder="PIN saat ini"
              className="w-full text-xs p-2 rounded-lg border border-slate-200"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              PIN Baru:
            </label>
            <input
              type="password"
              value={pinNew}
              onChange={(e) => setPinNew(e.target.value)}
              placeholder="PIN baru (min. 4)"
              className="w-full text-xs p-2 rounded-lg border border-slate-200"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-all"
        >
          Perbarui PIN Admin
        </button>
      </form>

      {/* 4. Reset Data Awal */}
      <div className="bg-red-50/70 p-4 rounded-2xl border border-red-100 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-red-800">Kembalikan ke Pengaturan Semula</p>
          <p className="text-[11px] text-red-600">
            Mereset seluruh teks, foto, dan ucapan ke bawaan awal.
          </p>
        </div>
        <button
          onClick={resetToDefault}
          className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
