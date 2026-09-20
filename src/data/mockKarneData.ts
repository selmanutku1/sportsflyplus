export interface SporcuKarne {
  id: string;
  sporcuId: string;
  adSoyad: string;
  brans: string;
  grup: string;
  yasGubu: string;
  tarih: string; // Report date
  antrenor: string;
  boy: number; // cm
  kilo: number; // kg
  
  // Evaluation categories (out of 10)
  teknik: {
    topKontrolu?: number;
    pasBasarisi?: number;
    sut?: number;
    topSurme?: number;
    savunma?: number;
    ortalama: number;
  };
  fiziksel: {
    hiz?: number;
    dayaniklilik?: number;
    guc?: number;
    ceviklik?: number;
    ortalama: number;
  };
  taktiksel: {
    oyunZekasi?: number;
    pozisyonAlma?: number;
    kararVerme?: number;
    ortalama: number;
  };
  zihinsel: {
    disiplin?: number;
    ozguven?: number;
    takimUyumu?: number;
    liderlik?: number;
    ortalama: number;
  };

  // Additional Stats
  katilimYuzdesi: number;
  antrenmanSayisi: number;
  
  // Behavioral Development Process
  davranissal: {
    kriterler: {
      fairPlay: number;
      sorumlulukEkipman: number;
      saygiIletisim: number;
      yonergeyeUyum: number;
      duyguKontrolu: number;
      ortalama: number;
    };
    kazanimlar: {
      id?: string;
      rozetId?: string;
      baslik: string;
      aciklama: string;
      kategori?: string;
      tarih?: string;
      onemDerecesi?: string;
    }[];
    surecTakibi: {
      donem: string;
      tarih: string;
      durum: 'Gelişiyor' | 'Hedefe Ulaştı' | 'Örnek Davranış';
      odakKonusu: string;
      gozlem: string;
    }[];
    bagimlilikVeAliskanlik?: {
      ekranDengesi: {
        puan: number;
        seviye: 'Dengeli & Bilinçli' | 'Geliştirilmeli' | 'Riskli';
        aciklama: string;
      };
      zararliAliskanlik: {
        puan: number;
        seviye: 'Bilinçli (Örnek)' | 'Takip Ediliyor' | 'Riskli' | 'Temiz Spor (Örnek)';
        aciklama: string;
      };
      uykuVeDinlenme: {
        puan: number;
        seviye: 'Düzenli (8+ Saat)' | 'Düzensiz' | 'Yetersiz';
        aciklama: string;
      };
      genelFarkindalik: 'Örnek & Bilinçli' | 'Dengeli' | 'Destek Gerekli';
      egitmenGorus: string;
    };
    genelDegerlendirme: string;
  };

  // Notes
  antrenorNotu: string;
  gelisimAlanlari: string[];

  // Veli ve İletişim Bilgileri (WhatsApp / SMS Gönderimi için)
  veliAdSoyad?: string;
  veliTelefon?: string;
  veliEposta?: string;
  veliYakinlik?: 'Anne' | 'Baba' | 'Vasi' | 'Diğer';
}

