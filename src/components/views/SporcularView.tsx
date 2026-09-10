import React, { useState } from 'react';
import {
  Plus,
  UploadCloud,
  ClipboardList,
  Link2,
  Send,
  Search,
  FileText,
  FileSpreadsheet,
  Check,
  Edit2,
  Trash2,
  X,
  Copy,
  CheckCircle2,
  QrCode,
  FileUp,
} from 'lucide-react';
import { INITIAL_SPORCULAR } from '../../data/mockData';
import { SporcuItem } from '../../types';

export const SporcularView: React.FC = () => {
  const [sporcular, setSporcular] = useState<SporcuItem[]>(INITIAL_SPORCULAR);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreRegModal, setShowPreRegModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [editingSporcu, setEditingSporcu] = useState<SporcuItem | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formFacility, setFormFacility] = useState('DigiMondi');

  // Pre-registration list mock
  const [preRegistrations, setPreRegistrations] = useState([
    { id: 'pr-1', name: 'Barış Koçak', email: 'baris.k@gmail.com', phone: '+90 530 111 22 33', facility: 'Saraçgym', date: '09.09.2024' },
    { id: 'pr-2', name: 'Ezgi Yılmaz', email: 'ezgiyilmaz@gmail.com', phone: '+90 535 999 88 77', facility: 'DigiMondi', date: '08.09.2024' },
  ]);

  // Invite link
  const [copiedLink, setCopiedLink] = useState(false);
  const inviteUrl = 'https://sportsfly.app/davet/sporsepeti-sporcu-kayit?ref=digimondi-422';

  // Message modal state
  const [messageChannel, setMessageChannel] = useState<'sms' | 'email'>('sms');
  const [messageContent, setMessageContent] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleActive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSporcular((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
    triggerToast('Sporcu aktiflik durumu güncellendi.');
  };

  const handleAddSporcu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date();
    const formattedDate = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;

    const newSporcu: SporcuItem = {
      id: `s-${Date.now()}`,
      name: formName,
      email: formEmail,
      code,
      date: formattedDate,
      facility: formFacility,
      isActive: true,
    };

    setSporcular([newSporcu, ...sporcular]);
    setShowAddModal(false);
    setFormName('');
    setFormEmail('');
    triggerToast(`Yeni sporcu ${formName} başarıyla eklendi.`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSporcu) return;

    setSporcular((prev) =>
      prev.map((s) => (s.id === editingSporcu.id ? editingSporcu : s))
    );
    setEditingSporcu(null);
    triggerToast('Sporcu bilgileri güncellendi.');
  };

  const handleApprovePreReg = (item: typeof preRegistrations[0]) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const newSporcu: SporcuItem = {
      id: `s-${Date.now()}`,
      name: item.name,
      email: item.email,
      code,
      date: item.date,
      facility: item.facility,
      isActive: true,
    };
    setSporcular([newSporcu, ...sporcular]);
    setPreRegistrations(preRegistrations.filter((p) => p.id !== item.id));
    triggerToast(`${item.name} ön kaydı onaylanarak sporcu listesine eklendi.`);
  };

  const handleExportExcel = () => {
    triggerToast('Sporcu listesi Excel olarak dışa aktarılıyor...');
    setTimeout(() => {
      const headers = ['Sporcu Adı', 'E-posta', 'Sporcu Kodu', 'Kayıt Tarihi', 'İşletme', 'Aktif'];
      const rows = sporcular.map((s) => [
        s.name,
        s.email,
        s.code,
        s.date,
        s.facility,
        s.isActive ? 'Aktif' : 'Pasif',
      ]);
      const csvContent =
        'data:text/csv;charset=utf-8,\uFEFF' +
        [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Sporcu_Listesi_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast('Excel başarıyla indirildi.');
    }, 500);
  };

  const handleExportPDF = () => {
    triggerToast('PDF Sporcu Raporu oluşturuluyor...');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim()) return;
    setShowMessageModal(false);
    setMessageContent('');
    triggerToast(`Mesaj ${sporcular.length} sporcuya başarıyla gönderildi.`);
  };

  const filteredSporcular = sporcular.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.code.includes(q) ||
      s.facility.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6">
        {/* Top Control Bar matching Screenshot 8 exactly */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
          {/* Action buttons on the left matching Screenshot 8 */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Green "+" button */}
            <button
              id="btn-add-sporcu"
              onClick={() => setShowAddModal(true)}
              className="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center shadow-xs transition-colors"
              title="Yeni Sporcu Ekle"
            >
              <Plus className="w-5 h-5" />
            </button>

            {/* Blue "Sporcu Yükle" button */}
            <button
              id="btn-upload-sporcu"
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              Sporcu Yükle
            </button>

            {/* Dark gray "Ön Kayıt" button */}
            <button
              id="btn-pre-reg"
              onClick={() => setShowPreRegModal(true)}
              className="px-4 py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <ClipboardList className="w-4 h-4" />
              Ön Kayıt ({preRegistrations.length})
            </button>

            {/* Red "Davet Linki Oluştur" button */}
            <button
              id="btn-invite-link"
              onClick={() => setShowInviteModal(true)}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Link2 className="w-4 h-4" />
              Davet Linki Oluştur
            </button>

            {/* Cyan "Mesaj Gönder" button */}
            <button
              id="btn-send-message"
              onClick={() => setShowMessageModal(true)}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
              Mesaj Gönder
            </button>
          </div>

          {/* Search, PDF, Excel on the right matching Screenshot 8 */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Sporcu Ara"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium"
              />
            </div>

            {/* Red "PDF" button */}
            <button
              onClick={handleExportPDF}
              className="px-3.5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1 shadow-xs transition-colors"
              title="PDF İndir"
            >
              <FileText className="w-4 h-4" />
              PDF
            </button>

            {/* Green "Excel" button */}
            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1 shadow-xs transition-colors"
              title="Excel İndir"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel
            </button>
          </div>
        </div>

        {/* Table matching Screenshot 8 */}
        <div className="overflow-x-auto pt-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold text-slate-700">
                <th className="pb-3 px-3 w-10"></th>
                <th className="pb-3 px-3">Sporcu</th>
                <th className="pb-3 px-3">Tarih</th>
                <th className="pb-3 px-3">İşletme/Bireysel Adı</th>
                <th className="pb-3 px-3 text-center">Aktif</th>
                <th className="pb-3 px-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSporcular.length > 0 ? (
                filteredSporcular.map((sporcu) => {
                  const isChecked = selectedId === sporcu.id;

                  return (
                    <tr
                      key={sporcu.id}
                      onClick={() => setSelectedId(sporcu.id)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        isChecked ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-4 px-3">
                        <input
                          type="radio"
                          name="selectedSporcu"
                          checked={isChecked}
                          onChange={() => setSelectedId(sporcu.id)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                      </td>

                      {/* Sporcu: Avatar + Name + Email + Code */}
                      <td className="py-4 px-3">
                        <div className="flex items-start gap-3.5">
                          {/* Silhouette Avatar matching screenshot */}
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
                              {sporcu.name}
                            </p>
                            <p className="text-xs text-slate-500 font-medium">
                              {sporcu.email}
                            </p>
                            <p className="text-xs font-mono font-semibold text-slate-700">
                              {sporcu.code}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Tarih */}
                      <td className="py-4 px-3 whitespace-nowrap text-sm font-medium text-slate-700">
                        {sporcu.date}
                      </td>

                      {/* İşletme/Bireysel Adı */}
                      <td className="py-4 px-3 whitespace-nowrap text-sm font-semibold text-slate-800">
                        {sporcu.facility}
                      </td>

                      {/* Aktif: Green checkmark in screenshot */}
                      <td className="py-4 px-3 text-center">
                        <button
                          onClick={(e) => handleToggleActive(sporcu.id, e)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            sporcu.isActive
                              ? 'text-emerald-600 hover:bg-emerald-50'
                              : 'text-slate-300 hover:bg-slate-100'
                          }`}
                          title={sporcu.isActive ? 'Aktif (Pasif yap)' : 'Pasif (Aktif yap)'}
                        >
                          <Check
                            className={`w-6 h-6 stroke-[2.5] ${
                              sporcu.isActive ? 'text-emerald-600' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions: Edit pencil in screenshot */}
                      <td className="py-4 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSporcu(sporcu);
                          }}
                          className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-colors inline-flex items-center gap-1.5 font-semibold text-xs border border-amber-200/70"
                          title="Sporcu Bilgilerini Düzenle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Arama kriterine uygun sporcu bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Yeni Sporcu Ekle */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                Yeni Sporcu Ekle
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddSporcu} className="py-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sporcu Adı Soyadı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Selman Utku"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
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
                  placeholder="Örn: selmanutkumarmara@gmail.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  İşletme / Bireysel Adı
                </label>
                <select
                  value={formFacility}
                  onChange={(e) => setFormFacility(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                >
                  <option value="DigiMondi">DigiMondi</option>
                  <option value="Selman Utku">Selman Utku</option>
                  <option value="Saraçgym">Saraçgym</option>
                  <option value="aicosports">aicosports</option>
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
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                >
                  Sporcuyu Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Sporcu Yükle (Excel/CSV drag-drop) */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-blue-600" />
                Toplu Sporcu Yükleme (Excel / CSV)
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                &times;
              </button>
            </div>

            <div className="py-5 space-y-4">
              <div className="border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-2xl p-8 text-center bg-blue-50/40 transition-colors cursor-pointer">
                <FileUp className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-800">
                  Excel veya CSV dosyanızı buraya sürükleyin
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  veya dosya seçmek için tıklayın (.xlsx, .xls, .csv)
                </p>
                <input
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  className="hidden"
                  id="excel-file-input"
                  onChange={() => {
                    setShowUploadModal(false);
                    triggerToast('Dosyadaki 12 sporcu başarıyla aktarıldı!');
                  }}
                />
                <label
                  htmlFor="excel-file-input"
                  className="inline-block mt-4 px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
                >
                  Dosya Seç
                </label>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-xs text-slate-600">
                <span className="font-semibold text-slate-800 block mb-1">
                  Örnek Şablon Sütunları:
                </span>
                Ad Soyad, E-posta, Telefon, İşletme Adı, Lisans/Sporcu Kodu
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Ön Kayıt Listesi */}
      {showPreRegModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-slate-600" />
                Ön Kayıt Talepleri ({preRegistrations.length})
              </h3>
              <button
                onClick={() => setShowPreRegModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                &times;
              </button>
            </div>

            <div className="py-4 space-y-3 max-h-80 overflow-y-auto">
              {preRegistrations.length > 0 ? (
                preRegistrations.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.email} • {item.phone}</p>
                      <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-1 inline-block">
                        {item.facility} • {item.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleApprovePreReg(item)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                      >
                        Onayla &amp; Ekle
                      </button>
                      <button
                        onClick={() => {
                          setPreRegistrations(preRegistrations.filter((p) => p.id !== item.id));
                          triggerToast('Ön kayıt reddedildi.');
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Reddet"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-xs text-slate-400">
                  Bekleyen ön kayıt bulunmamaktadır.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Davet Linki Oluştur */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Link2 className="w-5 h-5 text-rose-600" />
                Sporcu Davet Linki Oluştur
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                &times;
              </button>
            </div>

            <div className="py-4 space-y-4">
              <p className="text-xs text-slate-600">
                Bu davet bağlantısını sporcularınızla paylaşarak onların kendi bilgilerini ve sporcu kayıt formunu doldurmalarını sağlayabilirsiniz.
              </p>

              <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <input
                  type="text"
                  readOnly
                  value={inviteUrl}
                  className="bg-transparent text-xs text-slate-700 font-mono flex-1 outline-hidden"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(inviteUrl);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedLink ? 'Kopyalandı' : 'Kopyala'}
                </button>
              </div>

              <div className="flex items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200/60">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white border border-slate-300 rounded-lg mx-auto flex items-center justify-center shadow-xs">
                    <QrCode className="w-20 h-20 text-slate-800" />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-2 block">
                    Karekod ile Anında Katılım
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 5: Mesaj Gönder */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Send className="w-5 h-5 text-cyan-600" />
                Sporculara Toplu Mesaj Gönder
              </h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="py-4 space-y-3">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="msgChannel"
                    checked={messageChannel === 'sms'}
                    onChange={() => setMessageChannel('sms')}
                    className="text-cyan-600 focus:ring-cyan-500"
                  />
                  SMS Bildirimi
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="msgChannel"
                    checked={messageChannel === 'email'}
                    onChange={() => setMessageChannel('email')}
                    className="text-cyan-600 focus:ring-cyan-500"
                  />
                  E-Posta Bülteni
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mesaj Metni *
                </label>
                <textarea
                  required
                  rows={4}
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Sporculara iletilecek duyuru veya mesaj metni..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Gönder ({filteredSporcular.length} Sporcu)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 6: Sporcu Bilgilerini Düzenle */}
      {editingSporcu && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-amber-600" />
                Sporcu Bilgilerini Düzenle
              </h3>
              <button
                onClick={() => setEditingSporcu(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="py-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  required
                  value={editingSporcu.name}
                  onChange={(e) =>
                    setEditingSporcu({ ...editingSporcu, name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  E-posta
                </label>
                <input
                  type="email"
                  required
                  value={editingSporcu.email}
                  onChange={(e) =>
                    setEditingSporcu({ ...editingSporcu, email: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  İşletme / Bireysel Adı
                </label>
                <input
                  type="text"
                  required
                  value={editingSporcu.facility}
                  onChange={(e) =>
                    setEditingSporcu({ ...editingSporcu, facility: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSporcu(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
                >
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
