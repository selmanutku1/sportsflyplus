import React, { useState } from 'react';
import {
  Home,
  User,
  Layout,
  Package,
  UserX,
  UserCheck,
  FileText,
  ClipboardCheck,
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
} from 'lucide-react';
import { NavPage } from '../types';
import { SportsFlyLogo } from './SportsFlyLogo';

interface SidebarProps {
  currentPage: NavPage;
  onSelectPage: (page: NavPage) => void;
  isOpen: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  isOpen,
  onCloseMobile,
}) => {
  // Ensure "İşletmeler" sub-menu stays open if child is active or by default
  const isBusinessChildActive = [
    'brans-yonetimi',
    'aktivite-yonetimi',
    'sporcular',
    'egitmenler',
  ].includes(currentPage);

  // Sporpuan child active state
  const isSporpuanChildActive = [
    'sporpuan-degerlendirmeler',
    'sporpuan-dogrulamalar',
    'sporpuan-raporlar',
  ].includes(currentPage);

  const [isBusinessesOpen, setIsBusinessesOpen] = useState(true);
  const [isReputationOpen, setIsReputationOpen] = useState(true);

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

      <aside
        id="app-sidebar"
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'
        }`}
      >
        {/* Brand Logo matching the screenshots */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <SportsFlyLogo className="w-9 h-9" />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-800">
                SportsFly
              </span>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button
            id="sidebar-close-mobile-btn"
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden transition-colors"
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

          {/* Paket Yönetimi */}
          <button
            onClick={() => handleNavClick('paket-yonetimi')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
              currentPage === 'paket-yonetimi'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4 shrink-0" />
            <span>Paket Yönetimi</span>
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

          {/* Kullanıcı Sözleşmeleri */}
          <button
            onClick={() => handleNavClick('kullanici-sozlesmeleri')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
              currentPage === 'kullanici-sozlesmeleri'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>Kullanıcı Sözleşmeleri</span>
          </button>

          {/* Aktivite Onayları */}
          <button
            onClick={() => handleNavClick('aktivite-onaylari')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
              currentPage === 'aktivite-onaylari'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ClipboardCheck className="w-4 h-4 shrink-0" />
            <span>Aktivite Onayları</span>
          </button>

          {/* İşletmeler (Accordion) */}
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
                <span>İşletmeler</span>
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
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentPage === 'egitmenler'
                      ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Eğitmenler</span>
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

        {/* Footer info */}
        <div className="p-3 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Sporsepeti &amp; SportsFly &copy; 2026
          </p>
        </div>
      </aside>
    </>
  );
};
