import { EntegrasyonItem } from '../types';

export const INITIAL_INTEGRATIONS: EntegrasyonItem[] = [
  {
    id: 'int-sporpuan',
    name: 'Sporpuan İtibar & Değerlendirme',
    category: 'Kulüp & Spor Modülleri',
    description: 'Sporcu teknik, taktik, devam ve fair-play puanlama altyapısı. Dijital rozetler ve federasyon onaylı karne entegrasyonu.',
    logoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&auto=format&fit=crop&q=80',
    iconName: 'Star',
    isRecommended: true,
    isActive: true,
    isInternalModule: true,
    targetPage: 'sporpuan',
    connectedAt: '15.01.2024',
  },
  {
    id: 'int-turnuva',
    name: 'Turnuva & Fikstür Yönetimi',
    category: 'Kulüp & Spor Modülleri',
    description: 'Lig ve kupa organizasyonu, fikstür takvimi, anlık maç skoru girişi ve otomatik güncellenen puan durumu cetveli.',
    logoUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=200&auto=format&fit=crop&q=80',
    iconName: 'Trophy',
    isRecommended: true,
    isActive: true,
    isInternalModule: true,
    targetPage: 'turnuva-yonetimi',
    connectedAt: '01.03.2024',
  },
  {
    id: 'int-envanter',
    name: 'Envanter & Malzeme Takibi',
    category: 'Kulüp & Spor Modülleri',
    description: 'Toplar, formalar, sağlık kitleri ve salon ekipmanlarının stok sayımı, zimmet atamaları ve kritik stok alarmları.',
    logoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200&auto=format&fit=crop&q=80',
    iconName: 'Boxes',
    isRecommended: true,
    isActive: true,
    isInternalModule: true,
    targetPage: 'envanter-yonetimi',
    connectedAt: '10.02.2024',
  },
  {
    id: 'int-iyzico',
    name: 'İyzico Sanal POS',
    category: 'Ödeme Yöntemleri',
    description: 'Kredi kartı ve banka kartı ile 3D Secure güvencesinde online aidat tahsilatı ve taksit imkanı.',
    iconName: 'CreditCard',
    isRecommended: true,
    isActive: true,
    isInternalModule: false,
    connectedAt: '20.01.2024',
  },
  {
    id: 'int-paytr',
    name: 'PayTR Ödeme Altyapısı',
    category: 'Ödeme Yöntemleri',
    description: 'Düşük komisyon ve ertesi gün hesaba geçen alternatif sanal POS ve havale/EFT ödeme geçidi.',
    iconName: 'CreditCard',
    isRecommended: false,
    isActive: false,
    isInternalModule: false,
  },
  {
    id: 'int-whatsapp',
    name: 'WhatsApp Business API',
    category: 'İletişim & Bildirim',
    description: 'Karneler, devamsızlık bildirimleri ve aidat hatırlatmalarını velilerin WhatsApp hattına otomatik iletir.',
    iconName: 'MessageSquare',
    isRecommended: true,
    isActive: true,
    isInternalModule: false,
    connectedAt: '05.02.2024',
  },
  {
    id: 'int-netgsm',
    name: 'Netgsm Başlıklı SMS',
    category: 'İletişim & Bildirim',
    description: 'Kulübünüze özel resmi SMS başlığıyla tek dokunuşla seans iptali ve toplu veli SMS gönderimi.',
    iconName: 'PhoneCall',
    isRecommended: false,
    isActive: true,
    isInternalModule: false,
    connectedAt: '12.01.2024',
  },
  {
    id: 'int-parasut',
    name: 'Paraşüt e-Fatura & Muhasebe',
    category: 'Faturalandırma & Muhasebe',
    description: 'Tahsil edilen aidatlar için tek tıkla GİB onaylı e-Arşiv veya e-Fatura oluşturma ve kasa entegrasyonu.',
    iconName: 'Receipt',
    isRecommended: true,
    isActive: false,
    isInternalModule: false,
  },
  {
    id: 'int-ical',
    name: 'Google Calendar / iCal Takvim',
    category: 'Takvim & Senkronizasyon',
    description: 'Antrenman ve maç seanslarını veli ve antrenörlerin Google ve Apple takvimleriyle anlık senkronize eder.',
    iconName: 'Calendar',
    isRecommended: true,
    isActive: true,
    isInternalModule: false,
    connectedAt: '18.01.2024',
  },
  {
    id: 'int-polar',
    name: 'Polar Team Nabız & GPS',
    category: 'Giyilebilir & GPS',
    description: 'Göğüs bantlarından gelen canlı nabız bölgeleri ve antrenman yükü verilerini sporcu profiline kaydeder.',
    iconName: 'Activity',
    isRecommended: false,
    isActive: false,
    isInternalModule: false,
  },
  {
    id: 'int-catapult',
    name: 'Catapult Atletik GPS Sensörleri',
    category: 'Giyilebilir & GPS',
    description: 'Yüksek tempolu koşu mesafesi, maksimum sprint hızı ve ivmelenme verilerini analitik panele aktarır.',
    iconName: 'Flame',
    isRecommended: false,
    isActive: false,
    isInternalModule: false,
  },
];

const INTEGRATIONS_STORAGE_KEY = 'sportsfly_integrations_list_v2';

export function getStoredIntegrations(): EntegrasyonItem[] {
  try {
    // Check both v2 and legacy storage keys
    const raw = localStorage.getItem(INTEGRATIONS_STORAGE_KEY) || localStorage.getItem('sportsfly_integrations_list_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Sanitize any legacy cached items so that 'SporPuan' is always transformed to 'Sporpuan'
        const sanitized: EntegrasyonItem[] = parsed.map((item: EntegrasyonItem) => {
          if (item.id === 'int-sporpuan') {
            return {
              ...item,
              name: 'Sporpuan İtibar & Değerlendirme',
              description: 'Sporcu teknik, taktik, devam ve fair-play puanlama altyapısı. Dijital rozetler ve federasyon onaylı karne entegrasyonu.',
            };
          }
          return {
            ...item,
            name: item.name ? item.name.replace(/SporPuan/g, 'Sporpuan').replace(/Spor Puan/g, 'Sporpuan') : item.name,
            description: item.description ? item.description.replace(/SporPuan/g, 'Sporpuan').replace(/Spor Puan/g, 'Sporpuan') : item.description,
          };
        });
        return sanitized;
      }
    }
  } catch (e) {
    console.error('Entegrasyonlar yüklenirken hata:', e);
  }
  return INITIAL_INTEGRATIONS;
}

export function saveStoredIntegrations(items: EntegrasyonItem[]): void {
  try {
    localStorage.setItem(INTEGRATIONS_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('sportsfly_integrations_updated'));
  } catch (e) {
    console.error('Entegrasyonlar kaydedilirken hata:', e);
  }
}
