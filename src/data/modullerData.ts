import { EnvanterItem, TurnuvaItem } from '../types';

export const INITIAL_ENVANTER_ITEMS: EnvanterItem[] = [
  {
    id: 'env-1',
    code: 'ENV-BASK-01',
    name: 'Molten BG4500 Deri Basketbol Topu (No: 7)',
    category: 'Toplar',
    club: 'DigiMondi',
    branch: 'Basketbol',
    totalQuantity: 24,
    inUseQuantity: 18,
    inStorageQuantity: 6,
    minQuantityAlert: 8,
    unit: 'Adet',
    condition: 'Yeni / Mükemmel',
    location: 'A Salonu Malzeme Dolabı - Raf 1',
    assignedTo: 'Ali Özcan (Başantrenör)',
    assignedDate: '12.09.2024',
    lastCheckDate: '20.09.2024',
    lastCheckedBy: 'Ali Özcan',
    unitPrice: 2850,
    notes: 'TBF resmi maç topu standardında. Basınçları düzenli kontrol ediliyor.',
    photoUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'env-2',
    code: 'ENV-BASK-02',
    name: 'Nike Çift Taraflı Antrenman Yeleği (Mavi / Kırmızı)',
    category: 'Formalar & Yelekler',
    club: 'DigiMondi',
    branch: 'Basketbol',
    totalQuantity: 30,
    inUseQuantity: 26,
    inStorageQuantity: 4,
    minQuantityAlert: 10,
    unit: 'Adet',
    condition: 'İyi Durumda',
    location: 'A Salonu Askılık & Sandık',
    assignedTo: 'Burak Demir',
    assignedDate: '01.09.2024',
    lastCheckDate: '18.09.2024',
    lastCheckedBy: 'Ali Özcan',
    unitPrice: 350,
    notes: 'Haftalık olarak kulüp çamaşırhanesinde yıkanmaktadır.',
    photoUrl: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'env-3',
    code: 'ENV-ANT-03',
    name: 'SKLZ Çeviklik & Koordinasyon Merdiveni (6 Metre)',
    category: 'Antrenman Ekipmanları',
    club: 'DigiMondi',
    branch: 'Genel',
    totalQuantity: 6,
    inUseQuantity: 4,
    inStorageQuantity: 2,
    minQuantityAlert: 2,
    unit: 'Set',
    condition: 'Yeni / Mükemmel',
    location: 'Kondisyon & Fitness Odası',
    assignedTo: 'Cemre Yılmaz (Kondisyoner)',
    assignedDate: '05.09.2024',
    lastCheckDate: '19.09.2024',
    lastCheckedBy: 'Cemre Yılmaz',
    unitPrice: 1200,
    notes: 'Taşıma çantalarıyla birlikte muhafaza edilmektedir.',
    photoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'env-4',
    code: 'ENV-MED-04',
    name: 'Profesyonel Sporcu İlkyardım Çantası & Soğutucu Sprey Seti',
    category: 'Sağlık & Medikal',
    club: 'DigiMondi',
    branch: 'Genel',
    totalQuantity: 4,
    inUseQuantity: 3,
    inStorageQuantity: 1,
    minQuantityAlert: 2,
    unit: 'Set',
    condition: 'İyi Durumda',
    location: 'Sağlık Odası & Saha Kenarı',
    assignedTo: 'Dr. Zeynep Kaya (Kulüp Hekimi)',
    assignedDate: '01.08.2024',
    lastCheckDate: '22.09.2024',
    lastCheckedBy: 'Dr. Zeynep Kaya',
    unitPrice: 4200,
    notes: 'Bandaj, soğuk paket ve flaster eksikleri her pazartesi tamamlanıyor.',
    photoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'env-5',
    code: 'ENV-VOL-05',
    name: 'Mikasa V200W Profesyonel Voleybol Topu',
    category: 'Toplar',
    club: 'aicosports',
    branch: 'Voleybol',
    totalQuantity: 20,
    inUseQuantity: 16,
    inStorageQuantity: 4,
    minQuantityAlert: 6,
    unit: 'Adet',
    condition: 'Yeni / Mükemmel',
    location: 'Voleybol Deposu - Sepet 1',
    assignedTo: 'Nilgün Demir (Voleybol Koçu)',
    assignedDate: '10.09.2024',
    lastCheckDate: '21.09.2024',
    lastCheckedBy: 'Nilgün Demir',
    unitPrice: 3100,
    notes: 'TVF resmi lig topları. Basınç göstergesi 0.30 kg/cm2 ayarlandı.',
    photoUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'env-6',
    code: 'ENV-VOL-06',
    name: 'Ayarlanabilir Alüminyum Voleybol Filesi & Anten Seti',
    category: 'Tesis & Saha Donanımı',
    club: 'aicosports',
    branch: 'Voleybol',
    totalQuantity: 3,
    inUseQuantity: 2,
    inStorageQuantity: 1,
    minQuantityAlert: 1,
    unit: 'Set',
    condition: 'İyi Durumda',
    location: 'Merkez Kapalı Salon',
    assignedTo: 'Tesis Amiri Hasan Bey',
    assignedDate: '15.06.2024',
    lastCheckDate: '15.09.2024',
    lastCheckedBy: 'Hasan Bey',
    unitPrice: 8500,
    notes: 'File gergi çelik telleri kontrol edildi, gerginlik optimum.',
    photoUrl: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'env-7',
    code: 'ENV-FUT-07',
    name: 'Adidas Al Rihla FIFA Pro Futbol Topu (No: 5)',
    category: 'Toplar',
    club: 'Saraçgym',
    branch: 'Futbol',
    totalQuantity: 18,
    inUseQuantity: 14,
    inStorageQuantity: 4,
    minQuantityAlert: 5,
    unit: 'Adet',
    condition: 'Yeni / Mükemmel',
    location: 'Çim Saha Malzeme Odası',
    assignedTo: 'Emre Koç (Futbol Antrenörü)',
    assignedDate: '01.09.2024',
    lastCheckDate: '20.09.2024',
    lastCheckedBy: 'Emre Koç',
    unitPrice: 2400,
    notes: 'U14 Akademi takımının lig maçlarında kullanılmaktadır.',
    photoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'env-8',
    code: 'ENV-ANT-08',
    name: 'Dizlik, Denge Tahtası & Egzersiz Lastiği Paketi',
    category: 'Antrenman Ekipmanları',
    club: 'Saraçgym',
    branch: 'Genel',
    totalQuantity: 15,
    inUseQuantity: 12,
    inStorageQuantity: 3,
    minQuantityAlert: 5,
    unit: 'Paket',
    condition: 'Yıpranmış / Kontrol',
    location: 'Fizyoterapi & Güç Alanı',
    assignedTo: 'Cemre Yılmaz',
    assignedDate: '10.07.2024',
    lastCheckDate: '17.09.2024',
    lastCheckedBy: 'Cemre Yılmaz',
    unitPrice: 950,
    notes: '2 adet direnç bandında mikro çatlak var, yenilenmesi talep edildi.',
    photoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'env-9',
    code: 'ENV-ELEK-09',
    name: 'Casio Çok Fonksiyonlu Dijital Kronometre & Hakem Düdüğü',
    category: 'Elektronik & Ölçüm',
    club: 'DigiMondi',
    branch: 'Genel',
    totalQuantity: 8,
    inUseQuantity: 7,
    inStorageQuantity: 1,
    minQuantityAlert: 2,
    unit: 'Adet',
    condition: 'Yeni / Mükemmel',
    location: 'Antrenör Odası Çekmece-1',
    assignedTo: 'Tüm Antrenörler',
    assignedDate: '01.09.2024',
    lastCheckDate: '21.09.2024',
    lastCheckedBy: 'Ali Özcan',
    unitPrice: 850,
    notes: 'Pil kontrolleri yapıldı, su geçirmez kordonlu.',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_TURNUVALAR: TurnuvaItem[] = [
  {
    id: 'trn-1',
    name: '2026 SportsFly Bahar Gelişim Kupası',
    organizerClub: 'DigiMondi',
    branch: 'Basketbol',
    ageCategory: 'U14 Erkek',
    season: '2025-2026',
    startDate: '15.10.2024',
    endDate: '28.11.2024',
    location: 'DigiMondi Spor Kompleksi & A Salonu',
    status: 'Devam Ediyor',
    format: 'Lig Usulü',
    teamsCount: 6,
    description: 'Bölge kulüplerinin U14 gelişim takımlarının katılımıyla düzenlenen 6 haftalık lig turnuvası.',
    bannerUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&auto=format&fit=crop&q=80',
    teams: [
      { id: 'tm-1', name: 'DigiMondi Akademi', club: 'DigiMondi', coachName: 'Ali Özcan', played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 198, goalsAgainst: 142, points: 6 },
      { id: 'tm-2', name: 'Saraçgym Basketbol', club: 'Saraçgym', coachName: 'Emre Koç', played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 176, goalsAgainst: 160, points: 5 },
      { id: 'tm-3', name: 'aicosports Gelişim', club: 'aicosports', coachName: 'Murat Sarı', played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 164, goalsAgainst: 155, points: 5 },
      { id: 'tm-4', name: 'Marmara Yıldızları', club: 'Marmara GSK', coachName: 'Kemal Tekin', played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 150, goalsAgainst: 172, points: 4 },
      { id: 'tm-5', name: 'Boğaziçi Kartalları', club: 'Boğaziçi SK', coachName: 'Serdar Can', played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 145, goalsAgainst: 180, points: 4 },
      { id: 'tm-6', name: 'Anadolu Parsları', club: 'Anadolu GSK', coachName: 'Oğuz Acar', played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 132, goalsAgainst: 156, points: 3 },
    ],
    matches: [
      { id: 'm-1', turnuvaId: 'trn-1', round: '1. Hafta', date: '15.10.2024', time: '14:00', venue: 'A Salonu', homeTeam: 'DigiMondi Akademi', awayTeam: 'Saraçgym Basketbol', homeScore: 68, awayScore: 54, status: 'Bitti', mvp: 'Selman Utku' },
      { id: 'm-2', turnuvaId: 'trn-1', round: '1. Hafta', date: '15.10.2024', time: '16:00', venue: 'A Salonu', homeTeam: 'aicosports Gelişim', awayTeam: 'Boğaziçi Kartalları', homeScore: 58, awayScore: 48, status: 'Bitti', mvp: 'Melis Aksoy' },
      { id: 'm-3', turnuvaId: 'trn-1', round: '2. Hafta', date: '22.10.2024', time: '14:00', venue: 'A Salonu', homeTeam: 'Saraçgym Basketbol', awayTeam: 'Marmara Yıldızları', homeScore: 62, awayScore: 50, status: 'Bitti', mvp: 'Kaan Yıldırım' },
      { id: 'm-4', turnuvaId: 'trn-1', round: '2. Hafta', date: '22.10.2024', time: '16:00', venue: 'A Salonu', homeTeam: 'DigiMondi Akademi', awayTeam: 'Anadolu Parsları', homeScore: 72, awayScore: 44, status: 'Bitti', mvp: 'Selman Utku' },
      { id: 'm-5', turnuvaId: 'trn-1', round: '3. Hafta', date: '29.10.2024', time: '14:00', venue: 'A Salonu', homeTeam: 'DigiMondi Akademi', awayTeam: 'aicosports Gelişim', homeScore: 58, awayScore: 44, status: 'Bitti', mvp: 'Burak Demir' },
      { id: 'm-6', turnuvaId: 'trn-1', round: '4. Hafta', date: '05.11.2024', time: '15:30', venue: 'A Salonu', homeTeam: 'Saraçgym Basketbol', awayTeam: 'Boğaziçi Kartalları', status: 'Oynanacak' },
      { id: 'm-7', turnuvaId: 'trn-1', round: '4. Hafta', date: '05.11.2024', time: '17:30', venue: 'A Salonu', homeTeam: 'DigiMondi Akademi', awayTeam: 'Marmara Yıldızları', status: 'Oynanacak' },
    ],
  },
  {
    id: 'trn-2',
    name: 'İstanbul Voleybol Sonbahar Şampiyonası',
    organizerClub: 'aicosports',
    branch: 'Voleybol',
    ageCategory: 'U16 Kız',
    season: '2025-2026',
    startDate: '01.11.2024',
    endDate: '15.12.2024',
    location: 'aicosports Merkez Voleybol Salonu',
    status: 'Kayıt Açık',
    format: 'Grup + Eleme',
    teamsCount: 8,
    description: '16 yaş altı kadın voleybol takımları arasında grup ve final eleme maçları.',
    bannerUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=1200&auto=format&fit=crop&q=80',
    teams: [
      { id: 'vt-1', name: 'aicosports Voleybol A', club: 'aicosports', coachName: 'Nilgün Demir', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
      { id: 'vt-2', name: 'DigiMondi Filenin Sultanları', club: 'DigiMondi', coachName: 'Aylin Çelik', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
      { id: 'vt-3', name: 'Kuzey Yıldızı GSK', club: 'Kuzey SK', coachName: 'Hande Doğan', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
      { id: 'vt-4', name: 'Kadıköy Atletik', club: 'Kadıköy SK', coachName: 'Tolga Eren', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    ],
    matches: [
      { id: 'vm-1', turnuvaId: 'trn-2', round: '1. Tur', date: '05.11.2024', time: '13:00', venue: 'Merkez Salon', homeTeam: 'aicosports Voleybol A', awayTeam: 'Kadıköy Atletik', status: 'Oynanacak' },
      { id: 'vm-2', turnuvaId: 'trn-2', round: '1. Tur', date: '05.11.2024', time: '15:00', venue: 'Merkez Salon', homeTeam: 'DigiMondi Filenin Sultanları', awayTeam: 'Kuzey Yıldızı GSK', status: 'Oynanacak' },
    ],
  },
];

const ENVANTER_STORAGE_KEY = 'sportsfly_envanter_items_v1';
const TURNUVA_STORAGE_KEY = 'sportsfly_turnuvalar_v1';

export function getStoredEnvanter(): EnvanterItem[] {
  try {
    const raw = localStorage.getItem(ENVANTER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Envanter yüklenirken hata:', e);
  }
  return INITIAL_ENVANTER_ITEMS;
}

export function saveStoredEnvanter(items: EnvanterItem[]): void {
  try {
    localStorage.setItem(ENVANTER_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Envanter kaydedilirken hata:', e);
  }
}

export function getStoredTurnuvalar(): TurnuvaItem[] {
  try {
    const raw = localStorage.getItem(TURNUVA_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Turnuvalar yüklenirken hata:', e);
  }
  return INITIAL_TURNUVALAR;
}

export function saveStoredTurnuvalar(items: TurnuvaItem[]): void {
  try {
    localStorage.setItem(TURNUVA_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Turnuvalar kaydedilirken hata:', e);
  }
}
