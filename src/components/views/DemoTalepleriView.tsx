import React, { useState, useEffect, useCallback } from 'react';
import {
  Video,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Phone,
  Mail,
  User,
  Building2,
  RefreshCw,
  Sparkles,
  Calendar,
  X,
  Check,
  Eye,
  Send,
  Users,
  Code2,
  Copy,
  Lock,
  Trash2,
} from 'lucide-react';
import { sendMutlucellSms } from '../../services/smsService';
import { getStoredUserProfile } from '../../data/userProfile';
import { isSuperAdminUser } from '../../data/packagePermissions';

export interface DemoRequestItem {
  id: string;
  fullName: string;
  clubName: string;
  phone: string;
  email: string;
  branch: string;
  studentEstimate: string;
  selectedPlan: string;
  submittedAt: string;
  requestType?: 'spor_okulu_basvurusu' | 'demo_rezervasyonu';
  source?: string;
  status: 'onay_bekliyor' | 'onaylandi' | 'reddedildi' | 'askida';
  notes?: string;
  rejectionReason?: string;
  approvedAt?: string;
}

const LEGACY_TEST_IDS = new Set([
  'demo_101',
  'demo_102',
  'demo_103',
  'req_101',
  'req_102',
  'req_103',
  'req_104',
  'req_105',
]);

