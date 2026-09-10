import React, { useState } from 'react';
import {
  Package,
  Users,
  Building,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  Filter,
  Plus,
  Send,
} from 'lucide-react';
import {
  INITIAL_PACKAGES,
  INITIAL_FACILITY_STATS,
  INITIAL_SUPPORT_TICKETS,
} from '../../data/mockData';
import { SupportTicket } from '../../types';

export const DashboardView: React.FC = () => {
  const [packages, setPackages] = useState(INITIAL_PACKAGES);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('baslangic');
  const [facilityStats, setFacilityStats] = useState(INITIAL_FACILITY_STATS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showReplySuccess, setShowReplySuccess] = useState(false);

  const selectedPackage =
    packages.find((p) => p.id === selectedPackageId) || packages[0];

  const filteredUsers = selectedPackage.users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.code.includes(userSearchQuery)
  );

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    setSupportTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id ? { ...t, status: 'Cevaplandı' as const } : t
      )
    );
    setShowReplySuccess(true);
    setReplyText('');
    setTimeout(() => {
      setShowReplySuccess(false);
      setSelectedTicket(null);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Section: Paketler & Kullanıcı Listesi (Screenshot 5) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Header matching the vibrant blue header in screenshot 5 */}
        <div className="bg-blue-600 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-blue-100" />
            <h2 className="text-xl font-bold tracking-tight">
              Paketler &amp; Kullanıcı Listesi
            </h2>
          </div>
          <span className="text-xs font-medium bg-blue-500/50 px-3 py-1 rounded-full text-blue-50 border border-blue-400/30">
            Aktif Yönetim
          </span>
        </div>

        {/* 3 Columns Layout matching Screenshot 5 */}
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Column 1: Packages List */}
          <div className="md:col-span-3 p-4 bg-slate-50/50">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
              Paket Türü
            </h3>
            <div className="space-y-1.5">
              {packages.map((pkg) => {
                const isSelected = pkg.id === selectedPackageId;
                return (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200 ring-2 ring-blue-500/20'
                        : 'text-slate-600 hover:bg-white/80 hover:text-slate-900 border border-transparent font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isSelected ? 'bg-blue-600' : 'bg-slate-300 group-hover:bg-slate-400'
                        }`}
                      />
                      <span className="text-sm">{pkg.name}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-400 bg-slate-100'
                      }`}
                    >
                      {pkg.users.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 2: Users in selected package */}
          <div className="md:col-span-5 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3 px-1">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  {selectedPackage.name} Kullanıcıları
                </h3>
                <p className="text-xs text-slate-500">
                  Toplam {selectedPackage.users.length} kayıtlı kullanıcı
                </p>
              </div>
            </div>

            {/* Quick user search */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Kullanıcı veya kod ara..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>

            {/* Users list matching the screenshot style */}
            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((usr, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl transition-colors flex items-center justify-between text-sm group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-semibold text-xs group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        {usr.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-800">
                        {usr.name}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200/60">
                      {usr.code}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  Kullanıcı bulunamadı
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Facility / Discipline stats */}
          <div className="md:col-span-4 p-4 bg-slate-50/30 flex flex-col">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">
              Branş &amp; Tesis Dağılımı
            </h3>
            <div className="space-y-2 overflow-y-auto max-h-80 pr-1">
              {facilityStats.map((stat) => (
                <div
                  key={stat.id}
                  className="flex items-center justify-between p-2.5 bg-white border border-slate-200/70 rounded-xl hover:border-blue-200 transition-colors"
                >
                  <span className="text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                    {stat.name}
                  </span>
                  <span className="min-w-7 h-6 px-2 flex items-center justify-center text-xs font-bold text-white bg-blue-600 rounded-lg shadow-2xs">
                    {stat.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Bottom Section: Destek Talepleri (Screenshot 5) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-blue-100" />
            <h2 className="text-xl font-bold tracking-tight">
              Destek Talepleri
            </h2>
          </div>
          <span className="text-xs font-medium bg-blue-500/50 px-3 py-1 rounded-full text-blue-50 border border-blue-400/30">
            {supportTickets.filter((t) => t.status === 'Açık').length} Bekleyen Talep
          </span>
        </div>

        {/* Tickets Content */}
        <div className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="pb-3 px-3">Talep No &amp; Konu</th>
                  <th className="pb-3 px-3">Kullanıcı</th>
                  <th className="pb-3 px-3">Tarih</th>
                  <th className="pb-3 px-3">Öncelik</th>
                  <th className="pb-3 px-3">Durum</th>
                  <th className="pb-3 px-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {supportTickets.map((ticket) => {
                  const getStatusBadge = (status: SupportTicket['status']) => {
                    switch (status) {
                      case 'Açık':
                        return 'bg-rose-50 text-rose-700 border-rose-200';
                      case 'Cevaplandı':
                        return 'bg-blue-50 text-blue-700 border-blue-200';
                      case 'Beklemede':
                        return 'bg-amber-50 text-amber-700 border-amber-200';
                      case 'Çözüldü':
                        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
                    }
                  };

                  return (
                    <tr
                      key={ticket.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-800">
                          {ticket.subject}
                        </div>
                        <span className="text-xs font-mono text-slate-400">
                          {ticket.id}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-slate-800">
                          {ticket.userName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {ticket.userEmail}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-xs text-slate-600">
                        {ticket.date}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            ticket.priority === 'Yüksek'
                              ? 'bg-rose-100 text-rose-800'
                              : ticket.priority === 'Orta'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusBadge(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          Yanıtla / İncele
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-800 text-base">
                  Destek Talebini Yanıtla
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {selectedTicket.id} - {selectedTicket.userName}
                </p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                &times;
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  Konu:
                </span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                  {selectedTicket.subject}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Kullanıcı: {selectedTicket.userName} ({selectedTicket.userEmail})
                </p>
              </div>

              {showReplySuccess ? (
                <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 className="w-5 h-5" />
                  Yanıtınız başarıyla kullanıcıya iletildi!
                </div>
              ) : (
                <form onSubmit={handleSendReply} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Destek Yanıtınız
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Kullanıcıya iletilecek mesajınızı buraya yazınız..."
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTicket(null)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Yanıtı Gönder
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
