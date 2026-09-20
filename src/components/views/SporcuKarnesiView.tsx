import React, { useState, useRef } from 'react';
import { 
  Award, 
  Search, 
  Download, 
  Share2, 
  TrendingUp, 
  Activity, 
  Target, 
  Brain,
  Printer,
  ChevronDown,
  FileText,
  HeartHandshake,
  ShieldCheck,
  Clock,
  Plus,
  X,
  MessageSquare,
  Smartphone,
  ShieldAlert,
  Moon,
  Users,
  Crown,
  Compass,
  Zap,
  Check,
  CheckCircle2,
  Filter,
  Tag,
  Trash2,
  Star,
  ClipboardCheck,
  Send
} from 'lucide-react';
import { SportsFlyIcon } from '../SportsFlyLogo';
import { toCanvas } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { INITIAL_KARNELER, SporcuKarne, getStoredKarneler, saveStoredKarneler } from '../../data/mockKarneData';
import { getStoredSporcuProfilleri } from '../../data/sporcuProfilData';
import { 
  KURUMSAL_ROZETLER, 
  KURUMSAL_ROZET_KATEGORILERI, 
  DavranissalRozet 
} from '../../data/rozetData';
import { NavPage } from '../../types';
import { VeliKarneGonderimModal } from './VeliKarneGonderimModal';

interface SporcuKarnesiViewProps {
  onNavigate?: (page: NavPage) => void;
}

