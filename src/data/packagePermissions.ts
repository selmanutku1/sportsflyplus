import { NavPage, PackagePlanType } from '../types';

export interface PackageDetail {
  id: string;
  name: PackagePlanType;
  level: number;
  badgeClass: string;
  dotColor: string;
  maxStudents: number | 'Sınırsız';
  monthlyPrice: number;
  highlight: string;
  allowedModules: string[];
  restrictedModules: string[];
  priceFormatted: string;
  maxTrainers: string;
  description: string;
  features: string[];
  restrictedFeatures: string[];
}

export const PACKAGE_DETAILS: Record<PackagePlanType, PackageDetail> = {
  Başlangıç: {
    id: 'baslangic',
    name: 'Başlangıç',
    level: 1,
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    dotColor: 'bg-slate-400',
    maxStudents: 30,
    monthlyPrice: 0,
    priceFormatted: 'Ücretsiz (0 ₺)',
    maxTrainers: '1 Eğitmen',
    description: 'Bireysel ve yeni açılan butik spor okulları için temel kayıt ve yoklama paketi.',
    highlight: 'Temel Seviye • 30 Sporcu Kapasitesi',
    features: [
      'Üye / Sporcu Yönetimi (30 Kişi Sınırı)',
      'Yoklama ve QR Giriş Yönetimi',
      'Antrenman Takvimi Planlama',
      'Ön Kayıt Başvuruları',
    ],
    allowedModules: [
      'Üye / Sporcu Yönetimi (30 Kişi Sınırı)',
      'Yoklama ve QR Giriş Yönetimi',
      'Antrenman Takvimi Planlama',
      'Ön Kayıt Başvuruları',
    ],
    restrictedFeatures: [
      'Eğitmen Kadrosu',
      'Gruplar & Takımlar',
      'Ön Muhasebe & Kasa',
      'Sporpuan İtibar Sistemi',
    ],
    restrictedModules: [
      'Eğitmen ve Antrenör Yönetimi',
      'Aidat ve Ödeme Takip Sistemi',
      'SMS / E-Posta Toplu Gönderimi',
      'Grup ve Seviye Yönetimi',
      'Ön Muhasebe & Gelir-Gider Yönetimi',
      'Sporpuan İtibar Sistemi',
    ],
  },
  Profesyonel: {
    id: 'profesyonel',
    name: 'Profesyonel',
    level: 2,
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    dotColor: 'bg-blue-500',
    maxStudents: 250,
    monthlyPrice: 2299,
    priceFormatted: '2.299 ₺ / ay',
    maxTrainers: '10 Eğitmen',
    description: 'Büyümekte olan spor okulları ve birden fazla branşı olan kulüpler için eğitmen ve aidat takibi.',
    highlight: 'Orta Ölçek • Eğitmen & Aidat Takibi',
    features: [
      'Üye / Sporcu Yönetimi (250 Kişi Sınırı)',
      'Eğitmen Kadrosu Yönetimi',
      'Sporcu / Üye Aidat Ödeme Takibi',
      'SMS ve E-Posta Gönderim Modülü',
      'Şube ve Tesis Yönetimi',
      'Yoklama ve Antrenman Takvimi',
    ],
    allowedModules: [
      'Üye / Sporcu Yönetimi (250 Kişi Sınırı)',
      'Eğitmen Kadrosu Yönetimi',
      'Sporcu / Üye Aidat Ödeme Takibi',
      'SMS ve E-Posta Gönderim Modülü',
      'Şube ve Tesis Yönetimi',
      'Yoklama ve Antrenman Takvimi',
    ],
    restrictedFeatures: [
      'Grup & Takım Yönetimi',
      'Kapsamlı Ön Muhasebe (Gelir/Gider)',
      'Sporpuan İtibar Sistemi',
    ],
    restrictedModules: [
      'Grup ve Takım Yönetimi',
      'Ön Muhasebe & Kasa / Gelir-Gider',
      'Sporpuan Değerlendirme & İtibar Portalı',
    ],
  },
  Premium: {
    id: 'premium',
    name: 'Premium',
    level: 3,
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    dotColor: 'bg-indigo-600',
    maxStudents: 1000,
    monthlyPrice: 3199,
    priceFormatted: '3.199 ₺ / ay',
    maxTrainers: '30 Eğitmen',
    description: 'Gelişmiş spor kulüpleri için tam teşekküllü ön muhasebe, gelir-gider ve grup yönetimi.',
    highlight: 'İleri Seviye • Muhasebe & Grup Yönetimi',
    features: [
      'Üye / Sporcu Yönetimi (1.000 Kişi Sınırı)',
      'Ön Muhasebe (Gelir/Gider/Kasa/Faturalar)',
      'Grup & Takım Yönetimi',
      'Eğitmen ve Kadro Yönetimi',
      'Aidat ve Online Ödeme Takibi',
      'SMS & E-Posta Toplu Bildirim',
      'Üye Memnuniyet Anketleri',
    ],
    allowedModules: [
      'Üye / Sporcu Yönetimi (1.000 Kişi Sınırı)',
      'Ön Muhasebe (Gelir/Gider/Kasa/Faturalar)',
      'Grup & Takım Yönetimi',
      'Eğitmen ve Kadro Yönetimi',
      'Aidat ve Online Ödeme Takibi',
      'SMS & E-Posta Toplu Bildirim',
      'Üye Memnuniyet Anketleri',
    ],
    restrictedFeatures: [
      'Sporpuan İtibar & Doğrulama Sistemi',
    ],
    restrictedModules: [
      'Sporpuan İtibar Sistemi & Kurumsal Web Altyapısı',
    ],
  },
  Kurumsal: {
    id: 'kurumsal',
    name: 'Kurumsal',
    level: 4,
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    dotColor: 'bg-amber-500',
    maxStudents: 'Sınırsız',
    monthlyPrice: 0,
    priceFormatted: 'Özel Fiyatlandırma',
    maxTrainers: 'Sınırsız Eğitmen',
    description: 'Federasyonlar, büyük akademi ağları ve çok şubeli franchise kulüpler için sınırsız erişim.',
    highlight: 'Tam Kapsam • Sınırsız Veri & Sporpuan',
    features: [
      'Sınırsız Üye / Sporcu Veri Yönetimi',
      'Tüm Muhasebe, Grup, Eğitmen Özellikleri',
      'Sporcu / Üye Sporpuan Değerlendirme & Doğrulama',
      'Spor Okulları & Kulüpler Şube Ağı',
      'Özel Alan Adı ve Web Sitesi Entegrasyonu',
      'SLA ve Öncelikli 7/24 Destek',
    ],
    allowedModules: [
      'Sınırsız Üye / Sporcu Veri Yönetimi',
      'Tüm Muhasebe, Grup, Eğitmen Özellikleri',
      'Sporcu / Üye Sporpuan Değerlendirme & Doğrulama',
      'Spor Okulları & Kulüpler Şube Ağı',
      'Özel Alan Adı ve Web Sitesi Entegrasyonu',
      'SLA ve Öncelikli 7/24 Destek',
    ],
    restrictedFeatures: [],
    restrictedModules: [],
  },
};

