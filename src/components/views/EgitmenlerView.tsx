import React, { useState } from 'react';
import {
  Plus,
  Send,
  Search,
  User,
  Image as ImageIcon,
  KeyRound,
  X,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { INITIAL_EGITMENLER } from '../../data/mockData';
import { EgitmenItem } from '../../types';

export const EgitmenlerView: React.FC = () => {
  const [egitmenler, setEgitmenler] = useState<EgitmenItem[]>(INITIAL_EGITMENLER);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Category List (Eğitmen Kategorileri / Branşlar)
  const [categories, setCategories] = useState<string[]>([
    'Futbol',
    'Basketbol',
    'Yüzme',
    'Tenis',
    'Pilates',
    'Fitness',
    'Jimnastik',
    'Voleybol',
  ]);

  // Modals
  const [editingEgitmen, setEditingEgitmen] = useState<EgitmenItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'egitmen' | 'randevular'>('egitmen');

  // New Category State
  const [newCategoryName, setNewCategoryName] = useState('');

  // Editing Trainer Form State (for Modal matching Screenshot 2)
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editBranch, setEditBranch] = useState('Futbol');
  const [editMailEnabled, setEditMailEnabled] = useState(false);
  const [editSmsEnabled, setEditSmsEnabled] = useState(true);
  const [editGender, setEditGender] = useState('Belirtilmedi');
  const [editCity, setEditCity] = useState('Belirtilmedi');
  const [editAddress, setEditAddress] = useState('');

  // New Trainer Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+90 507 ');
  const [newFacility, setNewFacility] = useState('aicosports');
  const [newBranch, setNewBranch] = useState('Futbol');

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Open Edit Modal (Matches Screenshot 2)
  const handleOpenEdit = (egitmen: EgitmenItem) => {
    setEditingEgitmen(egitmen);
    setEditName(egitmen.name);
    setEditPhone(egitmen.phone);
    setEditEmail(egitmen.email);
    setEditBranch(egitmen.branch || 'Futbol');
    setEditMailEnabled(egitmen.mailEnabled ?? false);
    setEditSmsEnabled(egitmen.smsEnabled ?? true);
    setEditGender(egitmen.gender || 'Belirtilmedi');
    setEditCity(egitmen.city || 'Belirtilmedi');
    setEditAddress(egitmen.address || '');
    setActiveModalTab('egitmen');
  };

  // Save Trainer Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEgitmen) return;

    setEgitmenler((prev) =>
      prev.map((item) =>
        item.id === editingEgitmen.id
          ? {
              ...item,
              name: editName,
              phone: editPhone,
              email: editEmail,
              branch: editBranch,
              mailEnabled: editMailEnabled,
              smsEnabled: editSmsEnabled,
              gender: editGender,
              city: editCity,
              address: editAddress,
            }
      : item
      )
    );

    showToast(`"${editName}" eğitmen bilgileri ve kategorisi başarıyla güncellendi.`);
    setEditingEgitmen(null);
  };

  // Add Trainer
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newTrainer: EgitmenItem = {
      id: `e-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim(),
      code: randomCode,
      phone: newPhone.trim(),
      facility: newFacility,
      branch: newBranch,
      accountDuration: 'Sınırsız',
      gender: 'Belirtilmedi',
      city: 'Belirtilmedi',
      address: '',
      mailEnabled: false,
      smsEnabled: true,
      appointments: [],
    };

    setEgitmenler([newTrainer, ...egitmenler]);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('+90 507 ');
    showToast(`Yeni eğitmen "${newTrainer.name}" (${newTrainer.branch}) eklendi.`);
  };

  // Add New Category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      showToast('Bu eğitmen kategorisi zaten mevcut.');
      return;
    }
    setCategories([...categories, trimmed]);
    setNewCategoryName('');
    showToast(`"${trimmed}" eğitmen kategorisi eklendi.`);
  };

  // Filtered List
  const filteredEgitmenler = egitmenler.filter((e) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.code.toLowerCase().includes(q) ||
      e.phone.toLowerCase().includes(q) ||
      e.facility.toLowerCase().includes(q) ||
      (e.branch && e.branch.toLowerCase().includes(q));

    const matchesCategory =
      selectedCategory === 'all' || e.branch === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Export to Excel / CSV
  const handleExportExcel = () => {
    const headers = ['Eğitmen Adı', 'E-Posta', 'Kullanıcı Kodu', 'Telefon', 'Kulüp', 'Kategori / Branş'];
    const rows = filteredEgitmenler.map((e) => [
      `"${e.name}"`,
      `"${e.email}"`,
      `"${e.code}"`,
      `"${e.phone}"`,
      `"${e.facility}"`,
      `"${e.branch || 'Futbol'}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Sporsepeti_Egitmenler_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`${filteredEgitmenler.length} eğitmen listesi Excel olarak indirildi.`);
  };

  // Export to PDF
  const handleExportPDF = () => {
    showToast('Eğitmen listesi yazdırılıyor / PDF oluşturuluyor...');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  // Toggle selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="egitmen-toast"
          className="fixed bottom-6 right-6 z-50 bg-slate-900/95 backdrop-blur-xs text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-slate-700 text-sm font-medium animate-in fade-in slide-in-from-bottom-2"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* EĞİTMENLER KATEGORİSİ / BRANŞ FİLTRELEME & YÖNETİM BARI */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-3.5 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-hidden">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 shrink-0">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden xs:inline">Kategoriler:</span>
            </div>

            {/* Category Pills (horizontally scrollable on mobile) */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap min-h-[32px] ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tümü ({egitmenler.length})
              </button>

              {categories.map((cat) => {
                const count = egitmenler.filter((e) => e.branch === cat).length;
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap min-h-[32px] ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected
                          ? 'bg-white text-blue-700 font-extrabold'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Kategori Ekle / Yönet Butonu */}
          <button
            onClick={() => setShowCategoryModal(true)}
            className="w-full sm:w-auto justify-center px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-1 transition-colors shrink-0 cursor-pointer min-h-[34px]"
            title="Yeni Eğitmen Kategorisi Ekle veya Yönet"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Kategori Yönet</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER (Matches User's Screenshot 1) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-3.5 sm:p-6">
        {/* Top Control Bar matching Screenshot 1 */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
          {/* Left: Green Plus Button + Mesaj Gönder */}
          <div className="flex items-center gap-2">
            <button
              id="btn-add-egitmen"
              onClick={() => setShowAddModal(true)}
              className="w-10 h-10 rounded-lg bg-[#188038] hover:bg-[#137333] active:scale-95 text-white flex items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer"
              title="Yeni Eğitmen Ekle"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Mesaj Gönder (Cyan Button) */}
            <button
              id="btn-egitmen-send-message"
              onClick={() => setShowMessageModal(true)}
              className="flex-1 sm:flex-initial bg-[#00c5eb] hover:bg-[#00b2d6] text-white px-3.5 py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer min-h-[40px]"
              title="Eğitmenlere Mesaj Gönder"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Mesaj Gönder</span>
            </button>
          </div>

          {/* Right: Eğitmen Ara, PDF, Excel */}
          <div className="flex items-center gap-2">
            {/* Eğitmen Ara Input */}
            <div className="relative flex-1 sm:w-56">
              <input
                id="search-egitmen"
                type="text"
                placeholder="Eğitmen Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-slate-300 rounded-lg pl-3 pr-7 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[40px]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Red PDF Button */}
            <button
              id="btn-egitmen-pdf"
              onClick={handleExportPDF}
              className="bg-[#d93025] hover:bg-[#b3261e] text-white px-3 py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center transition-all shadow-2xs cursor-pointer shrink-0 min-h-[40px]"
              title="PDF Olarak Çıkar"
            >
              <span>PDF</span>
            </button>

            {/* Green Excel Button */}
            <button
              id="btn-egitmen-excel"
              onClick={handleExportExcel}
              className="bg-[#188038] hover:bg-[#137333] text-white px-3 py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center transition-all shadow-2xs cursor-pointer shrink-0 min-h-[40px]"
              title="Excel (CSV) Olarak İndir"
            >
              <span>Excel</span>
            </button>
          </div>
        </div>

        {/* MOBILE CARDS FOR EGITMENLER (<640px) */}
        <div className="block sm:hidden space-y-3">
          {filteredEgitmenler.map((egitmen) => {
            const isSelected = selectedIds.includes(egitmen.id);
            return (
              <div
                key={egitmen.id}
                onClick={() => handleOpenEdit(egitmen)}
                className={`p-3.5 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs cursor-pointer transition-all active:scale-[0.99] ${
                  isSelected ? 'border-blue-500 bg-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-3">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(egitmen.id);
                      }}
                      className="shrink-0"
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                          isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </div>

                    <div className="w-11 h-11 rounded-full bg-[#3c4858] text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <User className="w-5 h-5 text-white" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-slate-900 text-sm leading-tight truncate">
                          {egitmen.name}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 truncate">{egitmen.email}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{egitmen.code}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                    {egitmen.branch || 'Futbol'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 bg-slate-50/60 p-2 rounded-lg">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Telefon:</span>
                    <a
                      href={`tel:${egitmen.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-medium text-slate-800 hover:text-blue-600 transition-colors"
                    >
                      {egitmen.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Kulüp:</span>
                    <span className="font-medium text-slate-800 truncate block">
                      {egitmen.facility}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(egitmen);
                    }}
                    className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors min-h-[38px]"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Profil &amp; Düzenle</span>
                  </button>
                </div>
              </div>
            );
          })}

          {filteredEgitmenler.length === 0 && (
            <div className="py-10 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Search className="w-7 h-7 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-xs text-slate-700">Seçilen kriterlere uygun eğitmen bulunamadı.</p>
            </div>
          )}
        </div>

        {/* DESKTOP TABLE (Visible on sm and larger) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold text-slate-800 select-none">
                <th className="py-3 px-2 w-10 text-center">
                  {/* Select circle header */}
                </th>
                <th className="py-3 px-3 text-slate-900 font-bold">Eğitmen</th>
                <th className="py-3 px-3 text-slate-900 font-bold">Telefon</th>
                <th className="py-3 px-3 text-slate-900 font-bold">Kulüpler</th>
                <th className="py-3 px-3 text-right text-slate-900 font-bold pr-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEgitmenler.map((egitmen) => {
                const isSelected = selectedIds.includes(egitmen.id);

                return (
                  <tr
                    key={egitmen.id}
                    onClick={() => handleOpenEdit(egitmen)}
                    className={`transition-colors group hover:bg-slate-50/90 cursor-pointer ${
                      isSelected ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    {/* Checkbox / Radio circle */}
                    <td
                      className="py-4 px-2 text-center align-middle"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(egitmen.id);
                      }}
                    >
                      <button
                        type="button"
                        className={`w-4 h-4 rounded-full border-2 transition-colors flex items-center justify-center ${
                          isSelected
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </button>
                    </td>

                    {/* Eğitmen: Avatar + Name + Email + Code + Kategori */}
                    <td className="py-4 px-3 align-middle">
                      <div className="flex items-center gap-3.5">
                        {/* Big Avatar with dark gray silhouette */}
                        <div className="w-12 h-12 rounded-full bg-[#3c4858] text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <User className="w-6 h-6 text-white" />
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-base leading-tight group-hover:text-blue-600 transition-colors">
                              {egitmen.name}
                            </h4>
                            {/* Eğitmen Kategorisi Badge */}
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                              {egitmen.branch || 'Futbol'}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 leading-snug">
                            {egitmen.email}
                          </p>
                          <p className="text-xs text-slate-500 font-mono font-medium">
                            {egitmen.code}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Telefon */}
                    <td className="py-4 px-3 align-middle text-sm text-slate-800 font-medium whitespace-nowrap">
                      {egitmen.phone}
                    </td>

                    {/* Spor İşletmesi */}
                    <td className="py-4 px-3 align-middle text-sm text-slate-800 whitespace-nowrap">
                      {egitmen.facility}
                    </td>

                    {/* Action: Blue Silhouette User Icon matching Screenshot 1 */}
                    <td className="py-4 px-3 pr-4 align-middle text-right whitespace-nowrap">
                      <button
                        id={`btn-edit-egitmen-${egitmen.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(egitmen);
                        }}
                        className="p-1.5 rounded-lg text-[#00c5eb] hover:text-[#009bb8] hover:bg-cyan-50 transition-all cursor-pointer"
                        title="Eğitmen Güncelle & Detay"
                      >
                        <User className="w-5 h-5 fill-current" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredEgitmenler.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-8 h-8 text-slate-300 mb-2" />
                      <p className="font-semibold text-slate-700">Seçilen kriterlere uygun eğitmen bulunamadı.</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Kategori filtresini veya arama kutusunu temizleyerek tekrar deneyebilirsiniz.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>Toplam {filteredEgitmenler.length} eğitmen listeleniyor</span>
          <div className="flex items-center gap-3">
            <span>Kategoriler: {categories.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* EĞİTMEN GÜNCELLE MODAL (MATCHES SCREENSHOT 2 EXACTLY) */}
      {editingEgitmen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-slate-900">
                Eğitmen Güncelle
              </h3>
              <button
                onClick={() => setEditingEgitmen(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                title="Kapat"
              >
                <X className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>

            {/* Modal Body: Left Profile Details & Right Tabs/Form */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column (Avatar + Key/Image buttons + Metadata) */}
              <div className="md:col-span-4 flex flex-col items-start space-y-4 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
                <div className="flex items-start gap-3">
                  {/* Large Avatar */}
                  <div className="w-24 h-24 rounded-full bg-[#3c4858] flex items-center justify-center text-white shrink-0 shadow-sm">
                    <User className="w-14 h-14 text-slate-200" />
                  </div>

                  {/* Photo & Key Action Buttons matching Screenshot 2 */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <button
                      type="button"
                      onClick={() => showToast('Fotoğraf yükleme penceresi açıldı.')}
                      className="w-8 h-8 rounded-lg bg-slate-600 hover:bg-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Fotoğraf Yükle / Değiştir"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast(`Şifre sıfırlama kodu ${editingEgitmen.phone} numarasına SMS ile iletildi.`)}
                      className="w-8 h-8 rounded-lg bg-slate-600 hover:bg-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Şifre Sıfırla / Yetki Anahtarı"
                    >
                      <KeyRound className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Metadata List matching Screenshot 2 */}
                <div className="space-y-1 text-xs text-slate-700 w-full pt-1">
                  <p>
                    <span className="font-bold">Kullanıcı Kodu:</span>{' '}
                    <span className="font-mono font-medium">{editingEgitmen.code}</span>
                  </p>
                  <p>
                    <span className="font-bold">Hesap Süresi:</span>{' '}
                    <span>{editingEgitmen.accountDuration || 'Sınırsız'}</span>
                  </p>
                  <p>
                    <span className="font-bold">Cinsiyet:</span>{' '}
                    <span>{editGender}</span>
                  </p>
                  <p>
                    <span className="font-bold">Şehir:</span>{' '}
                    <span>{editCity}</span>
                  </p>
                  <p>
                    <span className="font-bold">Adres:</span>{' '}
                    <span>{editAddress || '-'}</span>
                  </p>
                </div>
              </div>

              {/* Right Column (Tabs: Eğitmen | Randevular + Form) */}
              <div className="md:col-span-8 space-y-4">
                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActiveModalTab('egitmen')}
                    className={`pb-2.5 text-sm font-bold transition-all relative cursor-pointer ${
                      activeModalTab === 'egitmen'
                        ? 'text-slate-900 border-b-2 border-slate-900'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Eğitmen
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModalTab('randevular')}
                    className={`pb-2.5 text-sm font-bold transition-all relative cursor-pointer flex items-center gap-1.5 ${
                      activeModalTab === 'randevular'
                        ? 'text-slate-900 border-b-2 border-slate-900'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <span>Randevular</span>
                    {editingEgitmen.appointments && editingEgitmen.appointments.length > 0 && (
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        {editingEgitmen.appointments.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* Tab 1: Eğitmen Form */}
                {activeModalTab === 'egitmen' && (
                  <form onSubmit={handleSaveEdit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Ad Soyad */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Ad Soyad
                        </label>
                        <input
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Telefon */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Telefon
                        </label>
                        <input
                          type="text"
                          required
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Email Adresi */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Email Adresi
                        </label>
                        <input
                          type="email"
                          required
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Branş / Eğitmen Kategorisi Dropdown matching Screenshot 2 */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-slate-800">
                            Branş (Eğitmen Kategorisi)
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowCategoryModal(true)}
                            className="text-[11px] text-blue-600 hover:underline"
                          >
                            + Yeni Kategori
                          </button>
                        </div>
                        <select
                          value={editBranch}
                          onChange={(e) => setEditBranch(e.target.value)}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Checkboxes matching Screenshot 2 */}
                    <div className="space-y-2 pt-2">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editMailEnabled}
                          onChange={(e) => setEditMailEnabled(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500"
                        />
                        <span>Mail Gönderimini Aktifleştir</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editSmsEnabled}
                          onChange={(e) => setEditSmsEnabled(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500"
                        />
                        <span>SMS Gönderimini Aktifleştir</span>
                      </label>
                    </div>

                    {/* Bottom Right Blue "Kaydet" Button matching Screenshot 2 */}
                    <div className="pt-4 flex items-center justify-end">
                      <button
                        type="submit"
                        className="bg-[#007bff] hover:bg-[#0069d9] active:bg-[#0062cc] text-white font-medium text-sm px-6 py-2 rounded-md shadow-2xs transition-all cursor-pointer"
                      >
                        Kaydet
                      </button>
                    </div>
                  </form>
                )}

                {/* Tab 2: Randevular */}
                {activeModalTab === 'randevular' && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500">
                      <b>{editingEgitmen.name}</b> için planlanmış özel antrenman ve ders randevuları:
                    </p>

                    {editingEgitmen.appointments && editingEgitmen.appointments.length > 0 ? (
                      <div className="space-y-2">
                        {editingEgitmen.appointments.map((app) => (
                          <div
                            key={app.id}
                            className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs"
                          >
                            <div className="space-y-0.5">
                              <p className="font-bold text-slate-800 text-sm">{app.title}</p>
                              <p className="text-slate-600 flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                <span>{app.date}</span>
                                <Clock className="w-3.5 h-3.5 text-slate-400 ml-1" />
                                <span>{app.time}</span>
                              </p>
                              <p className="text-slate-500">Sporcu: <b>{app.student}</b></p>
                            </div>
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[11px]">
                              {app.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="text-xs font-semibold text-slate-600">Henüz planlanmış randevu bulunmuyor.</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Antrenman Takvimi üzerinden bu eğitmene ders atayabilirsiniz.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* YENİ EĞİTMEN EKLE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#188038] text-white flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Yeni Eğitmen Ekle</h3>
                  <p className="text-xs text-slate-500">Spor okulu eğitmen kadrosuna yeni antrenör ekleyin</p>
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
                  Eğitmen Adı Soyadı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Caner Demir"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Adresi *
                </label>
                <input
                  type="email"
                  required
                  placeholder="caner@sporokulu.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Telefon Numarası
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Eğitmen Kategorisi / Branş
                  </label>
                  <select
                    value={newBranch}
                    onChange={(e) => setNewBranch(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kulüp
                </label>
                <input
                  type="text"
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
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
                  <span>Eğitmeni Kaydet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KATEGORİ YÖNETİMİ MODALI */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Eğitmen Kategorileri</h3>
              </div>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Yeni Kategori Adı (örn: Boks)"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs cursor-pointer"
                >
                  Ekle
                </button>
              </form>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pt-1">
                <p className="text-xs font-semibold text-slate-500">Mevcut Kategoriler:</p>
                {categories.map((cat) => {
                  const count = egitmenler.filter((e) => e.branch === cat).length;
                  return (
                    <div
                      key={cat}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                    >
                      <span className="font-semibold text-slate-800">{cat}</span>
                      <span className="text-slate-500 text-[11px]">{count} Eğitmen</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MESAJ GÖNDER MODAL */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#00c5eb] text-white flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Eğitmenlere Mesaj Gönder</h3>
                  <p className="text-xs text-slate-500">
                    {selectedIds.length > 0
                      ? `Seçili ${selectedIds.length} eğitmene mesaj iletin`
                      : `Tüm eğitmen kadrosuna (${egitmenler.length}) bildiri gönderin`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMessageModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mesaj Metni
                </label>
                <textarea
                  rows={4}
                  placeholder="Antrenman programı veya duyuru metnini yazınız..."
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMessageModal(false);
                    showToast('Mesaj başarıyla eğitmenlere iletildi.');
                  }}
                  className="px-5 py-2 rounded-lg bg-[#00c5eb] hover:bg-[#00b2d6] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gönder</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