export const DemoTalepleriView: React.FC = () => {
  const [items, setItems] = useState<DemoRequestItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'tumu' | 'onay_bekliyor' | 'onaylandi' | 'reddedildi'>('tumu');
  const [isLiveConnected, setIsLiveConnected] = useState(true);
  const [selectedItem, setSelectedItem] = useState<DemoRequestItem | null>(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  const mapRawListToDemoItems = useCallback((rawList: any[]): DemoRequestItem[] => {
    if (!Array.isArray(rawList)) return [];
    return rawList
      .filter((r) => r && r.id && !LEGACY_TEST_IDS.has(String(r.id)))
      .map((r) => ({
        id: String(r.id || ''),
        fullName: String(r.fullName || r.managerName || 'Kulüp Yetkilisi'),
        clubName: String(r.clubName || 'Spor Okulu'),
        phone: String(r.phone || ''),
        email: String(r.email || ''),
        branch: String(r.branch || (Array.isArray(r.branches) ? r.branches.join(', ') : 'Genel Branş')),
        studentEstimate: String(r.studentEstimate ?? r.athleteCount ?? 'Belirtilmedi'),
        selectedPlan: String(r.selectedPlan || 'Kulüp & Akademi'),
        submittedAt: String(r.submittedAt || r.createdAt || ''),
        requestType: r.requestType || 'demo_rezervasyonu',
        source: r.source || 'sportsfly.com.tr',
        status: r.status || 'onay_bekliyor',
        notes: r.notes,
        rejectionReason: r.rejectionReason,
        approvedAt: r.approvedAt,
      }));
  }, []);

  const fetchDemoRequests = useCallback(async () => {
    try {
      const res = await fetch('/api/demo-requests');
      if (res.ok) {
        const json = await res.json();
        const rawList: any[] = Array.isArray(json.items) ? json.items : Array.isArray(json.data) ? json.data : [];
        setItems(mapRawListToDemoItems(rawList));
      }
    } catch {
      // Fallback
    }
  }, [mapRawListToDemoItems]);

  useEffect(() => {
    fetchDemoRequests();

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/demo-requests/stream');
      eventSource.onopen = () => {
        setIsLiveConnected(true);
      };
      eventSource.onerror = () => {
        setIsLiveConnected(false);
      };
      eventSource.addEventListener('sync', (evt: MessageEvent) => {
        try {
          const payload = JSON.parse(evt.data);
          if (Array.isArray(payload.items)) {
            setItems(mapRawListToDemoItems(payload.items));
          }
          if (payload.action === 'created' && payload.record?.clubName) {
            showToast(`Yeni talep anlık olarak panele düştü: ${payload.record.clubName}`, 'success');
          }
        } catch {}
      });
    } catch {}

    let bc: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        bc = new BroadcastChannel('sportsfly_demo_requests_live');
        bc.onmessage = (evt) => {
          if (evt.data?.items && Array.isArray(evt.data.items)) {
            setItems(mapRawListToDemoItems(evt.data.items));
          } else {
            fetchDemoRequests();
          }
        };
      }
    } catch {}

    return () => {
      if (eventSource) eventSource.close();
      if (bc) bc.close();
    };
  }, [fetchDemoRequests, mapRawListToDemoItems]);

  const handleUpdateStatus = async (item: DemoRequestItem, status: 'onaylandi' | 'reddedildi') => {
    try {
      const res = await fetch(`/api/demo-requests/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, sendSms: status === 'onaylandi' }),
      });
      if (res.ok) {
        await fetchDemoRequests();
        if (status === 'onaylandi') {
          await sendMutlucellSms(
            item.phone,
            `SPORTSFLY: Sayın ${item.fullName}, ${item.clubName} için oluşturduğunuz demo talebiniz onaylanmıştır. Ekibimiz sizinle iletişime geçecektir.`
          );
          showToast(`${item.clubName} demo talebi onaylandı ve SMS gönderildi.`);
        } else {
          showToast(`${item.clubName} demo talebi reddedildi.`, 'info');
        }
      }
    } catch {
      showToast('Durum güncellenemedi.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/demo-requests/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        showToast('Demo talebi listeden silindi.', 'info');
      }
    } catch {
      showToast('Silme işlemi başarısız.', 'error');
    }
  };

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
          <strong>Demo Talepleri</strong> modülü yalnızca <strong>Süper Admin</strong> yetkisine sahip sistem yöneticilerine açıktır.
        </p>
      </div>
    );
  }

  const filteredItems = items.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      r.id.toLowerCase().includes(q) ||
      r.fullName.toLowerCase().includes(q) ||
      r.clubName.toLowerCase().includes(q) ||
      r.phone.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.branch.toLowerCase().includes(q) ||
      r.selectedPlan.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'tumu' ? true : r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = items.filter((i) => i.status === 'onay_bekliyor').length;
  const approvedCount = items.filter((i) => i.status === 'onaylandi').length;

  const sampleSnippet = `// sportsfly.com.tr üzerinden POST /api/demo-requests gönderimi
await fetch('https://webapp.sportsfly.com.tr/api/demo-requests', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'demo_109',
    fullName: 'Ad Soyad',
    clubName: 'Kadıköy Basketbol Akademisi',
    phone: '0532 123 45 67',
    email: 'iletisim@kulup.com',
    branch: 'Basketbol',
    studentEstimate: '250',
    selectedPlan: 'Kulüp & Akademi',
    submittedAt: new Date().toISOString()
  })
});`;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 p-4 rounded-2xl shadow-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 max-w-md ${
            toast.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : toast.type === 'error'
              ? 'bg-rose-900 text-white border-rose-700'
              : 'bg-slate-900 text-white border-slate-700'
          }`}
        >
          <Sparkles className="w-5 h-5 shrink-0 text-amber-400" />
          <p className="text-xs font-semibold leading-relaxed">{toast.text}</p>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-[11px] font-extrabold">
            <Video className="w-3.5 h-3.5" />
            <span>SPORTSFLY.COM.TR &bull; CANLI WEBHOOK ALICISI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Demo Talepleri
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Ana web sitesi (<strong>sportsfly.com.tr</strong>) üzerinden doldurulan ve{' '}
            <code className="px-1.5 py-0.5 rounded bg-slate-100 text-indigo-700 font-mono text-xs font-bold">
              POST /api/demo-requests
            </code>{' '}
            adresiyle gelen tüm demo başvuruları burada anlık olarak listelenir.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isLiveConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>Canlı Bağlantı Aktif &bull; Anlık Düşüş</span>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Toplam Demo Talebi</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{items.length}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Bekleyen Talepler</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Onaylanan / Görüşülen</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{approvedCount}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ID, Ad Soyad, Kulüp Adı, Telefon, E-posta, Branş veya Paket ara..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'tumu', label: 'Tümü' },
            { id: 'onay_bekliyor', label: 'Bekleyenler' },
            { id: 'onaylandi', label: 'Onaylananlar' },
            { id: 'reddedildi', label: 'Reddedilenler' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table with all 9 fields: id, fullName, clubName, phone, email, branch, studentEstimate, selectedPlan, submittedAt */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">Ad Soyad (fullName)</th>
                <th className="py-3.5 px-4">Kulüp / Okul (clubName)</th>
                <th className="py-3.5 px-4">İletişim (phone / email)</th>
                <th className="py-3.5 px-4">Branş (branch)</th>
                <th className="py-3.5 px-4">Tahmini Sporcu (studentEstimate)</th>
                <th className="py-3.5 px-4">Seçilen Paket (selectedPlan)</th>
                <th className="py-3.5 px-4">Tarih (submittedAt)</th>
                <th className="py-3.5 px-4">Durum</th>
                <th className="py-3.5 px-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 font-medium">
                    Kriterlere uygun demo talebi bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                      #{item.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-slate-900">{item.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-extrabold text-slate-800">
                        <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{item.clubName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{item.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{item.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-200/60">
                        {item.branch}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-extrabold">
                        <Users className="w-3 h-3 text-slate-500" />
                        {item.studentEstimate}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 font-bold border border-indigo-200/60">
                        {item.selectedPlan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.submittedAt}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {item.status === 'onay_bekliyor' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[11px]">
                          <Clock className="w-3 h-3" />
                          Bekliyor
                        </span>
                      )}
                      {item.status === 'onaylandi' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          Onaylandı
                        </span>
                      )}
                      {(item.status === 'reddedildi' || item.status === 'askida') && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-extrabold text-[11px]">
                          <XCircle className="w-3 h-3" />
                          Reddedildi
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        {item.status !== 'onaylandi' && (
                          <button
                            onClick={() => handleUpdateStatus(item, 'onaylandi')}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                            title="Onayla & SMS Gönder"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {item.status !== 'reddedildi' && (
                          <button
                            onClick={() => handleUpdateStatus(item, 'reddedildi')}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                            title="Reddet"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          title="Detay Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase">
                  DEMO TALEBİ #{selectedItem.id}
                </span>
                <h3 className="text-lg font-black text-slate-900">{selectedItem.clubName}</h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
              <div>
                <span className="text-slate-400 block">Ad Soyad (fullName)</span>
                <span className="font-bold text-slate-900">{selectedItem.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Kulüp Adı (clubName)</span>
                <span className="font-bold text-slate-900">{selectedItem.clubName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Telefon (phone)</span>
                <span className="font-bold text-slate-900">{selectedItem.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block">E-posta (email)</span>
                <span className="font-bold text-slate-900">{selectedItem.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Branş (branch)</span>
                <span className="font-bold text-indigo-700">{selectedItem.branch}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Tahmini Sporcu (studentEstimate)</span>
                <span className="font-bold text-slate-900">{selectedItem.studentEstimate}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Seçilen Paket (selectedPlan)</span>
                <span className="font-bold text-blue-700">{selectedItem.selectedPlan}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Gönderim Zamanı (submittedAt)</span>
                <span className="font-bold text-slate-900">{selectedItem.submittedAt}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Kapat
              </button>
              {selectedItem.status !== 'onaylandi' && (
                <button
                  onClick={() => {
                    handleUpdateStatus(selectedItem, 'onaylandi');
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                >
                  Onayla &amp; SMS Gönder
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Webhook & CORS Info Modal */}
      {isCodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                sportsfly.com.tr &rarr; POST /api/demo-requests Entegrasyonu
              </h3>
              <button
                onClick={() => setIsCodeModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed">
              {sampleSnippet}
            </pre>

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(sampleSnippet);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedCode ? 'Kopyalandı!' : 'Kodu Kopyala'}</span>
              </button>
              <button
                onClick={() => setIsCodeModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