export const INITIAL_KARNELER: SporcuKarne[] = [
  {
    id: 'k1',
    sporcuId: 's1',
    adSoyad: 'Kaan Yıldırım',
    brans: 'Basketbol',
    grup: 'U14 Anadolu Efes Altyapı',
    yasGubu: 'U14',
    tarih: '2023-11-20',
    antrenor: 'Selman Utku',
    boy: 172,
    kilo: 64,
    veliAdSoyad: 'Murat Yıldırım',
    veliTelefon: '+90 532 456 78 90',
    veliEposta: 'murat.yildirim@gmail.com',
    veliYakinlik: 'Baba',
    teknik: {
      topKontrolu: 8,
      pasBasarisi: 7,
      sut: 9,
      topSurme: 8,
      savunma: 6,
      ortalama: 7.6
    },
    fiziksel: {
      hiz: 7,
      dayaniklilik: 8,
      guc: 6,
      ceviklik: 8,
      ortalama: 7.25
    },
    taktiksel: {
      oyunZekasi: 8,
      pozisyonAlma: 7,
      kararVerme: 8,
      ortalama: 7.66
    },
    zihinsel: {
      disiplin: 9,
      ozguven: 8,
      takimUyumu: 9,
      liderlik: 7,
      ortalama: 8.25
    },
    katilimYuzdesi: 95,
    antrenmanSayisi: 24,
    davranissal: {
      kriterler: {
        fairPlay: 9,
        sorumlulukEkipman: 8,
        saygiIletisim: 9,
        yonergeyeUyum: 8,
        duyguKontrolu: 8,
        ortalama: 8.4
      },
      kazanimlar: [
        {
          baslik: 'Fair-Play & Centilmenlik',
          aciklama: 'Rakip ve hakem kararlarına her daim saygılı ve sportmen yaklaşım.'
        },
        {
          baslik: 'Takım Ruhu & Yardımlaşma',
          aciklama: 'Hata yapan arkadaşlarına moral vererek saha içi birlikteliği pekiştiriyor.'
        },
        {
          baslik: 'Ekipman & Düzen Bilinci',
          aciklama: 'Antrenman öncesi ve sonrası malzeme düzeninde aktif sorumluluk alıyor.'
        }
      ],
      surecTakibi: [
        {
          donem: '1. Dönem (Eylül)',
          tarih: '2023-09-30',
          durum: 'Gelişiyor',
          odakKonusu: 'Dinleme ve Odaklanma',
          gozlem: 'Antrenman molalarında zaman zaman dikkat dağınıklığı gözlemlendi; koç yönlendirmeleriyle hızlı toparlandı.'
        },
        {
          donem: '2. Dönem (Ekim)',
          tarih: '2023-10-31',
          durum: 'Hedefe Ulaştı',
          odakKonusu: 'Duygu Kontrolü & Maç Stresi',
          gozlem: 'Maç içi gergin anlarda sakin kalıp enerjisini taktiksel disipline aktarmayı başardı.'
        },
        {
          donem: '3. Dönem (Kasım)',
          tarih: '2023-11-20',
          durum: 'Örnek Davranış',
          odakKonusu: 'Saha İçi Liderlik ve Rol Modellik',
          gozlem: 'Centilmenliği, çalışma azmi ve takım arkadaşlarına yapıcı geri bildirimleriyle örnek sporcu seviyesine ulaştı.'
        }
      ],
      bagimlilikVeAliskanlik: {
        ekranDengesi: {
          puan: 8.5,
          seviye: 'Dengeli & Bilinçli',
          aciklama: 'Antrenman ve maç günlerinde telefon süresini başarıyla kısıtlıyor, oyun süreleri kontrollü.'
        },
        zararliAliskanlik: {
          puan: 10,
          seviye: 'Bilinçli (Örnek)',
          aciklama: 'Tütün, elektronik sigara ve enerji içeceklerine karşı tam bilinç; sağlıklı sporcu disiplini taşıyor.'
        },
        uykuVeDinlenme: {
          puan: 9.0,
          seviye: 'Düzenli (8+ Saat)',
          aciklama: 'Gece ekran kısıtlaması ile uyku ritmini koruyor, sabah antrenmanlarına dinç katılıyor.'
        },
        genelFarkindalik: 'Örnek & Bilinçli',
        egitmenGorus: 'Kaan, saha dışı yaşam alışkanlıklarında ve dijital denge konusunda altyapıdaki arkadaşlarına örnek bir disiplin sergilemektedir.'
      },
      genelDegerlendirme: 'Kaan, antrenman ciddiyeti, hakem kararlarına olgun yaklaşımı ve arkadaşlarına aşıladığı pozitif enerjiyle örnek bir sporcu karakteri sergilemektedir.'
    },
    antrenorNotu: 'Kaan bu dönem özellikle şut yüzdesinde büyük gelişim gösterdi. Fiziksel güçlenme çalışmalarına ağırlık vermesi gerekiyor. Takım içindeki uyumu ve antrenman disiplini takdire şayan.',
    gelisimAlanlari: ['Fiziksel Güç', 'Birebir Savunma']
  },
  {
    id: 'k2',
    sporcuId: 's2',
    adSoyad: 'Emirhan Örnek',
    brans: 'Basketbol',
    grup: 'U14 Anadolu Efes Altyapı',
    yasGubu: 'U14',
    tarih: '2023-11-20',
    antrenor: 'Selman Utku',
    boy: 168,
    kilo: 58,
    veliAdSoyad: 'Aysel Örnek',
    veliTelefon: '+90 533 987 65 43',
    veliEposta: 'aysel.ornek@gmail.com',
    veliYakinlik: 'Anne',
    teknik: {
      topKontrolu: 9,
      pasBasarisi: 9,
      sut: 7,
      topSurme: 9,
      savunma: 7,
      ortalama: 8.2
    },
    fiziksel: {
      hiz: 9,
      dayaniklilik: 7,
      guc: 5,
      ceviklik: 9,
      ortalama: 7.5
    },
    taktiksel: {
      oyunZekasi: 9,
      pozisyonAlma: 8,
      kararVerme: 9,
      ortalama: 8.66
    },
    zihinsel: {
      disiplin: 8,
      ozguven: 9,
      takimUyumu: 8,
      liderlik: 9,
      ortalama: 8.5
    },
    katilimYuzdesi: 88,
    antrenmanSayisi: 21,
    davranissal: {
      kriterler: {
        fairPlay: 8,
        sorumlulukEkipman: 9,
        saygiIletisim: 9,
        yonergeyeUyum: 9,
        duyguKontrolu: 8,
        ortalama: 8.6
      },
      kazanimlar: [
        {
          baslik: 'Zaman Yönetimi & Dakiklik',
          aciklama: 'Antrenmanlara 15 dakika önce gelerek ısınma rutinini eksiksiz tamamlar.'
        },
        {
          baslik: 'Koç Yönergelerine Yüksek Uyum',
          aciklama: 'Mola esnasında verilen stratejik direktifleri sahada anında uygular.'
        }
      ],
      surecTakibi: [
        {
          donem: '1. Dönem (Eylül)',
          tarih: '2023-09-30',
          durum: 'Hedefe Ulaştı',
          odakKonusu: 'Sorumluluk Bilinci & Hazırlık',
          gozlem: 'Antrenman disiplini ve malzeme düzeni konusunda baştan sona eksiksiz tutum.'
        },
        {
          donem: '2. Dönem (Ekim)',
          tarih: '2023-10-31',
          durum: 'Hedefe Ulaştı',
          odakKonusu: 'Yapıcı İletişim',
          gozlem: 'Oyun kurucu olarak takım arkadaşlarıyla pozitif iletişim kurarak hücum temposunu yönetti.'
        },
        {
          donem: '3. Dönem (Kasım)',
          tarih: '2023-11-20',
          durum: 'Örnek Davranış',
          odakKonusu: 'Hata Karşısında Dayanıklılık',
          gozlem: 'Top kayıpları sonrasında demoralize olmadan anında savunmaya dönerek sorumluluk aldı.'
        }
      ],
      bagimlilikVeAliskanlik: {
        ekranDengesi: {
          puan: 7.5,
          seviye: 'Dengeli & Bilinçli',
          aciklama: 'Sosyal medya ve mobil oyun süresinde veli desteğiyle sağlıklı bir denge oturttu.'
        },
        zararliAliskanlik: {
          puan: 10,
          seviye: 'Bilinçli (Örnek)',
          aciklama: 'Zararlı alışkanlıklara karşı tam farkındalık; beslenmesinde paketli abur cuburları azalttı.'
        },
        uykuVeDinlenme: {
          puan: 8.0,
          seviye: 'Düzenli (8+ Saat)',
          aciklama: 'Hafta içi uyku saatleri çok düzenli, hafta sonları dinlenme süreleri korunuyor.'
        },
        genelFarkindalik: 'Dengeli',
        egitmenGorus: 'Emirhan hem beslenme hem de dijital alışkanlıklarında sporcu disiplinine özen gösteriyor.'
      },
      genelDegerlendirme: 'Emirhan disiplinli yapısıyla antrenmanların kalitesini artıran, saygılı ve gelişime açık profesyonel bir tutum sergilemektedir.'
    },
    antrenorNotu: 'Emirhan oyun kurucu pozisyonunda takımın beyni. Çok hızlı ve çevik ancak fiziksel olarak rakiplerine karşı dezavantajlı duruma düşebiliyor. Kondisyon ve kuvvet çalışmalarına odaklanacağız.',
    gelisimAlanlari: ['Kuvvet', 'Şut İstikrarı']
  },
  {
    id: 'k3',
    sporcuId: 's11',
    adSoyad: 'Semih Utku',
    brans: 'Futbol',
    grup: 'Ayazağa Hafta Sonu',
    yasGubu: 'U16',
    tarih: '2023-11-25',
    antrenor: 'Selman Utku',
    boy: 173,
    kilo: 68,
    veliAdSoyad: 'Hakan Utku',
    veliTelefon: '+90 542 321 88 99',
    veliEposta: 'hakan.utku@gmail.com',
    veliYakinlik: 'Baba',
    teknik: {
      topKontrolu: 8,
      pasBasarisi: 7,
      sut: 8,
      topSurme: 9,
      savunma: 6,
      ortalama: 7.6
    },
    fiziksel: {
      hiz: 10,
      dayaniklilik: 9,
      guc: 7,
      ceviklik: 9,
      ortalama: 8.75
    },
    taktiksel: {
      oyunZekasi: 7,
      pozisyonAlma: 9,
      kararVerme: 6,
      ortalama: 7.33
    },
    zihinsel: {
      disiplin: 8,
      ozguven: 9,
      takimUyumu: 8,
      liderlik: 7,
      ortalama: 8.0
    },
    katilimYuzdesi: 98,
    antrenmanSayisi: 32,
    davranissal: {
      kriterler: {
        fairPlay: 8,
        sorumlulukEkipman: 8,
        saygiIletisim: 8,
        yonergeyeUyum: 8,
        duyguKontrolu: 7,
        ortalama: 7.8
      },
      kazanimlar: [
        {
          baslik: 'Yüksek Mücadele Ruhu',
          aciklama: 'Zorlu maç şartlarında bile pes etmeyen, takımı ateşleyen mücadeleci yapı.'
        },
        {
          baslik: 'Özveri & Çalışkanlık',
          aciklama: 'Ekstra idman talepleri ve kendini geliştirme hevesi üst düzeyde.'
        }
      ],
      surecTakibi: [
        {
          donem: '1. Dönem (Ekim)',
          tarih: '2023-10-31',
          durum: 'Gelişiyor',
          odakKonusu: 'Öfke Kontrolü & Hakem Kararları',
          gozlem: 'İkili mücadeleler sonrası verilen aleyhte kararlarda itiraz eğilimi azaltıldı.'
        },
        {
          donem: '2. Dönem (Kasım)',
          tarih: '2023-11-25',
          durum: 'Hedefe Ulaştı',
          odakKonusu: 'Centilmenlik & Rakibe Saygı',
          gozlem: 'Ters durumlarda oyuna konsantre kalıp profesyonel bir duruş sergilemeye başladı.'
        }
      ],
      bagimlilikVeAliskanlik: {
        ekranDengesi: {
          puan: 8.0,
          seviye: 'Dengeli & Bilinçli',
          aciklama: 'Futbol analiz videoları haricinde oyun ve sosyal medya süresini planlı tutuyor.'
        },
        zararliAliskanlik: {
          puan: 10,
          seviye: 'Bilinçli (Örnek)',
          aciklama: 'Enerji içeceklerinden kesinlikle uzak duruyor, doğal hidrasyona özen gösteriyor.'
        },
        uykuVeDinlenme: {
          puan: 8.5,
          seviye: 'Düzenli (8+ Saat)',
          aciklama: 'Maç öncesi dinlenme günlerinde erken uyuma disiplinine sadık kalıyor.'
        },
        genelFarkindalik: 'Örnek & Bilinçli',
        egitmenGorus: 'Semih yüksek fiziksel performansını zararlı maddelerden uzak kalarak ve dinlenmesine sadık kalarak destekliyor.'
      },
      genelDegerlendirme: 'Semih yüksek kazanma arzusunu centilmenlik ve takım dayanışmasıyla harmanladıkça hem saha içinde hem de dışında gerçek bir sporcu olgunluğu kazanıyor.'
    },
    antrenorNotu: 'Semih çok hızlı ve patlayıcı gücü yüksek. Ancak son paslardaki karar verme mekanizmasını geliştirmesi gerekiyor. Kanatta oynadığı zaman takımın en önemli hücum silahı.',
    gelisimAlanlari: ['Karar Verme', 'Son Paslar']
  }
];

