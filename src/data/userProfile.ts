export interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  role: string;
  title: string;
  club: string;
  branch: string;
  avatarColor: string;
  avatarUrl?: string;
  bio: string;
  twoFactorEnabled: boolean;
  notifications: {
    newRegistrationEmail: boolean;
    newRegistrationSms: boolean;
    paymentEmail: boolean;
    paymentSms: boolean;
    reviewEmail: boolean;
    dailyDigest: boolean;
  };
  preferences: {
    defaultPage: string;
    dateFormat: string;
    soundEnabled: boolean;
  };
}

export const DEFAULT_USER_PROFILE: UserProfileData = {
  name: 'Selman Utku',
  email: 'selmanutkumarmara@gmail.com',
  phone: '0216 850 1907',
  role: 'Süper Admin',
  title: 'SportsFly Kulüp Yöneticisi',
  club: 'SportsFly Kadıköy Merkez Şube',
  branch: 'Tüm Branşlar (Basketbol, Voleybol, Yüzme, Futbol)',
  avatarColor: 'from-blue-600 to-indigo-600',
  bio: 'SportsFly Kulüp ve Spor Okulu Yönetim Koordinatörü.',
  twoFactorEnabled: true,
  notifications: {
    newRegistrationEmail: true,
    newRegistrationSms: true,
    paymentEmail: true,
    paymentSms: false,
    reviewEmail: true,
    dailyDigest: true,
  },
  preferences: {
    defaultPage: 'on-kayit',
    dateFormat: 'DD.MM.YYYY',
    soundEnabled: true,
  },
};

const STORAGE_KEY = 'sportsfly_user_profile_v1';

export function getStoredUserProfile(): UserProfileData {
  if (typeof window === 'undefined') {
    return DEFAULT_USER_PROFILE;
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return { ...DEFAULT_USER_PROFILE, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Failed to parse stored user profile:', err);
  }
  return DEFAULT_USER_PROFILE;
}

export function saveStoredUserProfile(profile: UserProfileData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('sportsfly_profile_updated', { detail: profile }));
  } catch (err) {
    console.error('Failed to save user profile:', err);
  }
}
