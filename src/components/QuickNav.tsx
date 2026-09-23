import React from 'react';
import { User, Calendar, MessageSquare, Gift, Share2 } from 'lucide-react';

interface QuickNavProps {
  onNavClick: (sectionId: string) => void;
}

export const QuickNav: React.FC<QuickNavProps> = ({ onNavClick }) => {
  const navItems = [
    { id: 'section-profile', label: 'Profil', icon: User },
    { id: 'section-event', label: 'Acara', icon: Calendar },
    { id: 'section-rsvp', label: 'Doa', icon: MessageSquare },
    { id: 'section-gift', label: 'Kado', icon: Gift },
    { id: 'section-share', label: 'Bagi', icon: Share2 },
  ];

  return (
    <nav aria-label="Navigasi Undangan" className="sticky top-3 z-40 w-full max-w-md mx-auto px-4 mb-3">
      <div className="bg-white/85 backdrop-blur-md rounded-2xl shadow-lg border border-sky-100/80 p-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-slate-600 hover:text-sky-700 hover:bg-sky-50 transition-all active:scale-95"
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
