import React, { useState, useEffect } from 'react';
import { NavPage, PackagePlanType } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { SporsepetiUserView } from './components/views/SporsepetiUserView';
import { YetkilendirmelerView } from './components/views/YetkilendirmelerView';
import { SporcularView } from './components/views/SporcularView';
import { EgitmenlerView } from './components/views/EgitmenlerView';
import { AntrenmanTakvimiView } from './components/views/AntrenmanTakvimiView';
import { YoneticilerView } from './components/views/YoneticilerView';
import { SporpuanDegerlendirmelerView } from './components/views/sporpuan/SporpuanDegerlendirmelerView';
import { SporpuanDogrulamalarView } from './components/views/sporpuan/SporpuanDogrulamalarView';
import { SporpuanRaporlarView } from './components/views/sporpuan/SporpuanRaporlarView';
import { GruplarView } from './components/views/GruplarView';
import { OnMuhasebeView } from './components/views/OnMuhasebeView';
import { KulupSozlesmeleriView } from './components/views/KulupSozlesmeleriView';
import { PaketlerView } from './components/views/PaketlerView';
import { OnKayitView } from './components/views/OnKayitView';
import { GenericPageView } from './components/views/GenericPageView';
import { PackageAccessRestrictedView } from './components/views/PackageAccessRestrictedView';
import { LoginView } from './components/LoginView';
import {
  getActiveSessionPlan,
  isPageAllowedForPlan,
  getPageRestrictionInfo,
} from './data/packagePermissions';

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
    setIsAuthenticated(true);
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

  // Listen for plan changes across components and storage events
  useEffect(() => {
    const handlePlanUpdate = () => {
      setCurrentPlan(getActiveSessionPlan());
    };

    window.addEventListener('storage', handlePlanUpdate);
    window.addEventListener('sportsfly_plan_changed', handlePlanUpdate);

    return () => {
      window.removeEventListener('storage', handlePlanUpdate);
      window.removeEventListener('sportsfly_plan_changed', handlePlanUpdate);
    };
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      }
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
    // 1. Enforce package-tier access limits for the active plan
    if (!isPageAllowedForPlan(currentPage, currentPlan)) {
      const restrictionInfo = getPageRestrictionInfo(currentPage);
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
        return <DashboardView />;
      case 'sporsepeti-user':
        return <SporsepetiUserView />;
      case 'yetkilendirmeler':
        return <YetkilendirmelerView />;
      case 'sporcular':
        return <SporcularView />;
      case 'egitmenler':
        return <EgitmenlerView />;
      case 'gruplar':
        return <GruplarView />;
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
      case 'sporpuan-degerlendirmeler':
        return <SporpuanDegerlendirmelerView />;
      case 'sporpuan-dogrulamalar':
        return <SporpuanDogrulamalarView />;
      case 'sporpuan-raporlar':
        return <SporpuanRaporlarView />;
      case 'kullanici-sozlesmeleri':
        return <KulupSozlesmeleriView />;
      case 'paketler':
      case 'paket-yonetimi':
        return <PaketlerView />;
      case 'on-kayit':
        return <OnKayitView />;
      default:
        return <GenericPageView page={currentPage} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased relative">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onSelectPage={handlePageSelect}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
          currentPlan={currentPlan}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header */}
          <Header
            currentPage={currentPage}
            onToggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            onNavigate={handlePageSelect}
            onLogout={handleLogout}
          />

          {/* Body Content */}
          <main className="flex-1 p-3.5 sm:p-4 lg:p-6 max-w-7xl w-full mx-auto">
            {renderActiveView()}
          </main>
        </div>
      </div>

      {/* Quick return to Login Screen Floating Helper */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={handleLogout}
          className="bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold py-2 px-3.5 rounded-full shadow-lg border border-slate-700/60 backdrop-blur-xs flex items-center gap-2 transition-all hover:scale-105 cursor-pointer group"
          title="SportsFly Giriş Ekranına Dön"
        >
          <img src="/sportsfly-logo.svg" alt="" className="w-3.5 h-3.5 object-contain" />
          <span>Giriş Ekranına Dön</span>
        </button>
      </div>
    </div>
  );
}
