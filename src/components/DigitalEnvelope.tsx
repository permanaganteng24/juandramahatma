import React, { useState } from 'react';
import { Gift, Copy, Check, ChevronDown, ChevronUp, CreditCard, HeartHandshake } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

export const DigitalEnvelope: React.FC = () => {
  const { db } = useAppData();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2500);
  };

  const shortName = db.baby.fullName.split(' ')[1] || 'Juandra';

  return (
    <section className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100/80 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0">
          <Gift className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            Tali Kasih &amp; Kado Digital
          </h3>
          <p className="text-xs text-slate-500">
            Ungkapan tanda kasih untuk ananda {shortName}
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        Doa restu Bapak/Ibu/Saudara/i sekalian merupakan karunia terindah bagi ananda {shortName}.
        Bagi yang ingin memberikan tanda kasih atau kado digital melalui dompet DANA, kami sediakan informasi di bawah ini:
      </p>

      {/* Accordion Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all transform active:scale-98"
      >
        <HeartHandshake className="w-4 h-4" />
        <span>{isOpen ? 'Tutup Informasi Amplop Digital' : 'Buka Amplop Digital & Kirim Kado (DANA)'}</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Bank Account Cards (Visible when opened) */}
      {isOpen && (
        <div className="space-y-4 pt-2 animate-fade-in">
          {/* DANA Card */}
          <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-[#118EEA] via-[#0d7acb] to-[#085a9c] shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                <span>{db.dana.badge || 'DANA E-Wallet'}</span>
              </span>
              <span className="font-extrabold tracking-widest text-lg sm:text-xl text-white">
                DANA
              </span>
            </div>

            <p className="text-[11px] text-white/80 uppercase tracking-wider mb-0.5">
              Nomor Akun / DANA
            </p>
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-white">
                {db.dana.accountNumber}
              </p>
              <button
                onClick={() => handleCopy(db.dana.accountNumber, 'dana')}
                className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
              >
                {copiedKey === 'dana' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span className="text-emerald-200">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Nomor</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-xs text-white/90">
              <span className="text-white/70">Atas Nama: </span>
              <span className="font-bold text-white tracking-wide">{db.dana.accountHolder}</span>
            </div>
          </div>

          {/* Kirim Kado Fisik / Alamat Rumah */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left">
            <p className="text-xs font-bold text-slate-800 mb-1">
              📦 Pengiriman Kado Fisik
            </p>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {db.event.locationAddress}
              <br />
              <span className="text-[11px] text-slate-500">{db.dana.receiverNote}</span>
            </p>
            <button
              onClick={() => handleCopy(db.event.locationAddress, 'address')}
              className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-white border border-sky-200 shadow-2xs"
            >
              {copiedKey === 'address' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Alamat Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Alamat Penerima</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
