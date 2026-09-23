import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

export const MeaningAndHadith: React.FC = () => {
  const { db } = useAppData();
  const meaningParts = db.baby.meaningParts || [];

  return (
    <section className="w-full bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-100/80 flex flex-col gap-6">
      {/* Hadits Box */}
      <div className="bg-gradient-to-br from-amber-50/70 via-sky-50/40 to-blue-50/60 rounded-2xl p-5 border border-amber-100/60 text-center">
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 mb-3">
          <BookOpen className="w-4 h-4" />
        </div>
        <p className="font-amiri text-lg sm:text-xl text-slate-800 leading-loose mb-3 font-semibold">
          كُلُّ غُلاَمٍ رَهِينَةٌ بِعَقِيقَتِهِ تُذْبَحُ عَنْهُ يَوْمَ سَابِعِهِ وَيُحْلَقُ وَيُسَمَّى
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic mb-2">
          &ldquo;Setiap anak tergadai dengan aqiqahnya, disembelihkan untuknya pada hari ketujuh, dicukur rambutnya, dan diberi nama.&rdquo;
        </p>
        <p className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
          (HR. Abu Dawud, At-Tirmidzi, dan An-Nasa&apos;i)
        </p>
      </div>

      {/* Meaning of Name */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-sky-100 text-sky-700 rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Untaian Doa di Balik Nama</h3>
            <p className="text-[11px] text-slate-500">Doa dan harapan terbaik kedua orang tua</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {meaningParts.map((part, idx) => (
            <div key={part.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-sky-500/10 text-sky-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <div>
                <p className="text-xs font-bold text-sky-900">{part.title}</p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {part.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
