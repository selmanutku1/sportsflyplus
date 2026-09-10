import React, { useState } from 'react';
import { NavPage } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { SporsepetiUserView } from './components/views/SporsepetiUserView';
import { YetkilendirmelerView } from './components/views/YetkilendirmelerView';
import { SporcularView } from './components/views/SporcularView';
import { EgitmenlerView } from './components/views/EgitmenlerView';
import { SporpuanDegerlendirmelerView } from './components/views/sporpuan/SporpuanDegerlendirmelerView';
import { SporpuanDogrulamalarView } from './components/views/sporpuan/SporpuanDogrulamalarView';
import { SporpuanRaporlarView } from './components/views/sporpuan/SporpuanRaporlarView';
import { GenericPageView } from './components/views/GenericPageView';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>('sporpuan-degerlendirmeler');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const renderActiveView = () => {
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
      case 'sporpuan-degerlendirmeler':
        return <SporpuanDegerlendirmelerView />;
      case 'sporpuan-dogrulamalar':
        return <SporpuanDogrulamalarView />;
      case 'sporpuan-raporlar':
        return <SporpuanRaporlarView />;
      default:
        return <GenericPageView page={currentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onSelectPage={setCurrentPage}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header */}
          <Header
            currentPage={currentPage}
            onToggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />

          {/* Body Content */}
          <main className="flex-1 p-4 lg:p-6 max-w-7xl w-full mx-auto">
            {renderActiveView()}
          </main>
        </div>
      </div>
    </div>
  );
}
