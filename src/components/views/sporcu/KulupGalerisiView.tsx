import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Search,
  Plus,
  Filter,
  Building,
  User,
  Calendar,
  Download,
  Trash2,
  ZoomIn,
  X,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import { KulupGaleriItem, KulupGaleriKategori, SporcuItem, NavPage } from '../../../types';
import {
  getStoredKulupGaleri,
  saveStoredKulupGaleri,
} from '../../../data/kulupEvrakGaleriData';
import { INITIAL_SPORCULAR } from '../../../data/mockData';

interface KulupGalerisiViewProps {
  sporcular?: SporcuItem[];
  onSelectSporcu?: (sporcu: SporcuItem) => void;
  selectedClubFilter?: string;
  onToast?: (msg: string) => void;
  onNavigate?: (page: NavPage) => void;
}

const PRESET_GALLERY_IMAGES = [
  {
    title: 'Basketbol Pota Altı & Turnike',
    url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1000&auto=format&fit=crop&q=80',
  },
  {
    title: 'Şampiyonluk Kupası & Takım',
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1000&auto=format&fit=crop&q=80',
  },
  {
    title: 'Kondisyon & Çabukluk Parkuru',
    url: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=1000&auto=format&fit=crop&q=80',
  },
  {
    title: 'Yarı Saha Taktik Çalışması',
    url: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=1000&auto=format&fit=crop&q=80',
  },
  {
    title: 'Voleybol File Önü Hücum',
    url: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=1000&auto=format&fit=crop&q=80',
  },
  {
    title: 'Yaz Kampı Toplu Fotoğraf',
    url: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1000&auto=format&fit=crop&q=80',
  },
];

