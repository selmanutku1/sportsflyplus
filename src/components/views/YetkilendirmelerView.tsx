import React, { useState } from 'react';
import {
  Check,
  X,
  Search,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Info,
} from 'lucide-react';

export type PermissionAction =
  | 'List'
  | 'Add'
  | 'Update'
  | 'Delete'
  | 'Password'
  | 'Account'
  | 'SendMail'
  | 'SendSMS';

export interface PagePermission {
  id: string;
  name: string;
  category?: string;
  actions: Record<PermissionAction, boolean>;
}

const ACTION_COLUMNS: { key: PermissionAction; label: string }[] = [
  { key: 'List', label: 'List' },
  { key: 'Add', label: 'Add' },
  { key: 'Update', label: 'Update' },
  { key: 'Delete', label: 'Delete' },
  { key: 'Password', label: 'Password' },
  { key: 'Account', label: 'Account' },
  { key: 'SendMail', label: 'SendMail' },
  { key: 'SendSMS', label: 'SendSMS' },
];

// 32 modules exactly as in the user's screenshots (image 1 & image 2)
const INITIAL_PAGES_CONFIG: { id: string; name: string; defaultChecked?: PermissionAction[] }[] = [
  { id: 'yoneticiler', name: 'Yöneticiler' },
  { id: 'egitmenler', name: 'Eğitmenler' },
  { id: 'uyeler', name: 'Üyeler' },
  { id: 'kulubum', name: 'Kulübüm' },
  { id: 'hesabim', name: 'Hesabım' },
  { id: 'antrenman-takvimi', name: 'Antrenman Takvimi' },
  { id: 'kulupler', name: 'Kulüpler' },
  { id: 'mesajlar', name: 'Mesajlar' },
  { id: 'mesaj-yonetimi', name: 'Mesaj Yönetimi' },
  { id: 'basvurular', name: 'Başvurular' },
  { id: 'yoklama', name: 'Yoklama' },
  { id: 'on-muhasebe', name: 'Ön Muhasebe' },
  { id: 'anket-yonetimi', name: 'Anket Yönetimi' },
  { id: 'kampanya-yonetimi', name: 'Kampanya Yönetimi' },
  { id: 'gruplar', name: 'Gruplar' },
  { id: 'grup-yoklamalari', name: 'Grup Yoklamaları' },
  { id: 'veli-yonetimi', name: 'Veli Yönetimi' },
  { id: 'veli-toplu-mesaj', name: 'Veli Toplu Mesaj' },
  { id: 'odeme-plani', name: 'Ödeme Planı' },
  { id: 'gelir-gider-yonetimi', name: 'Gelir/Gider Yönetimi' },
  { id: 'gecmis-kayitlar', name: 'Geçmiş Kayıtlar' },
  { id: 'gelir-gider-kategori', name: 'Gelir/Gider Kategori Yönetimi' },
  { id: 'brans-yonetimi', name: 'Branş Yönetimi' },
  { id: 'odeme-plani-kontrol', name: 'Ödeme Planı Kontrol' },
  {
    id: 'fatura-adresi',
    name: 'Fatura Adresi',
    defaultChecked: ['List', 'Add', 'Update', 'Delete'], // Checked in user's 2nd screenshot!
  },
  {
    id: 'paketler',
    name: 'Paketler',
    defaultChecked: ['List', 'Add', 'Update', 'Delete'], // Checked in user's 2nd screenshot!
  },
  { id: 'aktivite-yonetimi', name: 'Aktivite Yönetimi' },
  { id: 'aktivite-kategorileri', name: 'Aktivite Kategorileri' },
  { id: 'aktivite-randevulari', name: 'Aktivite Randevuları' },
  { id: 'subeler', name: 'Şubeler' },
  { id: 'on-kayit-linkleri', name: 'Ön Kayıt Linkleri' },
  { id: 'on-kayit', name: 'Ön Kayıt' },
];

