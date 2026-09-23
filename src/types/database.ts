export interface BabyInfo {
  fullName: string;
  fatherName: string;
  motherName: string;
  greetingText: string;
  prayerQuote: string;
  meaningParts: Array<{
    id: number;
    title: string;
    description: string;
  }>;
}

export interface EventInfo {
  title: string;
  dateFormatted: string;
  timeFormatted: string;
  targetIsoDate: string; // e.g. "2026-09-27T09:00:00+08:00"
  locationName: string;
  locationAddress: string;
  googleMapsUrl: string;
}

export interface DanaAccount {
  accountNumber: string;
  accountHolder: string;
  badge: string;
  receiverNote: string;
}

export interface CoverPhotoItem {
  id: string;
  src: string;
  label: string;
  alt: string;
}

export interface GalleryPhotoItem {
  id: string;
  src: string;
  title: string;
  caption: string;
}

export interface WishItem {
  id: string;
  name: string;
  attendance: 'hadir' | 'insya_allah' | 'tidak_hadir';
  message: string;
  timestamp: string;
  likes: number;
  isPinned?: boolean;
}

export interface AppDatabase {
  version: number;
  lastUpdated: string;
  adminPin: string;
  baby: BabyInfo;
  event: EventInfo;
  dana: DanaAccount;
  coverPhotos: CoverPhotoItem[];
  galleryPhotos: GalleryPhotoItem[];
  wishes: WishItem[];
}
