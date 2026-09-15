import React, { useState } from 'react';
import {
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingUp,
  CreditCard,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  Calendar,
  Layers,
  ChevronRight,
  DollarSign,
  Tag,
  Check,
  X,
  Building,
} from 'lucide-react';
import {
  INITIAL_GELIR_GIDER,
  INITIAL_KATEGORILER,
  INITIAL_ODEME_PLANI,
} from '../../data/mockMuhasebeData';
import { GelirGiderItem, GelirGiderKategoriItem, OdemePlaniItem, NavPage } from '../../types';

interface Props {
  initialTab?: 'genel' | 'kategoriler' | 'hareketler' | 'kontrol' | 'planlar';
  onNavigate?: (page: NavPage) => void;
}

export const OnMuhasebeView: React.FC<Props> = ({ initialTab = 'genel', onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'genel' | 'kategoriler' | 'hareketler' | 'kontrol' | 'planlar'>(initialTab);

  // States
  const [hareketler, setHareketler] = useState<GelirGiderItem[]>(INITIAL_GELIR_GIDER);
  const [kategoriler, setKategoriler] = useState<GelirGiderKategoriItem[]>(INITIAL_KATEGORILER);
  const [odemePlanlari, setOdemePlanlari] = useState<OdemePlaniItem[]>(INITIAL_ODEME_PLANI);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'Tümü' | 'Gelir' | 'Gider'>('Tümü');
  const [statusFilter, setStatusFilter] = useState<'Tümü' | 'Ödendi' | 'Bekliyor' | 'Gecikti'>('Tümü');

  // Modals
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form: Yeni Hareket
  const [txType, setTxType] = useState<'Gelir' | 'Gider'>('Gelir');
  const [txTitle, setTxTitle] = useState('');
  const [txCategory, setTxCategory] = useState('Aylık Sporcu Aidatları');
  const [txAmount, setTxAmount] = useState('');
  const [txPayer, setTxPayer] = useState('');
  const [txMethod, setTxMethod] = useState<'Nakit' | 'Kredi Kartı' | 'Havale/EFT' | 'POS'>('Havale/EFT');

  // Form: Yeni Kategori
  const [catName, setCatName] = useState('');
  const [catType, setCatType] = useState<'Gelir' | 'Gider'>('Gelir');

  // Form: Yeni Ödeme Planı
  const [planAthlete, setPlanAthlete] = useState('');
  const [planTitle, setPlanTitle] = useState('');
  const [planAmount, setPlanAmount] = useState('');
  const [planInstallments, setPlanInstallments] = useState('3');
  const [planDueDate, setPlanDueDate] = useState('15.10.2024');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Financial Calculations
  const totalGelir = hareketler
    .filter((h) => h.type === 'Gelir' && h.status === 'Tamamlandı')
    .reduce((acc, h) => acc + h.amount, 0);

  const totalGider = hareketler
    .filter((h) => h.type === 'Gider' && h.status === 'Tamamlandı')
    .reduce((acc, h) => acc + h.amount, 0);

  const netBakiye = totalGelir - totalGider;

  const bekleyenTahsilat = odemePlanlari
    .filter((p) => p.status === 'Bekliyor')
    .reduce((acc, p) => acc + p.amount, 0);

  const gecikenTahsilat = odemePlanlari
    .filter((p) => p.status === 'Gecikti')
    .reduce((acc, p) => acc + p.amount, 0);

  // Add Transaction
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txTitle.trim() || !txAmount) return;

    const newTx: GelirGiderItem = {
      id: `tx-${Date.now()}`,
      type: txType,
      title: txTitle.trim(),
      category: txCategory,
      amount: parseFloat(txAmount),
      date: new Date().toLocaleDateString('tr-TR'),
      payerOrPayee: txPayer.trim() || 'Kulüp Hesabı',
      paymentMethod: txMethod,
      status: 'Tamamlandı',
    };

    setHareketler([newTx, ...hareketler]);
    setShowAddTxModal(false);
    setTxTitle('');
    setTxAmount('');
    setTxPayer('');
    showToast(`${newTx.type} işlemi (${newTx.amount.toLocaleString('tr-TR')} ₺) kaydedildi.`);
  };

  // Add Category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const newCat: GelirGiderKategoriItem = {
      id: `kat-${Date.now()}`,
      name: catName.trim(),
      type: catType,
      itemCount: 0,
      totalAmount: 0,
      color: catType === 'Gelir' ? 'emerald' : 'rose',
    };

    setKategoriler([...kategoriler, newCat]);
    setShowAddCatModal(false);
    setCatName('');
    showToast(`"${newCat.name}" kategorisi başarıyla eklendi.`);
  };

  // Add Payment Plan
  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planAthlete.trim() || !planAmount) return;

    const total = parseFloat(planAmount);
    const count = parseInt(planInstallments) || 1;
    const monthly = Math.round(total / count);

    const newPlans: OdemePlaniItem[] = [];
    for (let i = 1; i <= count; i++) {
      newPlans.push({
        id: `op-${Date.now()}-${i}`,
        athleteName: planAthlete.trim(),
        athleteCode: Math.floor(100000 + Math.random() * 900000).toString(),
        planName: planTitle.trim() || 'Sporcu Aidat & Eğitim Paketi',
        installment: `${i}/${count}`,
        dueDate: planDueDate,
        amount: monthly,
        status: i === 1 ? 'Ödendi' : 'Bekliyor',
        paidDate: i === 1 ? new Date().toLocaleDateString('tr-TR') : undefined,
      });
    }

    setOdemePlanlari([...newPlans, ...odemePlanlari]);
    setShowAddPlanModal(false);
    setPlanAthlete('');
    setPlanTitle('');
    setPlanAmount('');
    showToast(`${planAthlete} için ${count} taksitli ödeme planı oluşturuldu.`);
  };

  // Mark plan as paid
  const handleMarkPaid = (planId: string) => {
    setOdemePlanlari((prev) =>
      prev.map((p) =>
        p.id === planId
          ? {
              ...p,
              status: 'Ödendi',
              paidDate: new Date().toLocaleDateString('tr-TR'),
            }
          : p
      )
    );
    showToast('Taksit tahsilatı başarıyla işlendi ve gelir kaydedildi.');
  };

  // Export Excel
  const handleExportExcel = () => {
    const headers = ['Tarih', 'İşlem Tipi', 'Başlık', 'Kategori', 'Tutar (TL)', 'Kişi / Kurum', 'Ödeme Yöntemi'];
    const rows = hareketler.map((h) => [
      h.date,
      h.type,
      `"${h.title}"`,
      `"${h.category}"`,
      h.amount,
      `"${h.payerOrPayee}"`,
      h.paymentMethod,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `On_Muhasebe_Ekstre_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Muhasebe hareketleri Excel (CSV) olarak indirildi.');
  };

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Tab Navigation Bar matching Screenshot 3 */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 sm:p-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-1 px-1 sm:mx-0 sm:px-0 sm:flex-wrap">
            {/* Ön Muhasebe (Genel Bakış) */}
            <button
              onClick={() => setActiveTab('genel')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 whitespace-nowrap min-h-[40px] ${
                activeTab === 'genel'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Receipt className="w-4 h-4 shrink-0" />
              <span>Ön Muhasebe</span>
            </button>

            {/* Gelir/Gider Kategori Yönetimi */}
            <button
              onClick={() => setActiveTab('kategoriler')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 whitespace-nowrap min-h-[40px] ${
                activeTab === 'kategoriler'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>Gelir/Gider Kategori Yönetimi</span>
            </button>

            {/* Gelir/Gider Yönetimi */}
            <button
              onClick={() => setActiveTab('hareketler')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 whitespace-nowrap min-h-[40px] ${
                activeTab === 'hareketler'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 shrink-0" />
              <span>Gelir/Gider Yönetimi</span>
            </button>

            {/* Ödeme Planı Kontrol */}
            <button
              onClick={() => setActiveTab('kontrol')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 whitespace-nowrap min-h-[40px] ${
                activeTab === 'kontrol'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>Ödeme Planı Kontrol</span>
            </button>

            {/* Ödeme Planı */}
            <button
              onClick={() => setActiveTab('planlar')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 whitespace-nowrap min-h-[40px] ${
                activeTab === 'planlar'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-4 h-4 shrink-0" />
              <span>Ödeme Planı</span>
            </button>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center justify-end sm:justify-start gap-2 shrink-0">
            <button
              onClick={() => setShowAddTxModal(true)}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#188038] hover:bg-[#137333] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer min-h-[42px] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Gelir / Gider Ekle</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: ÖN MUHASEBE GENEL BAKIŞ */}
      {activeTab === 'genel' && (
        <div className="space-y-4 sm:space-y-5">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {/* Toplam Gelir */}
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-[11px] sm:text-xs font-semibold mb-1.5 sm:mb-2">
                <span className="truncate">Toplam Gelir</span>
                <span className="p-1 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
              </div>
              <p className="text-base sm:text-2xl font-black text-slate-900 truncate">
                {totalGelir.toLocaleString('tr-TR')} ₺
              </p>
              <p className="text-[10px] sm:text-xs text-emerald-600 font-medium mt-1 truncate">
                +14.8% bu ayki artış
              </p>
            </div>

            {/* Toplam Gider */}
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-[11px] sm:text-xs font-semibold mb-1.5 sm:mb-2">
                <span className="truncate">Toplam Gider</span>
                <span className="p-1 rounded-lg bg-rose-50 text-rose-600 shrink-0">
                  <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
              </div>
              <p className="text-base sm:text-2xl font-black text-slate-900 truncate">
                {totalGider.toLocaleString('tr-TR')} ₺
              </p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-1 truncate">
                Maaşlar, kira ve fatura
              </p>
            </div>

            {/* Net Bakiye / Kasa */}
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-[11px] sm:text-xs font-semibold mb-1.5 sm:mb-2">
                <span className="truncate">Net Kasa Bakiyesi</span>
                <span className="p-1 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                  <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
              </div>
              <p className={`text-base sm:text-2xl font-black truncate ${netBakiye >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {netBakiye.toLocaleString('tr-TR')} ₺
              </p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-1 truncate">
                Güncel net nakit pozisyonu
              </p>
            </div>

            {/* Bekleyen & Geciken Tahsilat */}
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-[11px] sm:text-xs font-semibold mb-1.5 sm:mb-2">
                <span className="truncate">Bekleyen Aidat</span>
                <span className="p-1 rounded-lg bg-amber-50 text-amber-600 shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
              </div>
              <p className="text-base sm:text-2xl font-black text-amber-600 truncate">
                {bekleyenTahsilat.toLocaleString('tr-TR')} ₺
              </p>
              <p className="text-[10px] sm:text-xs text-rose-600 font-bold mt-1 truncate">
                {gecikenTahsilat.toLocaleString('tr-TR')} ₺ gecikmede
              </p>
            </div>
          </div>

          {/* Son Hareketler & Kategori Dağılımı */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Son Hareketler Tablosu */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Son Gelir &amp; Gider Hareketleri</h3>
                  <p className="text-xs text-slate-500">Spor okulu ve kulüp kasasındaki son finansal işlemler</p>
                </div>
                <button
                  onClick={() => setActiveTab('hareketler')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>Tümünü Gör</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                      <th className="pb-2.5">Tarih</th>
                      <th className="pb-2.5">İşlem &amp; Açıklama</th>
                      <th className="pb-2.5">Kategori</th>
                      <th className="pb-2.5 text-right">Tutar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {hareketler.slice(0, 5).map((h) => (
                      <tr key={h.id} className="hover:bg-slate-50">
                        <td className="py-3 font-medium text-slate-600 whitespace-nowrap">{h.date}</td>
                        <td className="py-3">
                          <p className="font-bold text-slate-900">{h.title}</p>
                          <p className="text-[11px] text-slate-500">{h.payerOrPayee} • {h.paymentMethod}</p>
                        </td>
                        <td className="py-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium">
                            {h.category}
                          </span>
                        </td>
                        <td className="py-3 text-right whitespace-nowrap">
                          <span
                            className={`font-bold ${
                              h.type === 'Gelir' ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {h.type === 'Gelir' ? '+' : '-'}
                            {h.amount.toLocaleString('tr-TR')} ₺
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Kategori Dağılımı ve Hızlı Özet */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Kategori Özeti</h3>
                <button
                  onClick={() => setActiveTab('kategoriler')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  Yönet
                </button>
              </div>

              <div className="space-y-3">
                {kategoriler.slice(0, 5).map((k) => (
                  <div key={k.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/70">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-800">{k.name}</span>
                      <span
                        className={`font-black ${
                          k.type === 'Gelir' ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {k.totalAmount.toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{k.type} Kategorisi</span>
                      <span>{k.itemCount} İşlem</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowAddCatModal(true)}
                  className="w-full py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span>Yeni Kategori Tanımla</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GELİR/GİDER KATEGORİ YÖNETİMİ */}
      {activeTab === 'kategoriler' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Gelir ve Gider Kategori Yönetimi</h3>
              <p className="text-xs text-slate-500">Kulüp muhasebe ve bütçelendirmesinde kullanılan harcama ve gelir kalemleri</p>
            </div>
            <button
              onClick={() => setShowAddCatModal(true)}
              className="px-4 py-2 bg-[#188038] hover:bg-[#137333] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Kategori Ekle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gelir Kategorileri */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4" />
                <span>Gelir Kategorileri</span>
              </h4>
              <div className="space-y-2">
                {kategoriler
                  .filter((k) => k.type === 'Gelir')
                  .map((k) => (
                    <div
                      key={k.id}
                      className="p-3 rounded-lg border border-emerald-100 bg-emerald-50/40 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{k.name}</p>
                        <p className="text-xs text-slate-500">{k.itemCount} kayıtlı işlem</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-700 text-sm">
                          {k.totalAmount.toLocaleString('tr-TR')} ₺
                        </p>
                        <span className="text-[10px] bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                          Aktif Gelir
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Gider Kategorileri */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-rose-800 flex items-center gap-1.5">
                <ArrowDownRight className="w-4 h-4" />
                <span>Gider Kategorileri</span>
              </h4>
              <div className="space-y-2">
                {kategoriler
                  .filter((k) => k.type === 'Gider')
                  .map((k) => (
                    <div
                      key={k.id}
                      className="p-3 rounded-lg border border-rose-100 bg-rose-50/40 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{k.name}</p>
                        <p className="text-xs text-slate-500">{k.itemCount} kayıtlı işlem</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-rose-700 text-sm">
                          {k.totalAmount.toLocaleString('tr-TR')} ₺
                        </p>
                        <span className="text-[10px] bg-rose-200/60 text-rose-900 px-2 py-0.5 rounded-full font-bold">
                          Aktif Gider
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GELİR/GİDER YÖNETİMİ (HAREKETLER) */}
      {activeTab === 'hareketler' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-3.5 sm:p-5 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            {/* Filter buttons with touch-friendly pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
              <button
                onClick={() => setFilterType('Tümü')}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 whitespace-nowrap min-h-[38px] ${
                  filterType === 'Tümü'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tümü ({hareketler.length})
              </button>
              <button
                onClick={() => setFilterType('Gelir')}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 whitespace-nowrap min-h-[38px] ${
                  filterType === 'Gelir'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Gelirler ({hareketler.filter((h) => h.type === 'Gelir').length})
              </button>
              <button
                onClick={() => setFilterType('Gider')}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 whitespace-nowrap min-h-[38px] ${
                  filterType === 'Gider'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                Giderler ({hareketler.filter((h) => h.type === 'Gider').length})
              </button>
            </div>

            {/* Search + Action Buttons */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-48">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="İşlem veya kişi ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleExportExcel}
                className="px-3 py-2 bg-[#188038] hover:bg-[#137333] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs shrink-0 min-h-[38px]"
                title="Excel İndir"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Excel</span>
              </button>

              <button
                onClick={() => setShowAddTxModal(true)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs shrink-0 min-h-[38px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Yeni İşlem</span>
              </button>
            </div>
          </div>

          {/* MOBILE CARDS FOR TRANSACTIONS (Visible on <640px) */}
          <div className="block sm:hidden space-y-2.5">
            {hareketler
              .filter((h) => filterType === 'Tümü' || h.type === filterType)
              .filter((h) =>
                !searchQuery ||
                h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                h.payerOrPayee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                h.category.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((h) => (
                <div
                  key={h.id}
                  className="p-3 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                          h.type === 'Gelir'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {h.type === 'Gelir' ? '+' : '-'}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs leading-snug">{h.title}</h4>
                        <p className="text-[11px] text-slate-500">{h.payerOrPayee}</p>
                      </div>
                    </div>
                    <span
                      className={`font-black text-sm whitespace-nowrap ${
                        h.type === 'Gelir' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {h.type === 'Gelir' ? '+' : '-'}
                      {h.amount.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-100">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700">
                      {h.category}
                    </span>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span>{h.paymentMethod}</span>
                      <span>•</span>
                      <span>{h.date}</span>
                    </div>
                  </div>
                </div>
              ))}

            {hareketler.filter((h) => filterType === 'Tümü' || h.type === filterType).length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Seçilen kriterlere uygun işlem bulunamadı.
              </div>
            )}
          </div>

          {/* DESKTOP DATA TABLE (Visible on sm and larger) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[620px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-3 px-3">Tarih</th>
                  <th className="py-3 px-3">Tip</th>
                  <th className="py-3 px-3">Açıklama / Başlık</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3">Kişi / Kurum</th>
                  <th className="py-3 px-3">Ödeme Metodu</th>
                  <th className="py-3 px-3 text-right">Tutar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hareketler
                  .filter((h) => filterType === 'Tümü' || h.type === filterType)
                  .filter((h) =>
                    !searchQuery ||
                    h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    h.payerOrPayee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    h.category.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((h) => (
                    <tr key={h.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-medium">{h.date}</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            h.type === 'Gelir'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {h.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{h.title}</td>
                      <td className="py-3 px-3 text-slate-600">{h.category}</td>
                      <td className="py-3 px-3 text-slate-700 font-medium">{h.payerOrPayee}</td>
                      <td className="py-3 px-3 text-slate-500">{h.paymentMethod}</td>
                      <td className="py-3 px-3 text-right font-bold whitespace-nowrap">
                        <span className={h.type === 'Gelir' ? 'text-emerald-600' : 'text-rose-600'}>
                          {h.type === 'Gelir' ? '+' : '-'}
                          {h.amount.toLocaleString('tr-TR')} ₺
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ÖDEME PLANI KONTROL */}
      {activeTab === 'kontrol' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-3.5 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Ödeme Planı Kontrol &amp; Tahsilat Durumu</h3>
              <p className="text-xs text-slate-500">Sporcu taksitleri, vadesi yaklaşan ve gecikmiş aidat alacakları</p>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                onClick={() => setStatusFilter('Tümü')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap min-h-[34px] ${
                  statusFilter === 'Tümü' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Tümü
              </button>
              <button
                onClick={() => setStatusFilter('Gecikti')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap min-h-[34px] ${
                  statusFilter === 'Gecikti' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700'
                }`}
              >
                Gecikenler ({odemePlanlari.filter((p) => p.status === 'Gecikti').length})
              </button>
              <button
                onClick={() => setStatusFilter('Bekliyor')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap min-h-[34px] ${
                  statusFilter === 'Bekliyor' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700'
                }`}
              >
                Bekleyenler
              </button>
            </div>
          </div>

          {/* MOBILE CARDS FOR PAYMENT PLAN CHECKS (<640px) */}
          <div className="block sm:hidden space-y-2.5">
            {odemePlanlari
              .filter((p) => statusFilter === 'Tümü' || p.status === statusFilter)
              .map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{p.athleteName}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">Kod: {p.athleteCode}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'Ödendi'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'Gecikti'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Plan:</span>
                      <span className="font-semibold text-slate-800">{p.planName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Taksit:</span>
                      <span className="font-mono font-bold text-slate-700">{p.installment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vade:</span>
                      <span className="font-medium text-slate-800">{p.dueDate}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200">
                      <span className="font-bold text-slate-700">Tutar:</span>
                      <span className="font-black text-slate-900 text-sm">
                        {p.amount.toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  </div>

                  {p.status !== 'Ödendi' ? (
                    <button
                      onClick={() => handleMarkPaid(p.id)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-lg text-xs font-bold transition-all shadow-xs min-h-[40px]"
                    >
                      Tahsilat Girişi Yap
                    </button>
                  ) : (
                    <div className="text-center py-1 text-xs text-emerald-600 font-medium">
                      ✓ Tahsil Edildi ({p.paidDate})
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* DESKTOP TABLE (Visible on sm and larger) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[620px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-3 px-3">Sporcu</th>
                  <th className="py-3 px-3">Ödeme Planı</th>
                  <th className="py-3 px-3">Taksit</th>
                  <th className="py-3 px-3">Vade Tarihi</th>
                  <th className="py-3 px-3">Tutar</th>
                  <th className="py-3 px-3">Durum</th>
                  <th className="py-3 px-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {odemePlanlari
                  .filter((p) => statusFilter === 'Tümü' || p.status === statusFilter)
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-900">{p.athleteName}</p>
                        <p className="text-[11px] text-slate-500 font-mono">Kod: {p.athleteCode}</p>
                      </td>
                      <td className="py-3 px-3 text-slate-800 font-medium">{p.planName}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-mono font-bold text-slate-700 text-[11px]">
                          {p.installment}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-slate-700 font-medium">{p.dueDate}</td>
                      <td className="py-3 px-3 whitespace-nowrap font-bold text-slate-900">
                        {p.amount.toLocaleString('tr-TR')} ₺
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'Ödendi'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.status === 'Gecikti'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        {p.status !== 'Ödendi' ? (
                          <button
                            onClick={() => handleMarkPaid(p.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-bold transition-colors"
                          >
                            Tahsil Et
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px] font-medium">Ödendi ({p.paidDate})</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: ÖDEME PLANI OLUŞTUR & LİSTE */}
      {activeTab === 'planlar' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Sporcu Ödeme Planları</h3>
              <p className="text-xs text-slate-500">Sporculara özel sezonluk taksitlendirme ve aidat şablonları</p>
            </div>
            <button
              onClick={() => setShowAddPlanModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Ödeme Planı Oluştur</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {odemePlanlari.map((plan) => (
              <div
                key={plan.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-xs transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{plan.athleteName}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">Kod: {plan.athleteCode}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      plan.status === 'Ödendi'
                        ? 'bg-emerald-100 text-emerald-800'
                        : plan.status === 'Gecikti'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {plan.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 my-3">
                  <div className="flex justify-between">
                    <span>Paket / Plan:</span>
                    <span className="font-semibold text-slate-800">{plan.planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taksit:</span>
                    <span className="font-mono font-bold text-slate-800">{plan.installment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Son Ödeme:</span>
                    <span className="font-medium text-slate-800">{plan.dueDate}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200/80">
                    <span className="font-bold text-slate-700">Tutar:</span>
                    <span className="font-black text-slate-900 text-sm">
                      {plan.amount.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>
                </div>

                {plan.status !== 'Ödendi' && (
                  <button
                    onClick={() => handleMarkPaid(plan.id)}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Tahsilat Girişi Yap
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: YENİ GELİR / GİDER EKLE */}
      {showAddTxModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Yeni Gelir / Gider Hareketi</h3>
              <button
                onClick={() => setShowAddTxModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="mt-4 space-y-3.5">
              <div className="flex rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setTxType('Gelir')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                    txType === 'Gelir' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  + Gelir Girişi
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('Gider')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                    txType === 'Gider' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  - Gider Girişi
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  İşlem Açıklaması / Başlık *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Ekim Ayı Basketbol Aidatı"
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tutar (TL) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="3500"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {kategoriler
                      .filter((k) => k.type === txType)
                      .map((k) => (
                        <option key={k.id} value={k.name}>
                          {k.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kişi / Kurum
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Mehmet Yıldırım"
                    value={txPayer}
                    onChange={(e) => setTxPayer(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ödeme Yöntemi
                  </label>
                  <select
                    value={txMethod}
                    onChange={(e) => setTxMethod(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Havale/EFT">Havale/EFT</option>
                    <option value="Kredi Kartı">Kredi Kartı</option>
                    <option value="Nakit">Nakit</option>
                    <option value="POS">POS</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTxModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white text-xs font-bold rounded-lg shadow-xs ${
                    txType === 'Gelir' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  İşlemi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: YENİ KATEGORİ EKLE */}
      {showAddCatModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Yeni Kategori Tanımla</h3>
              <button
                onClick={() => setShowAddCatModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori Tipi
                </label>
                <select
                  value={catType}
                  onChange={(e) => setCatType(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white"
                >
                  <option value="Gelir">Gelir Kategorisi</option>
                  <option value="Gider">Gider Kategorisi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori Adı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Turnuva Giriş Ücretleri"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCatModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Kategoriyi Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: YENİ ÖDEME PLANI OLUŞTUR */}
      {showAddPlanModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Sporcu Ödeme Planı Oluştur</h3>
              <button
                onClick={() => setShowAddPlanModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPlan} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sporcu Adı Soyadı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Arda Güler"
                  value={planAthlete}
                  onChange={(e) => setPlanAthlete(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Paket / Plan Adı
                </label>
                <input
                  type="text"
                  placeholder="Örn: 2024-2025 Yıllık Basketbol Paketi"
                  value={planTitle}
                  onChange={(e) => setPlanTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Toplam Tutar (TL) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="12000"
                    value={planAmount}
                    onChange={(e) => setPlanAmount(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Taksit Sayısı
                  </label>
                  <select
                    value={planInstallments}
                    onChange={(e) => setPlanInstallments(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white"
                  >
                    <option value="1">Peşin (Tek Çekim)</option>
                    <option value="2">2 Taksit</option>
                    <option value="3">3 Taksit</option>
                    <option value="4">4 Taksit</option>
                    <option value="6">6 Taksit</option>
                    <option value="8">8 Taksit</option>
                    <option value="12">12 Taksit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  İlk Taksit Vadesi
                </label>
                <input
                  type="text"
                  value={planDueDate}
                  onChange={(e) => setPlanDueDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPlanModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Planı Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
