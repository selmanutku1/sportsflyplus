import React, { useState } from 'react';
import {
  Search,
  UserCog,
  ShieldCheck,
  UserPlus,
  Phone,
  Calendar,
  CheckCircle2,
  KeyRound,
  Trash2,
} from 'lucide-react';
import { INITIAL_YETKILENDIRMELER } from '../../data/mockData';
import { YetkilendirmeItem } from '../../types';

export const YetkilendirmelerView: React.FC = () => {
  const [managers, setManagers] = useState<YetkilendirmeItem[]>(INITIAL_YETKILENDIRMELER);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingManager, setEditingManager] = useState<YetkilendirmeItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New admin form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+90 532 525 82 71');
  const [newRole, setNewRole] = useState('Spor Okulu Admin');

  const filteredManagers = managers.filter((m) => {
    const query = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query) ||
      m.code.includes(query) ||
      m.role.toLowerCase().includes(query) ||
      m.phone.includes(query)
    );
  });

  const handleUpdateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingManager) return;

    setManagers((prev) =>
      prev.map((m) => (m.id === editingManager.id ? editingManager : m))
    );
    setSuccessToast(`${editingManager.name} yetkileri güncellendi.`);
    setEditingManager(null);
    setTimeout(() => setSuccessToast(null), 2500);
  };

  const handleAddManager = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date();
    const formattedDate = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
    const formattedDateTime = `${formattedDate} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    const newMgr: YetkilendirmeItem = {
      id: `y-${Date.now()}`,
      name: newName,
      email: newEmail,
      code,
      createdAt: formattedDateTime,
      phone: newPhone,
      role: newRole,
      date: formattedDate,
    };

    setManagers([newMgr, ...managers]);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setSuccessToast(`Yeni yetkili yönetici ${newName} eklendi.`);
    setTimeout(() => setSuccessToast(null), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{successToast}</span>
        </div>
      )}

      {/* Main Container Card matching Screenshot 7 */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6">
        {/* Actions bar matching Screenshot 7 */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Yeni Yetkili Ata
            </button>
            <span className="text-xs text-slate-500 font-medium">
              {filteredManagers.length} Yetkili Yönetici
            </span>
          </div>

          {/* "Yönetici Ara" search input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Yönetici Ara"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium"
            />
          </div>
        </div>

        {/* Table matching Screenshot 7 */}
        <div className="overflow-x-auto pt-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold text-slate-700">
                <th className="pb-3 px-3 w-10"></th>
                <th className="pb-3 px-3">Yönetici</th>
                <th className="pb-3 px-3">Telefon</th>
                <th className="pb-3 px-3">Kullanıcı Türü</th>
                <th className="pb-3 px-3">Oluşturulma Tarihi</th>
                <th className="pb-3 px-3 text-right">Yetki Ayarı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredManagers.length > 0 ? (
                filteredManagers.map((mgr) => {
                  const isChecked = selectedId === mgr.id;

                  return (
                    <tr
                      key={mgr.id}
                      onClick={() => setSelectedId(mgr.id)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        isChecked ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      {/* Radio button column */}
                      <td className="py-4 px-3">
                        <input
                          type="radio"
                          name="selectedManager"
                          checked={isChecked}
                          onChange={() => setSelectedId(mgr.id)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                      </td>

                      {/* Yönetici column: Avatar placeholder + Name + Email + Code + Timestamp */}
                      <td className="py-4 px-3">
                        <div className="flex items-start gap-3.5">
                          {/* Avatar icon matching the silhouette avatar in screenshot 7 */}
                          <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center text-white shrink-0 shadow-2xs">
                            <svg
                              className="w-8 h-8 text-slate-100"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          </div>

                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-900 text-base">
                              {mgr.name}
                            </p>
                            <p className="text-xs text-slate-500 font-medium">
                              {mgr.email}
                            </p>
                            <p className="text-xs font-mono font-semibold text-slate-700">
                              {mgr.code}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              {mgr.createdAt}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Telefon */}
                      <td className="py-4 px-3 whitespace-nowrap text-sm font-semibold text-slate-700">
                        {mgr.phone}
                      </td>

                      {/* Kullanıcı Türü */}
                      <td className="py-4 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                          {mgr.role}
                        </span>
                      </td>

                      {/* Oluşturulma Tarihi */}
                      <td className="py-4 px-3 whitespace-nowrap text-sm text-slate-600 font-medium">
                        {mgr.date}
                      </td>

                      {/* Actions: Manage role button */}
                      <td className="py-4 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingManager(mgr);
                          }}
                          className="p-2 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-xl transition-colors inline-flex items-center gap-1.5 font-semibold text-xs border border-cyan-200/60"
                          title="Yetki Ayarlarını Düzenle"
                        >
                          <UserCog className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Arama kriterine uygun yönetici bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Role Modal */}
      {editingManager && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <UserCog className="w-5 h-5 text-cyan-600" />
                Yetki &amp; Rol Düzenle
              </h3>
              <button
                onClick={() => setEditingManager(null)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdateRole} className="py-4 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-1">
                <p className="font-bold text-slate-800">{editingManager.name}</p>
                <p className="text-xs text-slate-500">{editingManager.email}</p>
                <p className="text-xs font-mono text-slate-400">Kod: {editingManager.code}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kullanıcı Rolü
                </label>
                <select
                  value={editingManager.role}
                  onChange={(e) =>
                    setEditingManager({ ...editingManager, role: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                >
                  <option value="Spor Okulu Admin">Spor Okulu Admin</option>
                  <option value="Süper Admin">Süper Admin</option>
                  <option value="İşletme Yöneticisi">İşletme Yöneticisi</option>
                  <option value="Eğitmen Sorumlusu">Eğitmen Sorumlusu</option>
                  <option value="Gözlemci / Raporlayıcı">Gözlemci / Raporlayıcı</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Telefon Numarası
                </label>
                <input
                  type="text"
                  value={editingManager.phone}
                  onChange={(e) =>
                    setEditingManager({ ...editingManager, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingManager(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow-xs"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                Yeni Yetkili Yönetici Ekle
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddManager} className="py-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Yönetici Adı Soyadı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Abdullah acet"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  E-posta Adresi *
                </label>
                <input
                  type="email"
                  required
                  placeholder="Örn: abdullahacet43@hotmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Telefon Numarası
                </label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Yetki Türü
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                >
                  <option value="Spor Okulu Admin">Spor Okulu Admin</option>
                  <option value="Süper Admin">Süper Admin</option>
                  <option value="İşletme Yöneticisi">İşletme Yöneticisi</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  Yöneticiyi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
