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
  Sparkles,
  Grid,
  FileText,
  MapPin,
  Heart,
  Tag,
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

  // Modals & Interactivity
  const [showAddModal, setShowAddModal] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [hoveredPhotoId, setHoveredPhotoId] = useState<string | null>(null);

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

  // Distinct clubs list
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

    // Reset Form
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
    // Simulate real download helper
    const link = document.createElement('a');
    link.href = item.imageUrl;
    link.download = `${item.title.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    showNotification(`"${item.title}" görseli indiriliyor...`);
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
  };

  // Lightbox navigation
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

  // Helper counters for dashboard info
  const totalPhotos = galeri.length;
  const matchPhotosCount = galeri.filter(g => g.category === 'Maç & Turnuva').length;
  const trainingPhotosCount = galeri.filter(g => g.category === 'Antrenman').length;
  const awardPhotosCount = galeri.filter(g => g.category === 'Kupa & Madalya').length;

  return (
    <div className="space-y-6">
      {/* Professional Stats and Metrics Header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">TÜM MEDYA</span>
            <span className="text-lg font-black text-slate-800">{totalPhotos} Görsel</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">MAÇ VE MÜSABAKA</span>
            <span className="text-lg font-black text-slate-800">{matchPhotosCount} Fotoğraf</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">ANTRENMAN &amp; IDMAN</span>
            <span className="text-lg font-black text-slate-800">{trainingPhotosCount} Kare</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">KUPA &amp; BAŞARILAR</span>
            <span className="text-lg font-black text-slate-800">{awardPhotosCount} Ödül</span>
          </div>
        </div>
      </div>

      {/* Advanced Filter, Search and Category Tab Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Top Control Level */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2">
              <Grid className="w-4 h-4 text-blue-600" />
              Kulüp Medya Bankası &amp; Galeri
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Kulüp sporcularının maç, idman, sosyal etkinlik ve şampiyonluk karelerini filtreleyin, etiketli sporcuları görüntüleyin.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Add Photo Action Button */}
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Görsel Ekle</span>
            </button>
          </div>
        </div>

        {/* Categories Tab Bar & Filters */}
        <div className="p-4 sm:p-5 bg-slate-50/50 space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Custom Tab Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto w-full lg:w-auto scrollbar-none">
              {[
                { id: 'all', label: 'Tüm Görseller', count: galeri.length },
                { id: 'Antrenman', label: 'Antrenman', count: trainingPhotosCount },
                { id: 'Maç & Turnuva', label: 'Maçlar', count: matchPhotosCount },
                { id: 'Kupa & Madalya', label: 'Başarılar', count: awardPhotosCount },
                { id: 'Kamp & Etkinlik', label: 'Sosyal / Kamp', count: galeri.filter(g => g.category === 'Kamp & Etkinlik').length },
                { id: 'Genel', label: 'Genel', count: galeri.filter(g => g.category === 'Genel').length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === tab.id
                      ? 'bg-white text-blue-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    selectedCategory === tab.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-slate-200/70 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Etiketli sporcu, başlık veya açıklama ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          {/* Secondary Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/60 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1 text-slate-500 font-bold shrink-0">
                <Filter className="w-3.5 h-3.5" />
                <span>Kulübe Göre:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedClub('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                    selectedClub === 'all'
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Tüm Kulüpler
                </button>
                {clubList.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedClub(c)}
                    className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                      selectedClub === c
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear filters trigger */}
            {(selectedClub !== 'all' || selectedCategory !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedClub('all');
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="text-slate-500 hover:text-slate-800 font-bold hover:underline cursor-pointer text-xs"
              >
                Filtreleri Sıfırla
              </button>
            )}

            <div className="text-[11px] font-bold text-slate-400">
              Bulunan: <span className="text-slate-700">{filteredGaleri.length} Görsel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Gallery Grid with refined layout & Anti-slop aesthetics */}
      {filteredGaleri.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredGaleri.map((item, idx) => {
            const isHovered = hoveredPhotoId === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredPhotoId(item.id)}
                onMouseLeave={() => setHoveredPhotoId(null)}
                onClick={() => setLightboxIndex(idx)}
                className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer relative"
              >
                {/* Image Stage with precise Aspect Ratio */}
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    referrerPolicy="no-referrer"
                  />

                  {/* Dark Elegant Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-90 transition-opacity" />

                  {/* Hover Actions frosted glass panel */}
                  <div className={`absolute inset-0 bg-slate-950/40 backdrop-blur-3xs flex items-center justify-center gap-2.5 transition-all duration-200 ${
                    isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                  }`}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxIndex(idx);
                      }}
                      className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 text-slate-900 flex items-center justify-center transition-all shadow-md transform hover:scale-110"
                      title="Görüntüle"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDownload(item, e)}
                      className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all shadow-md transform hover:scale-110"
                      title="İndir"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeletePhoto(item.id, item.title, e)}
                      className="w-9 h-9 rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition-all shadow-md transform hover:scale-110"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Category and Club Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase bg-slate-950/95 text-slate-200 border border-slate-800 backdrop-blur-xs">
                      {item.club}
                    </span>
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase text-white backdrop-blur-xs ${
                      item.category === 'Maç & Turnuva' ? 'bg-indigo-600/90' :
                      item.category === 'Antrenman' ? 'bg-emerald-600/90' :
                      item.category === 'Kupa & Madalya' ? 'bg-amber-600/90' :
                      'bg-slate-700/90'
                    }`}>
                      {item.category}
                    </span>
                  </div>

                  {/* Tiny Quick Date Indicator */}
                  <div className="absolute bottom-3 right-3 bg-slate-950/75 backdrop-blur-xs px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold text-slate-300 border border-slate-800">
                    {item.date}
                  </div>
                </div>

                {/* Details Content Panel */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-black text-slate-800 leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description || 'Antrenman ve faaliyet fotoğrafı.'}
                    </p>
                  </div>

                  {/* Tagged athletes with professional layout */}
                  {item.taggedAthletes && item.taggedAthletes.length > 0 ? (
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                      <div className="text-[9px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
                        <Tag className="w-3 h-3" />
                        <span>Etiketli:</span>
                      </div>
                      {(item.taggedAthletes || []).map((a) => (
                        <span
                          key={a}
                          className="px-2 py-0.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold border border-blue-100 transition-colors"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-100/60">
                      <span className="text-[10px] text-slate-400 italic">Etiketli sporcu yok</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-16 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <ImageIcon className="w-6 h-6 text-slate-400" />
          </div>
          <p className="font-bold text-slate-700 text-sm">Aranan Kriterde Görsel Bulunamadı</p>
          <p className="text-xs text-slate-400 mt-1">
            Filtreleri değiştirebilir veya sağ üstteki "Yeni Görsel Ekle" butonu ile kulübe yeni fotoğraflar kazandırabilirsiniz.
          </p>
        </div>
      )}

      {/* Lightbox Modal with Elite Dual Column Panel */}
      {activeLightboxItem && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 bg-slate-950/98 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:h-[640px]"
          >
            {/* Left Column: Giant Image Viewer */}
            <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden min-h-[300px] md:h-full">
              <img
                src={activeLightboxItem.imageUrl}
                alt={activeLightboxItem.title}
                className="max-h-full max-w-full object-contain"
                referrerPolicy="no-referrer"
              />

              {/* Prev / Next Carousels */}
              {lightboxIndex !== null && lightboxIndex > 0 && (
                <button
                  type="button"
                  onClick={handlePrevLightbox}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center transition-all shadow-lg border border-slate-800 cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              {lightboxIndex !== null && lightboxIndex < filteredGaleri.length - 1 && (
                <button
                  type="button"
                  onClick={handleNextLightbox}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center transition-all shadow-lg border border-slate-800 cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Right Column: High contrast Metadata Sidebar */}
            <div className="w-full md:w-80 bg-slate-950 text-white border-t md:border-t-0 md:border-l border-slate-800 p-5 flex flex-col justify-between shrink-0">
              <div className="space-y-5">
                {/* Close and Actions Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">GÖRSEL BİLGİSİ</span>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categorization & Title */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase bg-blue-600 text-white">
                      {activeLightboxItem.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase bg-slate-900 border border-slate-800 text-slate-300">
                      {activeLightboxItem.club}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-100 leading-snug">
                    {activeLightboxItem.title}
                  </h3>
                </div>

                {/* Detail Description */}
                <div className="space-y-1.5 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-[10px] font-bold text-slate-500 block">ENSTANTANE NOTU</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {activeLightboxItem.description || 'Görsele ait bir açıklama bulunmuyor.'}
                  </p>
                </div>

                {/* Metadata details */}
                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Çekim Tarihi: <strong className="text-slate-100">{activeLightboxItem.date}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <User className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Yükleyen: <strong className="text-slate-100">{activeLightboxItem.uploaderName || 'Medya Sorumlusu'}</strong></span>
                  </div>
                </div>

                {/* Tagged athletes box */}
                {activeLightboxItem.taggedAthletes && activeLightboxItem.taggedAthletes.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-900">
                    <span className="text-[10px] font-bold text-slate-500 block">FOTOĞRAFTAKİ SPORCULAR</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(activeLightboxItem.taggedAthletes || []).map((athlete) => (
                        <span
                          key={athlete}
                          className="px-2.5 py-1 rounded-lg bg-blue-950/70 border border-blue-900/60 text-blue-200 text-xs font-bold"
                        >
                          {athlete}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions footer inside sidebar */}
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => handleDownload(activeLightboxItem)}
                  className="py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-800"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>İndir</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(activeLightboxItem.id, activeLightboxItem.title)}
                  className="py-2 bg-rose-600/30 hover:bg-rose-600/40 text-rose-300 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-rose-900/30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Sil</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Photo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm sm:text-base">
                    Görsel &amp; Fotoğraf Kaydı
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Spor kulübünüze ait yeni anı veya dökümanı yükleyin
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Fotoğraf Başlığı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: U16 Çeyrek Final Galibiyeti veya Isınma Koşusu"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl outline-none transition-colors font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kulüp / Şube *
                  </label>
                  <select
                    value={formClub}
                    onChange={(e) => setFormClub(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white outline-none font-bold text-slate-700"
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
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white outline-none font-bold text-slate-700"
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
                  Tarih
                </label>
                <input
                  type="text"
                  placeholder="GG.AA.YYYY"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none font-medium"
                />
              </div>

              {/* Upload interface */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">
                  Dosya Yükle veya Örneklerden Seç
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-5 px-3 border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/20 text-slate-600 rounded-2xl font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <UploadCloud className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-black text-slate-800">Cihazdan Fotoğraf Yükle</span>
                  <span className="text-[10px] text-slate-400 font-semibold">PNG, JPG formatları kabul edilir</span>
                </div>
              </div>

              {/* Presets Grid */}
              <div className="space-y-1.5">
                <span className="block font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Veya Örnek Profesyonel Görsellerden Seçin
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_GALLERY_IMAGES.map((img, i) => {
                    const isSelected = formImageUrl === img.url;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormImageUrl(img.url)}
                        className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 ring-2 ring-blue-500/25'
                            : 'border-slate-100 hover:border-slate-300'
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
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Direct image url fallback */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Resim URL Bağlantısı
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none font-medium text-slate-600"
                />
              </div>

              {/* Tagging athletes */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Fotoğraftaki Sporcuları Etiketle
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                  {(safeSporcular || []).map((s) => {
                    const isTagged = formTaggedAthletes.includes(s.name);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleToggleTaggedAthlete(s.name)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          isTagged
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {isTagged ? '✓ ' : '+ '}
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Detaylı Açıklama
                </label>
                <textarea
                  rows={2}
                  placeholder="Fotoğraf hakkında enstantane bilgisi veya maç detayı..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 focus:border-blue-500 rounded-xl outline-none font-medium"
                />
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Medyayı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modern Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200 backdrop-blur-xs">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
