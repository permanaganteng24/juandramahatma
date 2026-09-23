import React, { useState } from 'react';
import { Calendar, Navigation, MapPin, Check, ExternalLink, Compass, Route } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';

export const EventScheduleSection: React.FC = () => {
  const { db } = useAppData();
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);
  const [showCalendarOptions, setShowCalendarOptions] = useState<boolean>(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(db.event.locationAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  // Construct safe Google Maps embed query
  const fullAddressQuery = `${db.event.locationAddress}`;
  const mapSearchQuery = encodeURIComponent(
    fullAddressQuery
  );
  const embedMapUrl = `https://maps.google.com/maps?q=${mapSearchQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  
  // Directions URL for direct turn-by-turn route to the exact address
  // If user provided a custom route URL, use it; otherwise automatically generate Google Maps Directions URL
  const directionsUrl = db.event.googleMapsUrl && db.event.googleMapsUrl.includes('/maps/dir/')
    ? db.event.googleMapsUrl
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(db.event.locationAddress)}`;

  return (
    <section className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100/80 flex flex-col gap-5">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-sky-100/80 text-sky-700 flex items-center justify-center shrink-0">
          <Calendar className="w-5 h-5 text-sky-600" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            Waktu &amp; Tempat Acara
          </h3>
          <p className="text-xs text-slate-500">
            Catat jadwal &amp; petunjuk rute momentum berkah ini
          </p>
        </div>
      </div>

      {/* Date & Time 2-Column Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Hari & Tanggal */}
        <div className="bg-[#f5f6fe] rounded-2xl p-4 sm:p-5 border border-indigo-50/70 flex flex-col justify-between">
          <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1">
            HARI &amp; TANGGAL
          </p>
          <div>
            <p className="text-sm sm:text-base font-bold text-[#0f4c81]">
              {db.event.dateFormatted.split(',')[0] || db.event.dateFormatted}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">
              {db.event.dateFormatted.split(',')[1]?.trim() || ''}
            </p>
          </div>
        </div>

        {/* Waktu */}
        <div className="bg-[#f5f6fe] rounded-2xl p-4 sm:p-5 border border-indigo-50/70 flex flex-col justify-between">
          <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1">
            WAKTU ACARA
          </p>
          <div>
            <p className="text-sm sm:text-base font-bold text-[#0f4c81]">
              {db.event.timeFormatted}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Waktu Indonesia Tengah
            </p>
          </div>
        </div>
      </div>

      {/* Lokasi Card */}
      <div className="bg-[#f5f6fe] rounded-2xl p-4 sm:p-5 border border-indigo-50/70 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-sky-200/60 text-sky-800 flex items-center justify-center shrink-0 mt-0.5">
          <MapPin className="w-4 h-4 text-sky-700" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-0.5">
            LOKASI KEDIAMAN
          </p>
          <p className="text-sm sm:text-base font-bold text-[#0f4c81] mb-1">
            {db.event.locationName}
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            {db.event.locationAddress}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleCopyAddress}
              className="text-xs font-semibold text-sky-700 hover:text-sky-800 bg-white px-3 py-1.5 rounded-lg border border-sky-200 shadow-2xs flex items-center gap-1.5 transition-all active:scale-95"
            >
              {copiedAddress ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Alamat Tersalin</span>
                </>
              ) : (
                <>
                  <span>Salin Alamat</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Google Maps Interactive View Container */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 flex flex-col">
        {/* Map Header / Status Bar */}
        <div className="bg-slate-100/90 px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-sky-600" />
            <span>Peta Lokasi Interaktif</span>
          </span>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium text-sky-700 hover:text-sky-900 flex items-center gap-1"
          >
            <span>Buka Rute Lengkap</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Embedded Google Maps iFrame */}
        <div className="w-full h-56 sm:h-64 relative bg-slate-100">
          <iframe
            title="Peta Lokasi Acara Tasyakuran"
            src={embedMapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full filter contrast-[1.02]"
          />
        </div>

        {/* Quick Map Action Footer */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
          <span className="text-[11px] text-slate-500 truncate">
            {db.event.locationName}
          </span>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0f4c81] font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Route className="w-3.5 h-3.5 text-sky-600" />
            <span>Petunjuk Rute</span>
          </a>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col gap-2.5">
        {/* Buka Rute Google Maps */}
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 rounded-2xl bg-[#0f4c81] hover:bg-[#0c3c66] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-950/20 transition-all transform active:scale-98"
        >
          <Navigation className="w-4 h-4" />
          <span>Buka Petunjuk Rute ke Lokasi</span>
        </a>

        {/* Simpan Tanggal */}
        <div className="relative">
          <button
            onClick={() => setShowCalendarOptions(!showCalendarOptions)}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#ebf3fc] hover:bg-[#deecfa] text-[#0f4c81] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-98 border border-sky-200/50"
          >
            <Calendar className="w-4 h-4 text-sky-700" />
            <span>Simpan Tanggal ke Kalender</span>
          </button>

          {showCalendarOptions && (
            <div className="absolute left-0 right-0 top-full mt-2 p-3 bg-white rounded-2xl shadow-xl border border-sky-100 z-30 flex flex-col gap-2 animate-fade-in">
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-sky-50 text-xs font-semibold text-sky-900 flex items-center gap-2 transition-colors"
                onClick={() => setShowCalendarOptions(false)}
              >
                <span>📅 Google Calendar (HP Android &amp; PC)</span>
              </a>
              <button
                onClick={() => {
                  downloadIcsFile();
                  setShowCalendarOptions(false);
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-sky-50 text-xs font-semibold text-sky-900 flex items-center gap-2 transition-colors"
              >
                <span>🍏 Apple / Outlook (.ics file)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
