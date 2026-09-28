import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Phone,
  User,
  ShieldCheck,
  Eye,
  RefreshCw,
  Sparkles,
  MapPin,
  Calendar,
  X,
  Check,
  Ban,
  BadgeAlert,
  Globe,
  Webhook,
  Copy,
  Send,
  Users,
  Video,
  Code2,
  Lock,
} from 'lucide-react';
import { sendMutlucellSms } from '../../services/smsService';
import { getStoredUserProfile } from '../../data/userProfile';
import { isSuperAdminUser } from '../../data/packagePermissions';

export interface ClubRegistrationRequest {
  id: string;
  requestType?: 'spor_okulu_basvurusu' | 'demo_rezervasyonu';
  source?: string;
  clubName: string;
  managerName: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  branches: string[];
  selectedPlan: string;
  athleteCount?: string;
  demoDate?: string;
  demoTime?: string;
  createdAt: string;
  status: 'onay_bekliyor' | 'onaylandi' | 'reddedildi' | 'askida';
  notes?: string;
  rejectionReason?: string;
  approvedAt?: string;
  smsSentAt?: string;
}

const INITIAL_REGISTRATION_REQUESTS: ClubRegistrationRequest[] = [
  {
    id: 'req_101',
    requestType: 'demo_rezervasyonu',
    source: 'sportsfly.com.tr',
    clubName: 'Kadıköy Basketbol Akademisi',
    managerName: 'Selman Utku Marmara',
    email: 'selman@kadikoybasket.com',
    phone: '0532 123 45 67',
    city: 'İstanbul',
    district: 'Kadıköy',
    branches: ['Basketbol'],
    selectedPlan: 'Pro Akademi & Çoklu Şube',
    athleteCount: '350+',
    demoDate: '2026-09-30',
    demoTime: '14:00',
    createdAt: '2026-09-28 04:30',
    status: 'onay_bekliyor',
    notes: 'Web sitesi (sportsfly.com.tr) üzerinden canlı demo sunumu ve 2 salon için kurulum talebi iletildi.',
  },
  {
    id: 'req_102',
    requestType: 'spor_okulu_basvurusu',
    source: 'sportsfly.com.tr',
    clubName: 'Anadolu Voleybol Gençlik Kulübü',
    managerName: 'Elif Zeynep Aydın',
    email: 'info@anadoluvoleybol.org',
    phone: '0533 987 65 43',
    city: 'Ankara',
    district: 'Çankaya',
    branches: ['Voleybol'],
    selectedPlan: 'Kulüp & Akademi',
    athleteCount: '120-250',
    createdAt: '2026-09-27 18:15',
    status: 'onay_bekliyor',
    notes: 'Web sitesi spor okulu başvuru formundan doğrudan kayıt talebi.',
  },
  {
    id: 'req_103',
    requestType: 'demo_rezervasyonu',
    source: 'sportsfly.com.tr',
    clubName: 'İzmir Gelişim Atletizm Spor Kulübü',
    managerName: 'Murat Kara',
    email: 'murat@izmiratletizm.com',
    phone: '0542 555 12 34',
    city: 'İzmir',
    district: 'Alsancak',
    branches: ['Atletizm', 'Cimnastik'],
    selectedPlan: 'Başlangıç Kulübü',
    athleteCount: '85',
    demoDate: '2026-09-27',
    demoTime: '11:00',
    createdAt: '2026-09-26 11:20',
    status: 'onaylandi',
    approvedAt: '2026-09-26 14:00',
    notes: 'Demo görüşmesi tamamlandı, tesis onay belgeleri doğrulandı.',
  },
  {
    id: 'req_104',
    requestType: 'spor_okulu_basvurusu',
    source: 'webapp.sportsfly.com.tr',
    clubName: 'Bursa Yıldızlar Futbol Okulu',
    managerName: 'Ahmet Yılmaz',
    email: 'ahmet@bursayildizlar.com',
    phone: '0535 444 88 99',
    city: 'Bursa',
    district: 'Nilüfer',
    branches: ['Futbol'],
    selectedPlan: 'Kulüp & Akademi',
    athleteCount: '210',
    createdAt: '2026-09-25 15:45',
    status: 'onaylandi',
    approvedAt: '2026-09-25 16:30',
  },
  {
    id: 'req_105',
    requestType: 'spor_okulu_basvurusu',
    source: 'sportsfly.com.tr',
    clubName: 'Antalya Yüzme Akademisi',
    managerName: 'Ceren Demir',
    email: 'ceren@antalyayuzme.com',
    phone: '0505 333 22 11',
    city: 'Antalya',
    district: 'Muratpaşa',
    branches: ['Yüzme'],
    selectedPlan: 'Pro Akademi & Çoklu Şube',
    athleteCount: '180',
    createdAt: '2026-09-24 09:10',
    status: 'reddedildi',
    rejectionReason: 'Vergi levhası ve yetki belgesi eksik / doğrulanamadı.',
  },
];

