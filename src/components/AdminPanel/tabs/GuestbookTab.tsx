import React, { useState } from 'react';
import { useAppData } from '../../../context/AppDataContext';
import { MessageSquare, Trash2, Pin, CheckCircle2, HelpCircle, XCircle, Search, Plus } from 'lucide-react';

export const GuestbookTab: React.FC = () => {
  const { db, deleteWish, togglePinWish, addWish } = useAppData();

  const [filter, setFilter] = useState<'all' | 'hadir' | 'insya_allah' | 'tidak_hadir'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualAttendance, setManualAttendance] = useState<'hadir' | 'insya_allah' | 'tidak_hadir'>('hadir');
  const [manualMessage, setManualMessage] = useState('');

  // Stats calculation
  const totalWishes = db.wishes.length;
  const hadirCount = db.wishes.filter((w) => w.attendance === 'hadir').length;
  const insyaAllahCount = db.wishes.filter((w) => w.attendance === 'insya_allah').length;
  const tidakHadirCount = db.wishes.filter((w) => w.attendance === 'tidak_hadir').length;

  const filteredWishes = db.wishes.filter((item) => {
    const matchesFilter = filter === 'all' || item.attendance === filter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualMessage.trim()) return;

    addWish({
      name: manualName.trim(),
      attendance: manualAttendance,
      message: manualMessage.trim(),
    });

    setManualName('');
    setManualMessage('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-5">
      {/* 1. Statistics Cards */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
          <p className="text-[10px] text-slate-500 uppercase font-semibold">Total</p>
          <p className="text-base font-bold text-slate-800">{totalWishes}</p>
        </div>
        <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-center">
          <p className="text-[10px] text-emerald-700 uppercase font-semibold">Hadir</p>
          <p className="text-base font-bold text-emerald-700">{hadirCount}</p>
        </div>
        <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-center">
          <p className="text-[10px] text-amber-700 uppercase font-semibold">Ragu</p>
          <p className="text-base font-bold text-amber-700">{insyaAllahCount}</p>
        </div>
        <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 text-center">
          <p className="text-[10px] text-slate-500 uppercase font-semibold">Batal</p>
          <p className="text-base font-bold text-slate-600">{tidakHadirCount}</p>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama atau isi ucapan..."
            className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
              filter === 'all' ? 'bg-sky-700 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Semua ({totalWishes})
          </button>
          <button
            onClick={() => setFilter('hadir')}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
              filter === 'hadir' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Hadir
          </button>
          <button
            onClick={() => setFilter('insya_allah')}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
              filter === 'insya_allah' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Insya Allah
          </button>
        </div>
      </div>

      {/* 3. Button to add manual wish */}
      <div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Tutup Form Tambah Ucapan' : 'Tambah Ucapan Manual untuk Tamu'}</span>
        </button>

        {showAddForm && (
          <form onSubmit={handleManualAdd} className="mt-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="Nama Tamu"
                className="text-xs p-2 rounded-lg border border-slate-200 bg-white"
                required
              />
              <select
                value={manualAttendance}
                onChange={(e) => setManualAttendance(e.target.value as any)}
                className="text-xs p-2 rounded-lg border border-slate-200 bg-white"
              >
                <option value="hadir">Hadir</option>
                <option value="insya_allah">Insya Allah Hadir</option>
                <option value="tidak_hadir">Tidak Hadir</option>
              </select>
            </div>
            <textarea
              rows={2}
              value={manualMessage}
              onChange={(e) => setManualMessage(e.target.value)}
              placeholder="Tuliskan doa / ucapan..."
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-lg"
            >
              Simpan Ucapan
            </button>
          </form>
        )}
      </div>

      {/* 4. List of Wishes */}
      <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
        {filteredWishes.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            Tidak ada ucapan yang sesuai filter
          </div>
        ) : (
          filteredWishes.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border transition-all ${
                item.isPinned
                  ? 'bg-amber-50/70 border-amber-200 shadow-2xs'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-xs text-slate-800">{item.name}</span>
                    {item.isPinned && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                        <Pin className="w-2.5 h-2.5" /> Tersemat
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        item.attendance === 'hadir'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.attendance === 'insya_allah'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.attendance === 'hadir' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Hadir
                        </>
                      ) : item.attendance === 'insya_allah' ? (
                        <>
                          <HelpCircle className="w-3 h-3" /> Insya Allah
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Berhalangan
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.timestamp}</p>
                </div>

                {/* Pin & Delete buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => togglePinWish(item.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      item.isPinned ? 'text-amber-600 bg-amber-100' : 'text-slate-400 hover:text-amber-600'
                    }`}
                    title={item.isPinned ? 'Lepas Sematan' : 'Sematkan ke Atas'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus ucapan dari "${item.name}"?`)) {
                        deleteWish(item.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                    title="Hapus Ucapan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
