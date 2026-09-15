export type NavPage =
  | 'anasayfa'
  | 'sporsepeti-user'
  | 'sayfa-yonetimi'
  | 'paket-yonetimi'
  | 'tanimsiz-kullanicilar'
  | 'yetkilendirmeler'
  | 'kullanici-sozlesmeleri'
  | 'brans-yonetimi'
  | 'aktivite-yonetimi'
  | 'sporcular'
  | 'egitmenler'
  | 'gruplar'
  | 'antrenman-takvimi'
  | 'on-muhasebe'
  | 'gelir-gider-kategori'
  | 'gelir-gider-yonetimi'
  | 'odeme-plani-kontrol'
  | 'odeme-plani'
  | 'paketler'
  | 'fatura-adresi'
  | 'on-kayit'
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
  branch?: string; // Eğitmen Kategorisi / Branş (Futbol, Basketbol, vb.)
  gender?: string;
  city?: string;
  address?: string;
  accountDuration?: string;
  mailEnabled?: boolean;
  smsEnabled?: boolean;
  avatarUrl?: string;
  appointments?: {
    id: string;
    title: string;
    date: string;
    time: string;
    student: string;
    status: string;
  }[];
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

export interface AntrenmanAttendee {
  id: string;
  name: string;
  phone?: string;
  present?: boolean;
}

export interface AntrenmanItem {
  id: string;
  title: string;
  branch: string;
  date: string;
  startTime: string;
  endTime: string;
  trainerName: string;
  facilityName: string;
  capacity: number;
  enrolledCount: number;
  status: 'Planlandı' | 'Devam Ediyor' | 'Tamamlandı' | 'İptal';
  color: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'indigo' | 'sky';
  notes?: string;
  attendees: AntrenmanAttendee[];
}

export type PackagePlanType = 'Başlangıç' | 'Profesyonel' | 'Premium' | 'Kurumsal';

export interface YoneticiItem {
  id: string;
  name: string;
  email: string;
  code: string;
  createdAt: string;
  phone: string;
  role: string;
  schoolName: string;
  accessibility: 'Erişilebilir' | 'Erişilemez';
  packageType?: PackagePlanType;
  avatarUrl?: string;
  authProvider?: 'google' | 'email';
  activeStudents?: number;
  activeTrainers?: number;
  branches?: string[];
  lastLogin?: string;
}

export interface GrupItem {
  id: string;
  name: string;
  instructorName: string;
  memberCount: number;
  facility: string;
  branch?: string;
  description?: string;
  members?: {
    id: string;
    name: string;
    phone: string;
    code: string;
  }[];
}

export interface GelirGiderItem {
  id: string;
  type: 'Gelir' | 'Gider';
  title: string;
  category: string;
  amount: number;
  date: string;
  payerOrPayee: string;
  paymentMethod: 'Nakit' | 'Kredi Kartı' | 'Havale/EFT' | 'POS';
  status: 'Tamamlandı' | 'Beklemede' | 'İptal';
  description?: string;
}

export interface GelirGiderKategoriItem {
  id: string;
  name: string;
  type: 'Gelir' | 'Gider';
  itemCount: number;
  totalAmount: number;
  color: string;
}

export interface OdemePlaniItem {
  id: string;
  athleteName: string;
  athleteCode: string;
  planName: string;
  installment: string; // e.g. "3/6"
  dueDate: string;
  amount: number;
  status: 'Ödendi' | 'Bekliyor' | 'Gecikti';
  paidDate?: string;
}

export interface KulupSozlesmesi {
  id: string;
  sozlesmeNo: string;
  yonetici: string;
  firmaTip: string;
  tcKimlik: string;
  dogumTarihi: string;
  il: string;
  ilce: string;
  eposta?: string;
  vergiDairesi: string;
  ibanUnvan: string;
  adSoyad: string;
  firmaUnvani: string;
  telefon: string;
  website?: string;
  iban: string;
  status: 'Onaylandı' | 'İmza Bekliyor' | 'İnceleniyor';
  createdAt: string;
}

export type OnKayitDurumu =
  | 'Ön Kayıt'
  | 'Görüşme Yapıldı'
  | 'Deneme Antrenmanı'
  | 'Sözleşme Bekleniyor'
  | 'Kayıt Oldu'
  | 'Kayıt Olmadı'
  | 'İptal';

export interface OnKayitItem {
  id: string;
  // 1. Yönetici / Ön Kayıt Bilgileri
  bagliOnKayit?: string;
  onKayitTarihi: string;
  onKayitNo: string;
  sube: string;
  brans: string;

  // 2. Sporcu Bilgileri
  sporcuAdSoyad: string;
  cinsiyet: 'Erkek' | 'Kız';
  tcKimlikNo: string;
  dogumTarihi: string;
  telefon?: string;
  adres: string;
  boy?: string;
  kilo?: string;

  // 3. Veli Bilgileri
  veliAdSoyad: string;
  veliTelefon: string;
  veliEposta: string;
  veliMeslek?: string;
  veliEgitimDurumu?: string;

  // 4. Sporcu Sağlık ve Özel Durum Bilgileri
  saglikDurumu?: string;
  alerjiDurumu?: string;
  kronikRahatsizlik?: string;
  davranissalOzelDurum?: string;
  duzenliKullanilanIlac?: string;
  acilDurumAranacakKisi: string;
  acilDurumTelefonu: string;

  // 5. Kulübe Ulaşma / Pazarlama Bilgileri
  ulasmaTuru:
    | 'Referans / Tavsiye'
    | 'Sosyal Medya'
    | 'Sporsepeti.com.tr'
    | 'Google / İnternet'
    | 'Afiş / Billboard'
    | 'Mail / SMS'
    | 'Etkinlik'
    | 'Diğer';
  referansVerenKisi?: string;
  ekAciklama?: string;

  // 6. Görüşme Bilgileri
  gorusmeYapan?: string;
  gorusmeTuru?: 'Online' | 'Yüz Yüze' | 'Telefon';
  gorusmeTarihi?: string;
  gorusmeNotlari?: string;
  ilgilenilenBrans?: string;
  tercihEdilenGunler?: string[];
  tercihEdilenSaatler?: string;

  // 7. Satış / Sözleşme Bilgileri
  beklenenSozlesmeTutari?: number;
  sozlesmeOlasiligi?: 'Yüksek' | 'Orta' | 'Düşük';
  gerceklesenSozlesmeTutari?: number;
  sozlesmeTarihi?: string;
  odemeDurumu?: 'Ödendi' | 'Bekliyor' | 'Kısmi Ödeme' | 'Ödenmedi';
  odemeYontemi?: 'Kredi Kartı' | 'Havale / EFT' | 'Nakit' | 'Taksit';
  indirimKampanya?: string;
  kaybedilmeNedeni?: string;

  // 8. KVKK / Onaylar
  kvkkAydinlatmaOnay: boolean;
  acikRizaOnay: boolean;
  fotografVideoIzni: boolean;
  iletisimKampanyaIzni: boolean;
  veliOnayi: boolean;

  // 9. Sistemsel Alanlar
  kayitOlusturanKullanici: string;
  kayitTarihi: string;
  sonGuncellemeTarihi: string;
  kayitDurumu: OnKayitDurumu;
}


