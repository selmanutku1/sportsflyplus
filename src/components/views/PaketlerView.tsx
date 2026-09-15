import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Check,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Building2,
  X,
  Edit3,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Settings,
  Phone,
  ArrowRight,
  Lock,
  ShieldAlert,
  Shield,
  UserCheck,
} from 'lucide-react';
import {
  UserProfileData,
  getStoredUserProfile,
  saveStoredUserProfile,
} from '../../data/userProfile';

export interface PlanFeature {
  id: string;
  text: string;
  subtext?: string;
  tooltip?: string;
}

export interface PackagePlanItem {
  id: string;
  name: string;
  monthlyPrice: number; // 0 for free or custom
  isCustomQuote?: boolean;
  promoText?: string;
  highlightText?: string;
  features: PlanFeature[];
}

const DEFAULT_PACKAGES: PackagePlanItem[] = [
  {
    id: 'baslangic',
    name: 'Başlangıç',
    monthlyPrice: 0,
    promoText: '*Ayda sadece 449 TL + KDV karşılığında sporcu ve sms limitini kaldırabilirsiniz!',
    features: [
      { id: 'f1', text: 'Üye/Sporcu yönetimi', subtext: '(30 Sporcu/Üye Limiti)' },
      {
        id: 'f2',
        text: 'Yoklama Yönetimi',
        tooltip: 'Mobil uygulama ve QR kod ile seans bazlı anlık yoklama alabilme özelliği.',
      },
      { id: 'f3', text: 'Antrenman Takvimi yönetimi' },
    ],
  },
  {
    id: 'profesyonel',
    name: 'Profesyonel',
    monthlyPrice: 2299,
    highlightText: 'Başlangıç Paketindeki Herşey',
    features: [
      { id: 'f4', text: 'Sporcu/Üye Aidat ödeme takibi' },
      { id: 'f5', text: 'Eğitmen Yönetimi' },
      {
        id: 'f6',
        text: 'Ebeveyn Yönetimi',
        tooltip: 'Velilere özel portal üzerinden devamsızlık ve ödeme takibi bildirimi.',
      },
      { id: 'f7', text: 'Sms/Mail Gönderimi' },
      { id: 'f8', text: 'Şube Yönetimi' },
      { id: 'f9', text: 'Başvuru Yönetimi' },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    monthlyPrice: 3199,
    highlightText: 'Profesyonel Paketindeki Herşey',
    features: [
      { id: 'f10', text: 'Muhasebe Yönetimi (Gelir/Gider)' },
      { id: 'f11', text: 'Grup Yönetimi' },
      { id: 'f12', text: 'Üye Memnuniyet Anketleri' },
    ],
  },
  {
    id: 'kurumsal',
    name: 'Kurumsal',
    monthlyPrice: 0,
    isCustomQuote: true,
    features: [
      { id: 'f13', text: 'Sınırsız Üye/Sporcu Veri Yönetimi' },
      { id: 'f14', text: 'Kendi ismiyle Web Sitesi' },
      { id: 'f15', text: 'Sporcu/Üye sporpuan sistemi' },
      { id: 'f16', text: 'Spor Malzemeleri Envanter Yönetimi' },
      { id: 'f17', text: 'Spor Okulları/İşletmeleri şube yönetimi' },
    ],
  },
];

const STORAGE_KEY = 'sportsfly_packages_custom_v2';
const ACTIVE_PLAN_STORAGE_KEY = 'sportsfly_active_plan_v2';

export const PaketlerView: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'aylik' | 'yillik'>('aylik');
  const [packages, setPackages] = useState<PackagePlanItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (err) {
        console.error('Failed to load packages:', err);
      }
    }
    return DEFAULT_PACKAGES;
  });

  const [activePlan, setActivePlan] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(ACTIVE_PLAN_STORAGE_KEY);
        if (stored) return stored;
      } catch (e) {}
    }
    return 'Premium';
  });

  const [userProfile, setUserProfile] = useState<UserProfileData>(() => getStoredUserProfile());
  const [unauthorizedModalOpen, setUnauthorizedModalOpen] = useState(false);

  // Synchronize profile updates in real time
  useEffect(() => {
    const handleProfileUpdate = (e: any) => {
      if (e.detail) {
        setUserProfile(e.detail);
      }
    };
    window.addEventListener('sportsfly_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('sportsfly_profile_updated', handleProfileUpdate);
  }, []);

  const isSuperAdmin = Boolean(
    userProfile.role &&
    (userProfile.role.toLowerCase().includes('süper') ||
     userProfile.role.toLowerCase().includes('super'))
  );

  // Quick role toggle helper for testing permissions
  const toggleDemoRole = () => {
    const nextRole = isSuperAdmin ? 'Kulüp Yöneticisi' : 'Süper Admin';
    const updated = { ...userProfile, role: nextRole };
    setUserProfile(updated);
    saveStoredUserProfile(updated);
    triggerToast(
      `Mevcut Rol: "${nextRole}". ${
        nextRole === 'Süper Admin'
          ? 'Paket fiyat düzenleme yetkisi aktif edildi.'
          : 'Paket fiyat düzenleme yetkisi kilitlendi.'
      }`
    );
  };

  const handleUnauthorizedAttempt = () => {
    setUnauthorizedModalOpen(true);
  };

  const [selectedModalPlan, setSelectedModalPlan] = useState<PackagePlanItem | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Admin Edit Mode
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PackagePlanItem | null>(null);
  const [newFeatureText, setNewFeatureText] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Pricing calculations: 20% discount on annual billing
  const getPriceFormatted = (monthly: number) => {
    if (monthly === 0) return 'Ücretsiz';
    if (billingCycle === 'yillik') {
      const discounted = monthly * 0.8;
      return `${discounted.toLocaleString('tr-TR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} ₺`;
    }
    return `${monthly.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ₺`;
  };

  const handleSelectPlan = (plan: PackagePlanItem) => {
    if (plan.name === activePlan) return;
    if (plan.isCustomQuote) {
      setContactModalOpen(true);
    } else {
      setSelectedModalPlan(plan);
    }
  };

  const confirmUpgrade = () => {
    if (selectedModalPlan) {
      setActivePlan(selectedModalPlan.name);
      try {
        localStorage.setItem(ACTIVE_PLAN_STORAGE_KEY, selectedModalPlan.name);
      } catch (e) {}
      triggerToast(`Paketiniz başarıyla "${selectedModalPlan.name}" olarak güncellendi!`);
      setSelectedModalPlan(null);
    }
  };

  // Open Edit Modal for a plan - STRICTLY SUPER ADMIN ONLY
  const handleOpenEdit = (plan: PackagePlanItem) => {
    if (!isSuperAdmin) {
      handleUnauthorizedAttempt();
      return;
    }
    setEditingPlan(JSON.parse(JSON.stringify(plan)));
    setIsEditModalOpen(true);
  };

  const handleSavePlanChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      triggerToast('Yetkisiz işlem: Paket fiyat ve içeriklerini yalnızca Süper Admin değiştirebilir.');
      setIsEditModalOpen(false);
      return;
    }
    if (!editingPlan) return;

    const updated = packages.map((p) => (p.id === editingPlan.id ? editingPlan : p));
    setPackages(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
    setIsEditModalOpen(false);
    triggerToast(`"${editingPlan.name}" paketi fiyat ve içerikleri başarıyla kaydedildi.`);
  };

  const handleResetDefaults = () => {
    if (!isSuperAdmin) {
      triggerToast('Yetkisiz işlem: Fabrika ayarlarına sıfırlama yalnızca Süper Admin yetkisindedir.');
      return;
    }
    if (confirm('Tüm paketleri ve fiyatları fabrika ayarlarına sıfırlamak istediğinize emin misiniz?')) {
      setPackages(DEFAULT_PACKAGES);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      setIsEditModalOpen(false);
      triggerToast('Paketler varsayılan değerlere sıfırlandı.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP BAR: Heading & Billing Toggle & Admin Edit Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Paketler &amp; Fiyatlandırma
            </h1>
            <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Aktif Paket: {activePlan}</span>
            </span>

            {/* Role Permission Badge */}
            {isSuperAdmin ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold flex items-center gap-1.5 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Yetki: Süper Admin (Fiyat Düzenleme Açık)</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold flex items-center gap-1.5 shadow-2xs">
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>Yetki: {userProfile.role || 'Yönetici'} (Fiyat Düzenleme Kilitli)</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kulübünüzün üye kapasitesi, SMS limitleri ve muhasebe özelliklerini yönetin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Admin Edit Packages Button - STRICTLY SUPER ADMIN */}
          {isSuperAdmin ? (
            <button
              id="btn-admin-edit-packages"
              onClick={() => handleOpenEdit(packages[0])}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              title="Paket fiyat ve özelliklerini düzenle (Süper Admin)"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Paketleri &amp; Fiyatları Düzenle</span>
            </button>
          ) : (
            <button
              id="btn-admin-edit-packages-locked"
              onClick={handleUnauthorizedAttempt}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-300 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
              title="Fiyat düzenleme yetkisi sadece Süper Admin'dedir"
            >
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Fiyatları Düzenle</span>
              <span className="bg-amber-200/80 text-amber-900 text-[10px] px-1.5 py-0.5 rounded font-bold">
                Süper Admin Özel
              </span>
            </button>
          )}

          {/* Role Test Switcher */}
          <button
            onClick={toggleDemoRole}
            className="px-2.5 py-2 rounded-xl border border-dashed border-slate-300 hover:border-blue-400 bg-white text-[11px] font-medium text-slate-600 hover:text-blue-600 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Yetki test etmek için rolü değiştirin"
          >
            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Rol Test: <strong className="text-slate-800">{isSuperAdmin ? 'Süper Admin' : 'Kulüp Yön.'}</strong></span>
          </button>

          {/* Aylık / Yıllık Switcher */}
          <div className="flex items-center gap-2.5">
            <div className="inline-flex rounded-xl border border-blue-600 overflow-hidden text-xs font-bold shadow-2xs">
              <button
                id="billing-toggle-aylik"
                onClick={() => setBillingCycle('aylik')}
                className={`px-4 py-2 transition-colors cursor-pointer ${
                  billingCycle === 'aylik'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}
              >
                Aylık
              </button>
              <button
                id="billing-toggle-yillik"
                onClick={() => setBillingCycle('yillik')}
                className={`px-4 py-2 transition-colors cursor-pointer ${
                  billingCycle === 'yillik'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}
              >
                Yıllık
              </button>
            </div>

            <span className="text-xs text-slate-600 select-none hidden sm:inline">
              yıllık <strong className="text-rose-600 font-bold">%20 indirimli</strong>
            </span>
          </div>
        </div>
      </div>

      {/* QUICK INSTRUCTIONS GUIDE BANNER */}
      <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-slate-50 border border-blue-200/90 rounded-2xl p-4 text-xs text-blue-950 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs font-bold">
            i
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">
                Paket Değişikliği &amp; Yetki Yönetimi
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-[10px] font-bold text-blue-700">
                Yetki: Sadece Süper Admin
              </span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Kulübünüz için paket geçişlerini aşağıdaki butonlardan yapabilirsiniz. <strong>Paket fiyatları, SMS limitleri ve paket içeriğini değiştirme yetkisi ise yalnızca Süper Admin hesabına açıktır.</strong>
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          {isSuperAdmin ? (
            <button
              onClick={() => handleOpenEdit(packages.find((p) => p.name === activePlan) || packages[0])}
              className="px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-blue-700 font-bold text-[11px] hover:bg-blue-50 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Fiyat ve İçerik Düzenle</span>
            </button>
          ) : (
            <button
              onClick={handleUnauthorizedAttempt}
              className="px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-lg text-slate-500 font-medium text-[11px] hover:bg-slate-200/80 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Fiyat Düzenleme Kilitli</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 PRICING CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {packages.map((plan) => {
          const isActive = activePlan === plan.name;
          const isKurumsal = plan.isCustomQuote;

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl border flex flex-col justify-between overflow-hidden transition-all duration-150 relative ${
                isActive
                  ? 'border-2 border-blue-500 shadow-md ring-4 ring-blue-50/80'
                  : 'border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300'
              }`}
            >
              {/* Active Badge on top right */}
              {isActive && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Mevcut Paket</span>
                </div>
              )}

              <div className="p-6 text-center flex-1 flex flex-col">
                {/* Plan Title & Quick Edit Icon */}
                <div className="flex items-center justify-center gap-1.5 pb-3 border-b border-slate-100 relative">
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">
                    {plan.name}
                  </h3>
                  {isSuperAdmin ? (
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(plan)}
                      className="text-slate-400 hover:text-blue-600 transition-colors p-1 cursor-pointer"
                      title={`"${plan.name}" paketini düzenle (Süper Admin Yetkisi)`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleUnauthorizedAttempt}
                      className="text-slate-300 hover:text-amber-600 transition-colors p-1 cursor-pointer"
                      title="Fiyat ve içerik düzenleme sadece Süper Admin yetkisindedir"
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Price Display */}
                <div className="py-6 flex items-baseline justify-center gap-1 min-h-[88px]">
                  {isKurumsal ? (
                    <span className="text-2xl font-black text-slate-900 tracking-tight">
                      Özel Teklif
                    </span>
                  ) : plan.monthlyPrice === 0 ? (
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      Ücretsiz
                    </span>
                  ) : (
                    <>
                      <span className="text-3xl font-black text-slate-900 tracking-tight">
                        {getPriceFormatted(plan.monthlyPrice)}
                      </span>
                      <span className="text-xs font-normal text-slate-500">
                        / {billingCycle === 'aylik' ? 'aylık' : 'ay'}
                      </span>
                    </>
                  )}
                </div>

                {/* Promotional / Highlight Subtitle */}
                <div className="px-1 pb-4 min-h-[54px] flex items-center justify-center text-center">
                  {plan.promoText && (
                    <p className="text-[11px] font-bold text-rose-600 leading-snug">
                      {plan.promoText}
                    </p>
                  )}
                  {plan.highlightText && (
                    <span className="text-xs font-bold text-blue-600">
                      {plan.highlightText}
                    </span>
                  )}
                  {isKurumsal && (
                    <span className="text-[11px] text-slate-500 font-medium">
                      Büyük ölçekli kulüpler &amp; federasyonlar için
                    </span>
                  )}
                </div>

                {/* Features List */}
                <div className="divide-y divide-slate-100 border-t border-slate-100 text-xs text-slate-700 font-medium flex-1">
                  {plan.features.map((feat) => (
                    <div key={feat.id} className="py-3 px-2 flex items-center justify-center gap-1.5 relative">
                      <div className="text-center">
                        <span>{feat.text}</span>
                        {feat.subtext && (
                          <span className="text-slate-400 text-[11px] block">{feat.subtext}</span>
                        )}
                      </div>

                      {feat.tooltip && (
                        <div className="relative inline-flex items-center">
                          <button
                            type="button"
                            onMouseEnter={() => setShowTooltip(feat.id)}
                            onMouseLeave={() => setShowTooltip(null)}
                            onClick={() => setShowTooltip(showTooltip === feat.id ? null : feat.id)}
                            className="cursor-pointer text-slate-700 hover:text-black focus:outline-none"
                            aria-label="Özellik Bilgisi"
                          >
                            <span className="w-3.5 h-3.5 rounded-full bg-slate-800 text-white text-[9px] font-bold flex items-center justify-center">
                              ?
                            </span>
                          </button>
                          {showTooltip === feat.id && (
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-52 bg-slate-900 text-white text-[11px] p-2.5 rounded-xl shadow-xl z-30 text-center pointer-events-none">
                              {feat.tooltip}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="p-6 pt-0">
                <button
                  id={`btn-plan-${plan.id}`}
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isActive}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600 text-white cursor-default shadow-xs'
                      : isKurumsal
                      ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                      : plan.monthlyPrice === 0
                      ? 'border border-blue-500 text-blue-600 hover:bg-blue-50 bg-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  }`}
                >
                  {isActive ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Aktif Paket</span>
                    </>
                  ) : isKurumsal ? (
                    <span>İletişime Geçin</span>
                  ) : plan.monthlyPrice === 0 ? (
                    <span>Bu Pakete Geç</span>
                  ) : (
                    <>
                      <span>Yükselt</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* PLAN UPGRADE CONFIRMATION MODAL */}
      {selectedModalPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Paket Değişikliğini Onayla
                  </h3>
                  <p className="text-xs text-slate-500">
                    {activePlan} ➔ <span className="font-bold text-blue-600">{selectedModalPlan.name}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedModalPlan(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                Kulübünüzün aboneliği <strong>{selectedModalPlan.name}</strong> paketine taşınacaktır.
              </p>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span>Faturalandırma Dönemi:</span>
                  <span className="font-bold">{billingCycle === 'aylik' ? 'Aylık Fatura' : 'Yıllık Fatura (%20 İndirimli)'}</span>
                </div>
                <div className="flex justify-between text-blue-700 font-bold text-sm pt-2 border-t border-slate-200">
                  <span>Ödenecek Tutar:</span>
                  <span>{getPriceFormatted(selectedModalPlan.monthlyPrice)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedModalPlan(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                onClick={confirmUpgrade}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Paketi Onayla ve Geç</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KURUMSAL İLETİŞİME GEÇİN MODALI */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Kurumsal Çözümler &amp; Özel Teklif
                  </h3>
                  <p className="text-xs text-slate-500">
                    Özel altyapı, sınırsız şube ve kulüp ağı çözümleri
                  </p>
                </div>
              </div>
              <button
                onClick={() => setContactModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-2 space-y-3 text-xs text-slate-700">
              <p>
                Kurumsal kulüpler, federasyonlar ve çok şubeli spor okulları için özel SLA, dedicated sunucu ve özel alan adı entegrasyonu sunuyoruz.
              </p>
              <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-900">Danışma &amp; İletişim Hattı:</span>
                  </div>
                  <a href="tel:02168501907" className="font-bold text-blue-700 hover:underline">
                    0216 850 1907
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-900">Kurumsal E-posta:</span>
                  </div>
                  <a href="mailto:kurumsal@sportsfly.com.tr" className="text-blue-600 hover:underline">
                    kurumsal@sportsfly.com.tr
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <a
                href="https://api.whatsapp.com/send?phone=902168501907&text=Merhaba%2C%20SportsFly%20kurumsal%20paket%20ve%20kul%C3%BCp%20%C3%A7%C3%B6z%C3%BCmleri%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <span>WhatsApp ile Danış</span>
              </a>

              <button
                onClick={() => setContactModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN EDIT PACKAGE MODAL */}
      {isEditModalOpen && editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">
                      Paket ve Fiyat Ayarlarını Düzenle
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1 border border-emerald-300">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Süper Admin Doğrulandı
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Fiyatları, maddeleri ve promosyon mesajlarını güncelleyin
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Plan Selector Buttons */}
            <div className="flex items-center gap-1 px-6 py-2.5 bg-slate-100 border-b border-slate-200 overflow-x-auto text-xs">
              {packages.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setEditingPlan(JSON.parse(JSON.stringify(p)))}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    editingPlan.id === p.id
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSavePlanChanges} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Paket Başlığı</label>
                  <input
                    type="text"
                    required
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Aylık Tutar (₺) {editingPlan.isCustomQuote && '(Özel Teklif)'}
                  </label>
                  <input
                    type="number"
                    disabled={editingPlan.isCustomQuote}
                    value={editingPlan.monthlyPrice}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, monthlyPrice: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-slate-100"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kırmızı Promosyon / Limit İkaz Metni
                </label>
                <input
                  type="text"
                  value={editingPlan.promoText || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, promoText: e.target.value })}
                  placeholder="Örn: *Ayda sadece 449 TL karşılığında sporcu limitini kaldırabilirsiniz!"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mavi Vurgu Başlığı
                </label>
                <input
                  type="text"
                  value={editingPlan.highlightText || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, highlightText: e.target.value })}
                  placeholder="Örn: Başlangıç Paketindeki Herşey"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              {/* Features List Editing */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block font-bold text-slate-900">Paket Özellikleri</label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {editingPlan.features.map((feat, index) => (
                    <div
                      key={feat.id}
                      className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <input
                        type="text"
                        value={feat.text}
                        onChange={(e) => {
                          const updatedFeats = [...editingPlan.features];
                          updatedFeats[index].text = e.target.value;
                          setEditingPlan({ ...editingPlan, features: updatedFeats });
                        }}
                        className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded outline-none text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedFeats = editingPlan.features.filter((f) => f.id !== feat.id);
                          setEditingPlan({ ...editingPlan, features: updatedFeats });
                        }}
                        className="text-rose-500 hover:text-rose-700 p-1"
                        title="Özelliği Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new feature input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    placeholder="Yeni özellik maddesi ekleyin..."
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg outline-none text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newFeatureText.trim()) return;
                      const newFeat: PlanFeature = {
                        id: 'f_' + Date.now(),
                        text: newFeatureText.trim(),
                      };
                      setEditingPlan({
                        ...editingPlan,
                        features: [...editingPlan.features, newFeat],
                      });
                      setNewFeatureText('');
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ekle</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="text-slate-500 hover:text-rose-600 flex items-center gap-1 font-semibold text-xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Varsayılana Sıfırla</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                  >
                    Değişiklikleri Kaydet
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* YETKİ KISITLAMA UYARISI MODALI (RBAC GUARD) */}
      {unauthorizedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200 shadow-2xs">
                  <ShieldAlert className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Yetki Kısıtlaması (Süper Admin Özel)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Paket Fiyatı ve Limit Yönetimi
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUnauthorizedModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                Paket fiyatları, SMS/sporcu limitleri ve paket içeriğini değiştirme yetkisi{' '}
                <strong className="text-slate-900 font-bold">yalnızca Süper Admin</strong> rolüne sahip sistem yöneticilerine tanımlanmıştır.
              </p>

              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-900 font-semibold">Mevcut Rolünüz:</span>
                  <span className="px-2 py-0.5 rounded-full bg-white text-amber-900 font-bold border border-amber-300">
                    {userProfile.role || 'Kullanıcı'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-amber-800/80 pt-1 border-t border-amber-200/60">
                  <span>Gerekli Yetki:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Süper Admin
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                Kulübünüz için fiyat revizyonu veya özel kapasite talepleriniz için sistem yöneticinizle ya da <strong>Sporsepeti Bilişim Teknolojileri</strong> destek hattıyla iletişime geçebilirsiniz:
                <span className="block font-bold text-blue-700 mt-1">📞 0216 850 1907</span>
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
              <button
                type="button"
                onClick={() => {
                  toggleDemoRole();
                  setUnauthorizedModalOpen(false);
                }}
                className="px-3 py-1.5 rounded-lg border border-dashed border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Süper Admin Olarak Dene</span>
              </button>

              <button
                type="button"
                onClick={() => setUnauthorizedModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Tamam, Anladım
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