export const KARNELER_STORAGE_KEY = 'sportsfly_karneler_store_v1';

export function getStoredKarneler(): SporcuKarne[] {
  if (typeof window === 'undefined') return INITIAL_KARNELER;
  try {
    const raw = localStorage.getItem(KARNELER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((k: any) => {
          if (k?.davranissal?.bagimlilikVeAliskanlik?.zararliAliskanlik?.seviye === 'Temiz Spor (Örnek)') {
            k.davranissal.bagimlilikVeAliskanlik.zararliAliskanlik.seviye = 'Bilinçli (Örnek)';
          }
          if (k?.davranissal?.bagimlilikVeAliskanlik?.zararliAliskanlik?.aciklama) {
            k.davranissal.bagimlilikVeAliskanlik.zararliAliskanlik.aciklama = k.davranissal.bagimlilikVeAliskanlik.zararliAliskanlik.aciklama
              .replace(/temiz sporcu kimliği/gi, 'sağlıklı sporcu disiplini')
              .replace(/temiz spor/gi, 'sağlıklı yaşam');
          }
          // Ensure parent info exists
          if (!k.veliTelefon) {
            const initialMatch = INITIAL_KARNELER.find(ik => ik.id === k.id || ik.adSoyad === k.adSoyad);
            if (initialMatch) {
              k.veliAdSoyad = initialMatch.veliAdSoyad;
              k.veliTelefon = initialMatch.veliTelefon;
              k.veliEposta = initialMatch.veliEposta;
              k.veliYakinlik = initialMatch.veliYakinlik;
            } else {
              const surname = (k.adSoyad || '').split(' ').slice(-1)[0] || 'Veli';
              k.veliAdSoyad = `Ahmet ${surname}`;
              k.veliTelefon = '+90 532 555 01 23';
              k.veliEposta = `veli.${surname.toLowerCase()}@gmail.com`;
              k.veliYakinlik = 'Veli';
            }
          }
          return k;
        });
      }
    }
  } catch (e) {
    console.error('Error reading karneler from localStorage', e);
  }
  return INITIAL_KARNELER;
}

export function saveStoredKarneler(karneler: SporcuKarne[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KARNELER_STORAGE_KEY, JSON.stringify(karneler));
    window.dispatchEvent(new CustomEvent('sportsfly_karneler_updated', { detail: { karneler } }));
  } catch (e) {
    console.error('Error saving karneler to localStorage', e);
  }
}
