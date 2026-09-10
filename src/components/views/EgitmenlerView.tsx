import React, { useState } from 'react';
import {
  Plus,
  Send,
  Search,
  FileText,
  FileSpreadsheet,
  User,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  Calendar,
  X,
  Award,
} from 'lucide-react';
import { INITIAL_EGITMENLER } from '../../data/mockData';
import { EgitmenItem } from '../../types';

export const EgitmenlerView: React.FC = () => {
  const [egitmenler, setEgitmenler] = useState<EgitmenItem[]>(INITIAL_EGITMENLER);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [viewingEgitmen, setViewingEgitmen] = useState<EgitmenItem | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('+90 ');
  const [formFacility, setFormFacility] = useState('aicosports');

  // Message modal
  const [messageContent, setMessageContent] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAddEgitmen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const newEgitmen: EgitmenItem = {
      id: `e-${Date.now()}`,
      name: formName,
      email: formEmail,
      code,
      phone: formPhone,
      facility: formFacility,
    };

    setEgitmenler([newEgitmen, ...egitmenler]);
    setShowAddModal(false);
    setFormName('');
    setFormEmail('');
    setFormPhone('+90 ');
    triggerToast(`Eğitmen ${formName} başarıyla eklendi.`);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim()) return;
    setShowMessageModal(false);
    setMessageContent('');
    triggerToast(`Mesaj tüm eğitmenlere iletildi.`);
  };

  const handleExportExcel = () => {
    triggerToast('Eğitmen listesi Excel olarak aktarılıyor...');
    setTimeout(() => {
      const headers = ['Eğitmen Adı', 'E-posta', 'Eğitmen Kodu', 'Telefon', 'Spor İşletmesi'];
      const rows = egitmenler.map((e) => [
        e.name,
        e.email,
        e.code,
        e.phone,
        e.facility,
      ]);
      const csvContent =
        'data:text/csv;charset=utf-8,\uFEFF' +
        [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Egitmen_Listesi_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast('Excel başarıyla indirildi.');
    }, 500);
  };

  const handleExportPDF = () => {
    triggerToast('PDF Eğitmen Listesi hazırlanıyor...');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const filteredEgitmenler = egitmenler.filter((e) => {
    const q = searchQuery.toLowerCase();
    return (
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.code.includes(q) ||
      e.facility.toLowerCase().includes(q) ||
      e.phone.includes(q)
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
        {/* Top Control Bar matching Screenshot 9 */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
          {/* Action buttons on the left */}
          <div className="flex items-center gap-2">
            {/* Green "+" button */}
            <button
              id="btn-add-egitmen"
              onClick={() => setShowAddModal(true)}
              className="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center shadow-xs transition-colors"
              title="Yeni Eğitmen Ekle"
            >
              <Plus className="w-5 h-5" />
            </button>

            {/* Cyan "Mesaj Gönder" button */}
            <button
              id="btn-egitmen-send-message"
              onClick={() => setShowMessageModal(true)}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
              Mesaj Gönder
            </button>
          </div>

          {/* Search, PDF, Excel on the right */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Eğitmen Ara"
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

        {/* Table matching Screenshot 9 */}
        <div className="overflow-x-auto pt-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold text-slate-700">
                <th className="pb-3 px-3 w-10"></th>
                <th className="pb-3 px-3">Eğitmen</th>
                <th className="pb-3 px-3">Telefon</th>
                <th className="pb-3 px-3">Spor İşletmesi</th>
                <th className="pb-3 px-3 text-right">Profil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEgitmenler.length > 0 ? (
                filteredEgitmenler.map((egitmen) => {
                  const isChecked = selectedId === egitmen.id;

                  return (
                    <tr
                      key={egitmen.id}
                      onClick={() => setSelectedId(egitmen.id)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        isChecked ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      {/* Radio / Checkbox */}
                      <td className="py-4 px-3">
                        <input
                          type="radio"
                          name="selectedEgitmen"
                          checked={isChecked}
                          onChange={() => setSelectedId(egitmen.id)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                      </td>

                      {/* Eğitmen: Avatar silhouette + Name + Email + Code */}
                      <td className="py-4 px-3">
                        <div className="flex items-start gap-3.5">
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
                              {egitmen.name}
                            </p>
                            <p className="text-xs text-slate-500 font-medium">
                              {egitmen.email}
                            </p>
                            <p className="text-xs font-mono font-semibold text-slate-700">
                              {egitmen.code}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Telefon */}
                      <td className="py-4 px-3 whitespace-nowrap text-sm font-semibold text-slate-700">
                        {egitmen.phone}
                      </td>

                      {/* Spor İşletmesi */}
                      <td className="py-4 px-3 whitespace-nowrap text-sm font-semibold text-slate-800">
                        {egitmen.facility}
                      </td>

                      {/* Profil Action button matching Screenshot 9 */}
                      <td className="py-4 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingEgitmen(egitmen);
                          }}
                          className="p-2 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-xl transition-colors inline-flex items-center gap-1.5 font-semibold text-xs border border-cyan-200/70"
                          title="Eğitmen Detayını Görüntüle"
                        >
                          <User className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Arama kriterine uygun eğitmen bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Yeni Eğitmen Ekle */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                Yeni Eğitmen Ekle
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddEgitmen} className="py-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Eğitmen Adı Soyadı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Ali Özcan"
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
                  placeholder="Örn: alizcn07@gmail.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Telefon Numarası
                </label>
                <input
                  type="text"
                  placeholder="+90 5XX XXX XX XX"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Spor İşletmesi
                </label>
                <select
                  value={formFacility}
                  onChange={(e) => setFormFacility(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                >
                  <option value="aicosports">aicosports</option>
                  <option value="Saraçgym">Saraçgym</option>
                  <option value="DigiMondi">DigiMondi</option>
                  <option value="Selman Utku Stüdyo">Selman Utku Stüdyo</option>
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
                  Eğitmeni Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Mesaj Gönder */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Send className="w-5 h-5 text-cyan-600" />
                Eğitmenlere Mesaj Gönder
              </h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="py-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Duyuru &amp; Bildirim Metni *
                </label>
                <textarea
                  required
                  rows={4}
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Eğitmenlere iletilecek mesajınızı buraya yazınız..."
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
                  Gönder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Eğitmen Profil Detayı */}
      {viewingEgitmen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">
                Eğitmen Profili
              </h3>
              <button
                onClick={() => setViewingEgitmen(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                &times;
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                  {viewingEgitmen.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">
                    {viewingEgitmen.name}
                  </h4>
                  <p className="text-xs font-semibold text-blue-600">
                    Kod: {viewingEgitmen.code}
                  </p>
                  <p className="text-xs text-slate-500">
                    {viewingEgitmen.facility}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">E-posta:</span>
                  <span className="font-semibold text-slate-800">{viewingEgitmen.email}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Telefon:</span>
                  <span className="font-semibold text-slate-800">{viewingEgitmen.phone}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-slate-500">Bağlı İşletme:</span>
                  <span className="font-semibold text-slate-800">{viewingEgitmen.facility}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setViewingEgitmen(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