export const SporcuKarnesiView: React.FC<SporcuKarnesiViewProps> = ({ onNavigate }) => {
  const [karneler, setKarneler] = useState<SporcuKarne[]>(() => getStoredKarneler());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKarneId, setSelectedKarneId] = useState<string>(() => {
    const list = getStoredKarneler();
    return list[0]?.id || INITIAL_KARNELER[0]?.id || '';
  });

  // Keep state synced with localStorage
  React.useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e?.detail?.karneler) {
        setKarneler(e.detail.karneler);
      } else {
        setKarneler(getStoredKarneler());
      }
    };
    window.addEventListener('sportsfly_karneler_updated', handleUpdate);
    return () => window.removeEventListener('sportsfly_karneler_updated', handleUpdate);
  }, []);

  const updateAndSaveKarneler = (updater: (prev: SporcuKarne[]) => SporcuKarne[]) => {
    setKarneler(prev => {
      const updated = updater(prev);
      saveStoredKarneler(updated);
      return updated;
    });
  };
  const [isDownloading, setIsDownloading] = useState(false);
  const [isVeliModalOpen, setIsVeliModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };
  const [isAddObservationOpen, setIsAddObservationOpen] = useState(false);
  const [newObservation, setNewObservation] = useState({
    donem: '',
    odakKonusu: '',
    durum: 'Hedefe Ulaştı' as 'Gelişiyor' | 'Hedefe Ulaştı' | 'Örnek Davranış',
    gozlem: ''
  });

  // Badge Management States
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [badgeSearchQuery, setBadgeSearchQuery] = useState('');
  const [badgeCategoryFilter, setBadgeCategoryFilter] = useState<string>('Tümü');
  const [isCustomBadgeOpen, setIsCustomBadgeOpen] = useState(false);
  const [customBadge, setCustomBadge] = useState({
    baslik: '',
    kategori: 'Karakter & Etik' as DavranissalRozet['kategori'],
    aciklama: '',
    onemDerecesi: 'Özel Başarı' as DavranissalRozet['onemDerecesi']
  });
  
  const karneRef = useRef<HTMLDivElement>(null);

  const selectedKarne = karneler.find(k => k.id === selectedKarneId) || karneler[0] || null;
  const sporcuProfilleri = getStoredSporcuProfilleri();
  const selectedSporcuProfil = selectedKarne ? sporcuProfilleri[selectedKarne.sporcuId] : null;
  const profilePhotoUrl = selectedSporcuProfil?.kimlik?.fotoUrl;

  const renderBadgeIcon = (iconName: string, className: string = "w-4 h-4") => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Users': return <Users className={className} />;
      case 'Clock': return <Clock className={className} />;
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      case 'Smartphone': return <Smartphone className={className} />;
      case 'Brain': return <Brain className={className} />;
      case 'Crown': return <Crown className={className} />;
      case 'SportsFlyIcon': return <SportsFlyIcon className={className} />;
      case 'Compass': return <Compass className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'HeartHandshake': return <HeartHandshake className={className} />;
      case 'Moon': return <Moon className={className} />;
      default: return <Award className={className} />;
    }
  };

  const getBadgeDetails = (kazanim: { baslik: string; aciklama: string; rozetId?: string; kategori?: string; }) => {
    const match = KURUMSAL_ROZETLER.find(
      r => r.id === kazanim.rozetId || 
           r.baslik.toLowerCase() === kazanim.baslik.toLowerCase() ||
           (r.id === 'rozet-temiz-spor' && (kazanim.baslik.toLowerCase().includes('temiz spor') || kazanim.rozetId === 'rozet-temiz-spor'))
    );
    return match;
  };

  const handleToggleBadge = (rozet: DavranissalRozet) => {
    if (!selectedKarne) return;

    const isAlreadyEarned = selectedKarne.davranissal.kazanimlar.some(
      k => k.rozetId === rozet.id || k.baslik.toLowerCase() === rozet.baslik.toLowerCase()
    );

    updateAndSaveKarneler(prev => prev.map(k => {
      if (k.id === selectedKarne.id) {
        let updatedKazanimlar = [...k.davranissal.kazanimlar];
        if (isAlreadyEarned) {
          updatedKazanimlar = updatedKazanimlar.filter(
            item => item.rozetId !== rozet.id && item.baslik.toLowerCase() !== rozet.baslik.toLowerCase()
          );
        } else {
          updatedKazanimlar.push({
            id: `kzn-${Date.now()}`,
            rozetId: rozet.id,
            baslik: rozet.baslik,
            aciklama: rozet.aciklama,
            kategori: rozet.kategori,
            tarih: new Date().toISOString().split('T')[0],
            onemDerecesi: rozet.onemDerecesi
          });
        }

        return {
          ...k,
          davranissal: {
            ...k.davranissal,
            kazanimlar: updatedKazanimlar
          }
        };
      }
      return k;
    }));
  };

  const handleRemoveBadge = (kazanimBaslik: string) => {
    if (!selectedKarne) return;

    updateAndSaveKarneler(prev => prev.map(k => {
      if (k.id === selectedKarne.id) {
        return {
          ...k,
          davranissal: {
            ...k.davranissal,
            kazanimlar: k.davranissal.kazanimlar.filter(
              item => item.baslik !== kazanimBaslik
            )
          }
        };
      }
      return k;
    }));
  };

  const handleAddCustomBadge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKarne || !customBadge.baslik.trim() || !customBadge.aciklama.trim()) return;

    const newBadgeItem = {
      id: `custom-${Date.now()}`,
      baslik: customBadge.baslik.trim(),
      aciklama: customBadge.aciklama.trim(),
      kategori: customBadge.kategori,
      onemDerecesi: customBadge.onemDerecesi,
      tarih: new Date().toISOString().split('T')[0]
    };

    updateAndSaveKarneler(prev => prev.map(k => {
      if (k.id === selectedKarne.id) {
        return {
          ...k,
          davranissal: {
            ...k.davranissal,
            kazanimlar: [...k.davranissal.kazanimlar, newBadgeItem]
          }
        };
      }
      return k;
    }));

    setCustomBadge({
      baslik: '',
      kategori: 'Karakter & Etik',
      aciklama: '',
      onemDerecesi: 'Özel Başarı'
    });
    setIsCustomBadgeOpen(false);
  };

  const filteredKarneler = karneler.filter(k => 
    k.adSoyad.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.brans.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.grup.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectKarne = (karne: SporcuKarne) => {
    setSelectedKarneId(karne.id);
  };

  const handleAddObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKarne || !newObservation.donem.trim() || !newObservation.odakKonusu.trim()) return;

    const newStep = {
      donem: newObservation.donem.trim(),
      tarih: new Date().toISOString().split('T')[0],
      durum: newObservation.durum,
      odakKonusu: newObservation.odakKonusu.trim(),
      gozlem: newObservation.gozlem.trim() || 'Dönemsel davranış gözlemi kaydedildi.'
    };

    updateAndSaveKarneler(prev => prev.map(k => {
      if (k.id === selectedKarne.id) {
        return {
          ...k,
          davranissal: {
            ...k.davranissal,
            surecTakibi: [...k.davranissal.surecTakibi, newStep]
          }
        };
      }
      return k;
    }));

    setNewObservation({
      donem: '',
      odakKonusu: '',
      durum: 'Hedefe Ulaştı',
      gozlem: ''
    });
    setIsAddObservationOpen(false);
  };

  const handleDownloadPDF = async () => {
    if (!karneRef.current || !selectedKarne) return;
    
    try {
      setIsDownloading(true);
      showToast(`${selectedKarne.adSoyad} sporcu karnesi PDF olarak derleniyor...`);
      
      const canvas = await toCanvas(karneRef.current, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        skipFonts: true,
        filter: (domNode) => {
          if (domNode instanceof HTMLElement) {
            if (
              domNode.getAttribute('data-html2canvas-ignore') === 'true' ||
              domNode.classList.contains('print:hidden') ||
              domNode.hasAttribute('data-print-ignore')
            ) {
              return false;
            }
          }
          return true;
        }
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();

      if (pdfHeight > pageHeight) {
        let heightLeft = pdfHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft > 0) {
          position = heightLeft - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
          heightLeft -= pageHeight;
        }
      } else {
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }

      const fileName = `${selectedKarne.adSoyad.replace(/\s+/g, '_')}_Sporcu_Karnesi.pdf`;
      pdf.save(fileName);
      showToast(`✓ ${fileName} başarıyla indirildi!`);
      
    } catch (error) {
      console.error('PDF oluşturulurken hata:', error);
      showToast('PDF oluşturulurken bir hata oluştu. Tarayıcınızın "Yazdır" seçeneğini kullanabilirsiniz.');
    } finally {
      setIsDownloading(false);
    }
  };

  const renderProgressBar = (label: string, value: number, colorClass: string) => (
    <div className="mb-4">
      <div className="flex justify-between text-xs font-semibold mb-1.5">
        <span className="text-slate-600">{label}</span>
        <span className="text-slate-800">{value}/10</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
        <div 
          className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-out`} 
          style={{ width: `${value * 10}%` }}
        ></div>
      </div>
    </div>
  );

  const genelOrtalama = selectedKarne ? (
    (
      selectedKarne.teknik.ortalama +
      selectedKarne.fiziksel.ortalama +
      selectedKarne.taktiksel.ortalama +
      selectedKarne.zihinsel.ortalama +
      (selectedKarne.davranissal?.kriterler?.ortalama || 8)
    ) / 5
  ).toFixed(1) : '0.0';

  return (
    <div className="flex-1 p-4 lg:p-8 pt-6 overflow-y-auto w-full h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <Award className="w-8 h-8 text-blue-600" />
            Sporcu Karnesi
          </h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Panel - Selection List */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/60 p-4 sticky top-6">
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Sporcu, grup veya branş ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              />
            </div>
            
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
              Karnesi Çıkan Sporcular
            </div>

            <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 custom-scrollbar">
              {filteredKarneler.map(karne => (
                <button
                  key={karne.id}
                  onClick={() => handleSelectKarne(karne)}
                  className={`w-full text-left p-3 rounded-xl transition-all border ${
                    selectedKarne?.id === karne.id
                      ? 'bg-blue-50 border-blue-200 shadow-sm'
                      : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-slate-800 text-sm">{karne.adSoyad}</div>
                  <div className="text-xs text-slate-500 mt-1">{karne.grup}</div>
                  <div className="text-[10px] font-semibold text-slate-400 mt-1 flex gap-2">
                    <span>{karne.brans}</span>
                    <span>•</span>
                    <span>Tarih: {new Date(karne.tarih).toLocaleDateString('tr-TR')}</span>
                  </div>
                </button>
              ))}
              {filteredKarneler.length === 0 && (
                <div className="text-center py-6 text-sm text-slate-500">
                  Sonuç bulunamadı.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Report Card View */}
        {selectedKarne ? (
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-end gap-2.5 mb-4 print:hidden">
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('sporpuan-sporcu-degerlendirme')}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors shadow-2xs cursor-pointer"
                >
                  <ClipboardCheck className="w-4 h-4 text-blue-600" />
                  <span className="hidden sm:inline">Puanları Değerlendir / Düzenle</span>
                  <span className="sm:hidden">Değerlendir</span>
                </button>
              )}
              <button 
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                title="Yazıcıdan yazdırın veya tarayıcıdan PDF olarak kaydedin"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">Yazdır</span>
              </button>
              <button 
                type="button"
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
                title="Karnenin yüksek çözünürlüklü A4 PDF belgesini indirin"
              >
                {isDownloading ? (
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-700 rounded-full animate-spin" />
                ) : (
                  <Download className="w-4 h-4 text-blue-600" />
                )}
                <span>
                  {isDownloading ? 'İndiriliyor...' : 'PDF İndir'}
                </span>
              </button>
              <button 
                type="button"
                onClick={() => setIsVeliModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors shadow-2xs cursor-pointer"
                title="Veliye WhatsApp üzerinden karnenin özetini ve PDF'ini gönderin"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span className="hidden md:inline">WhatsApp</span>
              </button>
              <button 
                type="button"
                onClick={() => setIsVeliModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 bg-blue-50 border border-blue-300 text-blue-800 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors shadow-2xs cursor-pointer"
                title="Kulüp resmi SMS başlığıyla veliye SMS gönderin"
              >
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span className="hidden md:inline">SMS</span>
              </button>
              <button 
                type="button"
                onClick={() => setIsVeliModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-lg text-xs font-extrabold transition-all shadow-xs cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Veliye Gönder</span>
              </button>
            </div>

            {/* Print Area Container (Simulated) */}
            <div ref={karneRef} id="sporcu-karne-print-area" className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden relative">
              {/* Report Header */}
              <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
                <div className="flex items-center gap-5 relative z-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-black shadow-md border-2 border-slate-700 shrink-0 overflow-hidden">
                    {profilePhotoUrl ? (
                      <img 
                        src={profilePhotoUrl} 
                        referrerPolicy="no-referrer" 
                        className="w-full h-full object-cover" 
                        alt={selectedKarne.adSoyad} 
                      />
                    ) : (
                      selectedKarne.adSoyad.split(' ').map(n => n[0]).join('').slice(0, 2)
                    )}
                  </div>
                  <div>
                    <div className="text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">
                      {selectedKarne.brans} • {selectedKarne.yasGubu}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-1.5 tracking-tight">
                      {selectedKarne.adSoyad}
                    </h2>
                    <div className="flex flex-wrap gap-2 text-xs md:text-sm text-slate-300 font-medium">
                      <span>Takım: {selectedKarne.grup}</span>
                      <span className="text-slate-500">•</span>
                      <span>{selectedKarne.boy} cm</span>
                      <span className="text-slate-500">•</span>
                      <span>{selectedKarne.kilo} kg</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-emerald-300">
                        Veli: <strong className="text-white font-semibold">{selectedKarne.veliAdSoyad || 'Kayıtlı Veli'}</strong> ({selectedKarne.veliTelefon || '+90 532...'})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 flex flex-wrap md:flex-col items-start md:items-end justify-between gap-3 shrink-0">
                  <div className="bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700/60 text-left md:text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Değerlendirme Tarihi</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {new Date(selectedKarne.tarih).toLocaleDateString('tr-TR')}
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5">
                      Antrenör: <span className="font-semibold text-white">{selectedKarne.antrenor}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-blue-950/60 border border-blue-800/50 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
                      <span className="text-[11px] font-medium text-blue-300">Genel Karne Notu:</span>
                      <span className="text-sm font-black text-blue-400">{genelOrtalama}</span>
                      <span className="text-[10px] text-blue-300/70">/ 10</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsVeliModalOpen(true)}
                      className="print:hidden flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-300 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Veliye İlet</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Technical Skills */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                      <Target className="w-4 h-4 text-blue-600" />
                      Teknik Gelişim
                    </h3>
                    <div className="bg-blue-100 text-blue-700 font-bold px-2.5 py-0.5 rounded-md text-xs">
                      {selectedKarne.teknik.ortalama} / 10
                    </div>
                  </div>
                  <div>
                    {selectedKarne.teknik.topKontrolu !== undefined && renderProgressBar('Top Kontrolü', selectedKarne.teknik.topKontrolu, 'bg-blue-500')}
                    {selectedKarne.teknik.pasBasarisi !== undefined && renderProgressBar('Pas Başarısı', selectedKarne.teknik.pasBasarisi, 'bg-blue-500')}
                    {selectedKarne.teknik.sut !== undefined && renderProgressBar('Şut / Bitiricilik', selectedKarne.teknik.sut, 'bg-blue-500')}
                    {selectedKarne.teknik.topSurme !== undefined && renderProgressBar('Top Sürme', selectedKarne.teknik.topSurme, 'bg-blue-500')}
                    {selectedKarne.teknik.savunma !== undefined && renderProgressBar('Birebir Savunma', selectedKarne.teknik.savunma, 'bg-blue-500')}
                  </div>
                </div>

                {/* Physical Skills */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      Fiziksel Gelişim
                    </h3>
                    <div className="bg-emerald-100 text-emerald-700 font-bold px-2.5 py-0.5 rounded-md text-xs">
                      {selectedKarne.fiziksel.ortalama} / 10
                    </div>
                  </div>
                  <div>
                    {selectedKarne.fiziksel.hiz !== undefined && renderProgressBar('Hız / Çabukluk', selectedKarne.fiziksel.hiz, 'bg-emerald-500')}
                    {selectedKarne.fiziksel.dayaniklilik !== undefined && renderProgressBar('Dayanıklılık (Kondisyon)', selectedKarne.fiziksel.dayaniklilik, 'bg-emerald-500')}
                    {selectedKarne.fiziksel.guc !== undefined && renderProgressBar('Kuvvet', selectedKarne.fiziksel.guc, 'bg-emerald-500')}
                    {selectedKarne.fiziksel.ceviklik !== undefined && renderProgressBar('Çeviklik / Koordinasyon', selectedKarne.fiziksel.ceviklik, 'bg-emerald-500')}
                  </div>
                </div>

                {/* Tactical Skills */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      Taktiksel Gelişim
                    </h3>
                    <div className="bg-purple-100 text-purple-700 font-bold px-2.5 py-0.5 rounded-md text-xs">
                      {selectedKarne.taktiksel.ortalama} / 10
                    </div>
                  </div>
                  <div>
                    {selectedKarne.taktiksel.oyunZekasi !== undefined && renderProgressBar('Oyun Zekası', selectedKarne.taktiksel.oyunZekasi, 'bg-purple-500')}
                    {selectedKarne.taktiksel.pozisyonAlma !== undefined && renderProgressBar('Pozisyon Alma', selectedKarne.taktiksel.pozisyonAlma, 'bg-purple-500')}
                    {selectedKarne.taktiksel.kararVerme !== undefined && renderProgressBar('Karar Verme', selectedKarne.taktiksel.kararVerme, 'bg-purple-500')}
                  </div>
                </div>

                {/* Mental Skills */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                      <Brain className="w-4 h-4 text-amber-600" />
                      Zihinsel Gelişim
                    </h3>
                    <div className="bg-amber-100 text-amber-700 font-bold px-2.5 py-0.5 rounded-md text-xs">
                      {selectedKarne.zihinsel.ortalama} / 10
                    </div>
                  </div>
                  <div>
                    {selectedKarne.zihinsel.disiplin !== undefined && renderProgressBar('Antrenman Disiplini', selectedKarne.zihinsel.disiplin, 'bg-amber-500')}
                    {selectedKarne.zihinsel.ozguven !== undefined && renderProgressBar('Özgüven', selectedKarne.zihinsel.ozguven, 'bg-amber-500')}
                    {selectedKarne.zihinsel.takimUyumu !== undefined && renderProgressBar('Takım Uyumu', selectedKarne.zihinsel.takimUyumu, 'bg-amber-500')}
                    {selectedKarne.zihinsel.liderlik !== undefined && renderProgressBar('Liderlik', selectedKarne.zihinsel.liderlik, 'bg-amber-500')}
                  </div>
                </div>
              </div>

              {/* Behavioral Development Process Section */}
              {selectedKarne.davranissal && (
                <div className="px-6 md:px-8 pb-8">
                  <div className="bg-linear-to-b from-indigo-50/70 to-slate-50/50 border border-indigo-100/90 rounded-2xl p-6 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                          <HeartHandshake className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-bold text-slate-900">
                              Davranışsal Gelişim & Karakter
                            </h3>
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                              Karakter, Uyum & Fair-Play
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="bg-white border border-indigo-100 px-3.5 py-1.5 rounded-xl shadow-xs text-right">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Davranış Puanı</div>
                          <div className="text-base font-black text-indigo-600">
                            {selectedKarne.davranissal.kriterler.ortalama} <span className="text-xs font-semibold text-slate-400">/ 10</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsAddObservationOpen(true)}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer print:hidden"
                          data-html2canvas-ignore="true"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Yeni Gözlem Ekle</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left: Criteria & Badges */}
                      <div className="lg:col-span-6 space-y-5">
                        {/* Criteria */}
                        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-indigo-500" />
                              Temel Davranış Kriterleri
                            </h4>
                            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                              Puan / 10
                            </span>
                          </div>
                          <div className="space-y-1">
                            {renderProgressBar('Fair-Play & Centilmenlik', selectedKarne.davranissal.kriterler.fairPlay, 'bg-indigo-500')}
                            {renderProgressBar('Sorumluluk & Malzeme Düzeni', selectedKarne.davranissal.kriterler.sorumlulukEkipman, 'bg-indigo-500')}
                            {renderProgressBar('Saygı & Yapıcı İletişim', selectedKarne.davranissal.kriterler.saygiIletisim, 'bg-indigo-500')}
                            {renderProgressBar('Dinleme & Yönergelere Uyum', selectedKarne.davranissal.kriterler.yonergeyeUyum, 'bg-indigo-500')}
                            {renderProgressBar('Duygu Kontrolü & Sakinlik', selectedKarne.davranissal.kriterler.duyguKontrolu, 'bg-indigo-500')}
                          </div>
                        </div>

                        {/* Badges - Kazanılan Rozetler */}
                        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
                          <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600">
                                <SportsFlyIcon className="w-4 h-4" />
                              </div>
                              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                Kazanılan Rozetler
                              </h4>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                                {selectedKarne.davranissal.kazanimlar.length} Rozet
                              </span>
                              <button
                                onClick={() => setIsBadgeModalOpen(true)}
                                className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer print:hidden"
                                data-html2canvas-ignore="true"
                                title="Sporcuya rozet ver veya düzenle"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Rozet Ver / Düzenle</span>
                              </button>
                            </div>
                          </div>

                          {selectedKarne.davranissal.kazanimlar.length === 0 ? (
                            <div className="text-center py-6 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                              <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                              <p className="text-xs font-semibold text-slate-700">Henüz rozet atanmadı</p>
                              <p className="text-[11px] text-slate-400 mt-0.5 mb-3">
                                Sporcunun örnek duruşunu ve kulüp içi disiplinini ödüllendirmek için rozet verebilirsiniz.
                              </p>
                              <button
                                onClick={() => setIsBadgeModalOpen(true)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer print:hidden"
                                data-html2canvas-ignore="true"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Rozet Kataloğundan Seç
                              </button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {selectedKarne.davranissal.kazanimlar.map((kazanim, idx) => {
                                const badgeMeta = getBadgeDetails(kazanim);
                                const iconName = (badgeMeta?.ikon as any) || 'Award';
                                const colors = badgeMeta?.renkTema || {
                                   bg: 'bg-amber-50/70',
                                   border: 'border-amber-200/80',
                                   badgeBg: 'bg-amber-100',
                                   badgeText: 'text-amber-800',
                                   iconBg: 'bg-amber-100',
                                   iconColor: 'text-amber-700',
                                   activeBorder: 'border-amber-400'
                                };

                                const displayBaslik = kazanim.baslik.toLowerCase().includes('temiz spor')
                                  ? 'Sağlıklı Yaşam & Sporcu Disiplini'
                                  : kazanim.baslik;

                                return (
                                  <div 
                                    key={idx} 
                                    className={`p-3 rounded-xl ${colors.bg} border ${colors.border} flex items-start gap-2.5 relative group transition-all`}
                                  >
                                    <div className={`w-8 h-8 rounded-lg ${colors.iconBg} flex items-center justify-center shrink-0 ${colors.iconColor} mt-0.5 shadow-2xs`}>
                                      {renderBadgeIcon(iconName, "w-4 h-4")}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-xs font-bold text-slate-800 leading-tight">
                                          {displayBaslik}
                                        </span>
                                        {(kazanim.kategori || badgeMeta?.kategori) && (
                                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${colors.badgeBg} ${colors.badgeText}`}>
                                            {kazanim.kategori || badgeMeta?.kategori}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-[11px] text-slate-600 leading-snug mt-1">
                                        {kazanim.aciklama}
                                      </p>
                                      {kazanim.onemDerecesi && (
                                        <div className="mt-1 flex items-center gap-1 text-[9px] font-medium text-slate-500">
                                          <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-400" />
                                          <span>{kazanim.onemDerecesi}</span>
                                        </div>
                                      )}
                                    </div>
                                    {/* Coach quick remove button */}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveBadge(kazanim.baslik)}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md shrink-0 cursor-pointer print:hidden"
                                      data-html2canvas-ignore="true"
                                      title="Rozeti Geri Al / Kaldır"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Milestone Timeline */}
                      <div className="lg:col-span-6 flex flex-col">
                        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs flex-1 flex flex-col">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                              <Clock className="w-4 h-4 text-indigo-500" />
                              Dönem Gözlemleri & Süreç Takibi
                            </h4>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {selectedKarne.davranissal.surecTakibi.length} Aşama
                            </span>
                          </div>

                          <div className="space-y-4 relative flex-1 before:absolute before:top-2 before:bottom-2 before:left-3.5 before:w-0.5 before:bg-indigo-100">
                            {selectedKarne.davranissal.surecTakibi.map((adim, index) => {
                              const statusConfig = {
                                'Örnek Davranış': {
                                  dot: 'bg-emerald-500 ring-4 ring-emerald-100',
                                  badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                },
                                'Hedefe Ulaştı': {
                                  dot: 'bg-blue-500 ring-4 ring-blue-100',
                                  badge: 'bg-blue-50 text-blue-700 border-blue-200'
                                },
                                'Gelişiyor': {
                                  dot: 'bg-amber-500 ring-4 ring-amber-100',
                                  badge: 'bg-amber-50 text-amber-700 border-amber-200'
                                }
                              }[adim.durum] || {
                                dot: 'bg-slate-400 ring-4 ring-slate-100',
                                badge: 'bg-slate-100 text-slate-700 border-slate-200'
                              };

                              return (
                                <div key={index} className="relative z-10 flex items-start gap-4">
                                  <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${statusConfig.dot}`} />
                                  <div className="flex-1 bg-slate-50/90 hover:bg-slate-50 transition-colors rounded-xl p-3.5 border border-slate-200/70">
                                    <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                                      <span className="text-xs font-bold text-slate-800">{adim.donem}</span>
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${statusConfig.badge}`}>
                                        {adim.durum}
                                      </span>
                                    </div>
                                    <div className="text-xs font-semibold text-indigo-700 mb-1">
                                      Odak: {adim.odakKonusu}
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                      {adim.gozlem}
                                    </p>
                                    <div className="text-[10px] text-slate-400 mt-2 font-medium">
                                      Tarih: {new Date(adim.tarih).toLocaleDateString('tr-TR')}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sağlıklı Yaşam, Dijital Denge & Alışkanlık Takibi */}
                    {selectedKarne.davranissal.bagimlilikVeAliskanlik && (
                      <div className="mt-6 bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                  Sağlıklı Yaşam & Alışkanlık Takibi
                                </h4>
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Dijital Denge & Disiplin
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                Ekran süresi, zararlı alışkanlıklardan korunma bilinci ve düzenli uyku takibi.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-slate-500 font-medium">Genel Durum:</span>
                            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200">
                              {selectedKarne.davranissal.bagimlilikVeAliskanlik.genelFarkindalik}
                            </span>
                          </div>
                        </div>

                        {/* 3 Sütunlu Sade Gösterge Kartları */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                          {/* 1. Ekran Süresi & Denge */}
                          <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/70 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                  <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
                                  Ekran Süresi & Denge
                                </span>
                                <span className="text-xs font-black text-indigo-600">
                                  {selectedKarne.davranissal.bagimlilikVeAliskanlik.ekranDengesi.puan} / 10
                                </span>
                              </div>
                              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-indigo-700 border border-indigo-100 mb-2">
                                {selectedKarne.davranissal.bagimlilikVeAliskanlik.ekranDengesi.seviye}
                              </span>
                              <p className="text-[11px] text-slate-600 leading-relaxed">
                                {selectedKarne.davranissal.bagimlilikVeAliskanlik.ekranDengesi.aciklama}
                              </p>
                            </div>
                          </div>

                          {/* 2. Zararlı Alışkanlık Bilinci */}
                          <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/70 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
                                  Zararlı Alışkanlık Bilinci
                                </span>
                                <span className="text-xs font-black text-emerald-600">
                                  {selectedKarne.davranissal.bagimlilikVeAliskanlik.zararliAliskanlik.puan} / 10
                                </span>
                              </div>
                              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-emerald-700 border border-emerald-100 mb-2">
                                {selectedKarne.davranissal.bagimlilikVeAliskanlik.zararliAliskanlik.seviye === 'Temiz Spor (Örnek)'
                                  ? 'Bilinçli (Örnek)'
                                  : selectedKarne.davranissal.bagimlilikVeAliskanlik.zararliAliskanlik.seviye}
                              </span>
                              <p className="text-[11px] text-slate-600 leading-relaxed">
                                {selectedKarne.davranissal.bagimlilikVeAliskanlik.zararliAliskanlik.aciklama
                                  ?.replace(/temiz sporcu kimliği/gi, 'sağlıklı sporcu disiplini')
                                  ?.replace(/temiz spor/gi, 'sağlıklı yaşam')}
                              </p>
                            </div>
                          </div>

                          {/* 3. Uyku ve Dinlenme Düzeni */}
                          <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/70 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                  <Moon className="w-3.5 h-3.5 text-blue-500" />
                                  Uyku ve Dinlenme Düzeni
                                </span>
                                <span className="text-xs font-black text-blue-600">
                                  {selectedKarne.davranissal.bagimlilikVeAliskanlik.uykuVeDinlenme.puan} / 10
                                </span>
                              </div>
                              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-blue-700 border border-blue-100 mb-2">
                                {selectedKarne.davranissal.bagimlilikVeAliskanlik.uykuVeDinlenme.seviye}
                              </span>
                              <p className="text-[11px] text-slate-600 leading-relaxed">
                                {selectedKarne.davranissal.bagimlilikVeAliskanlik.uykuVeDinlenme.aciklama}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Alışkanlık Notu */}
                        {selectedKarne.davranissal.bagimlilikVeAliskanlik.egitmenGorus && (
                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-600">
                            <span className="font-bold text-slate-700 shrink-0">Alışkanlık & Yaşam Notu:</span>
                            <span className="italic leading-relaxed">
                              {selectedKarne.davranissal.bagimlilikVeAliskanlik.egitmenGorus
                                .replace(/temiz sporcu kimliği/gi, 'sağlıklı sporcu disiplini')
                                .replace(/temiz spor/gi, 'sağlıklı yaşam')}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Karakter ve Tutum Özeti */}
                    {selectedKarne.davranissal.genelDegerlendirme && (
                      <div className="mt-5 bg-white border border-indigo-100/80 rounded-xl p-4 flex items-start gap-3 shadow-2xs">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-600 mt-0.5">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-indigo-950 uppercase tracking-wider mb-1">
                            Karakter ve Tutum Değerlendirmesi
                          </div>
                          <p className="text-xs md:text-sm text-slate-700 leading-relaxed italic">
                            "{selectedKarne.davranissal.genelDegerlendirme}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Attendance & Notes Section */}
              <div className="px-6 md:px-8 pb-8 space-y-6">
                
                {/* Attendance */}
                <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Antrenman Katılımı</h4>
                    <div className="text-xs font-medium text-slate-500 mt-0.5">
                      Toplam {selectedKarne.antrenmanSayisi} antrenman tamamlandı
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-base font-black ${
                      selectedKarne.katilimYuzdesi >= 90 ? 'bg-emerald-100 text-emerald-700' :
                      selectedKarne.katilimYuzdesi >= 75 ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      %{selectedKarne.katilimYuzdesi}
                    </div>
                  </div>
                </div>

                {/* Trainer Notes */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
                  <h4 className="font-bold text-blue-900 mb-2 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Antrenör Genel Değerlendirmesi
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    "{selectedKarne.antrenorNotu}"
                  </p>
                </div>

                {/* Focus Areas */}
                <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-5">
                  <h4 className="font-bold text-rose-900 mb-3 text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-600" />
                    Öncelikli Gelişim Alanları
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedKarne.gelisimAlanlari.map((alan, index) => (
                      <span key={index} className="bg-white border border-rose-200 text-rose-700 px-3 py-1 rounded-lg text-xs font-semibold shadow-2xs">
                        {alan}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer Signature Area */}
              <div className="bg-slate-50 p-6 md:p-8 flex items-center justify-between border-t border-slate-200">
                <div className="text-center">
                  <div className="w-32 h-px bg-slate-300 mb-2"></div>
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Antrenör</div>
                  <div className="text-sm text-slate-800 font-medium">{selectedKarne.antrenor}</div>
                </div>
                <div className="text-center">
                  <div className="w-32 h-px bg-slate-300 mb-2"></div>
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Veli / Sporcu İmza</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center min-h-[400px]">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Award className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Sporcu Karnesi Seçin</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Detaylı analiz, eğitmen notları ve puanlamaları görüntülemek için sol taraftaki listeden bir sporcu seçiniz.
            </p>
          </div>
        )}
      </div>

      {/* Add Observation Modal */}
      {isAddObservationOpen && selectedKarne && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">
                    Yeni Davranışsal Gözlem Ekle
                  </h3>
                  <p className="text-xs text-slate-500">Sporcu: {selectedKarne.adSoyad}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddObservationOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddObservation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Dönem / Periyot Bilgisi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 4. Dönem (Aralık)"
                  value={newObservation.donem}
                  onChange={e => setNewObservation({ ...newObservation, donem: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Odak / Gelişim Alanı <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Maç Sonu Centilmenliği & Hakem Saygısı"
                  value={newObservation.odakKonusu}
                  onChange={e => setNewObservation({ ...newObservation, odakKonusu: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Gözlemlenen Durum Seviyesi <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newObservation.durum}
                  onChange={e => setNewObservation({ ...newObservation, durum: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  <option value="Gelişiyor">Gelişiyor (Geliştirilmeye Açık)</option>
                  <option value="Hedefe Ulaştı">Hedefe Ulaştı (Beklenen Düzey)</option>
                  <option value="Örnek Davranış">Örnek Davranış (Rol Model)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Eğitmen Gözlem & Süreç Notu <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Sporcunun tutum, sportmenlik, sorumluluk veya antrenman ciddiyeti hakkındaki değerlendirmeniz..."
                  value={newObservation.gozlem}
                  onChange={e => setNewObservation({ ...newObservation, gozlem: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddObservationOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  Gözlemi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Badge Awarding & Management Modal for Trainers */}
      {isBadgeModalOpen && selectedKarne && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] my-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 shadow-2xs">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-base">
                      Davranışsal Rozet Kataloğu & Rozet Verme
                    </h3>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      Antrenör Paneli
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sporcu: <span className="font-semibold text-slate-700">{selectedKarne.adSoyad}</span> ({selectedKarne.brans} - {selectedKarne.grup})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBadgeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info / Status Banner */}
            <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
              <div className="flex items-center gap-2">
                <SportsFlyIcon className="w-4 h-4 shrink-0" />
                <span className="text-xs text-slate-600">
                  Sporcunun örnek davranışlarını kurumsal rozetlerle ödüllendirebilir veya gerektiğinde geri alabilirsiniz.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-slate-700">Aktif Rozet:</span>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {selectedKarne.davranissal.kazanimlar.length} / {KURUMSAL_ROZETLER.length}
                </span>
              </div>
            </div>

            {/* Search & Action Toolbar */}
            <div className="mt-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rozet adı, kategori veya açıklama ara..."
                  value={badgeSearchQuery}
                  onChange={e => setBadgeSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                />
                {badgeSearchQuery && (
                  <button
                    onClick={() => setBadgeSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsCustomBadgeOpen(!isCustomBadgeOpen)}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer shrink-0 ${
                  isCustomBadgeOpen 
                    ? 'bg-amber-50 border-amber-300 text-amber-800' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Plus className="w-3.5 h-3.5 text-amber-600" />
                <span>Özel Rozet Tanımla</span>
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0">
              {KURUMSAL_ROZET_KATEGORILERI.map(cat => (
                <button
                  key={cat}
                  onClick={() => setBadgeCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    badgeCategoryFilter === cat
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Custom Badge Collapsible Form */}
            {isCustomBadgeOpen && (
              <form onSubmit={handleAddCustomBadge} className="mt-3 p-4 rounded-xl bg-amber-50/50 border border-amber-200 shrink-0 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <SportsFlyIcon className="w-3.5 h-3.5" />
                    Kulübe / Maça Özel Yeni Rozet Tanımla
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsCustomBadgeOpen(false)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Rozet Başlığı *</label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Turnuva Centilmeni"
                      value={customBadge.baslik}
                      onChange={e => setCustomBadge({ ...customBadge, baslik: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Kategori</label>
                    <select
                      value={customBadge.kategori}
                      onChange={e => setCustomBadge({ ...customBadge, kategori: e.target.value as any })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="Karakter & Etik">Karakter & Etik</option>
                      <option value="Disiplin & Sorumluluk">Disiplin & Sorumluluk</option>
                      <option value="Sağlık & Yaşam Tarzı">Sağlık & Yaşam Tarzı</option>
                      <option value="Liderlik & Sosyal">Liderlik & Sosyal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Önem Seviyesi</label>
                    <select
                      value={customBadge.onemDerecesi}
                      onChange={e => setCustomBadge({ ...customBadge, onemDerecesi: e.target.value as any })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="Standart">Standart</option>
                      <option value="Özel Başarı">Özel Başarı</option>
                      <option value="Üstün Karakter">Üstün Karakter</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Kazanım Açıklaması *</label>
                  <input
                    type="text"
                    required
                    placeholder="Sporcunun bu rozeti hak eden tutumunu kısaca özetleyin..."
                    value={customBadge.aciklama}
                    onChange={e => setCustomBadge({ ...customBadge, aciklama: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsCustomBadgeOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shadow-2xs cursor-pointer"
                  >
                    Rozeti Ekle & Sporcuya Ver
                  </button>
                </div>
              </form>
            )}

            {/* Badge Catalog Grid (Scrollable) */}
            <div className="mt-3.5 flex-1 overflow-y-auto pr-1 space-y-2.5 min-h-[260px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {KURUMSAL_ROZETLER
                  .filter(rozet => {
                    const matchesCat = badgeCategoryFilter === 'Tümü' || rozet.kategori === badgeCategoryFilter;
                    const matchesQuery = 
                      rozet.baslik.toLowerCase().includes(badgeSearchQuery.toLowerCase()) ||
                      rozet.aciklama.toLowerCase().includes(badgeSearchQuery.toLowerCase()) ||
                      rozet.kategori.toLowerCase().includes(badgeSearchQuery.toLowerCase());
                    return matchesCat && matchesQuery;
                  })
                  .map(rozet => {
                    const isEarned = selectedKarne.davranissal.kazanimlar.some(
                      k => k.rozetId === rozet.id || k.baslik.toLowerCase() === rozet.baslik.toLowerCase()
                    );
                    const colors = rozet.renkTema;

                    return (
                      <div
                        key={rozet.id}
                        className={`rounded-xl p-3.5 border transition-all flex flex-col justify-between ${
                          isEarned 
                            ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-200/80 shadow-xs' 
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-9 h-9 rounded-xl ${colors.iconBg} ${colors.iconColor} flex items-center justify-center shrink-0 shadow-2xs`}>
                                {renderBadgeIcon(rozet.ikon, "w-4 h-4")}
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-800 leading-tight">
                                  {rozet.baslik}
                                </h4>
                                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${colors.badgeBg} ${colors.badgeText}`}>
                                    {rozet.kategori}
                                  </span>
                                  <span className="text-[9px] font-medium text-slate-400 flex items-center gap-0.5">
                                    <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-400" />
                                    {rozet.onemDerecesi}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {isEarned && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                                <Check className="w-3 h-3 text-emerald-600" />
                                Verildi
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-slate-600 leading-relaxed mt-2 mb-3">
                            {rozet.aciklama}
                          </p>
                        </div>

                        {/* Card Footer Action */}
                        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 italic">
                            {isEarned ? 'Sporcu karnesinde aktif' : 'Henüz verilmedi'}
                          </span>

                          {isEarned ? (
                            <button
                              type="button"
                              onClick={() => handleToggleBadge(rozet)}
                              className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                            >
                              Geri Al
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleBadge(rozet)}
                              className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Rozeti Ver</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between shrink-0">
              <div className="text-xs text-slate-500 hidden sm:block">
                Toplam <span className="font-semibold text-slate-700">{selectedKarne.davranissal.kazanimlar.length}</span> rozet aktif.
              </div>
              <button
                type="button"
                onClick={() => setIsBadgeModalOpen(false)}
                className="w-full sm:w-auto px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                Kapat & Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Veliye Karne Gönderim & Bildirim Merkezi Modal (WhatsApp / SMS) */}
      {selectedKarne && (
        <VeliKarneGonderimModal
          isOpen={isVeliModalOpen}
          onClose={() => setIsVeliModalOpen(false)}
          selectedKarne={selectedKarne}
          onUpdateKarne={(updated) => {
            updateAndSaveKarneler((prev) => prev.map((k) => (k.id === updated.id ? updated : k)));
          }}
          onDownloadPDF={handleDownloadPDF}
          isDownloadingPDF={isDownloading}
        />
      )}

      {/* Global Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="p-1 text-slate-400 hover:text-white rounded-md cursor-pointer ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
