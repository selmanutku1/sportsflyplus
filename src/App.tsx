import React, { useState, useEffect } from 'react';
import { NavPage, PackagePlanType } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { SporsepetiUserView } from './components/views/SporsepetiUserView';
import { SporcularView } from './components/views/SporcularView';
import { EgitmenlerView } from './components/views/EgitmenlerView';
import { AntrenmanTakvimiView } from './components/views/AntrenmanTakvimiView';
import { YoneticilerView } from './components/views/YoneticilerView';
import { SporpuanDegerlendirmelerView } from './components/views/sporpuan/SporpuanDegerlendirmelerView';
import { SporpuanSporcuDegerlendirmeView } from './components/views/sporpuan/SporpuanSporcuDegerlendirmeView';
import { SporpuanDogrulamalarView } from './components/views/sporpuan/SporpuanDogrulamalarView';
import { SporpuanRaporlarView } from './components/views/sporpuan/SporpuanRaporlarView';
import { GruplarView } from './components/views/GruplarView';
import { OnMuhasebeView } from './components/views/OnMuhasebeView';
import { YoklamaView } from './components/views/YoklamaView';
import { AnketYonetimiView } from './components/views/AnketYonetimiView';
import { SporcuKarnesiView } from './components/views/SporcuKarnesiView';
import { EgitimPlanlamaView } from './components/views/EgitimPlanlamaView';
import { KulupSozlesmeleriView } from './components/views/KulupSozlesmeleriView';
import { SporOkuluBasvurulariView } from './components/views/SporOkuluBasvurulariView';
import { KulupEvraklariView } from './components/views/sporcu/KulupEvraklariView';
import { KulupGalerisiView } from './components/views/sporcu/KulupGalerisiView';
import { TurnuvaYonetimiView } from './components/views/moduller/TurnuvaYonetimiView';
import { EnvanterYonetimiView } from './components/views/moduller/EnvanterYonetimiView';
import { ReferralProgramView } from './components/views/moduller/ReferralProgramView';
import { EntegrasyonlarView } from './components/views/EntegrasyonlarView';
import { INITIAL_SPORCULAR } from './data/mockData';
import { PaketlerView } from './components/views/PaketlerView';
import { OnKayitView } from './components/views/OnKayitView';
import { YetkilendirmelerView } from './components/views/YetkilendirmelerView';
import { SubelerView } from './components/views/SubelerView';
import { SubeOzetView } from './components/views/SubeOzetView';
import { DestekView } from './components/views/DestekView';
import { GenericPageView } from './components/views/GenericPageView';

import { PackageAccessRestrictedView } from './components/views/PackageAccessRestrictedView';
import { LoginView } from './components/LoginView';
import { PointEarnedPushToast } from './components/notifications/PointEarnedPushToast';
import { ReminderPushToast } from './components/notifications/ReminderPushToast';
import {
  getActiveSessionPlan,
  isPageAllowedForPlan,
  getPageRestrictionInfo,
  isSuperAdminUser,
} from './data/packagePermissions';
import { getStoredUserProfile, UserProfileData } from './data/userProfile';

