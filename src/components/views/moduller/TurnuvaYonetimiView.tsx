import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Plus,
  Search,
  Calendar,
  MapPin,
  Users,
  ChevronRight,
  ShieldCheck,
  Medal,
  PlayCircle,
  CheckCircle2,
  Clock,
  Edit,
  Trash2,
  X,
  Filter,
  Flame,
  Award,
  Swords,
  ChevronDown,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { TurnuvaItem, TurnuvaMacItem, TurnuvaTakimItem } from '../../../types';
import { getStoredTurnuvalar, saveStoredTurnuvalar } from '../../../data/modullerData';

interface TurnuvaYonetimiViewProps {
  onToast?: (msg: string) => void;
}

export const TurnuvaYonetimiView: React.FC<TurnuvaYonetimiViewProps> = ({ onToast }) => {
  const [turnuvalar, setTurnuvalar] = useState<TurnuvaItem[]>(() => getStoredTurnuvalar());
  const [activeTurnuvaId, setActiveTurnuvaId] = useState<string>(() => turnuvalar[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'fikstur' | 'puan-durumu' | 'takimlar'>('fikstur');

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals
  const [showAddTurnuvaModal, setShowAddTurnuvaModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState<TurnuvaMacItem | null>(null);
  const [scoreHome, setScoreHome] = useState<number>(0);
  const [scoreAway, setScoreAway] = useState<number>(0);
  const [matchStatus, setMatchStatus] = useState<'Oynanacak' | 'Canlı' | 'Bitti'>('Bitti');
  const [matchMvp, setMatchMvp] = useState('');

  // New Tournament Form
  const [newTurnuva, setNewTurnuva] = useState<Partial<TurnuvaItem>>({
    name: '',
    organizerClub: 'DigiMondi',
    branch: 'Basketbol',
    ageCategory: 'U14 Erkek',
    season: '2025-2026',
    startDate: '',
    endDate: '',
    location: 'Merkez Spor Salonu',
    status: 'Devam Ediyor',
    format: 'Lig Usulü',
    teamsCount: 6,
    description: '',
  });

  const activeTurnuva = useMemo(() => {
    return turnuvalar.find((t) => t.id === activeTurnuvaId) || turnuvalar[0];
  }, [turnuvalar, activeTurnuvaId]);

  const showNotification = (msg: string) => {
    if (onToast) onToast(msg);
  };

  // Open Score Modal
  const handleOpenScoreModal = (mac: TurnuvaMacItem) => {
    setShowScoreModal(mac);
    setScoreHome(mac.homeScore ?? 0);
    setScoreAway(mac.awayScore ?? 0);
    setMatchStatus((mac.status as any) || 'Bitti');
    setMatchMvp(mac.mvp || '');
  };

  // Save Match Score & Recalculate Standings
  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showScoreModal || !activeTurnuva) return;

    const updatedTurnuvalar = turnuvalar.map((t) => {
      if (t.id === activeTurnuva.id) {
        const updatedMatches = t.matches.map((m) => {
          if (m.id === showScoreModal.id) {
            return {
              ...m,
              homeScore: scoreHome,
              awayScore: scoreAway,
              status: matchStatus,
              mvp: matchMvp.trim() || undefined,
            };
          }
          return m;
        });

        // Recalculate standings from finished matches
        const teamStats: Record<string, { played: number; won: number; drawn: number; lost: number; gf: number; ga: number; pts: number }> = {};
        t.teams.forEach((tm) => {
          teamStats[tm.name] = { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 };
        });

        updatedMatches.forEach((m) => {
          if (m.status === 'Bitti' && m.homeScore !== undefined && m.awayScore !== undefined) {
            if (teamStats[m.homeTeam] && teamStats[m.awayTeam]) {
              teamStats[m.homeTeam].played += 1;
              teamStats[m.awayTeam].played += 1;
              teamStats[m.homeTeam].gf += m.homeScore;
              teamStats[m.homeTeam].ga += m.awayScore;
              teamStats[m.awayTeam].gf += m.awayScore;
              teamStats[m.awayTeam].ga += m.homeScore;

              if (m.homeScore > m.awayScore) {
                teamStats[m.homeTeam].won += 1;
                teamStats[m.homeTeam].pts += 2; // Basketbol galibiyet 2
                teamStats[m.awayTeam].lost += 1;
                teamStats[m.awayTeam].pts += 1; // Basketbol mağlubiyet 1
              } else if (m.homeScore < m.awayScore) {
                teamStats[m.awayTeam].won += 1;
                teamStats[m.awayTeam].pts += 2;
                teamStats[m.homeTeam].lost += 1;
                teamStats[m.homeTeam].pts += 1;
              } else {
                teamStats[m.homeTeam].drawn += 1;
                teamStats[m.awayTeam].drawn += 1;
                teamStats[m.homeTeam].pts += 1;
                teamStats[m.awayTeam].pts += 1;
              }
            }
          }
        });

        const updatedTeams = t.teams
          .map((tm) => {
            const st = teamStats[tm.name];
            if (!st) return tm;
            return {
              ...tm,
              played: st.played,
              won: st.won,
              drawn: st.drawn,
              lost: st.lost,
              goalsFor: st.gf,
              goalsAgainst: st.ga,
              points: st.pts,
            };
          })
          .sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst));

        return {
          ...t,
          matches: updatedMatches,
          teams: updatedTeams,
        };
      }
      return t;
    });

    setTurnuvalar(updatedTurnuvalar);
    saveStoredTurnuvalar(updatedTurnuvalar);
    showNotification('Maç skoru ve puan durumu başarıyla güncellendi.');
    setShowScoreModal(null);
  };

  // Create New Tournament
  const handleCreateTurnuva = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTurnuva.name?.trim()) return;

    const newItem: TurnuvaItem = {
      id: `trn-${Date.now()}`,
      name: newTurnuva.name.trim(),
      organizerClub: newTurnuva.organizerClub || 'DigiMondi',
      branch: newTurnuva.branch || 'Basketbol',
      ageCategory: newTurnuva.ageCategory || 'U14 Erkek',
      season: newTurnuva.season || '2025-2026',
      startDate: newTurnuva.startDate || new Date().toLocaleDateString('tr-TR'),
      endDate: newTurnuva.endDate || new Date().toLocaleDateString('tr-TR'),
      location: newTurnuva.location || 'Merkez Spor Salonu',
      status: (newTurnuva.status as any) || 'Kayıt Açık',
      format: (newTurnuva.format as any) || 'Lig Usulü',
      teamsCount: 4,
      description: newTurnuva.description || '',
      bannerUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&auto=format&fit=crop&q=80',
      teams: [
        { id: `t1-${Date.now()}`, name: `${newTurnuva.organizerClub} A Takımı`, club: newTurnuva.organizerClub || 'DigiMondi', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
        { id: `t2-${Date.now()}`, name: 'Saraçgym Yıldızlar', club: 'Saraçgym', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
        { id: `t3-${Date.now()}`, name: 'aicosports Gelişim', club: 'aicosports', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
        { id: `t4-${Date.now()}`, name: 'Marmara GSK', club: 'Marmara', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
      ],
      matches: [
        { id: `m1-${Date.now()}`, turnuvaId: `trn-${Date.now()}`, round: '1. Hafta', date: '10.11.2024', time: '14:00', venue: 'Ana Salon', homeTeam: `${newTurnuva.organizerClub} A Takımı`, awayTeam: 'Saraçgym Yıldızlar', status: 'Oynanacak' },
        { id: `m2-${Date.now()}`, turnuvaId: `trn-${Date.now()}`, round: '1. Hafta', date: '10.11.2024', time: '16:00', venue: 'Ana Salon', homeTeam: 'aicosports Gelişim', awayTeam: 'Marmara GSK', status: 'Oynanacak' },
      ],
    };

    const updated = [newItem, ...turnuvalar];
    setTurnuvalar(updated);
    saveStoredTurnuvalar(updated);
    setActiveTurnuvaId(newItem.id);
    setShowAddTurnuvaModal(false);
    showNotification(`"${newItem.name}" başarıyla oluşturuldu.`);
  };

  return (
    <div className="min-h-full flex flex-col bg-slate-50/50 dark:bg-[#0b1320] text-slate-800 dark:text-slate-100 antialiased">
      {/* Header Bar */}
      <div className="bg-white dark:bg-[#111c2e] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                <span>Modüller</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-amber-600 dark:text-amber-400 font-bold">Turnuva &amp; Lig Yönetimi</span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-amber-500 fill-amber-400" />
                  Turnuva &amp; Lig Yönetimi
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  Fikstür &amp; Canlı Skor Portalı
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Kulüp içi ve kulüpler arası ligler, turnuva fikstürleri, puan tabloları ve maç skorlarını yönetin.
              </p>
            </div>

            <button
              onClick={() => setShowAddTurnuvaModal(true)}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Turnuva Başlat</span>
            </button>
          </div>

          {/* Tournament Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-4 scrollbar-none">
            {turnuvalar.map((trn) => {
              const isSelected = trn.id === activeTurnuva?.id;
              return (
                <button
                  key={trn.id}
                  onClick={() => setActiveTurnuvaId(trn.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Trophy className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-amber-500'}`} />
                  <span>{trn.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      isSelected
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {trn.status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Tournament Details */}
      {activeTurnuva && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col gap-5">
          {/* Active Tournament Hero Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-6 pointer-events-none">
              <Trophy className="w-64 h-64 text-white" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
                  <span>{activeTurnuva.organizerClub}</span>
                  <span>•</span>
                  <span>{activeTurnuva.branch}</span>
                  <span>•</span>
                  <span>{activeTurnuva.ageCategory}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{activeTurnuva.name}</h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
                  {activeTurnuva.description || 'Turnuva organizasyonu ve maç programı.'}
                </p>

                <div className="flex items-center gap-4 mt-4 text-xs text-slate-300 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{activeTurnuva.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{activeTurnuva.startDate} - {activeTurnuva.endDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>{activeTurnuva.teams.length} Takım Katılıyor</span>
                  </div>
                </div>
              </div>

              {/* Podium Leaders Preview */}
              {activeTurnuva.teams.length > 0 && (
                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-900 flex items-center justify-center font-black">
                    <Medal className="w-5 h-5 fill-slate-900 text-slate-900" />
                  </div>
                  <div>
                    <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Lider Takım</div>
                    <div className="text-sm font-black">{activeTurnuva.teams[0]?.name}</div>
                    <div className="text-[11px] text-slate-300">
                      {activeTurnuva.teams[0]?.points} Puan ({activeTurnuva.teams[0]?.won} Galibiyet)
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('fikstur')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'fikstur'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Fikstür &amp; Maçlar ({activeTurnuva.matches.length})
            </button>
            <button
              onClick={() => setActiveTab('puan-durumu')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'puan-durumu'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Puan Tablosu ({activeTurnuva.teams.length})
            </button>
            <button
              onClick={() => setActiveTab('takimlar')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'takimlar'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Katılan Takımlar
            </button>
          </div>

          {/* TAB 1: FİKSTÜR */}
          {activeTab === 'fikstur' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {activeTurnuva.matches.map((mac) => {
                  const isFinished = mac.status === 'Bitti';
                  const isLive = mac.status === 'Canlı';

                  return (
                    <div
                      key={mac.id}
                      className="bg-white dark:bg-[#111c2e] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-300 transition-all"
                    >
                      {/* Match Header */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-200">{mac.round}</span>
                          <span>•</span>
                          <span>{mac.venue}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {mac.date} {mac.time}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isFinished
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                                : isLive
                                ? 'bg-rose-500 text-white animate-pulse'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {mac.status}
                          </span>
                        </div>
                      </div>

                      {/* Teams & Score Row */}
                      <div className="grid grid-cols-3 items-center text-center py-2 bg-slate-50 dark:bg-[#162238] rounded-xl px-3 border border-slate-100 dark:border-slate-800">
                        {/* Home Team */}
                        <div className="text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                          {mac.homeTeam}
                        </div>

                        {/* Score */}
                        <div className="flex items-center justify-center gap-2">
                          {isFinished || isLive ? (
                            <div className="font-black text-lg text-blue-600 dark:text-blue-400">
                              {mac.homeScore} : {mac.awayScore}
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-slate-400">VS</span>
                          )}
                        </div>

                        {/* Away Team */}
                        <div className="text-right font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                          {mac.awayTeam}
                        </div>
                      </div>

                      {/* Match Footer & Quick Edit Button */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <div className="text-[11px] text-slate-500">
                          {mac.mvp ? `⭐ Maçın Oyuncusu: ${mac.mvp}` : 'Skor girilmedi'}
                        </div>
                        <button
                          onClick={() => handleOpenScoreModal(mac)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 hover:bg-blue-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Skor / Durum Gir</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PUAN DURUMU */}
          {activeTab === 'puan-durumu' && (
            <div className="bg-white dark:bg-[#111c2e] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-[#162238] border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
                      <th className="py-3 px-4 w-12 text-center">Sıra</th>
                      <th className="py-3 px-4">Takım</th>
                      <th className="py-3 px-3 text-center">O</th>
                      <th className="py-3 px-3 text-center">G</th>
                      <th className="py-3 px-3 text-center">B</th>
                      <th className="py-3 px-3 text-center">M</th>
                      <th className="py-3 px-3 text-center">A</th>
                      <th className="py-3 px-3 text-center">Y</th>
                      <th className="py-3 px-3 text-center">AV</th>
                      <th className="py-3 px-4 text-center font-black">PUAN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {activeTurnuva.teams.map((tm, index) => {
                      const av = tm.goalsFor - tm.goalsAgainst;
                      return (
                        <tr key={tm.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-4 text-center font-bold">
                            {index === 0 ? (
                              <span className="w-6 h-6 rounded-full bg-amber-500 text-white inline-flex items-center justify-center text-xs">
                                1
                              </span>
                            ) : index === 1 ? (
                              <span className="w-6 h-6 rounded-full bg-slate-400 text-white inline-flex items-center justify-center text-xs">
                                2
                              </span>
                            ) : index === 2 ? (
                              <span className="w-6 h-6 rounded-full bg-amber-700 text-white inline-flex items-center justify-center text-xs">
                                3
                              </span>
                            ) : (
                              index + 1
                            )}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                            <div>{tm.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal">Antrenör: {tm.coachName || 'Atanmadı'}</div>
                          </td>
                          <td className="py-3 px-3 text-center">{tm.played}</td>
                          <td className="py-3 px-3 text-center font-semibold text-emerald-600">{tm.won}</td>
                          <td className="py-3 px-3 text-center">{tm.drawn}</td>
                          <td className="py-3 px-3 text-center font-semibold text-rose-600">{tm.lost}</td>
                          <td className="py-3 px-3 text-center text-slate-500">{tm.goalsFor}</td>
                          <td className="py-3 px-3 text-center text-slate-500">{tm.goalsAgainst}</td>
                          <td className={`py-3 px-3 text-center font-semibold ${av >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {av > 0 ? `+${av}` : av}
                          </td>
                          <td className="py-3 px-4 text-center font-black text-sm text-blue-600 dark:text-blue-400">
                            {tm.points}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: TAKIMLAR */}
          {activeTab === 'takimlar' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeTurnuva.teams.map((tm) => (
                <div
                  key={tm.id}
                  className="bg-white dark:bg-[#111c2e] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black text-base">
                      {tm.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{tm.name}</h4>
                      <p className="text-xs text-slate-500">{tm.club}</p>
                      <p className="text-[11px] text-slate-400">Antrenör: {tm.coachName || 'Belirtilmedi'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-blue-600 dark:text-blue-400">{tm.points} P</span>
                    <div className="text-[10px] text-slate-400">{tm.played} Maç</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: Skor Gir */}
      {showScoreModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111c2e] w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-base text-slate-900 dark:text-white">Maç Skoru &amp; Sonucu</h3>
              <button onClick={() => setShowScoreModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveScore} className="space-y-4">
              {/* Score Input Row */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-[#162238] p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 truncate">
                    {showScoreModal.homeTeam}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={scoreHome}
                    onChange={(e) => setScoreHome(Number(e.target.value))}
                    className="w-full text-center font-black text-2xl py-2 bg-white dark:bg-[#0b1320] border border-slate-300 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 truncate text-right">
                    {showScoreModal.awayTeam}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={scoreAway}
                    onChange={(e) => setScoreAway(Number(e.target.value))}
                    className="w-full text-center font-black text-2xl py-2 bg-white dark:bg-[#0b1320] border border-slate-300 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              {/* Match Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Maç Durumu
                </label>
                <select
                  value={matchStatus}
                  onChange={(e) => setMatchStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0b1320] border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold"
                >
                  <option value="Bitti">✅ Bitti (Sonuçlandı)</option>
                  <option value="Canlı">🔴 Canlı Oynanıyor</option>
                  <option value="Oynanacak">⏳ Oynanacak</option>
                </select>
              </div>

              {/* MVP */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Maçın Oyuncusu (MVP)
                </label>
                <input
                  type="text"
                  value={matchMvp}
                  onChange={(e) => setMatchMvp(e.target.value)}
                  placeholder="Örn: Selman Utku"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#0b1320] border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowScoreModal(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Skoru Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Yeni Turnuva Oluştur */}
      {showAddTurnuvaModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111c2e] w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">Yeni Turnuva / Lig Başlat</h3>
              <button onClick={() => setShowAddTurnuvaModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTurnuva} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Turnuva Adı *</label>
                <input
                  type="text"
                  required
                  value={newTurnuva.name || ''}
                  onChange={(e) => setNewTurnuva({ ...newTurnuva, name: e.target.value })}
                  placeholder="Örn: 2026 Kış Kupası U14 Turnuvası"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0b1320] border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Organizatör Kulüp</label>
                  <input
                    type="text"
                    value={newTurnuva.organizerClub || ''}
                    onChange={(e) => setNewTurnuva({ ...newTurnuva, organizerClub: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0b1320] border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Branş &amp; Yaş Grubu</label>
                  <input
                    type="text"
                    value={newTurnuva.ageCategory || ''}
                    onChange={(e) => setNewTurnuva({ ...newTurnuva, ageCategory: e.target.value })}
                    placeholder="Basketbol U14 Erkek"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0b1320] border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Tesis / Salon</label>
                <input
                  type="text"
                  value={newTurnuva.location || ''}
                  onChange={(e) => setNewTurnuva({ ...newTurnuva, location: e.target.value })}
                  placeholder="Merkez Spor Kompleksi"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0b1320] border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTurnuvaModal(false)}
                  className="px-3 py-2 text-slate-500 font-bold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl"
                >
                  Turnuvayı Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
