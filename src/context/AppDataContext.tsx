import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  AppDatabase,
  BabyInfo,
  EventInfo,
  DanaAccount,
  CoverPhotoItem,
  GalleryPhotoItem,
  WishItem,
} from '../types/database';

// Import default stock photographs
import photoWhitePeci from '../assets/images/juandra_white_koko_1790146608476.jpg';
import photoBlackPeci from '../assets/images/juandra_tummy_peci_1790146621385.jpg';
import photoSleeping from '../assets/images/baby_sleeping_serene_1790145405712.jpg';
import photoHands from '../assets/images/baby_tiny_feet_hands_1790145423471.jpg';

const LOCAL_STORAGE_KEY = 'juandra_aqiqah_app_db_v1';
const API_URL = '/api/database';

export const INITIAL_DATABASE: AppDatabase = {
  version: 1,
  lastUpdated: new Date().toISOString(),
  adminPin: '2709', // Default PIN for admin panel
  baby: {
    fullName: 'Muhamad Juandra Mahatma',
    fatherName: 'Bapak Bayu Mahatma Saputra',
    motherName: 'Ibu Linda Ismiyati Lestari',
    greetingText: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
    prayerQuote:
      'Semoga ananda tumbuh menjadi anak yang sholeh, cerdas, berbakti kepada orang tua, serta membawa berkah bagi agama dan keluarga. Aamiin.',
    meaningParts: [
      {
        id: 1,
        title: 'Muhamad',
        description: 'Terpuji, meneladani akhlak mulia dan keluhuran budi pekerti Baginda Rasulullah SAW.',
      },
      {
        id: 2,
        title: 'Juandra',
        description: 'Pemberani, tangguh, berpendirian teguh, dan pejuang kebaikan di setiap langkah hidupnya.',
      },
      {
        id: 3,
        title: 'Mahatma',
        description: 'Berjiwa agung, bijaksana, mulia budi pekertinya, serta senantiasa mengayomi sesama.',
      },
    ],
  },
  event: {
    title: "Tasyakuran Walimatul 'Aqiqah & Khitan Muhamad Juandra Mahatma",
    dateFormatted: 'Minggu, 27 September 2026',
    timeFormatted: 'Pukul 09.00 WITA s/d Selesai',
    targetIsoDate: '2026-09-27T09:00:00+08:00',
    locationName: 'Kediaman Keluarga Mahatma',
    locationAddress:
      'BTN SEKAR ANYER BLOK E NO.19, Kelurahan Sekarteja, Kec. Selong, Kab. Lombok Timur',
    googleMapsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=BTN+SEKAR+ANYER+BLOK+E+NO.19+Kelurahan+Sekarteja+Kec.+Selong+Kab.+Lombok+Timur',
  },
  dana: {
    accountNumber: '082135134688',
    accountHolder: 'BAYU MAHATMA SAPUTRA',
    badge: 'DANA E-Wallet',
    receiverNote: 'Penerima kado/hadiah fisik: Bapak Bayu Mahatma Saputra (082135134688)',
  },
  coverPhotos: [
    {
      id: 'cover-1',
      src: photoWhitePeci,
      label: 'Peci Putih',
      alt: 'Muhamad Juandra Mahatma - Berbusana Putih & Peci Putih',
    },
    {
      id: 'cover-2',
      src: photoBlackPeci,
      label: 'Peci Hitam',
      alt: 'Muhamad Juandra Mahatma - Senyum Ceria & Peci Hitam',
    },
  ],
  galleryPhotos: [
    {
      id: 'gal-1',
      src: photoWhitePeci,
      title: 'Ananda Muhamad Juandra Mahatma',
      caption: 'Potret ananda Juandra berbusana putih dan peci putih di atas motif islami',
    },
    {
      id: 'gal-2',
      src: photoBlackPeci,
      title: 'Senyum Ceria Tummy Time',
      caption: 'Tawa menggemaskan ananda Juandra dengan peci songkok hitam berbordir emas',
    },
    {
      id: 'gal-3',
      src: photoSleeping,
      title: 'Tidur Lelap Penuh Ketenangan',
      caption: 'Momen damai ananda tertidur lelap dalam dekapan doa orang tua',
    },
    {
      id: 'gal-4',
      src: photoHands,
      title: 'Genggaman Kasih Ayah & Bunda',
      caption: 'Jemari mungil Juandra dalam genggaman hangat cinta keluarga',
    },
  ],
  wishes: [
    {
      id: 'wish-1',
      name: 'Keluarga H. M. Ridwan',
      attendance: 'hadir',
      message:
        'Barakallahu fiik ananda Juandra tercinta. Semoga senantiasa diberikan kesehatan, keteguhan iman, dan menjadi anak sholeh penyejuk hati kedua orang tua.',
      timestamp: 'Baru saja',
      likes: 12,
      isPinned: true,
    },
    {
      id: 'wish-2',
      name: 'Tante Farah & Om Dimas',
      attendance: 'insya_allah',
      message:
        'Selamat atas khitanan dan aqiqahnya Juandra! Semoga lekas pulih, cerdas, berbakti, dan tercapai semua cita-cita muliamu ya nak. Aamiin ya Rabbal Alamin.',
      timestamp: '1 jam yang lalu',
      likes: 9,
    },
    {
      id: 'wish-3',
      name: 'Ustadz Ahmad Fauzan & Keluarga',
      attendance: 'hadir',
      message:
        'Mabruk alfa mabruk atas aqiqah & khitan ananda Muhamad Juandra Mahatma. Semoga menjadi pembuka pintu surga bagi ayah bundanya, cerdas dan istiqomah di jalan Allah.',
      timestamp: '2 jam yang lalu',
      likes: 15,
    },
    {
      id: 'wish-4',
      name: 'dr. Hendra & Mbak Sari',
      attendance: 'hadir',
      message:
        'Alhamdulillah selamat untuk Mas Bayu & Mbak Linda. Doa terbaik kami untuk baby Juandra tercinta, semoga sehat selalu dan tumbuh cerdas.',
      timestamp: '4 jam yang lalu',
      likes: 8,
    },
  ],
};

