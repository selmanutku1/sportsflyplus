import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Building2,
  Users,
  ShieldCheck,
  UserCheck,
  KeyRound,
  ArrowRight,
  Mail,
  Lock,
  FileText,
  Activity
} from 'lucide-react';
import { LEGAL_TEXTS } from '../data/legalTexts';

interface LoginViewProps {
  onLoginSuccess: (userRole?: string) => void;
}

// Visual theme options for the sports club ecosystem
type VisualTheme = 'original' | 'futbol' | 'yuzme' | 'coklu';

interface VisualCardData {
  runnerImg: string;
  runnerTitle: string;
  stretchingImg: string;
  stretchingTitle: string;
  sport1Img: string;
  sport1Title: string;
  sport2Img: string;
  sport2Title: string;
  tennisImg: string;
  tennisTitle: string;
  metricLabel: string;
  metricTrend: string;
  pendingCount: number;
  pendingNote: string;
  percent: number;
}

const THEME_DATA: Record<VisualTheme, VisualCardData> = {
  original: {
    runnerImg: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=600&q=80',
    runnerTitle: 'Kondisyon & Atletizm',
    stretchingImg: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    stretchingTitle: 'Kuvvet & Esneme',
    sport1Img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80',
    sport1Title: 'Basketbol Akademisi',
    sport2Img: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=600&q=80',
    sport2Title: 'Binicilik & Engel',
    tennisImg: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=600&q=80',
    tennisTitle: 'Tenis & Kort',
    metricLabel: 'Üyelik Başvuru Sayısı',
    metricTrend: '+34.8%',
    pendingCount: 52,
    pendingNote: 'Bu hafta onay bekleyen',
    percent: 72,
  },
  futbol: {
    runnerImg: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
    runnerTitle: 'Futbol & Altyapı',
    stretchingImg: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
    stretchingTitle: 'Taktik & Koordinasyon',
    sport1Img: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
    sport1Title: 'Lig & Maç Takvimi',
    sport2Img: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=600&q=80',
    sport2Title: 'Kaleci & Özel İdman',
    tennisImg: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=600&q=80',
    tennisTitle: 'Yetenek Taraması',
    metricLabel: 'Futbol Lisans Başvuruları',
    metricTrend: '+48.2%',
    pendingCount: 68,
    pendingNote: 'Yeni dönem seçmeleri',
    percent: 85,
  },
  yuzme: {
    runnerImg: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=600&q=80',
    runnerTitle: 'Yüzme & Kulvar',
    stretchingImg: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    stretchingTitle: 'Cimnastik & Denge',
    sport1Img: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=600&q=80',
    sport1Title: 'Voleybol Okulu',
    sport2Img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80',
    sport2Title: 'Kondisyon & Nefes',
    tennisImg: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=600&q=80',
    tennisTitle: 'Havuz Seansları',
    metricLabel: 'Kulvar & Grup Doluluk',
    metricTrend: '+27.5%',
    pendingCount: 44,
    pendingNote: 'Kayıt bekleyen sporcu',
    percent: 64,
  },
  coklu: {
    runnerImg: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
    runnerTitle: 'Çoklu Branş',
    stretchingImg: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    stretchingTitle: 'Salon & Tesis',
    sport1Img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80',
    sport1Title: 'Basketbol & Kort',
    sport2Img: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
    sport2Title: 'Saha Yönetimi',
    tennisImg: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=600&q=80',
    tennisTitle: 'Bireysel Dersler',
    metricLabel: 'Toplam Aktif Kayıt',
    metricTrend: '+41.6%',
    pendingCount: 89,
    pendingNote: 'Tüm branşlar toplamı',
    percent: 88,
  }
};

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('demo@sportsfly.com');
  const [password, setPassword] = useState('••••••••');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sports Visual Data Preset
  const visualTheme: VisualTheme = 'original';

  // Modals
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerRole, setRegisterRole] = useState<'kulup' | 'veli' | 'sporcu' | 'antrenor'>('kulup');
  const [selectedLegalDoc, setSelectedLegalDoc] = useState<'kvkk' | 'acik-riza' | null>(null);
  const [roleModalInfo, setRoleModalInfo] = useState<{
    title: string;
    description: string;
    role: string;
    badge: string;
  } | null>(null);

  // Handle Google Login
  const handleGoogleLogin = () => {
    setIsLoading(true);
    setLoadingText('Google ile güvenli bağlantı kuruluyor...');
    setLoginError(null);

    setTimeout(() => {
      setLoadingText('SportsFly oturumu açılıyor...');
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess('Google Yöneticisi');
      }, 700);
    }, 900);
  };

  // Handle SportsFly Email/Standard Login
  const handleStandardLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!showEmailForm) {
      setShowEmailForm(true);
      return;
    }

    setIsLoading(true);
    setLoadingText('Giriş yapılıyor...');
    setLoginError(null);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess('Kulüp Yöneticisi');
    }, 800);
  };

  // Role Quick Select Handlers
  const handleRoleQuickSelect = (type: 'ebeveyn' | 'sporcu' | 'sube') => {
    if (type === 'ebeveyn') {
      setRoleModalInfo({
        title: 'Ebeveyn & Veli Giriş Portalı',
        description:
          'Sporcu velileri; antrenman takvimini, sporcu devamsızlık durumunu, aidat ve ödeme planlarını mobil ve web üzerinden takip edebilir.',
        role: 'Veli / Ebeveyn',
        badge: 'Veli Girişi'
      });
    } else if (type === 'sporcu') {
      setRoleModalInfo({
        title: 'Sporcu Giriş Portalı',
        description:
          'Sporcular; kişisel antrenman programları, performans sporpuanları, antrenör değerlendirmeleri ve katılım QR kodlarını görüntüleyebilir.',
        role: 'Sporcu',
        badge: 'Sporcu Girişi'
      });
    } else {
      setRoleModalInfo({
        title: 'Şube / Tesis Giriş Portalı',
        description:
          'Kulüp şubeleri, salon ve kort sorumluları; anlık yoklama, saha rezervasyonları ve tesis içi giriş kontrollerini yönetebilir.',
        role: 'Şube Yöneticisi',
        badge: 'Şube Girişi'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#eceff3] flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans text-slate-800">
      {/* Centered Main Card Container (Matching screenshot) */}
      <div className="bg-white rounded-[26px] sm:rounded-[32px] shadow-2xl shadow-slate-300/70 border border-slate-100 max-w-5xl w-full overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px] relative">
        {/* LEFT SIDE: Visual Collage with sports photos & app widgets */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-gradient-to-br from-[#1647b8] via-[#153fa8] to-[#0c2973] overflow-hidden p-6 flex-col justify-between items-center select-none">
          {/* Subtle ambient light accents */}
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-sky-400/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Live Badge */}
          <div className="w-full relative z-20 flex items-center justify-start">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block -ml-3" />
              <span>24 Şube &bull; 1.480+ Aktif Sporcu</span>
            </div>
          </div>

          {/* Tilted Collage Stage (Matching Screenshot layout) */}
          <div className="w-[115%] rotate-[-4.5deg] scale-[0.97] space-y-3 relative z-10 transition-transform duration-700 hover:scale-[1.01] my-auto">
            {/* Top Row: Runner + Workout */}
            <div className="grid grid-cols-2 gap-3">
              {/* Card 1: Runner with smartphone armband */}
              <div className="bg-white/10 backdrop-blur-xs p-1 rounded-2xl border border-white/20 shadow-md shadow-blue-950/20 overflow-hidden group">
                <div className="relative h-28 rounded-xl overflow-hidden">
                  <img
                    src={THEME_DATA[visualTheme].runnerImg}
                    alt={THEME_DATA[visualTheme].runnerTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-blue-700/20 mix-blend-multiply" />
                  <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold text-white bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                    <Activity className="w-2.5 h-2.5 text-sky-400" />
                    {THEME_DATA[visualTheme].runnerTitle}
                  </span>
                </div>
              </div>

              {/* Card 2: Stretching Workout with water bottle */}
              <div className="bg-white/10 backdrop-blur-xs p-1 rounded-2xl border border-white/20 shadow-md shadow-blue-950/20 overflow-hidden group">
                <div className="relative h-28 rounded-xl overflow-hidden">
                  <img
                    src={THEME_DATA[visualTheme].stretchingImg}
                    alt={THEME_DATA[visualTheme].stretchingTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-blue-700/20 mix-blend-multiply" />
                  <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold text-white bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {THEME_DATA[visualTheme].stretchingTitle}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Row: Sport 1 + Sport 2 */}
            <div className="grid grid-cols-2 gap-3">
              {/* Card 3: Sport 1 */}
              <div className="bg-white/10 backdrop-blur-xs p-1 rounded-2xl border border-white/20 shadow-md shadow-blue-950/20 overflow-hidden group">
                <div className="relative h-28 rounded-xl overflow-hidden">
                  <img
                    src={THEME_DATA[visualTheme].sport1Img}
                    alt={THEME_DATA[visualTheme].sport1Title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-blue-700/25 mix-blend-multiply" />
                  <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold text-white bg-blue-950/70 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {THEME_DATA[visualTheme].sport1Title}
                  </span>
                </div>
              </div>

              {/* Card 4: Sport 2 */}
              <div className="bg-white/10 backdrop-blur-xs p-1 rounded-2xl border border-white/20 shadow-md shadow-blue-950/20 overflow-hidden group">
                <div className="relative h-28 rounded-xl overflow-hidden">
                  <img
                    src={THEME_DATA[visualTheme].sport2Img}
                    alt={THEME_DATA[visualTheme].sport2Title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-blue-700/20 mix-blend-multiply" />
                  <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold text-white bg-blue-950/70 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {THEME_DATA[visualTheme].sport2Title}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Dashboard UI Card: Multi-wave Area Chart (Matching "Üyelik Başvuru Sayısı") */}
            <div className="bg-white rounded-2xl p-3 shadow-lg shadow-blue-950/30 border border-white/40">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-[11px] font-bold text-slate-800">
                    {THEME_DATA[visualTheme].metricLabel}
                  </p>
                  <p className="text-[9px] text-slate-400">Son 30 günlük trend analizi</p>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {THEME_DATA[visualTheme].metricTrend}
                </span>
              </div>

              {/* Vibrant Wave Curve SVG chart */}
              <div className="h-16 w-full">
                <svg viewBox="0 0 300 80" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chartCoral" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fb7185" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#fb7185" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="chartYellow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#facc15" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#facc15" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="chartCyan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="chartPurple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Wave 1: Coral */}
                  <path
                    d="M 0 70 C 40 60, 60 20, 100 45 C 140 70, 180 15, 230 35 C 270 50, 290 20, 300 25 L 300 80 L 0 80 Z"
                    fill="url(#chartCoral)"
                  />
                  {/* Wave 2: Cyan */}
                  <path
                    d="M 0 75 C 50 65, 90 35, 140 50 C 190 65, 220 25, 260 40 C 280 50, 295 30, 300 35 L 300 80 L 0 80 Z"
                    fill="url(#chartCyan)"
                  />
                  {/* Wave 3: Yellow */}
                  <path
                    d="M 0 80 C 60 70, 120 45, 170 55 C 220 65, 250 35, 280 45 L 300 50 L 300 80 L 0 80 Z"
                    fill="url(#chartYellow)"
                  />
                  {/* Lines on top */}
                  <path
                    d="M 0 70 C 40 60, 60 20, 100 45 C 140 70, 180 15, 230 35 C 270 50, 290 20, 300 25"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2"
                  />
                  <path
                    d="M 0 75 C 50 65, 90 35, 140 50 C 190 65, 220 25, 260 40 C 280 50, 295 30, 300 35"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            {/* Bottom Row: Gauge card "52" + Action Sport Player */}
            <div className="grid grid-cols-2 gap-3">
              {/* Circular Gauge */}
              <div className="bg-white rounded-2xl p-3 shadow-lg shadow-blue-950/30 border border-white/40 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-500">Üyelik Başvuruları</p>
                  <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                    {THEME_DATA[visualTheme].pendingCount}
                  </p>
                  <span className="text-[9px] text-blue-600 font-semibold">
                    {THEME_DATA[visualTheme].pendingNote}
                  </span>
                </div>
                {/* Circular ring */}
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="24" cy="24" r="18" stroke="#e2e8f0" strokeWidth="4" fill="transparent" />
                    <circle
                      cx="24"
                      cy="24"
                      r="18"
                      stroke="#2563eb"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray="113"
                      strokeDashoffset={113 - (113 * THEME_DATA[visualTheme].percent) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-bold text-blue-600">
                    %{THEME_DATA[visualTheme].percent}
                  </span>
                </div>
              </div>

              {/* Action Sport Player (Tennis / Match) */}
              <div className="bg-white/10 backdrop-blur-xs p-1 rounded-2xl border border-white/20 shadow-md shadow-blue-950/20 overflow-hidden group">
                <div className="relative h-20 rounded-xl overflow-hidden">
                  <img
                    src={THEME_DATA[visualTheme].tennisImg}
                    alt={THEME_DATA[visualTheme].tennisTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-blue-700/20 mix-blend-multiply" />
                  <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold text-white bg-blue-950/70 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {THEME_DATA[visualTheme].tennisTitle}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Deep Blue Overlay gradient for cohesive atmospheric tint */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c2973]/70 via-transparent to-[#1647b8]/20 pointer-events-none" />

          {/* Bottom Ecosystem Note */}
          <div className="w-full relative z-20 text-center pt-2">
            <span className="text-[10px] font-medium text-blue-200/80">
              SportsFly &bull; Spor Okulu, Akademi ve Tesis Yönetim Sistemi
            </span>
          </div>
        </div>

        {/* RIGHT SIDE: Authentication Form (Matching screenshot pixel-perfectly) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col items-center justify-center text-center">
          <div className="w-full max-w-[370px] mx-auto flex flex-col items-center">
            {/* 1. SportsFly Logo (Exact vector mark) */}
            <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] mb-3 relative flex items-center justify-center">
              <img
                src="/sportsfly-logo.svg"
                alt="SportsFly Logo"
                className="w-full h-full object-contain drop-shadow-xs"
              />
            </div>

            {/* Mobile-only Sports Badge Strip */}
            <div className="lg:hidden flex items-center justify-center gap-1.5 mb-3 flex-wrap">
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                🏀 Basketbol
              </span>
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                ⚽ Futbol
              </span>
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                🎾 Tenis
              </span>
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                🏊 Yüzme
              </span>
            </div>

            {/* 2. Welcome Title */}
            <h1 className="text-xl sm:text-[25px] font-bold text-[#111827] tracking-tight mb-6 sm:mb-7">
              SportsFly'a Hoşgeldiniz
            </h1>

            {/* Loading Indicator if active */}
            {isLoading && (
              <div className="w-full mb-4 py-3 px-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs flex items-center justify-center gap-2 animate-pulse">
                <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="font-semibold">{loadingText}</span>
              </div>
            )}

            {/* Error message */}
            {loginError && (
              <div className="w-full mb-4 py-2.5 px-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{loginError}</span>
              </div>
            )}

            {/* 3. Button 1: GOOGLE İLE GİRİŞ YAP (Pill, white bg, blue border) */}
            <button
              id="btn-google-login"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-6 rounded-full border border-[#2563eb] bg-white text-[#2563eb] hover:bg-blue-50/60 active:scale-[0.99] font-bold text-xs sm:text-[13px] tracking-wide transition-all shadow-2xs cursor-pointer mb-3 disabled:opacity-50"
            >
              {/* Google 4-color G SVG Icon */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>GOOGLE İLE GİRİŞ YAP</span>
            </button>

            {/* Optional Email & Password Form (Expandable) */}
            {showEmailForm && (
              <form onSubmit={handleStandardLogin} className="w-full space-y-2.5 mb-3 animate-in fade-in slide-in-from-top-2">
                <div className="relative text-left">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-posta Adresi"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="relative text-left">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifre"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </form>
            )}

            {/* 4. Button 2: GİRİŞ YAP (Pill, white bg, blue border, with SportsFly mini icon) */}
            <button
              id="btn-sportsfly-login"
              onClick={() => handleStandardLogin()}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-6 rounded-full border border-[#2563eb] bg-white text-[#2563eb] hover:bg-blue-50/60 active:scale-[0.99] font-bold text-xs sm:text-[13px] tracking-wide transition-all shadow-2xs cursor-pointer mb-5 disabled:opacity-50"
            >
              <img src="/sportsfly-logo.svg" alt="" className="w-4 h-4 object-contain shrink-0" />
              <span>GİRİŞ YAP</span>
            </button>

            {/* 5. Divider: "ya da" */}
            <div className="w-full flex items-center gap-3 my-1.5 text-slate-400">
              <div className="h-[1px] bg-slate-200 flex-1" />
              <span className="text-xs text-slate-500 font-normal select-none">ya da</span>
              <div className="h-[1px] bg-slate-200 flex-1" />
            </div>

            {/* 6. "Kayıt Ol" Link */}
            <div className="my-2.5">
              <button
                id="btn-register-link"
                onClick={() => setShowRegisterModal(true)}
                className="text-xs sm:text-[13px] font-semibold text-[#2563eb] hover:text-blue-700 hover:underline cursor-pointer"
              >
                Kayıt Ol
              </button>
            </div>

            {/* 7. Role Links: Ebeveyn Girişi | Sporcu Girişi | Şube Girişi */}
            <div className="flex items-center justify-center gap-2 text-xs sm:text-[13px] text-[#2563eb] my-2.5 flex-wrap">
              <button
                onClick={() => handleRoleQuickSelect('ebeveyn')}
                className="hover:underline cursor-pointer font-medium hover:text-blue-700 transition-colors"
              >
                Ebeveyn Girişi
              </button>
              <span className="text-slate-300 select-none">|</span>
              <button
                onClick={() => handleRoleQuickSelect('sporcu')}
                className="hover:underline cursor-pointer font-medium hover:text-blue-700 transition-colors"
              >
                Sporcu Girişi
              </button>
              <span className="text-slate-300 select-none">|</span>
              <button
                onClick={() => handleRoleQuickSelect('sube')}
                className="hover:underline cursor-pointer font-medium hover:text-blue-700 transition-colors"
              >
                Şube Girişi
              </button>
            </div>

            {/* 8. Footer Disclaimer (Terms & Privacy) */}
            <p className="text-[11px] sm:text-xs text-slate-700 mt-5 leading-relaxed text-center max-w-xs">
              Devam ederek{' '}
              <button
                onClick={() => setSelectedLegalDoc('kvkk')}
                className="text-[#2563eb] hover:underline font-medium cursor-pointer"
              >
                Kullanım Koşulları
              </button>{' '}
              ve{' '}
              <button
                onClick={() => setSelectedLegalDoc('acik-riza')}
                className="text-[#2563eb] hover:underline font-medium cursor-pointer"
              >
                Gizlilik Politikası
              </button>
              'nı kabul etmiş olursunuz.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL 1: Role Quick Login Modal (Ebeveyn / Sporcu / Şube) */}
      {roleModalInfo && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                {roleModalInfo.badge}
              </span>
              <button
                onClick={() => setRoleModalInfo(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">{roleModalInfo.title}</h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">{roleModalInfo.description}</p>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Hedef Rol:</span>
                <span className="font-bold text-slate-900">{roleModalInfo.role}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Doğrulama:</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> SMS / TC Kimlik ile Doğrulama
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setRoleModalInfo(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Vazgeç
              </button>
              <button
                onClick={() => {
                  setRoleModalInfo(null);
                  onLoginSuccess(roleModalInfo.role);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{roleModalInfo.role} Olarak Devam Et</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Register (Kayıt Ol) Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">SportsFly'a Kayıt Ol</h3>
                  <p className="text-[11px] text-slate-500">Spor kulübünüzü veya profilinizi oluşturun</p>
                </div>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role selector tabs */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-semibold">
              <button
                onClick={() => setRegisterRole('kulup')}
                className={`py-1.5 rounded-lg transition-colors ${
                  registerRole === 'kulup' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Spor Okulu
              </button>
              <button
                onClick={() => setRegisterRole('antrenor')}
                className={`py-1.5 rounded-lg transition-colors ${
                  registerRole === 'antrenor' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Antrenör
              </button>
              <button
                onClick={() => setRegisterRole('veli')}
                className={`py-1.5 rounded-lg transition-colors ${
                  registerRole === 'veli' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Veli
              </button>
              <button
                onClick={() => setRegisterRole('sporcu')}
                className={`py-1.5 rounded-lg transition-colors ${
                  registerRole === 'sporcu' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Sporcu
              </button>
            </div>

            {/* Registration Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowRegisterModal(false);
                onLoginSuccess(
                  registerRole === 'kulup'
                    ? 'Yeni Spor Okulu Yöneticisi'
                    : registerRole === 'antrenor'
                    ? 'Antrenör'
                    : registerRole === 'veli'
                    ? 'Veli'
                    : 'Sporcu'
                );
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {registerRole === 'kulup' ? 'Spor Okulu / Kulüp Adı' : 'Ad Soyad'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={registerRole === 'kulup' ? 'Örn: Kadıköy Basketbol Akademisi' : 'Örn: Ahmet Yılmaz'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">E-posta</label>
                  <input
                    type="email"
                    required
                    placeholder="ornek@kulup.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Telefon</label>
                  <input
                    type="tel"
                    required
                    placeholder="0532 000 0000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Şifre Belirleyin</label>
                <input
                  type="password"
                  required
                  placeholder="En az 6 karakter"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <p className="text-[11px] text-slate-500 leading-snug">
                Kayıt oluşturarak sözleşme şartlarını ve KVKK aydınlatma metnini kabul etmiş olursunuz.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                >
                  Kaydı Tamamla &amp; Başla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Legal Texts (Kullanım Koşulları & Gizlilik Politikası) */}
      {selectedLegalDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {LEGAL_TEXTS[selectedLegalDoc]?.title || 'Yasal Bilgilendirme'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLegalDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto py-4 space-y-4 text-xs text-slate-600 leading-relaxed pr-1">
              <p className="font-medium text-slate-800 bg-blue-50 p-3 rounded-xl border border-blue-100">
                {LEGAL_TEXTS[selectedLegalDoc]?.summary ||
                  'Bu metin SportsFly ve Sporsepeti Bilişim Teknolojileri nezdindeki veri işleme ve platform kullanım şartlarını düzenler.'}
              </p>

              {LEGAL_TEXTS[selectedLegalDoc]?.sections.map((section, idx) => (
                <div key={idx} className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-sm">{section.heading}</h4>
                  <p>{section.content}</p>
                  {section.bulletPoints && (
                    <ul className="list-disc pl-5 space-y-1 text-slate-600">
                      {section.bulletPoints.map((bp, bIdx) => (
                        <li key={bIdx}>{bp}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedLegalDoc(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-xs"
              >
                Anladım &amp; Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
