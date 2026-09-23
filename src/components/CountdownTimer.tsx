import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const CountdownTimer: React.FC = () => {
  const { db } = useAppData();

  const targetIso = db.event.targetIsoDate || '2026-09-27T09:00:00+08:00';
  const targetDate = new Date(targetIso).getTime();

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isPast: false };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="w-full bg-gradient-to-r from-sky-900 via-[#0f4c81] to-blue-900 rounded-3xl p-5 sm:p-6 text-white shadow-lg text-center relative overflow-hidden">
      {/* Background soft circles */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-400/10 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center justify-center gap-1.5 text-xs text-sky-200 mb-3 uppercase tracking-wider font-semibold">
        <Clock className="w-3.5 h-3.5" />
        <span>Menghitung Hari Bahagia</span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/15">
          <span className="block text-xl sm:text-2xl font-bold font-serif text-amber-300">
            {String(timeLeft.days).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs text-sky-100 uppercase tracking-wider">Hari</span>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/15">
          <span className="block text-xl sm:text-2xl font-bold font-serif text-amber-300">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs text-sky-100 uppercase tracking-wider">Jam</span>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/15">
          <span className="block text-xl sm:text-2xl font-bold font-serif text-amber-300">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs text-sky-100 uppercase tracking-wider">Menit</span>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/15">
          <span className="block text-xl sm:text-2xl font-bold font-serif text-amber-300">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs text-sky-100 uppercase tracking-wider">Detik</span>
        </div>
      </div>

      {timeLeft.isPast && (
        <p className="mt-3 text-xs text-emerald-300 font-semibold">
          Acara sedang berlangsung atau telah terlaksana. Alhamdulillah.
        </p>
      )}
    </div>
  );
};
