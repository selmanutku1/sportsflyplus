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
  Settings,
  Lock,
  Sliders,
  Globe,
  Building2,
  Check,
  Sun,
  Moon,
  Laptop,
  LifeBuoy,
  CreditCard,
  MessageSquare,
  Gift,
  ClipboardCheck,
  AlertCircle,
  Sparkles,
  Info,
  Zap,
  ArrowRight,
  X,
} from 'lucide-react';
import { NavPage } from '../types';
import {
  UserProfileData,
  getStoredUserProfile,
} from '../data/userProfile';
import {
  Sube,
  getStoredSubeler,
  getActiveSubeId,
  setActiveSubeId,
} from '../data/subeData';
import {
  getStoredNotifications,
  saveStoredNotifications,
  SportsFlyNotification,
  addSporPuanNotification
} from '../data/notifications';
import { ProfileSettingsModal } from './modals/ProfileSettingsModal';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme, ThemeMode } from '../contexts/ThemeContext';

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
  const { t, language, setLanguage } = useLanguage();
  const { theme, actualTheme, setTheme, toggleTheme } = useTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  // Multi-Branch Switcher State
  const [subeler, setSubeler] = useState<Sube[]>(() => getStoredSubeler());
  const [activeBranchId, setActiveBranchIdState] = useState<string>(() => getActiveSubeId());
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const branchMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Profile modal state
  const [userProfile, setUserProfile] = useState<UserProfileData>(() => getStoredUserProfile());
  
  // Dynamic Live Notifications Store
  const [notifications, setNotifications] = useState<SportsFlyNotification[]>(() =>
    getStoredNotifications(getStoredUserProfile().role)
  );

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  // React to profile changes to load appropriate notification sets
  useEffect(() => {
    setNotifications(getStoredNotifications(userProfile.role));
  }, [userProfile.role]);

  const handleMarkAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isUnread: false }));
    setNotifications(updated);
    saveStoredNotifications(userProfile.role, updated);
  };

  const handleToggleRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, isUnread: !n.isUnread } : n
    );
    setNotifications(updated);
    saveStoredNotifications(userProfile.role, updated);
  };

  const handleSimulateNotification = () => {
    const categories: ('system' | 'support' | 'payment' | 'message' | 'birthday' | 'training')[] = [
      'system', 'support', 'payment', 'message', 'birthday', 'training'
    ];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    let title = '';
    let description = '';
    
    const roleLower = userProfile.role.toLowerCase();
    if (roleLower.includes('veli') || roleLower.includes('ebeveyn') || roleLower.includes('parent')) {
      // Parent
      switch(category) {
        case 'system':
          title = 'Veli Portalı Güncellemesi';
          description = 'Sporcu gelişim analiz motoru başarıyla güncellendi.';
          break;
        case 'support':
          title = 'Yeni Destek Mesajı';
          description = 'Müşteri temsilcisi biletinize yeni bir açıklama ekledi.';
          break;
        case 'payment':
          title = 'Ödeme Planı Hatırlatması';
          description = 'Ekim dönemi spor okulu taksit son ödeme tarihine 3 gün kaldı.';
          break;
        case 'message':
          title = 'Antrenör Mesajı';
          description = 'Ali Özcan: "Yarın akşamki ek voleybol seansına herkesi bekliyoruz."';
          break;
        case 'birthday':
          title = 'Doğum Günü Sürprizi';
          description = 'SportsFly Club, sporcumuza özel %20 doğum günü indirim kuponu tanımladı!';
          break;
        case 'training':
          title = 'Antrenman İptal Bilgisi';
          description = 'Aşırı hava muhalefeti sebebiyle yarınki açık saha yüzme seansı ertelenmiştir.';
          break;
      }
    } else if (roleLower.includes('antrenör') || roleLower.includes('antrenor') || roleLower.includes('eğitmen') || roleLower.includes('coach') || roleLower.includes('trainer')) {
      // Coach
      switch(category) {
        case 'system':
          title = 'Antrenör Mobil Performans Yaması';
          description = 'Tablet cihazlarında yoklama listesi dikey kaydırma iyileştirmesi yapıldı.';
          break;
        case 'support':
          title = 'Destek Talebi Güncellendi';
          description = '"Yeni antrenman yeleği siparişi" talebiniz satın alma birimine iletildi.';
          break;
        case 'payment':
          title = 'Grup Aidat Raporu Hazır';
          description = 'Basketbol A grubunun aidat ödeme oranları muhasebe tarafından onaylandı.';
          break;
        case 'message':
          title = 'Yönetici Duyurusu';
          description = 'Selman Utku: "Ekim ayı teknik antrenör seminer katılım formunu doldurun."';
          break;
        case 'birthday':
          title = '🎂 Sporcu Doğum Günü Uyarısı';
          description = 'U14 Basketbol takımından Kaan Güneş bugün yeni yaşına bastı.';
          break;
        case 'training':
          title = 'Yeni Antrenman Müfredatı';
          description = 'U14 Basketbol takımı için "Baskılı Defans ve Hücum Geçişleri" müfredatı aktif edildi.';
          break;
      }
    } else {
      // Manager/Admin
      switch(category) {
        case 'system':
          title = 'Sunucu Bakım Bilgilendirmesi';
          description = 'Bu gece saat 02:00 - 03:00 arasında veri tabanı yedekleme çalışması yapılacaktır.';
          break;
        case 'support':
          title = 'Yeni Destek Bileti';
          description = 'Veli Mehmet Yılmaz: "Uygulamada ödeme ekranında limit hatası alıyorum."';
          break;
        case 'payment':
          title = 'Yüksek Tutarlı Aidat Tahsilatı';
          description = 'Basketbol A grubundan Caner Solak, 1 yıllık toplu aidat ödemesini gerçekleştirdi.';
          break;
        case 'message':
          title = 'Eğitmen İzin Başvurusu';
          description = 'Hakan Öztürk: "14-16 Ekim tarihleri arasında yıllık izin talep ediyorum."';
          break;
        case 'birthday':
          title = '🎂 Sporcu Doğum Günü Bildirimi';
          description = 'Kulübünüzdeki voleybol sporcularından Selin Kaya bugün yeni yaşına bastı.';
          break;
        case 'training':
          title = 'Grup Katılım Alarmı';
          description = 'Kadıköy Basketbol B Grubu katılım oranı üst üste 3 seans %95\'in üzerinde gerçekleşti.';
          break;
      }
    }

    const newNotification: SportsFlyNotification = {
      id: `simulated-${Date.now()}`,
      category,
      title,
      description,
      time: 'Şimdi',
      isUnread: true
    };

    const updated = [newNotification, ...notifications];
    setNotifications(updated);
    saveStoredNotifications(userProfile.role, updated);
  };

  const handleSimulateSporPuan = () => {
    const sampleAthletes = [
      { name: 'Ali Yılmaz', rule: 'Fair-play ve örnek davranış', points: 50, cat: 'Davranış', note: 'Maç sonunda rakip takımı tebrik etme' },
      { name: 'Ece Demir', rule: 'Haftalık tam antrenman devamı', points: 25, cat: 'Devam', note: 'Haftanın tüm seanslarına eksiksiz katılım' },
      { name: 'Mert Kaya', rule: 'Gelişim testinde kişisel rekor', points: 40, cat: 'Gelişim', note: 'Çeviklik testinde 0.4 sn hızlanma' },
      { name: 'Zeynep Akın', rule: 'Turnuva katılımı ve kulüp temsili', points: 75, cat: 'Etkinlik', note: 'Bölge şampiyonası takım temsili' },
      { name: 'Caner Solak', rule: 'Antrenmana vaktinde katılım', points: 15, cat: 'Devam', note: 'Isınma öncesi hazırlık' },
    ];
    const picked = sampleAthletes[Math.floor(Math.random() * sampleAthletes.length)];
    addSporPuanNotification({
      sporcuName: picked.name,
      ruleName: picked.rule,
      points: picked.points,
      category: picked.cat,
      note: picked.note,
    });
  };

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState<'genel' | 'guvenlik' | 'bildirimler' | 'tercihler'>('genel');
  const [logoutNotification, setLogoutNotification] = useState<string | null>(null);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  const isSuperAdmin = userProfile.role.toLowerCase().includes('admin') || userProfile.role.toLowerCase().includes('süper');

  // Force non-admins to Kadıköy Merkez branch
  useEffect(() => {
    if (!isSuperAdmin) {
      const activeId = getActiveSubeId();
      if (activeId !== 'sube-kadikoy') {
        setActiveSubeId('sube-kadikoy');
        setActiveBranchIdState('sube-kadikoy');
      }
    }
  }, [isSuperAdmin]);

  // Sync branches and active branch
  useEffect(() => {
    const handleBranchUpdate = (e: any) => {
      if (e.detail) {
        setSubeler(e.detail);
      }
    };
    const handleActiveBranchChange = (e: any) => {
      if (e.detail) {
        setActiveBranchIdState(e.detail);
      }
    };
    window.addEventListener('sportsfly_subeler_updated', handleBranchUpdate);
    window.addEventListener('sportsfly_active_sube_changed', handleActiveBranchChange);
    return () => {
      window.removeEventListener('sportsfly_subeler_updated', handleBranchUpdate);
      window.removeEventListener('sportsfly_active_sube_changed', handleActiveBranchChange);
    };
  }, []);

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

  // Sync notifications when updated in another view
  useEffect(() => {
    const handleNotificationsUpdate = (e: any) => {
      if (e.detail && e.detail.notifications) {
        const currentRole = getStoredUserProfile().role;
        setNotifications(getStoredNotifications(currentRole));
      }
    };
    const handleOpenNotifications = () => {
      setShowNotifications(true);
    };
    window.addEventListener('sportsfly_notifications_updated', handleNotificationsUpdate);
    window.addEventListener('sportsfly_open_notifications', handleOpenNotifications);
    return () => {
      window.removeEventListener('sportsfly_notifications_updated', handleNotificationsUpdate);
      window.removeEventListener('sportsfly_open_notifications', handleOpenNotifications);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (branchMenuRef.current && !branchMenuRef.current.contains(event.target as Node)) {
        setShowBranchMenu(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
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
      case 'yoklama':
        return 'SportsFly > Yoklama Yönetimi';
      case 'anket-yonetimi':
        return 'SportsFly > Anket Yönetimi';
      case 'sporcu-karnesi':
        return 'SportsFly > Sporcu Karnesi';
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
      case 'subeler':
        return 'SportsFly > Kulüpler > Şube Yönetimi';
      case 'sube-ozet':
        return 'SportsFly > Kulüpler > Şube Özeti';
      case 'sayfa-yonetimi':
        return 'SportsFly > Sayfa Yönetimi';
      case 'paket-yonetimi':
      case 'paketler':
        return 'SportsFly > Paketler';
      case 'tanimsiz-kullanicilar':
        return 'SportsFly > Tanımsız Kullanıcılar';
      case 'kullanici-sozlesmeleri':
        return 'SportsFly > Kulüp Sözleşmeleri';
      case 'kulup-evraklari':
        return 'SportsFly > Kulüpler > Kulüp Evrakları';
      case 'kulup-galerisi':
        return 'SportsFly > Kulüpler > Kulüp Galerisi';
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
    <header className="bg-white dark:bg-[#111c2e] border-b border-slate-200/90 dark:border-slate-800 sticky top-0 z-30 shadow-xs transition-colors duration-200">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left Side: Single Icon (Menu Toggle) & Breadcrumbs (SportsFly > Sayfa) */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          {/* Menu Toggle Button */}
          <button
            id="header-sidebar-toggle-btn"
            onClick={onToggleSidebar}
            className="w-10 h-10 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700"
            title="Menüyü Daralt/Genişlet"
            aria-label="Menüyü Aç/Kapat"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb: SportsFly > Anasayfa */}
          <nav className="hidden sm:flex items-center text-xs sm:text-sm font-medium truncate select-none">
            <span
              onClick={() => onNavigate?.('anasayfa')}
              className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer shrink-0 font-semibold"
              title="Anasayfaya Git"
            >
              {rootCrumb}
            </span>
            {childCrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <span className="mx-1.5 text-slate-400 dark:text-slate-600 shrink-0">&gt;</span>
                <span
                  className={`truncate ${
                    idx === childCrumbs.length - 1
                      ? 'text-slate-800 dark:text-slate-200 font-semibold'
                      : 'text-slate-500 dark:text-slate-400'
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
              className="text-blue-600 dark:text-blue-400 text-xs font-bold shrink-0 cursor-pointer"
            >
              {rootCrumb}
            </span>
            <span className="text-slate-400 dark:text-slate-600 text-xs font-semibold shrink-0">&gt;</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
              {childCrumbs[childCrumbs.length - 1] || 'Anasayfa'}
            </span>
          </div>
        </div>

        {/* Right Side: Branch Switcher, Theme Switcher, Notifications & Profile Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Multi-Branch Quick Switcher */}
          <div className="relative" ref={branchMenuRef}>
            {isSuperAdmin ? (
              <button
                onClick={() => {
                  setShowBranchMenu(!showBranchMenu);
                  setShowNotifications(false);
                  setShowProfileMenu(false);
                  setShowThemeMenu(false);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-[#162238] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-bold transition-all shadow-sm cursor-pointer"
                title="Aktif Kulüp Şubesini Değiştir"
              >
                <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="max-w-[120px] sm:max-w-[200px] truncate">
                  {activeBranchId === 'all'
                    ? 'Tüm Şubeler'
                    : subeler.find((s) => s.id === activeBranchId)?.ad || 'Şube Seç'}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            ) : (
              <div
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-slate-50 dark:bg-[#162238]/60 text-slate-600 dark:text-slate-300 text-xs font-semibold select-none"
                title="Kendi Şubeniz (Değiştirilemez)"
              >
                <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="hidden md:inline text-slate-400 font-medium text-[11px]">Şube:</span>
                <span className="max-w-[100px] sm:max-w-[140px] truncate font-bold text-slate-800 dark:text-slate-200">
                  {subeler.find((s) => s.id === 'sube-kadikoy')?.ad || 'Kadıköy Merkez Şube'}
                </span>
              </div>
            )}

            {isSuperAdmin && showBranchMenu && (
              <div className="fixed inset-0 sm:absolute sm:inset-auto sm:right-auto sm:left-0 sm:mt-3 w-full sm:w-[360px] sm:max-w-[calc(100vw-32px)] bg-white dark:bg-[#111c2e] sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 py-4 z-[9999] animate-in fade-in overflow-hidden">
                {/* Mobile Header for closing */}
                <div className="sm:hidden px-6 pb-4 flex justify-end">
                   <button onClick={() => setShowBranchMenu(false)} className="p-2 bg-slate-100 rounded-full">
                     <X className="w-5 h-5 text-slate-600" />
                   </button>
                </div>
                <div className="px-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Kulüp Şubeleri
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {subeler.length} Şube
                  </span>
                </div>

                <div className="p-2 space-y-1 max-h-[60vh] overflow-y-auto">
                  <button
                    onClick={() => {
                      setActiveSubeId('all');
                      setActiveBranchIdState('all');
                      setShowBranchMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                      activeBranchId === 'all'
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span>Tüm Şubeler (Konsolide)</span>
                    </div>
                    {activeBranchId === 'all' && <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                  </button>

                  {subeler.map((sube) => (
                    <button
                      key={sube.id}
                      onClick={() => {
                        setActiveSubeId(sube.id);
                        setActiveBranchIdState(sube.id);
                        setShowBranchMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                        activeBranchId === sube.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                           <Building2 className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{sube.ad}</div>
                          <div className="text-xs text-slate-500">{sube.sporcuSayisi} Sporcu</div>
                        </div>
                      </div>
                      {activeBranchId === sube.id && <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                    </button>
                  ))}
                </div>

                <div className="px-6 pt-4 border-t border-slate-100 dark:border-slate-800 mt-2 space-y-3">
                  <button
                    onClick={() => { setShowBranchMenu(false); onNavigate?.('sube-ozet'); }}
                    className="w-full flex items-center justify-between text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline"
                  >
                    Şube Özeti & Finansal Rapor <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                     onClick={() => { setShowBranchMenu(false); onNavigate?.('subeler'); }}
                     className="w-full text-left text-slate-600 dark:text-slate-400 text-sm font-semibold hover:text-slate-900 dark:hover:text-slate-100"
                  >
                    Şube Listesi & Tesis Yönetimi
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* THEME TOGGLE (Açık / Koyu / Sistem Modu) */}
          <div className="relative" ref={themeMenuRef}>
            <button
              id="header-theme-toggle-btn"
              onClick={() => {
                setShowThemeMenu(!showThemeMenu);
                setShowNotifications(false);
                setShowProfileMenu(false);
                setShowBranchMenu(false);
              }}
              className="w-10 h-10 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
              title={`Tema: ${theme === 'dark' ? 'Koyu' : theme === 'light' ? 'Açık' : 'Sistem'}`}
              aria-label="Tema Seçimi"
            >
              {actualTheme === 'dark' ? (
                <Moon className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-12" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500 transition-transform duration-200 hover:rotate-45" />
              )}
            </button>

            {/* Theme Dropdown */}
            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111c2e] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Görünüm Teması
                </div>

                <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setTheme('light');
                      setShowThemeMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      theme === 'light'
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>Açık Tema</span>
                    </div>
                    {theme === 'light' && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  </button>

                  <button
                    onClick={() => {
                      setTheme('dark');
                      setShowThemeMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Moon className="w-3.5 h-3.5 text-blue-400" />
                      <span>Koyu Tema</span>
                    </div>
                    {theme === 'dark' && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  </button>

                  <button
                    onClick={() => {
                      setTheme('system');
                      setShowThemeMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      theme === 'system'
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Laptop className="w-3.5 h-3.5 text-slate-400" />
                      <span>Sistem Tercihi</span>
                    </div>
                    {theme === 'system' && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  </button>
                </div>
              </div>
            )}
          </div>



          {/* Notifications */}
          <div className="relative">
            <button
              id="header-notification-btn"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
                setShowThemeMenu(false);
                setShowBranchMenu(false);
              }}
              className="relative w-10 h-10 rounded-xl text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
              aria-label="Bildirimler"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-white dark:ring-[#111c2e]"></span>
              )}
            </button>
 
            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-100 max-w-[calc(100vw-2rem)] bg-white dark:bg-[#111c2e] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                
                {/* Header Info */}
                <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">Bildirimler</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-full">
                        {unreadCount} yeni
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    {/* SporPuan Push Toast Test Button */}
                    <button
                      onClick={handleSimulateSporPuan}
                      className="text-[10px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 hover:text-amber-900 px-2 py-1 rounded-md font-bold border border-amber-500/30 transition-colors cursor-pointer flex items-center gap-1"
                      title="Anlık SporPuan Kazanımı ve Push Uyarısı Tetikle"
                    >
                      <Zap className="w-2.5 h-2.5 fill-amber-500 text-amber-600" />
                      <span>+ Puan Push</span>
                    </button>

                    {/* Simulator Button */}
                    <button
                      onClick={handleSimulateNotification}
                      className="text-[10px] bg-slate-100 dark:bg-[#162238] hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 px-2 py-1 rounded-md font-bold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                      title="Yeni simüle bildirim tetikle"
                    >
                      Test
                    </button>
                    
                    <button
                      onClick={handleMarkAllAsRead}
                      disabled={unreadCount === 0}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline cursor-pointer disabled:opacity-50 disabled:no-underline"
                    >
                      Tümünü oku
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-8 px-4 text-center">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400 dark:text-slate-500">
                        <Check className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Harika! Hiç bildirim yok.</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Yeni güncellemeler burada gösterilecektir.</p>
                    </div>
                  ) : (
                    notifications.map((notif) => {
                      // Icon mappings
                      const renderCategoryIcon = () => {
                        switch (notif.category) {
                          case 'system':
                            return <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
                          case 'support':
                            return <LifeBuoy className="w-4 h-4 text-sky-500 dark:text-sky-400" />;
                          case 'payment':
                            return <CreditCard className="w-4 h-4 text-amber-500 dark:text-amber-400" />;
                          case 'message':
                            return <MessageSquare className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
                          case 'birthday':
                            return <Gift className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />;
                          case 'training':
                            return <ClipboardCheck className="w-4 h-4 text-rose-500 dark:text-rose-400" />;
                          case 'sporpuan':
                            return <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />;
                          default:
                            return <Info className="w-4 h-4 text-slate-500" />;
                        }
                      };

                      const getCategoryBg = () => {
                        switch (notif.category) {
                          case 'system':
                            return 'bg-purple-50 dark:bg-purple-950/30 border-purple-100/50 dark:border-purple-900/30';
                          case 'support':
                            return 'bg-sky-50 dark:bg-sky-950/30 border-sky-100/50 dark:border-sky-900/30';
                          case 'payment':
                            return 'bg-amber-50 dark:bg-amber-950/30 border-amber-100/50 dark:border-amber-900/30';
                          case 'message':
                            return 'bg-blue-50 dark:bg-blue-950/30 border-blue-100/50 dark:border-blue-900/30';
                          case 'birthday':
                            return 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100/50 dark:border-emerald-900/30';
                          case 'training':
                            return 'bg-rose-50 dark:bg-rose-950/30 border-rose-100/50 dark:border-rose-900/30';
                          case 'sporpuan':
                            return 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-800/50';
                          default:
                            return 'bg-slate-50 dark:bg-slate-900/50 border-slate-100';
                        }
                      };

                      return (
                        <div
                          key={notif.id}
                          className={`p-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors flex items-start gap-3 relative group ${
                            notif.isUnread ? 'bg-blue-50/20 dark:bg-blue-950/10' : ''
                          }`}
                        >
                          {/* Unread Status Marker Button */}
                          <button
                            onClick={() => handleToggleRead(notif.id)}
                            className="mt-1.5 shrink-0 relative flex items-center justify-center cursor-pointer"
                            title={notif.isUnread ? "Okundu olarak işaretle" : "Okunmadı olarak işaretle"}
                          >
                            <span
                              className={`w-2.5 h-2.5 rounded-full border transition-all ${
                                notif.isUnread
                                  ? 'bg-blue-600 border-blue-600 scale-110 shadow-xs'
                                  : 'bg-transparent border-slate-300 dark:border-slate-600 group-hover:border-slate-400'
                              }`}
                            />
                          </button>

                          {/* Category Visual Icon */}
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${getCategoryBg()}`}>
                            {renderCategoryIcon()}
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-xs font-bold leading-tight ${notif.isUnread ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                {notif.title}
                              </p>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0">
                                {notif.time}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                              {notif.description}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer Portal Information */}
                <div className="px-4 pt-2 mt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                  <span>Portal Akışı:</span>
                  <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-[#162238] rounded text-slate-600 dark:text-slate-300 font-bold">
                    {userProfile.role === 'Süper Admin' ? 'Yöneticilere Özel' : userProfile.role.includes('Veli') ? 'Velilere Özel' : 'Antrenörlere Özel'}
                  </span>
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
                setShowThemeMenu(false);
                setShowBranchMenu(false);
              }}
              className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 bg-slate-100 dark:bg-[#162238] hover:bg-slate-200/80 dark:hover:bg-slate-800 rounded-full border border-slate-200/80 dark:border-slate-700 transition-all text-left cursor-pointer shadow-2xs"
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
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  {userProfile.name}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">
                  {userProfile.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 hidden sm:inline" />
            </button>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 sm:w-72 max-w-[calc(100vw-2rem)] bg-white dark:bg-[#111c2e] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-[#162238]/60 rounded-t-2xl">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                      Yönetici Hesabı
                    </p>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] font-extrabold">
                      {userProfile.role}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate mt-1">{userProfile.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userProfile.email}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>İletişim: <strong className="text-slate-800 dark:text-slate-200">{userProfile.phone}</strong></span>
                  </div>
                </div>

                <div className="py-1.5 px-1 space-y-0.5">
                  <button
                    id="btn-open-profile-settings"
                    onClick={() => openProfileTab('genel')}
                    className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50/70 dark:hover:bg-slate-800/80 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                  >
                    <span className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                      <span className="font-semibold">{t('header.profile')}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400">Düzenle &gt;</span>
                  </button>

                  <button
                    id="btn-open-security-settings"
                    onClick={() => openProfileTab('guvenlik')}
                    className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50/70 dark:hover:bg-slate-800/80 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                  >
                    <span className="flex items-center gap-2.5">
                      <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                      <span>Şifre &amp; Güvenlik (2FA)</span>
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </button>

                  <button
                    id="btn-open-notification-settings"
                    onClick={() => openProfileTab('bildirimler')}
                    className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50/70 dark:hover:bg-slate-800/80 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                  >
                    <span className="flex items-center gap-2.5">
                      <Bell className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                      <span>Bildirim Tercihleri</span>
                    </span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded-md font-mono">
                      SMS/E-posta
                    </span>
                  </button>

                  <button
                    id="btn-open-system-preferences"
                    onClick={() => openProfileTab('tercihler')}
                    className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50/70 dark:hover:bg-slate-800/80 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                  >
                    <span className="flex items-center gap-2.5">
                      <Sliders className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                      <span>Sistem &amp; Görünüm Tercihleri</span>
                    </span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                      {theme === 'dark' ? '🌙 Koyu' : theme === 'light' ? '☀️ Açık' : '💻 Sistem'}
                    </span>
                  </button>

                  {onNavigate && (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onNavigate('destek');
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50/70 dark:hover:bg-slate-800/80 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                    >
                      <span className="flex items-center gap-2.5">
                        <LifeBuoy className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        <span>SportsFly Destek &amp; Yardım</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
                        7/24
                      </span>
                    </button>
                  )}

                  <a
                    href="https://sportsfly.app"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50/70 dark:hover:bg-slate-800/80 rounded-xl flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <ExternalLink className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                      <span>SportsFly Web Sitesi</span>
                    </span>
                  </a>
                </div>

                <div className="pt-1.5 px-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    id="btn-profile-logout"
                    onClick={handleLogout}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>{t('header.logout')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Notification Toast */}
      {logoutNotification && (
        <div className="absolute top-18 right-6 z-50 bg-slate-900 dark:bg-slate-800 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
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
