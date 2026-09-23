import React, { useState } from 'react';
import { useAppData } from '../../../context/AppDataContext';
import { Link2, Copy, Check, Send, Users, Sparkles } from 'lucide-react';

export const InvitationLinkTab: React.FC = () => {
  const { db } = useAppData();
  const [guestNameInput, setGuestNameInput] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate target URL
  const baseUrl = window.location.origin + window.location.pathname;
  const cleanName = guestNameInput.trim();
  const generatedUrl = cleanName
    ? `${baseUrl}?to=${encodeURIComponent(cleanName)}`
    : baseUrl;

  // Custom WhatsApp message
  const waText = `Kepada Yth. Bapak/Ibu/Saudara/i ${cleanName || 'Tamu Undangan'},%0A%0A` +
    `Assalamu'alaikum Warahmatullahi Wabarakatuh,%0A%0A` +
    `Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara Tasyakuran Walimatul 'Aqiqah & Khitan putra kami:%0A%0A` +
    `*${db.baby.fullName}*%0A%0A` +
    `🗓 Hari/Tgl: ${db.event.dateFormatted}%0A` +
    `⏰ Waktu: ${db.event.timeFormatted}%0A` +
    `📍 Lokasi: ${db.event.locationName}, ${db.event.locationAddress}%0A%0A` +
    `Untuk informasi lengkap dan konfirmasi kehadiran, silakan buka tautan undangan digital berikut:%0A` +
    `${encodeURIComponent(generatedUrl)}%0A%0A` +
    `Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu bagi ananda.%0A%0A` +
    `Wassalamu'alaikum Warahmatullahi Wabarakatuh%0A` +
    `Keluarga ${db.baby.fatherName} & ${db.baby.motherName}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsapp = () => {
    window.open(`https://api.whatsapp.com/send?text=${waText}`, '_blank');
  };

  const quickGuestExamples = [
    'Bapak Haji Ahmad & Keluarga',
    'Keluarga Besar Bani Ridwan',
    'Ibu Nurul & Suami',
    'Sahabat & Rekan Kantor',
  ];

  return (
    <div className="space-y-5">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <Users className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Generator Link Undangan Tamu
            </h4>
            <p className="text-[11px] text-slate-500">
              Buat link dengan nama tamu di sampul &amp; kirim via WhatsApp
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Ketik Nama Tamu Undangan:
          </label>
          <input
            type="text"
            value={guestNameInput}
            onChange={(e) => setGuestNameInput(e.target.value)}
            placeholder="Contoh: Bapak H. Syamsul & Keluarga"
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-semibold"
          />
        </div>

        {/* Quick chip suggestions */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-slate-400">Contoh cepat:</span>
          {quickGuestExamples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setGuestNameInput(ex)}
              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Link Result Box */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <p className="text-[10px] uppercase font-bold text-slate-400">Link Khusus Tamu:</p>
          <p className="font-mono text-xs text-sky-800 break-all select-all font-medium bg-white p-2 rounded-lg border border-slate-200">
            {generatedUrl}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleCopyLink}
              className="py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Link</span>
                </>
              )}
            </button>

            <button
              onClick={handleSendWhatsapp}
              className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim ke WA</span>
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Message Preview */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
        <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Pratinjau Pesan Undangan WhatsApp</span>
        </h5>
        <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-600 whitespace-pre-line leading-relaxed font-sans shadow-2xs">
          Kepada Yth. Bapak/Ibu/Saudara/i <strong>{cleanName || 'Tamu Undangan'}</strong>,<br /><br />
          Assalamu&apos;alaikum Warahmatullahi Wabarakatuh,<br /><br />
          Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara Tasyakuran Walimatul &apos;Aqiqah &amp; Khitan putra kami:<br /><br />
          <strong>{db.baby.fullName}</strong><br />
          🗓 Hari/Tgl: {db.event.dateFormatted}<br />
          ⏰ Waktu: {db.event.timeFormatted}<br />
          📍 Lokasi: {db.event.locationName}<br /><br />
          Buka tautan undangan berikut: <u>{generatedUrl}</u>
        </div>
      </div>
    </div>
  );
};
