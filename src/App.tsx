/**
 * Undangan Tasyakuran Walimatul 'Aqiqah & Khitan
 * Muhamad Juandra Mahatma
 */

import React, { useState, useEffect } from 'react';
import { CoverEnvelope } from './components/CoverEnvelope';
import { HeroSection } from './components/HeroSection';
import { MeaningAndHadith } from './components/MeaningAndHadith';
import { CountdownTimer } from './components/CountdownTimer';
import { EventScheduleSection } from './components/EventScheduleSection';
import { PhotoGallery } from './components/PhotoGallery';
import { RsvpAndGuestbook } from './components/RsvpAndGuestbook';
import { DigitalEnvelope } from './components/DigitalEnvelope';
import { ShareLinkGenerator } from './components/ShareLinkGenerator';
import { ClosingSection } from './components/ClosingSection';
import { AudioPlayer } from './components/AudioPlayer';
import { QuickNav } from './components/QuickNav';
import { AdminModal } from './components/AdminPanel/AdminModal';
import { AdminButton } from './components/AdminButton';
import { AppDataProvider, useAppData } from './context/AppDataContext';
import { Sparkles, Settings } from 'lucide-react';

function AppContent() {
  const { db } = useAppData();
  const [isCoverOpen, setIsCoverOpen] = useState<boolean>(false);
  const [guestName, setGuestName] = useState<string>('Tamu Undangan');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  useEffect(() => {
    // Read ?to= parameter from URL
    const searchParams = new URLSearchParams(window.location.search);
    const toParam = searchParams.get('to');
    if (toParam && toParam.trim()) {
      setGuestName(toParam.trim());
    }

    // Check ?admin=true or hash #admin
    if (searchParams.get('admin') === 'true' || window.location.hash === '#admin') {
      setIsAdminOpen(true);
    }
  }, []);

  const handleNavClick = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f9] text-slate-800 font-sans relative selection:bg-sky-500 selection:text-white pb-24">
      {/* Decorative ambient gradients */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-gradient-to-b from-sky-100/60 to-transparent pointer-events-none" />

      {/* Floating Audio Player */}
      {isCoverOpen && <AudioPlayer />}

      {/* Floating Admin Trigger (Subtle bottom-left button) */}
      <button
        onClick={() => setIsAdminOpen(true)}
        className="fixed bottom-4 left-4 z-40 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-sky-700 shadow-md border border-slate-200 backdrop-blur-xs flex items-center justify-center transition-all opacity-70 hover:opacity-100 cursor-pointer"
        title="Buka Panel Admin"
        aria-label="Panel Admin"
      >
        <Settings className="w-4 h-4" />
      </button>

      {/* Admin Panel Modal */}
      <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

      {/* Opening Cover Envelope */}
      <CoverEnvelope
        isOpen={isCoverOpen}
        guestName={guestName}
        onOpen={() => setIsCoverOpen(true)}
      />

      {/* Main Invitation Container (Centered Mobile-First Max-W-MD) */}
      <main className="max-w-md mx-auto px-3.5 pt-4 pb-12 flex flex-col gap-5">
        {/* Sticky Quick Nav */}
        <QuickNav onNavClick={handleNavClick} />

        {/* Personalized Guest Badge */}
        {guestName && guestName !== 'Tamu Undangan' && (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-xs border border-sky-100 text-center flex items-center justify-center gap-2 text-xs text-slate-600 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>
              Selamat datang,{' '}
              <strong className="text-sky-900 font-semibold">{guestName}</strong>
            </span>
          </div>
        )}

        {/* Section 1: Hero & Identity */}
        <div id="section-profile">
          <HeroSection />
        </div>

        {/* Section 2: Makna Nama & Dalil Hadits */}
        <MeaningAndHadith />

        {/* Section 3: Hitung Mundur */}
        <CountdownTimer />

        {/* Section 4: Jadwal & Lokasi Acara */}
        <div id="section-event">
          <EventScheduleSection />
        </div>

        {/* Section 5: Galeri Foto */}
        <PhotoGallery />

        {/* Section 6: Konfirmasi Kehadiran & Doa Restu (RSVP) */}
        <div id="section-rsvp">
          <RsvpAndGuestbook initialGuestName={guestName !== 'Tamu Undangan' ? guestName : ''} />
        </div>

        {/* Section 7: Tali Kasih & Kado Digital */}
        <div id="section-gift">
          <DigitalEnvelope />
        </div>

        {/* Section 8: Bagikan Undangan Personal ke Kerabat */}
        <div id="section-share">
          <ShareLinkGenerator />
        </div>

        {/* Section 9: Ungkapan Syukur & Penutup */}
        <ClosingSection onReopenCover={() => setIsCoverOpen(false)} />

        {/* Bottom copyright watermark & Admin access button */}
        <footer className="text-center text-[11px] text-slate-400 pt-2 pb-6 space-y-2">
          <div>
            <p>Tasyakuran Walimatul &apos;Aqiqah &amp; Khitan</p>
            <p className="font-semibold text-slate-500 mt-0.5">{db.baby.fullName}</p>
          </div>
          <div className="pt-1">
            <AdminButton onClick={() => setIsAdminOpen(true)} />
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppDataProvider>
      <AppContent />
    </AppDataProvider>
  );
}
