import React, { useState } from 'react';
import { useAppData } from '../../../context/AppDataContext';
import { CreditCard, Check, Save } from 'lucide-react';

export const DanaTab: React.FC = () => {
  const { db, updateDana } = useAppData();

  const [danaForm, setDanaForm] = useState({ ...db.dana });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDana(danaForm);
    setStatusMessage('Data rekening DANA berhasil diperbarui!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#118EEA]/10 text-[#118EEA] flex items-center justify-center font-black">
            DANA
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Pengaturan Amplop Digital (DANA)
            </h4>
            <p className="text-[11px] text-slate-500">
              Informasi rekening dompet digital untuk tali kasih para tamu
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Nomor HP / Akun DANA:
          </label>
          <input
            type="text"
            value={danaForm.accountNumber}
            onChange={(e) => setDanaForm({ ...danaForm, accountNumber: e.target.value })}
            placeholder="082135134688"
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-mono font-bold text-slate-800"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Nama Pemilik Akun DANA (Atas Nama):
          </label>
          <input
            type="text"
            value={danaForm.accountHolder}
            onChange={(e) => setDanaForm({ ...danaForm, accountHolder: e.target.value.toUpperCase() })}
            placeholder="BAYU MAHATMA SAPUTRA"
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-semibold uppercase text-slate-800"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Catatan / Penerima Kado Fisik:
          </label>
          <textarea
            rows={2}
            value={danaForm.receiverNote}
            onChange={(e) => setDanaForm({ ...danaForm, receiverNote: e.target.value })}
            placeholder="Penerima kado/hadiah fisik: Bapak Bayu Mahatma Saputra (082135134688)"
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Preview Card */}
      <div className="rounded-2xl p-4 text-white bg-gradient-to-br from-[#118EEA] to-[#085a9c] shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
            Pratinjau Kartu DANA
          </span>
          <span className="font-extrabold tracking-widest text-sm">DANA</span>
        </div>
        <p className="font-mono text-lg font-bold tracking-wider mb-1">{danaForm.accountNumber || '08xx-xxxx-xxxx'}</p>
        <p className="text-xs text-white/90 font-medium">A/N: {danaForm.accountHolder || 'NAMA PEMILIK'}</p>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition-all"
      >
        <Save className="w-4 h-4" />
        <span>Simpan Rekening DANA</span>
      </button>
    </form>
  );
};