export default function App() {
  // Authentication State: defaults to false so user immediately sees the identical login page
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('sportsfly_auth_active');
        if (stored === 'true') return true;
        if (stored === 'false') return false;
      } catch (e) {}
    }
    return false;
  });

  const handleLoginSuccess = (role?: string) => {
    const freshProfile = getStoredUserProfile();
    setUserProfile(freshProfile);
    setIsAuthenticated(true);
    if (!isSuperAdminUser(role || freshProfile?.role)) {
      setCurrentPage((prev) =>
        prev === 'spor-okulu-basvurulari' ? 'anasayfa' : prev
      );
    }
    try {
      sessionStorage.setItem('sportsfly_auth_active', 'true');
    } catch (e) {}
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.setItem('sportsfly_auth_active', 'false');
    } catch (e) {}
  };

  const [currentPage, setCurrentPage] = useState<NavPage>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('sportsfly_user_profile_v1');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.preferences?.defaultPage) {
            return parsed.preferences.defaultPage as NavPage;
          }
        }
      } catch (e) {}
    }
    return 'gruplar';
  });

  const [currentPlan, setCurrentPlan] = useState<PackagePlanType>(() => getActiveSessionPlan());
  const [userProfile, setUserProfile] = useState<UserProfileData>(() => getStoredUserProfile());

  // Listen for plan and profile changes across components and storage events
  useEffect(() => {
    const handlePlanUpdate = () => {
      setCurrentPlan(getActiveSessionPlan());
    };

    const handleProfileUpdate = () => {
      setUserProfile(getStoredUserProfile());
    };

    window.addEventListener('storage', handlePlanUpdate);
    window.addEventListener('sportsfly_plan_changed', handlePlanUpdate);
    window.addEventListener('sportsfly_plan_updated', handlePlanUpdate);
    window.addEventListener('sportsfly_profile_updated', handleProfileUpdate);

    return () => {
      window.removeEventListener('storage', handlePlanUpdate);
      window.removeEventListener('sportsfly_plan_changed', handlePlanUpdate);
      window.removeEventListener('sportsfly_plan_updated', handlePlanUpdate);
      window.removeEventListener('sportsfly_profile_updated', handleProfileUpdate);
    };
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });

  React.useEffect(() => {
    let prevWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      if (prevWidth < 1024 && currentWidth >= 1024) {
        setIsSidebarOpen(true);
      } else if (prevWidth >= 1024 && currentWidth < 1024) {
        setIsSidebarOpen(false);
      }
      prevWidth = currentWidth;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handlePageSelect = (page: NavPage) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const renderActiveView = () => {
    // 1. Enforce package-tier access limits (Süper Admin has full access to Sporpuan modules regardless of plan)
    if (!isPageAllowedForPlan(currentPage, currentPlan, userProfile?.role)) {
      const restrictionInfo = getPageRestrictionInfo(currentPage, currentPlan, userProfile?.role);
      return (
        <PackageAccessRestrictedView
          page={currentPage}
          currentPlan={currentPlan}
          restriction={restrictionInfo}
          restrictionInfo={restrictionInfo}
          onNavigate={handlePageSelect}
          onUpgradeRequest={() => {
            handlePageSelect('paketler');
          }}
        />
      );
    }

    switch (currentPage) {
      case 'anasayfa':
        return <DashboardView onNavigate={handlePageSelect} />;
      case 'sporsepeti-user':
        return <SporsepetiUserView />;
      case 'sporcular':
        return <SporcularView onNavigate={handlePageSelect} />;
      case 'egitmenler':
        return <EgitmenlerView />;
      case 'gruplar':
        return <GruplarView onNavigate={handlePageSelect} />;
      case 'yoklama':
        return <YoklamaView />;
      case 'anket-yonetimi':
        return <AnketYonetimiView />;
      case 'sporcu-karnesi':
        return <SporcuKarnesiView onNavigate={handlePageSelect} />;
      case 'egitim-planlama':
        return <EgitimPlanlamaView />;
      case 'antrenman-takvimi':
        return <AntrenmanTakvimiView />;
      case 'on-muhasebe':
        return <OnMuhasebeView key="on-muhasebe-genel" initialTab="genel" onNavigate={handlePageSelect} />;
      case 'gelir-gider-kategori':
        return <OnMuhasebeView key="on-muhasebe-kategoriler" initialTab="kategoriler" onNavigate={handlePageSelect} />;
      case 'gelir-gider-yonetimi':
        return <OnMuhasebeView key="on-muhasebe-hareketler" initialTab="hareketler" onNavigate={handlePageSelect} />;
      case 'odeme-plani-kontrol':
        return <OnMuhasebeView key="on-muhasebe-kontrol" initialTab="kontrol" onNavigate={handlePageSelect} />;
      case 'odeme-plani':
        return <OnMuhasebeView key="on-muhasebe-planlar" initialTab="planlar" onNavigate={handlePageSelect} />;
      case 'yoneticiler':
        return <YoneticilerView />;
      case 'sporpuan-sporcu-degerlendirme':
        return <SporpuanSporcuDegerlendirmeView onNavigate={handlePageSelect} />;
      case 'sporpuan-degerlendirmeler':
        return <SporpuanDegerlendirmelerView onNavigate={handlePageSelect} />;
      case 'sporpuan-dogrulamalar':
        return <SporpuanDogrulamalarView />;
      case 'sporpuan-raporlar':
        return <SporpuanRaporlarView />;
      case 'kullanici-sozlesmeleri':
        return <KulupSozlesmeleriView />;
      case 'spor-okulu-basvurulari':
        return <SporOkuluBasvurulariView />;
      case 'yetkilendirmeler':
        return <YetkilendirmelerView />;
      case 'kulup-evraklari':
        return (
          <KulupEvraklariView
            sporcular={INITIAL_SPORCULAR}
            onNavigate={handlePageSelect}
          />
        );
      case 'kulup-galerisi':
        return (
          <KulupGalerisiView
            sporcular={INITIAL_SPORCULAR}
            onNavigate={handlePageSelect}
          />
        );
      case 'turnuva-yonetimi':
        return <TurnuvaYonetimiView />;
      case 'envanter-yonetimi':
        return <EnvanterYonetimiView />;
      case 'referans-programi':
        return <ReferralProgramView onNavigate={handlePageSelect} />;
      case 'entegrasyonlar':
        return <EntegrasyonlarView onNavigate={handlePageSelect} />;
      case 'paketler':
      case 'paket-yonetimi':
        return <PaketlerView />;
      case 'on-kayit':
        return <OnKayitView />;
      case 'subeler':
        return <SubelerView onNavigate={handlePageSelect} />;
      case 'sube-ozet':
        return <SubeOzetView onNavigate={handlePageSelect} />;
      case 'destek':
        return <DestekView />;

      default:
        return <GenericPageView page={currentPage} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="h-screen h-[100dvh] print:h-auto print:overflow-visible print:static bg-slate-50 dark:bg-[#0b1320] text-slate-800 dark:text-slate-100 flex flex-col antialiased relative transition-colors duration-200 overflow-hidden">
      {/* Mobile/Desktop Instant Point Award Push Notification Toast */}
      <PointEarnedPushToast onNavigate={handlePageSelect} />
      {/* Mobile/Desktop Automatic Yoklama Reminder Push Toast */}
      <ReminderPushToast onNavigate={handlePageSelect} />

      <div className="flex flex-1 overflow-hidden h-full print:h-auto print:overflow-visible print:block">
        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onSelectPage={handlePageSelect}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
          currentPlan={currentPlan}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden print:h-auto print:overflow-visible print:block">
          {/* Header - Permanently pinned at the top on both web & mobile */}
          <Header
            currentPage={currentPage}
            onToggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            onNavigate={handlePageSelect}
            onLogout={handleLogout}
          />

          {/* Body Content - Dedicated scrollable viewport */}
          <main className="flex-1 p-3.5 sm:p-4 lg:p-6 w-full overflow-y-auto overflow-x-hidden print:p-0 print:overflow-visible print:h-auto">
            {renderActiveView()}
          </main>
        </div>
      </div>
    </div>
  );
}
