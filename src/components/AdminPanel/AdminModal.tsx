import React, { useState, useEffect } from 'react';
import { useAppData } from '../../context/AppDataContext';
import {
  X,
  Lock,
  Image as ImageIcon,
  Baby,
  CreditCard,
  MessageSquare,
  Link2,
  Database,
  LogOut,
  AlertCircle,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { PhotosTab } from './tabs/PhotosTab';
import { BabyAndEventTab } from './tabs/BabyAndEventTab';
import { DanaTab } from './tabs/DanaTab';
import { GuestbookTab } from './tabs/GuestbookTab';
import { InvitationLinkTab } from './tabs/InvitationLinkTab';
import { VercelDatabaseTab } from './tabs/VercelDatabaseTab';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'photos' | 'baby' | 'dana' | 'guestbook' | 'invitations' | 'database';

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const { db } = useAppData();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('photos');

  // Check if session has authenticated before during this page load
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('admin_authenticated');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === db.adminPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setPinError(null);
      setPinInput('');
    } else {
      setPinError('PIN salah! Silakan coba lagi.');
      setPinInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    setPinInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Modal Top Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Panel Admin Undangan</h3>
              <p className="text-[11px] text-slate-400">
                Kelola Foto, Teks &amp; Database Vercel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Keluar Admin"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        {!isAuthenticated ? (
          /* PIN Lockscreen */
          <div className="p-6 sm:p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 shadow-inner">
              <Lock className="w-7 h-7 text-sky-600" />
            </div>

            <h4 className="text-base font-bold text-slate-800 mb-1">
              Masukkan PIN Admin
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mb-5">
              Halaman ini dikhususkan untuk sohibul hajat dalam mengelola foto, teks acara, dan data undangan.
            </p>

            <form onSubmit={handlePinSubmit} className="w-full max-w-xs space-y-3">
              {pinError && (
                <div className="p-2.5 bg-red-50 text-red-700 text-xs font-medium rounded-xl flex items-center gap-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{pinError}</span>
                </div>
              )}

              <div className="relative">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Masukkan 4 Digit PIN"
                  maxLength={8}
                  autoFocus
                  className="w-full text-center tracking-widest text-lg font-mono font-bold py-3 px-4 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 bg-slate-50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all active:scale-98"
              >
                Masuk ke Panel Admin
              </button>

              <div className="pt-2">
                <p className="text-[11px] text-slate-400">
                  Akses rahasia khusus sohibul hajat &amp; keluarga.
                </p>
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto shrink-0 scrollbar-none">
              <button
                onClick={() => setActiveTab('photos')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'photos'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Foto &amp; Sampul</span>
              </button>

              <button
                onClick={() => setActiveTab('baby')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'baby'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                <Baby className="w-3.5 h-3.5" />
                <span>Data Acara</span>
              </button>

              <button
                onClick={() => setActiveTab('dana')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'dana'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>DANA</span>
              </button>

              <button
                onClick={() => setActiveTab('guestbook')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'guestbook'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Buku Tamu</span>
              </button>

              <button
                onClick={() => setActiveTab('invitations')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'invitations'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Link Tamu</span>
              </button>

              <button
                onClick={() => setActiveTab('database')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'database'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Vercel DB</span>
              </button>
            </div>

            {/* Scrollable Tab Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {activeTab === 'photos' && <PhotosTab />}
              {activeTab === 'baby' && <BabyAndEventTab />}
              {activeTab === 'dana' && <DanaTab />}
              {activeTab === 'guestbook' && <GuestbookTab />}
              {activeTab === 'invitations' && <InvitationLinkTab />}
              {activeTab === 'database' && <VercelDatabaseTab />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
