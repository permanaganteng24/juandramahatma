import React, { useState, useEffect } from 'react';
import { Star, Heart, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

export const HeroSection: React.FC = () => {
  const { db } = useAppData();
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  const heroPhotos = db.coverPhotos && db.coverPhotos.length > 0 ? db.coverPhotos : [];

  // Gentle auto rotation
  useEffect(() => {
    if (heroPhotos.length <= 1) return;
    const timer = setInterval(() => {
      setActivePhotoIndex((prev) => (prev + 1) % heroPhotos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroPhotos.length]);

  return (
    <section className="relative w-full bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100/80 text-center flex flex-col items-center overflow-hidden">
      {/* Subtle top ambient glow */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-32 bg-sky-100/50 rounded-full blur-2xl pointer-events-none" />

      {/* Walimah Mubarak tag */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-amber-400 text-xs">‹ ☆</span>
        <span className="text-xs font-semibold text-sky-800 bg-sky-100/70 px-4 py-1 rounded-full uppercase tracking-wider">
          Walimah Mubarak
        </span>
        <span className="text-amber-400 text-xs">☆ ›</span>
      </div>

      {/* Tasyakuran Badge */}
      <div className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 text-xs font-medium px-4 py-1.5 rounded-full border border-sky-100 mb-6 shadow-xs">
        <span>👶</span>
        <span>Tasyakuran Walimatul &apos;Aqiqah &amp; Khitan</span>
      </div>

      {/* Bismillah Arabic Calligraphy */}
      <div className="mb-2">
        <p className="font-amiri text-2xl sm:text-3xl text-sky-900 leading-relaxed font-bold tracking-wide">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
      </div>

      {/* Salam */}
      <p className="text-xs sm:text-sm text-slate-600 font-medium mb-6">
        {db.baby.greetingText || "Assalamu'alaikum Warahmatullahi Wabarakatuh"}
      </p>

      {/* Baby Portrait Container */}
      {heroPhotos.length > 0 && (
        <div className="relative mb-4 w-full flex flex-col items-center">
          <div className="relative w-56 h-68 sm:w-64 sm:h-76 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-50 relative z-10 transition-transform duration-500 hover:scale-[1.02] group">
            {heroPhotos.map((photo, index) => (
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

            {/* Quick Nav Arrows */}
            {heroPhotos.length > 1 && (
              <>
                <button
                  onClick={() => setActivePhotoIndex((prev) => (prev === 0 ? heroPhotos.length - 1 : prev - 1))}
                  aria-label="Foto Sebelumnya"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 hover:opacity-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActivePhotoIndex((prev) => (prev + 1) % heroPhotos.length)}
                  aria-label="Foto Selanjutnya"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-all opacity-80 hover:opacity-100"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Photo Counter Pill in corner */}
                <div className="absolute bottom-3 right-3 bg-black/55 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
                  <span>{activePhotoIndex + 1} / {heroPhotos.length} Foto</span>
                </div>
              </>
            )}
          </div>

          {/* Floating Heart Badge (Top-Left) */}
          <div className="absolute -top-3 left-8 sm:left-14 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-sky-100 z-20 animate-pulse">
            <Heart className="w-5 h-5 text-sky-600 fill-sky-500" />
          </div>

          {/* Floating Star Badge (Bottom-Right) */}
          <div className="absolute bottom-7 right-8 sm:right-14 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-amber-100 z-20">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
          </div>

          {/* Photo Selector Buttons */}
          {heroPhotos.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-3 z-20">
              {heroPhotos.map((item, idx) => (
                <button
                  key={item.id || idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activePhotoIndex === idx
                      ? 'bg-sky-700 text-white shadow-sm scale-102'
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

      {/* Child Full Name */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#0f4c81] tracking-tight mb-2 mt-2">
        {db.baby.fullName}
      </h2>

      {/* Parents */}
      <p className="text-xs sm:text-sm text-slate-500 mb-1">Putra tercinta dari</p>
      <p className="text-sm sm:text-base font-semibold text-slate-800">
        {db.baby.fatherName}
      </p>
      <p className="text-xs text-slate-400 my-0.5">&amp;</p>
      <p className="text-sm sm:text-base font-semibold text-slate-800 mb-6">
        {db.baby.motherName}
      </p>

      {/* Prayer Card */}
      {db.baby.prayerQuote && (
        <div className="w-full bg-[#f3f4fd] rounded-2xl p-4 sm:p-5 border border-indigo-50/60 shadow-xs text-slate-600">
          <p className="text-xs sm:text-sm italic leading-relaxed font-sans text-slate-700">
            &ldquo;{db.baby.prayerQuote}&rdquo;
          </p>
        </div>
      )}
    </section>
  );
};