// Map each restricted page to the minimum required package level
export interface PageRestrictionRule {
  minPlan: PackagePlanType;
  minLevel: number;
  featureTitle: string;
  description: string;
}

export const PAGE_RESTRICTIONS: Partial<Record<NavPage, PageRestrictionRule>> = {
  // Profesyonel (Level 2) Requirements
  egitmenler: {
    minPlan: 'Profesyonel',
    minLevel: 2,
    featureTitle: 'Eğitmen & Antrenör Yönetimi',
    description: 'Eğitmenlerin randevuları, branşları, iletişimleri ve seans atamalarını yönetmek için Profesyonel veya üstü paket gereklidir.',
  },
  'mesaj-yonetimi': {
    minPlan: 'Profesyonel',
    minLevel: 2,
    featureTitle: 'SMS & E-Posta Gönderim Modülü',
    description: 'Kulüp üyelerine ve velilere toplu SMS ve e-posta bildirimleri göndermek için Profesyonel paket gereklidir.',
  },
  subeler: {
    minPlan: 'Profesyonel',
    minLevel: 2,
    featureTitle: 'Şube & Tesis Yönetimi',
    description: 'Birden fazla tesis ve şube tanımlamak için Profesyonel paket gereklidir.',
  },
  'odeme-plani': {
    minPlan: 'Profesyonel',
    minLevel: 2,
    featureTitle: 'Aidat & Ödeme Planı Yönetimi',
    description: 'Sporcuların aylık aidat taksitleri ve ödeme planlarını takip etmek için Profesyonel paket gereklidir.',
  },
  'odeme-plani-kontrol': {
    minPlan: 'Profesyonel',
    minLevel: 2,
    featureTitle: 'Ödeme Planı Kontrolü & Tahsilat',
    description: 'Ödeme gecikmeleri ve tahsilat kontrolleri için Profesyonel paket gereklidir.',
  },

  // Premium (Level 3) Requirements
  gruplar: {
    minPlan: 'Premium',
    minLevel: 3,
    featureTitle: 'Grup & Takım Yönetimi',
    description: 'Antrenman grupları, yaş kategorileri ve takım listelerini organize etmek için Premium paket gereklidir.',
  },
  'on-muhasebe': {
    minPlan: 'Premium',
    minLevel: 3,
    featureTitle: 'Ön Muhasebe & Finans Yönetimi',
    description: 'Kasa, gelir-gider raporları ve finansal analizleri takip etmek için Premium paket gereklidir.',
  },
  'gelir-gider-kategori': {
    minPlan: 'Premium',
    minLevel: 3,
    featureTitle: 'Gelir/Gider Kategori Yönetimi',
    description: 'Finansal kategori ağacını düzenlemek için Premium paket gereklidir.',
  },
  'gelir-gider-yonetimi': {
    minPlan: 'Premium',
    minLevel: 3,
    featureTitle: 'Gelir & Gider Hareketleri',
    description: 'Finansal nakit akışını ve fatura hareketlerini kaydetmek için Premium paket gereklidir.',
  },

  // Kurumsal (Level 4) Requirements
  'sporpuan-degerlendirmeler': {
    minPlan: 'Kurumsal',
    minLevel: 4,
    featureTitle: 'Sporpuan İtibar & Değerlendirme Sistemi',
    description: 'Sporcuların performans puanlaması ve veli itibar değerlendirmelerini açmak için Kurumsal paket gereklidir.',
  },
  'sporpuan-dogrulamalar': {
    minPlan: 'Kurumsal',
    minLevel: 4,
    featureTitle: 'Sporpuan Doğrulama Portalı',
    description: 'Sporpuan sertifika ve başarı doğrulamaları Kurumsal paket yetkisindedir.',
  },
  'sporpuan-raporlar': {
    minPlan: 'Kurumsal',
    minLevel: 4,
    featureTitle: 'Sporpuan Analiz & Federasyon Raporları',
    description: 'Gelişmiş itibar analitikleri ve resmi federasyon raporları Kurumsal paket kapsamındadır.',
  },
};

