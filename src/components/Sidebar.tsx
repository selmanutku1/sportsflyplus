import React, { useState } from 'react';
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
  Sparkles,
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
} from 'lucide-react';
import { NavPage, PackagePlanType } from '../types';
import { SportsFlyLogo } from './SportsFlyLogo';
import { isPageAllowedForPlan, PACKAGE_DETAILS } from '../data/packagePermissions';

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
  const isRestricted = (page: NavPage) => {
    if (!currentPlan) return false;
    return !isPageAllowedForPlan(page, currentPlan);
  };
  // Ensure "Kulüpler" sub-menu stays open if child is active or by default
  const isBusinessChildActive = [
    'yoneticiler',
    'on-kayit',
    'brans-yonetimi',
    'aktivite-yonetimi',
    'sporcular',
    'egitmenler',
    'gruplar',
    'antrenman-takvimi',
  ].includes(currentPage);

  // Sporpuan child active state
  const isSporpuanChildActive = [
    'sporpuan-degerlendirmeler',
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
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Desktop Compact Icon Rail when sidebar is collapsed (matches screenshot) */}
      {!isOpen && (
        <aside
          id="app-sidebar-compact"
          className="hidden lg:flex flex-col w-16 bg-white border-r border-slate-200/90 py-3 items-center shrink-0 z-30 justify-between select-none"
        >
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="p-1.5 cursor-pointer" onClick={() => handleNavClick('anasayfa')} title="SportsFly">
              <SportsFlyLogo className="w-8 h-8" />
            </div>

            {/* Manager Avatar Icon */}
            <div
              className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors shadow-2xs"
              title="SportsFly Manager"
            >
              <Sparkles className="w-4 h-4" />
            </div>

            <div className="w-8 h-px bg-slate-100 my-0.5" />

            {/* Navigation Icons */}
            <div className="flex flex-col items-center gap-1.5 w-full px-2">
              <button
                onClick={() => handleNavClick('anasayfa')}
                title="Anasayfa"
                className={`p-2.5 rounded-xl transition-all ${
                  currentPage === 'anasayfa'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Home className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleNavClick('sporsepeti-user')}
                title="Sporsepeti User"
                className={`p-2.5 rounded-xl transition-all ${
                  currentPage === 'sporsepeti-user'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleNavClick('sayfa-yonetimi')}
                title="Sayfa Yönetimi"
                className={`p-2.5 rounded-xl transition-all ${
                  currentPage === 'sayfa-yonetimi'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Layout className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleNavClick('paketler')}
                title="Paketler"
                className={`p-2.5 rounded-xl transition-all ${
                  currentPage === 'paketler' || currentPage === 'paket-yonetimi'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Package className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleNavClick('yetkilendirmeler')}
                title="Yetkilendirmeler"
                className={`p-2.5 rounded-xl transition-all ${
                  currentPage === 'yetkilendirmeler'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleNavClick('on-kayit')}
                title="Ön Kayıt"
                className={`p-2.5 rounded-xl transition-all ${
                  currentPage === 'on-kayit'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleNavClick('sporcular')}
                title="Sporcular"
                className={`p-2.5 rounded-xl transition-all ${
                  currentPage === 'sporcular'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleNavClick('egitmenler')}
                title="Eğitmenler"
                className={`p-2.5 rounded-xl transition-all ${
                  currentPage === 'egitmenler'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
              </button>

              {/* Antrenman Takvimi */}
              <button
                onClick={() => handleNavClick('antrenman-takvimi')}
                title="Antrenman Takvimi"
                className={`p-2.5 rounded-xl transition-all ${
                  currentPage === 'antrenman-takvimi'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
              </button>

              {/* Gruplar */}
              <button
                onClick={() => handleNavClick('gruplar')}
                title="Gruplar"
                className={`p-2.5 rounded-xl transition-all ${
                  currentPage === 'gruplar'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
              </button>

              {/* Ön Muhasebe */}
              <button
                onClick={() => handleNavClick('on-muhasebe')}
                title="Ön Muhasebe"
                className={`p-2.5 rounded-xl transition-all ${
                  isOnMuhasebeChildActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Receipt className="w-4 h-4" />
              </button>

              {/* Sporpuan */}
              <button
                onClick={() => handleNavClick('sporpuan-degerlendirmeler')}
                title="Sporpuan İtibar Portalı"
                className={`p-2.5 rounded-xl transition-all ${
                  isSporpuanChildActive
                    ? 'bg-slate-900 text-amber-400 shadow-xs'
                    : 'text-amber-500 hover:bg-amber-50'
                }`}
              >
                <Star className="w-4 h-4 fill-amber-400" />
              </button>

              {/* Yöneticiler (Matches Screenshot: blue highlighted bottom user icon) */}
              <button
                onClick={() => handleNavClick('yoneticiler')}
                title="Yöneticiler (Spor Okulu Girişi)"
                className={`p-2.5 rounded-xl transition-all ${
                  currentPage === 'yoneticiler'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

      <aside
        id="app-sidebar"
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-72 lg:w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-200 ease-in-out shadow-2xl lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'
        }`}
      >
        {/* Brand Logo matching the screenshots */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <SportsFlyLogo className="w-9 h-9" />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-800">
                SportsFly
              </span>
            </div>
          </div>
          {/* Mobile Close Button (44px touch target) */}
          <button
            id="sidebar-close-mobile-btn"
            onClick={onCloseMobile}
            className="w-10 h-10 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden flex items-center justify-center transition-colors"
            aria-label="Menüyü Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Manager selector badge item matching the screenshot */}
        <div className="p-3 border-b border-slate-100">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-100 border border-slate-200/60 transition-colors">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 truncate">
                SportsFly Manager
              </p>
              <p className="text-[11px] text-slate-400 truncate">
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
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
              currentPage === 'anasayfa'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Anasayfa</span>
          </button>

          {/* Sporsepeti User */}
          <button
            onClick={() => handleNavClick('sporsepeti-user')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
              currentPage === 'sporsepeti-user'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span>Sporsepeti User</span>
          </button>

          {/* Sayfa Yönetimi */}
          <button
            onClick={() => handleNavClick('sayfa-yonetimi')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
              currentPage === 'sayfa-yonetimi'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Layout className="w-4 h-4 shrink-0" />
            <span>Sayfa Yönetimi</span>
          </button>

          {/* Paketler */}
          <button
            onClick={() => handleNavClick('paketler')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
              currentPage === 'paketler' || currentPage === 'paket-yonetimi'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4 shrink-0" />
            <span>Paketler</span>
          </button>

          {/* Tanımsız Kullanıcılar */}
          <button
            onClick={() => handleNavClick('tanimsiz-kullanicilar')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
              currentPage === 'tanimsiz-kullanicilar'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <UserX className="w-4 h-4 shrink-0" />
            <span>Tanımsız Kullanıcılar</span>
          </button>

          {/* Yetkilendirmeler */}
          <button
            onClick={() => handleNavClick('yetkilendirmeler')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
              currentPage === 'yetkilendirmeler'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4 shrink-0" />
            <span>Yetkilendirmeler</span>
          </button>

          {/* Kulüp Sözleşmeleri */}
          <button
            onClick={() => handleNavClick('kullanici-sozlesmeleri')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
              currentPage === 'kullanici-sozlesmeleri'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>Kulüp Sözleşmeleri</span>
          </button>

          {/* Ön Kayıt */}
          <button
            onClick={() => handleNavClick('on-kayit')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all ${
              currentPage === 'on-kayit'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <UserPlus className="w-4 h-4 shrink-0" />
              <span>Ön Kayıt</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
              currentPage === 'on-kayit'
                ? 'bg-blue-700 text-white'
                : 'bg-emerald-100 text-emerald-700'
            }`}>
              Yeni
            </span>
          </button>

          {/* Kulüpler (Accordion) */}
          <div className="pt-1">
            <button
              onClick={() => setIsBusinessesOpen(!isBusinessesOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all ${
                isBusinessChildActive
                  ? 'text-blue-700 bg-blue-50/70 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 shrink-0" />
                <span>Kulüpler</span>
              </div>
              {isBusinessesOpen ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Sub-menu items */}
            {isBusinessesOpen && (
              <div className="ml-5 mt-1 pl-3 border-l-2 border-slate-200 space-y-1">
                {/* Yöneticiler (Spor Okulu Girişi & Yönetimi) */}
                <button
                  onClick={() => handleNavClick('yoneticiler')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentPage === 'yoneticiler'
                      ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    Erişim
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('brans-yonetimi')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentPage === 'brans-yonetimi'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Branş Yönetimi</span>
                </button>

                <button
                  onClick={() => handleNavClick('aktivite-yonetimi')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentPage === 'aktivite-yonetimi'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Aktivite Yönetimi</span>
                </button>

                <button
                  onClick={() => handleNavClick('on-kayit')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentPage === 'on-kayit'
                      ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Ön Kayıt</span>
                </button>

                <button
                  onClick={() => handleNavClick('sporcular')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentPage === 'sporcular'
                      ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Sporcular</span>
                </button>

                <button
                  onClick={() => handleNavClick('egitmenler')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentPage === 'egitmenler'
                      ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title={isRestricted('egitmenler') ? 'Paket Yükseltme Gerekli (Min: Profesyonel)' : undefined}
                >
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Eğitmenler</span>
                  </div>
                  {isRestricted('egitmenler') && (
                    <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                  )}
                </button>

                <button
                  onClick={() => handleNavClick('gruplar')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentPage === 'gruplar'
                      ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title={isRestricted('gruplar') ? 'Paket Yükseltme Gerekli (Min: Profesyonel)' : undefined}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Gruplar</span>
                  </div>
                  {isRestricted('gruplar') && (
                    <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                  )}
                </button>

                <button
                  onClick={() => handleNavClick('antrenman-takvimi')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentPage === 'antrenman-takvimi'
                      ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title={isRestricted('antrenman-takvimi') ? 'Paket Yükseltme Gerekli (Min: Profesyonel)' : undefined}
                >
                  <div className="flex items-center gap-2.5">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>Antrenman Takvimi</span>
                  </div>
                  {isRestricted('antrenman-takvimi') && (
                    <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* ÖN MUHASEBE (Accordion matching screenshot) */}
          <div className="pt-2">
            <button
              onClick={() => setIsOnMuhasebeOpen(!isOnMuhasebeOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all ${
                isOnMuhasebeChildActive
                  ? 'text-slate-900 bg-slate-100 font-bold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Receipt className="w-4 h-4 shrink-0 text-slate-800" />
                <span className="font-semibold text-slate-800">Ön Muhasebe</span>
              </div>
              <div className="flex items-center gap-1.5">
                {isRestricted('on-muhasebe') && (
                  <Lock className="w-3 h-3 text-amber-500 shrink-0" title="Paket Yükseltme Gerekli (Min: Premium)" />
                )}
                {isOnMuhasebeOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-700" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-700" />
                )}
              </div>
            </button>

            {/* Ön Muhasebe Sub-items matching Screenshot 3 */}
            {isOnMuhasebeOpen && (
              <div className="ml-5 mt-1 pl-3 border-l-2 border-slate-200 space-y-1">
                {/* 1. Ön Muhasebe */}
                <button
                  onClick={() => handleNavClick('on-muhasebe')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentPage === 'on-muhasebe'
                      ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title={isRestricted('on-muhasebe') ? 'Paket Yükseltme Gerekli (Min: Premium)' : undefined}
                >
                  <div className="flex items-center gap-2.5">
                    <Receipt className="w-3.5 h-3.5 shrink-0" />
                    <span>Ön Muhasebe</span>
                  </div>
                  {isRestricted('on-muhasebe') && (
                    <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                  )}
                </button>

                {/* 2. Gelir/Gider Kategori Yönetimi */}
                <button
                  onClick={() => handleNavClick('gelir-gider-kategori')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                    currentPage === 'gelir-gider-kategori'
                      ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title={isRestricted('gelir-gider-kategori') ? 'Paket Yükseltme Gerekli (Min: Premium)' : undefined}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-3.5 h-3.5 shrink-0" />
                    <span className="leading-snug">Gelir/Gider Kategori</span>
                  </div>
                  {isRestricted('gelir-gider-kategori') && (
                    <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                  )}
                </button>

                {/* 3. Gelir/Gider Yönetimi */}
                <button
                  onClick={() => handleNavClick('gelir-gider-yonetimi')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentPage === 'gelir-gider-yonetimi'
                      ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title={isRestricted('gelir-gider-yonetimi') ? 'Paket Yükseltme Gerekli (Min: Premium)' : undefined}
                >
                  <div className="flex items-center gap-2.5">
                    <FolderTree className="w-3.5 h-3.5 shrink-0" />
                    <span>Gelir/Gider Yönetimi</span>
                  </div>
                  {isRestricted('gelir-gider-yonetimi') && (
                    <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                  )}
                </button>

                {/* 4. Ödeme Planı Kontrol */}
                <button
                  onClick={() => handleNavClick('odeme-plani-kontrol')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentPage === 'odeme-plani-kontrol'
                      ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title={isRestricted('odeme-plani-kontrol') ? 'Paket Yükseltme Gerekli (Min: Premium)' : undefined}
                >
                  <div className="flex items-center gap-2.5">
                    <Receipt className="w-3.5 h-3.5 shrink-0" />
                    <span>Ödeme Planı Kontrol</span>
                  </div>
                  {isRestricted('odeme-plani-kontrol') && (
                    <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                  )}
                </button>

                {/* 5. Ödeme Planı */}
                <button
                  onClick={() => handleNavClick('odeme-plani')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentPage === 'odeme-plani'
                      ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title={isRestricted('odeme-plani') ? 'Paket Yükseltme Gerekli (Min: Premium)' : undefined}
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-3.5 h-3.5 shrink-0" />
                    <span>Ödeme Planı</span>
                  </div>
                  {isRestricted('odeme-plani') && (
                    <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* SPORPUAN ANA KATEGORİSİ */}
          <div className="pt-3">
            <div className="px-3 py-1 mb-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-700 bg-slate-100/90 rounded-md flex items-center justify-between border border-slate-200/80">
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                Sporpuan
              </span>
              <span className="text-[10px] font-bold text-slate-600 px-1.5 py-0.5 bg-white rounded-sm border border-slate-200 shadow-2xs">
                sporpuan.com
              </span>
            </div>

            {/* İtibar Yönetimi Accordion */}
            <div>
              <button
                onClick={() => setIsReputationOpen(!isReputationOpen)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all ${
                  isSporpuanChildActive
                    ? 'text-blue-900 bg-blue-50/90 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
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
                <div className="ml-5 mt-1 pl-3 border-l-2 border-slate-200 space-y-1">
                  <button
                    onClick={() => handleNavClick('sporpuan-degerlendirmeler')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      currentPage === 'sporpuan-degerlendirmeler'
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Star className="w-3.5 h-3.5" />
                      <span>Değerlendirmeler</span>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        currentPage === 'sporpuan-degerlendirmeler'
                          ? 'bg-blue-700 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      5
                    </span>
                  </button>

                  <button
                    onClick={() => handleNavClick('sporpuan-dogrulamalar')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      currentPage === 'sporpuan-dogrulamalar'
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Doğrulamalar</span>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        currentPage === 'sporpuan-dogrulamalar'
                          ? 'bg-blue-700 text-white'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      6
                    </span>
                  </button>

                  <button
                    onClick={() => handleNavClick('sporpuan-raporlar')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      currentPage === 'sporpuan-raporlar'
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Raporlar</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Package Status Card & Footer info */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          {currentPlan && (
            <div className="mb-2.5 p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Aktif Paket
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                  {PACKAGE_DETAILS[currentPlan]?.priceFormatted}
                </span>
              </div>

              <div className="flex items-center justify-between mt-1">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {currentPlan}
                </span>
                <button
                  onClick={() => handleNavClick('paketler')}
                  className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  title="Paketleri incele ve yükselt"
                >
                  Yükselt
                </button>
              </div>
            </div>
          )}

          <p className="text-[11px] text-slate-400 text-center">
            Sporsepeti &amp; SportsFly &copy; 2026
          </p>
        </div>
      </aside>
    </>
  );
};
