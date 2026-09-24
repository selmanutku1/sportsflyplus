import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Building2,
  Users,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Mail,
  Lock,
  FileText,
  Activity,
  Globe,
  Phone,
  Eye,
  EyeOff,
  Check,
  Printer,
  Copy,
  Search,
  ExternalLink,
  HelpCircle,
  ChevronRight,
  LockKeyhole,
  FileCheck2
} from 'lucide-react';
import { LEGAL_TEXTS, LegalDoc } from '../data/legalTexts';
import { useLanguage } from '../i18n/LanguageContext';
import { getStoredUserProfile, saveStoredUserProfile } from '../data/userProfile';

interface LoginViewProps {
  onLoginSuccess: (userRole?: string) => void;
}

type LegalDocKey = 'kullanim-kosullari' | 'kvkk' | 'gizlilik' | 'acik-riza' | 'iletisim' | 'veli-onay';

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { t, language, setLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  // Login Mode: 'phone' or 'email'
  const [loginMode, setLoginMode] = useState<'phone' | 'email'>('phone');

  // Inputs
  const [countryCode, setCountryCode] = useState('+90');
  const [phone, setPhone] = useState('532 123 45 67');
  const [email, setEmail] = useState('demo@sportsfly.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);

  // Checkboxes
  const [rememberMe, setRememberMe] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Modals
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerRole, setRegisterRole] = useState<'kulup' | 'veli' | 'sporcu' | 'antrenor'>('kulup');
  const [activeLegalModal, setActiveLegalModal] = useState<LegalDocKey | null>(null);
  const [legalSearchQuery, setLegalSearchQuery] = useState('');
  const [copiedLegalText, setCopiedLegalText] = useState(false);

  const [roleModalInfo, setRoleModalInfo] = useState<{
    title: string;
    description: string;
    role: string;
    badge: string;
  } | null>(null);

  // Handle Google / Social Login
  const handleGoogleLogin = () => {
    setIsLoading(true);
    setLoadingText('Google ile güvenli bağlantı kuruluyor...');
    setLoginError(null);

    setTimeout(() => {
      setLoadingText('SportsFly oturumu açılıyor...');
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess('Google Kulüp Yöneticisi');
      }, 600);
    }, 800);
  };

  // Handle Standard Login
  const handleStandardLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setIsLoading(true);
    setLoadingText('Giriş yapılıyor...');
    setLoginError(null);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess('Kulüp Yöneticisi');
    }, 700);
  };

  // Role Quick Select Handlers
  const handleRoleQuickSelect = (type: 'ebeveyn' | 'sporcu' | 'sube' | 'yonetici') => {
    let roleName = 'Kulüp Yöneticisi';
    let defaultPage = 'on-kayit';
    let title = 'Kulüp Yöneticisi';

    if (type === 'ebeveyn') {
      roleName = 'Veli / Ebeveyn';
      defaultPage = 'sporcu-karnesi';
      title = 'Sporcu Velisi';
    } else if (type === 'sporcu') {
      roleName = 'Sporcu';
      defaultPage = 'sporsepeti-user';
      title = 'Akademi Sporcusu';
    } else if (type === 'sube') {
      roleName = 'Kulüp Yöneticisi';
      defaultPage = 'sube-ozet';
      title = 'Kulüp & Tesis Yöneticisi';
    } else {
      roleName = 'Kulüp Yöneticisi';
      defaultPage = 'on-kayit';
      title = 'SportsFly Kulüp Yöneticisi';
    }

    try {
      const currentProf = getStoredUserProfile();
      saveStoredUserProfile({
        ...currentProf,
        role: roleName,
        title: title,
        preferences: {
          ...currentProf.preferences,
          defaultPage: defaultPage,
        },
      });
    } catch (e) {}

    setIsLoading(true);
    setLoadingText(`${roleName} portalına bağlanıyor...`);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(roleName);
    }, 600);
  };

  // Copy legal text to clipboard
  const handleCopyLegal = () => {
    if (!activeLegalModal) return;
    const doc = LEGAL_TEXTS[activeLegalModal];
    if (!doc) return;

    const fullText = `${doc.title}\n${doc.subtitle}\n\nÖzet:\n${doc.summary}\n\n` +
      doc.sections.map(s => `${s.heading}\n${s.content}\n${s.bulletPoints ? s.bulletPoints.join('\n') : ''}`).join('\n\n') +
      `\n\nKurum: ${doc.companyInfo.unvan}\nAdres: ${doc.companyInfo.adres}\nİletişim: ${doc.companyInfo.telefon} - ${doc.companyInfo.eposta}`;

    navigator.clipboard.writeText(fullText);
    setCopiedLegalText(true);
    setTimeout(() => setCopiedLegalText(false), 2000);
  };

  // Active Legal Document Data
  const currentLegalDoc: LegalDoc | undefined = activeLegalModal ? LEGAL_TEXTS[activeLegalModal] : undefined;

  // Filter sections if searching
  const filteredLegalSections = currentLegalDoc?.sections.filter(sec => {
    if (!legalSearchQuery.trim()) return true;
    const q = legalSearchQuery.toLowerCase();
    return (
      sec.heading.toLowerCase().includes(q) ||
      sec.content.toLowerCase().includes(q) ||
      sec.bulletPoints?.some(bp => bp.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#f3f6fb] flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 font-sans text-slate-800 relative selection:bg-blue-100 selection:text-blue-900">
      
      {/* Soft Background Grid Accent */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(#1e40af 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top Header Controls: Language & Help */}
      <div className="w-full max-w-[460px] flex items-center justify-between mb-4 px-1 z-10">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span>SportsFly Bulut v2.4</span>
        </div>
      </div>

      {/* Centralized Corporate Logo & Identity Header */}
      <div className="relative z-10 flex flex-col items-center text-center mb-6 mt-2 animate-in fade-in slide-in-from-top-3 duration-300">
        <div className="w-24 h-24 sm:w-28 sm:h-28 mb-3.5 relative flex items-center justify-center p-3 rounded-2xl bg-white border border-slate-200/60 shadow-md">
          <img
            src="/sportsfly-logo.svg"
            alt="SportsFly Corporate Logo"
            className="w-full h-full object-contain"
          />
          {/* Subtle decoration element */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[10px] font-black shadow-xs">
            SF
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          SportsFly
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 max-w-[340px]">
          Spor Okulu, Akademi &amp; Tesis Yönetim Sistemi
        </p>
      </div>

      {/* Main Login Card - Crisp White Minimalist Card with Elegant Shadow */}
      <div className="relative z-10 w-full max-w-[460px] bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-200/60 mb-6">
        
        {/* 1. Header: Minimal Welcoming Header */}
        <div className="mb-6 text-left pb-4 border-b border-slate-100">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Kullanıcı Girişi</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Devam etmek için aşağıdaki adımları takip edin.
          </p>
        </div>

        {/* Loading overlay notification */}
        {isLoading && (
          <div className="w-full mb-4 py-3 px-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center justify-center gap-2.5 animate-pulse">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="font-bold">{loadingText}</span>
          </div>
        )}

        {/* Error notification */}
        {loginError && (
          <div className="w-full mb-4 py-2.5 px-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span className="font-medium">{loginError}</span>
          </div>
        )}

        {/* 2. Google Girişi (Clean White Button with Subtle Border & Brand Colors) */}
        <button
          type="button"
          id="btn-google-login"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm tracking-wide transition-all shadow-xs cursor-pointer mb-4 disabled:opacity-50 group"
        >
          {/* Official Google 4-Color Icon */}
          <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
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
          <span>Google ile Giriş Yap</span>
        </button>

        {/* Divider: "veya e-posta / telefon ile" */}
        <div className="w-full flex items-center gap-3 my-4">
          <div className="h-[1px] bg-slate-200 flex-1" />
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">veya</span>
          <div className="h-[1px] bg-slate-200 flex-1" />
        </div>

        {/* 3. Mode Selector Tabs: Telefon Numarası vs E-posta Adresi */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl mb-4 border border-slate-200/60">
          <button
            type="button"
            onClick={() => setLoginMode('phone')}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              loginMode === 'phone'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Telefon Numarası</span>
          </button>
          <button
            type="button"
            onClick={() => setLoginMode('email')}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              loginMode === 'email'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>E-posta Adresi</span>
          </button>
        </div>

        {/* 4. Form Fields */}
        <form onSubmit={handleStandardLogin} className="space-y-3.5 text-left">
          
          {/* Phone or Email Input */}
          {loginMode === 'phone' ? (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 ml-0.5">
                Telefon Numarası
              </label>
              <div className="flex gap-2">
                {/* Country Code Dropdown */}
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl px-2.5 py-2.5 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer font-bold transition-all shrink-0"
                >
                  <option value="+90">🇹🇷 +90</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+1">🇺🇸 +1</option>
                </select>

                {/* Phone Input */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4 text-blue-600" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="5XX XXX XX XX"
                    className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400 font-medium"
                    required
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 ml-0.5">
                E-posta Adresi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@sporokulu.com"
                  className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400 font-medium"
                  required
                />
              </div>
            </div>
          )}

          {/* Password Input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between ml-0.5">
              <label className="text-[11px] font-bold text-slate-700">Şifre</label>
              <button
                type="button"
                onClick={() => setLoginError('Şifre sıfırlama bağlantısı telefonunuza / e-postanıza gönderildi.')}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                Şifremi unuttum
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4 text-blue-600" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-xl pl-9 pr-10 py-2.5 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400 font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Checkboxes: Remember Me & Marketing Consent */}
          <div className="pt-1 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded border-slate-300 cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-700">Beni hatırla</span>
            </label>

            <label className="flex items-start gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-blue-600 rounded border-slate-300 cursor-pointer"
              />
              <span className="text-[11px] leading-snug text-slate-600">
                Kampanya, duyuru ve bilgilendirme SMS / e-postaları almak istiyorum.
              </span>
            </label>
          </div>

          {/* Legal Acceptance Direct Links */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 leading-normal">
            Giriş yaparak{' '}
            <button
              type="button"
              onClick={() => {
                setActiveLegalModal('kullanim-kosullari');
                setLegalSearchQuery('');
              }}
              className="text-blue-600 hover:underline font-bold cursor-pointer inline-flex items-center gap-0.5"
            >
              Kullanım Koşulları
            </button>
            ,{' '}
            <button
              type="button"
              onClick={() => {
                setActiveLegalModal('kvkk');
                setLegalSearchQuery('');
              }}
              className="text-blue-600 hover:underline font-bold cursor-pointer inline-flex items-center gap-0.5"
            >
              KVKK Aydınlatma Metni
            </button>{' '}
            ve{' '}
            <button
              type="button"
              onClick={() => {
                setActiveLegalModal('gizlilik');
                setLegalSearchQuery('');
              }}
              className="text-blue-600 hover:underline font-bold cursor-pointer inline-flex items-center gap-0.5"
            >
              Gizlilik Politikası
            </button>
            'nı kabul etmiş olursunuz.
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm tracking-wide transition-all shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>Giriş Yap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 5. Register Link & Quick Demo Roles */}
        <div className="mt-5 pt-4 border-t border-slate-200 text-center space-y-3">
          <p className="text-xs text-slate-600 font-medium">
            Hesabınız yok mu?{' '}
            <button
              type="button"
              onClick={() => setShowRegisterModal(true)}
              className="text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer"
            >
              Hemen Kayıt Olun
            </button>
          </p>

          {/* Quick Demo Switcher */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap pt-0.5 text-[11px]">
            <span className="text-slate-400 font-semibold mr-1">Hızlı Demo:</span>
            <button
              type="button"
              onClick={() => handleRoleQuickSelect('yonetici')}
              className="px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold transition-colors cursor-pointer"
            >
              Admin / Kurucu
            </button>
            <button
              type="button"
              onClick={() => handleRoleQuickSelect('ebeveyn')}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 font-semibold transition-colors cursor-pointer"
            >
              Veli Portalı
            </button>
            <button
              type="button"
              onClick={() => handleRoleQuickSelect('sporcu')}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 font-semibold transition-colors cursor-pointer"
            >
              Sporcu Portalı
            </button>
            <button
              type="button"
              onClick={() => handleRoleQuickSelect('sube')}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 font-semibold transition-colors cursor-pointer"
            >
              Kulüp Yöneticisi
            </button>
          </div>
        </div>

      </div>

      {/* Legal Bar Footer - Quick access pills to all 4 policies */}
      <div className="w-full max-w-xl mt-5 flex items-center justify-center gap-2 flex-wrap text-center z-10">
        <span className="text-[11px] text-slate-400 font-medium">Yasal Belgeler:</span>
        <button
          type="button"
          onClick={() => {
            setActiveLegalModal('kullanim-kosullari');
            setLegalSearchQuery('');
          }}
          className="text-[11px] font-semibold text-slate-600 hover:text-blue-600 bg-white/70 hover:bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          Kullanım Koşulları
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveLegalModal('kvkk');
            setLegalSearchQuery('');
          }}
          className="text-[11px] font-semibold text-slate-600 hover:text-blue-600 bg-white/70 hover:bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          KVKK Aydınlatma Metni
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveLegalModal('gizlilik');
            setLegalSearchQuery('');
          }}
          className="text-[11px] font-semibold text-slate-600 hover:text-blue-600 bg-white/70 hover:bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          Gizlilik &amp; Çerezler
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveLegalModal('acik-riza');
            setLegalSearchQuery('');
          }}
          className="text-[11px] font-semibold text-slate-600 hover:text-blue-600 bg-white/70 hover:bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
        >
          Açık Rıza Metni
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: Comprehensive Legal Policy Modal (Tabs, Search, Print, Copy)      */}
      {/* ========================================================================= */}
      {activeLegalModal && currentLegalDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 overflow-hidden text-slate-800">
            
            {/* Modal Top Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                      {currentLegalDoc.title}
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {currentLegalDoc.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{currentLegalDoc.subtitle}</p>
                </div>
              </div>

              {/* Close Icon Button */}
              <button
                onClick={() => setActiveLegalModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Navigation Tabs Bar */}
            <div className="px-4 pt-3 pb-2 border-b border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setActiveLegalModal('kullanim-kosullari');
                  setLegalSearchQuery('');
                }}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  activeLegalModal === 'kullanim-kosullari'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                📜 Kullanım Koşulları
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveLegalModal('kvkk');
                  setLegalSearchQuery('');
                }}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  activeLegalModal === 'kvkk'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                🛡️ KVKK Metni
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveLegalModal('gizlilik');
                  setLegalSearchQuery('');
                }}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  activeLegalModal === 'gizlilik'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                🔒 Gizlilik &amp; Çerez
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveLegalModal('acik-riza');
                  setLegalSearchQuery('');
                }}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  activeLegalModal === 'acik-riza'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                ✍️ Açık Rıza
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveLegalModal('iletisim');
                  setLegalSearchQuery('');
                }}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  activeLegalModal === 'iletisim'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                📞 İletişim İzni
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveLegalModal('veli-onay');
                  setLegalSearchQuery('');
                }}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  activeLegalModal === 'veli-onay'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                👨‍👩‍👦 Veli İzin Beyanı
              </button>
            </div>

            {/* Document Action Bar: Search, Copy, Print */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 text-xs">
              {/* Search in text */}
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={legalSearchQuery}
                  onChange={(e) => setLegalSearchQuery(e.target.value)}
                  placeholder="Metin içinde ara..."
                  className="w-full pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopyLegal}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer transition-colors"
                >
                  {copiedLegalText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Kopyala</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Yazdır</span>
                </button>
              </div>
            </div>

            {/* Document Body Content */}
            <div className="overflow-y-auto p-4 sm:p-6 space-y-5 text-xs text-slate-700 leading-relaxed max-h-[55vh]">
              {/* Summary Box */}
              <div className="bg-blue-50/70 border border-blue-200/80 p-3.5 rounded-xl text-blue-950 font-medium leading-relaxed">
                <span className="font-bold block mb-1 text-blue-900">📌 Yönetici &amp; Kullanıcı Özeti:</span>
                {currentLegalDoc.summary}
              </div>

              {/* Sections List */}
              {filteredLegalSections && filteredLegalSections.length > 0 ? (
                filteredLegalSections.map((section, idx) => (
                  <div key={idx} className="space-y-1.5 pb-3 border-b border-slate-100 last:border-0">
                    <h4 className="font-bold text-slate-900 text-sm">{section.heading}</h4>
                    <p className="text-slate-700">{section.content}</p>
                    {section.bulletPoints && (
                      <ul className="list-disc pl-5 space-y-1 text-slate-600 mt-1.5">
                        {section.bulletPoints.map((bp, bIdx) => (
                          <li key={bIdx}>{bp}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400">
                  <p>Arama kriterinize uygun madde bulunamadı.</p>
                </div>
              )}

              {/* Official Legal Footer Details */}
              <div className="bg-slate-100 p-3.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>{currentLegalDoc.companyInfo.unvan}</span>
                  <span className="text-blue-700">Son Güncelleme: {currentLegalDoc.lastUpdated}</span>
                </div>
                <p>📍 {currentLegalDoc.companyInfo.adres}</p>
                {currentLegalDoc.companyInfo.mersis && (
                  <p>🏢 MERSİS No: {currentLegalDoc.companyInfo.mersis} &bull; {currentLegalDoc.companyInfo.vergiNo}</p>
                )}
                <p>📞 İletişim: {currentLegalDoc.companyInfo.telefon} &bull; ✉️ {currentLegalDoc.companyInfo.eposta}</p>
              </div>
            </div>

            {/* Modal Bottom Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-Bit SSL &amp; KVKK Uyumlu Güvenli Sistem</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveLegalModal(null)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Okudum &amp; Kabul Ediyorum
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Role Quick Select Demo Modal                                     */}
      {/* ========================================================================= */}
      {roleModalInfo && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 text-slate-800">
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
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> SMS / TC Kimlik Doğrulama
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
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{roleModalInfo.role} Olarak Giriş Yap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: Registration Modal (Spor Okulu, Antrenör, Veli, Sporcu)           */}
      {/* ========================================================================= */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 text-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">SportsFly'a Kayıt Ol</h3>
                  <p className="text-[11px] text-slate-500">Spor kulübünüzü veya profilinizi hemen oluşturun</p>
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
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl mb-4 text-xs font-bold">
              <button
                onClick={() => setRegisterRole('kulup')}
                className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                  registerRole === 'kulup' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Spor Okulu
              </button>
              <button
                onClick={() => setRegisterRole('antrenor')}
                className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                  registerRole === 'antrenor' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Antrenör
              </button>
              <button
                onClick={() => setRegisterRole('veli')}
                className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                  registerRole === 'veli' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Veli
              </button>
              <button
                onClick={() => setRegisterRole('sporcu')}
                className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                  registerRole === 'sporcu' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
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
              className="space-y-3 text-xs text-left"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {registerRole === 'kulup' ? 'Spor Okulu / Kulüp Adı' : 'Ad Soyad'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={registerRole === 'kulup' ? 'Örn: Kadıköy Basketbol Akademisi' : 'Örn: Ahmet Yılmaz'}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">E-posta</label>
                  <input
                    type="email"
                    required
                    placeholder="ornek@kulup.com"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telefon</label>
                  <input
                    type="tel"
                    required
                    placeholder="0532 000 0000"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Şifre Belirleyin</label>
                <input
                  type="password"
                  required
                  placeholder="En az 6 karakter"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>

              <p className="text-[11px] text-slate-500 leading-snug">
                Kayıt oluşturarak{' '}
                <button
                  type="button"
                  onClick={() => setActiveLegalModal('kullanim-kosullari')}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Kullanım Koşulları
                </button>{' '}
                ve{' '}
                <button
                  type="button"
                  onClick={() => setActiveLegalModal('kvkk')}
                  className="text-blue-600 font-bold hover:underline"
                >
                  KVKK Aydınlatma Metni
                </button>
                'ni kabul etmiş olursunuz.
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
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold shadow-md hover:bg-blue-700 cursor-pointer"
                >
                  Kaydı Tamamla &amp; Başla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
