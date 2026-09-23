import React, { useState } from 'react';
import { Camera, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

export const PhotoGallery: React.FC = () => {
  const { db } = useAppData();
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);

  const photos = db.galleryPhotos || [];

  if (photos.length === 0) return null;

  return (
    <section className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100/80 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-sky-100/80 text-sky-700 flex items-center justify-center shrink-0">
            <Camera className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              Galeri Momen Berharga
            </h3>
            <p className="text-xs text-slate-500">
              Potret kebahagiaan ananda {db.baby.fullName.split(' ')[1] || 'Juandra'}
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
          {photos.length} Foto
        </span>
      </div>

      {/* Grid of Photos */}
      <div className="grid grid-cols-2 gap-3">
        {photos.map((item, idx) => (
          <div
            key={item.id || idx}
            onClick={() => setActivePhotoIdx(idx)}
            className="group relative aspect-4/5 rounded-2xl overflow-hidden cursor-pointer bg-slate-100 border border-slate-200 shadow-xs transition-transform duration-300 hover:scale-[1.02]"
          >
            <img
              src={item.src}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white">
              <p className="text-xs font-bold leading-tight line-clamp-1">{item.title}</p>
              <p className="text-[10px] text-white/80 line-clamp-1 mt-0.5">{item.caption}</p>
            </div>
            <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhotoIdx !== null && photos[activePhotoIdx] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in"
          onClick={() => setActivePhotoIdx(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setActivePhotoIdx(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev / Next buttons */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIdx((prev) =>
                    prev === 0 ? photos.length - 1 : (prev ?? 0) - 1
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
                aria-label="Sebelumnya"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIdx((prev) =>
                    prev === photos.length - 1 ? 0 : (prev ?? 0) + 1
                  );
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
                aria-label="Selanjutnya"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Active Image */}
          <div
            className="max-w-lg max-h-[75vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[activePhotoIdx].src}
              alt={photos[activePhotoIdx].title}
              referrerPolicy="no-referrer"
              className="max-h-[65vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border-2 border-white/20"
            />
            <div className="mt-4 text-center text-white">
              <h4 className="text-base font-bold">
                {photos[activePhotoIdx].title}
              </h4>
              <p className="text-xs text-white/80 mt-1 max-w-md">
                {photos[activePhotoIdx].caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
