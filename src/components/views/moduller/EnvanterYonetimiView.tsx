import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  Trash2,
  Edit,
  UserCheck,
  Building,
  Tag,
  Download,
  Share2,
  ChevronRight,
  ShieldCheck,
  Eye,
  SlidersHorizontal,
  X,
  PlusCircle,
  MinusCircle,
  PackageCheck,
  Layers,
  MapPin,
  Calendar,
  DollarSign,
  TrendingDown,
  Info,
  QrCode,
  FileSpreadsheet,
  Check,
  RefreshCw,
  Box,
} from 'lucide-react';
import { EnvanterItem, EnvanterKategori, EnvanterDurum } from '../../../types';
import { getStoredEnvanter, saveStoredEnvanter } from '../../../data/modullerData';

interface EnvanterYonetimiViewProps {
  selectedClubFilter?: string;
  onToast?: (msg: string) => void;
}

const CATEGORY_COLORS: Record<EnvanterKategori, { bg: string; text: string; border: string }> = {
  'Toplar': { bg: 'bg-orange-50 dark:bg-orange-950/60', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' },
  'Formalar & Yelekler': { bg: 'bg-blue-50 dark:bg-blue-950/60', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
  'Antrenman Ekipmanları': { bg: 'bg-emerald-50 dark:bg-emerald-950/60', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
  'Sağlık & Medikal': { bg: 'bg-rose-50 dark:bg-rose-950/60', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800' },
  'Tesis & Saha Donanımı': { bg: 'bg-purple-50 dark:bg-purple-950/60', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
  'Elektronik & Ölçüm': { bg: 'bg-indigo-50 dark:bg-indigo-950/60', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' },
  'Diğer': { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-700' },
};

const CONDITION_COLORS: Record<EnvanterDurum, { bg: string; text: string; border: string; dot: string }> = {
  'Yeni / Mükemmel': { bg: 'bg-emerald-50 dark:bg-emerald-950/60', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800', dot: 'bg-emerald-500' },
  'İyi Durumda': { bg: 'bg-blue-50 dark:bg-blue-950/60', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800', dot: 'bg-blue-500' },
  'Yıpranmış / Kontrol': { bg: 'bg-amber-50 dark:bg-amber-950/60', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800', dot: 'bg-amber-500' },
  'Bakımda / Tamirde': { bg: 'bg-indigo-50 dark:bg-indigo-950/60', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800', dot: 'bg-indigo-500' },
  'Hurda / Kullanım Dışı': { bg: 'bg-rose-50 dark:bg-rose-950/60', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800', dot: 'bg-rose-500' },
};

export const EnvanterYonetimiView: React.FC<EnvanterYonetimiViewProps> = ({
  selectedClubFilter = 'all',
  onToast,
}) => {
  const [items, setItems] = useState<EnvanterItem[]>(() => getStoredEnvanter());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    if (onToast) onToast(msg);
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClub, setSelectedClub] = useState(selectedClubFilter);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modals & Selected
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<EnvanterItem | null>(null);
  const [viewingItem, setViewingItem] = useState<EnvanterItem | null>(null);
  const [showZimmetModal, setShowZimmetModal] = useState<EnvanterItem | null>(null);
  const [newZimmetUser, setNewZimmetUser] = useState('');

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<EnvanterItem>>({
    code: '',
    name: '',
    category: 'Toplar',
    club: 'DigiMondi',
    branch: 'Basketbol',
    totalQuantity: 10,
    inUseQuantity: 8,
    inStorageQuantity: 2,
    minQuantityAlert: 4,
    unit: 'Adet',
    condition: 'Yeni / Mükemmel',
    location: 'A Salonu Malzeme Dolabı',
    assignedTo: '',
    unitPrice: 500,
    notes: '',
  });

  // Distinct Clubs
  const clubList = useMemo(() => {
    return Array.from(
      new Set(['DigiMondi', 'Saraçgym', 'aicosports', ...items.map((i) => i.club)])
    ).filter(Boolean);
  }, [items]);

  // Statistics Summary
  const stats = useMemo(() => {
    const totalTypes = items.length;
    const totalUnits = items.reduce((acc, i) => acc + (i.totalQuantity || 0), 0);
    const lowStockCount = items.filter((i) => i.totalQuantity <= i.minQuantityAlert).length;
    const inUseCount = items.reduce((acc, i) => acc + (i.inUseQuantity || 0), 0);
    const totalValue = items.reduce((acc, i) => acc + (i.totalQuantity * (i.unitPrice || 0)), 0);

    return { totalTypes, totalUnits, lowStockCount, inUseCount, totalValue };
  }, [items]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Club filter
      if (selectedClub !== 'all' && item.club !== selectedClub) return false;

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      // Condition filter
      if (selectedCondition !== 'all' && item.condition !== selectedCondition) return false;

      // Low stock alert filter
      if (onlyLowStock && item.totalQuantity > item.minQuantityAlert) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCode = item.code.toLowerCase().includes(q);
        const matchLoc = item.location.toLowerCase().includes(q);
        const matchAssigned = item.assignedTo?.toLowerCase().includes(q) || false;
        const matchBranch = item.branch.toLowerCase().includes(q);
        return matchName || matchCode || matchLoc || matchAssigned || matchBranch;
      }
      return true;
    });
  }, [items, selectedClub, selectedCategory, selectedCondition, onlyLowStock, searchQuery]);

  // Quick Stock Adjustment (+ / -)
  const handleAdjustStock = (itemId: string, delta: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = items.map((item) => {
      if (item.id === itemId) {
        const newTotal = Math.max(0, item.totalQuantity + delta);
        const newInStorage = Math.max(0, item.inStorageQuantity + delta);
        return {
          ...item,
          totalQuantity: newTotal,
          inStorageQuantity: newInStorage,
          lastCheckDate: new Date().toLocaleDateString('tr-TR'),
          lastCheckedBy: 'Sistem Yöneticisi',
        };
      }
      return item;
    });
    setItems(updated);
    saveStoredEnvanter(updated);
    showNotification(delta > 0 ? 'Stok adedi +1 artırıldı.' : 'Stok adedi -1 azaltıldı.');
  };

  // Quick Condition Toggle
  const handleCycleCondition = (itemId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const conditions: EnvanterDurum[] = [
      'Yeni / Mükemmel',
      'İyi Durumda',
      'Yıpranmış / Kontrol',
      'Bakımda / Tamirde',
      'Hurda / Kullanım Dışı',
    ];
    const updated = items.map((item) => {
      if (item.id === itemId) {
        const currentIdx = conditions.indexOf(item.condition);
        const nextCondition = conditions[(currentIdx + 1) % conditions.length];
        return {
          ...item,
          condition: nextCondition,
          lastCheckDate: new Date().toLocaleDateString('tr-TR'),
        };
      }
      return item;
    });
    setItems(updated);
    saveStoredEnvanter(updated);
    showNotification('Malzeme durumu güncellendi.');
  };

  // Delete Item
  const handleDeleteItem = (itemId: string, name: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm(`"${name}" malzemesini envanterden silmek istediğinize emin misiniz?`)) {
      const updated = items.filter((i) => i.id !== itemId);
      setItems(updated);
      saveStoredEnvanter(updated);
      if (viewingItem?.id === itemId) setViewingItem(null);
      showNotification(`"${name}" envanterden kaldırıldı.`);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (item: EnvanterItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingItem(item);
    setFormData({ ...item });
    setShowAddModal(true);
  };

  // Save Add/Edit
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      showNotification('Lütfen malzeme adını giriniz.');
      return;
    }

    if (editingItem) {
      // Update
      const updated = items.map((item) =>
        item.id === editingItem.id
          ? ({
              ...item,
              ...formData,
              totalQuantity: Number(formData.totalQuantity || 0),
              inUseQuantity: Number(formData.inUseQuantity || 0),
              inStorageQuantity: Number(formData.inStorageQuantity || 0),
              minQuantityAlert: Number(formData.minQuantityAlert || 0),
              unitPrice: Number(formData.unitPrice || 0),
              lastCheckDate: new Date().toLocaleDateString('tr-TR'),
            } as EnvanterItem)
          : item
      );
      setItems(updated);
      saveStoredEnvanter(updated);
      showNotification(`"${formData.name}" bilgileri güncellendi.`);
    } else {
      // Create new
      const nextCode = formData.code?.trim() || `ENV-${Date.now().toString().slice(-4)}`;
      const newItem: EnvanterItem = {
        id: `env-${Date.now()}`,
        code: nextCode,
        name: formData.name.trim(),
        category: (formData.category as EnvanterKategori) || 'Toplar',
        club: formData.club || 'DigiMondi',
        branch: formData.branch || 'Basketbol',
        totalQuantity: Number(formData.totalQuantity || 1),
        inUseQuantity: Number(formData.inUseQuantity || 0),
        inStorageQuantity: Number(formData.inStorageQuantity || formData.totalQuantity || 1),
        minQuantityAlert: Number(formData.minQuantityAlert || 3),
        unit: formData.unit || 'Adet',
        condition: (formData.condition as EnvanterDurum) || 'Yeni / Mükemmel',
        location: formData.location || 'Merkez Malzeme Odası',
        assignedTo: formData.assignedTo || '',
        assignedDate: formData.assignedTo ? new Date().toLocaleDateString('tr-TR') : undefined,
        lastCheckDate: new Date().toLocaleDateString('tr-TR'),
        lastCheckedBy: 'Sistem Yöneticisi',
        unitPrice: Number(formData.unitPrice || 0),
        notes: formData.notes || '',
        photoUrl: formData.photoUrl || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&auto=format&fit=crop&q=80',
      };
      const updated = [newItem, ...items];
      setItems(updated);
      saveStoredEnvanter(updated);
      showNotification(`"${newItem.name}" başarıyla envantere eklendi.`);
    }

    setShowAddModal(false);
    setEditingItem(null);
  };

  // Zimmet Ata
  const handleAssignZimmet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showZimmetModal) return;
    const updated = items.map((item) => {
      if (item.id === showZimmetModal.id) {
        return {
          ...item,
          assignedTo: newZimmetUser.trim(),
          assignedDate: newZimmetUser.trim() ? new Date().toLocaleDateString('tr-TR') : undefined,
          lastCheckDate: new Date().toLocaleDateString('tr-TR'),
        };
      }
      return item;
    });
    setItems(updated);
    saveStoredEnvanter(updated);
    showNotification(newZimmetUser.trim() ? `Zimmet ${newZimmetUser} kişisine atandı.` : 'Zimmet kaydı kaldırıldı.');
    setShowZimmetModal(null);
    setNewZimmetUser('');
  };

  // Export CSV simulator
  const handleExportCSV = () => {
    const headers = ['Kod', 'Malzeme Adı', 'Kategori', 'Kulüp', 'Branş', 'Toplam Adet', 'Kullanımda', 'Depoda', 'Durum', 'Konum', 'Zimmetli', 'Birim Fiyat (TL)'];
    const rows = filteredItems.map((i) => [
      i.code,
      `"${i.name}"`,
      i.category,
      i.club,
      i.branch,
      i.totalQuantity,
      i.inUseQuantity,
      i.inStorageQuantity,
      i.condition,
      `"${i.location}"`,
      `"${i.assignedTo || '-'}"`,
      i.unitPrice || 0,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SportsFly_Envanter_Listesi_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Envanter tablosu CSV olarak dışa aktarıldı.');
  };

  return (
    <div className="min-h-full flex flex-col bg-slate-50/50 dark:bg-[#0b1320] text-slate-800 dark:text-slate-100 antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/60 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white dark:bg-[#111c2e] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                <span>Modüller</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-blue-600 dark:text-blue-400 font-bold">Envanter &amp; Malzeme Yönetimi</span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Envanter &amp; Malzeme Yönetimi
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Stok &amp; Zimmet Takip Sistemi
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Kulüp antrenman topları, yelekler, sağlık çantaları ve salon donanımlarını takip edin; stok ve zimmet kontrollerini sağlayın.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={handleExportCSV}
                className="flex-1 sm:flex-initial min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <Download className="w-4 h-4" />
                <span>Dışa Aktar</span>
              </button>

              <button
                onClick={() => {
                  setEditingItem(null);
                  setFormData({
                    code: `ENV-${Math.floor(1000 + Math.random() * 9000)}`,
                    name: '',
                    category: 'Toplar',
                    club: 'DigiMondi',
                    branch: 'Basketbol',
                    totalQuantity: 10,
                    inUseQuantity: 8,
                    inStorageQuantity: 2,
                    minQuantityAlert: 4,
                    unit: 'Adet',
                    condition: 'Yeni / Mükemmel',
                    location: 'A Salonu Malzeme Dolabı',
                    assignedTo: '',
                    unitPrice: 750,
                    notes: '',
                  });
                  setShowAddModal(true);
                }}
                className="flex-1 sm:flex-initial min-h-[40px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Malzeme Ekle</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <div className="bg-slate-50 dark:bg-[#162238]/60 p-2.5 sm:p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Boxes className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">Toplam Ekipman</div>
                <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {stats.totalUnits} Adet ({stats.totalTypes} Çeşit)
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-[#162238]/60 p-2.5 sm:p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <PackageCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">Aktif Sahada / Kullanımda</div>
                <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {stats.inUseCount} Adet Aktif
                </div>
              </div>
            </div>

            <div
              onClick={() => setOnlyLowStock(!onlyLowStock)}
              className={`p-2.5 sm:p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                stats.lowStockCount > 0
                  ? onlyLowStock
                    ? 'bg-rose-100 dark:bg-rose-950/80 border-rose-500 ring-2 ring-rose-500/20'
                    : 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 hover:bg-rose-100'
                  : 'bg-slate-50 dark:bg-[#162238]/60 border-slate-200/60 dark:border-slate-800'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] sm:text-xs font-semibold text-rose-600 dark:text-rose-400 truncate">Kritik Stok Uyarısı</div>
                <div className="text-sm sm:text-base font-black text-rose-700 dark:text-rose-300">
                  {stats.lowStockCount} Ürün Kritik
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-[#162238]/60 p-2.5 sm:p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">Toplam Envanter Değeri</div>
                <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  ₺{stats.totalValue.toLocaleString('tr-TR')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col gap-5">
        {/* Filters Toolbar */}
        <div className="bg-white dark:bg-[#111c2e] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Malzeme adı, barkod/kod, dolap/konum veya zimmetli antrenör ara..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-[#0b1320] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Club Dropdown */}
              <select
                value={selectedClub}
                onChange={(e) => setSelectedClub(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-[#0b1320] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">Tüm Kulüpler</option>
                {clubList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* Condition Filter */}
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-[#0b1320] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="Yeni / Mükemmel">🟢 Yeni / Mükemmel</option>
                <option value="İyi Durumda">🔵 İyi Durumda</option>
                <option value="Yıpranmış / Kontrol">🟡 Yıpranmış / Kontrol</option>
                <option value="Bakımda / Tamirde">🟣 Bakımda / Tamirde</option>
                <option value="Hurda / Kullanım Dışı">🔴 Hurda / Kullanım Dışı</option>
              </select>

              {/* View Switcher */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-white dark:bg-[#111c2e] text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  Tablo
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'cards'
                      ? 'bg-white dark:bg-[#111c2e] text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  Kartlar
                </button>
              </div>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Tüm Kategoriler
            </button>
            {(
              [
                'Toplar',
                'Formalar & Yelekler',
                'Antrenman Ekipmanları',
                'Sağlık & Medikal',
                'Tesis & Saha Donanımı',
                'Elektronik & Ölçüm',
              ] as EnvanterKategori[]
            ).map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Inventory List / Table */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Envanter Malzemeleri ({filteredItems.length})
            </h2>

            {(selectedCategory !== 'all' || selectedClub !== 'all' || selectedCondition !== 'all' || onlyLowStock || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedClub('all');
                  setSelectedCondition('all');
                  setOnlyLowStock(false);
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Filtreleri Temizle</span>
              </button>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <div className="bg-white dark:bg-[#111c2e] p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-4">
                <Boxes className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Arama Kriterine Uygun Malzeme Bulunamadı</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                Filtreleri değiştirebilir veya kulübünüze hemen yeni ekipman ekleyebilirsiniz.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Malzeme Ekle</span>
              </button>
            </div>
          ) : viewMode === 'table' ? (
            /* Tablo Görünümü */
            <div className="bg-white dark:bg-[#111c2e] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-[#162238] border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4 w-12">Kod</th>
                      <th className="py-3 px-4">Malzeme Tanımı</th>
                      <th className="py-3 px-4">Kategori &amp; Branş</th>
                      <th className="py-3 px-4">Kulüp &amp; Konum</th>
                      <th className="py-3 px-4 text-center">Stok / Durum</th>
                      <th className="py-3 px-4">Zimmetli Kişi</th>
                      <th className="py-3 px-4">Kondisyon</th>
                      <th className="py-3 px-4 text-right">Hızlı İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredItems.map((item) => {
                      const catStyle = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Diğer;
                      const condStyle = CONDITION_COLORS[item.condition] || CONDITION_COLORS['İyi Durumda'];
                      const isLowStock = item.totalQuantity <= item.minQuantityAlert;

                      return (
                        <tr
                          key={item.id}
                          onClick={() => setViewingItem(item)}
                          className="hover:bg-blue-50/40 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                        >
                          {/* Kod */}
                          <td className="py-3 px-4 font-mono font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {item.code}
                          </td>

                          {/* Malzeme Adı & Görsel */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {item.photoUrl ? (
                                <img
                                  src={item.photoUrl}
                                  alt=""
                                  className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                                  <Boxes className="w-5 h-5" />
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm flex items-center gap-2">
                                  <span>{item.name}</span>
                                  {isLowStock && (
                                    <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 animate-pulse">
                                      Kritik Stok
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                                  ₺{item.unitPrice?.toLocaleString('tr-TR')} / {item.unit} {item.notes && `• ${item.notes}`}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Kategori & Branş */}
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                            >
                              {item.category}
                            </span>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                              {item.branch}
                            </div>
                          </td>

                          {/* Kulüp & Konum */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 dark:text-slate-200">{item.club}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span className="truncate max-w-[140px]">{item.location}</span>
                            </div>
                          </td>

                          {/* Stok / Miktar */}
                          <td className="py-3 px-4 text-center">
                            <div className="inline-flex items-center gap-1.5">
                              <span className="font-black text-sm text-slate-900 dark:text-white">
                                {item.totalQuantity}
                              </span>
                              <span className="text-slate-500 text-[11px]">{item.unit}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 mt-0.5">
                              <span className="text-emerald-600 dark:text-emerald-400">{item.inUseQuantity} Kullanımda</span>
                              <span>•</span>
                              <span className="text-blue-600 dark:text-blue-400">{item.inStorageQuantity} Depoda</span>
                            </div>
                          </td>

                          {/* Zimmetli */}
                          <td className="py-3 px-4">
                            {item.assignedTo ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowZimmetModal(item);
                                  setNewZimmetUser(item.assignedTo || '');
                                }}
                                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
                                title="Zimmeti Değiştir"
                              >
                                <UserCheck className="w-3 h-3 text-indigo-500" />
                                <span>{item.assignedTo}</span>
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowZimmetModal(item);
                                  setNewZimmetUser('');
                                }}
                                className="text-[11px] text-slate-400 hover:text-blue-600 font-medium underline"
                              >
                                + Zimmetle
                              </button>
                            )}
                          </td>

                          {/* Kondisyon Durumu */}
                          <td className="py-3 px-4">
                            <button
                              onClick={(e) => handleCycleCondition(item.id, e)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${condStyle.bg} ${condStyle.text} ${condStyle.border} hover:opacity-80`}
                              title="Durumu değiştirmek için tıklayın"
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${condStyle.dot}`} />
                              <span>{item.condition}</span>
                            </button>
                          </td>

                          {/* Quick Actions */}
                          <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              {/* Fast Stock Adjust */}
                              <button
                                onClick={(e) => handleAdjustStock(item.id, -1, e)}
                                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Stok Azalt (-1)"
                              >
                                <MinusCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleAdjustStock(item.id, 1, e)}
                                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
                                title="Stok Artır (+1)"
                              >
                                <PlusCircle className="w-4 h-4" />
                              </button>

                              {/* Edit */}
                              <button
                                onClick={(e) => handleOpenEdit(item, e)}
                                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer ml-1"
                                title="Düzenle"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={(e) => handleDeleteItem(item.id, item.name, e)}
                                className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Sil"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Kartlar Görünümü */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => {
                const catStyle = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Diğer;
                const condStyle = CONDITION_COLORS[item.condition] || CONDITION_COLORS['İyi Durumda'];
                const isLowStock = item.totalQuantity <= item.minQuantityAlert;

                return (
                  <div
                    key={item.id}
                    onClick={() => setViewingItem(item)}
                    className="group bg-white dark:bg-[#111c2e] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                          >
                            {item.category}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500">{item.branch}</span>
                        </div>

                        <span className="text-[10px] font-mono font-bold text-slate-400">{item.code}</span>
                      </div>

                      {/* Photo & Name */}
                      <div className="flex items-center gap-3 my-3">
                        {item.photoUrl && (
                          <img
                            src={item.photoUrl}
                            alt=""
                            className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                          />
                        )}
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </h3>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stock Progress Bar */}
                      <div className="bg-slate-50 dark:bg-[#162238] p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 mb-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            Stok: {item.totalQuantity} {item.unit}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {item.inUseQuantity} Kullanımda / {item.inStorageQuantity} Depoda
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isLowStock ? 'bg-rose-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                            }`}
                            style={{
                              width: `${Math.min(100, (item.totalQuantity / (item.minQuantityAlert * 3 || 10)) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <button
                        onClick={(e) => handleCycleCondition(item.id, e)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${condStyle.bg} ${condStyle.text} ${condStyle.border}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${condStyle.dot}`} />
                        <span>{item.condition}</span>
                      </button>

                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleAdjustStock(item.id, -1, e)}
                          className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-600"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleAdjustStock(item.id, 1, e)}
                          className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-emerald-600"
                        >
                          <PlusCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleOpenEdit(item, e)}
                          className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: Malzeme Ekle / Düzenle */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#111c2e] w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  {editingItem ? 'Malzeme Kartını Düzenle' : 'Yeni Malzeme / Ekipman Ekle'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Kulüp envanterine yeni ürün tanımlayın ve stok parametrelerini girin.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Malzeme Adı */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Malzeme Adı &amp; Modeli *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Örn: Molten GG7X Basketbol Topu No:7"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0b1320] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Barkod / Kod */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Envanter Kodu / Barkod
                  </label>
                  <input
                    type="text"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Örn: ENV-BASK-01"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0b1320] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori *
                  </label>
                  <select
                    value={formData.category || 'Toplar'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as EnvanterKategori })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0b1320] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Toplar">Toplar</option>
                    <option value="Formalar & Yelekler">Formalar &amp; Yelekler</option>
                    <option value="Antrenman Ekipmanları">Antrenman Ekipmanları</option>
                    <option value="Sağlık & Medikal">Sağlık &amp; Medikal</option>
                    <option value="Tesis & Saha Donanımı">Tesis &amp; Saha Donanımı</option>
                    <option value="Elektronik & Ölçüm">Elektronik &amp; Ölçüm</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>

                {/* Kulüp */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kulüp / Tesis *
                  </label>
                  <select
                    value={formData.club || 'DigiMondi'}
                    onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0b1320] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    {clubList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Branş */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Branş
                  </label>
                  <input
                    type="text"
                    value={formData.branch || 'Basketbol'}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    placeholder="Basketbol, Voleybol, Genel..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0b1320] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Toplam Adet */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Toplam Adet *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.totalQuantity || 1}
                    onChange={(e) => setFormData({ ...formData, totalQuantity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0b1320] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Kritik Stok Uyarısı Eşiği */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kritik Stok Uyarısı (Min Adet)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minQuantityAlert || 3}
                    onChange={(e) => setFormData({ ...formData, minQuantityAlert: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0b1320] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Durum / Kondisyon */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kondisyon Durumu
                  </label>
                  <select
                    value={formData.condition || 'Yeni / Mükemmel'}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value as EnvanterDurum })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0b1320] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Yeni / Mükemmel">Yeni / Mükemmel</option>
                    <option value="İyi Durumda">İyi Durumda</option>
                    <option value="Yıpranmış / Kontrol">Yıpranmış / Kontrol</option>
                    <option value="Bakımda / Tamirde">Bakımda / Tamirde</option>
                    <option value="Hurda / Kullanım Dışı">Hurda / Kullanım Dışı</option>
                  </select>
                </div>

                {/* Bulunduğu Konum / Dolap */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Depo / Dolap Konumu
                  </label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Örn: A Salonu Dolap-2 Raf 3"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0b1320] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Birim Fiyat (TL) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Birim Maliyet / Değer (₺)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.unitPrice || 0}
                    onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0b1320] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Zimmetli Antrenör */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Zimmetli Kişi / Antrenör
                  </label>
                  <input
                    type="text"
                    value={formData.assignedTo || ''}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    placeholder="Örn: Ali Özcan"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0b1320] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Notlar */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Açıklama / Kontrol Notu
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Ekipman özellikleri, bakım periyodu vb."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0b1320] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all"
                >
                  {editingItem ? 'Değişiklikleri Kaydet' : 'Envantere Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Zimmet Atama */}
      {showZimmetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111c2e] w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Malzeme Zimmet Formu</h3>
                  <p className="text-[11px] text-slate-500">{showZimmetModal.name}</p>
                </div>
              </div>
              <button onClick={() => setShowZimmetModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignZimmet} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Zimmetlenecek Antrenör / Personel
                </label>
                <input
                  type="text"
                  value={newZimmetUser}
                  onChange={(e) => setNewZimmetUser(e.target.value)}
                  placeholder="Örn: Ali Özcan (Başantrenör)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0b1320] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Zimmeti kaldırmak için alanı boş bırakıp kaydedebilirsiniz.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowZimmetModal(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                >
                  Zimmeti Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Malzeme Detay Kartı */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111c2e] w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                {viewingItem.photoUrl && (
                  <img
                    src={viewingItem.photoUrl}
                    alt=""
                    className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                )}
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                    {viewingItem.code}
                  </span>
                  <h3 className="font-black text-base text-slate-900 dark:text-white mt-1">{viewingItem.name}</h3>
                </div>
              </div>
              <button onClick={() => setViewingItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-[#162238] p-4 rounded-2xl border border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <span className="text-slate-400 block text-[10px]">Kategori / Branş</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{viewingItem.category} • {viewingItem.branch}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Kulüp &amp; Konum</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{viewingItem.club} / {viewingItem.location}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Toplam Stok</span>
                <span className="font-black text-slate-900 dark:text-white text-sm">{viewingItem.totalQuantity} {viewingItem.unit}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Zimmet Durumu</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{viewingItem.assignedTo || 'Zimmetsiz'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Son Sayım / Kontrol</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{viewingItem.lastCheckDate} ({viewingItem.lastCheckedBy})</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Toplam Değer</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">₺{((viewingItem.unitPrice || 0) * viewingItem.totalQuantity).toLocaleString('tr-TR')}</span>
              </div>
            </div>

            {viewingItem.notes && (
              <p className="text-xs text-slate-600 dark:text-slate-400 bg-blue-50/50 dark:bg-blue-950/30 p-3 rounded-xl border border-blue-100 dark:border-blue-900/40 mb-4">
                💡 <span className="font-bold">Not:</span> {viewingItem.notes}
              </p>
            )}

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  const item = viewingItem;
                  setViewingItem(null);
                  handleOpenEdit(item);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
              >
                Düzenle
              </button>
              <button
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
