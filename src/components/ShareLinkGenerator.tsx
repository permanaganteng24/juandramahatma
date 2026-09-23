import React, { useState } from 'react';
import { Share2, MessageCircle, Copy, Check, Sparkles } from 'lucide-react';
import { generateWhatsAppShareUrl } from '../utils/calendar';

export const ShareLinkGenerator: React.FC = () => {
  const [recipient, setRecipient] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const getPersonalizedUrl = () => {
    const origin = window.location.origin + window.location.pathname;
    if (!recipient.trim()) return origin;
    return `${origin}?to=${encodeURIComponent(recipient.trim())}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getPersonalizedUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const url = generateWhatsAppShareUrl(recipient || 'Bapak/Ibu/Saudara/i');
    window.open(url, '_blank');
  };

  return (
    <section className="w-full bg-gradient-to-br from-sky-50 via-indigo-50/50 to-white rounded-3xl p-6 sm:p-8 shadow-sm border border-sky-100 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-600/20">
          <Share2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            Bagikan Undangan Digital
          </h3>
          <p className="text-xs text-slate-500">
            Buat tautan personal dan kirim langsung via WhatsApp
          </p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Nama Tamu / Keluarga yang Dituju:
        </label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Contoh: Keluarga H. M. Ridwan / Om Dimas"
          className="w-full bg-white text-sm text-slate-800 px-4 py-3 rounded-2xl border border-sky-200 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all placeholder:text-slate-400 shadow-xs"
        />
      </div>

      {recipient.trim() && (
        <div className="p-3 bg-white/80 rounded-xl border border-sky-100 text-[11px] text-slate-500 break-all">
          <span className="font-semibold text-slate-700">Preview Link: </span>
          <span className="text-sky-700">{getPersonalizedUrl()}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          onClick={handleOpenWhatsApp}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-semibold text-xs rounded-2xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Kirim via WhatsApp</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="w-full py-3 px-4 bg-sky-100 hover:bg-sky-200 active:scale-98 text-sky-800 font-semibold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all"
        >
          {copiedLink ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700">Link Berhasil Disalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Salin Link Khusus</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
