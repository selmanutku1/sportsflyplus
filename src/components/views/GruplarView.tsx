import React, { useState } from 'react';
import {
  Plus,
  Search,
  Pencil,
  Users,
  UserPlus,
  Trash2,
  X,
  CheckCircle2,
  Calendar,
  Shield,
  Filter,
} from 'lucide-react';
import { INITIAL_GRUPLAR } from '../../data/mockMuhasebeData';
import { GrupItem } from '../../types';

export const GruplarView: React.FC = () => {
  const [gruplar, setGruplar] = useState<GrupItem[]>(INITIAL_GRUPLAR);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Modals
  const [editingGroup, setEditingGroup] = useState<GrupItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add Group Form
  const [newName, setNewName] = useState('');
  const [newInstructor, setNewInstructor] = useState('Selman Utku');
  const [newFacility, setNewFacility] = useState('SportsFly Manager');
  const [newBranch, setNewBranch] = useState('Basketbol');
  const [newDescription, setNewDescription] = useState('');

  // Edit Group Form
  const [editName, setEditName] = useState('');
  const [editInstructor, setEditInstructor] = useState('');
  const [editFacility, setEditFacility] = useState('');
  const [editBranch, setEditBranch] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenEdit = (group: GrupItem) => {
    setEditingGroup(group);
    setEditName(group.name);
    setEditInstructor(group.instructorName);
    setEditFacility(group.facility);
    setEditBranch(group.branch || 'Basketbol');
    setEditDescription(group.description || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGroup) return;

    setGruplar((prev) =>
      prev.map((g) =>
        g.id === editingGroup.id
          ? {
              ...g,
              name: editName,
              instructorName: editInstructor,
              facility: editFacility,
              branch: editBranch,
              description: editDescription,
            }
          : g
      )
    );

    showToast(`"${editName}" grubu başarıyla güncellendi.`);
    setEditingGroup(null);
  };

  const handleAddMemberToGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGroup || !newMemberName.trim()) return;

    const newMem = {
      id: `m-${Date.now()}`,
      name: newMemberName.trim(),
      phone: newMemberPhone.trim() || '+90 5XX XXX XX XX',
      code: Math.floor(100000 + Math.random() * 900000).toString(),
    };

    const updatedMembers = [...(editingGroup.members || []), newMem];
    const updatedGroup = {
      ...editingGroup,
      members: updatedMembers,
      memberCount: updatedMembers.length,
    };

    setEditingGroup(updatedGroup);
    setGruplar((prev) =>
      prev.map((g) => (g.id === updatedGroup.id ? updatedGroup : g))
    );

    setNewMemberName('');
    setNewMemberPhone('');
    showToast(`${newMem.name} gruba eklendi.`);
  };

  const handleRemoveMember = (memberId: string) => {
    if (!editingGroup) return;
    const updatedMembers = (editingGroup.members || []).filter((m) => m.id !== memberId);
    const updatedGroup = {
      ...editingGroup,
      members: updatedMembers,
      memberCount: updatedMembers.length,
    };
    setEditingGroup(updatedGroup);
    setGruplar((prev) =>
      prev.map((g) => (g.id === updatedGroup.id ? updatedGroup : g))
    );
    showToast('Sporcu gruptan çıkarıldı.');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newGroup: GrupItem = {
      id: `grp-${Date.now()}`,
      name: newName.trim(),
      instructorName: newInstructor.trim(),
      memberCount: 0,
      facility: newFacility.trim(),
      branch: newBranch,
      description: newDescription.trim(),
      members: [],
    };

    setGruplar([newGroup, ...gruplar]);
    setShowAddModal(false);
    setNewName('');
    setNewDescription('');
    showToast(`"${newGroup.name}" grubu başarıyla oluşturuldu.`);
  };

  const filteredGruplar = gruplar.filter((g) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      g.name.toLowerCase().includes(q) ||
      g.instructorName.toLowerCase().includes(q) ||
      g.facility.toLowerCase().includes(q) ||
      (g.branch && g.branch.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container matching Screenshot 2 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-3.5 sm:p-6">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between gap-2.5 sm:gap-4 mb-5">
          {/* Left: Green Plus Button */}
          <div>
            <button
              id="btn-add-group"
              onClick={() => setShowAddModal(true)}
              className="w-10 h-10 rounded-xl bg-[#188038] hover:bg-[#137333] active:scale-95 text-white flex items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer"
              title="Yeni Grup Ekle"
              aria-label="Yeni Grup Ekle"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Right: Grup Ara Input */}
          <div className="relative flex-1 max-w-xs sm:w-64">
            <input
              id="search-group"
              type="text"
              placeholder="Grup Ara"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-slate-300 rounded-lg pl-3 pr-8 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs w-5 h-5 flex items-center justify-center"
                aria-label="Aramayı Temizle"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* MOBILE CARDS VIEW (Visible on small screens <640px) */}
        <div className="block sm:hidden space-y-3">
          {filteredGruplar.map((grup) => {
            const isSelected = selectedGroupId === grup.id;

            return (
              <div
                key={grup.id}
                onClick={() => setSelectedGroupId(isSelected ? null : grup.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/40 shadow-xs ring-1 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Select Radio */}
                    <div className="pt-0.5 shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center ${
                          isSelected
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <span className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-900 text-sm leading-snug">
                          {grup.name}
                        </h4>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shrink-0">
                          {grup.branch || 'Basketbol'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-medium">
                        Koç: <span className="text-slate-800 font-semibold">{grup.instructorName}</span>
                      </p>

                      <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          <Users className="w-3 h-3 text-blue-600" />
                          {grup.memberCount} Üye
                        </span>
                        <span className="truncate">{grup.facility}</span>
                      </div>
                    </div>
                  </div>

                  {/* Edit Pencil Button (44px touch target) */}
                  <button
                    id={`btn-mobile-edit-group-${grup.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(grup);
                    }}
                    className="w-10 h-10 rounded-xl text-amber-600 bg-amber-50 hover:bg-amber-100 flex items-center justify-center transition-colors shrink-0 active:scale-95"
                    title="Grubu Düzenle"
                    aria-label="Grubu Düzenle"
                  >
                    <Pencil className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredGruplar.length === 0 && (
            <div className="py-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200 p-4">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-xs text-slate-700">Arama kriterine uygun grup bulunamadı.</p>
              <p className="text-[11px] text-slate-400 mt-1">Yeni bir grup oluşturmak için yeşil (+) butonuna dokunabilirsiniz.</p>
            </div>
          )}
        </div>

        {/* Table Content matching Screenshot 2 (Visible on sm and larger) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold text-slate-800 select-none">
                <th className="py-3 px-3 w-10 text-center">
                  {/* Select circle header */}
                </th>
                <th className="py-3 px-3 text-slate-900 font-bold">Grup</th>
                <th className="py-3 px-3 text-slate-900 font-bold">Üye Sayısı</th>
                <th className="py-3 px-3 text-slate-900 font-bold">İşletme/Bireysel Adı</th>
                <th className="py-3 px-3 text-right text-slate-900 font-bold pr-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGruplar.map((grup) => {
                const isSelected = selectedGroupId === grup.id;

                return (
                  <tr
                    key={grup.id}
                    onClick={() => setSelectedGroupId(grup.id)}
                    className={`transition-colors group hover:bg-slate-50/80 cursor-pointer ${
                      isSelected ? 'bg-slate-50' : ''
                    }`}
                  >
                    {/* Select circle */}
                    <td className="py-4 px-3 text-center align-middle">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGroupId(isSelected ? null : grup.id);
                        }}
                        className={`w-4 h-4 rounded-full border-2 transition-colors flex items-center justify-center ${
                          isSelected
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </button>
                    </td>

                    {/* Grup: Group Name + Instructor Name */}
                    <td className="py-4 px-3 align-middle">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900 text-base leading-tight">
                          {grup.name}
                        </p>
                        <p className="text-sm text-slate-600 font-medium">
                          {grup.instructorName}
                        </p>
                      </div>
                    </td>

                    {/* Üye Sayısı */}
                    <td className="py-4 px-3 align-middle text-sm text-slate-700 font-medium">
                      {grup.memberCount}
                    </td>

                    {/* İşletme/Bireysel Adı */}
                    <td className="py-4 px-3 align-middle text-sm text-slate-700">
                      {grup.facility}
                    </td>

                    {/* Right: Yellow Pencil Edit Icon matching Screenshot 2 */}
                    <td className="py-4 px-3 pr-4 align-middle text-right whitespace-nowrap">
                      <button
                        id={`btn-edit-group-${grup.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(grup);
                        }}
                        className="p-1.5 rounded-lg text-amber-500 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                        title="Grubu Düzenle & Üye Yönetimi"
                      >
                        <Pencil className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredGruplar.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="w-8 h-8 text-slate-300 mb-2" />
                      <p className="font-semibold text-slate-700">Arama kriterine uygun grup bulunamadı.</p>
                      <p className="text-xs text-slate-400 mt-1">Yeni bir grup oluşturmak için sol üstteki yeşil (+) butonunu kullanabilirsiniz.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Toplam {filteredGruplar.length} grup kayıtlı</span>
          <span>Aktif Sporcular: {gruplar.reduce((acc, g) => acc + g.memberCount, 0)} üye</span>
        </div>
      </div>

      {/* MODAL: GRUP DÜZENLE & ÜYE LİSTESİ */}
      {editingGroup && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Grup Bilgileri &amp; Üye Yönetimi</h3>
                  <p className="text-xs text-slate-500">{editingGroup.name}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingGroup(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Grup Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Eğitmen / Sorumlu *
                  </label>
                  <input
                    type="text"
                    required
                    value={editInstructor}
                    onChange={(e) => setEditInstructor(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    İşletme / Kulüp Adı
                  </label>
                  <input
                    type="text"
                    value={editFacility}
                    onChange={(e) => setEditFacility(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Branş
                  </label>
                  <select
                    value={editBranch}
                    onChange={(e) => setEditBranch(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white"
                  >
                    <option value="Basketbol">Basketbol</option>
                    <option value="Futbol">Futbol</option>
                    <option value="Yüzme">Yüzme</option>
                    <option value="Tenis">Tenis</option>
                    <option value="Voleybol">Voleybol</option>
                    <option value="Jimnastik">Jimnastik</option>
                  </select>
                </div>
              </div>

              {/* Üyeler Listesi & Yeni Üye Ekle */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>Grup Üyeleri ({editingGroup.members?.length || 0})</span>
                  </h4>
                </div>

                {/* Hızlı Üye Ekle */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 mb-3 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Sporcu Adı Soyadı"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="flex-1 text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Telefon"
                    value={newMemberPhone}
                    onChange={(e) => setNewMemberPhone(e.target.value)}
                    className="w-full sm:w-36 text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddMemberToGroup}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 shrink-0"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Üye Ekle</span>
                  </button>
                </div>

                {/* Üye Listesi */}
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {editingGroup.members && editingGroup.members.length > 0 ? (
                    editingGroup.members.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">{m.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            Kod: {m.code} • Tel: {m.phone}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(m.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Gruptan Çıkar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4 text-xs text-slate-400">Grupta henüz kayıtlı üye bulunmuyor.</p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingGroup(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Kapat
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: YENİ GRUP EKLE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#188038] text-white flex items-center justify-center">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Yeni Grup Oluştur</h3>
                  <p className="text-xs text-slate-500">Spor okulu için yeni çalışma grubu tanımlayın</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Grup Adı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Anadolu Efes Spor Okulları"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Eğitmen / Koç
                  </label>
                  <input
                    type="text"
                    required
                    value={newInstructor}
                    onChange={(e) => setNewInstructor(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Branş
                  </label>
                  <select
                    value={newBranch}
                    onChange={(e) => setNewBranch(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Basketbol">Basketbol</option>
                    <option value="Futbol">Futbol</option>
                    <option value="Yüzme">Yüzme</option>
                    <option value="Tenis">Tenis</option>
                    <option value="Voleybol">Voleybol</option>
                    <option value="Jimnastik">Jimnastik</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  İşletme / Kulüp Adı
                </label>
                <input
                  type="text"
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Grup Açıklaması
                </label>
                <textarea
                  rows={2}
                  placeholder="Grup seviyesi, yaş aralığı veya antrenman saatleri..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#188038] hover:bg-[#137333] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Grubu Oluştur</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