export const KulupGalerisiView: React.FC<KulupGalerisiViewProps> = ({
  sporcular = INITIAL_SPORCULAR,
  onSelectSporcu,
  selectedClubFilter = 'all',
  onToast,
  onNavigate,
}) => {
  const safeSporcular = Array.isArray(sporcular) && sporcular.length > 0 ? sporcular : INITIAL_SPORCULAR;
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    if (onToast) onToast(msg);
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [galeri, setGaleri] = useState<KulupGaleriItem[]>(() =>
    getStoredKulupGaleri()
  );
  const [selectedClub, setSelectedClub] = useState<string>(selectedClubFilter);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formClub, setFormClub] = useState('DigiMondi');
  const [formCategory, setFormCategory] = useState<KulupGaleriKategori>('Antrenman');
  const [formDate, setFormDate] = useState(() => {
    const d = new Date();
    return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
  });
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTaggedAthletes, setFormTaggedAthletes] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Distinct clubs
  const clubList = Array.from(
    new Set([
      'DigiMondi',
      'Saraçgym',
      'aicosports',
      'Selman Utku',
      ...(galeri || []).map((g) => g.club),
    ])
  ).filter(Boolean);

  // Filter photos
  const filteredGaleri = (galeri || []).filter((item) => {
    if (selectedClub !== 'all' && item.club !== selectedClub) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchClub = item.club.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q) || false;
      const matchTagged = item.taggedAthletes?.some((a) => a.toLowerCase().includes(q)) || false;
      return matchTitle || matchClub || matchDesc || matchTagged;
    }
    return true;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormImageUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleToggleTaggedAthlete = (athleteName: string) => {
    setFormTaggedAthletes((prev) =>
      prev.includes(athleteName)
        ? prev.filter((a) => a !== athleteName)
        : [...prev, athleteName]
    );
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const finalUrl =
      formImageUrl.trim() ||
      PRESET_GALLERY_IMAGES[0].url;

    const newItem: KulupGaleriItem = {
      id: `gal-${Date.now()}`,
      title: formTitle.trim(),
      club: formClub,
      category: formCategory,
      date: formDate,
      imageUrl: finalUrl,
      description: formDescription.trim() || undefined,
      taggedAthletes: formTaggedAthletes.length > 0 ? formTaggedAthletes : undefined,
      uploaderName: 'Kulüp Medya Sorumlusu',
    };

    const updated = [newItem, ...galeri];
    setGaleri(updated);
    saveStoredKulupGaleri(updated);
    setShowAddModal(false);

    // Reset
    setFormTitle('');
    setFormImageUrl('');
    setFormDescription('');
    setFormTaggedAthletes([]);
    showNotification(`"${newItem.title}" görseli kulüp galerisine eklendi.`);
  };

  const handleDeletePhoto = (id: string, title: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (window.confirm(`"${title}" görselini silmek istediğinize emin misiniz?`)) {
      const updated = galeri.filter((g) => g.id !== id);
      setGaleri(updated);
      saveStoredKulupGaleri(updated);
      if (lightboxIndex !== null) setLightboxIndex(null);
      showNotification(`"${title}" görseli silindi.`);
    }
  };

  const handleDownload = (item: KulupGaleriItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    showNotification(`"${item.title}" görseli indiriliyor...`);
  };

  // Lightbox handlers
  const activeLightboxItem =
    lightboxIndex !== null && filteredGaleri[lightboxIndex]
      ? filteredGaleri[lightboxIndex]
      : null;

  const handlePrevLightbox = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  const handleNextLightbox = () => {
    if (lightboxIndex !== null && lightboxIndex < filteredGaleri.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  return (
    <div className="space-y-5">
      {/* Filter and Control Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Görsel başlığı, sporcu etiketi, maç, antrenman ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
            />
          </div>

          {/* Add New Photo Button */}
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Fotoğraf / Görsel Yükle</span>
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-bold">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtrele:</span>
          </div>

          {/* Club Filter */}
          <select
            value={selectedClub}
            onChange={(e) => setSelectedClub(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">Tüm Kulüpler ({clubList.length})</option>
            {clubList.map((c) => (
              <option key={c} value={c}>
                Kulüp: {c}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">Tüm Kategoriler</option>
            <option value="Antrenman">Antrenman & Çalışma</option>
            <option value="Maç & Turnuva">Maç & Turnuva</option>
            <option value="Kupa & Madalya">Kupa & Madalya</option>
            <option value="Kamp & Etkinlik">Kamp & Sosyal Etkinlik</option>
            <option value="Genel">Genel</option>
          </select>

          {(selectedClub !== 'all' || selectedCategory !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedClub('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-slate-500 hover:text-slate-800 font-bold underline px-2 cursor-pointer"
            >
              Filtreleri Temizle
            </button>
          )}

          <div className="ml-auto text-slate-500 font-semibold">
            {filteredGaleri.length} fotoğraf gösteriliyor
          </div>
        </div>
      </div>

      {/* Gallery Photo Grid */}
      {filteredGaleri.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredGaleri.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(idx)}
              className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col cursor-pointer"
            >
              {/* Image Container with Zoom effect */}
              <div className="relative aspect-4/3 bg-slate-900 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

                {/* Badges on Image */}
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs border border-white/20">
                    {item.club}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-600/90 text-white backdrop-blur-xs">
                    {item.category}
                  </span>
                </div>

                {/* Top right quick actions */}
                <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10">
                  <button
                    type="button"
                    onClick={(e) => handleDownload(item, e)}
                    className="w-7 h-7 rounded-lg bg-slate-900/80 text-white hover:bg-slate-900 flex items-center justify-center transition-colors"
                    title="İndir"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDeletePhoto(item.id, item.title, e)}
                    className="w-7 h-7 rounded-lg bg-rose-600/90 text-white hover:bg-rose-700 flex items-center justify-center transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Bottom title on image */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white z-10">
                  <p className="text-xs font-bold line-clamp-1 group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </p>
                  <span className="text-[10px] text-slate-300 font-mono">
                    {item.date}
                  </span>
                </div>
              </div>

              {/* Card Bottom Meta */}
              <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                {item.description ? (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">
                    Kulüp antrenman ve faaliyet görseli
                  </p>
                )}

                {item.taggedAthletes && item.taggedAthletes.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold">
                      Etiketli:
                    </span>
                    {(item.taggedAthletes || []).map((a) => (
                      <span
                        key={a}
                        className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-100"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center text-slate-400">
          <ImageIcon className="w-10 h-10 mx-auto mb-2 text-slate-300" />
          <p className="font-bold text-slate-700">Görsel bulunamadı</p>
          <p className="text-xs text-slate-400 mt-1">
            Filtreleri değiştirebilir veya kulübe yeni fotoğraflar yükleyebilirsiniz.
          </p>
        </div>
      )}

      {/* Lightbox Modal */}
      {activeLightboxItem && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col max-h-[92vh]"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/95 border-b border-slate-800 text-white z-10">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-600">
                  {activeLightboxItem.category}
                </span>
                <span className="font-bold text-sm text-slate-100">
                  {activeLightboxItem.title}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  • {activeLightboxItem.club} • {activeLightboxItem.date}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleDownload(activeLightboxItem)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  title="İndir"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(activeLightboxItem.id, activeLightboxItem.title)}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-slate-800 transition-colors"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Image Stage with Navigation */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[320px] max-h-[65vh] overflow-hidden">
              <img
                src={activeLightboxItem.imageUrl}
                alt={activeLightboxItem.title}
                className="max-h-full max-w-full object-contain"
                referrerPolicy="no-referrer"
              />

              {/* Prev / Next buttons */}
              {lightboxIndex !== null && lightboxIndex > 0 && (
                <button
                  type="button"
                  onClick={handlePrevLightbox}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition-colors shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              {lightboxIndex !== null && lightboxIndex < filteredGaleri.length - 1 && (
                <button
                  type="button"
                  onClick={handleNextLightbox}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition-colors shadow-lg"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Lightbox Details Bottom */}
            <div className="p-4 bg-slate-900 text-white space-y-2 border-t border-slate-800">
              {activeLightboxItem.description && (
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeLightboxItem.description}
                </p>
              )}
              {activeLightboxItem.taggedAthletes && activeLightboxItem.taggedAthletes.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-slate-400 font-semibold">
                    Etiketli Sporcular:
                  </span>
                  {(activeLightboxItem.taggedAthletes || []).map((a) => (
                    <span
                      key={a}
                      className="px-2 py-0.5 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-200 text-xs font-semibold"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add New Photo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Kulüp Galerisine Fotoğraf Ekle
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Maç, antrenman, turnuva ve kupa fotoğrafları
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="py-3 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Fotoğraf Başlığı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: U16 Çeyrek Final Galibiyeti veya Antrenman Isınma"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kulüp / Tesis *
                  </label>
                  <select
                    value={formClub}
                    onChange={(e) => setFormClub(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    {clubList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kategori *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as KulupGaleriKategori)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Antrenman">Antrenman</option>
                    <option value="Maç & Turnuva">Maç & Turnuva</option>
                    <option value="Kupa & Madalya">Kupa & Madalya</option>
                    <option value="Kamp & Etkinlik">Kamp & Etkinlik</option>
                    <option value="Genel">Genel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Çekim Tarihi
                </label>
                <input
                  type="text"
                  placeholder="GG.AA.YYYY"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Upload image from device */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Görsel Seç (Cihazdan veya URL)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-3 border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/40 hover:bg-blue-50 text-blue-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Bilgisayardan / Galeriden Fotoğraf Seç</span>
                </button>
              </div>

              {/* Or Select from sample sports photos */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Veya Örnek Spor Görsellerinden Seç
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_GALLERY_IMAGES.map((img, i) => {
                    const isSelected = formImageUrl === img.url;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormImageUrl(img.url)}
                        className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all group cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        title={img.title}
                      >
                        <img
                          src={img.url}
                          alt={img.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center text-white">
                            <Check className="w-5 h-5 drop-shadow stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Image URL fallback */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Web Görsel Bağlantısı (URL)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Tag Athletes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Fotoğraftaki Sporcuları Etiketle
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {(safeSporcular || []).map((s) => {
                    const isTagged = formTaggedAthletes.includes(s.name);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleToggleTaggedAthlete(s.name)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                          isTagged
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isTagged && '✓ '}
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Açıklama / Enstantane Notu
                </label>
                <textarea
                  rows={2}
                  placeholder="Fotoğraf hakkında detay veya maç notu..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Görseli Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-150 backdrop-blur-xs">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