interface AppDataContextType {
  db: AppDatabase;
  isLoading: boolean;
  syncStatus: 'synced' | 'saving' | 'error' | 'offline';
  updateBaby: (baby: Partial<BabyInfo>) => void;
  updateEvent: (event: Partial<EventInfo>) => void;
  updateDana: (dana: Partial<DanaAccount>) => void;
  updateCoverPhotos: (photos: CoverPhotoItem[]) => void;
  updateGalleryPhotos: (photos: GalleryPhotoItem[]) => void;
  addGalleryPhoto: (photo: Omit<GalleryPhotoItem, 'id'>) => void;
  updateGalleryPhoto: (id: string, updated: Partial<Omit<GalleryPhotoItem, 'id'>>) => void;
  deleteGalleryPhoto: (id: string) => void;
  addWish: (wish: Omit<WishItem, 'id' | 'timestamp' | 'likes'>) => void;
  deleteWish: (id: string) => void;
  toggleLikeWish: (id: string) => void;
  togglePinWish: (id: string) => void;
  updateAdminPin: (newPin: string) => void;
  saveToVercel: (customDb?: AppDatabase) => Promise<boolean>;
  exportDatabaseJson: () => void;
  importDatabaseJson: (jsonString: string) => boolean;
  resetToDefault: () => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<AppDatabase>(INITIAL_DATABASE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'error' | 'offline'>('synced');

  // 1. Initial Load: LocalStorage first (for instant display), then attempt Vercel API sync
  useEffect(() => {
    try {
      const savedLocal = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedLocal) {
        const parsed = JSON.parse(savedLocal);
        // Auto-migrate if older address was saved in client storage
        if (parsed.event?.locationAddress?.includes('Zainuddin') || parsed.event?.locationAddress?.includes('Pancor')) {
          parsed.event.locationAddress = INITIAL_DATABASE.event.locationAddress;
          parsed.event.googleMapsUrl = INITIAL_DATABASE.event.googleMapsUrl;
        }
        setDb((prev) => ({
          ...prev,
          ...parsed,
          // ensure safety for newly added fields
          baby: { ...prev.baby, ...(parsed.baby || {}) },
          event: { ...prev.event, ...(parsed.event || {}) },
          dana: { ...prev.dana, ...(parsed.dana || {}) },
          coverPhotos: parsed.coverPhotos?.length ? parsed.coverPhotos : prev.coverPhotos,
          galleryPhotos: parsed.galleryPhotos?.length ? parsed.galleryPhotos : prev.galleryPhotos,
          wishes: parsed.wishes?.length ? parsed.wishes : prev.wishes,
        }));
      }
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }

    // Try fetching from Vercel API
    const fetchRemote = async () => {
      try {
        const res = await fetch(API_URL, { method: 'GET' });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setDb(json.data);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json.data));
            setSyncStatus('synced');
          }
        }
      } catch {
        // Local preview or offline - perfectly fine, already populated from localStorage/defaults
        setSyncStatus('synced');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchRemote();
  }, []);

  // Save changes to localStorage & attempt Vercel API sync
  const commitDb = useCallback(async (newDb: AppDatabase) => {
    setDb(newDb);
    setSyncStatus('saving');

    // 1. Persist to localStorage
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newDb));
    } catch (err) {
      console.warn('LocalStorage save failed:', err);
    }

    // 2. Persist to Vercel API
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDb),
      });
      if (res.ok) {
        setSyncStatus('synced');
      } else {
        setSyncStatus('synced'); // local is synced
      }
    } catch {
      // Offline or pure client preview: local save is already safe and active
      setSyncStatus('synced');
    }
  }, []);

  const updateBaby = useCallback(
    (babyUpdate: Partial<BabyInfo>) => {
      const newDb: AppDatabase = {
        ...db,
        lastUpdated: new Date().toISOString(),
        baby: { ...db.baby, ...babyUpdate },
      };
      void commitDb(newDb);
    },
    [db, commitDb]
  );

  const updateEvent = useCallback(
    (eventUpdate: Partial<EventInfo>) => {
      const newDb: AppDatabase = {
        ...db,
        lastUpdated: new Date().toISOString(),
        event: { ...db.event, ...eventUpdate },
      };
      void commitDb(newDb);
    },
    [db, commitDb]
  );

  const updateDana = useCallback(
    (danaUpdate: Partial<DanaAccount>) => {
      const newDb: AppDatabase = {
        ...db,
        lastUpdated: new Date().toISOString(),
        dana: { ...db.dana, ...danaUpdate },
      };
      void commitDb(newDb);
    },
    [db, commitDb]
  );

  const updateCoverPhotos = useCallback(
    (photos: CoverPhotoItem[]) => {
      const newDb: AppDatabase = {
        ...db,
        lastUpdated: new Date().toISOString(),
        coverPhotos: photos,
      };
      void commitDb(newDb);
    },
    [db, commitDb]
  );

  const updateGalleryPhotos = useCallback(
    (photos: GalleryPhotoItem[]) => {
      const newDb: AppDatabase = {
        ...db,
        lastUpdated: new Date().toISOString(),
        galleryPhotos: photos,
      };
      void commitDb(newDb);
    },
    [db, commitDb]
  );

  const addGalleryPhoto = useCallback(
    (photo: Omit<GalleryPhotoItem, 'id'>) => {
      const newPhoto: GalleryPhotoItem = {
        ...photo,
        id: `photo-${Date.now()}`,
      };
      const newDb: AppDatabase = {
        ...db,
        lastUpdated: new Date().toISOString(),
        galleryPhotos: [newPhoto, ...db.galleryPhotos],
      };
      void commitDb(newDb);
    },
    [db, commitDb]
  );

  const updateGalleryPhoto = useCallback(
    (id: string, updated: Partial<Omit<GalleryPhotoItem, 'id'>>) => {
      const newDb: AppDatabase = {
        ...db,
        lastUpdated: new Date().toISOString(),
        galleryPhotos: db.galleryPhotos.map((p) =>
          p.id === id ? { ...p, ...updated } : p
        ),
      };
      void commitDb(newDb);
    },
    [db, commitDb]
  );

  const deleteGalleryPhoto = useCallback(
    (id: string) => {
      const newDb: AppDatabase = {
        ...db,
        lastUpdated: new Date().toISOString(),
        galleryPhotos: db.galleryPhotos.filter((p) => p.id !== id),
      };
      void commitDb(newDb);
    },
    [db, commitDb]
  );

  const addWish = useCallback(
    (wish: Omit<WishItem, 'id' | 'timestamp' | 'likes'>) => {
      const newWish: WishItem = {
        ...wish,
        id: `wish-${Date.now()}`,
        timestamp: 'Baru saja',
        likes: 0,
      };
      const newDb: AppDatabase = {
        ...db,
        lastUpdated: new Date().toISOString(),
        wishes: [newWish, ...db.wishes],
      };
      void commitDb(newDb);
    },
    [db, commitDb]
  );

  const deleteWish = useCallback(
    (id: string) => {
      const newDb: AppDatabase = {
        ...db,
        lastUpdated: new Date().toISOString(),
        wishes: db.wishes.filter((w) => w.id !== id),
      };
      void commitDb(newDb);
    },
    [db, commitDb]
  );

  const toggleLikeWish = useCallback(
    (id: string) => {
      const newWishes = db.wishes.map((w) => {
        if (w.id === id) {
          return { ...w, likes: w.likes + 1 };
        }
        return w;
      });
      const newDb: AppDatabase = {
        ...db,
        wishes: newWishes,
      };
      void commitDb(newDb);
    },
    [db, commitDb]
  );

  const togglePinWish = useCallback(
    (id: string) => {
      const newWishes = db.wishes.map((w) => {
        if (w.id === id) {
          return { ...w, isPinned: !w.isPinned };
        }
        return w;
      });
      const newDb: AppDatabase = {
        ...db,
        wishes: newWishes,
      };
      void commitDb(newDb);
    },
    [db, commitDb]
  );

  const updateAdminPin = useCallback(
    (newPin: string) => {
      const newDb: AppDatabase = {
        ...db,
        adminPin: newPin,
      };
      void commitDb(newDb);
    },
    [db, commitDb]
  );

  const saveToVercel = useCallback(
    async (customDb?: AppDatabase): Promise<boolean> => {
      const targetDb = customDb || db;
      setSyncStatus('saving');
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(targetDb));
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(targetDb),
        });
        if (res.ok) {
          setSyncStatus('synced');
          return true;
        }
      } catch {
        // Saved to local successfully
      }
      setSyncStatus('synced');
      return true;
    },
    [db]
  );

  const exportDatabaseJson = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(db, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `database-aqiqah-juandra-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [db]);

  const importDatabaseJson = useCallback(
    (jsonString: string): boolean => {
      try {
        const parsed = JSON.parse(jsonString) as AppDatabase;
        if (!parsed.baby || !parsed.event || !parsed.dana) {
          throw new Error('Format database tidak lengkap.');
        }
        void commitDb({
          ...parsed,
          lastUpdated: new Date().toISOString(),
        });
        return true;
      } catch (err) {
        console.error('Import database failed:', err);
        return false;
      }
    },
    [commitDb]
  );

  const resetToDefault = useCallback(() => {
    if (window.confirm('Yakin ingin mereset seluruh data kembali ke pengaturan awal?')) {
      void commitDb(INITIAL_DATABASE);
    }
  }, [commitDb]);

  return (
    <AppDataContext.Provider
      value={{
        db,
        isLoading,
        syncStatus,
        updateBaby,
        updateEvent,
        updateDana,
        updateCoverPhotos,
        updateGalleryPhotos,
        addGalleryPhoto,
        updateGalleryPhoto,
        deleteGalleryPhoto,
        addWish,
        deleteWish,
        toggleLikeWish,
        togglePinWish,
        updateAdminPin,
        saveToVercel,
        exportDatabaseJson,
        importDatabaseJson,
        resetToDefault,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}
