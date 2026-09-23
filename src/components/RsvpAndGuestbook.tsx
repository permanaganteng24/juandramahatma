import React, { useState, useEffect } from 'react';
import { MessageSquareText, Heart, CheckCircle2, XCircle, Send, Sparkles, Filter, Pin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppData } from '../context/AppDataContext';
import type { WishItem } from '../types/database';

interface RsvpAndGuestbookProps {
  initialGuestName?: string;
}

export const RsvpAndGuestbook: React.FC<RsvpAndGuestbookProps> = ({ initialGuestName = '' }) => {
  const { db, addWish, toggleLikeWish } = useAppData();
  const [name, setName] = useState<string>(initialGuestName);
  const [attendance, setAttendance] = useState<'hadir' | 'insya_allah' | 'tidak_hadir'>('hadir');
  const [pax, setPax] = useState<number>(1);
  const [message, setMessage] = useState<string>('');
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<'all' | 'hadir' | 'tidak_hadir'>('all');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (initialGuestName && !name) {
      setName(initialGuestName);
    }
  }, [initialGuestName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);

    addWish({
      name: name.trim(),
      attendance,
      message: message.trim(),
    });

    // Pop confetti
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#0284c7', '#38bdf8', '#f59e0b', '#10b981'],
    });

    setMessage('');
    setIsSubmitting(false);
    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 4000);
  };

  const handleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    toggleLikeWish(id);
  };

  const wishes = db.wishes || [];

  const filteredWishes = wishes.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'hadir') return item.attendance === 'hadir' || item.attendance === 'insya_allah';
    return item.attendance === 'tidak_hadir';
  });

  const getAttendanceBadge = (status: 'hadir' | 'insya_allah' | 'tidak_hadir') => {
    switch (status) {
      case 'hadir':
        return (
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-full">
            Hadir
          </span>
        );
      case 'insya_allah':
        return (
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/90 px-2.5 py-0.5 rounded-full">
            Insya Allah
          </span>
        );
      case 'tidak_hadir':
        return (
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
            Berhalangan
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100/80 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-sky-100/80 text-sky-700 flex items-center justify-center shrink-0">
          <MessageSquareText className="w-5 h-5 text-sky-600" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            RSVP &amp; Doa Restu
          </h3>
          <p className="text-xs text-slate-500">
            Konfirmasi kehadiran dan kirimkan untaian doa
          </p>
        </div>
      </div>

      {/* RSVP Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-[#f8faff] p-4 sm:p-5 rounded-2xl border border-sky-100/80">
        {/* Name Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Nama Anda / Keluarga <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Bapak H. Syamsul &amp; Keluarga"
            className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Attendance Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Konfirmasi Kehadiran <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setAttendance('hadir')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                attendance === 'hadir'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Hadir</span>
            </button>

            <button
              type="button"
              onClick={() => setAttendance('insya_allah')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                attendance === 'insya_allah'
                  ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Insya Allah</span>
            </button>

            <button
              type="button"
              onClick={() => setAttendance('tidak_hadir')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                attendance === 'tidak_hadir'
                  ? 'bg-slate-700 text-white shadow-sm shadow-slate-700/30'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Maaf Batal</span>
            </button>
          </div>
        </div>

        {/* Pax selector (if attending) */}
        {attendance !== 'tidak_hadir' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Jumlah Orang yang Hadir
            </label>
            <select
              value={pax}
              onChange={(e) => setPax(Number(e.target.value))}
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all text-slate-700"
            >
              <option value={1}>1 Orang</option>
              <option value={2}>2 Orang</option>
              <option value={3}>3 Orang</option>
              <option value={4}>4 Orang</option>
              <option value={5}>5+ Orang (Rombongan)</option>
            </select>
          </div>
        )}

        {/* Message / Prayer Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Untaian Doa &amp; Ucapan Selamat <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Tuliskan doa dan harapan terbaik untuk ananda ${db.baby.fullName.split(' ')[1] || 'Juandra'}...`}
            className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !name.trim() || !message.trim()}
          className="w-full py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-98 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition-all"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Mengirim Doa...' : 'Kirim Konfirmasi & Doa Restu'}</span>
        </button>

        {submittedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-center gap-2 animate-fade-in font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Terima kasih! Doa dan konfirmasi Anda telah tersimpan.</span>
          </div>
        )}
      </form>

      {/* Guestbook List Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <span>Untaian Doa Tamu Undangan</span>
            <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full text-[10px]">
              {wishes.length}
            </span>
          </p>

          {/* Filter */}
          <div className="flex items-center gap-1 text-[11px]">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-0.5 rounded-md ${filter === 'all' ? 'bg-sky-100 text-sky-800 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Semua
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setFilter('hadir')}
              className={`px-2 py-0.5 rounded-md ${filter === 'hadir' ? 'bg-sky-100 text-sky-800 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Hadir
            </button>
          </div>
        </div>

        {/* Wishes List Cards */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {filteredWishes.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                item.isPinned
                  ? 'bg-amber-50/70 border-amber-200/80 shadow-2xs'
                  : 'bg-white border-slate-100 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-800">{item.name}</span>
                    {item.isPinned && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                        <Pin className="w-2.5 h-2.5" /> Pilihan
                      </span>
                    )}
                    {getAttendanceBadge(item.attendance)}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.timestamp}</p>
                </div>

                <button
                  onClick={() => handleLike(item.id)}
                  className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-full transition-colors ${
                    likedMap[item.id]
                      ? 'text-red-600 bg-red-50 font-bold'
                      : 'text-slate-400 hover:text-red-500 hover:bg-slate-50'
                  }`}
                  title="Aamiin / Suka"
                >
                  <Heart className={`w-3.5 h-3.5 ${likedMap[item.id] ? 'fill-red-600 text-red-600' : ''}`} />
                  <span>{item.likes}</span>
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-sans">{item.message}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
