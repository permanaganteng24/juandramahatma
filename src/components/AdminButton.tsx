import React from 'react';
import { Lock } from 'lucide-react';

interface AdminButtonProps {
  onClick: () => void;
}

export const AdminButton: React.FC<AdminButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 hover:text-slate-800 text-[11px] font-medium transition-all cursor-pointer"
      title="Kelola Undangan (Admin Panel)"
    >
      <Lock className="w-3 h-3 text-slate-500" />
      <span>Panel Admin</span>
    </button>
  );
};