export const SporOkuluBasvurulariView: React.FC = () => {
  const [requests, setRequests] = useState<ClubRegistrationRequest[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('sportsfly_club_applications_v1');
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (e) {}
    }
    return INITIAL_REGISTRATION_REQUESTS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'tumu' | 'onay_bekliyor' | 'onaylandi' | 'reddedildi' | 'askida'
  >('tumu');
  const [typeFilter, setTypeFilter] = useState<
    'tumu' | 'spor_okulu_basvurusu' | 'demo_rezervasyonu'
  >('tumu');
  const [selectedRequest, setSelectedRequest] = useState<ClubRegistrationRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>('Şimdi');
  const [copiedCode, setCopiedCode] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Save to localStorage
  const saveRequestsToStorage = (updated: ClubRegistrationRequest[]) => {
    setRequests(updated);
    try {
      localStorage.setItem('sportsfly_club_applications_v1', JSON.stringify(updated));
    } catch (e) {}
  };

  // Fetch live applications & demo requests from GET /api/demo-requests
  const fetchLiveRequests = useCallback(async (showNotification = false) => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/demo-requests');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items)) {
          // Also merge any local-only items created in localStorage if not yet on server
          let merged: ClubRegistrationRequest[] = [...data.items];
          try {
            const localRaw = localStorage.getItem('sportsfly_club_applications_v1');
            if (localRaw) {
              const localItems: ClubRegistrationRequest[] = JSON.parse(localRaw);
              const serverIds = new Set(merged.map((m) => m.id));
              for (const loc of localItems) {
                if (loc && loc.id && !serverIds.has(loc.id)) {
                  merged.unshift(loc);
                }
              }
            }
          } catch {}

          setRequests(merged);
          try {
            localStorage.setItem('sportsfly_club_applications_v1', JSON.stringify(merged));
          } catch {}

          setLastSyncedAt(
            new Date().toLocaleTimeString('tr-TR', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
          );

          if (showNotification) {
            showToast(
              '🔄 POST /api/demo-requests uç noktasındaki tüm spor okulu başvuruları ve demo rezervasyonları senkronize edildi.',
              'info'
            );
          }
        }
      }
    } catch (err) {
      // Fallback to localStorage if offline
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Poll every 8 seconds for instantaneous display of incoming website forms
  useEffect(() => {
    fetchLiveRequests(false);
    const interval = setInterval(() => {
      fetchLiveRequests(false);
    }, 8000);
    return () => clearInterval(interval);
  }, [fetchLiveRequests]);

  // Simulate an incoming POST /api/demo-requests webhook from sportsfly.com.tr
  const handleSimulateIncomingWebhook = async (
    simType: 'demo_rezervasyonu' | 'spor_okulu_basvurusu'
  ) => {
    const sampleClubs = [
      {
        clubName: 'Beşiktaş Akademi Cimnastik & Yüzme Okulu',
        managerName: 'Kaan Özdemir',
        email: 'kaan@besiktasakademi.com.tr',
        phone: '0532 811 22 33',
        city: 'İstanbul',
        district: 'Beşiktaş',
        branches: ['Cimnastik', 'Yüzme'],
        selectedPlan: 'Pro Akademi & Çoklu Şube',
        athleteCount: '420',
      },
      {
        clubName: 'Çankaya Elit Tenis & Basketbol Kulübü',
        managerName: 'Zeynep Kaya',
        email: 'iletisim@cankayatenis.com.tr',
        phone: '0544 610 90 12',
        city: 'Ankara',
        district: 'Çankaya',
        branches: ['Tenis', 'Basketbol'],
        selectedPlan: 'Kulüp & Akademi',
        athleteCount: '190',
      },
      {
        clubName: 'Karşıyaka Olimpik Spor Okulları',
        managerName: 'Tolga Yavuz',
        email: 'tolga@karsiyakaolimpik.com',
        phone: '0533 412 77 88',
        city: 'İzmir',
        district: 'Karşıyaka',
        branches: ['Voleybol', 'Atletizm'],
        selectedPlan: 'Pro Akademi & Çoklu Şube',
        athleteCount: '310',
      },
    ];

    const pick = sampleClubs[Math.floor(Math.random() * sampleClubs.length)];
    const payload = {
      ...pick,
      requestType: simType,
      source: 'sportsfly.com.tr',
      demoDate: simType === 'demo_rezervasyonu' ? '2026-10-02' : undefined,
      demoTime: simType === 'demo_rezervasyonu' ? '15:30' : undefined,
      notes:
        simType === 'demo_rezervasyonu'
          ? 'sportsfly.com.tr üzerinden canlı Demo Rezervasyonu formu dolduruldu (POST /api/demo-requests).'
          : 'sportsfly.com.tr üzerinden yeni Spor Okulu Başvuru formu dolduruldu (POST /api/demo-requests).',
    };

    try {
      const res = await fetch('/api/demo-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        await fetchLiveRequests(false);
        showToast(
          `⚡ sportsfly.com.tr → POST /api/demo-requests: "${result.data.clubName}" başvurusu saniyesinde panele düştü!`,
          'success'
        );
      }
    } catch {
      showToast('Test isteği gönderilirken bağlantı hatası oluştu.', 'error');
    }
  };

  // Approve a request & dispatch SMS
  const handleApprove = async (id: string) => {
    const target = requests.find((r) => r.id === id);
    if (!target) return;

    const nowStr = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const updated = requests.map((r) =>
      r.id === id
        ? {
            ...r,
            status: 'onaylandi' as const,
            approvedAt: nowStr,
            smsSentAt: nowStr,
          }
        : r
    );

    saveRequestsToStorage(updated);

    // Sync with backend PATCH /api/demo-requests/:id
    try {
      await fetch(`/api/demo-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'onaylandi', sendSms: true }),
      });
    } catch {}

    // Send SMS Notification via Mutlucell
    const smsMsg =
      target.requestType === 'demo_rezervasyonu'
        ? `SPORTSFLY: Sayın ${target.managerName}, ${target.clubName} için ${target.demoDate || ''} ${target.demoTime || ''} demo rezervasyonunuz onaylanmıştır.`
        : `SPORTSFLY: Tebrikler! ${target.clubName} için oluşturduğunuz spor okulu kaydınız onaylanmıştır. Hemen giriş yapabilirsiniz.`;
    const smsRes = await sendMutlucellSms(target.phone, smsMsg);

    if (smsRes.success) {
      showToast(
        `✅ ${target.clubName} onaylandı! Mutlucell SMS bildirimi ${target.phone} numarasına gönderildi.`,
        'success'
      );
    } else {
      showToast(
        `✅ ${target.clubName} onaylandı, ancak SMS iletilemedi: ${smsRes.message}`,
        'info'
      );
    }

    if (selectedRequest?.id === id) {
      setSelectedRequest({ ...selectedRequest, status: 'onaylandi', approvedAt: nowStr });
    }
  };

  // Reject a request
  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    const reason = rejectionReasonInput.trim() || 'Gerekli belgeler doğrulanamadı.';
    const nowStr = new Date().toISOString().slice(0, 16).replace('T', ' ');

    const updated = requests.map((r) =>
      r.id === selectedRequest.id
        ? {
            ...r,
            status: 'reddedildi' as const,
            rejectionReason: reason,
            smsSentAt: nowStr,
          }
        : r
    );

    saveRequestsToStorage(updated);
    setIsRejectionModalOpen(false);

    // Sync with backend
    try {
      await fetch(`/api/demo-requests/${selectedRequest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'reddedildi',
          rejectionReason: reason,
          sendSms: true,
        }),
      });
    } catch {}

    // Send SMS Notification via Mutlucell
    const smsMsg = `SPORTSFLY: ${selectedRequest.clubName} başvurunuz incelendi. Nedeni: ${reason}`;
    await sendMutlucellSms(selectedRequest.phone, smsMsg);

    showToast(
      `❌ ${selectedRequest.clubName} başvurusu reddedildi ve SMS bilgilendirmesi yapıldı.`,
      'error'
    );
    setSelectedRequest(null);
  };

  // Suspend
  const handleSuspend = async (id: string) => {
    const updated = requests.map((r) =>
      r.id === id ? { ...r, status: 'askida' as const } : r
    );
    saveRequestsToStorage(updated);

    try {
      await fetch(`/api/demo-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'askida' }),
      });
    } catch {}

    showToast('⏸️ Kulüp hesabı geçici olarak askıya alındı.', 'info');
  };

  // Filtered requests
  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.clubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.managerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      r.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'tumu' ? true : r.status === statusFilter;
    const itemType = r.requestType || 'spor_okulu_basvurusu';
    const matchesType = typeFilter === 'tumu' ? true : itemType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Counts
  const totalCount = requests.length;
  const pendingCount = requests.filter((r) => r.status === 'onay_bekliyor').length;
  const approvedCount = requests.filter((r) => r.status === 'onaylandi').length;
  const rejectedCount = requests.filter(
    (r) => r.status === 'reddedildi' || r.status === 'askida'
  ).length;
  const demoCount = requests.filter((r) => r.requestType === 'demo_rezervasyonu').length;
  const clubRegCount = requests.filter(
    (r) => (r.requestType || 'spor_okulu_basvurusu') === 'spor_okulu_basvurusu'
  ).length;

  const webhookIntegrationSnippet = `// sportsfly.com.tr üzerindeki Başvuru ve Demo Rezervasyon Formundan Gönderim (Yöntem A)
await fetch('https://webapp.sportsfly.com.tr/api/demo-requests', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    requestType: 'demo_rezervasyonu', // veya 'spor_okulu_basvurusu'
    source: 'sportsfly.com.tr',
    clubName: 'Kadıköy Basketbol Akademisi',
    managerName: 'Ad Soyad',
    email: 'yetkili@kulup.com',
    phone: '0532 123 45 67',
    city: 'İstanbul',
    district: 'Kadıköy',
    branches: ['Basketbol', 'Voleybol'],
    selectedPlan: 'Kulüp & Akademi',
    athleteCount: '250',
    demoDate: '2026-10-05', // Sadece demo rezervasyonunda opsiyonel
    demoTime: '14:00',      // Sadece demo rezervasyonunda opsiyonel
    notes: 'Web sitesi üzerinden gelen başvuru / demo notu'
  }),
});`;

  const currentUserProfile = getStoredUserProfile();
  const isSuperAdmin = isSuperAdminUser(currentUserProfile?.role);

  if (!isSuperAdmin) {
    return (
      <div className="p-6 sm:p-10 max-w-xl mx-auto mt-10 text-center bg-white rounded-3xl border border-slate-200 shadow-lg space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Yetkisiz Erişim Alanı</h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          <strong>Spor Okulu Başvuruları &amp; Onay Merkezi</strong> modülü yalnızca{' '}
          <strong>Süper Admin</strong> yetkisine sahip sistem yöneticilerine açıktır.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      {/* Toast Banner */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 p-4 rounded-2xl shadow-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 max-w-md ${
            toastMessage.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : toastMessage.type === 'error'
              ? 'bg-rose-900 text-white border-rose-700'
              : 'bg-slate-900 text-white border-slate-700'
          }`}
        >
          <Sparkles className="w-5 h-5 shrink-0 text-amber-400" />
          <div className="text-xs font-semibold leading-relaxed flex-1">{toastMessage.text}</div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Süper Admin Yönetim Paneli</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>POST /api/demo-requests Aktif • Son Senkron: {lastSyncedAt}</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Spor Okulu Başvuruları &amp; Demo Rezervasyonları
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            <strong>sportsfly.com.tr</strong> ve <strong>webapp.sportsfly.com.tr</strong> üzerinden
            gelen tüm spor okulu kayıt başvuruları ve canlı demo talepleri saniyesinde bu ekrana
            düşer.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsWebhookModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Webhook className="w-4 h-4" />
            <span>Webhook &amp; Site Entegrasyonu (Yöntem A)</span>
          </button>

          <button
            onClick={() => fetchLiveRequests(true)}
            disabled={isSyncing}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Yenile</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Toplam Başvuru &amp; Demo
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{totalCount}</span>
              <span className="text-[10px] font-bold text-slate-400">
                ({clubRegCount} Kayıt • {demoCount} Demo)
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 shadow-xs flex items-center gap-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                Onay Bekleyen
              </span>
              {pendingCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block" />
              )}
            </div>
            <span className="text-2xl font-black text-amber-900">{pendingCount}</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Onaylanan Kulüpler
            </span>
            <span className="text-2xl font-black text-emerald-900">{approvedCount}</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
            <Ban className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Reddedilen / Askıda
            </span>
            <span className="text-2xl font-black text-slate-800">{rejectedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto text-xs font-bold shrink-0">
            <button
              onClick={() => setStatusFilter('tumu')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'tumu'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tümü ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter('onay_bekliyor')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'onay_bekliyor'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Onay Bekleyenler ({pendingCount})</span>
            </button>
            <button
              onClick={() => setStatusFilter('onaylandi')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'onaylandi'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Onaylananlar ({approvedCount})
            </button>
            <button
              onClick={() => setStatusFilter('reddedildi')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'reddedildi'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reddedilen / Askıda ({rejectedCount})
            </button>
          </div>

          {/* Request Type Filter (Spor Okulu Kaydı vs Demo Rezervasyonu) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto text-xs font-bold shrink-0">
            <button
              onClick={() => setTypeFilter('tumu')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                typeFilter === 'tumu'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tüm Türler
            </button>
            <button
              onClick={() => setTypeFilter('spor_okulu_basvurusu')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                typeFilter === 'spor_okulu_basvurusu'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Spor Okulu Kaydı ({clubRegCount})</span>
            </button>
            <button
              onClick={() => setTypeFilter('demo_rezervasyonu')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                typeFilter === 'demo_rezervasyonu'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Demo Rezervasyonu ({demoCount})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kulüp adı, yetkili, telefon veya şehir ara..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Spor Okulu / Kulüp &amp; Kaynak</th>
                <th className="py-3.5 px-4">Sorumlu Yönetici</th>
                <th className="py-3.5 px-4">Konum &amp; Branşlar</th>
                <th className="py-3.5 px-4">Tür / Paket / Randevu</th>
                <th className="py-3.5 px-4">Kayıt Tarihi</th>
                <th className="py-3.5 px-4 text-center">Durum</th>
                <th className="py-3.5 px-4 text-right">Eylemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Building2 className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-bold text-sm text-slate-600">
                      Aradığınız kriterlerde başvuru veya demo talebi bulunamadı.
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Filtreleri değiştirmeyi deneyebilirsiniz.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const isDemo = req.requestType === 'demo_rezervasyonu';
                  return (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Club Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl font-black flex items-center justify-center shrink-0 text-sm shadow-2xs ${
                              isDemo
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {req.clubName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 text-sm leading-tight">
                              {req.clubName}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                                <Globe className="w-2.5 h-2.5 text-blue-600" />
                                {req.source || 'sportsfly.com.tr'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                #{req.id}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Manager Info */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-800 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{req.managerName}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-blue-600" />
                              {req.phone}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Location & Branches */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="text-slate-700 font-semibold flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>
                              {req.city} / {req.district}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {req.branches.map((b, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-600"
                              >
                                {b}
                              </span>
                            ))}
                            {req.athleteCount && (
                              <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-[10px] font-bold text-indigo-700 flex items-center gap-0.5">
                                <Users className="w-2.5 h-2.5" />
                                {req.athleteCount} Sporcu
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Type, Plan & Demo Appointment */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            {isDemo ? (
                              <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-extrabold inline-flex items-center gap-1">
                                <Video className="w-3 h-3" />
                                Demo Rezervasyonu
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-extrabold inline-flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                Spor Okulu Kaydı
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-bold text-slate-700">
                            {req.selectedPlan}
                          </div>
                          {req.demoDate && (
                            <div className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded inline-flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Randevu: {req.demoDate} {req.demoTime || ''}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{req.createdAt}</span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        {req.status === 'onay_bekliyor' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-black text-[10px] border border-amber-300 animate-pulse">
                            <Clock className="w-3 h-3" />
                            <span>Onay Bekliyor</span>
                          </span>
                        )}
                        {req.status === 'onaylandi' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Onaylandı (Aktif)</span>
                          </span>
                        )}
                        {req.status === 'reddedildi' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-black text-[10px] border border-rose-300">
                            <XCircle className="w-3 h-3" />
                            <span>Reddedildi</span>
                          </span>
                        )}
                        {req.status === 'askida' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-black text-[10px] border border-slate-300">
                            <Ban className="w-3 h-3" />
                            <span>Askıya Alındı</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Approve Button */}
                          {req.status === 'onay_bekliyor' && (
                            <button
                              onClick={() => handleApprove(req.id)}
                              className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs flex items-center gap-1 cursor-pointer transition-all"
                              title="Kaydı onayla ve Mutlucell SMS gönder"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Onayla</span>
                            </button>
                          )}

                          {/* Reject Button */}
                          {req.status === 'onay_bekliyor' && (
                            <button
                              onClick={() => {
                                setSelectedRequest(req);
                                setRejectionReasonInput('');
                                setIsRejectionModalOpen(true);
                              }}
                              className="py-1.5 px-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] border border-rose-200 cursor-pointer transition-all"
                              title="Kaydı reddet"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reddet</span>
                            </button>
                          )}

                          {/* View Details Modal Trigger */}
                          <button
                            onClick={() => {
                              setSelectedRequest(req);
                              setIsDetailModalOpen(true);
                            }}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                            title="Kulüp detayları ve başvuru evrakları"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* WEBHOOK & SITE INTEGRATION MODAL (YÖNTEM A: POST /api/demo-requests) */}
      {isWebhookModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 text-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
                  <Webhook className="w-6 h-6" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                    Yöntem A • Anlık Webhook Karşılama Aktif
                  </span>
                  <h3 className="font-black text-lg text-slate-900 mt-0.5">
                    webapp.sportsfly.com.tr Entegrasyon Merkezi
                  </h3>
                  <p className="text-xs text-slate-500">
                    Web sitenizden doldurulan formlar saniyesinde bu panele düşer.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsWebhookModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Endpoint URL Box */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                  Canlı Karşılama Uç Noktası (CORS Açık)
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  HTTP 201 Created
                </span>
              </div>
              <div className="font-mono text-xs sm:text-sm font-bold text-white bg-slate-800 p-3 rounded-xl border border-slate-700 select-all">
                POST https://webapp.sportsfly.com.tr/api/demo-requests
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                <strong>sportsfly.com.tr</strong> üzerindeki &ldquo;Spor Okulu Başvuru&rdquo; ve
                &ldquo;Demo Rezervasyonu&rdquo; formlarınız bu adrese POST isteği attığı anda
                veriler sunucuya kaydedilir ve Süper Admin ekranına otomatik düşer.
              </p>
            </div>

            {/* Code Snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-blue-600" />
                  <span>Web Sitesi (sportsfly.com.tr) Gönderim Kodu Örneği</span>
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(webhookIntegrationSnippet);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2500);
                  }}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedCode ? 'Kopyalandı!' : 'Kodu Kopyala'}</span>
                </button>
              </div>
              <pre className="p-3.5 rounded-2xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                {webhookIntegrationSnippet}
              </pre>
            </div>

            {/* Live Webhook Simulator Buttons */}
            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-3">
              <div>
                <h4 className="text-xs font-extrabold text-blue-950">
                  ⚡ Canlı Entegrasyon Testi (Simülasyon)
                </h4>
                <p className="text-[11px] text-blue-800 mt-0.5">
                  Aşağıdaki butonlara tıklayarak <code>POST /api/demo-requests</code> uç noktasına
                  sanki <strong>sportsfly.com.tr</strong> üzerinden form doldurulmuş gibi gerçek bir
                  istek gönderebilirsiniz:
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => {
                    handleSimulateIncomingWebhook('demo_rezervasyonu');
                    setIsWebhookModalOpen(false);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Video className="w-4 h-4" />
                  <span>Test Demo Rezervasyonu Gönder</span>
                </button>

                <button
                  onClick={() => {
                    handleSimulateIncomingWebhook('spor_okulu_basvurusu');
                    setIsWebhookModalOpen(false);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Test Spor Okulu Başvurusu Gönder</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsWebhookModalOpen(false)}
                className="py-2.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {isDetailModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                  {selectedRequest.clubName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">
                    {selectedRequest.clubName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedRequest.requestType === 'demo_rezervasyonu'
                      ? 'Canlı Demo Rezervasyonu'
                      : 'Spor Okulu Başvuru Detayı'}{' '}
                    • Kaynak: {selectedRequest.source || 'sportsfly.com.tr'} • ID: #
                    {selectedRequest.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Sorumlu Yönetici
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {selectedRequest.managerName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    İletişim Telefonu
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    {selectedRequest.phone}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    E-Posta Adresi
                  </span>
                  <span className="font-bold text-slate-800">{selectedRequest.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/80">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-700 block">
                    Konum
                  </span>
                  <span className="font-bold text-slate-900">
                    {selectedRequest.city} / {selectedRequest.district}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-700 block">
                    Seçilen Paket &amp; Kapasite
                  </span>
                  <span className="font-bold text-slate-900">
                    {selectedRequest.selectedPlan}{' '}
                    {selectedRequest.athleteCount
                      ? `(${selectedRequest.athleteCount} Sporcu)`
                      : ''}
                  </span>
                </div>
                {selectedRequest.demoDate && (
                  <div className="col-span-2 pt-1 border-t border-blue-200/60">
                    <span className="text-[10px] uppercase font-bold text-purple-700 block">
                      Talep Edilen Demo Randevu Tarihi &amp; Saati
                    </span>
                    <span className="font-black text-purple-900 text-sm">
                      {selectedRequest.demoDate} • Saat: {selectedRequest.demoTime || 'Belirtilmedi'}
                    </span>
                  </div>
                )}
              </div>

              {selectedRequest.notes && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                  <span className="font-bold block text-[11px]">Başvuru / Demo Notu:</span>
                  <p className="text-xs leading-relaxed">{selectedRequest.notes}</p>
                </div>
              )}

              {selectedRequest.rejectionReason && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                  <span className="font-bold block text-[11px]">Red Gerekçesi:</span>
                  <p className="text-xs leading-relaxed">{selectedRequest.rejectionReason}</p>
                </div>
              )}
            </div>

            {/* Action Buttons in Modal */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              {selectedRequest.status === 'onay_bekliyor' && (
                <button
                  onClick={() => {
                    handleApprove(selectedRequest.id);
                    setIsDetailModalOpen(false);
                  }}
                  className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Başvuruyu Onayla &amp; SMS Gönder</span>
                </button>
              )}

              {selectedRequest.status === 'onaylandi' && (
                <button
                  onClick={() => {
                    handleSuspend(selectedRequest.id);
                    setIsDetailModalOpen(false);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Ban className="w-4 h-4" />
                  <span>Askıya Al</span>
                </button>
              )}

              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer ml-auto"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION MODAL */}
      {isRejectionModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 text-slate-800">
            <div className="flex items-center gap-3 text-rose-600">
              <BadgeAlert className="w-8 h-8 shrink-0" />
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Başvuruyu / Demo Talebini Reddet
                </h3>
                <p className="text-xs text-slate-500">{selectedRequest.clubName}</p>
              </div>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Reddetme Nedeni (SMS ile Gönderilir)
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                  placeholder="Örn: Kulüp vergi levhası veya tesis izin belgesi eksiktir."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-rose-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRejectionModalOpen(false)}
                  className="py-2 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reddi Onayla</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
