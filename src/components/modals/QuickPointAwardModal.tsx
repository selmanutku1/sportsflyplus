import React, { useState } from 'react';
import {
  Zap,
  X,
  CheckCircle2,
  Trophy,
  Heart,
  TrendingUp,
  Clock,
  Users,
  ClipboardCheck,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { addSporPuanNotification } from '../../data/notifications';

export interface QuickPointSporcu {
  id: string;
  name: string;
  avatarUrl?: string;
  branch?: string;
  teamGroup?: string;
}

interface QuickPointAwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  sporcu: QuickPointSporcu | null;
  onSuccess?: (message: string) => void;
}

interface QuickPreset {
  id: string;
  title: string;
  category: 'Devam' | 'Davranış' | 'Gelişim' | 'Etkinlik';
  points: number;
  desc: string;
  icon: any;
  colorClass: string;
  borderClass: string;
  badgeClass: string;
}

const PRESETS: QuickPreset[] = [
  {
    id: 'pr-1',
    title: 'Haftalık Tam Devam',
    category: 'Devam',
    points: 25,
    desc: 'Antrenmana eksiksiz ve dakik katılım',
    icon: ClipboardCheck,
    colorClass: 'text-blue-600 bg-blue-50 dark:bg-blue-950/50',
    borderClass: 'border-blue-200 dark:border-blue-800',
    badgeClass: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
  },
  {
    id: 'pr-2',
    title: 'Fair-Play & Örnek Davranış',
    category: 'Davranış',
    points: 50,
    desc: 'Takım ruhu, saygı ve örnek sporcu tavrı',
    icon: Heart,
    colorClass: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50',
    borderClass: 'border-rose-200 dark:border-rose-800',
    badgeClass: 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300',
  },
  {
    id: 'pr-3',
    title: 'Gelişim & Üstün Efor',
    category: 'Gelişim',
    points: 40,
    desc: 'Antrenmanda yüksek çaba ve teknik ilerleme',
    icon: TrendingUp,
    colorClass: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50',
    borderClass: 'border-emerald-200 dark:border-emerald-800',
    badgeClass: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300',
  },
  {
    id: 'pr-4',
    title: 'Turnuva / Maç Temsili',
    category: 'Etkinlik',
    points: 60,
    desc: 'Kulüp organizasyonunda başarılı temsil',
    icon: Trophy,
    colorClass: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50',
    borderClass: 'border-amber-200 dark:border-amber-800',
    badgeClass: 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300',
  },
  {
    id: 'pr-5',
    title: 'Vaktinde Hazırlık & Disiplin',
    category: 'Devam',
    points: 15,
    desc: 'Saha düzeni ve vaktinde hazır bulunma',
    icon: Clock,
    colorClass: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50',
    borderClass: 'border-indigo-200 dark:border-indigo-800',
    badgeClass: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300',
  },
  {
    id: 'pr-6',
    title: 'Takım Çalışması & Destek',
    category: 'Davranış',
    points: 30,
    desc: 'Arkadaşlarına yardım etme ve pozitif enerji',
    icon: Users,
    colorClass: 'text-teal-600 bg-teal-50 dark:bg-teal-950/50',
    borderClass: 'border-teal-200 dark:border-teal-800',
    badgeClass: 'bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300',
  },
];

