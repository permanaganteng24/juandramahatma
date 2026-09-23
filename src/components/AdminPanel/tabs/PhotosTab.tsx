import React, { useState } from 'react';
import { useAppData } from '../../../context/AppDataContext';
import {
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  Star,
  Edit2,
  X,
  Save,
  ArrowUp,
  ArrowDown,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import type { CoverPhotoItem, GalleryPhotoItem } from '../../../types/database';

export const PhotosTab: React.FC = () => {
  const {
    db,
    updateCoverPhotos,
    updateGalleryPhotos,
    addGalleryPhoto,
    updateGalleryPhoto,
    deleteGalleryPhoto,
  } = useAppData();

  // Create & Upload form state
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoTarget, setNewPhotoTarget] = useState<'gallery' | 'cover1' | 'cover2'>('gallery');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Edit modal / inline edit state for gallery item
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editSrc, setEditSrc] = useState('');

  // Edit Cover Photos
  const [editingCoverIdx, setEditingCoverIdx] = useState<number | null>(null);
  const [editCoverLabel, setEditCoverLabel] = useState('');
  const [editCoverSrc, setEditCoverSrc] = useState('');

  // Helper to compress and convert file to data URL
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setStatusMessage('Memproses foto...');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          onSuccess(compressedDataUrl);
          setStatusMessage('Foto berhasil dimuat dari perangkat.');
        }
        setIsProcessing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Form submit for new photo
  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;

    if (newPhotoTarget === 'cover1') {
      const updated: CoverPhotoItem[] = [
        {
          id: 'cover-1',
          src: newPhotoUrl.trim(),
          label: newPhotoTitle || 'Foto Sampul 1',
          alt: 'Foto Sampul 1 Ananda Juandra',
        },
        db.coverPhotos[1] || {
          id: 'cover-2',
          src: newPhotoUrl.trim(),
          label: 'Foto Sampul 2',
          alt: 'Foto Sampul 2 Ananda Juandra',
        },
      ];
      updateCoverPhotos(updated);
      setStatusMessage('Foto Sampul 1 berhasil diperbarui!');
    } else if (newPhotoTarget === 'cover2') {
      const updated: CoverPhotoItem[] = [
        db.coverPhotos[0] || {
          id: 'cover-1',
          src: newPhotoUrl.trim(),
          label: 'Foto Sampul 1',
          alt: 'Foto Sampul 1 Ananda Juandra',
        },
        {
          id: 'cover-2',
          src: newPhotoUrl.trim(),
          label: newPhotoTitle || 'Foto Sampul 2',
          alt: 'Foto Sampul 2 Ananda Juandra',
        },
      ];
      updateCoverPhotos(updated);
      setStatusMessage('Foto Sampul 2 berhasil diperbarui!');
    } else {
      addGalleryPhoto({
        src: newPhotoUrl.trim(),
        title: newPhotoTitle.trim() || 'Potret Ananda Juandra',
        caption: newPhotoCaption.trim() || 'Momen penuh kebahagiaan ananda Juandra',
      });
      setStatusMessage('Foto berhasil ditambahkan ke Galeri Juandra!');
    }

    // Reset fields
    setNewPhotoUrl('');
    setNewPhotoTitle('');
    setNewPhotoCaption('');
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Start editing gallery item
  const startEditGallery = (photo: GalleryPhotoItem) => {
    setEditingPhotoId(photo.id);
    setEditTitle(photo.title);
    setEditCaption(photo.caption);
    setEditSrc(photo.src);
  };

  // Save edited gallery item (CRUD - Update)
  const handleSaveEditGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhotoId) return;

    updateGalleryPhoto(editingPhotoId, {
      title: editTitle.trim(),
      caption: editCaption.trim(),
      src: editSrc.trim(),
    });

    setEditingPhotoId(null);
    setStatusMessage('Perubahan foto berhasil disimpan!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Delete gallery item (CRUD - Delete)
  const handleDeleteGallery = (photo: GalleryPhotoItem) => {
    if (window.confirm(`Hapus foto "${photo.title}" dari galeri?`)) {
      deleteGalleryPhoto(photo.id);
      setStatusMessage(`Foto "${photo.title}" berhasil dihapus.`);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  // Re-order photos up/down
  const movePhoto = (index: number, direction: 'up' | 'down') => {
    const list = [...db.galleryPhotos];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);
    updateGalleryPhotos(list);
  };

  // Set as Cover
  const setAsCover = (src: string, target: 'cover1' | 'cover2', label: string) => {
    if (target === 'cover1') {
      const updated: CoverPhotoItem[] = [
        { id: 'cover-1', src, label, alt: label },
        db.coverPhotos[1] || { id: 'cover-2', src, label: 'Foto 2', alt: 'Foto 2' },
      ];
      updateCoverPhotos(updated);
    } else {
      const updated: CoverPhotoItem[] = [
        db.coverPhotos[0] || { id: 'cover-1', src, label: 'Foto 1', alt: 'Foto 1' },
        { id: 'cover-2', src, label, alt: label },
      ];
      updateCoverPhotos(updated);
    }
    setStatusMessage(`Foto dijadikan ${target === 'cover1' ? 'Foto Sampul #1' : 'Foto Sampul #2'}`);
    setTimeout(() => setStatusMessage(null), 2500);
  };

  // Save Edit Cover
  const handleSaveEditCover = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCoverIdx === null) return;

    const list = [...db.coverPhotos];
    if (list[editingCoverIdx]) {
      list[editingCoverIdx] = {
        ...list[editingCoverIdx],
        src: editCoverSrc.trim(),
        label: editCoverLabel.trim(),
      };
      updateCoverPhotos(list);
      setEditingCoverIdx(null);
      setStatusMessage(`Foto Sampul #${editingCoverIdx + 1} berhasil diperbarui!`);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback status */}
      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-xl flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* 1. Cover Photos Active Overview */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Foto Sampul Aktif (Peci Putih &amp; Peci Hitam)</span>
          </h4>
          <span className="text-[11px] text-slate-500 font-medium">Cover &amp; Kartu Profil</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {db.coverPhotos.map((photo, idx) => (
            <div
              key={photo.id || idx}
              className="bg-white rounded-xl p-3 border border-slate-200 flex flex-col justify-between gap-2 shadow-2xs"
            >
              <div className="flex gap-3 items-center">
                <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <img
                    src={photo.src}
                    alt={photo.label}
                    className="w-full h-full object-cover object-center"
                  />
                  <span className="absolute top-1 left-1 bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    #{idx + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full inline-block mb-1">
                    {idx === 0 ? 'Sampul Utama (Peci Putih)' : 'Sampul Kedua (Peci Hitam)'}
                  </span>
                  <p className="text-xs font-bold text-slate-800 truncate">{photo.label}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{photo.alt}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCoverIdx(idx);
                    setEditCoverLabel(photo.label);
                    setEditCoverSrc(photo.src);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 flex items-center gap-1 transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Ganti / Edit Sampul</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal / Form Edit Cover Photo */}
      {editingCoverIdx !== null && (
        <form
          onSubmit={handleSaveEditCover}
          className="p-4 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-3 animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
              <Edit2 className="w-3.5 h-3.5 text-sky-600" />
              <span>Edit Foto Sampul #{editingCoverIdx + 1}</span>
            </h5>
            <button
              type="button"
              onClick={() => setEditingCoverIdx(null)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Upload Foto Baru:
              </label>
              <label className="flex items-center justify-center gap-2 p-2.5 border border-dashed border-sky-300 hover:border-sky-500 rounded-xl cursor-pointer bg-white text-xs text-sky-700 font-medium">
                <Upload className="w-4 h-4" />
                <span>Pilih Foto dari Galeri</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, (dataUrl) => setEditCoverSrc(dataUrl))}
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Atau Paste URL Gambar:
              </label>
              <input
                type="text"
                value={editCoverSrc}
                onChange={(e) => setEditCoverSrc(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Label / Keterangan Sampul:
            </label>
            <input
              type="text"
              value={editCoverLabel}
              onChange={(e) => setEditCoverLabel(e.target.value)}
              placeholder="Contoh: Peci Putih Berseri"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setEditingCoverIdx(null)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Sampul</span>
            </button>
          </div>
        </form>
      )}

      {/* 2. Form Tambah Foto Baru (CRUD - CREATE) */}
      <form
        onSubmit={handleSavePhoto}
        className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3.5 shadow-xs"
      >
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Plus className="w-4 h-4 text-sky-600" />
            <span>Tambah Foto Baru (Upload / URL)</span>
          </h4>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
            + Tambah Baru
          </span>
        </div>

        {/* Upload file */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Pilih Foto dari HP / Komputer:
          </label>
          <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-sky-300 hover:border-sky-500 rounded-xl cursor-pointer bg-sky-50/40 hover:bg-sky-50 transition-all">
            <Upload className="w-6 h-6 text-sky-600 mb-1" />
            <span className="text-xs font-medium text-sky-800">
              {isProcessing ? 'Memproses gambar...' : 'Klik untuk Pilih File Foto'}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              Mendukung format JPG, PNG, WEBP (Otomatis Kompresi)
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, (dataUrl) => setNewPhotoUrl(dataUrl))}
              disabled={isProcessing}
            />
          </label>
        </div>

        <div className="flex items-center gap-2 my-1">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-[10px] text-slate-400 uppercase font-semibold">atau URL Foto</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        {/* URL Input */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            URL Foto (Opsional):
          </label>
          <input
            type="text"
            value={newPhotoUrl}
            onChange={(e) => setNewPhotoUrl(e.target.value)}
            placeholder="https://contoh.com/foto-juandra.jpg atau tempel data URL"
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Image Preview if URL exists */}
        {newPhotoUrl && (
          <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
              <img src={newPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="text-[11px] text-slate-600">
              <p className="font-semibold text-emerald-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Foto berhasil dimuat &amp; siap disimpan
              </p>
              <p className="text-slate-400 mt-0.5">Pilih penempatan foto pada opsi di bawah ini.</p>
            </div>
          </div>
        )}

        {/* Title and Target */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Judul Foto Juandra:
            </label>
            <input
              type="text"
              value={newPhotoTitle}
              onChange={(e) => setNewPhotoTitle(e.target.value)}
              placeholder="Contoh: Senyum Juandra Saat Aqiqah"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Terapkan Foto Ke:
            </label>
            <select
              value={newPhotoTarget}
              onChange={(e) => setNewPhotoTarget(e.target.value as any)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 bg-white"
            >
              <option value="gallery">Galeri Foto Utama Juandra</option>
              <option value="cover1">Jadikan Foto Sampul #1 (Peci Putih)</option>
              <option value="cover2">Jadikan Foto Sampul #2 (Peci Hitam)</option>
            </select>
          </div>
        </div>

        {newPhotoTarget === 'gallery' && (
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Keterangan / Momen Foto:
            </label>
            <input
              type="text"
              value={newPhotoCaption}
              onChange={(e) => setNewPhotoCaption(e.target.value)}
              placeholder="Contoh: Potret menggemaskan ananda tersenyum ceria"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={!newPhotoUrl.trim() || isProcessing}
          className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Simpan Foto ke Koleksi</span>
        </button>
      </form>

      {/* 3. Modal Edit Foto Galeri (CRUD - UPDATE) */}
      {editingPhotoId && (
        <form
          onSubmit={handleSaveEditGallery}
          className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl space-y-3 animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Edit2 className="w-3.5 h-3.5 text-amber-700" />
              <span>Edit Foto Galeri Juandra</span>
            </h4>
            <button
              type="button"
              onClick={() => setEditingPhotoId(null)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-3 items-center">
            <div className="w-16 h-20 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-amber-200">
              <img src={editSrc} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-2">
              <label className="flex items-center gap-1 text-[11px] font-semibold text-amber-900 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Ganti Gambar Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, (dataUrl) => setEditSrc(dataUrl))}
                />
              </label>
              <input
                type="text"
                value={editSrc}
                onChange={(e) => setEditSrc(e.target.value)}
                placeholder="Atau paste URL foto"
                className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Judul Foto:
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Keterangan Foto:
            </label>
            <textarea
              rows={2}
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setEditingPhotoId(null)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      )}

      {/* 4. Daftar Seluruh Foto Galeri (CRUD - READ, UPDATE, DELETE, REORDER) */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-sky-600" />
            <span>Koleksi Foto Galeri Juandra ({db.galleryPhotos.length} Foto)</span>
          </h4>
          <span className="text-[11px] text-slate-500">Bisa diubah, ditukar urutan, &amp; dihapus</span>
        </div>

        {db.galleryPhotos.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs bg-white rounded-xl border border-dashed border-slate-300">
            Belum ada foto di galeri. Silakan tambahkan foto ananda di form atas.
          </div>
        ) : (
          <div className="space-y-3">
            {db.galleryPhotos.map((photo, idx) => (
              <div
                key={photo.id}
                className="bg-white rounded-xl p-3 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition-colors"
              >
                {/* Photo Thumbnail & Meta */}
                <div className="flex gap-3 items-center min-w-0 flex-1">
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img
                      src={photo.src}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1 rounded">
                      #{idx + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{photo.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                      {photo.caption}
                    </p>
                  </div>
                </div>

                {/* CRUD Actions & Reordering */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 text-xs">
                  {/* Up / Down Reorder */}
                  <div className="flex items-center gap-0.5 mr-1 border-r border-slate-200 pr-1.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => movePhoto(idx, 'up')}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors"
                      title="Geser ke Atas"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === db.galleryPhotos.length - 1}
                      onClick={() => movePhoto(idx, 'down')}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors"
                      title="Geser ke Bawah"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Set as cover shortcut */}
                  <button
                    type="button"
                    onClick={() => setAsCover(photo.src, 'cover1', photo.title)}
                    className="px-2 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 text-[10px] font-semibold transition-colors"
                  >
                    Sampul 1
                  </button>
                  <button
                    type="button"
                    onClick={() => setAsCover(photo.src, 'cover2', photo.title)}
                    className="px-2 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 text-[10px] font-semibold transition-colors"
                  >
                    Sampul 2
                  </button>

                  {/* Edit button */}
                  <button
                    type="button"
                    onClick={() => startEditGallery(photo)}
                    className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                    title="Edit judul & keterangan"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteGallery(photo)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    title="Hapus foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