export const ACTIVE_PLAN_STORAGE_KEY = 'sportsfly_active_plan_v2';

/**
 * Get current active session plan
 */
export function getActiveSessionPlan(): PackagePlanType {
  if (typeof window === 'undefined') return 'Premium';
  try {
    const stored = localStorage.getItem(ACTIVE_PLAN_STORAGE_KEY);
    if (stored && ['Başlangıç', 'Profesyonel', 'Premium', 'Kurumsal'].includes(stored)) {
      return stored as PackagePlanType;
    }
  } catch (e) {}
  return 'Premium';
}

/**
 * Save active session plan and notify listeners
 */
export function setActiveSessionPlan(plan: PackagePlanType) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACTIVE_PLAN_STORAGE_KEY, plan);
    window.dispatchEvent(
      new CustomEvent('sportsfly_plan_updated', { detail: { plan } })
    );
    window.dispatchEvent(
      new CustomEvent('sportsfly_plan_changed', { detail: { plan } })
    );
  } catch (e) {}
}

/**
 * Check if a page is allowed for a given package type
 */
export function isPageAllowedForPlan(page: NavPage, plan: PackagePlanType): boolean {
  const restriction = PAGE_RESTRICTIONS[page];
  if (!restriction) return true; // No restriction defined, open to all

  const currentLevel = PACKAGE_DETAILS[plan]?.level || 3;
  return currentLevel >= restriction.minLevel;
}

/**
 * Get restriction info for a page if restricted
 */
export function getPageRestrictionInfo(
  page: NavPage,
  plan?: PackagePlanType
): PageRestrictionRule | null {
  const restriction = PAGE_RESTRICTIONS[page];
  if (!restriction) return null;

  if (plan) {
    const currentLevel = PACKAGE_DETAILS[plan]?.level || 3;
    if (currentLevel < restriction.minLevel) {
      return restriction;
    }
    return null;
  }

  return restriction;
}
