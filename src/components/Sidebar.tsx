import React, { useState, useEffect } from 'react';
import {
  Home,
  User,
  Layout,
  Package,
  UserX,
  UserCheck,
  UserPlus,
  FileText,
  Building2,
  ChevronDown,
  ChevronRight,
  Activity,
  Award,
  Users,
  GraduationCap,
  Star,
  ShieldCheck,
  TrendingUp,
  X,
  CalendarDays,
  Receipt,
  CreditCard,
  Layers,
  FolderTree,
  Lock,
  ClipboardCheck,
  Image as ImageIcon,
  FileCheck,
  BarChart3,
  BookOpen,
  LifeBuoy,
  Headphones,
  Video,
  Sparkles,
} from 'lucide-react';
import { NavPage, PackagePlanType } from '../types';
import { SportsFlyLogo, SportsFlyIcon } from './SportsFlyLogo';
import { isPageAllowedForPlan, isSuperAdminUser, PACKAGE_DETAILS } from '../data/packagePermissions';
import { getStoredUserProfile, UserProfileData } from '../data/userProfile';
import { useLanguage } from '../i18n/LanguageContext';

interface SidebarProps {
  currentPage: NavPage;
  onSelectPage: (page: NavPage) => void;
  isOpen: boolean;
  onCloseMobile?: () => void;
  currentPlan?: PackagePlanType;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  isOpen,
  onCloseMobile,
  currentPlan,
}) => {
  const { t } = useLanguage();
  const [userProfile, setUserProfile] = useState<UserProfileData>(() => getStoredUserProfile());

  useEffect(() => {
    const handleProfileUpdate = () => {
      setUserProfile(getStoredUserProfile());
    };
    window.addEventListener('storage', handleProfileUpdate);
    window.addEventListener('sportsfly_profile_updated', handleProfileUpdate);
    return () => {
      window.removeEventListener('storage', handleProfileUpdate);
      window.removeEventListener('sportsfly_profile_updated', handleProfileUpdate);
    };
  }, []);

  const isSuperAdmin = isSuperAdminUser(userProfile?.role);

  const isRestricted = (page: NavPage) => {
    if (!currentPlan) return false;
    return !isPageAllowedForPlan(page, currentPlan, userProfile?.role);
  };

  const visibleMuhasebeItems = (
    [
      'on-muhasebe',
      'gelir-gider-kategori',
      'gelir-gider-yonetimi',
      'odeme-plani-kontrol',
      'odeme-plani',
    ] as NavPage[]
  ).filter((page) => !isRestricted(page));

  const visibleSporpuanItems = (
    [
      'sporpuan-sporcu-degerlendirme',
      'sporpuan-degerlendirmeler',
      'sporpuan-dogrulamalar',
      'sporpuan-raporlar',
    ] as NavPage[]
  ).filter((page) => !isRestricted(page));

  // Ensure "Kulüpler" sub-menu stays open if child is active or by default
  const isBusinessChildActive = [
    'subeler',
    'yoneticiler',
    'on-kayit',
    'brans-yonetimi',
    'aktivite-yonetimi',
    'sporcular',
    'sporcu-karnesi',
    'egitim-planlama',
    'egitmenler',
    'gruplar',
    'antrenman-takvimi',
    'kulup-evraklari',
    'kulup-galerisi',
  ].includes(currentPage);

  // Sporpuan child active state
  const isSporpuanChildActive = [
    'sporpuan-degerlendirmeler',
    'sporpuan-sporcu-degerlendirme',
    'sporpuan-dogrulamalar',
    'sporpuan-raporlar',
  ].includes(currentPage);

  // Ön Muhasebe child active state
  const isOnMuhasebeChildActive = [
    'on-muhasebe',
    'gelir-gider-kategori',
    'gelir-gider-yonetimi',
    'odeme-plani-kontrol',
    'odeme-plani',
  ].includes(currentPage);

  const [isBusinessesOpen, setIsBusinessesOpen] = useState(true);
  const [isReputationOpen, setIsReputationOpen] = useState(true);
  const [isOnMuhasebeOpen, setIsOnMuhasebeOpen] = useState(true);

  const handleNavClick = (page: NavPage) => {
    onSelectPage(page);
    if (onCloseMobile && window.innerWidth < 1024) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Desktop Compact Icon Rail when sidebar is collapsed (matches screenshot) */}
      {!isOpen && (
        <aside
          id="app-sidebar-compact"
          className="hidden lg:flex flex-col w-16 bg-white dark:bg-[#111c2e] border-r border-slate-200/90 dark:border-slate-800 py-3 items-center shrink-0 z-30 justify-between select-none transition-colors"
        >
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="p-1.5 cursor-pointer" onClick={() => handleNavClick('anasayfa')} title="SportsFly">
              <SportsFlyLogo className="w-8 h-8" />
            </div>

            {/* Manager Avatar Icon */}
            <div
              className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors shadow-2xs"
              title="SportsFly Manager"
            >
              <SportsFlyIcon className="w-4 h-4" />
            </div>

            <div className="w-8 h-px bg-slate-100 dark:bg-slate-800 my-0.5" />

            {/* Navigation Icons */}
            <div className="flex flex-col items-center gap-1.5 w-full px-2">
              <button
                onClick={() => handleNavClick('anasayfa')}
                title="Anasayfa"
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  currentPage === 'anasayfa'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Home className="w-4 h-4" />
              </button>

              {isSuperAdmin && (
                <button
                  onClick={() => handleNavClick('sporsepeti-user')}
                  title="Sporsepeti User"
                  className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                    currentPage === 'sporsepeti-user'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                </button>
              )}

              {isSuperAdmin && (
                <button
                  onClick={() => handleNavClick('sayfa-yonetimi')}
                  title="Sayfa Yönetimi"
                  className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                    currentPage === 'sayfa-yonetimi'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Layout className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => handleNavClick('paketler')}
                title="Paketler"
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  currentPage === 'paketler' || currentPage === 'paket-yonetimi'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Package className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleNavClick('on-kayit')}
                title="Ön Kayıt"
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  currentPage === 'on-kayit'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleNavClick('sporcular')}
                title="Sporcular"
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  currentPage === 'sporcular'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => handleNavClick('sporcu-karnesi')}
                title="Sporcu Karnesi"
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  currentPage === 'sporcu-karnesi'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Award className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleNavClick('egitim-planlama')}
                title="Eğitim Planlama"
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  currentPage === 'egitim-planlama'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
              </button>

              {!isRestricted('subeler') && (
                <button
                  onClick={() => handleNavClick('subeler')}
                  title="Şube & Tesis Yönetimi"
                  className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                    currentPage === 'subeler'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                </button>
              )}

              {!isRestricted('sube-ozet') && (
                <button
                  onClick={() => handleNavClick('sube-ozet')}
                  title="Şube Özet & Analitik"
                  className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                    currentPage === 'sube-ozet'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
              )}

              {!isRestricted('brans-yonetimi') && (
                <button
                  onClick={() => handleNavClick('brans-yonetimi')}
                  title="Branş Yönetimi"
                  className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                    currentPage === 'brans-yonetimi'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4" />
                </button>
              )}

              {!isRestricted('gruplar') && (
                <button
                  onClick={() => handleNavClick('gruplar')}
                  title="Gruplar"
                  className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                    currentPage === 'gruplar'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                </button>
              )}

              {/* Ön Muhasebe */}
              {visibleMuhasebeItems.length > 0 && (
                <button
                  onClick={() => handleNavClick(visibleMuhasebeItems[0])}
                  title="Ön Muhasebe"
                  className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                    isOnMuhasebeChildActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Receipt className="w-4 h-4" />
                </button>
              )}

              {/* Sporpuan */}
              {visibleSporpuanItems.length > 0 && (
                <button
                  onClick={() => handleNavClick(visibleSporpuanItems[0])}
                  title={isSuperAdmin ? 'Sporpuan İtibar Portalı (Süper Admin Yetkisi Aktif)' : 'Sporpuan İtibar Portalı'}
                  className={`p-2.5 rounded-xl transition-all relative cursor-pointer ${
                    isSporpuanChildActive
                      ? 'bg-slate-900 dark:bg-blue-600 text-amber-400 dark:text-white shadow-xs'
                      : 'text-amber-500 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Star className="w-4 h-4 fill-amber-400" />
                  {isSuperAdmin && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-white dark:ring-slate-900" title="Süper Admin Erişimi Aktif" />
                  )}
                </button>
              )}

              {/* Yöneticiler */}
              <button
                onClick={() => handleNavClick('yoneticiler')}
                title="Yöneticiler (Spor Okulu Girişi)"
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  currentPage === 'yoneticiler'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
              </button>

              {/* Destek & Yardım */}
              <button
                onClick={() => handleNavClick('destek')}
                title="SportsFly Destek Masası (7/24)"
                className={`p-2.5 rounded-xl transition-all relative cursor-pointer ${
                  currentPage === 'destek'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800'
                }`}
              >
                <LifeBuoy className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 right-1.5 ring-1 ring-white dark:ring-slate-900" />
              </button>
            </div>
          </div>
        </aside>
      )}

      <aside
        id="app-sidebar"
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white dark:bg-[#111c2e] border-r border-slate-200/90 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out shadow-2xl ${
          isOpen
            ? 'translate-x-0 lg:static lg:w-64 lg:flex lg:flex-col lg:shadow-none'
            : '-translate-x-full lg:hidden'
        }`}
      >
        {/* Brand Logo matching the screenshots */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <SportsFlyLogo className="w-9 h-9" />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                SportsFly
              </span>
            </div>
          </div>
          {/* Mobile Close Button (44px touch target) */}
          <button
            id="sidebar-close-mobile-btn"
            onClick={onCloseMobile}
            className="w-10 h-10 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Menüyü Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Manager selector badge item matching the screenshot */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/80 dark:bg-[#162238]/70 hover:bg-slate-100 dark:hover:bg-[#162238] border border-slate-200/60 dark:border-slate-700 transition-colors">
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <SportsFlyIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                SportsFly Manager
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                Admin Portalı
              </p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 text-sm">
          {/* Anasayfa */}
          <button
            onClick={() => handleNavClick('anasayfa')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all cursor-pointer ${
              currentPage === 'anasayfa'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>{t('sidebar.dashboard')}</span>
          </button>

          {/* Paketler */}
          <button
            onClick={() => handleNavClick('paketler')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all cursor-pointer ${
              currentPage === 'paketler' || currentPage === 'paket-yonetimi'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Package className="w-4 h-4 shrink-0" />
            <span>{t('sidebar.packages')}</span>
          </button>

          {/* Kulüp Sözleşmeleri (Süper Admin Özel) */}
          {isSuperAdmin && !isRestricted('kullanici-sozlesmeleri') && (
            <button
              onClick={() => handleNavClick('kullanici-sozlesmeleri')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all cursor-pointer ${
                currentPage === 'kullanici-sozlesmeleri'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>Kulüp Sözleşmeleri</span>
            </button>
          )}

          {/* Ön Kayıt */}
          <button
            onClick={() => handleNavClick('on-kayit')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all cursor-pointer ${
              currentPage === 'on-kayit'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <UserPlus className="w-4 h-4 shrink-0" />
              <span>{t('sidebar.preRegistration')}</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
              currentPage === 'on-kayit'
                ? 'bg-blue-700 text-white'
                : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
            }`}>
              Yeni
            </span>
          </button>

          {/* Kulüpler (Accordion) */}
          <div className="pt-1">
            <button
              onClick={() => setIsBusinessesOpen(!isBusinessesOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all cursor-pointer ${
                isBusinessChildActive
                  ? 'text-blue-700 dark:text-blue-300 bg-blue-50/70 dark:bg-blue-900/30 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 shrink-0" />
                <span>{t('sidebar.clubs')}</span>
              </div>
              {isBusinessesOpen ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Sub-menu items */}
            {isBusinessesOpen && (
              <div className="ml-5 mt-1 pl-3 border-l-2 border-slate-200 dark:border-slate-800 space-y-4">
                {/* 1. Kadro & Yapılanma */}
                <div className="space-y-1">
                  <div className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 pb-1 pt-0.5">
                    KADRO &amp; YAPILANMA
                  </div>
                  {!isRestricted('sporcular') && (
                    <button
                      onClick={() => handleNavClick('sporcular')}
                      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        currentPage === 'sporcular'
                          ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{t('sidebar.athletes')}</span>
                    </button>
                  )}
                  {!isRestricted('gruplar') && (
                    <button
                      onClick={() => handleNavClick('gruplar')}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        currentPage === 'gruplar'
                          ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Users className="w-3.5 h-3.5" />
                        <span>{t('sidebar.groups')}</span>
                      </div>
                    </button>
                  )}
                  {!isRestricted('egitmenler') && (
                    <button
                      onClick={() => handleNavClick('egitmenler')}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        currentPage === 'egitmenler'
                          ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>{t('sidebar.trainers')}</span>
                      </div>
                    </button>
                  )}
                  {!isRestricted('yoneticiler') && (
                    <button
                      onClick={() => handleNavClick('yoneticiler')}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        currentPage === 'yoneticiler'
                          ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <User className="w-3.5 h-3.5 shrink-0" />
                        <span>Yöneticiler</span>
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                          currentPage === 'yoneticiler'
                            ? 'bg-blue-700 text-white'
                            : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400'
                        }`}
                      >
                        Erişim
                      </span>
                    </button>
                  )}
                </div>

                {/* 2. Planlama & Etkinlik */}
                <div className="space-y-1">
                  <div className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 pb-1 pt-1.5">
                    PLANLAMA &amp; ETKİNLİK
                  </div>
                  {!isRestricted('subeler') && (
                    <button
                      onClick={() => handleNavClick('subeler')}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        currentPage === 'subeler'
                          ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Şube Yönetimi</span>
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                          currentPage === 'subeler'
                            ? 'bg-blue-700 text-white'
                            : 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800'
                        }`}
                      >
                        Çoklu
                      </span>
                    </button>
                  )}
                  {!isRestricted('brans-yonetimi') && (
                    <button
                      onClick={() => handleNavClick('brans-yonetimi')}
                      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        currentPage === 'brans-yonetimi'
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Branş Yönetimi</span>
                    </button>
                  )}
                  {!isRestricted('egitim-planlama') && (
                    <button
                      onClick={() => handleNavClick('egitim-planlama')}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        currentPage === 'egitim-planlama'
                          ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{t('sidebar.trainingPlanning')}</span>
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                          currentPage === 'egitim-planlama'
                            ? 'bg-blue-700 text-white'
                            : 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-400'
                        }`}
                      >
                        Müfredat
                      </span>
                    </button>
                  )}
                  {!isRestricted('antrenman-takvimi') && (
                    <button
                      onClick={() => handleNavClick('antrenman-takvimi')}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        currentPage === 'antrenman-takvimi'
                          ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span>{t('sidebar.calendar')}</span>
                      </div>
                    </button>
                  )}
                </div>

                {/* 3. Operasyon & Analitik */}
                <div className="space-y-1">
                  <div className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 pb-1 pt-1.5">
                    OPERASYON &amp; ANALİTİK
                  </div>
                  {!isRestricted('yoklama') && (
                    <button
                      onClick={() => handleNavClick('yoklama')}
                      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        currentPage === 'yoklama'
                          ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <ClipboardCheck className="w-3.5 h-3.5" />
                      <span>{t('sidebar.attendance')}</span>
                    </button>
                  )}
                  {!isRestricted('sporcu-karnesi') && (
                    <button
                      onClick={() => handleNavClick('sporcu-karnesi')}
                      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        currentPage === 'sporcu-karnesi'
                          ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Sporcu Karnesi</span>
                    </button>
                  )}
                  {!isRestricted('sube-ozet') && (
                    <button
                      onClick={() => handleNavClick('sube-ozet')}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        currentPage === 'sube-ozet'
                          ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>Şube Özeti &amp; Finans</span>
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                          currentPage === 'sube-ozet'
                            ? 'bg-blue-700 text-white'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800'
                        }`}
                      >
                        Özet
                      </span>
                    </button>
                  )}
                </div>

                {/* 4. İletişim & Belgeler */}
                <div className="space-y-1">
                  <div className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 pb-1 pt-1.5">
                    İLETİŞİM &amp; BELGELER
                  </div>
                  {!isRestricted('kulup-evraklari') && (
                    <button
                      onClick={() => handleNavClick('kulup-evraklari')}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        currentPage === 'kulup-evraklari'
                          ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Kulüp Evrakları</span>
                      </div>
                    </button>
                  )}
                  {!isRestricted('kulup-galerisi') && (
                    <button
                      onClick={() => handleNavClick('kulup-galerisi')}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        currentPage === 'kulup-galerisi'
                          ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Kulüp Galerisi</span>
                      </div>
                    </button>
                  )}
                  {!isRestricted('anket-yonetimi') && (
                    <button
                      onClick={() => handleNavClick('anket-yonetimi')}
                      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        currentPage === 'anket-yonetimi'
                          ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Anket Yönetimi</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ÖN MUHASEBE (Accordion) */}
          {visibleMuhasebeItems.length > 0 && (
            <div className="pt-2">
              <button
                onClick={() => setIsOnMuhasebeOpen(!isOnMuhasebeOpen)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all cursor-pointer ${
                  isOnMuhasebeChildActive
                    ? 'text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Receipt className="w-4 h-4 shrink-0 text-slate-800 dark:text-slate-200" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Ön Muhasebe</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {isOnMuhasebeOpen ? (
                    <ChevronDown className="w-4 h-4 text-slate-700 dark:text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-700 dark:text-slate-400" />
                  )}
                </div>
              </button>

              {/* Ön Muhasebe Sub-items */}
              {isOnMuhasebeOpen && (
                <div className="ml-5 mt-1 pl-3 border-l-2 border-slate-200 dark:border-slate-800 space-y-1">
                  {!isRestricted('on-muhasebe') && (
                    <button
                      onClick={() => handleNavClick('on-muhasebe')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        currentPage === 'on-muhasebe'
                          ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Receipt className="w-3.5 h-3.5 shrink-0" />
                        <span>{t('sidebar.finance')}</span>
                      </div>
                    </button>
                  )}

                  {!isRestricted('gelir-gider-kategori') && (
                    <button
                      onClick={() => handleNavClick('gelir-gider-kategori')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                        currentPage === 'gelir-gider-kategori'
                          ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Layers className="w-3.5 h-3.5 shrink-0" />
                        <span className="leading-snug">Gelir/Gider Kategori</span>
                      </div>
                    </button>
                  )}

                  {!isRestricted('gelir-gider-yonetimi') && (
                    <button
                      onClick={() => handleNavClick('gelir-gider-yonetimi')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        currentPage === 'gelir-gider-yonetimi'
                          ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <FolderTree className="w-3.5 h-3.5 shrink-0" />
                        <span>Gelir/Gider Yönetimi</span>
                      </div>
                    </button>
                  )}

                  {!isRestricted('odeme-plani-kontrol') && (
                    <button
                      onClick={() => handleNavClick('odeme-plani-kontrol')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        currentPage === 'odeme-plani-kontrol'
                          ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Receipt className="w-3.5 h-3.5 shrink-0" />
                        <span>Ödeme Planı Kontrol</span>
                      </div>
                    </button>
                  )}

                  {!isRestricted('odeme-plani') && (
                    <button
                      onClick={() => handleNavClick('odeme-plani')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        currentPage === 'odeme-plani'
                          ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <CreditCard className="w-3.5 h-3.5 shrink-0" />
                        <span>Ödeme Planı</span>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SPORPUAN ANA KATEGORİSİ */}
          {visibleSporpuanItems.length > 0 && (
            <div className="pt-3">
              <div className="px-3 py-1 mb-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-amber-300 bg-slate-100/90 dark:bg-slate-800 rounded-md flex items-center border border-slate-200/80 dark:border-slate-700">
                <span className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  Sporpuan
                </span>
              </div>

              {/* İtibar Yönetimi Accordion */}
              <div>
                <button
                  onClick={() => setIsReputationOpen(!isReputationOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all cursor-pointer ${
                    isSporpuanChildActive
                      ? 'text-blue-900 dark:text-blue-300 bg-blue-50/90 dark:bg-blue-900/30 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>İtibar Yönetimi</span>
                  </div>
                  {isReputationOpen ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {/* Alt sayfalar: Değerlendirmeler, Doğrulamalar, Raporlar */}
                {isReputationOpen && (
                  <div className="ml-5 mt-1 pl-3 border-l-2 border-slate-200 dark:border-slate-800 space-y-1">
                    {!isRestricted('sporpuan-sporcu-degerlendirme') && (
                      <button
                        onClick={() => handleNavClick('sporpuan-sporcu-degerlendirme')}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          currentPage === 'sporpuan-sporcu-degerlendirme'
                            ? 'bg-blue-600 text-white font-semibold shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <ClipboardCheck className="w-3.5 h-3.5" />
                          <span>Sporcu Değerlendirme</span>
                        </div>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            currentPage === 'sporpuan-sporcu-degerlendirme'
                              ? 'bg-blue-700 text-white'
                              : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400'
                          }`}
                        >
                          Yeni
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SportsFly Destek & Yardım Masası */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
            <button
              onClick={() => handleNavClick('destek')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentPage === 'destek'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LifeBuoy className="w-4 h-4 text-blue-500 dark:text-blue-300" />
                <span>Destek &amp; Yardım Masası</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${
                  currentPage === 'destek'
                    ? 'bg-blue-700 text-white'
                    : 'bg-emerald-500 text-white'
                }`}
              >
                7/24
              </span>
            </button>
          </div>
        </div>

        {/* Active Package Status Card & Footer info */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0b1320]/60">
          {currentPlan && (
            <div className="mb-2.5 p-2.5 rounded-xl bg-white dark:bg-[#162238] border border-slate-200/90 dark:border-slate-700 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Aktif Paket
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                  {PACKAGE_DETAILS[currentPlan]?.priceFormatted}
                </span>
              </div>

              <div className="flex items-center justify-between mt-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {currentPlan}
                </span>
                <button
                  onClick={() => handleNavClick('paketler')}
                  className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline cursor-pointer"
                  title="Paketleri incele ve yükselt"
                >
                  Yükselt
                </button>
              </div>
            </div>
          )}

          <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center">
            Sporsepeti &amp; SportsFly &copy; 2026
          </p>
        </div>
      </aside>
    </>
  );
};
