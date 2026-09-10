export type NavPage =
  | 'anasayfa'
  | 'sporsepeti-user'
  | 'sayfa-yonetimi'
  | 'paket-yonetimi'
  | 'tanimsiz-kullanicilar'
  | 'yetkilendirmeler'
  | 'kullanici-sozlesmeleri'
  | 'aktivite-onaylari'
  | 'brans-yonetimi'
  | 'aktivite-yonetimi'
  | 'sporcular'
  | 'egitmenler'
  | 'antrenman-takvimi'
  | 'paketler'
  | 'fatura-adresi'
  | 'yoneticiler'
  | 'uyeler'
  | 'mesaj-yonetimi'
  | 'subeler'
  | 'sporpuan-degerlendirmeler'
  | 'sporpuan-dogrulamalar'
  | 'sporpuan-raporlar';

export interface DashboardPackage {
  id: string;
  name: string;
  userCount: number;
  users: {
    name: string;
    code: string;
    email?: string;
  }[];
}

export interface FacilityStat {
  id: string;
  name: string;
  count: number;
  icon?: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  userName: string;
  userEmail: string;
  date: string;
  status: 'Açık' | 'Cevaplandı' | 'Beklemede' | 'Çözüldü';
  priority: 'Yüksek' | 'Orta' | 'Düşük';
}

export interface SporsepetiUserItem {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  tcKimlik: string;
  phone: string;
  city: string;
}

export interface YetkilendirmeItem {
  id: string;
  name: string;
  email: string;
  code: string;
  createdAt: string;
  phone: string;
  role: string;
  date: string;
}

export interface SporcuItem {
  id: string;
  name: string;
  email: string;
  code: string;
  date: string;
  facility: string;
  isActive: boolean;
  avatarUrl?: string;
}

export interface EgitmenItem {
  id: string;
  name: string;
  email: string;
  code: string;
  phone: string;
  facility: string;
  avatarUrl?: string;
}

export interface AntrenmanEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  trainer: string;
  facility: string;
  branch: string;
  participantsCount: number;
  maxCapacity: number;
  color?: string;
}

export interface FaturaAdresiItem {
  id: string;
  companyName: string;
  taxNumber: string;
  taxOffice: string;
  address: string;
  city: string;
  district: string;
  contactPerson: string;
  contactPhone: string;
}

export interface SubeItem {
  id: string;
  name: string;
  manager: string;
  phone: string;
  city: string;
  address: string;
  memberCount: number;
  status: 'Aktif' | 'Tadilatta' | 'Pasif';
}

export interface SporpuanReview {
  id: string;
  authorName: string;
  authorEmail: string;
  isVerifiedUser: boolean; // Sporpuan Doğrulanmış Gerçek Üye
  facilityName: string;
  branch: string;
  rating: number; // 1-5
  criteria: {
    hygiene: number;
    equipment: number;
    trainer: number;
    priceValue: number;
  };
  title: string;
  comment: string;
  date: string;
  status: 'Yayında' | 'Onay Bekliyor' | 'Şikayet Edildi' | 'Reddedildi';
  helpfulCount: number;
  reply?: {
    text: string;
    author: string;
    date: string;
  };
}

export interface SporpuanVerification {
  id: string;
  entityType: 'Tesis' | 'Eğitmen' | 'Kullanıcı Check-in';
  title: string;
  facilityName: string;
  verificationBadge: string;
  submittedDate: string;
  status: 'Onaylandı' | 'İncelemede' | 'Belge Bekleniyor' | 'Reddedildi';
  trustScore: number;
  documentsCount: number;
  verifiedBy?: string;
}

