import React, { useState, useEffect } from 'react';
import { MailOpen, Sparkles, Heart, Star, Calendar, MapPin, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { bgMusicPlayer } from '../utils/audio';
import { triggerOpenEnvelopeConfetti } from '../utils/confetti';

interface CoverEnvelopeProps {
  guestName: string;
  onOpen: () => void;
  isOpen: boolean;
}

export const CoverEnvelope: React.FC<CoverEnvelopeProps> = ({ guestName, onOpen, isOpen }) => {
  const { db } = useAppData();
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  const coverPhotos = db.coverPhotos && db.coverPhotos.length > 0 ? db.coverPhotos : [];

  // Auto-advance photos gently every 4.5 seconds
  useEffect(() => {
    if (coverPhotos.length <= 1) return;
    const timer = setInterval(() => {
      setActivePhotoIndex((prev) => (prev + 1) % coverPhotos.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [coverPhotos.length]);

  const handleOpenClick = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Trigger rich multi-stage canvas-based confetti animation
    triggerOpenEnvelopeConfetti();

    // Start background peaceful music
    void bgMusicPlayer.play();

    // Allow graceful fade-out transition while confetti showers down
    setTimeout(() => {
      onOpen();
      setIsOpening(false);
    }, 650);
  };

  if (isOpen && !isOpening) return null;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-sky-50/95 via-slate-50/95 to-blue-50/95 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-700 ease-out ${
        isOpening ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Decorative background Islamic geometry blur bubbles */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />

      <div
        className={`relative w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-7 shadow-2xl border border-sky-100 text-center flex flex-col items-center transition-all duration-500 transform ${
          isOpening ? '-translate-y-4 scale-98' : 'translate-y-0 scale-100'
        }`}
      >
        {/* Top Ornament */}
        <div className="flex items-center justify-center gap-2 mb-2 text-amber-500">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-semibold uppercase tracking-widest text-sky-800 bg-sky-100/70 px-3.5 py-1 rounded-full">
            Walimah Mubarak
          </span>
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 text-xs font-medium px-3.5 py-1 rounded-full border border-sky-200/70 mb-4">
          <span>👶</span>
          <span>Tasyakuran Walimatul &apos;Aqiqah &amp; Khitan</span>
        </div>

        {/* Dual Photo Cover Container */}
        {coverPhotos.length > 0 && (
          <div className="relative mb-4 w-full flex flex-col items-center">
            <div className="relative w-52 h-64 sm:w-56 sm:h-70 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 group">
              {/* Photos */}
              {coverPhotos.map((photo, index) => (
                <img
                  key={photo.id || index}
                  src={photo.src}
                  alt={photo.alt || photo.label}
                  referrerPolicy="no-referrer"
                  className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out ${
                    activePhotoIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                  }`}
                />
              ))}

              {/* Left / Right Nav Arrows inside Photo */}
              {coverPhotos.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIndex((prev) => (prev === 0 ? coverPhotos.length - 1 : prev - 1));
                    }}
                    aria-label="Foto Sebelumnya"
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/35 hover:bg-black/55 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-85 hover:opacity-100"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIndex((prev) => (prev + 1) % coverPhotos.length);
                    }}
                    aria-label="Foto Selanjutnya"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/35 hover:bg-black/55 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-85 hover:opacity-100"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Photo Counter Pill in corner */}
                  <div className="absolute bottom-2.5 right-2.5 bg-black/50 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-amber-300" />
                    <span>{activePhotoIndex + 1} / {coverPhotos.length} Foto</span>
                  </div>
                </>
              )}
            </div>

            {/* Heart Badge Top Left */}
            <div className="absolute -top-2 left-6 sm:left-10 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center border border-sky-100 animate-bounce">
              <Heart className="w-4 h-4 text-sky-600 fill-sky-500" />
            </div>

            {/* Star Badge Bottom Right */}
            <div className="absolute bottom-6 right-6 sm:right-10 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center border border-amber-100">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            </div>

            {/* Interactive Photo Switcher Thumbnails / Pills */}
            {coverPhotos.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-2.5">
                {coverPhotos.map((item, idx) => (
                  <button
                    key={item.id || idx}
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                      activePhotoIndex === idx
                        ? 'bg-sky-600 text-white shadow-xs scale-102'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${activePhotoIndex === idx ? 'bg-white' : 'bg-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Baby Name */}
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0f4c81] tracking-tight mb-1">
          {db.baby.fullName}
        </h1>
        <p className="text-xs text-slate-500 mb-4">
          Putra dari <span className="font-semibold text-slate-700">{db.baby.fatherName}</span> &amp; <span className="font-semibold text-slate-700">{db.baby.motherName}</span>
        </p>

        {/* Recipient Invitation Box */}
        <div className="w-full bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200/70 mb-5 shadow-inner text-center">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-0.5">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </p>
          <p className="text-lg font-bold text-slate-800 tracking-wide font-serif capitalize">
            {guestName || 'Tamu Undangan'}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5 italic">
            *Mohon maaf bila ada kesalahan penulisan nama/gelar
          </p>
        </div>

        {/* Event Quick Info */}
        <div className="flex items-center justify-center gap-4 text-xs text-slate-600 mb-5">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-sky-600" />
            <span>{db.event.dateFormatted.split(',')[1]?.trim() || db.event.dateFormatted}</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-sky-600" />
            <span>{db.event.locationName}</span>
          </div>
        </div>

        {/* Open Button */}
        <button
          onClick={handleOpenClick}
          disabled={isOpening}
          className="w-full relative group overflow-hidden bg-gradient-to-r from-sky-600 via-blue-600 to-sky-700 hover:from-sky-700 hover:to-blue-800 active:scale-98 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2.5 transition-all duration-300"
        >
          <MailOpen className="w-5 h-5 transition-transform group-hover:rotate-6" />
          <span className="tracking-wide">
            {isOpening ? 'Membuka Undangan...' : 'Buka Undangan'}
          </span>
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
        </button>

        <p className="text-[11px] text-slate-400 mt-3 flex items-center justify-center gap-1">
          <span>Sentuh tombol di atas untuk membuka undangan</span>
        </p>
      </div>
    </div>
  );
};