export const QuickPointAwardModal: React.FC<QuickPointAwardModalProps> = ({
  isOpen,
  onClose,
  sporcu,
  onSuccess,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('pr-2');
  const [customPoints, setCustomPoints] = useState<number | null>(null);
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !sporcu) return null;

  const selectedPreset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];
  const activePoints = customPoints !== null ? customPoints : selectedPreset.points;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!sporcu) return;

    setIsSubmitting(true);

    const ruleTitle = customPoints !== null 
      ? `Özel Antrenör Puanı (${selectedPreset.category})`
      : selectedPreset.title;

    // 1. Trigger push notification toast, sound, haptic and notification center
    addSporPuanNotification({
      sporcuId: sporcu.id,
      sporcuName: sporcu.name,
      ruleName: ruleTitle,
      points: activePoints,
      category: selectedPreset.category,
      note: note.trim() || undefined,
    });

    // 2. Persist to sportsfly_sporpuan_logs_new for athlete profile sync
    try {
      const savedLogs = localStorage.getItem('sportsfly_sporpuan_logs_new');
      const currentLogs = savedLogs ? JSON.parse(savedLogs) : [];
      const newEntry = {
        id: `sp-quick-${Date.now()}`,
        sporcuId: sporcu.id,
        sporcuName: sporcu.name,
        category: selectedPreset.category,
        ruleName: ruleTitle,
        points: activePoints,
        date: 'Bugün',
        source: 'Hızlı Puan (Koç)',
        note: note.trim() || undefined,
      };
      localStorage.setItem('sportsfly_sporpuan_logs_new', JSON.stringify([newEntry, ...currentLogs]));
    } catch (err) {}

    setTimeout(() => {
      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess(`${sporcu.name} için +${activePoints} SP tanımlandı ve veli/sporcuya anlık bildirim gönderildi!`);
      }
      onClose();
      setNote('');
      setCustomPoints(null);
    }, 200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#111c2e] w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl border-t sm:border border-slate-200 dark:border-slate-700 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag/Pull Indicator Handle */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mt-2.5 sm:hidden" />

        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-tight flex items-center gap-1.5">
                <span>Hızlı Puan Ver</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold">
                  SporPuan
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Antrenör Mobil Kısayolu • Tek Dokunuşla Puanla
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Athlete Info Card (Large Touch Highlight) */}
          <div className="p-3 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-slate-50 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-slate-900/40 rounded-xl border border-blue-100 dark:border-blue-900/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={
                  sporcu.avatarUrl ||
                  'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&auto=format&fit=crop&q=80'
                }
                alt={sporcu.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/40 shrink-0"
              />
              <div className="min-w-0">
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base truncate">
                  {sporcu.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap mt-0.5">
                  <span className="font-semibold text-blue-700 dark:text-blue-300">
                    {sporcu.branch || 'Basketbol'}
                  </span>
                  <span>•</span>
                  <span>{sporcu.teamGroup || 'Gelişim Takımı'}</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">
                Verilecek
              </span>
              <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">
                +{activePoints} SP
              </span>
            </div>
          </div>

          {/* Quick Preset Selector with Large Touch Areas (Min 44px) */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between mb-2">
              <span>Hızlı Kategori Seçimi (Dokun &amp; Seç):</span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                Önceden Onaylı Kriterler
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESETS.map((preset) => {
                const IconComponent = preset.icon;
                const isSelected = selectedPresetId === preset.id && customPoints === null;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedPresetId(preset.id);
                      setCustomPoints(null);
                    }}
                    className={`min-h-[56px] p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-2.5 cursor-pointer select-none active:scale-[0.98] ${
                      isSelected
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 ring-2 ring-amber-400/30 shadow-xs'
                        : 'bg-white dark:bg-[#162238] border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${preset.colorClass}`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                            {preset.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                          {preset.desc}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-end">
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded-md ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : preset.badgeClass
                        }`}
                      >
                        +{preset.points} SP
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Point Fast Quick-Chips (Touch friendly) */}
          <div className="pt-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Veya Özel Puan Belirle:
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              {[10, 20, 30, 50, 75, 100].map((pts) => (
                <button
                  key={pts}
                  type="button"
                  onClick={() => setCustomPoints(pts)}
                  className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none active:scale-95 ${
                    customPoints === pts
                      ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/40 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  +{pts} SP
                </button>
              ))}
              {customPoints !== null && (
                <button
                  type="button"
                  onClick={() => setCustomPoints(null)}
                  className="min-h-[42px] px-2.5 py-1 text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                >
                  Sıfırla
                </button>
              )}
            </div>
          </div>

          {/* Coach Note Input (Optional) */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>Antrenör Notu (İsteğe Bağlı)</span>
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Örn: Maç sonu rakibi tebrik etti, harika savunma gayreti..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#162238] border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-[#111c2e] text-slate-900 dark:text-slate-100 outline-hidden transition-all"
            />
          </div>
        </div>

        {/* Modal Footer - Extra Large Touch Target (Min 48px) for Mobile Coaches */}
        <div className="p-4 sm:px-6 bg-slate-50/80 dark:bg-[#162238]/60 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            İptal
          </button>

          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isSubmitting}
            className="min-h-[48px] flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>
              {isSubmitting ? 'Puan Kaydediliyor...' : `+${activePoints} SP Puanını Hemen Tanımla & Bildir`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
