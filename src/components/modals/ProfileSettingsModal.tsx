import React, { useState } from 'react';
import {
  X,
  User,
  Shield,
  Bell,
  Sliders,
  Check,
  Camera,
  Upload,
  KeyRound,
  Smartphone,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Phone,
  Mail,
  Building2,
  Lock,
  Save,
  Clock,
  LogOut,
  HelpCircle,
} from 'lucide-react';
import {
  UserProfileData,
  saveStoredUserProfile,
} from '../../data/userProfile';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfileData;
  onProfileUpdated: (updated: UserProfileData) => void;
  initialTab?: 'genel' | 'guvenlik' | 'bildirimler' | 'tercihler';
}

const AVATAR_GRADIENTS = [
  { id: 'blue', label: 'Sports Mavi', bg: 'from-blue-600 to-indigo-600' },
  { id: 'emerald', label: 'Canlı Zümrüt', bg: 'from-emerald-600 to-teal-600' },
  { id: 'amber', label: 'Güneş Turuncusu', bg: 'from-amber-500 to-rose-500' },
  { id: 'purple', label: 'Kraliyet Moru', bg: 'from-purple-600 to-pink-600' },
  { id: 'dark', label: 'Grafit Siyah', bg: 'from-slate-800 to-slate-950' },
];

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onProfileUpdated,
  initialTab = 'genel',
}) => {
  const [activeTab, setActiveTab] = useState<'genel' | 'guvenlik' | 'bildirimler' | 'tercihler'>(initialTab);
  const [formData, setFormData] = useState<UserProfileData>({ ...currentProfile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Security password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredUserProfile(formData);
    onProfileUpdated(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordFeedback('Lütfen mevcut şifrenizi giriniz.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordFeedback('Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback('Yeni şifre ve tekrarı birbiriyle eşleşmiyor.');
      return;
    }

    setPasswordFeedback(null);
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          avatarUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const initials = formData.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'SU';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${formData.avatarColor} text-white flex items-center justify-center font-bold text-sm shadow-xs overflow-hidden shrink-0`}>
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  Profil ve Hesap Ayarları
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {formData.role}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {formData.email} • İletişim: {formData.phone}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 overflow-x-auto scrollbar-none text-xs">
          {[
            { id: 'genel', label: 'Genel Bilgiler', icon: User },
            { id: 'guvenlik', label: 'Şifre & Güvenlik', icon: Shield },
            { id: 'bildirimler', label: 'Bildirim Tercihleri', icon: Bell },
            { id: 'tercihler', label: 'Sistem Tercihleri', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-blue-700 font-bold shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-700">
          {savedSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profil ayarlarınız başarıyla güncellendi ve kaydedildi.</span>
            </div>
          )}

          {/* TAB 1: GENEL BİLGİLER */}
          {activeTab === 'genel' && (
            <form onSubmit={handleSaveGeneral} className="space-y-6">
              {/* Avatar Section */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${formData.avatarColor} text-white flex items-center justify-center font-black text-xl shadow-md overflow-hidden shrink-0 relative group`}>
                    {formData.avatarUrl ? (
                      <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">Profil Fotoğrafı &amp; Teması</span>
                    <p className="text-xs text-slate-500">
                      Özel bir fotoğraf yükleyebilir veya hazır renk şablonlarından birini seçebilirsiniz.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <label className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs">
                        <Upload className="w-3.5 h-3.5 text-blue-600" />
                        <span>Fotoğraf Yükle</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </label>
                      {formData.avatarUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, avatarUrl: undefined })}
                          className="px-2 py-1.5 text-xs text-rose-600 hover:underline"
                        >
                          Fotoğrafı Kaldır
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Color swatches */}
                <div className="flex items-center gap-1.5">
                  {AVATAR_GRADIENTS.map((grad) => (
                    <button
                      type="button"
                      key={grad.id}
                      onClick={() => setFormData({ ...formData, avatarColor: grad.bg })}
                      title={grad.label}
                      className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${grad.bg} transition-all flex items-center justify-center ${
                        formData.avatarColor === grad.bg
                          ? 'ring-2 ring-blue-500 ring-offset-2 scale-110'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {formData.avatarColor === grad.bg && (
                        <Check className="w-3.5 h-3.5 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ad Soyad *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="Ad Soyad"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">E-posta Adresi *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="eposta@adresi.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">İletişim Numarası *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                      placeholder="0216 850 1907"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Formlar ve SMS bildirimlerinde tanımlı yetkili numarası.
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ünvan &amp; Görev</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="Kulüp Koordinatörü / Yönetici"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bağlı Kulüp / Merkez</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={formData.club}
                      onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="SportsFly Kadıköy Merkez"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Yetki Düzeyi (Rol)</label>
                  <div className="relative">
                    <Shield className="w-4 h-4 text-blue-600 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      disabled
                      value={`${formData.role} (Tam Erişim)`}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-600 font-bold"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Sorumlu Branşlar / Şubeler</label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="Basketbol, Voleybol, Yüzme vb."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Yönetici Notu / Biyografi</label>
                  <textarea
                    rows={2}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="Kısa yönetici notu..."
                  />
                </div>
              </div>

              {/* Form Action Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Değişiklikleri Kaydet</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: ŞİFRE & GÜVENLİK */}
          {activeTab === 'guvenlik' && (
            <div className="space-y-6">
              {/* Password Change Form */}
              <form onSubmit={handleUpdatePassword} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-slate-900 text-sm">Giriş Şifresini Değiştir</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPasswords ? 'Gizle' : 'Göster'}</span>
                  </button>
                </div>

                {passwordFeedback && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{passwordFeedback}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                    <span>Şifreniz başarıyla güncellendi!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mevcut Şifre</label>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Yeni Şifre</label>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="En az 6 karakter"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Yeni Şifre (Tekrar)</label>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-xs"
                  >
                    Şifreyi Güncelle
                  </button>
                </div>
              </form>

              {/* Two Factor Authentication (2FA) */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block text-sm">
                      İki Aşamalı Güvenli Doğrulama (2FA - SMS)
                    </span>
                    <p className="text-slate-500">
                      Oturum açma esnasında <strong>0216 850 1907</strong> ve kayıtlı GSM numaranıza 6 haneli güvenlik kodu iletilir.
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-[11px] font-bold text-emerald-700">Aktif ve Koruma Altında</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      twoFactorEnabled: !prev.twoFactorEnabled,
                    }));
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    formData.twoFactorEnabled ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
                </button>
              </div>

              {/* Active Sessions */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Laptop className="w-4 h-4 text-slate-500" />
                  <span>Aktif Oturumlar &amp; Cihazlar</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        PC
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">Chrome / macOS (Mevcut Tarayıcı)</span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                            Bu Cihaz
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px]">İstanbul, Türkiye • IP: 88.241.110.12</p>
                      </div>
                    </div>
                    <span className="text-emerald-600 font-semibold text-[11px]">Şu an aktif</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                        iOS
                      </div>
                      <div>
                        <span className="font-bold text-slate-800">SportsFly Mobile App / iPhone 15 Pro</span>
                        <p className="text-slate-500 text-[11px]">İstanbul, Türkiye • 45 dakika önce</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold hover:underline"
                    >
                      Oturumu Kapat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BİLDİRİM TERCİHLERİ */}
          {activeTab === 'bildirimler' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-900 leading-relaxed">
                Kulüp içi işlemler, yeni sporcu kayıtları ve finansal hareketler hakkında nasıl bildirim almak istediğinizi belirleyin.
              </div>

              <div className="space-y-3">
                {[
                  {
                    key: 'newRegistrationEmail',
                    title: 'Yeni Ön Kayıt Başvuruları (E-posta)',
                    desc: 'Yeni bir sporcu web veya QR formunu doldurduğunda selmanutkumarmara@gmail.com adresine detaylı bildirim iletilir.',
                  },
                  {
                    key: 'newRegistrationSms',
                    title: 'Yeni Ön Kayıt Başvuruları (SMS)',
                    desc: 'Yeni başvuru anında 0216 850 1907 yetkili hattınıza anlık SMS uyarısı gönderilir.',
                  },
                  {
                    key: 'paymentEmail',
                    title: 'Aidat & Ödeme Tahsilat Raporları',
                    desc: 'Ön muhasebede kaydedilen sözleşme ve tahsilatların günlük dökümü iletilir.',
                  },
                  {
                    key: 'reviewEmail',
                    title: 'Sporpuan Veli ve Sporcu Değerlendirmeleri',
                    desc: 'Kulüp antrenörleri ve salonlar için yapılan yeni yorumlarda yönetici uyarısı.',
                  },
                  {
                    key: 'dailyDigest',
                    title: 'Sabah Günlük Faaliyet Özeti',
                    desc: 'Günün antrenmanları, yoklamalar ve bekleyen görüşmeler her sabah saat 08:30\'da özetlenir.',
                  },
                ].map((item) => {
                  const isChecked = (formData.notifications as any)[item.key];
                  return (
                    <div
                      key={item.key}
                      className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 block text-[13px]">{item.title}</span>
                        <p className="text-slate-500 text-[11px] leading-relaxed">{item.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = {
                            ...formData,
                            notifications: {
                              ...formData.notifications,
                              [item.key]: !isChecked,
                            },
                          };
                          setFormData(updated);
                          saveStoredUserProfile(updated);
                          onProfileUpdated(updated);
                        }}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                          isChecked ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: SİSTEM TERCİHLERİ */}
          {activeTab === 'tercihler' && (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Varsayılan Başlangıç Sayfası
                  </label>
                  <select
                    value={formData.preferences.defaultPage}
                    onChange={(e) => {
                      const updated = {
                        ...formData,
                        preferences: { ...formData.preferences, defaultPage: e.target.value },
                      };
                      setFormData(updated);
                      saveStoredUserProfile(updated);
                      onProfileUpdated(updated);
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                  >
                    <option value="on-kayit">Ön Kayıt Yönetimi (9 Adımlı Form)</option>
                    <option value="gruplar">Gruplar &amp; Seviyeler</option>
                    <option value="sporcular">Sporcular Listesi</option>
                    <option value="antrenman-takvimi">Antrenman Takvimi</option>
                    <option value="on-muhasebe">Ön Muhasebe &amp; Aidatlar</option>
                    <option value="anasayfa">Yönetim Paneli (Dashboard)</option>
                  </select>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Uygulamayı her açtığınızda otomatik olarak yüklenecek sayfa.
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tarih Formatı</label>
                  <select
                    value={formData.preferences.dateFormat}
                    onChange={(e) => {
                      const updated = {
                        ...formData,
                        preferences: { ...formData.preferences, dateFormat: e.target.value },
                      };
                      setFormData(updated);
                      saveStoredUserProfile(updated);
                      onProfileUpdated(updated);
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                  >
                    <option value="DD.MM.YYYY">GG.AA.YYYY (Örn: 15.09.2026)</option>
                    <option value="YYYY-MM-DD">YYYY-AA-GG (Örn: 2026-09-15)</option>
                  </select>
                </div>
              </div>

              {/* Audio feedback */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Sistem &amp; İşlem Sesleri</span>
                  <p className="text-slate-500 text-[11px]">
                    Yeni kayıt bildirimi veya işlem onaylandığında sesli geri bildirim verilir.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = {
                      ...formData,
                      preferences: {
                        ...formData.preferences,
                        soundEnabled: !formData.preferences.soundEnabled,
                      },
                    };
                    setFormData(updated);
                    saveStoredUserProfile(updated);
                    onProfileUpdated(updated);
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    formData.preferences.soundEnabled ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 space-y-1">
                <span className="font-bold text-slate-900 block text-xs">Sürüm ve Altyapı Bilgisi</span>
                <p className="text-[11px]">SportsFly Spor Okulu Yönetim Platformu v2.4 (Enterprise Edition)</p>
                <p className="text-[11px] text-slate-400">Veri Sorumlusu: Sporsepeti Bilişim Teknolojileri ve Pazarlama Ltd. Şti. (Kadıköy / İstanbul)</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>256-Bit SSL ile Şifreli Güvenli Yönetim Oturumu</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Tamamla
          </button>
        </div>
      </div>
    </div>
  );
};