export const YetkilendirmelerView: React.FC = () => {
  // Initialize state based on the 32 pages
  const [permissions, setPermissions] = useState<PagePermission[]>(() => {
    return INITIAL_PAGES_CONFIG.map((cfg) => {
      const actionsObj: Record<PermissionAction, boolean> = {
        List: false,
        Add: false,
        Update: false,
        Delete: false,
        Password: false,
        Account: false,
        SendMail: false,
        SendSMS: false,
      };

      if (cfg.defaultChecked) {
        cfg.defaultChecked.forEach((act) => {
          actionsObj[act] = true;
        });
      }

      return {
        id: cfg.id,
        name: cfg.name,
        actions: actionsObj,
      };
    });
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'antrenor' | 'muhasebe'>('admin');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle specific checkbox
  const togglePermission = (pageId: string, action: PermissionAction) => {
    setPermissions((prev) =>
      prev.map((item) => {
        if (item.id === pageId) {
          return {
            ...item,
            actions: {
              ...item.actions,
              [action]: !item.actions[action],
            },
          };
        }
        return item;
      })
    );
    setIsSaved(false);
  };

  // Toggle whole row
  const toggleWholeRow = (pageId: string) => {
    setPermissions((prev) =>
      prev.map((item) => {
        if (item.id === pageId) {
          const allActive = ACTION_COLUMNS.every((col) => item.actions[col.key]);
          const newActions = { ...item.actions };
          ACTION_COLUMNS.forEach((col) => {
            newActions[col.key] = !allActive;
          });
          return { ...item, actions: newActions };
        }
        return item;
      })
    );
    setIsSaved(false);
  };

  // Toggle whole column
  const toggleWholeColumn = (action: PermissionAction) => {
    const allChecked = permissions.every((p) => p.actions[action]);
    setPermissions((prev) =>
      prev.map((item) => ({
        ...item,
        actions: {
          ...item.actions,
          [action]: !allChecked,
        },
      }))
    );
    setIsSaved(false);
  };

  // Reset to default preset
  const handleResetToDefault = () => {
    setPermissions(
      INITIAL_PAGES_CONFIG.map((cfg) => {
        const actionsObj: Record<PermissionAction, boolean> = {
          List: false,
          Add: false,
          Update: false,
          Delete: false,
          Password: false,
          Account: false,
          SendMail: false,
          SendSMS: false,
        };
        if (cfg.defaultChecked) {
          cfg.defaultChecked.forEach((act) => {
            actionsObj[act] = true;
          });
        }
        return {
          id: cfg.id,
          name: cfg.name,
          actions: actionsObj,
        };
      })
    );
    showToast('Varsayılan yetkilendirme şablonuna dönüldü.');
  };

  // Save / Güncelle
  const handleSave = () => {
    setIsSaved(true);
    showToast('Sayfa yetkilendirmeleri başarıyla güncellendi.');
  };

  const filteredPermissions = permissions.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  // Stats calculation
  const totalChecked = permissions.reduce(
    (acc, curr) => acc + Object.values(curr.actions).filter(Boolean).length,
    0
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          id="permission-toast"
          className="fixed bottom-6 right-6 z-50 bg-slate-900/95 backdrop-blur-xs text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-150 text-sm font-medium"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Role and Quick Helper Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Hedef Rol:
          </span>
          <div className="inline-flex rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setSelectedRole('admin')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                selectedRole === 'admin'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Spor Okulu Admin
            </button>
            <button
              onClick={() => setSelectedRole('antrenor')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                selectedRole === 'antrenor'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Eğitmen / Antrenör
            </button>
            <button
              onClick={() => setSelectedRole('muhasebe')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                selectedRole === 'muhasebe'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ön Muhasebe
            </button>
          </div>
          <span className="text-xs text-slate-400 ml-1 hidden md:inline">
            ({totalChecked} yetki tanımlı)
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Sayfa / Menü Ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={handleResetToDefault}
            title="Şablonu Sıfırla"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* EXACT CONTAINER MATCHING USER SCREENSHOTS */}
      <div
        id="sayfa-yetkilendirmeleri-container"
        className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
      >
        {/* Header matching screenshot: "Sayfa Yetkilendirmeleri" with "X" */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight select-none">
            Sayfa Yetkilendirmeleri
          </h2>
          <button
            onClick={() => {
              showToast('Pencere kapatıldı veya varsayılan konuma dönüldü.');
            }}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
            title="Kapat"
          >
            <X className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* Scrollable Table Matrix matching screenshots */}
        <div className="overflow-x-auto max-h-[72vh] overflow-y-auto">
          <table className="w-full text-left border-collapse select-none">
            {/* Table Header */}
            <thead className="sticky top-0 bg-white z-20 shadow-2xs">
              <tr className="border-b border-slate-200 text-slate-900 text-sm font-bold">
                {/* Left Module column header */}
                <th className="py-3.5 px-6 font-bold text-slate-900 w-[240px] sm:w-[280px]">
                  {/* Empty or can hold row select all */}
                </th>

                {/* 8 Action Columns: List, Add, Update, Delete, Password, Account, SendMail, SendSMS */}
                {ACTION_COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => toggleWholeColumn(col.key)}
                    className="py-3.5 px-3 text-center text-slate-900 font-bold text-sm tracking-tight cursor-pointer hover:text-blue-600 transition-colors whitespace-nowrap min-w-[76px]"
                    title={`${col.label} sütunundaki tümünü aç/kapat`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body with 32 Rows */}
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredPermissions.map((page) => {
                const hasAnyActive = Object.values(page.actions).some(Boolean);
                const allActive = ACTION_COLUMNS.every((col) => page.actions[col.key]);

                return (
                  <tr
                    key={page.id}
                    className={`transition-colors hover:bg-slate-50/80 ${
                      hasAnyActive ? 'bg-blue-50/20' : ''
                    }`}
                  >
                    {/* Module / Page Name */}
                    <td className="py-3 px-6 font-semibold text-slate-900 whitespace-nowrap">
                      <button
                        onClick={() => toggleWholeRow(page.id)}
                        className="text-left font-semibold text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-2 group"
                        title="Tüm satırı seç/kaldır"
                      >
                        <span>{page.name}</span>
                        <span className="opacity-0 group-hover:opacity-100 text-[10px] text-blue-500 font-normal">
                          {allActive ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                        </span>
                      </button>
                    </td>

                    {/* Checkbox columns */}
                    {ACTION_COLUMNS.map((col) => {
                      const isChecked = page.actions[col.key];

                      return (
                        <td
                          key={col.key}
                          className="py-3 px-3 text-center align-middle"
                        >
                          <div className="flex items-center justify-center">
                            <button
                              id={`perm-${page.id}-${col.key}`}
                              type="button"
                              onClick={() => togglePermission(page.id, col.key)}
                              className={`w-4 h-4 rounded-[3.5px] flex items-center justify-center transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-400 ${
                                isChecked
                                  ? 'bg-[#007bff] hover:bg-blue-600 text-white shadow-2xs'
                                  : 'bg-white hover:bg-slate-50 border border-slate-300'
                              }`}
                              title={`${page.name} - ${col.label}: ${isChecked ? 'Açık' : 'Kapalı'}`}
                            >
                              {isChecked && (
                                <Check className="w-3.5 h-3.5 stroke-[3.2] text-white" />
                              )}
                            </button>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {filteredPermissions.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <p className="font-semibold">Aramanıza uygun yetkilendirme sayfası bulunamadı.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Arama terimini temizleyerek tüm listeyi görebilirsiniz.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Footer Action Bar with "Güncelle" Button matching screenshots */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-white flex items-center justify-between">
          <div className="text-xs text-slate-500 hidden sm:flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Sütun veya satır isimlerine tıklayarak toplu seçim yapabilirsiniz.
            </span>
          </div>

          <div className="flex items-center justify-end w-full sm:w-auto">
            {/* Blue "Güncelle" button matching exact screenshot styling */}
            <button
              id="btn-update-permissions"
              type="button"
              onClick={handleSave}
              className="bg-[#007bff] hover:bg-[#0069d9] active:bg-[#0062cc] text-white font-medium text-sm px-6 py-2 rounded-md shadow-2xs transition-all cursor-pointer"
            >
              Güncelle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
