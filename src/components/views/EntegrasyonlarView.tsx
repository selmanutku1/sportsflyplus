import React, { useState, useMemo } from 'react';
import {
  Search,
  Check,
  Star,
  Trophy,
  Boxes,
  CreditCard,
  MessageSquare,
  PhoneCall,
  Receipt,
  Calendar,
  Activity,
  Flame,
  Layers,
  Settings,
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { EntegrasyonItem, NavPage } from '../../types';
import { getStoredIntegrations, saveStoredIntegrations } from '../../data/entegrasyonlarData';
import { SporpuanSporcuDegerlendirmeView } from './sporpuan/SporpuanSporcuDegerlendirmeView';
import { TurnuvaYonetimiView } from './moduller/TurnuvaYonetimiView';
import { EnvanterYonetimiView } from './moduller/EnvanterYonetimiView';

interface EntegrasyonlarViewProps {
  onNavigate?: (page: NavPage) => void;
  onToast?: (msg: string) => void;
}

const CATEGORIES = [
  'Tüm Entegrasyonlar',
  'Kulüp & Spor Modülleri',
  'Ödeme Yöntemleri',
  'İletişim & Bildirim',
  'Faturalandırma & Muhasebe',
  'Takvim & Senkronizasyon',
  'Giyilebilir & GPS',
  'Diğerleri',
];

export const EntegrasyonlarView: React.FC<EntegrasyonlarViewProps> = ({
  onNavigate,
  onToast,
}) => {
  const [integrations, setIntegrations] = useState<EntegrasyonItem[]>(() =>
    getStoredIntegrations()
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tüm Entegrasyonlar');

  // Filter Switches on top right (Önerilen, Aktif Olanlar)
  const [onlyRecommended, setOnlyRecommended] = useState(false);
  const [onlyActive, setOnlyActive] = useState(false);

  // Active Sub-module viewing (e.g. if user opens SporPuan, Turnuva, or Envanter directly inside Integrations)
  const [activeSubModule, setActiveSubModule] = useState<'sporpuan' | 'turnuva' | 'envanter' | null>(null);

  // Settings Modal for 3rd party APIs (İyzico, WhatsApp, etc.)
  const [settingsModalItem, setSettingsModalItem] = useState<EntegrasyonItem | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiSecretInput, setApiSecretInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    if (onToast) onToast(msg);
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle integration state (Active / Inactive)
  const handleToggleActive = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = integrations.map((item) => {
      if (item.id === id) {
        const nextState = !item.isActive;
        return {
          ...item,
          isActive: nextState,
          connectedAt: nextState ? new Date().toLocaleDateString('tr-TR') : undefined,
        };
      }
      return item;
    });
    setIntegrations(updated);
    saveStoredIntegrations(updated);
    const target = updated.find((i) => i.id === id);
    showNotification(
      target?.isActive
        ? `"${target.name}" entegrasyonu aktif edildi.`
        : `"${target?.name}" entegrasyonu devre dışı bırakıldı.`
    );
  };

  // Open integration action
  const handleOpenIntegration = (item: EntegrasyonItem) => {
    if (item.id === 'int-sporpuan') {
      setActiveSubModule('sporpuan');
    } else if (item.id === 'int-turnuva') {
      setActiveSubModule('turnuva');
    } else if (item.id === 'int-envanter') {
      setActiveSubModule('envanter');
    } else {
      setSettingsModalItem(item);
      setApiKeyInput(item.apiKey || '');
      setApiSecretInput('••••••••••••••••');
    }
  };

  // Save Settings Modal
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsModalItem) return;
    const updated = integrations.map((i) =>
      i.id === settingsModalItem.id
        ? {
            ...i,
            apiKey: apiKeyInput,
            isActive: true,
            connectedAt: new Date().toLocaleDateString('tr-TR'),
          }
        : i
    );
    setIntegrations(updated);
    saveStoredIntegrations(updated);
    showNotification(`"${settingsModalItem.name}" ayarları başarıyla kaydedildi ve bağlandı.`);
    setSettingsModalItem(null);
  };

  // Filtered List
  const filteredList = useMemo(() => {
    return integrations.filter((item) => {
      // Category filter
      if (selectedCategory !== 'Tüm Entegrasyonlar' && item.category !== selectedCategory) {
        return false;
      }

      // Switches filters
      if (onlyRecommended && !item.isRecommended) return false;
      if (onlyActive && !item.isActive) return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        return matchName || matchDesc || matchCat;
      }

      return true;
    });
  }, [integrations, selectedCategory, onlyRecommended, onlyActive, searchQuery]);

  // Helper Icon Renderer
  const renderIcon = (name?: string, id?: string) => {
    switch (name) {
      case 'Star':
        return <Star className="w-7 h-7 fill-amber-400 text-amber-500" />;
      case 'Trophy':
        return <Trophy className="w-7 h-7 text-amber-600" />;
      case 'Boxes':
        return <Boxes className="w-7 h-7 text-blue-600" />;
      case 'CreditCard':
        return <CreditCard className="w-7 h-7 text-emerald-600" />;
      case 'MessageSquare':
        return <MessageSquare className="w-7 h-7 text-green-500" />;
      case 'PhoneCall':
        return <PhoneCall className="w-7 h-7 text-indigo-600" />;
      case 'Receipt':
        return <Receipt className="w-7 h-7 text-purple-600" />;
      case 'Calendar':
        return <Calendar className="w-7 h-7 text-sky-600" />;
      case 'Activity':
        return <Activity className="w-7 h-7 text-rose-500" />;
      case 'Flame':
        return <Flame className="w-7 h-7 text-orange-500" />;
      default:
        return <Layers className="w-7 h-7 text-slate-600" />;
    }
  };

  // If user is inside a submodule (SporPuan, Turnuva, or Envanter), show the submodule with a clean back button
  if (activeSubModule) {
    return (
      <div className="space-y-4">
        {/* Back navigation header */}
        <div className="bg-white dark:bg-[#111c2e] p-3.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-2xs">
          <button
            onClick={() => setActiveSubModule(null)}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>Entegrasyonlar Sayfasına Geri Dön</span>
          </button>
          <div className="text-xs text-slate-400 font-semibold">
            {activeSubModule === 'sporpuan' && 'SporPuan Modülü'}
            {activeSubModule === 'turnuva' && 'Turnuva & Lig Yönetimi'}
            {activeSubModule === 'envanter' && 'Envanter & Malzeme Takibi'}
          </div>
        </div>

        {activeSubModule === 'sporpuan' && <SporpuanSporcuDegerlendirmeView onToast={onToast} />}
        {activeSubModule === 'turnuva' && <TurnuvaYonetimiView onToast={onToast} />}
        {activeSubModule === 'envanter' && <EnvanterYonetimiView onToast={onToast} />}
      </div>
    );
  }

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

      {/* Main Container matching screenshot layout */}
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-4 lg:px-6 py-4 flex flex-col md:flex-row gap-4 md:gap-6">
        
        {/* MOBILE VIEW ONLY: Search & Horizontal Category Scroll */}
        <div className="md:hidden space-y-3">
          {/* Mobile Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Entegrasyon ara..."
              className="w-full pl-3.5 pr-9 py-2.5 bg-white dark:bg-[#111c2e] border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-500 shadow-2xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Horizontal Scrollable Categories for Mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none -mx-3 px-3">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'bg-white dark:bg-[#111c2e] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* DESKTOP LEFT COLUMN: Search & Vertical Category Menu */}
        <div className="hidden md:block w-64 shrink-0 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Entegrasyon ara"
              className="w-full pl-3.5 pr-9 py-2.5 bg-white dark:bg-[#111c2e] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-500 shadow-2xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Vertical Menu Card */}
          <div className="bg-white dark:bg-[#111c2e] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-2 shadow-2xs space-y-1">
            {/* Primary Category: Tüm Entegrasyonlar */}
            <button
              onClick={() => setSelectedCategory('Tüm Entegrasyonlar')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === 'Tüm Entegrasyonlar'
                  ? 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-extrabold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              Tüm Entegrasyonlar
            </button>

            {/* Sub-header */}
            <div className="pt-2 pb-1 px-3.5 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              KULÜPLER İÇİN
            </div>

            {/* Other Categories */}
            {CATEGORIES.filter((c) => c !== 'Tüm Entegrasyonlar').map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Header bar with switches & Grid Cards */}
        <div className="flex-1 min-w-0 space-y-3 sm:space-y-4">
          {/* Top Bar: Title & Toggle Switches */}
          <div className="flex flex-row items-center justify-between gap-3 bg-white dark:bg-[#111c2e] p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight truncate">
                {selectedCategory}
              </h1>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0">
                {filteredList.length}
              </span>
            </div>

            {/* Switches: Önerilen, Aktif Olanlar */}
            <div className="flex items-center gap-3 sm:gap-5 shrink-0 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {/* Önerilen Switch */}
              <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyRecommended}
                  onChange={(e) => setOnlyRecommended(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-8 sm:w-9 h-4.5 sm:h-5 rounded-full transition-colors relative ${
                    onlyRecommended ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full bg-white absolute top-0.75 transition-transform ${
                      onlyRecommended ? 'left-4 sm:left-4.5' : 'left-0.75'
                    }`}
                  />
                </div>
                <span className="text-[11px] sm:text-xs">Önerilen</span>
              </label>

              {/* Aktif Olanlar Switch */}
              <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyActive}
                  onChange={(e) => setOnlyActive(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-8 sm:w-9 h-4.5 sm:h-5 rounded-full transition-colors relative ${
                    onlyActive ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full bg-white absolute top-0.75 transition-transform ${
                      onlyActive ? 'left-4 sm:left-4.5' : 'left-0.75'
                    }`}
                  />
                </div>
                <span className="text-[11px] sm:text-xs">Aktif</span>
              </label>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredList.length === 0 ? (
            <div className="bg-white dark:bg-[#111c2e] p-8 sm:p-12 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 dark:bg-blue-950/60 dark:text-blue-400 mx-auto flex items-center justify-center mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Aranan Kriterde Entegrasyon Bulunamadı</h3>
              <p className="text-xs text-slate-500 mt-1">Arama terimini değiştirerek veya filtreleri temizleyerek tekrar deneyin.</p>
              <button
                onClick={() => {
                  setSelectedCategory('Tüm Entegrasyonlar');
                  setSearchQuery('');
                  setOnlyRecommended(false);
                  setOnlyActive(false);
                }}
                className="mt-4 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Filtreleri Sıfırla
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredList.map((item) => {
                return (
                  <div
                    key={item.id}
                    onClick={() => handleOpenIntegration(item)}
                    className="bg-white dark:bg-[#111c2e] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs hover:shadow-md hover:border-orange-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      {/* Card Header: Icon / Brand & Badge */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-[#162238] border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            {renderIcon(item.iconName, item.id)}
                          </div>
                        </div>

                        {/* Top Right Badges (Önerilen or Aktif) */}
                        <div className="flex items-center gap-1.5">
                          {item.isRecommended && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800">
                              Önerilen
                            </span>
                          )}
                          {item.isActive && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Aktif" />
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                        {item.name}
                      </h3>

                      {/* Description (Sade, net, kendini tekrar etmeyen) */}
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Card Footer: Active toggle switch + Action button */}
                    <div
                      className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Active / Inactive Switch */}
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={item.isActive}
                          onChange={() => handleToggleActive(item.id)}
                          className="sr-only"
                        />
                        <div
                          className={`w-8 h-4.5 rounded-full transition-colors relative ${
                            item.isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full bg-white absolute top-0.75 transition-transform ${
                              item.isActive ? 'left-4.25' : 'left-0.75'
                            }`}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                          {item.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </label>

                      {/* Action Button */}
                      <button
                        onClick={() => handleOpenIntegration(item)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-orange-500 hover:text-white dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <span>{item.isInternalModule ? 'Modülü Aç' : 'Ayarla'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* API / External Integration Settings Modal */}
      {settingsModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111c2e] w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  {renderIcon(settingsModalItem.iconName, settingsModalItem.id)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{settingsModalItem.name}</h3>
                  <p className="text-[11px] text-slate-500">{settingsModalItem.category}</p>
                </div>
              </div>
              <button onClick={() => setSettingsModalItem(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 bg-slate-50 dark:bg-[#162238] p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              {settingsModalItem.description}
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  API Anahtarı / Müşteri Kodu (Client ID)
                </label>
                <input
                  type="text"
                  required
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Örn: sk_live_89234723948..."
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#0b1320] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Gizli Anahtar (Secret Key / Token)
                </label>
                <input
                  type="password"
                  value={apiSecretInput}
                  onChange={(e) => setApiSecretInput(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#0b1320] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                    Entegrasyon Durumu
                  </span>
                </div>
                <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400">
                  {settingsModalItem.isActive ? 'Bağlantı Aktif' : 'Hazır'}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSettingsModalItem(null)}
                  className="px-3.5 py-2 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-orange-500 hover:bg-orange-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-xs"
                >
                  Bağlantıyı Doğrula &amp; Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
