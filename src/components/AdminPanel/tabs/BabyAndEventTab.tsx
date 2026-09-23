import React, { useState } from 'react';
import { useAppData } from '../../../context/AppDataContext';
import { Save, Check, Baby, Calendar, MapPin } from 'lucide-react';

export const BabyAndEventTab: React.FC = () => {
  const { db, updateBaby, updateEvent } = useAppData();

  const [babyForm, setBabyForm] = useState({ ...db.baby });
  const [eventForm, setEventForm] = useState({ ...db.event });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBaby(babyForm);
    updateEvent(eventForm);
    setStatusMessage('Data Ananda dan Jadwal Acara berhasil disimpan!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* 1. Informasi Ananda & Orang Tua */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <Baby className="w-4 h-4 text-sky-600" />
          <span>Informasi Ananda &amp; Orang Tua</span>
        </h4>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Nama Lengkap Ananda:
          </label>
          <input
            type="text"
            value={babyForm.fullName}
            onChange={(e) => setBabyForm({ ...babyForm, fullName: e.target.value })}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-semibold text-slate-800"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Nama Ayah:
            </label>
            <input
              type="text"
              value={babyForm.fatherName}
              onChange={(e) => setBabyForm({ ...babyForm, fatherName: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Nama Ibu:
            </label>
            <input
              type="text"
              value={babyForm.motherName}
              onChange={(e) => setBabyForm({ ...babyForm, motherName: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Untaian Doa / Harapan Orang Tua:
          </label>
          <textarea
            rows={2}
            value={babyForm.prayerQuote}
            onChange={(e) => setBabyForm({ ...babyForm, prayerQuote: e.target.value })}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* 2. Jadwal & Lokasi Acara */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-sky-600" />
          <span>Waktu &amp; Tempat Acara</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Hari &amp; Tanggal:
            </label>
            <input
              type="text"
              value={eventForm.dateFormatted}
              onChange={(e) => setEventForm({ ...eventForm, dateFormatted: e.target.value })}
              placeholder="Contoh: Minggu, 27 September 2026"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Waktu Acara:
            </label>
            <input
              type="text"
              value={eventForm.timeFormatted}
              onChange={(e) => setEventForm({ ...eventForm, timeFormatted: e.target.value })}
              placeholder="Contoh: Pukul 09.00 WITA s/d Selesai"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Nama Tempat / Lokasi:
          </label>
          <input
            type="text"
            value={eventForm.locationName}
            onChange={(e) => setEventForm({ ...eventForm, locationName: e.target.value })}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Alamat Lengkap:
          </label>
          <textarea
            rows={2}
            value={eventForm.locationAddress}
            onChange={(e) => setEventForm({ ...eventForm, locationAddress: e.target.value })}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Link Google Maps (Opsional / Custom):
          </label>
          <input
            type="url"
            value={eventForm.googleMapsUrl}
            onChange={(e) => setEventForm({ ...eventForm, googleMapsUrl: e.target.value })}
            placeholder="https://maps.google.com/..."
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
            required
          />
          <p className="text-[10px] text-slate-400 mt-1">
            * Tombol di undangan otomatis mengarahkan rute navigasi (turn-by-turn) langsung ke Alamat Lengkap acara.
          </p>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition-all"
      >
        <Save className="w-4 h-4" />
        <span>Simpan Perubahan Informasi</span>
      </button>
    </form>
  );
};
