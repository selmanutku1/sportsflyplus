import React, { useState, useEffect } from 'react';
import { NavPage } from '../../types';
import { ClubManagerHomeView } from './dashboard/ClubManagerHomeView';
import { SportsFlyAdminDashboardView } from './dashboard/SportsFlyAdminDashboardView';
import { getStoredUserProfile } from '../../data/userProfile';
import { Building2, Shield, Clock, Users } from 'lucide-react';

interface DashboardViewProps {
  onNavigate?: (page: NavPage) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const [userProfile] = useState(() => getStoredUserProfile());
  const isSuperAdmin = userProfile.role.toLowerCase().includes('admin') || userProfile.role.toLowerCase().includes('süper');

  // Stored active mode: 'club' (Kulüp Yöneticisi Ana Sayfası) or 'platform' (SportsFly Admin Paneli)
  const [dashboardMode, setDashboardMode] = useState<'club' | 'platform'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('sportsfly_dashboard_view_mode_v2');
        if (stored === 'club' || stored === 'platform') return stored;
      } catch (e) {}
    }
    // Default to 'club' so club managers see the active athlete count, 10:00 AM logs, and club ops by default
    return 'club';
  });

  const handleModeChange = (mode: 'club' | 'platform') => {
    setDashboardMode(mode);
    try {
      localStorage.setItem('sportsfly_dashboard_view_mode_v2', mode);
    } catch (e) {}
  };

  return (
    <div className="space-y-5">
      {/* Top Switcher for Super Admin / Admin roles */}
      {isSuperAdmin && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-2 bg-white dark:bg-[#111c2e] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-2 px-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Görünüm:
            </span>
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md">
              {dashboardMode === 'club' ? '🏢 Kulüp Yönetim Masası' : '🌐 SportsFly Sistem Paneli'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#162238] p-1 rounded-xl">
            <button
              onClick={() => handleModeChange('club')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                dashboardMode === 'club'
                  ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Kulüp Ana Sayfası</span>
            </button>

            <button
              onClick={() => handleModeChange('platform')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                dashboardMode === 'platform'
                  ? 'bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>SportsFly Admin Paneli</span>
            </button>
          </div>
        </div>
      )}

      {/* Render Selected Dashboard View */}
      {dashboardMode === 'club' ? (
        <ClubManagerHomeView onNavigate={onNavigate} />
      ) : (
        <SportsFlyAdminDashboardView onNavigate={onNavigate} />
      )}
    </div>
  );
};
