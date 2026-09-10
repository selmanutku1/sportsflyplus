import React, { useState } from 'react';
import {
  Menu,
  Bell,
  ChevronDown,
  User,
  Shield,
  LogOut,
  CheckCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { NavPage } from '../types';
import { SportsFlyLogo } from './SportsFlyLogo';

interface HeaderProps {
  currentPage: NavPage;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const getBreadcrumb = (page: NavPage) => {
    switch (page) {
      case 'anasayfa':
        return 'Sporsepeti > Anasayfa';
      case 'sporsepeti-user':
        return 'Sporsepeti > Sporsepeti Kullanıcılar';
      case 'yetkilendirmeler':
        return 'Sporsepeti > Kullanıcılar';
      case 'sporcular':
        return 'Sporsepeti > Sporcular';
      case 'egitmenler':
        return 'Sporsepeti > Eğitmenler';
      case 'sayfa-yonetimi':
        return 'Sporsepeti > Sayfa Yönetimi';
      case 'paket-yonetimi':
        return 'Sporsepeti > Paket Yönetimi';
      case 'tanimsiz-kullanicilar':
        return 'Sporsepeti > Tanımsız Kullanıcılar';
      case 'kullanici-sozlesmeleri':
        return 'Sporsepeti > Kullanıcı Sözleşmeleri';
      case 'aktivite-onaylari':
        return 'Sporsepeti > Aktivite Onayları';
      case 'brans-yonetimi':
        return 'Sporsepeti > İşletmeler > Branş Yönetimi';
      case 'aktivite-yonetimi':
        return 'Sporsepeti > İşletmeler > Aktivite Yönetimi';
      case 'sporpuan-degerlendirmeler':
        return 'Sporpuan > İtibar Yönetimi > Değerlendirmeler';
      case 'sporpuan-dogrulamalar':
        return 'Sporpuan > İtibar Yönetimi > Doğrulamalar';
      case 'sporpuan-raporlar':
        return 'Sporpuan > İtibar Yönetimi > Raporlar';
      default:
        return 'Sporsepeti > Anasayfa';
    }
  };

  const breadcrumbText = getBreadcrumb(currentPage);
  const [rootCrumb, ...childCrumbs] = breadcrumbText.split(' > ');

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-xs">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left Side: Toggle, Brand Mark on collapsed/mobile, and Breadcrumbs */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            id="header-sidebar-toggle-btn"
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
            title="Menüyü Daralt/Genişlet"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Top-left brand logo displayed when sidebar is closed or on mobile */}
          <div className={`items-center gap-2 pr-2 border-r border-slate-200/80 ${isSidebarOpen ? 'flex lg:hidden' : 'flex'}`}>
            <SportsFlyLogo className="w-7 h-7 shrink-0" />
            <span className="font-bold text-slate-800 text-base tracking-tight hidden sm:inline">
              SportsFly
            </span>
          </div>

          {/* Breadcrumb matching the screenshots */}
          <nav className="hidden sm:flex items-center text-xs sm:text-sm font-medium">
            <span className="text-blue-600 hover:underline cursor-pointer">
              {rootCrumb}
            </span>
            {childCrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <span className="mx-1.5 text-slate-400">&gt;</span>
                <span className={idx === childCrumbs.length - 1 ? 'text-slate-700 font-semibold' : 'text-slate-500'}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </nav>
          <span className="sm:hidden text-xs font-bold text-slate-800 truncate max-w-[130px]">
            {childCrumbs[childCrumbs.length - 1] || rootCrumb}
          </span>
        </div>

        {/* Right Side: Notifications & Profile Pill */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              id="header-notification-btn"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label="Bildirimler"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-96 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 text-sm">Bildirimler</span>
                    <span className="px-1.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full">
                      {unreadCount} yeni
                    </span>
                  </div>
                  <button
                    onClick={() => setUnreadCount(0)}
                    className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Tümünü okundu say
                  </button>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  <div className="p-3 hover:bg-slate-50 transition-colors flex items-start gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-600 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-800">
                        Yeni sporcu kaydı yapıldı: <span className="font-semibold">Selman Utku</span>
                      </p>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">10 dakika önce</span>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-slate-50 transition-colors flex items-start gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-800">
                        Eğitmen <span className="font-semibold">Ali Özcan</span> onaylandı
                      </p>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">1 saat önce</span>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-slate-50 transition-colors flex items-start gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-800">
                        Yeni destek talebi: Salon aktivasyon sorunu
                      </p>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">3 saat önce</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Badge matching "SportsFly Manager" in the screenshots */}
          <div className="relative">
            <button
              id="header-user-profile-badge"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-full border border-slate-200/80 transition-all text-left"
            >
              {/* Colorful icon badge matching the screenshot */}
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 via-sky-400 to-rose-400 flex items-center justify-center p-0.5 shadow-2xs shrink-0">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                </div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-700 hidden md:inline">
                SportsFly Manager
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:inline" />
            </button>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-60 sm:w-64 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs text-slate-500 font-medium">Giriş Yapılan Hesap</p>
                  <p className="text-sm font-bold text-slate-800 truncate">SportsFly Manager</p>
                  <p className="text-xs text-slate-500 truncate">selmanutkumarmara@gmail.com</p>
                </div>

                <div className="py-1">
                  <button className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    Profil Ayarları
                  </button>
                  <button className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-400" />
                    Yetkilendirme Durumu (Süper Admin)
                  </button>
                  <a
                    href="https://sportsfly.app"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                      SportsFly Web Sitesi
                    </span>
                  </a>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button className="w-full px-4 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <LogOut className="w-4 h-4 text-red-500" />
                    Çıkış Yap
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
