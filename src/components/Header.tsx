import React, { useState, useEffect, useRef } from 'react';
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
  Settings,
  Lock,
  Sliders,
} from 'lucide-react';
import { NavPage } from '../types';
import {
  UserProfileData,
  getStoredUserProfile,
} from '../data/userProfile';
import { ProfileSettingsModal } from './modals/ProfileSettingsModal';

interface HeaderProps {
  currentPage: NavPage;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onNavigate?: (page: NavPage) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onToggleSidebar,
  isSidebarOpen,
  onNavigate,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  // Profile modal state
  const [userProfile, setUserProfile] = useState<UserProfileData>(() => getStoredUserProfile());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState<'genel' | 'guvenlik' | 'bildirimler' | 'tercihler'>('genel');
  const [logoutNotification, setLogoutNotification] = useState<string | null>(null);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Sync profile when updated
  useEffect(() => {
    const handleProfileUpdate = (e: any) => {
      if (e.detail) {
        setUserProfile(e.detail);
      }
    };
    window.addEventListener('sportsfly_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('sportsfly_profile_updated', handleProfileUpdate);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openProfileTab = (tab: 'genel' | 'guvenlik' | 'bildirimler' | 'tercihler') => {
    setProfileModalTab(tab);
    setIsProfileModalOpen(true);
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    setLogoutNotification('Güvenli Çıkış Yapıldı. Giriş ekranına yönlendiriliyorsunuz...');
    setTimeout(() => {
      setLogoutNotification(null);
      if (onLogout) {
        onLogout();
      }
    }, 600);
  };

  const getBreadcrumb = (page: NavPage) => {
    switch (page) {
      case 'anasayfa':
        return 'SportsFly > Anasayfa';
      case 'sporsepeti-user':
        return 'SportsFly > Kullanıcılar';
      case 'yetkilendirmeler':
        return 'SportsFly > Yetkilendirmeler';
      case 'sporcular':
        return 'SportsFly > Sporcular';
      case 'egitmenler':
        return 'SportsFly > Eğitmenler';
      case 'gruplar':
        return 'SportsFly > Gruplar';
      case 'antrenman-takvimi':
        return 'SportsFly > Antrenman Takvimi';
      case 'on-muhasebe':
        return 'SportsFly > Ön Muhasebe';
      case 'gelir-gider-kategori':
        return 'SportsFly > Ön Muhasebe > Gelir/Gider Kategori Yönetimi';
      case 'gelir-gider-yonetimi':
        return 'SportsFly > Ön Muhasebe > Gelir/Gider Yönetimi';
      case 'odeme-plani-kontrol':
        return 'SportsFly > Ön Muhasebe > Ödeme Planı Kontrol';
      case 'odeme-plani':
        return 'SportsFly > Ön Muhasebe > Ödeme Planı';
      case 'yoneticiler':
        return 'SportsFly > Kulüpler > Yöneticiler';
      case 'sayfa-yonetimi':
        return 'SportsFly > Sayfa Yönetimi';
      case 'paket-yonetimi':
      case 'paketler':
        return 'SportsFly > Paketler';
      case 'tanimsiz-kullanicilar':
        return 'SportsFly > Tanımsız Kullanıcılar';
      case 'kullanici-sozlesmeleri':
        return 'SportsFly > Kulüp Sözleşmeleri';
      case 'on-kayit':
        return 'SportsFly > Ön Kayıt';
      case 'brans-yonetimi':
        return 'SportsFly > Kulüpler > Branş Yönetimi';
      case 'aktivite-yonetimi':
        return 'SportsFly > Kulüpler > Aktivite Yönetimi';
      case 'sporpuan-degerlendirmeler':
        return 'SportsFly > İtibar Yönetimi > Değerlendirmeler';
      case 'sporpuan-dogrulamalar':
        return 'SportsFly > İtibar Yönetimi > Doğrulamalar';
      case 'sporpuan-raporlar':
        return 'SportsFly > İtibar Yönetimi > Raporlar';
      default:
        return 'SportsFly > Anasayfa';
    }
  };

  const breadcrumbText = getBreadcrumb(currentPage);
  const [rootCrumb, ...childCrumbs] = breadcrumbText.split(' > ');

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-xs">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left Side: Single Icon (Menu Toggle) & Breadcrumbs (SportsFly > Sayfa) */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          {/* Tek İkon: Sidebar Menü Açma/Kapatma Butonu */}
          <button
            id="header-sidebar-toggle-btn"
            onClick={onToggleSidebar}
            className="w-10 h-10 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 flex items-center justify-center shrink-0 border border-slate-200/60"
            title="Menüyü Daralt/Genişlet"
            aria-label="Menüyü Aç/Kapat"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb: SportsFly > Anasayfa */}
          <nav className="hidden sm:flex items-center text-xs sm:text-sm font-medium truncate select-none">
            <span
              onClick={() => onNavigate?.('anasayfa')}
              className="text-blue-600 hover:underline cursor-pointer shrink-0 font-semibold"
              title="Anasayfaya Git"
            >
              {rootCrumb}
            </span>
            {childCrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <span className="mx-1.5 text-slate-400 shrink-0">&gt;</span>
                <span
                  className={`truncate ${
                    idx === childCrumbs.length - 1
                      ? 'text-slate-800 font-semibold'
                      : 'text-slate-500'
                  }`}
                >
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </nav>

          {/* Mobile breadcrumb: SportsFly > Sayfa */}
          <div className="sm:hidden flex items-center gap-1.5 min-w-0 select-none">
            <span
              onClick={() => onNavigate?.('anasayfa')}
              className="text-blue-600 text-xs font-bold shrink-0 cursor-pointer"
            >
              {rootCrumb}
            </span>
            <span className="text-slate-400 text-xs font-semibold shrink-0">&gt;</span>
            <span className="text-xs font-bold text-slate-800 truncate max-w-[170px]">
              {childCrumbs[childCrumbs.length - 1] || 'Anasayfa'}
            </span>
          </div>
        </div>

        {/* Right Side: Notifications & Profile Pill */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Notifications */}
          <div className="relative">
            <button
              id="header-notification-btn"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative w-10 h-10 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex items-center justify-center"
              aria-label="Bildirimler"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-white"></span>
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
          <div className="relative" ref={profileMenuRef}>
            <button
              id="header-user-profile-badge"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-full border border-slate-200/80 transition-all text-left cursor-pointer"
              title="Profil Menüsü"
            >
              {/* Profile Avatar / Badge */}
              <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${userProfile.avatarColor} text-white flex items-center justify-center p-0.5 shadow-2xs shrink-0 overflow-hidden font-bold text-xs`}>
                {userProfile.avatarUrl ? (
                  <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span>
                    {userProfile.name
                      .split(' ')
                      .filter(Boolean)
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2) || 'SU'}
                  </span>
                )}
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {userProfile.name}
                </span>
                <span className="text-[10px] text-slate-500 leading-none">
                  {userProfile.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:inline" />
            </button>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 sm:w-72 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 rounded-t-2xl">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                      Yönetici Hesabı
                    </p>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-extrabold">
                      {userProfile.role}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 truncate mt-1">{userProfile.name}</p>
                  <p className="text-xs text-slate-500 truncate">{userProfile.email}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>İletişim: <strong className="text-slate-800">{userProfile.phone}</strong></span>
                  </div>
                </div>

                <div className="py-1.5 px-1 space-y-0.5">
                  <button
                    id="btn-open-profile-settings"
                    onClick={() => openProfileTab('genel')}
                    className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:text-blue-700 hover:bg-blue-50/70 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                  >
                    <span className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                      <span className="font-semibold">Profil Ayarları</span>
                    </span>
                    <span className="text-[10px] text-slate-400 group-hover:text-blue-600">Düzenle &gt;</span>
                  </button>

                  <button
                    id="btn-open-security-settings"
                    onClick={() => openProfileTab('guvenlik')}
                    className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:text-blue-700 hover:bg-blue-50/70 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                  >
                    <span className="flex items-center gap-2.5">
                      <Lock className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                      <span>Şifre &amp; Güvenlik (2FA)</span>
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </button>

                  <button
                    id="btn-open-notification-settings"
                    onClick={() => openProfileTab('bildirimler')}
                    className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:text-blue-700 hover:bg-blue-50/70 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                  >
                    <span className="flex items-center gap-2.5">
                      <Bell className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                      <span>Bildirim Tercihleri</span>
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-mono">
                      SMS/E-posta
                    </span>
                  </button>

                  <button
                    id="btn-open-system-preferences"
                    onClick={() => openProfileTab('tercihler')}
                    className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:text-blue-700 hover:bg-blue-50/70 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                  >
                    <span className="flex items-center gap-2.5">
                      <Sliders className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                      <span>Sistem &amp; Arayüz Tercihleri</span>
                    </span>
                  </button>

                  {onNavigate && (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onNavigate('yetkilendirmeler');
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:text-blue-700 hover:bg-blue-50/70 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer group"
                    >
                      <Shield className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                      <span>Yetki ve Roller Sayfası</span>
                    </button>
                  )}

                  <a
                    href="https://sportsfly.app"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:text-blue-700 hover:bg-blue-50/70 rounded-xl flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                      <span>SportsFly Web Sitesi</span>
                    </span>
                  </a>
                </div>

                <div className="pt-1.5 px-1 border-t border-slate-100">
                  <button
                    id="btn-profile-logout"
                    onClick={handleLogout}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Notification Toast */}
      {logoutNotification && (
        <div className="absolute top-18 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{logoutNotification}</span>
        </div>
      )}

      {/* Profile Settings Modal */}
      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentProfile={userProfile}
        onProfileUpdated={(updated) => setUserProfile(updated)}
        initialTab={profileModalTab}
      />
    </header>
  );
};
