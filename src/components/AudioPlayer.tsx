import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { bgMusicPlayer } from '../utils/audio';

export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = bgMusicPlayer.subscribe((playing) => {
      setIsPlaying(playing);
    });
    setIsPlaying(bgMusicPlayer.getPlaying());
    return () => unsubscribe();
  }, []);

  const handleToggle = () => {
    bgMusicPlayer.toggle();
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2500);
  };

  return (
    <div className="fixed bottom-6 right-5 z-50 flex items-center gap-2">
      {showTooltip && (
        <div className="bg-slate-900/90 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full shadow-lg transition-all animate-fade-in border border-white/10">
          {isPlaying ? 'Musik dinyalakan' : 'Musik dijeda'}
        </div>
      )}

      <button
        onClick={handleToggle}
        aria-label={isPlaying ? 'Mute background music' : 'Play background music'}
        className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-xl border-2 transition-all duration-300 transform active:scale-95 ${
          isPlaying
            ? 'bg-white text-sky-700 border-sky-200 ring-4 ring-sky-100'
            : 'bg-slate-800 text-white border-slate-600'
        }`}
        title={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
      >
        {isPlaying ? (
          <div className="relative flex items-center justify-center">
            {/* Rotating music disc icon */}
            <div className="animate-spin-slow">
              <Music className="w-5 h-5 text-sky-600" />
            </div>
            {/* Audio wave ping */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </span>
          </div>
        ) : (
          <VolumeX className="w-5 h-5 text-slate-300" />
        )}
      </button>
    </div>
  );
};
