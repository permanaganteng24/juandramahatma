import React from 'react';
import { Heart, ArrowUp, Mail } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

interface ClosingSectionProps {
  onReopenCover: () => void;
}

export const ClosingSection: React.FC<ClosingSectionProps> = ({ onReopenCover }) => {
  const { db } = useAppData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100/80 text-center flex flex-col items-center">
      {/* Heart Badge */}
      <div className="w-12 h-12 rounded-full bg-indigo-50/80 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100 shadow-xs">
        <Heart className="w-6 h-6 text-[#0f4c81]" />
      </div>

      {/* Heading */}
      <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 font-serif">
        Ungkapan Syukur
      </h3>

      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mb-6">
        Kehadiran serta untaian doa restu Bapak/Ibu/Saudara/i sekalian merupakan suatu kehormatan dan kebahagiaan yang tak terhingga bagi kami sekeluarga.
      </p>

      {/* Islamic closing */}
      <div className="mb-6 p-4 bg-[#f8f9fe] rounded-2xl border border-indigo-50 w-full max-w-xs">
        <p className="font-amiri text-lg text-sky-950 font-bold mb-1">
          جَزَاكُمُ اللهُ خَيْرًا كَثِيرًا
        </p>
        <p className="text-xs font-semibold text-slate-700">
          Jazakumullahu Khairan Katsiran
        </p>
        <p className="text-[11px] text-slate-500 mt-1">
          Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh
        </p>
      </div>

      {/* Family signature */}
      <div className="text-xs text-slate-500 mb-8">
        <p className="mb-1">Kami yang berbahagia,</p>
        <p className="font-bold text-sm text-slate-800">
          {db.baby.fatherName} &amp; {db.baby.motherName}
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Beserta Segenap Keluarga Besar
        </p>
      </div>

      {/* Bottom utility controls */}
      <div className="w-full pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
        <button
          onClick={onReopenCover}
          className="flex items-center gap-1.5 text-slate-500 hover:text-sky-700 font-medium transition-colors cursor-pointer"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Lihat Sampul Depan</span>
        </button>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 text-sky-700 hover:text-sky-800 font-semibold transition-colors cursor-pointer"
        >
          <span>Kembali ke Atas</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
