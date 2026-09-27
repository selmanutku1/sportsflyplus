import React, { useState, useRef } from 'react';
import { exportReportPagesToA4Pdf, BatchA4PdfBuilder } from '../../../utils/pdfExportHelper';
import {
  Activity,
  Upload,
  Download,
  FileSpreadsheet,
  FileDown,
  Printer,
  Edit3,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Layers,
  HeartPulse,
  Compass,
  Target,
  Scale,
  Sparkles,
  Eye,
  FileText,
  Bot,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Zap,
  BarChart3,
  Building2,
  ImagePlus,
  Trash2,
  ShieldCheck,
  UserPlus,
  Archive,
  BookmarkPlus,
  Search,
  Calendar,
  FolderOpen,
  Users,
  CheckSquare,
  Square,
  Files,
  SlidersHorizontal,
  ArrowRightLeft,
  Save,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';
import { SportsFlyVectorMark } from '../../SportsFlyLogo';
import {
  SportsFlyLabPerformanceCharts,
  SportsFlyLabKarnePage5RadarContent,
  SportsFlyLabKarnePage6LineContent,
} from '../../charts/KarnePerformansGrafikleri';
import {
  SportsFlyLabReport,
  SportsFlyLabSchoolBranding,
  SportsFlyLabArchivedReport,
  LabParameterRow,
  LabAiPerformanceAnalysis,
  LabBatchFieldCategory,
  LAB_BATCH_MAPPABLE_FIELDS,
  SAMPLE_BATCH_ATHLETE_ROWS,
  CUSTOM_FORMAT_SAMPLE_ROWS,
  ParsedExcelSheetData,
  extractExcelWorkbookSheets,
  autoDetectExcelColumnMapping,
  saveStoredLabColumnMapping,
  buildBatchReportsFromMappedRows,
  getStoredLabReports,
  saveStoredLabReports,
  getStoredLabSchoolBranding,
  saveStoredLabSchoolBranding,
  getStoredLabArchives,
  archiveLabReport,
  archiveBatchLabReports,
  renameLabArchiveItem,
  deleteLabArchiveItem,
  applyBrandingToReport,
  applyBrandingToReports,
  createNewLabReportWithBranding,
  downloadSportsFlyLabExcelTemplate,
  downloadBatchSportsFlyLabExcelTemplate,
  generateSampleBatchLabReports,
  parseSportsFlyLabExcel,
  analyzeLabPerformanceMetrics,
  fetchGeminiLabRecommendations,
} from '../../../data/sportsFlyLabData';

interface SportsFlyLabViewProps {
  onToast?: (msg: string) => void;
}

const PAGE_TITLES = [
  { page: 1, short: '1. Beden', full: '1. Beden Kompozisyonu Değerlendirmesi (Beden Sağlığı)' },
  { page: 2, short: '2. Motor', full: '2. Motor Performans Değerlendirmesi (Sportif Performans)' },
  { page: 3, short: '3. Somatotip', full: '3. Beden Tipi (Heath-Carter) & 5. Bileşenlerin Yönü' },
  { page: 4, short: '4. Kalp & Güç', full: '4. Kardiyorespiratuar Uygunluk, Anaerobik Güç & 6. Risk Noktaları' },
  { page: 5, short: '5. Radar Grafik', full: '7. Performans Grafikleri I — Motor Performans Yüzdelik Radar & Antropometrik Radar' },
  { page: 6, short: '6. Gelişim Grafik', full: '8. Performans Grafikleri II — Genel Sportif Performans Puan Gelişimi & Dönemsel Eğriler' },
  { page: 7, short: '7. Hedef & PHV', full: '9. Hedef Performans (İpsatif), Tepe Boy Hızı (PHV) & Uzman Görüşü' },
];

export type KarneTemplateId =
  | 'modern-minimal'
  | 'athletic-data'
  | 'corporate-technical';

export type ClubColorPaletteId =
  | 'template-default'
  | 'sari-lacivert'
  | 'sari-kirmizi'
  | 'siyah-beyaz'
  | 'bordo-mavi'
  | 'zumrut-beyaz'
  | 'custom';

interface ClubColorPaletteOption {
  id: ClubColorPaletteId;
  name: string;
  shortName: string;
  primaryHex: string;
  secondaryHex: string;
  accentHex: string;
}

const CLUB_COLOR_PALETTES: ClubColorPaletteOption[] = [
  {
    id: 'template-default',
    name: 'Şablon Varsayılan Rengi',
    shortName: 'Şablon Rengi',
    primaryHex: '#0f172a',
    secondaryHex: '#0ea5e9',
    accentHex: '#e11d48',
  },
  {
    id: 'sari-lacivert',
    name: 'Sarı - Lacivert (Kulüp Teması)',
    shortName: 'Sarı - Lacivert',
    primaryHex: '#0c1d4a',
    secondaryHex: '#facc15',
    accentHex: '#eab308',
  },
  {
    id: 'sari-kirmizi',
    name: 'Sarı - Kırmızı (Kulüp Teması)',
    shortName: 'Sarı - Kırmızı',
    primaryHex: '#881337',
    secondaryHex: '#f59e0b',
    accentHex: '#e11d48',
  },
  {
    id: 'siyah-beyaz',
    name: 'Siyah - Beyaz (Kulüp Teması)',
    shortName: 'Siyah - Beyaz',
    primaryHex: '#09090b',
    secondaryHex: '#71717a',
    accentHex: '#27272a',
  },
  {
    id: 'bordo-mavi',
    name: 'Bordo - Mavi (Kulüp Teması)',
    shortName: 'Bordo - Mavi',
    primaryHex: '#5c0f24',
    secondaryHex: '#38bdf8',
    accentHex: '#0284c7',
  },
  {
    id: 'zumrut-beyaz',
    name: 'Zümrüt Yeşil - Beyaz (Kulüp Teması)',
    shortName: 'Yeşil - Beyaz',
    primaryHex: '#064e3b',
    secondaryHex: '#10b981',
    accentHex: '#059669',
  },
  {
    id: 'custom',
    name: 'Özel Kulüp Rengi (Serbest Seçim)',
    shortName: 'Özel Renk',
    primaryHex: '#1e3a8a',
    secondaryHex: '#f97316',
    accentHex: '#ea580c',
  },
];

interface KarneTemplateOption {
  id: KarneTemplateId;
  name: string;
  shortName: string;
  subtitle: string;
  badgeColor: string;
  pageFrameClass: string;
  headerBoxClass: string;
  headerTitleClass: string;
  headerSubtitleClass: string;
  headerMetaClass: string;
  bannerClass: string;
  tableHeadClass: string;
  accentTextClass: string;
  accentBgClass: string;
  footerBorderClass: string;
  defaultPrimaryHex: string;
  defaultSecondaryHex: string;
}

const KARNE_TEMPLATES: KarneTemplateOption[] = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    shortName: '1. Modern Minimal',
    subtitle: 'Ferah tipografi, ince zarif çizgiler, sadeleştirilmiş veli ve akademi dostu modern mizanpaj',
    badgeColor: 'bg-sky-600 text-white',
    pageFrameClass: 'bg-white text-slate-900 border border-slate-200',
    headerBoxClass: 'bg-slate-50/90 text-slate-900 p-3.5 rounded-2xl border border-slate-200/90 mb-4',
    headerTitleClass: 'text-slate-900',
    headerSubtitleClass: 'text-slate-500',
    headerMetaClass: 'text-sky-600',
    bannerClass: 'bg-slate-900 text-white border border-slate-800',
    tableHeadClass: 'bg-slate-800 text-white',
    accentTextClass: 'text-sky-700',
    accentBgClass: 'bg-sky-50/60',
    footerBorderClass: 'border-t border-slate-200 text-slate-500',
    defaultPrimaryHex: '#0f172a',
    defaultSecondaryHex: '#0284c7',
  },
  {
    id: 'athletic-data',
    name: 'Atletik Veri Odaklı',
    shortName: '2. Atletik Veri Odaklı',
    subtitle: 'Yüksek kontrastlı pro-analitik sporcu dashboard yapısı, dinamik yüzdelik barları ve koyu başlık panelleri',
    badgeColor: 'bg-emerald-600 text-white',
    pageFrameClass: 'bg-white text-slate-900 border-2 border-slate-900',
    headerBoxClass: 'bg-slate-900 text-white p-3.5 rounded-xl border-b-4 border-emerald-400 mb-4',
    headerTitleClass: 'text-white',
    headerSubtitleClass: 'text-slate-300',
    headerMetaClass: 'text-emerald-400',
    bannerClass: 'bg-slate-900 text-white border border-emerald-500/40',
    tableHeadClass: 'bg-slate-900 text-emerald-300',
    accentTextClass: 'text-emerald-700',
    accentBgClass: 'bg-emerald-50/60',
    footerBorderClass: 'border-t-2 border-slate-900 text-slate-600',
    defaultPrimaryHex: '#0f172a',
    defaultSecondaryHex: '#10b981',
  },
  {
    id: 'corporate-technical',
    name: 'Kurumsal Teknik',
    shortName: '3. Kurumsal Teknik',
    subtitle: 'Resmi federasyon ve biyomekanik laboratuvar standardı, cetvelli teknik tablo ve Z-skor/SD analitik düzeni',
    badgeColor: 'bg-amber-600 text-white',
    pageFrameClass: 'bg-white text-slate-900 border-2 border-slate-400 ring-2 ring-slate-900/5',
    headerBoxClass: 'bg-slate-950 text-white p-3.5 rounded-xl border-b-4 border-amber-400 mb-4',
    headerTitleClass: 'text-amber-300',
    headerSubtitleClass: 'text-slate-300',
    headerMetaClass: 'text-amber-400',
    bannerClass: 'bg-slate-950 text-amber-50 border border-amber-500/50',
    tableHeadClass: 'bg-slate-950 text-amber-300',
    accentTextClass: 'text-rose-700',
    accentBgClass: 'bg-amber-50/50',
    footerBorderClass: 'border-t-2 border-slate-400 text-slate-600',
    defaultPrimaryHex: '#0f172a',
    defaultSecondaryHex: '#f59e0b',
  },
];

export const SportsFlyLabView: React.FC<SportsFlyLabViewProps> = ({ onToast }) => {
  const [reports, setReports] = useState<SportsFlyLabReport[]>(() => getStoredLabReports());
  const [selectedReportId, setSelectedReportId] = useState<string>(() => {
    const list = getStoredLabReports();
    return list[0]?.id || 'lab-rep-1';
  });

  // Main module tab: 'studio' (Karne Oluşturucu & Önizleme), 'batch' (Toplu Karne Oluşturma - Excel), or 'archive' (Karne Arşivi)
  const [activeLabTab, setActiveLabTab] = useState<'studio' | 'batch' | 'archive'>('studio');

  // Toplu Karne Oluşturma (Batch Excel) state
  const [initialSampleBatch] = useState<SportsFlyLabReport[]>(() => {
    const base = getStoredLabReports()[0];
    return generateSampleBatchLabReports(base);
  });
  const [batchReports, setBatchReports] = useState<SportsFlyLabReport[]>(initialSampleBatch);
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>(() =>
    initialSampleBatch.map((r) => r.id)
  );
  const [batchSourceFileName, setBatchSourceFileName] = useState<string>(
    'SportsFly_Lab_Toplu_Sporcu_Sablonu (6 Örnek Sporcu).xlsx'
  );
  const [batchGroupTitle, setBatchGroupTitle] = useState<string>(
    '2026 Eylül Dönemi 3. Ölçüm Karnesi'
  );
  const [batchGroupNote, setBatchGroupNote] = useState<string>(
    'Excel Toplu Sporcu Verisi · Kurumsal Performans ve PHV Taraması'
  );
  const [autoArchiveOnBatchCreate, setAutoArchiveOnBatchCreate] = useState<boolean>(true);
  const [batchSearchQuery, setBatchSearchQuery] = useState<string>('');
  const [isGeneratingBatchPDF, setIsGeneratingBatchPDF] = useState<boolean>(false);
  const [batchPdfStatusText, setBatchPdfStatusText] = useState<string | null>(null);
  const [isDraggingBatchExcel, setIsDraggingBatchExcel] = useState<boolean>(false);

  // Excel Sütun Eşleştirme (Column Mapping) State
  const [rawExcelSheets, setRawExcelSheets] = useState<ParsedExcelSheetData[]>(() => {
    const headers = Object.keys(SAMPLE_BATCH_ATHLETE_ROWS[0] || {});
    return [
      {
        sheetName: 'Toplu_Sporcu_Listesi',
        headers,
        rows: SAMPLE_BATCH_ATHLETE_ROWS,
        isParameterVerticalSheet: false,
      },
    ];
  });
  const [activeExcelSheetIndex, setActiveExcelSheetIndex] = useState<number>(0);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>(() => {
    const headers = Object.keys(SAMPLE_BATCH_ATHLETE_ROWS[0] || {});
    return autoDetectExcelColumnMapping(headers, true);
  });
  const [showColumnMappingPanel, setShowColumnMappingPanel] = useState<boolean>(true);
  const [mappingCategoryFilter, setMappingCategoryFilter] = useState<
    'all' | 'essential' | LabBatchFieldCategory
  >('all');
  const [mappingSearchQuery, setMappingSearchQuery] = useState<string>('');

  // Karne Arşivi state
  const [archivedReports, setArchivedReports] = useState<SportsFlyLabArchivedReport[]>(() =>
    getStoredLabArchives()
  );
  const [archiveSearchQuery, setArchiveSearchQuery] = useState<string>('');
  const [archiveSortBy, setArchiveSortBy] = useState<'newest' | 'score' | 'name'>('newest');
  const [showSaveArchiveModal, setShowSaveArchiveModal] = useState<boolean>(false);
  const [archiveTitleInput, setArchiveTitleInput] = useState<string>('');
  const [archiveNoteInput, setArchiveNoteInput] = useState<string>('');
  const [editingArchiveItem, setEditingArchiveItem] = useState<SportsFlyLabArchivedReport | null>(
    null
  );
  const [editArchiveTitleInput, setEditArchiveTitleInput] = useState<string>('');
  const [editArchiveNoteInput, setEditArchiveNoteInput] = useState<string>('');

  // View mode: 'single' (1 page at a time) or 'all' (all 7 pages stacked for full review / PDF)
  const [viewMode, setViewMode] = useState<'single' | 'all'>('all');
  const [activePage, setActivePage] = useState<number>(1);
  const [isPdfPreviewMode, setIsPdfPreviewMode] = useState<boolean>(false);
  const [pdfZoom, setPdfZoom] = useState<number>(100);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const [pdfProgressPage, setPdfProgressPage] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showNewReportModal, setShowNewReportModal] = useState<boolean>(false);
  const [newAthleteForm, setNewAthleteForm] = useState<{
    athleteName: string;
    sportBranch: string;
    gender: 'Erkek' | 'Kadın';
    ageYears: number;
  }>({
    athleteName: '',
    sportBranch: 'Voleybol / Çoklu Branş Gelişim',
    gender: 'Erkek',
    ageYears: 11.5,
  });
  const [showChartsPanel, setShowChartsPanel] = useState<boolean>(true);
  const [showAiPanel, setShowAiPanel] = useState<boolean>(true);
  const [showBrandingSettings, setShowBrandingSettings] = useState<boolean>(false);
  const [showBodyMapInfographic, setShowBodyMapInfographic] = useState<boolean>(true);
  const [karneTemplate, setKarneTemplate] = useState<KarneTemplateId>(() => {
    try {
      const saved = localStorage.getItem('sportsfly_lab_karne_template_v2') as KarneTemplateId | null;
      if (saved && KARNE_TEMPLATES.some((t) => t.id === saved)) return saved;
    } catch {
      // ignore storage errors
    }
    return 'athletic-data';
  });
  const activeTemplate =
    KARNE_TEMPLATES.find((t) => t.id === karneTemplate) || KARNE_TEMPLATES[0];

  const handleSelectKarneTemplate = (tplId: KarneTemplateId) => {
    setKarneTemplate(tplId);
    try {
      localStorage.setItem('sportsfly_lab_karne_template_v2', tplId);
    } catch {
      // ignore
    }
  };

  // C: Dynamic Club Color Palette State (Sarı-Lacivert, Sarı-Kırmızı, Siyah-Beyaz, Bordo-Mavi, Özel Renk)
  const [clubColorPalette, setClubColorPalette] = useState<ClubColorPaletteId>(() => {
    try {
      const saved = localStorage.getItem('sportsfly_lab_club_palette_v1') as ClubColorPaletteId | null;
      if (saved && CLUB_COLOR_PALETTES.some((p) => p.id === saved)) return saved;
    } catch {
      // ignore
    }
    return 'template-default';
  });
  const [customPrimaryHex, setCustomPrimaryHex] = useState<string>(() => {
    try {
      return localStorage.getItem('sportsfly_lab_custom_primary_hex') || '#0c1d4a';
    } catch {
      return '#0c1d4a';
    }
  });
  const [customSecondaryHex, setCustomSecondaryHex] = useState<string>(() => {
    try {
      return localStorage.getItem('sportsfly_lab_custom_secondary_hex') || '#facc15';
    } catch {
      return '#facc15';
    }
  });

  const handleSelectClubColorPalette = (paletteId: ClubColorPaletteId) => {
    setClubColorPalette(paletteId);
    try {
      localStorage.setItem('sportsfly_lab_club_palette_v1', paletteId);
    } catch {
      // ignore
    }
  };

  const activePaletteObj =
    CLUB_COLOR_PALETTES.find((p) => p.id === clubColorPalette) || CLUB_COLOR_PALETTES[0];
  const effectivePrimaryHex =
    clubColorPalette === 'custom'
      ? customPrimaryHex
      : clubColorPalette === 'template-default'
        ? activeTemplate.defaultPrimaryHex
        : activePaletteObj.primaryHex;
  const effectiveSecondaryHex =
    clubColorPalette === 'custom'
      ? customSecondaryHex
      : clubColorPalette === 'template-default'
        ? activeTemplate.defaultSecondaryHex
        : activePaletteObj.secondaryHex;

  const [openHeaderMenu, setOpenHeaderMenu] = useState<
    'excel' | 'karne' | 'panels' | 'export' | 'batchSamples' | 'templates' | 'clubColors' | null
  >(null);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [localToast, setLocalToast] = useState<string | null>(null);
  const [schoolBranding, setSchoolBranding] = useState<SportsFlyLabSchoolBranding>(() =>
    getStoredLabSchoolBranding()
  );

  const headerMenuContainerRef = useRef<HTMLDivElement>(null);

  // Close open dropdown menus when clicking outside
  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        headerMenuContainerRef.current &&
        !headerMenuContainerRef.current.contains(event.target as Node)
      ) {
        setOpenHeaderMenu(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Ensure browser native print (Ctrl+P / Cmd+P) automatically expands all 7 pages at 100% scale,
  // and keep schoolBranding synced across browser tabs / storage events
  React.useEffect(() => {
    const handleBeforePrint = () => {
      setActiveLabTab('studio');
      setViewMode('all');
      setPdfZoom(100);
    };
    const handleStorageSync = () => {
      const latestBranding = getStoredLabSchoolBranding();
      setSchoolBranding(latestBranding);
      setReports((prev) => applyBrandingToReports(prev, latestBranding));
      setArchivedReports(getStoredLabArchives());
    };
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('storage', handleStorageSync);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('storage', handleStorageSync);
    };
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const batchFileInputRef = useRef<HTMLInputElement>(null);
  const schoolLogoInputRef = useRef<HTMLInputElement>(null);

  const currentReport = reports.find((r) => r.id === selectedReportId) || reports[0];
  const effectiveClubName =
    schoolBranding.schoolName.trim() || currentReport.clubName || 'SPOR OKULU AKADEMİSİ';
  const effectiveBranchName =
    schoolBranding.branchName.trim() || currentReport.branchName || 'Merkez Kampüs';
  const effectiveSchoolLogo = schoolBranding.logoDataUrl || currentReport.clubLogoUrl || '';

  const activeAiAnalysis: LabAiPerformanceAnalysis =
    currentReport.aiRecommendations || analyzeLabPerformanceMetrics(currentReport);

  const notify = (msg: string) => {
    if (onToast) onToast(msg);
    setLocalToast(msg);
    setTimeout(() => setLocalToast(null), 3500);
  };

  // Update Sport School Name / Branch / Logo in localStorage and automatically sync all reports
  const handleSchoolBrandingChange = (patch: Partial<SportsFlyLabSchoolBranding>) => {
    const merged: SportsFlyLabSchoolBranding = { ...schoolBranding, ...patch };
    const savedBranding = saveStoredLabSchoolBranding(merged);
    setSchoolBranding(savedBranding);

    // Automatically apply the updated branding to all loaded reports so any switched or newly created report reflects it
    const nextList = applyBrandingToReports(reports, savedBranding);
    setReports(nextList);
    saveStoredLabReports(nextList);
  };

  // Explicitly confirm & apply Sport School Name & Logo to all loaded and future athlete report cards
  const handleApplyBrandingToAllReports = () => {
    const savedBranding = saveStoredLabSchoolBranding(schoolBranding);
    setSchoolBranding(savedBranding);
    const nextList = applyBrandingToReports(reports, savedBranding);
    setReports(nextList);
    saveStoredLabReports(nextList);
    notify(
      `"${savedBranding.schoolName}" karne tasarım ayarları tarayıcıda kalıcı hale getirildi ve tüm karnelere uygulandı.`
    );
  };

  // Create a brand new athlete report card with persisted localStorage school branding automatically applied
  const handleCreateNewReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAthleteForm.athleteName.trim()) {
      notify('Lütfen sporcu adı soyadı girin.');
      return;
    }
    const createdReport = createNewLabReportWithBranding({
      athleteName: newAthleteForm.athleteName,
      sportBranch: newAthleteForm.sportBranch,
      gender: newAthleteForm.gender,
      ageYears: newAthleteForm.ageYears,
      baseTemplate: currentReport,
    });
    const nextList = [createdReport, ...reports];
    setReports(nextList);
    saveStoredLabReports(nextList);
    setSelectedReportId(createdReport.id);
    setShowNewReportModal(false);
    setNewAthleteForm({
      athleteName: '',
      sportBranch: createdReport.sportBranch,
      gender: 'Erkek',
      ageYears: 11.5,
    });
    notify(
      `"${createdReport.athleteName}" için yeni 7 sayfalık karne, "${effectiveClubName}" kurumsal başlığı ve logosu otomatik uygulanarak oluşturuldu.`
    );
  };

  // Open Save-to-Archive modal with a pre-filled descriptive name
  const handleOpenSaveArchiveModal = (targetReport: SportsFlyLabReport = currentReport) => {
    setArchiveTitleInput(
      `${targetReport.athleteName} — ${targetReport.date3} Dönem Karnesi (${targetReport.sportBranch})`
    );
    setArchiveNoteInput(
      `${effectiveClubName} · 3. Ölçüm Genel Performans: %${targetReport.scoreHistory.p3Score}`
    );
    setShowSaveArchiveModal(true);
  };

  // Save current report card into Karne Arşivi with user's custom name
  const handleConfirmSaveToArchive = (e: React.FormEvent) => {
    e.preventDefault();
    const customName =
      archiveTitleInput.trim() ||
      `${currentReport.athleteName} — ${currentReport.date3} Dönem Karnesi`;
    const nextArchives = archiveLabReport(currentReport, customName, archiveNoteInput);
    setArchivedReports(nextArchives);
    setShowSaveArchiveModal(false);
    notify(`"${customName}" adıyla Karne Arşivi'ne kaydedildi.`);
  };

  // Open an archived report card in the 7-page viewer (and optionally in A4 PDF preview or download)
  const handleOpenArchivedReport = (
    item: SportsFlyLabArchivedReport,
    mode: 'view' | 'pdf-preview' | 'download-pdf' = 'view'
  ) => {
    const snapshot = applyBrandingToReport(item.reportSnapshot, schoolBranding);
    const exists = reports.some((r) => r.id === snapshot.id);
    const nextReports = exists
      ? reports.map((r) => (r.id === snapshot.id ? snapshot : r))
      : [snapshot, ...reports];

    setReports(nextReports);
    saveStoredLabReports(nextReports);
    setSelectedReportId(snapshot.id);
    setActiveLabTab('studio');
    setViewMode('all');

    if (mode === 'pdf-preview') {
      setIsPdfPreviewMode(true);
      notify(`"${item.archiveTitle}" A4 PDF önizleme modunda açıldı.`);
    } else if (mode === 'download-pdf') {
      setIsPdfPreviewMode(false);
      notify(`"${item.archiveTitle}" yüklendi, PDF indiriliyor...`);
      setTimeout(() => {
        void handleDownloadPDF();
      }, 250);
    } else {
      setIsPdfPreviewMode(false);
      notify(`"${item.archiveTitle}" arşivden yüklendi ve görüntüleniyor.`);
    }
  };

  // Rename an archived report card
  const handleRenameArchiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArchiveItem) return;
    const next = renameLabArchiveItem(
      editingArchiveItem.archiveId,
      editArchiveTitleInput,
      editArchiveNoteInput
    );
    setArchivedReports(next);
    setEditingArchiveItem(null);
    notify('Arşivdeki karne ismi güncellendi.');
  };

  // Delete an archived report card
  const handleDeleteArchiveItem = (item: SportsFlyLabArchivedReport) => {
    const next = deleteLabArchiveItem(item.archiveId);
    setArchivedReports(next);
    notify(`"${item.archiveTitle}" karne arşivinden kaldırıldı.`);
  };

  const filteredArchivedReports = React.useMemo(() => {
    const q = archiveSearchQuery.trim().toLowerCase();
    const filtered = archivedReports.filter((item) => {
      if (!q) return true;
      const rep = item.reportSnapshot;
      return (
        item.archiveTitle.toLowerCase().includes(q) ||
        (item.archiveNote || '').toLowerCase().includes(q) ||
        rep.athleteName.toLowerCase().includes(q) ||
        rep.sportBranch.toLowerCase().includes(q) ||
        rep.clubName.toLowerCase().includes(q) ||
        item.savedAt.toLowerCase().includes(q)
      );
    });

    return [...filtered].sort((a, b) => {
      if (archiveSortBy === 'score') {
        return (
          (b.reportSnapshot.scoreHistory?.p3Score || 0) -
          (a.reportSnapshot.scoreHistory?.p3Score || 0)
        );
      }
      if (archiveSortBy === 'name') {
        return a.archiveTitle.localeCompare(b.archiveTitle, 'tr');
      }
      return (b.savedTimestamp || 0) - (a.savedTimestamp || 0);
    });
  }, [archivedReports, archiveSearchQuery, archiveSortBy]);

  // Handle Sport School Logo Upload (converts to compact Base64 Data URL for persistence & A4 PDF export)
  const handleSchoolLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const resultUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!resultUrl) return;

      // Resize large raster images on an offscreen canvas so localStorage and PDF export stay fast
      const img = new Image();
      img.onload = () => {
        const maxDim = 320;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w || 200;
        canvas.height = h || 200;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const optimizedDataUrl = canvas.toDataURL('image/png', 0.92);
          handleSchoolBrandingChange({ logoDataUrl: optimizedDataUrl });
          notify('Spor okulu logosu yüklendi ve karne üst başlığına eklendi.');
        } else {
          handleSchoolBrandingChange({ logoDataUrl: resultUrl });
          notify('Spor okulu logosu yüklendi.');
        }
      };
      img.onerror = () => {
        handleSchoolBrandingChange({ logoDataUrl: resultUrl });
        notify('Spor okulu logosu yüklendi.');
      };
      img.src = resultUrl;
    };
    reader.readAsDataURL(file);

    if (schoolLogoInputRef.current) {
      schoolLogoInputRef.current.value = '';
    }
  };

  // Process an Excel file for either Single or Batch Report Card Creation
  const processUploadedExcelFile = async (file: File, fromBatchTab: boolean = false) => {
    try {
      const buffer = await file.arrayBuffer();
      const persistedBranding = getStoredLabSchoolBranding();
      setSchoolBranding(persistedBranding);

      const templateWithBranding = applyBrandingToReport(currentReport, persistedBranding);
      const extractedSheets = extractExcelWorkbookSheets(buffer);

      // Prefer a flat multi-athlete sheet if available
      const flatSheetIdx = extractedSheets.findIndex((s) => !s.isParameterVerticalSheet);
      const chosenSheetIdx = flatSheetIdx >= 0 ? flatSheetIdx : 0;
      const activeSheet = extractedSheets[chosenSheetIdx];

      if (activeSheet && (!activeSheet.isParameterVerticalSheet || fromBatchTab)) {
        setRawExcelSheets(extractedSheets);
        setActiveExcelSheetIndex(chosenSheetIdx);

        const detectedMapping = autoDetectExcelColumnMapping(activeSheet.headers, true);
        setColumnMapping(detectedMapping);
        setShowColumnMappingPanel(true);

        const mappedReports = buildBatchReportsFromMappedRows(
          activeSheet.rows,
          detectedMapping,
          templateWithBranding
        ).map((rep) => applyBrandingToReport(rep, persistedBranding));

        setBatchSourceFileName(file.name);

        if (mappedReports.length > 0) {
          setBatchReports(mappedReports);
          setSelectedBatchIds(mappedReports.map((r) => r.id));

          const updatedList = applyBrandingToReports(
            [...mappedReports, ...reports],
            persistedBranding
          );
          setReports(updatedList);
          saveStoredLabReports(updatedList);
          setSelectedReportId(mappedReports[0].id);
          setActiveLabTab('batch');

          const mappedFieldCount = Object.values(detectedMapping).filter(Boolean).length;
          notify(
            `"${file.name}" yüklendi: ${activeSheet.headers.length} Excel sütunundan ${mappedFieldCount} karne alanı otomatik eşleştirildi (${mappedReports.length} sporcu).`
          );
          void handleRunAiAnalysis(mappedReports[0], updatedList);
        } else {
          // If Sporcu_Adi wasn't auto-detected because of a completely custom column name, open the Batch Mapping UI so the user can pick the Name column!
          setBatchReports([]);
          setSelectedBatchIds([]);
          setActiveLabTab('batch');
          notify(
            `"${file.name}" yüklendi (${activeSheet.rows.length} satır). Lütfen Sütun Eşleştirme Arayüzü'nden "Sporcu Adı Soyadı" ve ilgili ölçüm sütunlarını seçin.`
          );
        }
        return;
      }

      // Fallback for single-athlete vertical parameter sheet ("Parametre_Bazli_Karne")
      const parsedReports = parseSportsFlyLabExcel(buffer, templateWithBranding, fromBatchTab).map(
        (rep) => applyBrandingToReport(rep, persistedBranding)
      );

      if (parsedReports.length === 0) {
        notify(
          'Excel dosyasında uygun sporcu veya parametre verisi bulunamadı. Lütfen örnek şablonu kontrol edin.'
        );
        return;
      }

      const updatedList = applyBrandingToReports(
        [...parsedReports, ...reports],
        persistedBranding
      );
      setReports(updatedList);
      saveStoredLabReports(updatedList);
      setSelectedReportId(parsedReports[0].id);

      setBatchReports(parsedReports);
      setSelectedBatchIds(parsedReports.map((r) => r.id));
      setBatchSourceFileName(file.name);
      setShowAiPanel(true);
      notify(
        `${parsedReports.length} sporcu karnesi "${persistedBranding.schoolName}" başlığı ve logosu otomatik uygulanarak oluşturuldu.`
      );

      void handleRunAiAnalysis(parsedReports[0], updatedList);
    } catch (err) {
      console.error('Excel okuma hatası:', err);
      notify(
        'Excel dosyası okunurken bir hata oluştu. Lütfen .xlsx veya .csv formatında yükleyin.'
      );
    }
  };

  // Handle Excel Upload from Top Toolbar
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processUploadedExcelFile(file, false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle Excel Upload from Batch Tab Input
  const handleBatchExcelInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processUploadedExcelFile(file, true);
    if (batchFileInputRef.current) batchFileInputRef.current.value = '';
  };

  // Load 6 Sample Athletes (Standard Template Headers) into Batch Table & Column Mapper
  const handleLoadSampleBatchData = () => {
    const persistedBranding = getStoredLabSchoolBranding();
    setSchoolBranding(persistedBranding);
    const headers = Object.keys(SAMPLE_BATCH_ATHLETE_ROWS[0] || {});
    const sheet: ParsedExcelSheetData = {
      sheetName: 'Toplu_Sporcu_Listesi',
      headers,
      rows: SAMPLE_BATCH_ATHLETE_ROWS,
      isParameterVerticalSheet: false,
    };
    setRawExcelSheets([sheet]);
    setActiveExcelSheetIndex(0);
    const detected = autoDetectExcelColumnMapping(headers, false);
    setColumnMapping(detected);

    const samples = buildBatchReportsFromMappedRows(
      SAMPLE_BATCH_ATHLETE_ROWS,
      detected,
      currentReport
    ).map((rep) => applyBrandingToReport(rep, persistedBranding));

    setBatchReports(samples);
    setSelectedBatchIds(samples.map((r) => r.id));
    setBatchSourceFileName('SportsFly_Lab_Toplu_Sporcu_Sablonu (6 Örnek Sporcu).xlsx');
    notify('Standart şablon başlıklarına sahip 6 sporculuk örnek veri seti yüklendi ve sütunlar eşleştirildi.');
  };

  // Load 4 Sample Athletes with Custom / Non-Standard School Excel Headers to test Column Mapping flexibility
  const handleLoadCustomFormatSampleExcel = () => {
    const persistedBranding = getStoredLabSchoolBranding();
    setSchoolBranding(persistedBranding);
    const headers = Object.keys(CUSTOM_FORMAT_SAMPLE_ROWS[0] || {});
    const sheet: ParsedExcelSheetData = {
      sheetName: 'Okul_Ozel_Olcum_Tablosu',
      headers,
      rows: CUSTOM_FORMAT_SAMPLE_ROWS,
      isParameterVerticalSheet: false,
    };
    setRawExcelSheets([sheet]);
    setActiveExcelSheetIndex(0);
    const detected = autoDetectExcelColumnMapping(headers, false);
    setColumnMapping(detected);
    setShowColumnMappingPanel(true);

    const samples = buildBatchReportsFromMappedRows(
      CUSTOM_FORMAT_SAMPLE_ROWS,
      detected,
      currentReport
    ).map((rep) => applyBrandingToReport(rep, persistedBranding));

    setBatchReports(samples);
    setSelectedBatchIds(samples.map((r) => r.id));
    setBatchSourceFileName('Farkli_Format_Okul_Olcum_Listesi (4 Sporcu - Özel Başlıklar).xlsx');
    notify(
      'Farklı sütun başlıklarına sahip örnek Excel verisi yüklendi. Sütun Eşleştirme Arayüzü üzerinden eşleşmeleri inceleyebilir veya değiştirebilirsiniz.'
    );
  };

  const activeExcelSheet: ParsedExcelSheetData | undefined =
    rawExcelSheets[activeExcelSheetIndex] || rawExcelSheets[0];

  // Switch between sheets in a multi-sheet uploaded Excel workbook
  const handleSwitchExcelSheet = (newIndex: number) => {
    const targetSheet = rawExcelSheets[newIndex];
    if (!targetSheet) return;
    setActiveExcelSheetIndex(newIndex);
    const detected = autoDetectExcelColumnMapping(targetSheet.headers, true);
    setColumnMapping(detected);

    const persistedBranding = getStoredLabSchoolBranding();
    const rebuilt = buildBatchReportsFromMappedRows(
      targetSheet.rows,
      detected,
      currentReport
    ).map((rep) => applyBrandingToReport(rep, persistedBranding));

    setBatchReports(rebuilt);
    setSelectedBatchIds(rebuilt.map((r) => r.id));
    notify(
      `"${targetSheet.sheetName}" sayfası seçildi (${targetSheet.headers.length} sütun, ${rebuilt.length} sporcu).`
    );
  };

  // Update a single field's Excel column mapping and immediately recalculate the batch athlete reports
  const handleColumnMappingChange = (systemFieldKey: string, selectedExcelHeader: string) => {
    const nextMapping: Record<string, string> = { ...columnMapping };
    if (!selectedExcelHeader) {
      delete nextMapping[systemFieldKey];
    } else {
      nextMapping[systemFieldKey] = selectedExcelHeader;
    }
    setColumnMapping(nextMapping);

    if (activeExcelSheet) {
      const persistedBranding = getStoredLabSchoolBranding();
      const rebuilt = buildBatchReportsFromMappedRows(
        activeExcelSheet.rows,
        nextMapping,
        currentReport
      ).map((rep) => applyBrandingToReport(rep, persistedBranding));

      setBatchReports(rebuilt);
      setSelectedBatchIds(rebuilt.map((r) => r.id));
    }
  };

  // Re-run smart auto-detection on the active sheet's headers
  const handleAutoDetectMappingClick = () => {
    if (!activeExcelSheet) return;
    const detected = autoDetectExcelColumnMapping(activeExcelSheet.headers, false);
    setColumnMapping(detected);

    const persistedBranding = getStoredLabSchoolBranding();
    const rebuilt = buildBatchReportsFromMappedRows(
      activeExcelSheet.rows,
      detected,
      currentReport
    ).map((rep) => applyBrandingToReport(rep, persistedBranding));

    setBatchReports(rebuilt);
    setSelectedBatchIds(rebuilt.map((r) => r.id));
    const count = Object.values(detected).filter(Boolean).length;
    notify(`${count} karne alanı Excel başlıklarıyla otomatik olarak eşleştirildi ve tablo güncellendi.`);
  };

  // Save current column mapping rules to localStorage for future uploads
  const handleSaveColumnMappingRules = () => {
    saveStoredLabColumnMapping(columnMapping);
    const count = Object.values(columnMapping).filter(Boolean).length;
    notify(
      `${count} sütun eşleştirme kuralı tarayıcı hafızasına kaydedildi. Aynı formattaki sonraki Excel yüklemelerinde otomatik uygulanacaktır.`
    );
  };

  // Reset all optional mappings (keeping only Sporcu_Adi if matched so the table doesn't go blank unless desired)
  const handleResetColumnMapping = () => {
    if (!activeExcelSheet) return;
    const minimal: Record<string, string> = {};
    if (columnMapping.Sporcu_Adi) {
      minimal.Sporcu_Adi = columnMapping.Sporcu_Adi;
    }
    setColumnMapping(minimal);
    const persistedBranding = getStoredLabSchoolBranding();
    const rebuilt = buildBatchReportsFromMappedRows(
      activeExcelSheet.rows,
      minimal,
      currentReport
    ).map((rep) => applyBrandingToReport(rep, persistedBranding));
    setBatchReports(rebuilt);
    setSelectedBatchIds(rebuilt.map((r) => r.id));
    notify('Sütun eşleştirmeleri sıfırlandı. İstediğiniz karne alanlarını Excel başlıklarıyla yeniden eşleştirebilirsiniz.');
  };

  // Filtered mappable fields for the Column Mapping UI
  const visibleMappableFields = React.useMemo(() => {
    const essentialKeys = new Set([
      'Sporcu_Adi',
      'Sporcu_Kodu',
      'Brans',
      'Cinsiyet',
      'Yas',
      'Olcum_3_Tarihi',
      'Boy_3',
      'Agirlik_3',
      'Yag_Yuzdesi_3',
      'Surat_3',
      'Cabukluk_3',
      'Dikey_Sicrama_3',
      'Durarak_Uzun_Atlama_3',
      'Esneklik_3',
      'VO2max_3',
      'Tahmini_18_Yas_Boyu',
      'Genel_Performans_Puani',
      'Uzman_Gorusu',
    ]);
    const q = mappingSearchQuery.trim().toLowerCase();

    return LAB_BATCH_MAPPABLE_FIELDS.filter((field) => {
      if (mappingCategoryFilter === 'essential' && !essentialKeys.has(field.key)) {
        return false;
      }
      if (
        mappingCategoryFilter !== 'all' &&
        mappingCategoryFilter !== 'essential' &&
        field.category !== mappingCategoryFilter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        field.label.toLowerCase().includes(q) ||
        field.key.toLowerCase().includes(q) ||
        field.description.toLowerCase().includes(q) ||
        (columnMapping[field.key] || '').toLowerCase().includes(q)
      );
    });
  }, [mappingCategoryFilter, mappingSearchQuery, columnMapping]);

  const mappedFieldsCount = React.useMemo(
    () => LAB_BATCH_MAPPABLE_FIELDS.filter((f) => Boolean(columnMapping[f.key])).length,
    [columnMapping]
  );

  const filteredBatchReports = React.useMemo(() => {
    const q = batchSearchQuery.trim().toLowerCase();
    if (!q) return batchReports;
    return batchReports.filter(
      (rep) =>
        rep.athleteName.toLowerCase().includes(q) ||
        rep.sportBranch.toLowerCase().includes(q) ||
        rep.athleteCode.toLowerCase().includes(q) ||
        rep.gender.toLowerCase().includes(q)
    );
  }, [batchReports, batchSearchQuery]);

  const selectedBatchReports = React.useMemo(
    () => batchReports.filter((rep) => selectedBatchIds.includes(rep.id)),
    [batchReports, selectedBatchIds]
  );

  const handleToggleBatchSelectAll = () => {
    if (selectedBatchIds.length === batchReports.length) {
      setSelectedBatchIds([]);
    } else {
      setSelectedBatchIds(batchReports.map((r) => r.id));
    }
  };

  const handleToggleBatchRow = (id: string) => {
    setSelectedBatchIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRemoveFromBatch = (id: string) => {
    setBatchReports((prev) => prev.filter((r) => r.id !== id));
    setSelectedBatchIds((prev) => prev.filter((item) => item !== id));
  };

  // Generate & Save All Selected Batch Report Cards (to Active List + optionally to Karne Arşivi)
  const handleCreateAndArchiveSelectedBatch = () => {
    if (selectedBatchReports.length === 0) {
      notify('Lütfen toplu karne oluşturmak için tablodan en az 1 sporcu seçin.');
      return;
    }

    const persistedBranding = getStoredLabSchoolBranding();
    setSchoolBranding(persistedBranding);

    const brandedBatch = selectedBatchReports.map((rep) => {
      const branded = applyBrandingToReport(rep, persistedBranding);
      if (!branded.aiRecommendations) {
        branded.aiRecommendations = analyzeLabPerformanceMetrics(branded);
      }
      return branded;
    });

    // Merge into main reports list without duplicates
    const existingWithoutBatch = reports.filter(
      (r) => !brandedBatch.some((b) => b.id === r.id || b.athleteName === r.athleteName)
    );
    const nextReports = applyBrandingToReports(
      [...brandedBatch, ...existingWithoutBatch],
      persistedBranding
    );
    setReports(nextReports);
    saveStoredLabReports(nextReports);
    setSelectedReportId(brandedBatch[0].id);

    if (autoArchiveOnBatchCreate) {
      const nextArchives = archiveBatchLabReports(
        brandedBatch,
        batchGroupTitle,
        batchGroupNote
      );
      setArchivedReports(nextArchives);
      notify(
        `${brandedBatch.length} sporcunun 7'şer sayfalık karnesi toplu olarak oluşturuldu ve "${batchGroupTitle}" başlığıyla Karne Arşivi'ne kaydedildi.`
      );
    } else {
      notify(
        `${brandedBatch.length} sporcunun 7'şer sayfalık karnesi "${persistedBranding.schoolName}" başlığıyla toplu olarak oluşturuldu.`
      );
    }
  };

  // Open a specific athlete from the Batch Table in 7-page Studio view, PDF Preview, or Download PDF
  const handleOpenBatchReport = (
    rep: SportsFlyLabReport,
    mode: 'view' | 'pdf-preview' | 'download-pdf' = 'view'
  ) => {
    const branded = applyBrandingToReport(rep, schoolBranding);
    const exists = reports.some((r) => r.id === branded.id);
    const nextReports = exists
      ? reports.map((r) => (r.id === branded.id ? branded : r))
      : [branded, ...reports];

    setReports(nextReports);
    saveStoredLabReports(nextReports);
    setSelectedReportId(branded.id);
    setActiveLabTab('studio');
    setViewMode('all');

    if (mode === 'pdf-preview') {
      setIsPdfPreviewMode(true);
      notify(`"${branded.athleteName}" karnesi A4 PDF önizleme modunda açıldı.`);
    } else if (mode === 'download-pdf') {
      setIsPdfPreviewMode(false);
      notify(`"${branded.athleteName}" karnesi yüklendi, PDF indiriliyor...`);
      setTimeout(() => {
        void handleDownloadPDF();
      }, 280);
    } else {
      setIsPdfPreviewMode(false);
      notify(`"${branded.athleteName}" 7 sayfalık karne görünümünde açıldı.`);
    }
  };

  // Export all selected batch athletes into a Single Combined A4 PDF OR Separate Individual A4 PDFs
  const handleExportBatchPDF = async (exportMode: 'combined' | 'separate') => {
    if (isGeneratingBatchPDF || isGeneratingPDF) return;
    if (selectedBatchReports.length === 0) {
      notify('Lütfen toplu PDF indirmek için tablodan en az 1 sporcu seçin.');
      return;
    }

    setIsGeneratingBatchPDF(true);
    const prevSelectedId = selectedReportId;
    const prevViewMode = viewMode;
    const prevZoom = pdfZoom;

    const persistedBranding = getStoredLabSchoolBranding();
    const brandedBatch = selectedBatchReports.map((rep) =>
      applyBrandingToReport(rep, persistedBranding)
    );

    // Ensure all selected batch athletes are in `reports` so `currentReport` resolves each one as we loop
    const existingWithoutBatch = reports.filter(
      (r) => !brandedBatch.some((b) => b.id === r.id)
    );
    const mergedReports = [...brandedBatch, ...existingWithoutBatch];
    setReports(mergedReports);
    saveStoredLabReports(mergedReports);
    setViewMode('all');
    setPdfZoom(100);

    const pageIds = showBodyMapInfographic
      ? [
          'sportsfly-lab-page-bodymap',
          'sportsfly-lab-page-1',
          'sportsfly-lab-page-2',
          'sportsfly-lab-page-3',
          'sportsfly-lab-page-4',
          'sportsfly-lab-page-5',
          'sportsfly-lab-page-6',
          'sportsfly-lab-page-7',
        ]
      : [
          'sportsfly-lab-page-1',
          'sportsfly-lab-page-2',
          'sportsfly-lab-page-3',
          'sportsfly-lab-page-4',
          'sportsfly-lab-page-5',
          'sportsfly-lab-page-6',
          'sportsfly-lab-page-7',
        ];

    try {
      const combinedBuilder = exportMode === 'combined' ? new BatchA4PdfBuilder() : null;

      for (let i = 0; i < brandedBatch.length; i++) {
        const athlete = brandedBatch[i];
        setSelectedReportId(athlete.id);
        setBatchPdfStatusText(
          `Sporcu ${i + 1}/${brandedBatch.length}: ${athlete.athleteName} karnesi hazırlanıyor...`
        );

        // Allow React state & D3 SVG charts on Pages 1-7 to settle
        await new Promise((r) => setTimeout(r, 380));

        if (exportMode === 'combined' && combinedBuilder) {
          await combinedBuilder.appendReportPages(pageIds, (pageIdx, totalPages) => {
            setBatchPdfStatusText(
              `Birleşik PDF Oluşturuluyor — Sporcu ${i + 1}/${brandedBatch.length} (${athlete.athleteName}) · Sayfa ${pageIdx}/${totalPages}`
            );
          });
        } else {
          const safeName = athlete.athleteName.replace(/\s+/g, '_');
          await exportReportPagesToA4Pdf({
            pageIds,
            fileName: `SportsFly_Lab_Tum_Karne_${safeName}.pdf`,
            onPageProgress: (pageIdx, totalPages) => {
              setBatchPdfStatusText(
                `Ayrı PDF İndiriliyor — Sporcu ${i + 1}/${brandedBatch.length} (${athlete.athleteName}) · Sayfa ${pageIdx}/${totalPages}`
              );
            },
          });
        }
      }

      if (exportMode === 'combined' && combinedBuilder) {
        const safeGroup = (batchGroupTitle || 'Toplu_Sporcu_Karneleri')
          .replace(/\s+/g, '_')
          .replace(/[^a-zA-Z0-9_ğüşıöçĞÜŞİÖÇ-]/g, '');
        combinedBuilder.save(
          `SportsFly_Lab_Toplu_Karne_${brandedBatch.length}_Sporcu_${safeGroup}.pdf`
        );
        notify(
          `${brandedBatch.length} sporcunun karnesi (${brandedBatch.length * 7} sayfa) tek bir birleşik A4 PDF dosyası olarak indirildi.`
        );
      } else {
        notify(
          `${brandedBatch.length} sporcunun 7'şer sayfalık karneleri ayrı ayrı A4 PDF olarak indirildi.`
        );
      }
    } catch (err) {
      console.error('Toplu PDF oluşturma hatası:', err);
      notify('Toplu PDF oluşturulurken bir hata meydana geldi.');
    } finally {
      setIsGeneratingBatchPDF(false);
      setBatchPdfStatusText(null);
      setSelectedReportId(prevSelectedId);
      setViewMode(prevViewMode);
      setPdfZoom(prevZoom);
    }
  };

  // Run Server-Side Gemini AI Analysis on the Athlete's Excel Metrics
  const handleRunAiAnalysis = async (
    targetReport: SportsFlyLabReport = currentReport,
    baseList: SportsFlyLabReport[] = reports
  ) => {
    setIsAnalyzingAI(true);
    setAiError(null);
    try {
      const geminiResult = await fetchGeminiLabRecommendations(targetReport);
      const nextList = baseList.map((r) =>
        r.id === targetReport.id ? { ...r, aiRecommendations: geminiResult } : r
      );
      setReports(nextList);
      saveStoredLabReports(nextList);
      notify(`"${targetReport.athleteName}" için yapay zeka performans önerileri güncellendi.`);
    } catch (err: any) {
      console.error('AI Performans Analizi Hatası:', err);
      const fallback = analyzeLabPerformanceMetrics(targetReport);
      const nextList = baseList.map((r) =>
        r.id === targetReport.id ? { ...r, aiRecommendations: fallback } : r
      );
      setReports(nextList);
      saveStoredLabReports(nextList);
      setAiError(err?.message || null);
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  // Apply AI Summary & Top Recommendations directly into Page 5 Expert Comment
  const handleApplyAiToExpertComment = () => {
    const topDrills = activeAiAnalysis.improvementAreas
      .slice(0, 2)
      .map((i) => `${i.metricName} (${i.currentValue} → Hedef ${i.targetValue}): ${i.drillRecommendation}`)
      .join(' | ');
    const enrichedComment = `${activeAiAnalysis.overallSummary} Öncelikli Gelişim Reçetesi: ${topDrills}`;
    handleUpdateCurrentReport({
      ...currentReport,
      expertComment: enrichedComment,
      aiRecommendations: activeAiAnalysis,
    });
    notify('Yapay zeka performans önerileri 5. sayfadaki Uzman Görüşü alanına aktarıldı.');
  };

  // Handle PDF Download of the complete 7-page report card ('Tüm Karneyi İndir')
  const handleDownloadPDF = async () => {
    if (isGeneratingPDF) return;
    setIsGeneratingPDF(true);
    setPdfProgressPage(1);

    const previousMode = viewMode;
    const previousZoom = pdfZoom;

    if (viewMode !== 'all' || pdfZoom !== 100) {
      setViewMode('all');
      setPdfZoom(100);
      await new Promise((r) => setTimeout(r, 300));
    } else {
      await new Promise((r) => setTimeout(r, 100));
    }

    try {
      const safeName = currentReport.athleteName.replace(/\s+/g, '_');
      const pageIds = showBodyMapInfographic
        ? [
            'sportsfly-lab-page-bodymap',
            'sportsfly-lab-page-1',
            'sportsfly-lab-page-2',
            'sportsfly-lab-page-3',
            'sportsfly-lab-page-4',
            'sportsfly-lab-page-5',
            'sportsfly-lab-page-6',
            'sportsfly-lab-page-7',
          ]
        : [
            'sportsfly-lab-page-1',
            'sportsfly-lab-page-2',
            'sportsfly-lab-page-3',
            'sportsfly-lab-page-4',
            'sportsfly-lab-page-5',
            'sportsfly-lab-page-6',
            'sportsfly-lab-page-7',
          ];

      await exportReportPagesToA4Pdf({
        pageIds,
        fileName: `SportsFly_Lab_Tum_Karne_${safeName}.pdf`,
        onPageProgress: (pageIdx) => setPdfProgressPage(pageIdx),
      });

      notify(
        `${currentReport.athleteName} için ${pageIds.length} sayfalık tüm sporcu karnesi temiz A4 PDF olarak indirildi.`
      );
    } catch (err) {
      console.error('PDF oluşturma hatası:', err);
      notify('PDF oluşturulurken bir hata meydana geldi.');
    } finally {
      setIsGeneratingPDF(false);
      setPdfProgressPage(null);
      setViewMode(previousMode);
      setPdfZoom(previousZoom);
    }
  };

  // Trigger clean A4 Print / Browser PDF Output using @media print styles
  const handlePrintA4 = () => {
    setViewMode('all');
    setPdfZoom(100);
    setTimeout(() => {
      window.print();
    }, 180);
  };

  // Open Web A4 PDF Preview Mode
  const handleTogglePdfPreview = () => {
    const nextState = !isPdfPreviewMode;
    setIsPdfPreviewMode(nextState);
    if (nextState) {
      setViewMode('all');
      notify('Karne A4 PDF görüntüleme ve yazdırma moduna alındı.');
    }
  };

  // Helper to compute position percentage (0..100%) on the reference scale bar
  const computeScalePos = (val: number, row: LabParameterRow): number => {
    const min = row.refLow * 0.75;
    const max = row.refHigh * 1.15;
    if (max === min) return 50;
    let pct = ((val - min) / (max - min)) * 100;
    if (row.lowerIsBetter) {
      pct = 100 - pct;
    }
    return Math.max(4, Math.min(96, pct));
  };

  // Status text color helper (no garish pills, clean clinical presentation)
  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'mükemmel' || s === 'iyi') return 'text-emerald-700 font-bold';
    if (s === 'normal' || s === 'uzun') return 'text-blue-700 font-semibold';
    if (s === 'yüksek') return 'text-amber-700 font-bold';
    return 'text-rose-700 font-bold';
  };

  // Update current report in state & storage
  const handleUpdateCurrentReport = (updated: SportsFlyLabReport) => {
    const nextList = reports.map((r) => (r.id === updated.id ? updated : r));
    setReports(nextList);
    saveStoredLabReports(nextList);
  };

  // Helper to extract up to 2 monogram initials for default Sport School crest
  const getSchoolInitials = (name: string) => {
    const words = name
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);
    if (words.length === 0) return 'SK';
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  };

  const isDarkHeaderTpl =
    karneTemplate !== 'modern-minimal' || clubColorPalette !== 'template-default';
  const topBarColors = [
    effectivePrimaryHex,
    effectiveSecondaryHex,
    clubColorPalette === 'template-default'
      ? karneTemplate === 'corporate-technical'
        ? '#d97706'
        : karneTemplate === 'athletic-data'
          ? '#059669'
          : '#e11d48'
      : activePaletteObj.accentHex,
  ];

  const totalReportPages = showBodyMapInfographic ? 8 : 7;
  const pageOffset = showBodyMapInfographic ? 1 : 0;

  // Render Transparent SportsFly Lab Background Watermark on every A4 Page
  const renderPageWatermark = () => (
    <div
      className="absolute inset-0 pointer-events-none select-none flex flex-col items-center justify-center overflow-hidden z-20"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center justify-center opacity-[0.065] -rotate-12">
        <div
          className="w-[400px] h-[400px] sm:w-[460px] sm:h-[460px] rounded-full border-[6px] border-dashed flex flex-col items-center justify-center p-10"
          style={{ borderColor: effectivePrimaryHex }}
        >
          <SportsFlyVectorMark className="w-[260px] h-[260px] sm:w-[300px] sm:h-[300px]" />
          <div className="mt-2 text-center">
            <div
              className="text-3xl font-black tracking-tight uppercase"
              style={{ color: effectivePrimaryHex }}
            >
              SportsFly <span style={{ color: effectiveSecondaryHex }}>LAB</span>
            </div>
            <div className="text-[11px] font-mono font-bold tracking-[0.28em] text-slate-800 uppercase mt-0.5">
              ATHLETIC PERFORMANCE LAB
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Page Header (Consistent across all 7 pages — adapts to selected Karne Template & Club Color Palette)
  const renderPageHeader = (pageNo: number, sectionTitle: string, subtitle: string) => (
    <>
      {renderPageWatermark()}
      <div className="mb-3.5 a4-avoid-break relative z-10">
        {/* Corporate Technical Top Protocol Strip (Only in 'corporate-technical' template) */}
        {karneTemplate === 'corporate-technical' && (
          <div
            className="flex flex-wrap items-center justify-between gap-2 px-3 py-1 mb-1.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-widest border"
            style={{
              backgroundColor: '#f8fafc',
              borderColor: effectivePrimaryHex,
              color: effectivePrimaryHex,
            }}
          >
            <span>
              DOKÜMAN NO: SFL-2026-{currentReport.athleteCode} · REV.03
            </span>
            <span>ISO / ISAK ANTROPOMETRİK &amp; BİYOMEKANİK LABORATUVAR STANDARDI</span>
            <span>SAYFA FORMU: A4-0{pageNo + pageOffset}/0{totalReportPages}</span>
          </div>
        )}

        {/* Signature Top Accent Line (Pure SVG for 100% Browser Print & PDF fidelity) */}
        <svg
          viewBox="0 0 600 6"
          preserveAspectRatio="none"
          className="w-full h-1.5 rounded-full overflow-hidden block mb-2"
          aria-hidden="true"
        >
          <rect x="0" y="0" width="348" height="6" fill={topBarColors[0]} />
          <rect x="348" y="0" width="144" height="6" fill={topBarColors[1]} />
          <rect x="492" y="0" width="108" height="6" fill={topBarColors[2]} />
        </svg>

        {/* TOP INSTITUTIONAL BAR: Spor Okulu Logosu & Spor Okulu Adı (Template & Club Palette Styled) */}
        <div
          className={`flex flex-col sm:flex-row print:flex-row sm:items-center print:items-center justify-between gap-3 ${
            isDarkHeaderTpl
              ? 'p-3.5 rounded-xl mb-3 text-white shadow-2xs'
              : 'p-3 rounded-2xl border border-slate-200/90 bg-slate-50/90 mb-3 text-slate-900'
          }`}
          style={
            isDarkHeaderTpl
              ? {
                  backgroundColor: effectivePrimaryHex,
                  borderBottom: `4px solid ${effectiveSecondaryHex}`,
                }
              : {
                  borderLeft: `5px solid ${effectiveSecondaryHex}`,
                }
          }
        >
          {/* Left: Sport School Logo & Name */}
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-xl border bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs"
              style={{ borderColor: isDarkHeaderTpl ? effectiveSecondaryHex : '#e2e8f0' }}
            >
              {effectiveSchoolLogo ? (
                <img
                  src={effectiveSchoolLogo}
                  alt={effectiveClubName}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <svg viewBox="0 0 48 48" className="w-10 h-10 shrink-0" fill="none">
                  <path
                    d="M24 4L8 10V22.5C8 33.2 14.8 42.3 24 45C33.2 42.3 40 33.2 40 22.5V10L24 4Z"
                    fill={topBarColors[0]}
                    stroke={topBarColors[1]}
                    strokeWidth="2"
                  />
                  <path
                    d="M24 7.5L11.5 12.2V22.2C11.5 30.8 16.8 38.2 24 40.6C31.2 38.2 36.5 30.8 36.5 22.2V12.2L24 7.5Z"
                    stroke={topBarColors[1]}
                    strokeWidth="0.8"
                    strokeOpacity="0.5"
                  />
                  <text
                    x="24"
                    y="28"
                    textAnchor="middle"
                    className="text-[13px] font-black fill-white font-sans"
                    style={{ fontWeight: 800 }}
                  >
                    {getSchoolInitials(effectiveClubName)}
                  </text>
                </svg>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 text-[9.5px] font-mono font-bold tracking-widest uppercase">
                <span
                  style={{
                    color: isDarkHeaderTpl ? effectiveSecondaryHex : effectivePrimaryHex,
                  }}
                >
                  RESMİ SPORCU GELİŞİM &amp; PERFORMANS KARNESİ
                </span>
                <span className={isDarkHeaderTpl ? 'text-white/40' : 'text-slate-300'}>·</span>
                <span className={isDarkHeaderTpl ? 'text-white/85' : 'text-slate-500'}>
                  {effectiveBranchName}
                </span>
              </div>
              <div
                className={`text-base sm:text-lg font-black tracking-tight uppercase leading-snug ${
                  isDarkHeaderTpl ? 'text-white' : 'text-slate-900'
                }`}
              >
                {effectiveClubName}
              </div>
              <div
                className={`text-[11px] font-semibold flex flex-wrap items-center gap-2 ${
                  isDarkHeaderTpl ? 'text-white/80' : 'text-slate-500'
                }`}
              >
                <span>Branş: {currentReport.sportBranch}</span>
                <span>·</span>
                <span>Grup: {currentReport.groupInfo.ageRange}</span>
                <span>·</span>
                <span
                  className="font-mono text-[10px] font-bold"
                  style={{
                    color: isDarkHeaderTpl ? effectiveSecondaryHex : effectivePrimaryHex,
                  }}
                >
                  {activeTemplate.name}
                  {clubColorPalette !== 'template-default'
                    ? ` · ${activePaletteObj.shortName}`
                    : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Minimal SportsFly Lab Co-Branding Badge & Page Indicator */}
          <div
            className={`flex items-center justify-between sm:justify-end print:justify-end gap-3 px-3 py-2 rounded-xl border shrink-0 ${
              isDarkHeaderTpl
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-white border-slate-200/90 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <SportsFlyVectorMark className="w-7 h-7" />
              <div>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-xs font-black tracking-tight ${
                      isDarkHeaderTpl ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    SportsFly
                  </span>
                  <span
                    className="text-[10px] font-black tracking-widest uppercase"
                    style={{
                      color: isDarkHeaderTpl ? effectiveSecondaryHex : '#0284c7',
                    }}
                  >
                    LAB
                  </span>
                </div>
                <div
                  className={`text-[8.5px] font-mono font-semibold tracking-wider uppercase ${
                    isDarkHeaderTpl ? 'text-white/70' : 'text-slate-400'
                  }`}
                >
                  ATHLETIC PERFORMANCE LAB
                </div>
              </div>
            </div>
            <div className={`h-7 w-px ${isDarkHeaderTpl ? 'bg-white/20' : 'bg-slate-200'}`} />
            <div className="text-right font-mono">
              <div
                className={`text-[9px] font-bold uppercase ${
                  isDarkHeaderTpl ? 'text-white/70' : 'text-slate-400'
                }`}
              >
                KARNE SAYFA
              </div>
              <div
                className={`text-xs font-black ${
                  isDarkHeaderTpl ? 'text-white' : 'text-slate-900'
                }`}
              >
                0{pageNo + pageOffset} / 0{totalReportPages}
              </div>
            </div>
          </div>
        </div>

        {/* SECOND ROW: Section Title & Athlete Biometric Strip */}
        <div
          className="pt-2 pb-2.5 border-b-2 flex flex-col lg:flex-row print:flex-row lg:items-end print:items-end justify-between gap-2.5"
          style={{ borderBottomColor: effectivePrimaryHex }}
        >
          <div>
            <h2
              className="text-base sm:text-lg font-extrabold tracking-tight"
              style={{ color: effectivePrimaryHex }}
            >
              {sectionTitle}
            </h2>
            <p className="text-[11px] text-slate-500">{subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80">
            <div>
              <span className="text-slate-400">Sporcu: </span>
              <span className="font-extrabold text-slate-900">{currentReport.athleteName}</span>
            </div>
            <span className="text-slate-300">·</span>
            <div>
              <span className="text-slate-400">Yaş: </span>
              <span className="font-mono font-bold text-slate-800">
                {currentReport.ageYears} ({currentReport.ageMonths} ay)
              </span>
            </div>
            <span className="text-slate-300">·</span>
            <div>
              <span className="text-slate-400">Ölçümler: </span>
              <span className="font-mono text-[11px] text-slate-700">
                I: {currentReport.date1} · II: {currentReport.date2} · III: {currentReport.date3}
              </span>
            </div>
            {karneTemplate === 'athletic-data' && (
              <>
                <span className="text-slate-300">·</span>
                <span
                  className="font-mono text-[10px] font-black px-2 py-0.5 rounded text-white"
                  style={{ backgroundColor: effectivePrimaryHex }}
                >
                  SKOR: %{currentReport.scoreHistory.p3Score}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );

  // Render Page Footer (Consistent across all 7 pages — Template & Club Color styled at the bottom of every A4 page)
  const renderPageFooter = (pageNo: number) => (
    <div
      className={`mt-4 pt-3 a4-avoid-break relative z-10 ${activeTemplate.footerBorderClass}`}
      style={{ borderTopColor: effectivePrimaryHex }}
    >
      <div className="flex flex-col sm:flex-row print:flex-row sm:items-center print:items-center justify-between gap-2.5 bg-slate-50/90 px-3.5 py-2.5 rounded-xl border border-slate-200">
        {/* Left: SportsFly Logo + SportsFly Lab Brand Identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/90 flex items-center justify-center shrink-0 shadow-2xs">
            <SportsFlyVectorMark className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black tracking-tight text-slate-900">
                SportsFly <span style={{ color: effectivePrimaryHex }}>LAB</span>
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-[9.5px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                ATLETİK PERFORMANS &amp; BİYOMEKANİK ANALİZ SİSTEMİ
              </span>
            </div>
            <div className="text-[9.5px] text-slate-400 leading-tight">
              Spor okulları için bilimsel performans ölçümü, somatotip, PHV büyüme ve yapay zeka destekli karne altyapısı
            </div>
          </div>
        </div>

        {/* Right: School Verification & Page Number */}
        <div className="flex items-center justify-between sm:justify-end print:justify-end gap-3 text-[10px] shrink-0">
          <div className="text-right hidden sm:block print:block">
            <div className="font-bold text-slate-700 uppercase tracking-tight">{effectiveClubName}</div>
            <div className="text-[9px] text-slate-400">
              {activeTemplate.name}
              {clubColorPalette !== 'template-default' ? ` · ${activePaletteObj.shortName}` : ''}
            </div>
          </div>
          <div className="h-6 w-px bg-slate-200 hidden sm:block print:block" />
          <div
            className="font-mono font-bold px-2.5 py-1 rounded-lg text-white"
            style={{
              backgroundColor: effectivePrimaryHex,
              borderBottom: `2px solid ${effectiveSecondaryHex}`,
            }}
          >
            {currentReport.athleteCode} · S.{pageNo + pageOffset}/{totalReportPages}
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // B: TAM SAYFA MERKEZLİ ANATOMİK VÜCUT HARİTASI & ANTROPOMETRİ İNFOGRAFİĞİ
  //    (FULL-PAGE CENTERED PRO ANATOMICAL BODY MAP INFOGRAPHIC)
  // ============================================================================
  const renderAnatomicalBodyMapPage = () => {
    if (!showBodyMapInfographic) return null;

    const getRow = (id: string) => currentReport.bodyComposition.find((r) => r.id === id);
    const getVal = (id: string, fallback: number) => getRow(id)?.m3 ?? fallback;
    const getM1 = (id: string, fallback: number) => getRow(id)?.m1 ?? fallback;
    const getM2 = (id: string, fallback: number) => getRow(id)?.m2 ?? fallback;
    const getPct = (id: string, fallback: number) => getRow(id)?.percentile ?? fallback;
    const getSd = (id: string, fallback: number) => getRow(id)?.sd ?? fallback;
    const getStatus = (id: string, fallback: string) => getRow(id)?.status ?? fallback;

    const heightVal = getVal('height', 149.5);
    const heightM1 = getM1('height', 145.0);
    const heightGain = +(heightVal - heightM1).toFixed(1);
    const weightVal = getVal('weight', 43.2);
    const weightM1 = getM1('weight', 41.4);
    const weightDelta = +(weightVal - weightM1).toFixed(1);
    const bmiVal = getVal('bmi', 18.2);
    const fatVal = getVal('bodyFat', 14.2);
    const fatM1 = getM1('bodyFat', 15.4);
    const fatDelta = +(fatVal - fatM1).toFixed(1);

    const bicepsSf = getVal('bicepsSkinfold', 5.4);
    const tricepsSf = getVal('tricepsSkinfold', 8.2);
    const subscapSf = getVal('subscapularSkinfold', 6.8);
    const suprailiacSf = getVal('suprailiacSkinfold', 6.1);
    const calfSf = getVal('calfSkinfold', 7.5);
    const sumSkinVal = +(bicepsSf + tricepsSf + subscapSf + suprailiacSf + calfSf).toFixed(1);

    const humerusBr = getVal('humerusBreadth', 6.1);
    const femurBr = getVal('femurBreadth', 8.7);
    const flexedBic = getVal('flexedBiceps', 24.8);
    const calfCirc = getVal('calfCircumference', 31.6);
    const whrVal = getVal('whr', 0.78);

    const fatMassKg = +((weightVal * fatVal) / 100).toFixed(1);
    const leanMassKg = +(weightVal - fatMassKg).toFixed(1);
    const leanMassPct = +(100 - fatVal).toFixed(1);
    const { m3: somatoM3 } = currentReport.somatotype;

    const leftCallouts = [
      {
        code: '01',
        title: 'BICEPS DERİ KIVRIMI (SKINFOLD)',
        subtitle: 'Ön Üst Kol · Subkutan Yağ Dokusu',
        m1: getM1('bicepsSkinfold', 6.2),
        m2: getM2('bicepsSkinfold', 5.8),
        m3: bicepsSf,
        unit: 'mm',
        pct: getPct('bicepsSkinfold', 74),
        sd: getSd('bicepsSkinfold', -0.4),
        status: getStatus('bicepsSkinfold', 'İyi'),
        accent: '#0284c7',
      },
      {
        code: '02',
        title: 'TRICEPS DERİ KIVRIMI (SKINFOLD)',
        subtitle: 'Arka Üst Kol · Subkutan Yağ Dokusu',
        m1: getM1('tricepsSkinfold', 9.4),
        m2: getM2('tricepsSkinfold', 8.8),
        m3: tricepsSf,
        unit: 'mm',
        pct: getPct('tricepsSkinfold', 76),
        sd: getSd('tricepsSkinfold', -0.5),
        status: getStatus('tricepsSkinfold', 'İyi'),
        accent: '#6366f1',
      },
      {
        code: '03',
        title: 'SUBSCAPULAR (KÜREK ALTI) SKINFOLD',
        subtitle: 'Üst Sırt Skapula Alt Açısı · Gövde Yağ',
        m1: getM1('subscapularSkinfold', 7.6),
        m2: getM2('subscapularSkinfold', 7.2),
        m3: subscapSf,
        unit: 'mm',
        pct: getPct('subscapularSkinfold', 78),
        sd: getSd('subscapularSkinfold', -0.3),
        status: getStatus('subscapularSkinfold', 'Optimal'),
        accent: '#059669',
      },
      {
        code: '04',
        title: 'SUPRAILIAC (İLİAK KRİSTA) SKINFOLD',
        subtitle: 'Yan Karın / Pelvik Kuşak Deri Kıvrımı',
        m1: getM1('suprailiacSkinfold', 7.1),
        m2: getM2('suprailiacSkinfold', 6.5),
        m3: suprailiacSf,
        unit: 'mm',
        pct: getPct('suprailiacSkinfold', 80),
        sd: getSd('suprailiacSkinfold', -0.4),
        status: getStatus('suprailiacSkinfold', 'Optimal'),
        accent: '#10b981',
      },
    ];

    const rightCallouts = [
      {
        code: '05',
        title: 'FLEKSİYONDA BICEPS KAS ÇEVRESİ',
        subtitle: 'Üst Ekstremite Maksimal Kas Hipertrofisi',
        m1: getM1('flexedBiceps', 23.2),
        m2: getM2('flexedBiceps', 24.0),
        m3: flexedBic,
        unit: 'cm',
        pct: getPct('flexedBiceps', 78),
        sd: getSd('flexedBiceps', 0.6),
        status: getStatus('flexedBiceps', 'İyi'),
        accent: effectivePrimaryHex,
      },
      {
        code: '06',
        title: 'HUMERUS & FEMUR KEMİK ÇAPLARI',
        subtitle: `Dirsek (${humerusBr} cm) & Diz (${femurBr} cm) Bikondiler Çatısı`,
        m1: getM1('femurBreadth', 8.4),
        m2: getM2('femurBreadth', 8.5),
        m3: femurBr,
        unit: 'cm',
        pct: getPct('femurBreadth', 82),
        sd: getSd('femurBreadth', 0.7),
        status: 'Sağlam İskelet',
        accent: '#d97706',
      },
      {
        code: '07',
        title: 'BEL / KALÇA ORANI (WHR) & YAĞ %',
        subtitle: `Merkez Gövde Dağılımı · Toplam Yağ %${fatVal}`,
        m1: getM1('whr', 0.8),
        m2: getM2('whr', 0.79),
        m3: whrVal,
        unit: 'oran',
        pct: getPct('bodyFat', 84),
        sd: getSd('bodyFat', -0.4),
        status: getStatus('bodyFat', 'Optimal'),
        accent: '#e11d48',
      },
      {
        code: '08',
        title: 'BALDIR ÇEVRESİ & CALF SKINFOLD',
        subtitle: `Alt Ekstremite Kas (${calfCirc} cm) · Deri (${calfSf} mm)`,
        m1: getM1('calfCircumference', 30.1),
        m2: getM2('calfCircumference', 30.8),
        m3: calfCirc,
        unit: 'cm',
        pct: getPct('calfCircumference', 81),
        sd: getSd('calfCircumference', 0.6),
        status: getStatus('calfCircumference', 'İyi'),
        accent: '#0f766e',
      },
    ];

    return (
      <div
        id="sportsfly-lab-page-bodymap"
        className={`a4-print-page relative overflow-hidden min-h-[1460px] flex flex-col justify-between rounded-xl p-5 sm:p-7 shadow-xs print:shadow-none ${activeTemplate.pageFrameClass}`}
      >
        {/* TOP: Institutional Header + 6-Metric Biometric Telemetry Ribbon */}
        <div>
          {renderPageHeader(
            1 - pageOffset,
            'Anatomik Vücut Haritası & Bölgesel Antropometri İnfografiği',
            'ISAK (Uluslararası Kinantropometri) Standartlarında Tam Sayfa Merkezli Deri Kıvrımı, Kas Çevresi, Kemik Çapı ve Segmental Kompozisyon Haritası'
          )}

          {/* Top 6-Card High-Contrast Clinical Biometric Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 print:grid-cols-6 gap-2 mb-3 relative z-10">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90">
              <div className="text-[9px] font-mono font-bold text-slate-500 uppercase">
                BOY UZUNLUĞU (STATURE)
              </div>
              <div className="text-base font-black font-mono text-slate-900 mt-0.5">
                {heightVal} <span className="text-[10px] font-normal text-slate-500">cm</span>
              </div>
              <div className="text-[9.5px] font-mono font-bold text-emerald-700">
                {heightGain >= 0 ? `+${heightGain}` : heightGain} cm (I→III) · %{getPct('height', 76)}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90">
              <div className="text-[9px] font-mono font-bold text-slate-500 uppercase">
                VÜCUT KÜTLESİ &amp; BKİ
              </div>
              <div className="text-base font-black font-mono text-slate-900 mt-0.5">
                {weightVal} <span className="text-[10px] font-normal text-slate-500">kg</span>
              </div>
              <div className="text-[9.5px] font-mono font-bold text-sky-700">
                BKİ: {bmiVal} kg/m² ({weightDelta >= 0 ? `+${weightDelta}` : weightDelta} kg)
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-200/90">
              <div className="text-[9px] font-mono font-bold text-rose-800 uppercase">
                VÜCUT YAĞ ORANI (%)
              </div>
              <div className="text-base font-black font-mono text-rose-700 mt-0.5">
                %{fatVal}{' '}
                <span className="text-[10px] font-normal text-rose-600">({fatMassKg} kg)</span>
              </div>
              <div className="text-[9.5px] font-mono font-bold text-emerald-700">
                Δ {fatDelta > 0 ? `+${fatDelta}` : fatDelta}% · {getStatus('bodyFat', 'Optimal')}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/90">
              <div className="text-[9px] font-mono font-bold text-emerald-800 uppercase">
                YAĞSIZ KAS KÜTLESİ (FFM)
              </div>
              <div className="text-base font-black font-mono text-emerald-800 mt-0.5">
                {leanMassKg} <span className="text-[10px] font-normal text-emerald-700">kg</span>
              </div>
              <div className="text-[9.5px] font-mono font-bold text-emerald-700">
                %{leanMassPct} Aktif Kas/İskelet
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90">
              <div className="text-[9px] font-mono font-bold text-slate-500 uppercase">
                5 BÖLGE SKINFOLD TOPLAMI
              </div>
              <div className="text-base font-black font-mono text-slate-900 mt-0.5">
                {sumSkinVal} <span className="text-[10px] font-normal text-slate-500">mm</span>
              </div>
              <div className="text-[9.5px] font-mono font-bold text-indigo-700">
                Harpenden Kaliper Standardı
              </div>
            </div>

            <div
              className="p-2.5 rounded-xl text-white border"
              style={{
                backgroundColor: effectivePrimaryHex,
                borderColor: effectiveSecondaryHex,
              }}
            >
              <div className="text-[9px] font-mono font-bold text-white/75 uppercase">
                SOMATOTİP (HEATH-CARTER)
              </div>
              <div
                className="text-base font-black font-mono mt-0.5"
                style={{ color: effectiveSecondaryHex }}
              >
                {somatoM3.endo} - {somatoM3.meso} - {somatoM3.ecto}
              </div>
              <div className="text-[9.5px] font-bold text-white/90 truncate">
                {somatoM3.category}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================
            CENTER OF THE PAGE: GIANT FULL-PAGE ANATOMICAL BODY MAP STAGE
            ======================================================================== */}
        <div className="flex-1 flex flex-col justify-center my-1 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 print:grid-cols-12 gap-3 items-stretch">
            {/* LEFT 3 COLS: 4 Detailed Upper/Trunk Skinfold Callout Cards */}
            <div className="lg:col-span-3 print:col-span-3 flex flex-col justify-between gap-2.5">
              {leftCallouts.map((item) => (
                <div
                  key={item.code}
                  className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between relative overflow-hidden"
                  style={{ borderLeft: `4px solid ${item.accent}` }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1.5">
                      <span
                        className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black text-white"
                        style={{ backgroundColor: item.accent }}
                      >
                        NOKTA {item.code}
                      </span>
                      <span className="text-[9.5px] font-mono font-bold text-emerald-700">
                        {item.status} · %{item.pct}
                      </span>
                    </div>
                    <div className="text-[11px] font-extrabold text-slate-900 mt-1.5 leading-snug">
                      {item.title}
                    </div>
                    <div className="text-[9.5px] text-slate-500 mt-0.5">{item.subtitle}</div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100">
                    <div className="flex items-baseline justify-between font-mono">
                      <div className="text-[9.5px] text-slate-500">
                        I: <strong>{item.m1}</strong> → II: <strong>{item.m2}</strong>
                      </div>
                      <div className="text-base font-black text-slate-900">
                        {item.m3}{' '}
                        <span className="text-[10px] font-normal text-slate-500">{item.unit}</span>
                      </div>
                    </div>
                    <svg viewBox="0 0 180 6" className="w-full h-1.5 rounded-full mt-1.5 overflow-hidden block">
                      <rect x="0" y="0" width="180" height="6" rx="3" fill="#f1f5f9" />
                      <rect
                        x="0"
                        y="0"
                        width={Math.max(24, Math.min(180, (item.pct / 100) * 180))}
                        height="6"
                        rx="3"
                        fill={item.accent}
                      />
                    </svg>
                    <div className="flex justify-between text-[8.5px] font-mono text-slate-400 mt-0.5">
                      <span>ISAK Kaliper Protokolü</span>
                      <span>Z-Skor: {item.sd > 0 ? `+${item.sd}` : item.sd} SD</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CENTER 6 COLS: HUGE HIGH-PRECISION ANATOMICAL BODY MAP SVG RIGHT IN THE MIDDLE OF THE PAGE */}
            <div
              className="lg:col-span-6 print:col-span-6 rounded-2xl border-2 bg-gradient-to-b from-slate-50/90 via-white to-slate-50/90 p-3 flex flex-col justify-between relative overflow-hidden shadow-xs"
              style={{ borderColor: effectivePrimaryHex }}
            >
              {/* Top Stage Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-200/90 pb-2 px-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: effectiveSecondaryHex }}
                  />
                  <span
                    className="text-[10.5px] font-mono font-black uppercase tracking-wider"
                    style={{ color: effectivePrimaryHex }}
                  >
                    ANATOMİK BİYOMEKANİK SİLÜET &amp; ÖLÇÜM HARİTASI (ANTERİOR / KORONAL EKSEN)
                  </span>
                </div>
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                  1:10 ÖLÇEK · ISAK L2
                </span>
              </div>

              {/* Giant Central Anatomical Vector Illustration (560 x 650) */}
              <div className="flex-1 flex items-center justify-center py-1">
                <svg
                  viewBox="0 0 560 650"
                  className="w-full max-w-[530px] h-auto block"
                  aria-label="Tam Sayfa Profesyonel Anatomik Vücut Haritası İnfografiği"
                >
                  <defs>
                    <linearGradient id="bodyBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f8fafc" />
                      <stop offset="50%" stopColor="#e2e8f0" />
                      <stop offset="100%" stopColor="#cbd5e1" />
                    </linearGradient>
                    <linearGradient id="muscleToneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={effectivePrimaryHex} stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0.10" />
                    </linearGradient>
                    <linearGradient id="coreZoneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.12" />
                    </linearGradient>
                    <radialGradient id="forcePlateGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#0284c7" stopOpacity="0.22" />
                      <stop offset="70%" stopColor={effectivePrimaryHex} stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* 1. Clinical Coordinate Grid & Regional Anatomical Zone Bands */}
                  {[90, 150, 210, 270, 330, 390, 450, 510, 570].map((gy) => (
                    <line
                      key={`gy-${gy}`}
                      x1="48"
                      y1={gy}
                      x2="536"
                      y2={gy}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                  ))}
                  {[120, 200, 280, 360, 440].map((gx) => (
                    <line
                      key={`gx-${gx}`}
                      x1={gx}
                      y1="40"
                      x2={gx}
                      y2="590"
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Regional Anatomical Zone Dividers */}
                  <rect x="52" y="146" width="480" height="136" rx="8" fill="#f8fafc" fillOpacity="0.55" />
                  <rect x="52" y="284" width="480" height="92" rx="8" fill="#fff1f2" fillOpacity="0.35" />
                  <rect x="52" y="378" width="480" height="202" rx="8" fill="#f0fdf4" fillOpacity="0.35" />

                  <text x="526" y="160" textAnchor="end" className="text-[7.5px] font-mono font-bold fill-slate-400">
                    BÖLGE I · ÜST EKSTREMİTE &amp; TORAKS
                  </text>
                  <text x="526" y="298" textAnchor="end" className="text-[7.5px] font-mono font-bold fill-rose-400">
                    BÖLGE II · MERKEZ GÖVDE (CORE &amp; PELVİS)
                  </text>
                  <text x="526" y="392" textAnchor="end" className="text-[7.5px] font-mono font-bold fill-emerald-600/70">
                    BÖLGE III · ALT EKSTREMİTE &amp; İTKİ ZİNCİRİ
                  </text>

                  {/* 2. Left Vertical Stadiometer Ruler (180 cm down to 0 cm) */}
                  <line x1="44" y1="60" x2="44" y2="582" stroke="#64748b" strokeWidth="1.5" />
                  {[
                    { cm: 180, y: 60 },
                    { cm: 160, y: 118 },
                    { cm: 140, y: 176 },
                    { cm: 120, y: 234 },
                    { cm: 100, y: 292 },
                    { cm: 80, y: 350 },
                    { cm: 60, y: 408 },
                    { cm: 40, y: 466 },
                    { cm: 20, y: 524 },
                    { cm: 0, y: 582 },
                  ].map((tick) => (
                    <g key={tick.cm}>
                      <line x1="37" y1={tick.y} x2="48" y2={tick.y} stroke="#475569" strokeWidth="1.2" />
                      <text
                        x="33"
                        y={tick.y + 3}
                        textAnchor="end"
                        className="text-[7.5px] font-mono font-bold fill-slate-500"
                      >
                        {tick.cm}
                      </text>
                    </g>
                  ))}

                  {/* Dynamic Stature Crown Laser Line at y=74 */}
                  <line
                    x1="40"
                    y1="74"
                    x2="365"
                    y2="74"
                    stroke="#0284c7"
                    strokeWidth="1.3"
                    strokeDasharray="4,2"
                  />
                  <rect x="54" y="63" width="118" height="18" rx="4" fill="#0284c7" />
                  <text x="113" y="75" textAnchor="middle" className="text-[8.5px] font-mono font-black fill-white">
                    BOY: {heightVal} cm
                  </text>

                  {/* 3. Postural Gravity Plumb Line (Center Symmetry Axis x=288) */}
                  <line
                    x1="288"
                    y1="36"
                    x2="288"
                    y2="606"
                    stroke="#94a3b8"
                    strokeWidth="1.2"
                    strokeDasharray="3,3"
                  />
                  <rect x="218" y="20" width="140" height="16" rx="4" fill="#0f172a" />
                  <text x="288" y="30.5" textAnchor="middle" className="text-[7.5px] font-mono font-bold fill-white">
                    SİMETRİ EKSENİ · 0.0°
                  </text>

                  {/* Concentric Biomechanical Target Halo behind Torso */}
                  <circle
                    cx="288"
                    cy="255"
                    r="112"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                  <circle
                    cx="288"
                    cy="255"
                    r="76"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />

                  {/* 4. 3D Biomechanical Force Plate Platform under Athlete's Feet */}
                  <ellipse cx="288" cy="586" rx="138" ry="26" fill="url(#forcePlateGrad)" stroke="#94a3b8" strokeWidth="1.2" />
                  <ellipse
                    cx="288"
                    cy="586"
                    rx="98"
                    ry="17"
                    fill="none"
                    stroke={effectivePrimaryHex}
                    strokeWidth="1.2"
                    strokeDasharray="4,3"
                  />
                  <ellipse cx="288" cy="586" rx="54" ry="9" fill="none" stroke="#0284c7" strokeWidth="1.2" />

                  {/* Force Plate Telemetry Pill */}
                  <rect x="138" y="616" width="300" height="24" rx="6" fill={effectivePrimaryHex} />
                  <text x="288" y="631.5" textAnchor="middle" className="text-[9px] font-mono font-black fill-white">
                    KÜTLE: {weightVal} kg · YAĞSIZ KAS: {leanMassKg} kg · YAĞ: %{fatVal}
                  </text>

                  {/* =================================================================
                      5. HIGH-PRECISION SCULPTED ANATOMICAL ATHLETE FIGURE (CENTER x=288)
                      ================================================================= */}
                  {/* Head, Cranium, Jawline & Ears */}
                  <path
                    d="M 288 74
                       C 305 74, 315 86, 314 103
                       C 313 118, 305 132, 288 135
                       C 271 132, 263 118, 262 103
                       C 261 86, 271 74, 288 74 Z"
                    fill="url(#bodyBaseGrad)"
                    stroke={effectivePrimaryHex}
                    strokeWidth="2"
                  />
                  {/* Ears */}
                  <path
                    d="M 262 98 C 258 98, 258 110, 263 112 M 314 98 C 318 98, 318 110, 313 112"
                    fill="none"
                    stroke={effectivePrimaryHex}
                    strokeWidth="1.6"
                  />
                  {/* Cranial Facial Biometric Crosshair */}
                  <line x1="271" y1="101" x2="305" y2="101" stroke="#64748b" strokeWidth="0.9" strokeDasharray="2,2" />

                  {/* Full Sculpted Body Silhouette (Neck, Trapezius, Deltoids, Arms, Hands, Torso, Pelvis, Quadriceps, Calves, Feet) */}
                  <path
                    d="M 274 132
                       L 272 145
                       C 258 151, 236 155, 218 164
                       C 202 172, 194 188, 186 210
                       C 178 232, 170 254, 162 276
                       C 154 298, 146 320, 141 338
                       L 132 356
                       C 130 364, 138 370, 145 365
                       L 155 344
                       C 164 326, 174 304, 184 282
                       C 192 264, 202 242, 214 218
                       L 230 202
                       C 232 228, 237 254, 243 280
                       C 246 296, 245 312, 238 332
                       C 231 354, 228 386, 233 422
                       C 237 450, 242 468, 244 486
                       C 240 508, 238 532, 245 556
                       L 247 572
                       L 233 584
                       C 230 588, 236 592, 254 591
                       L 265 588
                       L 265 570
                       C 269 548, 273 522, 269 492
                       C 271 472, 275 442, 281 398
                       L 288 382
                       L 295 398
                       C 301 442, 305 472, 307 492
                       C 303 522, 307 548, 311 570
                       L 311 588
                       L 322 591
                       C 340 592, 346 588, 343 584
                       L 329 572
                       L 331 556
                       C 338 532, 336 508, 332 486
                       C 334 468, 339 450, 343 422
                       C 348 386, 345 354, 338 332
                       C 331 312, 330 296, 333 280
                       C 339 254, 344 228, 346 202
                       L 362 218
                       C 374 242, 384 264, 392 282
                       C 402 304, 412 326, 421 344
                       L 431 365
                       C 438 370, 446 364, 444 356
                       L 435 338
                       C 430 320, 422 298, 414 276
                       C 406 254, 398 232, 390 210
                       C 382 188, 374 172, 358 164
                       C 340 155, 318 151, 304 145
                       L 302 132 Z"
                    fill="url(#bodyBaseGrad)"
                    stroke={effectivePrimaryHex}
                    strokeWidth="2.1"
                    strokeLinejoin="round"
                  />

                  {/* =================================================================
                      6. INTERNAL ANATOMICAL MUSCLE PLATES & SKELETAL CONTOURS
                      ================================================================= */}
                  {/* Clavicles (Collarbones) */}
                  <path
                    d="M 232 165 Q 260 174, 283 169 M 344 165 Q 316 174, 293 169"
                    fill="none"
                    stroke="#475569"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />

                  {/* Pectoralis Major Left & Right Muscle Plates */}
                  <path
                    d="M 234 174 C 232 204, 248 220, 284 217 L 284 174 Z"
                    fill="url(#muscleToneGrad)"
                    stroke="#64748b"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M 342 174 C 344 204, 328 220, 292 217 L 292 174 Z"
                    fill="url(#muscleToneGrad)"
                    stroke="#64748b"
                    strokeWidth="1.2"
                  />

                  {/* Deltoid & Biceps/Triceps Muscle Bellies (Left & Right Upper Arms) */}
                  <path
                    d="M 218 166 C 202 176, 195 196, 202 212 C 212 208, 224 196, 230 182 Z"
                    fill="url(#muscleToneGrad)"
                    stroke="#64748b"
                    strokeWidth="1"
                  />
                  <path
                    d="M 358 166 C 374 176, 381 196, 374 212 C 364 208, 352 196, 346 182 Z"
                    fill="url(#muscleToneGrad)"
                    stroke="#64748b"
                    strokeWidth="1"
                  />
                  {/* Biceps Brachii Bellies */}
                  <path
                    d="M 198 214 C 186 234, 180 252, 188 264 C 198 258, 208 240, 214 220 Z"
                    fill="url(#muscleToneGrad)"
                    stroke="#64748b"
                    strokeWidth="1.1"
                  />
                  <path
                    d="M 378 214 C 390 234, 396 252, 388 264 C 378 258, 368 240, 362 220 Z"
                    fill="url(#muscleToneGrad)"
                    stroke="#64748b"
                    strokeWidth="1.1"
                  />

                  {/* Abdominal Core (Rectus Abdominis 6-Pack + Suprailiac Core Zone) */}
                  <path
                    d="M 243 282 C 246 302, 242 322, 236 340 L 340 340 C 334 322, 330 302, 333 282 Z"
                    fill="url(#coreZoneGrad)"
                  />
                  <rect x="261" y="224" width="24" height="22" rx="5" fill="url(#muscleToneGrad)" stroke="#64748b" strokeWidth="1" />
                  <rect x="291" y="224" width="24" height="22" rx="5" fill="url(#muscleToneGrad)" stroke="#64748b" strokeWidth="1" />
                  <rect x="262" y="250" width="23" height="22" rx="5" fill="url(#muscleToneGrad)" stroke="#64748b" strokeWidth="1" />
                  <rect x="291" y="250" width="23" height="22" rx="5" fill="url(#muscleToneGrad)" stroke="#64748b" strokeWidth="1" />
                  <rect x="264" y="276" width="21" height="24" rx="5" fill="url(#muscleToneGrad)" stroke="#64748b" strokeWidth="1" />
                  <rect x="291" y="276" width="21" height="24" rx="5" fill="url(#muscleToneGrad)" stroke="#64748b" strokeWidth="1" />

                  {/* Pelvic Iliac Crest (Crista Iliaca / Inguinal V-Line) */}
                  <path
                    d="M 239 328 Q 262 362, 288 372 Q 314 362, 337 328"
                    fill="none"
                    stroke="#64748b"
                    strokeWidth="1.4"
                    strokeDasharray="3,2"
                  />

                  {/* Quadriceps Muscle Groups (Rectus Femoris, Vastus Lateralis & Medialis) */}
                  <path
                    d="M 236 368 C 232 406, 238 444, 247 466 C 258 456, 263 418, 261 372 Z"
                    fill="url(#muscleToneGrad)"
                    stroke="#64748b"
                    strokeWidth="1.1"
                  />
                  <path
                    d="M 264 380 C 263 418, 262 448, 268 466 C 276 454, 279 422, 278 386 Z"
                    fill="url(#muscleToneGrad)"
                    stroke="#64748b"
                    strokeWidth="1"
                  />
                  <path
                    d="M 340 368 C 344 406, 338 444, 329 466 C 318 456, 313 418, 315 372 Z"
                    fill="url(#muscleToneGrad)"
                    stroke="#64748b"
                    strokeWidth="1.1"
                  />
                  <path
                    d="M 312 380 C 313 418, 314 448, 308 466 C 300 454, 297 422, 298 386 Z"
                    fill="url(#muscleToneGrad)"
                    stroke="#64748b"
                    strokeWidth="1"
                  />

                  {/* Knee Patella Landmarks */}
                  <ellipse cx="257" cy="478" rx="9" ry="7" fill="#f8fafc" stroke="#475569" strokeWidth="1.2" />
                  <ellipse cx="319" cy="478" rx="9" ry="7" fill="#f8fafc" stroke="#475569" strokeWidth="1.2" />

                  {/* Gastrocnemius & Tibialis Calves */}
                  <path
                    d="M 244 496 C 239 518, 241 542, 249 560 C 258 548, 265 524, 264 496 Z"
                    fill="url(#muscleToneGrad)"
                    stroke="#64748b"
                    strokeWidth="1.1"
                  />
                  <path
                    d="M 332 496 C 337 518, 335 542, 327 560 C 318 548, 311 524, 312 496 Z"
                    fill="url(#muscleToneGrad)"
                    stroke="#64748b"
                    strokeWidth="1.1"
                  />

                  {/* =================================================================
                      7. DIRECT ON-BODY MEASUREMENT RINGS, BONE CALIPERS & HOTSPOTS
                      ================================================================= */}
                  {/* 05. Right Arm Flexed Biceps Circumference Tape Ring */}
                  <ellipse
                    cx="379"
                    cy="236"
                    rx="18"
                    ry="7"
                    transform="rotate(-24 379 236)"
                    fill="none"
                    stroke={effectivePrimaryHex}
                    strokeWidth="2.2"
                    strokeDasharray="3,2"
                  />

                  {/* 06. Humerus Elbow Breadth Caliper Bracket (Right Arm x=390, y=272) */}
                  <line x1="372" y1="274" x2="408" y2="258" stroke="#d97706" strokeWidth="2.2" />
                  <line x1="370" y1="269" x2="374" y2="279" stroke="#d97706" strokeWidth="2.2" />
                  <line x1="406" y1="253" x2="410" y2="263" stroke="#d97706" strokeWidth="2.2" />

                  {/* 06b. Femur Knee Breadth Caliper Bracket (Left Knee x=257, y=478) */}
                  <line x1="241" y1="478" x2="273" y2="478" stroke="#d97706" strokeWidth="2.2" />
                  <line x1="241" y1="472" x2="241" y2="484" stroke="#d97706" strokeWidth="2.2" />
                  <line x1="273" y1="472" x2="273" y2="484" stroke="#d97706" strokeWidth="2.2" />

                  {/* 07. Waist & Hip Ratio (WHR) 3D Elliptical Measurement Rings */}
                  <ellipse
                    cx="288"
                    cy="298"
                    rx="45"
                    ry="10"
                    fill="none"
                    stroke="#e11d48"
                    strokeWidth="2"
                    strokeDasharray="4,2"
                  />
                  <ellipse
                    cx="288"
                    cy="344"
                    rx="53"
                    ry="12"
                    fill="none"
                    stroke="#e11d48"
                    strokeWidth="1.6"
                    strokeDasharray="2,2"
                  />

                  {/* 08. Calf Circumference 3D Elliptical Ring (Right Leg x=321, y=522) */}
                  <ellipse
                    cx="321"
                    cy="522"
                    rx="16"
                    ry="6"
                    fill="none"
                    stroke="#0f766e"
                    strokeWidth="2.2"
                  />

                  {/* =================================================================
                      8. PRECISION LEADER LINES & NUMBERED HOTSPOT PINS (01 - 08)
                      ================================================================= */}
                  {/* LEFT LEADER LINES (01 - 04) */}
                  {/* 01 Biceps Skinfold */}
                  <polyline
                    points="196,226 154,142 122,142"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="1.5"
                  />
                  <rect x="48" y="129" width="76" height="24" rx="5" fill="#0284c7" />
                  <text x="86" y="140" textAnchor="middle" className="text-[7px] font-mono font-bold fill-white/85">
                    01 BICEPS SF
                  </text>
                  <text x="86" y="149" textAnchor="middle" className="text-[8.5px] font-mono font-black fill-white">
                    {bicepsSf} mm
                  </text>

                  {/* 02 Triceps Skinfold */}
                  <polyline
                    points="182,244 146,244 122,244"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="1.5"
                  />
                  <rect x="48" y="231" width="76" height="24" rx="5" fill="#6366f1" />
                  <text x="86" y="242" textAnchor="middle" className="text-[7px] font-mono font-bold fill-white/85">
                    02 TRICEPS SF
                  </text>
                  <text x="86" y="251" textAnchor="middle" className="text-[8.5px] font-mono font-black fill-white">
                    {tricepsSf} mm
                  </text>

                  {/* 03 Subscapular Skinfold */}
                  <polyline
                    points="248,206 168,348 122,348"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="1.5"
                  />
                  <rect x="48" y="335" width="76" height="24" rx="5" fill="#059669" />
                  <text x="86" y="346" textAnchor="middle" className="text-[7px] font-mono font-bold fill-white/85">
                    03 KÜREK ALTI
                  </text>
                  <text x="86" y="355" textAnchor="middle" className="text-[8.5px] font-mono font-black fill-white">
                    {subscapSf} mm
                  </text>

                  {/* 04 Suprailiac Skinfold */}
                  <polyline
                    points="244,324 176,448 122,448"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.5"
                  />
                  <rect x="48" y="435" width="76" height="24" rx="5" fill="#10b981" />
                  <text x="86" y="446" textAnchor="middle" className="text-[7px] font-mono font-bold fill-white/85">
                    04 SUPRAILIAC
                  </text>
                  <text x="86" y="455" textAnchor="middle" className="text-[8.5px] font-mono font-black fill-white">
                    {suprailiacSf} mm
                  </text>

                  {/* RIGHT LEADER LINES (05 - 08) */}
                  {/* 05 Flexed Biceps Circumference */}
                  <polyline
                    points="382,232 426,142 456,142"
                    fill="none"
                    stroke={effectivePrimaryHex}
                    strokeWidth="1.5"
                  />
                  <rect x="454" y="129" width="82" height="24" rx="5" fill={effectivePrimaryHex} />
                  <text x="495" y="140" textAnchor="middle" className="text-[7px] font-mono font-bold fill-white/85">
                    05 PAZU ÇEVRE
                  </text>
                  <text x="495" y="149" textAnchor="middle" className="text-[8.5px] font-mono font-black fill-white">
                    {flexedBic} cm
                  </text>

                  {/* 06 Humerus & Femur Breadth */}
                  <polyline
                    points="392,266 432,244 456,244"
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="1.5"
                  />
                  <polyline
                    points="273,478 416,252 454,248"
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="1"
                    strokeDasharray="3,2"
                  />
                  <rect x="454" y="231" width="82" height="24" rx="5" fill="#d97706" />
                  <text x="495" y="242" textAnchor="middle" className="text-[7px] font-mono font-bold fill-white/85">
                    06 KEMİK ÇAPI
                  </text>
                  <text x="495" y="251" textAnchor="middle" className="text-[8.5px] font-mono font-black fill-white">
                    {humerusBr} / {femurBr} cm
                  </text>

                  {/* 07 WHR & Body Fat % */}
                  <polyline
                    points="333,298 416,348 456,348"
                    fill="none"
                    stroke="#e11d48"
                    strokeWidth="1.5"
                  />
                  <rect x="454" y="335" width="82" height="24" rx="5" fill="#e11d48" />
                  <text x="495" y="346" textAnchor="middle" className="text-[7px] font-mono font-bold fill-white/85">
                    07 WHR &amp; YAĞ
                  </text>
                  <text x="495" y="355" textAnchor="middle" className="text-[8.5px] font-mono font-black fill-white">
                    {whrVal} · %{fatVal}
                  </text>

                  {/* 08 Calf Circumference & Skinfold */}
                  <polyline
                    points="329,522 418,448 456,448"
                    fill="none"
                    stroke="#0f766e"
                    strokeWidth="1.5"
                  />
                  <rect x="454" y="435" width="82" height="24" rx="5" fill="#0f766e" />
                  <text x="495" y="446" textAnchor="middle" className="text-[7px] font-mono font-bold fill-white/85">
                    08 BALDIR
                  </text>
                  <text x="495" y="455" textAnchor="middle" className="text-[8.5px] font-mono font-black fill-white">
                    {calfCirc}cm / {calfSf}mm
                  </text>

                  {/* Numbered Hotspot Target Reticles on the Body */}
                  {[
                    { cx: 196, cy: 226, code: '1', fill: '#0284c7' },
                    { cx: 182, cy: 244, code: '2', fill: '#6366f1' },
                    { cx: 248, cy: 206, code: '3', fill: '#059669' },
                    { cx: 244, cy: 324, code: '4', fill: '#10b981' },
                    { cx: 382, cy: 232, code: '5', fill: effectivePrimaryHex },
                    { cx: 392, cy: 266, code: '6', fill: '#d97706' },
                    { cx: 333, cy: 298, code: '7', fill: '#e11d48' },
                    { cx: 329, cy: 522, code: '8', fill: '#0f766e' },
                  ].map((pin) => (
                    <g key={pin.code}>
                      <circle cx={pin.cx} cy={pin.cy} r="9.5" fill={pin.fill} fillOpacity="0.22" />
                      <circle cx={pin.cx} cy={pin.cy} r="6.5" fill={pin.fill} stroke="#ffffff" strokeWidth="1.6" />
                      <text
                        x={pin.cx}
                        y={pin.cy + 2.5}
                        textAnchor="middle"
                        className="text-[7.5px] font-mono font-black fill-white"
                      >
                        {pin.code}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              {/* Bottom Stage Legend Bar inside Center Frame */}
              <div className="pt-2 border-t border-slate-200/90 flex flex-wrap items-center justify-between gap-2 text-[9.5px] font-mono text-slate-600 px-1">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block" />
                    <span>Skinfold Deri Kıvrımı (mm)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
                    <span>Kemik Çapı (cm)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-700 inline-block" />
                    <span>Kas Çevresi (cm)</span>
                  </span>
                </div>
                <span className="font-bold text-slate-800">
                  PHV: {currentReport.phvAge} Yaş · 18 Yaş Tahmini: {currentReport.predictedAdultHeight} cm
                </span>
              </div>
            </div>

            {/* RIGHT 3 COLS: 4 Detailed Girth, Bone Breadth & Core Callout Cards */}
            <div className="lg:col-span-3 print:col-span-3 flex flex-col justify-between gap-2.5">
              {rightCallouts.map((item) => (
                <div
                  key={item.code}
                  className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between relative overflow-hidden"
                  style={{ borderRight: `4px solid ${item.accent}` }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1.5">
                      <span
                        className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black text-white"
                        style={{ backgroundColor: item.accent }}
                      >
                        NOKTA {item.code}
                      </span>
                      <span className="text-[9.5px] font-mono font-bold text-emerald-700">
                        {item.status} · %{item.pct}
                      </span>
                    </div>
                    <div className="text-[11px] font-extrabold text-slate-900 mt-1.5 leading-snug">
                      {item.title}
                    </div>
                    <div className="text-[9.5px] text-slate-500 mt-0.5">{item.subtitle}</div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100">
                    <div className="flex items-baseline justify-between font-mono">
                      <div className="text-[9.5px] text-slate-500">
                        I: <strong>{item.m1}</strong> → II: <strong>{item.m2}</strong>
                      </div>
                      <div className="text-base font-black text-slate-900">
                        {item.m3}{' '}
                        <span className="text-[10px] font-normal text-slate-500">{item.unit}</span>
                      </div>
                    </div>
                    <svg viewBox="0 0 180 6" className="w-full h-1.5 rounded-full mt-1.5 overflow-hidden block">
                      <rect x="0" y="0" width="180" height="6" rx="3" fill="#f1f5f9" />
                      <rect
                        x="0"
                        y="0"
                        width={Math.max(24, Math.min(180, (item.pct / 100) * 180))}
                        height="6"
                        rx="3"
                        fill={item.accent}
                      />
                    </svg>
                    <div className="flex justify-between text-[8.5px] font-mono text-slate-400 mt-0.5">
                      <span>Bölgesel Normatif Skala</span>
                      <span>Z-Skor: {item.sd > 0 ? `+${item.sd}` : item.sd} SD</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM: Segmental Body Composition Synthesis (Upper / Core / Lower) + Footer */}
        <div
          className="mt-3 pt-3 border-t-2 space-y-2.5 relative z-10"
          style={{ borderTopColor: effectivePrimaryHex }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-sky-900 uppercase">
                  I. ÜST EKSTREMİTE &amp; TORAKS SENTEZİ
                </span>
                <span className="text-[10px] font-mono font-bold text-sky-700">
                  Pazu: {flexedBic} cm
                </span>
              </div>
              <p className="text-[10.5px] text-slate-600 mt-1 leading-snug">
                Biceps ({bicepsSf} mm) ve Triceps ({tricepsSf} mm) deri kıvrımı kalınlıkları ile Humerus bikondiler kemik çapı ({humerusBr} cm) üst gövde kas-iskelet verimliliğinin optimal düzeyde olduğunu göstermektedir.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-rose-900 uppercase">
                  II. MERKEZ GÖVDE (CORE) &amp; METABOLİK DENGE
                </span>
                <span className="text-[10px] font-mono font-bold text-rose-700">
                  WHR: {whrVal} · Yağ: %{fatVal}
                </span>
              </div>
              <p className="text-[10.5px] text-slate-600 mt-1 leading-snug">
                Subscapular ({subscapSf} mm) ve Suprailiac ({suprailiacSf} mm) merkez gövde deri kıvrımları ile Bel/Kalça oranı ({whrVal}), atletik gövde stabilitesi ve düşük viseral yağ dağılımını doğrulamaktadır.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-emerald-900 uppercase">
                  III. ALT EKSTREMİTE &amp; KİNETİK İTKİ ZİNCİRİ
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-700">
                  Baldır: {calfCirc} cm · Femur: {femurBr} cm
                </span>
              </div>
              <p className="text-[10.5px] text-slate-600 mt-1 leading-snug">
                Femur bikondiler çapı ({femurBr} cm), baldır kas çevresi ({calfCirc} cm) ve medial baldır skinfold ({calfSf} mm) değerleri; patlayıcı sıçrama ve sprint kuvvet aktarımını destekleyen güçlü alt ekstremite yapısını yansıtır.
              </p>
            </div>
          </div>

          {renderPageFooter(1 - pageOffset)}
        </div>
      </div>
    );
  };

  // ============================================================================
  // PAGE 1 (or 2 when Body Map Page is active): BEDEN KOMPOZİSYONU TABLOSU & PHV
  // ============================================================================
  const renderPage1 = () => {
    const heightRow = currentReport.bodyComposition.find((r) => r.id === 'height');
    const weightRow = currentReport.bodyComposition.find((r) => r.id === 'weight');
    const bmiRow = currentReport.bodyComposition.find((r) => r.id === 'bmi');
    const fatRow = currentReport.bodyComposition.find((r) => r.id === 'bodyFat');
    const sumSkinRow = currentReport.bodyComposition.find((r) => r.id === 'sumSkinfolds');
    const whrRow = currentReport.bodyComposition.find((r) => r.id === 'whr');

    const heightGain = heightRow ? +(heightRow.m3 - heightRow.m1).toFixed(1) : 4.5;
    const weightDelta = weightRow ? +(weightRow.m3 - weightRow.m1).toFixed(1) : 1.8;
    const fatDelta = fatRow ? +(fatRow.m3 - fatRow.m1).toFixed(1) : -1.2;

    const skinfoldRows = currentReport.bodyComposition.filter((r) =>
      ['bicepsSkinfold', 'tricepsSkinfold', 'subscapularSkinfold', 'suprailiacSkinfold', 'calfSkinfold'].includes(r.id)
    );

    return (
      <div
        id="sportsfly-lab-page-1"
        className={`a4-print-page relative overflow-hidden min-h-[1460px] flex flex-col justify-between rounded-xl p-5 sm:p-7 shadow-xs print:shadow-none ${activeTemplate.pageFrameClass}`}
      >
        <div>
          {renderPageHeader(
            1,
            '1. Beden Kompozisyonu Değerlendirmesi (Antropometrik Ölçüm Tablosu)',
            'Beden Sağlığı, Deri Kıvrım Kalınlıkları (Skinfold), Kemik Çapı, Kas Çevresi ve Z-Skor (SD) Referans Analizi'
          )}

          {/* Legend Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200/80 mb-3 text-[11px] text-slate-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
                <span>I. Ölçüm ({currentReport.date1})</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                <span>II. Ölçüm ({currentReport.date2})</span>
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-900">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
                <span>III. Ölçüm ({currentReport.date3} - Güncel)</span>
              </span>
            </div>
            <div className="text-slate-500 font-mono text-[10px]">
              Persentil &amp; Z-Skor (SD) Referansı
            </div>
          </div>

          {/* Main 12-Parameter Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr
                  className={`text-[10px] font-bold uppercase tracking-wider ${activeTemplate.tableHeadClass}`}
                  style={{ backgroundColor: effectivePrimaryHex, color: '#ffffff' }}
                >
                  <th className="py-2 px-2.5 rounded-tl-lg w-[28%]">Antropometrik Parametre</th>
                  <th className="py-2 px-2 text-center w-[7%]">I</th>
                  <th className="py-2 px-2 text-center w-[7%]">II</th>
                  <th
                    className="py-2 px-2 text-center w-[8%]"
                    style={{ backgroundColor: 'rgba(255,255,255,0.16)', color: effectiveSecondaryHex }}
                  >
                    III (Son)
                  </th>
                  <th className="py-2 px-2 text-center w-[7%]">Birim</th>
                  <th className="py-2 px-2 text-center w-[8%]">Yüzdelik</th>
                  <th className="py-2 px-2 text-center w-[9%]">Değerlendirme</th>
                  <th className="py-2 px-2.5 rounded-tr-lg w-[26%]">Sağlıklı Fiziksel Uygunluk Bölgesi (SD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 text-xs">
                {currentReport.bodyComposition.map((row) => {
                  const p1 = computeScalePos(row.m1, row);
                  const p2 = computeScalePos(row.m2, row);
                  const p3 = computeScalePos(row.m3, row);
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/70">
                      <td className="py-2 pr-3 pl-2">
                        <div className="font-bold text-slate-900 text-xs">{row.name}</div>
                        <div className="text-[10px] text-slate-500 leading-tight line-clamp-1">
                          {row.description}
                        </div>
                      </td>
                      <td className="py-2 px-2 text-center font-mono tabular-nums text-slate-600 bg-slate-50/60">
                        {row.m1}
                      </td>
                      <td className="py-2 px-2 text-center font-mono tabular-nums text-slate-700 bg-blue-50/30">
                        {row.m2}
                      </td>
                      <td
                        className={`py-2 px-2 text-center font-mono tabular-nums font-extrabold text-sm ${activeTemplate.accentTextClass} ${activeTemplate.accentBgClass}`}
                      >
                        {row.m3}
                      </td>
                      <td className="py-2 px-2 text-center font-mono text-[11px] text-slate-400">
                        {row.unit}
                      </td>
                      <td className="py-2 px-2 text-center font-mono tabular-nums font-bold text-slate-900">
                        %{row.percentile}
                      </td>
                      <td className={`py-2 px-2 text-center text-xs ${getStatusColor(row.status)}`}>
                        {row.status}
                      </td>
                      <td className="py-2 pl-3 pr-2">
                        <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                          <span>Alt: {row.refLow}</span>
                          <span className="text-emerald-700 font-semibold">İdeal: {row.refMid}</span>
                          <span>Üst: {row.refHigh}</span>
                          <span className="text-slate-600 font-bold">sd {row.sd > 0 ? `+${row.sd}` : row.sd}</span>
                        </div>
                        <svg
                          viewBox="0 0 200 12"
                          className="w-full h-3 block overflow-visible"
                          aria-label={`${row.name} referans skalası`}
                        >
                          <rect x="0" y="1" width="200" height="10" rx="5" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
                          <rect x="1" y="1.5" width="43" height="9" rx="4" fill="#1e293b" fillOpacity="0.88" />
                          <rect x="44" y="1.5" width="112" height="9" fill="#10b981" fillOpacity="0.28" />
                          <rect x="156" y="1.5" width="43" height="9" rx="4" fill="#1e293b" fillOpacity="0.88" />

                          <circle cx={p1 * 2} cy="6" r="3.8" fill="#94a3b8" stroke="#ffffff" strokeWidth="1.2" />
                          <circle cx={p2 * 2} cy="6" r="3.8" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.2" />
                          <circle cx={p3 * 2} cy="6" r="4.8" fill="#e11d48" stroke="#ffffff" strokeWidth="1.4" />
                        </svg>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 1.1 Bölgesel Deri Kıvrımı (Skinfold mm) 3 Dönemlik Değişim Karşılaştırması */}
          {skinfoldRows.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-slate-200 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-[11px] font-extrabold uppercase tracking-wider"
                  style={{ color: effectivePrimaryHex }}
                >
                  1.1 Bölgesel Deri Kıvrımı (Skinfold mm) Dönemsel Değişim Analizi (I → II → III)
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Düşük Değer = Daha Yüksek Yağsız Kas Tanımlaması
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 print:grid-cols-5 gap-2.5">
                {skinfoldRows.map((sf) => {
                  const delta = +(sf.m3 - sf.m1).toFixed(1);
                  return (
                    <div key={sf.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90">
                      <div className="text-[10px] font-extrabold text-slate-800 truncate">{sf.name}</div>
                      <div className="flex items-baseline justify-between mt-1 font-mono">
                        <span className="text-sm font-black text-slate-900">{sf.m3} mm</span>
                        <span
                          className={`text-[10px] font-bold ${
                            delta <= 0 ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          {delta > 0 ? `+${delta}` : delta} mm
                        </span>
                      </div>
                      <div className="text-[9px] font-mono text-slate-500 mt-0.5">
                        I: {sf.m1} · II: {sf.m2} · III: {sf.m3}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Full-Page Synthesis Section: PHV Banner + 1.2 Antropometrik Kompozisyon Sentezi */}
        <div
          className="mt-3 pt-3 border-t-2 space-y-2.5 relative z-10"
          style={{ borderTopColor: effectivePrimaryHex }}
        >
          <div
            className={`grid grid-cols-1 sm:grid-cols-4 print:grid-cols-4 gap-3 p-3 rounded-xl ${activeTemplate.bannerClass}`}
            style={{
              backgroundColor: effectivePrimaryHex,
              borderColor: effectiveSecondaryHex,
            }}
          >
            <div>
              <div className="text-[10px] font-bold text-white/70 uppercase">PHV (Tepe Boy Hızı) Yaşı</div>
              <div className="text-base font-extrabold font-mono text-white mt-0.5">
                {currentReport.phvAge} <span className="text-xs font-normal text-white/70">yaş</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-white/70 uppercase">PHV Dönemi Boy Tahmini</div>
              <div className="text-base font-extrabold font-mono text-white mt-0.5">
                {currentReport.phvHeight} <span className="text-xs font-normal text-white/70">cm</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-white/70 uppercase">18. Yaş Yetişkin Boy Olasılığı</div>
              <div
                className="text-base font-extrabold font-mono mt-0.5"
                style={{ color: effectiveSecondaryHex }}
              >
                {currentReport.predictedAdultHeight} <span className="text-xs font-normal text-white/70">cm</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-white/70 uppercase">Büyüme / Olgunlaşma Durumu</div>
              <div className="text-xs font-bold text-emerald-300 mt-1">{currentReport.maturationStatus}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 gap-2.5">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Dönemsel Boy Kazanımı</div>
              <div className="text-sm font-black font-mono text-slate-900 mt-0.5">
                {heightGain >= 0 ? `+${heightGain}` : heightGain} cm
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold">
                I: {heightRow?.m1 ?? 145} → III: {heightRow?.m3 ?? 149.5} cm
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Vücut Kitle &amp; BKİ</div>
              <div className="text-sm font-black font-mono text-slate-900 mt-0.5">
                {bmiRow?.m3 ?? 18.2} kg/m²
              </div>
              <div className="text-[10px] text-blue-700 font-semibold">
                Kütle Δ: {weightDelta >= 0 ? `+${weightDelta}` : weightDelta} kg ({bmiRow?.status || 'Optimal'})
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Vücut Yağ &amp; Deri Kıvrımı</div>
              <div className="text-sm font-black font-mono text-rose-700 mt-0.5">
                %{fatRow?.m3 ?? 14.2} <span className="text-[11px] font-normal text-slate-500">({sumSkinRow?.m3 ?? 26} mm)</span>
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold">
                Yağ Δ: {fatDelta > 0 ? `+${fatDelta}` : fatDelta}% ({fatRow?.status || 'Optimal'})
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Bel/Kalça &amp; Metabolik Denge</div>
              <div className="text-sm font-black font-mono text-slate-900 mt-0.5">
                {whrRow?.m3 ?? 0.78} Oran
              </div>
              <div className="text-[10px] text-slate-600 font-semibold">
                Merkez Gövde: {whrRow?.status || 'Optimal'}
              </div>
            </div>
          </div>
        </div>

        {renderPageFooter(1)}
      </div>
    );
  };

  // ============================================================================
  // PAGE 2: 2. MOTOR PERFORMANS DEĞERLENDİRMESİ & PUAN SKALASI
  // ============================================================================
  const renderPage2 = () => {
    const motorAvgPct = Math.round(
      currentReport.motorPerformance.reduce((acc, r) => acc + r.percentile, 0) /
        Math.max(1, currentReport.motorPerformance.length)
    );
    const topMotorTests = [...currentReport.motorPerformance]
      .sort((a, b) => b.percentile - a.percentile)
      .slice(0, 2);
    const devMotorTests = [...currentReport.motorPerformance]
      .sort((a, b) => a.percentile - b.percentile)
      .slice(0, 2);

    return (
      <div
        id="sportsfly-lab-page-2"
        className={`a4-print-page relative overflow-hidden min-h-[1460px] flex flex-col justify-between rounded-xl p-5 sm:p-7 shadow-xs print:shadow-none ${activeTemplate.pageFrameClass}`}
      >
        <div>
          {renderPageHeader(
            2,
            '2. Motor Performans Değerlendirmesi',
            'Performans ve Sağlık: Sürat, Çabukluk, Reaksiyon, Kuvvet, Patlayıcı Güç, Denge, Esneklik ve Aerobik Kapasite'
          )}

          {/* 10 Motor Tests Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr
                  className={`text-[10px] font-bold uppercase tracking-wider ${activeTemplate.tableHeadClass}`}
                  style={{ backgroundColor: effectivePrimaryHex, color: '#ffffff' }}
                >
                  <th className="py-2 px-2.5 rounded-tl-lg w-[30%]">Motor Performans Testi</th>
                  <th className="py-2 px-2 text-center w-[7%]">I</th>
                  <th className="py-2 px-2 text-center w-[7%]">II</th>
                  <th
                    className="py-2 px-2 text-center w-[8%]"
                    style={{ backgroundColor: 'rgba(255,255,255,0.16)', color: effectiveSecondaryHex }}
                  >
                    III (Son)
                  </th>
                  <th className="py-2 px-2 text-center w-[7%]">Birim</th>
                  <th className="py-2 px-2 text-center w-[8%]">Yüzdelik</th>
                  <th className="py-2 px-2 text-center w-[9%]">Seviye</th>
                  <th className="py-2 px-2.5 rounded-tr-lg w-[24%]">Performans Skalası (Desteklenmeli · Ortalama · Yüksek)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 text-xs">
                {currentReport.motorPerformance.map((row) => {
                  const p1 = computeScalePos(row.m1, row);
                  const p2 = computeScalePos(row.m2, row);
                  const p3 = computeScalePos(row.m3, row);
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 pr-3 pl-2">
                        <div className="font-bold text-slate-900 text-xs">{row.name}</div>
                        <div className="text-[10px] text-slate-500 leading-tight">{row.description}</div>
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono tabular-nums text-slate-600 bg-slate-50/60">
                        {row.m1}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono tabular-nums text-slate-700 bg-blue-50/30">
                        {row.m2}
                      </td>
                      <td className={`py-2.5 px-2 text-center font-mono tabular-nums font-extrabold text-sm ${activeTemplate.accentTextClass} ${activeTemplate.accentBgClass}`}>
                        {row.m3}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono text-[11px] text-slate-400">
                        {row.unit}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono tabular-nums font-bold text-slate-900">
                        %{row.percentile}
                      </td>
                      <td className={`py-2.5 px-2 text-center text-xs ${getStatusColor(row.status)}`}>
                        {row.status}
                      </td>
                      <td className="py-2.5 pl-3 pr-2">
                        <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                          <span>{row.refLow}</span>
                          <span className="text-slate-600">Ort: {row.refMid}</span>
                          <span className="text-emerald-700 font-semibold">Üst: {row.refHigh}</span>
                          <span className="text-slate-700 font-bold">sd {row.sd > 0 ? `+${row.sd}` : row.sd}</span>
                        </div>
                        <svg
                          viewBox="0 0 200 12"
                          className="w-full h-3 block overflow-visible"
                          aria-label={`${row.name} performans skalası`}
                        >
                          <rect x="0" y="1" width="200" height="10" rx="5" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
                          <rect x="1" y="1.5" width="49" height="9" rx="4" fill="#1e293b" fillOpacity="0.82" />
                          <rect x="50" y="1.5" width="100" height="9" fill="#3b82f6" fillOpacity="0.22" />
                          <rect x="150" y="1.5" width="49" height="9" rx="4" fill="#059669" fillOpacity="0.82" />

                          <circle cx={p1 * 2} cy="6" r="3.8" fill="#94a3b8" stroke="#ffffff" strokeWidth="1.2" />
                          <circle cx={p2 * 2} cy="6" r="3.8" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.2" />
                          <circle cx={p3 * 2} cy="6" r="4.8" fill="#e11d48" stroke="#ffffff" strokeWidth="1.4" />
                        </svg>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Full-Page Section: Puan Skalası + 2.2 Biyomotor Yetkinlik Kümeleri */}
        <div className="mt-4 pt-4 border-t-2 border-slate-900 space-y-3.5">
          <div className="flex flex-col md:flex-row print:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                GENEL SPORTİF PERFORMANS PUAN SKALASI
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                1., 2. ve 3. test protokolleri ağırlıklı yüzdelik gelişim endeksi (0–100 Normatif Puan)
              </p>
            </div>

            {/* 3 Circular Gauges for Protocol I, II, III */}
            <div className="flex items-center gap-5">
              {[
                { label: 'I. TEST', date: currentReport.scoreHistory.p1Date, score: currentReport.scoreHistory.p1Score, color: 'border-slate-400 text-slate-700' },
                { label: 'II. TEST', date: currentReport.scoreHistory.p2Date, score: currentReport.scoreHistory.p2Score, color: 'border-blue-600 text-blue-700' },
                { label: 'III. TEST (GÜNCEL)', date: currentReport.scoreHistory.p3Date, score: currentReport.scoreHistory.p3Score, color: 'border-emerald-600 text-emerald-700 bg-emerald-50/50' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div
                    className={`w-14 h-14 rounded-full border-4 ${item.color} flex flex-col items-center justify-center font-mono`}
                  >
                    <span className="text-sm font-black tabular-nums">%{item.score}</span>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-900">{item.label}</div>
                    <div className="text-[10px] font-mono text-slate-500">{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 0 - 100 Linear Ruler (Vector SVG for Print & PDF) */}
          <div className="px-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
              <span>DÜŞÜK (0–30)</span>
              <span>ORTALAMA PERFORMANS (30–70)</span>
              <span className="text-emerald-700">YÜKSEK PERFORMANS (70–100)</span>
            </div>
            <svg viewBox="0 0 600 14" preserveAspectRatio="none" className="w-full h-3.5 rounded-full overflow-visible block">
              <rect x="0" y="1" width="180" height="12" rx="4" fill="#334155" />
              <rect x="180" y="1" width="240" height="12" fill="#cbd5e1" />
              <rect x="420" y="1" width="180" height="12" rx="4" fill="#059669" />
              <rect
                x={Math.max(4, Math.min(592, currentReport.scoreHistory.p3Score * 6)) - 4}
                y="0"
                width="8"
                height="14"
                rx="2"
                fill="#e11d48"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </svg>
            <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-1">
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
          </div>

          {/* 2.2 Biyomotor Yetkinlik Kümeleri & Antrenman Yüklenme Sentezi */}
          <div className="grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <div className="text-[10px] font-extrabold text-emerald-900 uppercase">
                Baskın Motor Yetkinlikler
              </div>
              <div className="mt-1 space-y-1 text-xs">
                {topMotorTests.map((t) => (
                  <div key={t.id} className="flex items-center justify-between font-mono">
                    <span className="font-sans font-bold text-slate-800 truncate">{t.name}</span>
                    <span className="font-extrabold text-emerald-700">%{t.percentile}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200">
              <div className="text-[10px] font-extrabold text-rose-900 uppercase">
                Öncelikli Gelişim Alanları
              </div>
              <div className="mt-1 space-y-1 text-xs">
                {devMotorTests.map((t) => (
                  <div key={t.id} className="flex items-center justify-between font-mono">
                    <span className="font-sans font-bold text-slate-800 truncate">{t.name}</span>
                    <span className="font-extrabold text-rose-700">%{t.percentile}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`p-3 rounded-xl flex flex-col justify-between ${activeTemplate.bannerClass}`}
              style={{
                backgroundColor: effectivePrimaryHex,
                borderColor: effectiveSecondaryHex,
              }}
            >
              <div className="text-[10px] font-bold text-white/75 uppercase">
                Motor Batarya Ortalaması &amp; Trend
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-lg font-black font-mono text-emerald-300">%{motorAvgPct}</span>
                <span
                  className="text-xs font-mono font-bold"
                  style={{ color: effectiveSecondaryHex }}
                >
                  +{currentReport.scoreHistory.p3Score - currentReport.scoreHistory.p1Score} Puan (I→III)
                </span>
              </div>
              <div className="text-[10px] text-white/75 mt-0.5">
                10 Test Ağırlıklı Normatif Persentil
              </div>
            </div>
          </div>
        </div>

        {renderPageFooter(2)}
      </div>
    );
  };

  // ============================================================================
  // PAGE 3: 3. BEDEN TİPİ (SOMATOTİP) & 5. BİLEŞENLERİN YÖNÜ (POTANSİYEL)
  // ============================================================================
  const renderPage3 = () => {
    const { m1, m2, m3, eliteRef } = currentReport.somatotype;
    const toSomatoXY = (endo: number, meso: number, ecto: number) => {
      const x = ecto - endo;
      const y = 2 * meso - (endo + ecto);
      const svgX = 130 + x * 11;
      const svgY = 130 - y * 7.5;
      return { x: svgX, y: svgY };
    };

    const pt1 = toSomatoXY(m1.endo, m1.meso, m1.ecto);
    const pt2 = toSomatoXY(m2.endo, m2.meso, m2.ecto);
    const pt3 = toSomatoXY(m3.endo, m3.meso, m3.ecto);
    const ptRef = toSomatoXY(eliteRef.endo, eliteRef.meso, eliteRef.ecto);

    const branchSuitabilityList = [
      { branch: currentReport.sportBranch || 'Basketbol / Elit Branş', score: eliteRef.refScore, note: 'Birincil Branş Morfolojik Uyumu' },
      { branch: 'Atletizm (Sürat & Atlama)', score: Math.min(96, Math.round((currentReport.potential.speedScore + currentReport.potential.strengthScore) / 2 + 8)), note: 'Patlayıcı Güç & Reaktif Kapasite' },
      { branch: 'Futbol / Takım Sporları', score: Math.min(95, Math.round((currentReport.potential.speedScore + currentReport.potential.enduranceScore) / 2 + 10)), note: 'Çabukluk & Tekrarlı Sprint Uyumu' },
      { branch: 'Raket & File Sporları (Tenis/Voleybol)', score: Math.min(94, Math.round(eliteRef.refScore - 4)), note: 'Üst-Alt Ekstremite Koordinasyonu' },
    ];

    return (
      <div
        id="sportsfly-lab-page-3"
        className={`a4-print-page relative overflow-hidden min-h-[1460px] flex flex-col justify-between rounded-xl p-5 sm:p-7 shadow-xs print:shadow-none ${activeTemplate.pageFrameClass}`}
      >
        <div>
          {renderPageHeader(
            3,
            '3. Beden Tipi (Somatotip) & 5. Potansiyel Bileşenleri',
            'Heath-Carter Somatotip Bölge Tanımlaması ve Motorsal Bileşenlerin (Kuvvet · Sürat · Dayanıklılık) Yönü'
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 print:grid-cols-2 gap-5 print:gap-4">
            {/* LEFT: 3. Beden Tipi Değerlendirmesi (Heath-Carter) */}
            <div className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-200 pb-2">
                  3. Heath-Carter Somatotip Değerlendirmesi
                </h3>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  Deri kıvrım kalınlıkları, kemik çapı ve kas çevresi ölçümleriyle sporcunun Endomorfi (yağlılık), Mezomorfi (kas-iskelet sağlamlığı) ve Ektomorfi (doğrusallık/incelik) profili belirlenmiştir.
                </p>

                {/* 3-Period Somatotype Table */}
                <table className="w-full text-xs border-collapse mt-3">
                  <thead>
                    <tr
                      className={`text-[10px] uppercase ${activeTemplate.tableHeadClass}`}
                      style={{ backgroundColor: effectivePrimaryHex, color: '#ffffff' }}
                    >
                      <th className="py-1.5 px-2.5 text-left rounded-tl-lg">Test Tarihi</th>
                      <th className="py-1.5 px-2 text-center">Endomorfi</th>
                      <th className="py-1.5 px-2 text-center">Mezomorfi</th>
                      <th className="py-1.5 px-2 text-center">Ektomorfi</th>
                      <th className="py-1.5 px-2.5 text-left rounded-tr-lg">Heath-Carter Bölgesi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    <tr>
                      <td className="py-1.5 px-2.5 text-slate-600">{currentReport.date1} (I)</td>
                      <td className="py-1.5 px-2 text-center font-bold">{m1.endo}</td>
                      <td className="py-1.5 px-2 text-center font-bold">{m1.meso}</td>
                      <td className="py-1.5 px-2 text-center font-bold">{m1.ecto}</td>
                      <td className="py-1.5 px-2.5 font-sans text-[11px] text-slate-700">{m1.category}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2.5 text-slate-600">{currentReport.date2} (II)</td>
                      <td className="py-1.5 px-2 text-center font-bold">{m2.endo}</td>
                      <td className="py-1.5 px-2 text-center font-bold">{m2.meso}</td>
                      <td className="py-1.5 px-2 text-center font-bold">{m2.ecto}</td>
                      <td className="py-1.5 px-2.5 font-sans text-[11px] text-slate-700">{m2.category}</td>
                    </tr>
                    <tr className={activeTemplate.accentBgClass}>
                      <td className={`py-1.5 px-2.5 font-bold ${activeTemplate.accentTextClass}`}>{currentReport.date3} (III)</td>
                      <td className={`py-1.5 px-2 text-center font-extrabold ${activeTemplate.accentTextClass}`}>{m3.endo}</td>
                      <td className={`py-1.5 px-2 text-center font-extrabold ${activeTemplate.accentTextClass}`}>{m3.meso}</td>
                      <td className={`py-1.5 px-2 text-center font-extrabold ${activeTemplate.accentTextClass}`}>{m3.ecto}</td>
                      <td className="py-1.5 px-2.5 font-sans text-[11px] font-bold text-slate-900">{m3.category}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Somatochart SVG */}
                <div className="mt-3 flex flex-col items-center bg-slate-50 rounded-lg p-3 border border-slate-200/70">
                  <svg viewBox="0 0 260 205" className="w-full max-w-[270px] h-auto">
                    <polygon
                      points="130,18 28,178 232,178"
                      fill="#f8fafc"
                      stroke="#334155"
                      strokeWidth="1.5"
                    />
                    <line x1="130" y1="18" x2="130" y2="178" stroke="#94a3b8" strokeDasharray="3,3" />
                    <line x1="28" y1="178" x2="185" y2="90" stroke="#94a3b8" strokeDasharray="3,3" />
                    <line x1="232" y1="178" x2="75" y2="90" stroke="#94a3b8" strokeDasharray="3,3" />

                    <text x="130" y="12" textAnchor="middle" className="text-[8px] font-bold fill-slate-800">
                      MEZOMORFİ (Kas-İskelet)
                    </text>
                    <text x="38" y="194" textAnchor="middle" className="text-[8px] font-bold fill-slate-800">
                      ENDOMORFİ
                    </text>
                    <text x="220" y="194" textAnchor="middle" className="text-[8px] font-bold fill-slate-800">
                      EKTOMORFİ
                    </text>

                    <polyline
                      points={`${pt1.x},${pt1.y} ${pt2.x},${pt2.y} ${pt3.x},${pt3.y}`}
                      fill="none"
                      stroke="#e11d48"
                      strokeWidth="1.5"
                    />

                    <circle cx={ptRef.x} cy={ptRef.y} r="4.5" fill="#10b981" stroke="#fff" strokeWidth="1" />
                    <text x={ptRef.x + 6} y={ptRef.y + 3} className="text-[7px] font-bold fill-emerald-700">
                      {eliteRef.sport}
                    </text>

                    <circle cx={pt1.x} cy={pt1.y} r="3.5" fill="#64748b" />
                    <circle cx={pt2.x} cy={pt2.y} r="3.5" fill="#2563eb" />
                    <circle cx={pt3.x} cy={pt3.y} r="5" fill="#e11d48" stroke="#fff" strokeWidth="1.5" />
                    <text x={pt3.x - 10} y={pt3.y - 7} className="text-[8px] font-extrabold fill-rose-700">
                      III ({m3.endo}-{m3.meso}-{m3.ecto})
                    </text>
                  </svg>
                </div>
              </div>

              {/* Elite Reference Comparison Bar */}
              <div
                className={`mt-3 pt-3 border-t border-slate-200 flex items-center justify-between px-4 py-2.5 rounded-lg ${activeTemplate.bannerClass}`}
                style={{
                  backgroundColor: effectivePrimaryHex,
                  borderColor: effectiveSecondaryHex,
                }}
              >
                <div>
                  <div className="text-[10px] text-white/70 uppercase font-bold">
                    {eliteRef.sport} Referans Karşılaştırması
                  </div>
                  <div className="text-xs font-mono mt-0.5 text-white">
                    Sporcu: <strong style={{ color: effectiveSecondaryHex }}>{m3.endo} / {m3.meso} / {m3.ecto}</strong> · Elit Ref:{' '}
                    <strong className="text-emerald-300">{eliteRef.endo} / {eliteRef.meso} / {eliteRef.ecto}</strong>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-white/70 uppercase font-bold">Branş Uyum Puanı</div>
                  <div className="text-xl font-black font-mono text-emerald-400">{eliteRef.refScore}</div>
                </div>
              </div>
            </div>

            {/* RIGHT: 5. Bileşenlerin Yönü ve Derecesi Değerlendirmesi (Potansiyel) */}
            <div className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-200 pb-2">
                  5. Bileşenlerin Yönü ve Derecesi (Potansiyel Analizi)
                </h3>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  Performans; Kuvvet, Sürat ve Dayanıklılık bileşenlerinin karşılıklı etkileşimiyle belirlenir. Aşağıdaki vektör sporcunun baskın atletik yönünü gösterir.
                </p>

                {/* Summary Strip */}
                <div className="grid grid-cols-5 gap-1.5 mt-3 bg-slate-100 p-2 rounded-lg text-center border border-slate-200">
                  <div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase">Yön</div>
                    <div className="text-xs font-black font-mono text-slate-900">{currentReport.potential.directionDeg}°</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase">Sürat</div>
                    <div className="text-xs font-black font-mono text-slate-900">{currentReport.potential.speedScore}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase">Kuvvet</div>
                    <div className="text-xs font-black font-mono text-slate-900">{currentReport.potential.strengthScore}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase">Dayanıklılık</div>
                    <div className="text-xs font-black font-mono text-slate-900">{currentReport.potential.enduranceScore}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase">Baskın Tür</div>
                    <div className="text-[10px] font-bold text-blue-700 truncate" title={currentReport.potential.dominantType}>
                      {currentReport.potential.dominantType}
                    </div>
                  </div>
                </div>

                {/* Polar Vector Diagram SVG */}
                <div className="mt-3 flex flex-col items-center bg-slate-50 rounded-lg p-3 border border-slate-200/70">
                  <svg viewBox="0 0 260 200" className="w-full max-w-[260px] h-auto">
                    <polygon
                      points="130,18 32,175 228,175"
                      fill="none"
                      stroke="#cbd5e1"
                      strokeWidth="1.5"
                      strokeDasharray="4,3"
                    />
                    <circle cx="130" cy="115" r="22" fill="none" stroke="#e2e8f0" />
                    <circle cx="130" cy="115" r="44" fill="none" stroke="#cbd5e1" />
                    <circle cx="130" cy="115" r="66" fill="none" stroke="#94a3b8" />

                    <line x1="130" y1="35" x2="130" y2="180" stroke="#cbd5e1" />
                    <line x1="55" y1="115" x2="205" y2="115" stroke="#cbd5e1" />

                    <text x="130" y="13" textAnchor="middle" className="text-[9px] font-extrabold fill-indigo-700">
                      KUVVET (Landing / Reactive Power)
                    </text>
                    <text x="45" y="192" textAnchor="middle" className="text-[9px] font-extrabold fill-rose-700">
                      SÜRAT (Acceleration)
                    </text>
                    <text x="210" y="192" textAnchor="middle" className="text-[9px] font-extrabold fill-emerald-700">
                      DAYANIKLILIK (Aerobic)
                    </text>

                    <line
                      x1="130"
                      y1="115"
                      x2="88"
                      y2="62"
                      stroke="#0f172a"
                      strokeWidth="2.5"
                    />
                    <circle cx="88" cy="62" r="4.5" fill="#e11d48" />
                    <circle cx="130" cy="115" r="3.5" fill="#0f172a" />
                    <text x="68" y="54" className="text-[8px] font-bold fill-slate-900">
                      {currentReport.potential.directionDeg}° ({currentReport.potential.dominantType.split(' ')[0]})
                    </text>
                  </svg>
                </div>
              </div>

              {/* 1-9 Component Scale Bars (Endo / Meso / Ecto — Vector SVG for Print) */}
              <div className="mt-3 space-y-2 pt-2 border-t border-slate-200 text-xs">
                {[
                  { label: 'Endomorfi (Yağlılık)', val: m3.endo, ref: eliteRef.endo, hex: '#e11d48' },
                  { label: 'Mezomorfi (Kas-İskelet)', val: m3.meso, ref: eliteRef.meso, hex: '#2563eb' },
                  { label: 'Ektomorfi (Doğrusallık)', val: m3.ecto, ref: eliteRef.ecto, hex: '#059669' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-36 text-[11px] font-semibold text-slate-700 shrink-0">{s.label}</span>
                    <svg viewBox="0 0 200 8" preserveAspectRatio="none" className="flex-1 h-2 rounded-full overflow-hidden block">
                      <rect x="0" y="0" width="200" height="8" rx="4" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
                      <rect
                        x="0"
                        y="0"
                        width={Math.max(6, Math.min(200, (s.val / 9) * 200))}
                        height="8"
                        rx="4"
                        fill={s.hex}
                      />
                    </svg>
                    <span className="w-16 text-right font-mono text-[11px] font-bold text-slate-900">
                      {s.val} <span className="text-slate-400 font-normal">/ 9</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Full-Page Synthesis Section: 3.2 Branş Uygunluk Matrisi & Morfolojik Yönlendirme */}
        <div className="mt-4 pt-3.5 border-t-2 border-slate-900 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              3.2 Çoklu Branş Morfolojik &amp; Biyomotor Uygunluk Matrisi
            </h3>
            <span className="text-[10px] font-mono font-semibold text-slate-500">
              Somatotip ({m3.endo}-{m3.meso}-{m3.ecto}) + Motor Vektör ({currentReport.potential.directionDeg}°) Sentezi
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-4 gap-3">
            {branchSuitabilityList.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-extrabold text-slate-900 truncate">{item.branch}</span>
                    <span className="text-xs font-black font-mono text-emerald-700">%{item.score}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{item.note}</div>
                </div>
                <svg viewBox="0 0 200 7" preserveAspectRatio="none" className="w-full h-1.5 rounded-full mt-2 overflow-hidden block">
                  <rect x="0" y="0" width="200" height="7" rx="3.5" fill="#e2e8f0" />
                  <rect
                    x="0"
                    y="0"
                    width={Math.max(20, Math.min(200, item.score * 2))}
                    height="7"
                    rx="3.5"
                    fill={idx === 0 ? '#059669' : '#2563eb'}
                  />
                </svg>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-100/90 border border-slate-200 text-[11px] text-slate-700 leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <strong className="text-slate-900">Morfolojik ve Motorsal Yönlendirme:</strong> Sporcunun{' '}
              <strong>{m3.category}</strong> beden tipi ve <strong>{currentReport.potential.dominantType}</strong> baskın bileşen yönü; patlayıcı kuvvet, reaktif çeviklik ve hız gerektiren pozisyonlarda yüksek gelişim potansiyeline işaret etmektedir.
            </div>
            <span className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold shrink-0 ${activeTemplate.badgeColor}`}>
              BRANŞ UYUMU: %{eliteRef.refScore}
            </span>
          </div>
        </div>

        {renderPageFooter(3)}
      </div>
    );
  };

  // ============================================================================
  // PAGE 4: 4. KARDİYORESPİRATUAR UYGUNLUK, ANAEROBİK GÜÇ & 6. RİSK NOKTALARI
  // ============================================================================
  const renderPage4 = () => {
    const c = currentReport.cardio;
    const hrZones = [
      { zone: 'Zone 1 · Aktif Toparlanma', pct: '%50–60', min: Math.round(c.maxHeartRate * 0.5), max: Math.round(c.maxHeartRate * 0.6), color: 'bg-slate-100 text-slate-700' },
      { zone: 'Zone 2 · Aerobik Temel (Yağ Yakımı)', pct: '%60–70', min: Math.round(c.maxHeartRate * 0.6), max: Math.round(c.maxHeartRate * 0.7), color: 'bg-sky-50 text-sky-800' },
      { zone: 'Zone 3 · Aerobik Kapasite / Tempo', pct: '%70–80', min: Math.round(c.maxHeartRate * 0.7), max: Math.round(c.maxHeartRate * 0.8), color: 'bg-emerald-50 text-emerald-800' },
      { zone: 'Zone 4 · Anaerobik Eşik (Laktat)', pct: '%80–90', min: Math.round(c.maxHeartRate * 0.8), max: Math.round(c.maxHeartRate * 0.9), color: 'bg-amber-50 text-amber-800' },
      { zone: 'Zone 5 · Maksimal VO2peak / Redline', pct: '%90–100', min: Math.round(c.maxHeartRate * 0.9), max: c.maxHeartRate, color: 'bg-rose-50 text-rose-800' },
    ];

    return (
      <div
        id="sportsfly-lab-page-4"
        className={`a4-print-page relative overflow-hidden min-h-[1460px] flex flex-col justify-between rounded-xl p-5 sm:p-7 shadow-xs print:shadow-none ${activeTemplate.pageFrameClass}`}
      >
        <div>
          {renderPageHeader(
            4,
            '4. Kardiyorespiratuar Uygunluk & 6. Risk Noktaları Değerlendirmesi',
            'PACER / VO2peak Mekik Koşusu, Bazal Metabolizma, Anaerobik Güç (Watt) ve Z-Skor (±2 SD) Risk Sınırları'
          )}

          {/* Top Half: Cardio & Anaerobic Power */}
          <div className="grid grid-cols-1 lg:grid-cols-2 print:grid-cols-2 gap-5 print:gap-3.5 mb-4 print:mb-3.5">
            {/* Cardiorespiratory PACER / Shuttle Run */}
            <div className="border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-sm font-extrabold text-slate-900">
                  4. Kalp Sağlığı &amp; Aerobik Kapasite (PACER / VO2peak)
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-700">
                  Süre: {c.totalRunTime} dk:sn
                </span>
              </div>

              <table className="w-full text-xs border-collapse mt-3">
                <thead>
                  <tr
                    className={`text-[10px] uppercase ${activeTemplate.tableHeadClass}`}
                    style={{ backgroundColor: effectivePrimaryHex, color: '#ffffff' }}
                  >
                    <th className="py-1.5 px-2.5 text-left rounded-tl-lg">Test Dönemi</th>
                    <th className="py-1.5 px-2 text-center">Mesafe (m)</th>
                    <th className="py-1.5 px-2 text-center">Mekik Sayısı</th>
                    <th className="py-1.5 px-2 text-center">VO2peak (ml/kg/dk)</th>
                    <th className="py-1.5 px-2.5 text-right rounded-tr-lg">Uygunluk Bölgesi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  <tr>
                    <td className="py-1.5 px-2.5 text-slate-600">1. Test ({currentReport.date1})</td>
                    <td className="py-1.5 px-2 text-center">{c.test1Distance} m</td>
                    <td className="py-1.5 px-2 text-center">{c.test1Shuttles}</td>
                    <td className="py-1.5 px-2 text-center font-bold">{c.test1Vo2}</td>
                    <td className="py-1.5 px-2.5 text-right font-sans text-[11px] text-rose-600 font-semibold">
                      {c.test1Status}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2.5 text-slate-600">2. Test ({currentReport.date2})</td>
                    <td className="py-1.5 px-2 text-center">{c.test2Distance} m</td>
                    <td className="py-1.5 px-2 text-center">{c.test2Shuttles}</td>
                    <td className="py-1.5 px-2 text-center font-bold">{c.test2Vo2}</td>
                    <td className="py-1.5 px-2.5 text-right font-sans text-[11px] text-amber-600 font-semibold">
                      {c.test2Status}
                    </td>
                  </tr>
                  <tr className="bg-emerald-50/50">
                    <td className="py-1.5 px-2.5 font-bold text-emerald-800">3. Test ({currentReport.date3})</td>
                    <td className="py-1.5 px-2 text-center font-extrabold text-emerald-800">{c.test3Distance} m</td>
                    <td className="py-1.5 px-2 text-center font-extrabold text-emerald-800">{c.test3Shuttles}</td>
                    <td className="py-1.5 px-2 text-center font-extrabold text-emerald-800">{c.test3Vo2}</td>
                    <td className="py-1.5 px-2.5 text-right font-sans text-[11px] text-emerald-700 font-bold">
                      {c.test3Status}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Physiological Metrics */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200 text-center">
                <div className="bg-slate-50 p-2 rounded-lg">
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Bazal Metabolik Hız</div>
                  <div className="text-sm font-black font-mono text-slate-900 mt-0.5">
                    {c.basalMetabolicRate} <span className="text-[10px] font-normal">kcal/gün</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Fonksiyonel Kapasite</div>
                  <div className="text-sm font-black font-mono text-blue-700 mt-0.5">
                    {c.functionalCapacityMet} <span className="text-[10px] font-normal">MET</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Maks. Kalp Atım Hızı</div>
                  <div className="text-sm font-black font-mono text-rose-600 mt-0.5">
                    {c.maxHeartRate} <span className="text-[10px] font-normal">atım/dk</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Anaerobic Power & Body Fat Health Zone */}
            <div className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-200 pb-2">
                  Anaerobik Güç (Lewis &amp; Sprint Watt Analizi)
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  Çok kısa süreli maksimal fiziksel aktivitelerde kasların birim zamanda ürettiği mekanik güç kapasitesidir.
                </p>

                <div className="space-y-3 mt-3">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>Dikey Sıçrama — Lewis Anaerobik Güç</span>
                      <span className="font-mono text-blue-700">
                        {c.verticalJumpAnaerobicWatt} Watt · Relatif: {c.verticalJumpRelativeWatt} W/kg
                      </span>
                    </div>
                    <svg viewBox="0 0 200 8" preserveAspectRatio="none" className="w-full h-2 rounded-full mt-1.5 overflow-hidden block">
                      <rect x="0" y="0" width="200" height="8" rx="4" fill="#e2e8f0" />
                      <rect
                        x="0"
                        y="0"
                        width={Math.min(190, (c.verticalJumpAnaerobicWatt / 700) * 200)}
                        height="8"
                        rx="4"
                        fill="#2563eb"
                      />
                    </svg>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>20 Metre Sprint Koşusu — Anaerobik Güç</span>
                      <span className="font-mono text-emerald-700">
                        {c.sprint20mAnaerobicWatt} Watt · Relatif: {c.sprint20mRelativeWatt} W/kg
                      </span>
                    </div>
                    <svg viewBox="0 0 200 8" preserveAspectRatio="none" className="w-full h-2 rounded-full mt-1.5 overflow-hidden block">
                      <rect x="0" y="0" width="200" height="8" rx="4" fill="#e2e8f0" />
                      <rect
                        x="0"
                        y="0"
                        width={Math.min(190, (c.sprint20mAnaerobicWatt / 600) * 200)}
                        height="8"
                        rx="4"
                        fill="#059669"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs bg-amber-50/60 px-3 py-2 rounded-lg border border-amber-200/70">
                <div>
                  <span className="font-bold text-slate-900">Healthy Fitness Zone (Sağlıklı Uygunluk): </span>
                  <span className="text-slate-600 text-[11px]">
                    Aerobik kapasite +0.6 SD ile sağlıklı bölgede yer almaktadır.
                  </span>
                </div>
                <span className="font-mono font-bold text-emerald-700 shrink-0 ml-2">HFZ ONAYLI</span>
              </div>
            </div>
          </div>

          {/* Middle Section: 6. Risk Noktaları Değerlendirmesi (Z-Score Cut-off Points >+2 SD and <-2 SD) */}
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2 mb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  6. Risk Noktaları Değerlendirmesi (Z-Skor / Standart Sapma Sınır Analizi)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Cut-off Sınırları: <strong className="text-emerald-700">+2 SD (Yüksek Performans / Üst Sınır)</strong> ve{' '}
                  <strong className="text-rose-600">-2 SD (Düşük Performans / Risk Başlangıcı)</strong>
                </p>
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                Kas-iskelet ve kardiyovasküler uygunluk Z-skor dağılımı
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4 print:gap-3.5">
              {/* Motor Performance SD Chart */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70">
                <div className="text-xs font-bold text-slate-800 mb-2">
                  Motor Performans Ölçümleri (SD Dağılımı)
                </div>
                <div className="space-y-1.5">
                  {currentReport.motorPerformance.map((m) => {
                    const pct = Math.max(5, Math.min(95, ((m.sd + 3) / 6) * 100));
                    const dotFill = m.sd < -1 ? '#e11d48' : m.sd > 1 ? '#059669' : '#2563eb';
                    return (
                      <div key={m.id} className="flex items-center gap-2 text-[11px]">
                        <span className="w-32 truncate text-slate-700 font-medium">{m.name}</span>
                        <svg viewBox="0 0 200 12" className="flex-1 h-3 block overflow-visible">
                          <rect x="0" y="1" width="200" height="10" rx="2" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                          <line x1="33.2" y1="1" x2="33.2" y2="11" stroke="#fb7185" strokeWidth="1.2" />
                          <line x1="100" y1="1" x2="100" y2="11" stroke="#cbd5e1" strokeWidth="1" />
                          <line x1="166.6" y1="1" x2="166.6" y2="11" stroke="#10b981" strokeWidth="1.2" />
                          <circle cx={pct * 2} cy="6" r="4.2" fill={dotFill} stroke="#ffffff" strokeWidth="1.2" />
                        </svg>
                        <span className="w-12 text-right font-mono text-[10px] font-bold text-slate-700">
                          {m.sd > 0 ? `+${m.sd}` : m.sd}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Body Composition SD Chart */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70">
                <div className="text-xs font-bold text-slate-800 mb-2">
                  Beden Kompozisyonu Ölçümleri (SD Dağılımı)
                </div>
                <div className="space-y-1.5">
                  {currentReport.bodyComposition.slice(0, 10).map((b) => {
                    const pct = Math.max(5, Math.min(95, ((b.sd + 3) / 6) * 100));
                    const dotFill = b.sd > 1.5 ? '#d97706' : '#1e293b';
                    return (
                      <div key={b.id} className="flex items-center gap-2 text-[11px]">
                        <span className="w-32 truncate text-slate-700 font-medium">{b.name}</span>
                        <svg viewBox="0 0 200 12" className="flex-1 h-3 block overflow-visible">
                          <rect x="0" y="1" width="200" height="10" rx="2" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                          <line x1="33.2" y1="1" x2="33.2" y2="11" stroke="#fb7185" strokeWidth="1.2" />
                          <line x1="100" y1="1" x2="100" y2="11" stroke="#cbd5e1" strokeWidth="1" />
                          <line x1="166.6" y1="1" x2="166.6" y2="11" stroke="#f59e0b" strokeWidth="1.2" />
                          <circle cx={pct * 2} cy="6" r="4.2" fill={dotFill} stroke="#ffffff" strokeWidth="1.2" />
                        </svg>
                        <span className="w-12 text-right font-mono text-[10px] font-bold text-slate-700">
                          {b.sd > 0 ? `+${b.sd}` : b.sd}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Full-Page Section: 4.2 Kalp Atım Hızı Antrenman Bölgeleri (MKAH) */}
        <div className="mt-4 pt-3.5 border-t-2 border-slate-900 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              4.2 Bireysel Kalp Atım Hızı Antrenman Bölgeleri (MKAH: {c.maxHeartRate} atım/dk) &amp; Koruyucu Yüklenme Rehberi
            </h3>
            <span className="text-[10px] font-mono font-semibold text-slate-500">
              VO2peak: {c.test3Vo2} ml/kg/dk · {c.functionalCapacityMet} MET
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 print:grid-cols-5 gap-2">
            {hrZones.map((hz, i) => (
              <div key={i} className={`p-2.5 rounded-xl border border-slate-200 ${hz.color}`}>
                <div className="text-[9.5px] font-extrabold uppercase truncate">{hz.zone}</div>
                <div className="text-sm font-black font-mono mt-0.5">
                  {hz.min}–{hz.max} <span className="text-[9px] font-normal">bpm</span>
                </div>
                <div className="text-[9.5px] font-mono opacity-80">Yoğunluk: {hz.pct}</div>
              </div>
            ))}
          </div>
        </div>

        {renderPageFooter(4)}
      </div>
    );
  };

  // ============================================================================
  // PAGE 5: 7. PERFORMANS GRAFİKLERİ I — MOTOR PERFORMANS YÜZDELİK RADAR GRAFİĞİ
  //         & ANTROPOMETRİK BEDEN KOMPOZİSYONU RADAR ANALİZİ
  // ============================================================================
  const renderPage5 = () => (
    <div
      id="sportsfly-lab-page-5"
      className={`a4-print-page relative overflow-hidden min-h-[1460px] flex flex-col justify-between rounded-xl p-5 sm:p-7 shadow-xs print:shadow-none ${activeTemplate.pageFrameClass}`}
    >
      {renderPageHeader(
        5,
        '7. Performans Grafikleri I — Çok Boyutlu Yüzdelik Radar Analizi',
        'Motor Performans Yüzdelik Radar Grafiği (10 Test), Antropometrik Beden Kompozisyonu Radarı ve Yetkinlik Kümeleri'
      )}

      <SportsFlyLabKarnePage5RadarContent report={currentReport} />

      {renderPageFooter(5)}
    </div>
  );

  // ============================================================================
  // PAGE 6: 8. PERFORMANS GRAFİKLERİ II — GENEL SPORTİF PERFORMANS PUAN GELİŞİMİ
  //         & DÖNEMSEL GELİŞİM EĞRİLERİ
  // ============================================================================
  const renderPage6 = () => (
    <div
      id="sportsfly-lab-page-6"
      className={`a4-print-page relative overflow-hidden min-h-[1460px] flex flex-col justify-between rounded-xl p-5 sm:p-7 shadow-xs print:shadow-none ${activeTemplate.pageFrameClass}`}
    >
      {renderPageHeader(
        6,
        '8. Performans Grafikleri II — Genel Sportif Performans Puan Gelişimi',
        'Genel Sportif Performans Puan Gelişimi, VO2peak Kardiyorespiratuar Uygunluk, Sürat, Çabukluk ve Patlayıcı Güç Eğrileri'
      )}

      <SportsFlyLabKarnePage6LineContent report={currentReport} />

      {renderPageFooter(6)}
    </div>
  );

  // ============================================================================
  // PAGE 7: 9. HEDEF PERFORMANS (İPSATİF), PHV BÜYÜME HIZI & UZMAN GÖRÜŞÜ
  // ============================================================================
  const renderPage7 = () => {
    const g = currentReport.groupInfo;
    return (
      <div
        id="sportsfly-lab-page-7"
        className={`a4-print-page relative overflow-hidden min-h-[1460px] flex flex-col justify-between rounded-xl p-5 sm:p-7 shadow-xs print:shadow-none ${activeTemplate.pageFrameClass}`}
      >
        <div>
          {renderPageHeader(
            7,
            '9. Hedef Performans (İpsatif Değerlendirme), PHV & Uzman Görüşü',
            'Bireysel Büyüme Hızlarına Göre Beklenen Performans Hedefleri, Grup Sıralaması ve Klinik Metodoloji Özeti'
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 print:grid-cols-12 gap-5 print:gap-3.5">
            {/* Left 7 Cols: Ipsative Target Table & Group Ranking */}
            <div className="lg:col-span-7 print:col-span-7 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      8. İpsatif Değerlendirme &amp; Beklenen Performans Hedefi
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Sporcunun kendi önceki ölçümlerine göre {currentReport.nextTargetDate} testinde beklenen gelişim hedefi
                    </p>
                  </div>
                </div>

                <table className="w-full text-xs border-collapse mt-3">
                  <thead>
                    <tr
                      className={`text-[10px] uppercase ${activeTemplate.tableHeadClass}`}
                      style={{ backgroundColor: effectivePrimaryHex, color: '#ffffff' }}
                    >
                      <th className="py-2 px-2.5 text-left rounded-tl-lg">Protokol / Test</th>
                      <th className="py-2 px-2 text-center">I. Ölçüm</th>
                      <th className="py-2 px-2 text-center">II. Ölçüm</th>
                      <th className="py-2 px-2 text-center">III. Ölçüm</th>
                      <th
                        className="py-2 px-2.5 text-center text-white"
                        style={{ backgroundColor: 'rgba(255,255,255,0.16)', color: effectiveSecondaryHex }}
                      >
                        Hedef Performans
                      </th>
                      <th className="py-2 px-2 text-center rounded-tr-lg">Grup Sırası</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {currentReport.ipsativeTargets.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-2.5 font-sans font-bold text-slate-900">
                          {row.parameter} <span className="text-[10px] font-normal text-slate-400">({row.unit})</span>
                        </td>
                        <td className="py-2 px-2 text-center text-slate-600">{row.m1}</td>
                        <td className="py-2 px-2 text-center text-slate-700">{row.m2}</td>
                        <td className="py-2 px-2 text-center font-bold text-slate-900">{row.m3}</td>
                        <td className={`py-2 px-2.5 text-center font-black text-sm ${activeTemplate.accentTextClass} ${activeTemplate.accentBgClass}`}>
                          {row.target}
                        </td>
                        <td className="py-2 px-2 text-center text-slate-600 font-bold">{row.groupRank}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Group & General Standing Strip */}
              <div
                className={`mt-4 grid grid-cols-2 gap-3 p-3.5 rounded-lg ${activeTemplate.bannerClass}`}
                style={{
                  backgroundColor: effectivePrimaryHex,
                  borderColor: effectiveSecondaryHex,
                }}
              >
                <div className="flex items-center justify-between border-r border-white/15 pr-3">
                  <div>
                    <div className="text-[10px] text-white/70 uppercase font-bold">Gruptaki Sporcu &amp; Sırası</div>
                    <div className="text-[11px] text-white/85 mt-0.5">
                      {g.groupNo}. Grup ({g.ageRange})
                    </div>
                  </div>
                  <div
                    className="text-xl font-black font-mono"
                    style={{ color: effectiveSecondaryHex }}
                  >
                    {g.groupAthleteCount} / {g.groupRank}
                  </div>
                </div>
                <div className="flex items-center justify-between pl-1">
                  <div>
                    <div className="text-[10px] text-white/70 uppercase font-bold">Genel Sporcu &amp; Sırası</div>
                    <div className="text-[11px] text-white/85 mt-0.5">Tüm Yaş Grupları Genel</div>
                  </div>
                  <div className="text-xl font-black font-mono text-emerald-300">
                    {g.totalAthleteCount} / {g.totalRank}
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Peak Height Velocity (PHV) & Sensitive Periods */}
            <div className="lg:col-span-5 print:col-span-5 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-200 pb-2">
                  Tepe Yükseklik Hızı (Peak Height Velocity - PHV)
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Ergenlik büyüme atağı (PHV) zamanlaması, antrenman yüklenmelerinin ve hassas motor gelişim pencerelerinin planlanmasında temel ölçüttür.
                </p>

                <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div className="text-[9px] font-bold text-slate-400 uppercase">Mevcut Boy</div>
                    <div className="text-sm font-black font-mono text-slate-900">
                      {currentReport.bodyComposition.find((x) => x.id === 'height')?.m3 || 149.5} cm
                    </div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div className="text-[9px] font-bold text-slate-400 uppercase">PHV Boy / Yaş</div>
                    <div className="text-sm font-black font-mono text-blue-700">
                      {currentReport.phvHeight} cm ({currentReport.phvAge})
                    </div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div className="text-[9px] font-bold text-slate-400 uppercase">18 Yaş Olasılık</div>
                    <div className="text-sm font-black font-mono text-emerald-700">
                      {currentReport.predictedAdultHeight} cm
                    </div>
                  </div>
                </div>

                {/* PHV Growth Velocity Curve SVG */}
                <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-200/70">
                  <div className="text-[10px] font-bold text-slate-700 mb-1 flex justify-between">
                    <span>Büyüme Hızı Eğrisi (cm/yıl) &amp; Hassas Dönem</span>
                    <span className="font-mono text-rose-700">PHV Zirvesi: {currentReport.phvAge} Yaş</span>
                  </div>
                  <svg viewBox="0 0 260 95" className="w-full h-auto">
                    <line x1="20" y1="80" x2="250" y2="80" stroke="#94a3b8" strokeWidth="1" />
                    <path
                      d="M 25 45 Q 70 55, 105 52 Q 135 12, 165 45 T 245 78"
                      fill="none"
                      stroke="#e11d48"
                      strokeWidth="2.2"
                    />
                    <line x1="135" y1="12" x2="135" y2="80" stroke="#0f172a" strokeDasharray="2,2" />
                    <circle cx="135" cy="24" r="4" fill="#0f172a" />
                    <text x="135" y="10" textAnchor="middle" className="text-[8px] font-bold fill-slate-900">
                      PHV ({currentReport.phvAge} yaş)
                    </text>
                    <circle cx="96" cy="50" r="4" fill="#2563eb" stroke="#fff" strokeWidth="1" />
                    <text x="85" y="65" textAnchor="middle" className="text-[8px] font-bold fill-blue-700">
                      Mevcut ({currentReport.ageYears})
                    </text>
                  </svg>
                </div>
              </div>

              {/* Sensitive Development Windows */}
              <div className="mt-3 pt-2 border-t border-slate-200 space-y-1 text-[11px]">
                <div className="font-bold text-slate-800">Gelişimin Hassas Dönem Öncelikleri:</div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>· Kaba &amp; İnce Motor Koordinasyon</span>
                  <span className="font-mono font-bold text-emerald-700">Aktif Pencere (Optimal)</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>· Sürat, Çabukluk &amp; Pliometrik Beceri</span>
                  <span className="font-mono font-bold text-blue-700">Yüksek Kazanım Dönemi</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Full-Page Section: AI Recommendations + Expert Evaluation + Weekly Microcycle Plan */}
        <div className="mt-4 border-t-2 border-slate-900 pt-3.5 space-y-3">
          <div className="border border-slate-200 rounded-xl p-3.5 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  9. YAPAY ZEKA TABANLI PERFORMANS ÖNERİLERİ VE GELİŞİME AÇIK YÖNLER
                </span>
              </div>
              <span className="text-[10px] font-mono font-semibold text-slate-500">
                Otomatik Metrik &amp; SD Sapma Analizi
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-2.5 text-xs">
              {activeAiAnalysis.improvementAreas.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/90 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-slate-900 text-[11px] truncate">
                        {item.metricName}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold ${
                          item.priority.includes('Yüksek')
                            ? 'text-rose-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-600 mt-0.5">
                      Mevcut: <strong>{item.currentValue}</strong> → Hedef:{' '}
                      <strong className="text-emerald-700">{item.targetValue}</strong> (%{item.percentile})
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1 leading-snug line-clamp-2">
                      {item.drillRecommendation}
                    </p>
                  </div>
                  <div className="mt-1.5 pt-1 border-t border-slate-200/70 text-[9px] font-mono font-semibold text-blue-700">
                    Sıklık: {item.weeklyFrequency}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-1">
              SPORCU GELİŞİM DEĞERLENDİRMESİ VE UZMAN GÖRÜŞÜ
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{currentReport.expertComment}</p>
          </div>

          {/* 9.2 Haftalık Örnek Mikro-Döngü Antrenman Planı */}
          <div className="grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 gap-2.5 text-[11px]">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[9.5px] font-extrabold text-slate-900 uppercase">Pzt / Çar · Sürat &amp; Çeviklik</div>
              <div className="text-[10px] text-slate-600 mt-0.5">15 dk Nöromüsküler Isınma + 10x5m Reaktif Yön Değiştirme</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[9.5px] font-extrabold text-slate-900 uppercase">Sal / Per · Kuvvet &amp; Denge</div>
              <div className="text-[10px] text-slate-600 mt-0.5">Vücut Ağırlığı Merkez Gövde (Core) + Flamingo Propriosepsiyon</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[9.5px] font-extrabold text-slate-900 uppercase">Cuma / Cmt · Branş &amp; Oyun</div>
              <div className="text-[10px] text-slate-600 mt-0.5">Aerobik Oyun İçi Dayanıklılık + Teknik Koordinasyon Drilleri</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[9.5px] font-extrabold text-emerald-800 uppercase">Pazar · Rejenerasyon</div>
              <div className="text-[10px] text-slate-600 mt-0.5">Dinamik Esneklik (Sit &amp; Reach) + 9 Saat Kaliteli Uyku Takibi</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4 text-[10px] text-slate-500 leading-relaxed px-1">
            <p>
              <strong>Bilimsel Metodoloji:</strong> Sportif performansın bileşenlerinin ölçümlendiği 10 test protokolü; sürat, kuvvet, denge, esneklik, reaksiyon sürati, 10x5m çabukluk, durarak uzun atlama ve PACER (dayanıklılık) bataryalarından oluşturulmuştur.
            </p>
            <p>
              <strong>İpsatif Gelişim Yaklaşımı:</strong> İpsatif değerlendirme sporcu merkezlidir; gelişim için önceki performansların aşılmasına odaklanır.{' '}
              <strong className={activeTemplate.accentTextClass}>Farkındalık, gelişimi yönetmek için ilk adımdır.</strong>
            </p>
          </div>
        </div>

        {renderPageFooter(7)}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {localToast && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{localToast}</span>
        </div>
      )}

      {/* Hidden File Input for Excel Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleExcelUpload}
        className="hidden"
      />

      {/* Hidden File Input for Batch Excel Upload */}
      <input
        ref={batchFileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleBatchExcelInputChange}
        className="hidden"
      />

      {/* Hidden File Input for Sport School Logo Upload */}
      <input
        ref={schoolLogoInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
        onChange={handleSchoolLogoUpload}
        className="hidden"
      />

      {/* Top Studio Control Bar (Clean, Grouped & Uncluttered) */}
      <div
        ref={headerMenuContainerRef}
        className="bg-white dark:bg-[#111c2e] rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 shadow-2xs print:hidden"
      >
        {/* ROW 1: Brand Title + Primary Workspace Mode Tabs + Grouped PDF/Print Menu */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          {/* Left: Brand & Active School Summary */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 shadow-xs">
              <SportsFlyVectorMark className="w-7 h-7" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug truncate">
                SportsFly Lab — Atletik Performans &amp; Beden Kompozisyonu Karnesi
              </h1>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[220px] sm:max-w-xs">
                  {effectiveClubName}
                </span>
                <span aria-hidden="true">·</span>
                <span className="truncate max-w-[160px]">{effectiveBranchName}</span>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => setShowBrandingSettings((prev) => !prev)}
                  className="text-sky-600 dark:text-sky-400 hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>{showBrandingSettings ? 'Okul Ayarlarını Gizle' : 'Okul & Logo Ayarları'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Workspace Mode Tabs + Primary PDF Download & Output Dropdown */}
          <div className="flex flex-wrap items-center justify-between xl:justify-end gap-2 shrink-0">
            {/* Primary Module Section Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setActiveLabTab('studio')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeLabTab === 'studio'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Karne Görünümü</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveLabTab('batch')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeLabTab === 'batch'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Excel'den toplu sporcu verisi yükleyerek toplu karne ve toplu PDF oluşturun"
              >
                <Users className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                <span>Toplu Karne</span>
                <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  ({batchReports.length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveLabTab('archive')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeLabTab === 'archive'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="İsimlendirilerek kaydedilmiş tüm sporcu karnelerini görüntüleyin"
              >
                <Archive className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Arşiv</span>
                <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  ({archivedReports.length})
                </span>
              </button>
            </div>

            {/* Grouped PDF Download + Print/Preview Dropdown Menu */}
            <div className="relative flex items-center">
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="px-3.5 py-2 rounded-l-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap"
                title="7 sayfalık sporcu karnesinin tamamını yüksek çözünürlüklü A4 PDF olarak indirin"
              >
                <FileDown className="w-4 h-4 text-sky-400 dark:text-white shrink-0" />
                <span>
                  {isGeneratingPDF
                    ? `İndiriliyor (${pdfProgressPage || 1}/7)...`
                    : 'Tüm Karneyi İndir'}
                </span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setOpenHeaderMenu((prev) => (prev === 'export' ? null : 'export'))
                }
                className="px-2.5 py-2 rounded-r-xl border-l border-slate-700 dark:border-sky-500 bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
                title="PDF Görünümü ve A4 Yazdırma Seçenekleri"
              >
                <ChevronDown className="w-4 h-4 shrink-0" />
              </button>

              {openHeaderMenu === 'export' && (
                <div className="absolute right-0 top-full mt-1.5 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl p-1.5 z-40 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Çıktı &amp; PDF İşlemleri
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenHeaderMenu(null);
                      handleDownloadPDF();
                    }}
                    disabled={isGeneratingPDF}
                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <FileDown className="w-4 h-4 text-sky-600 shrink-0" />
                    <div>
                      <div>Tüm Karneyi İndir (7 Sayfa PDF)</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        Yüksek çözünürlüklü A4 PDF dosyası
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenHeaderMenu(null);
                      handleTogglePdfPreview();
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Eye className="w-4 h-4 text-rose-600 shrink-0" />
                      <div>
                        <div>
                          {isPdfPreviewMode ? 'PDF Görünümünü Kapat' : 'PDF Olarak Görüntüle'}
                        </div>
                        <div className="text-[10px] font-normal text-slate-500">
                          A4 baskı önizleme ölçeği
                        </div>
                      </div>
                    </div>
                    {isPdfPreviewMode && (
                      <span className="text-[10px] font-mono font-bold text-rose-600">Açık</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenHeaderMenu(null);
                      handlePrintA4();
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-slate-600 dark:text-slate-300 shrink-0" />
                    <div>
                      <div>A4 Yazdır</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        Tarayıcı yazdırma diyaloğu ile çıktı al
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ROW 2: Athlete Selector + Grouped Dropdown Menus (Left) & Compact Page Bar (Right) */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col xl:flex-row xl:items-center justify-between gap-2.5">
          {/* Left: Active Athlete Selector + 3 Grouped Action Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Athlete Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 min-w-0 max-w-full">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                Sporcu:
              </span>
              <select
                value={selectedReportId}
                onChange={(e) => setSelectedReportId(e.target.value)}
                className="min-w-0 max-w-[220px] sm:max-w-[260px] bg-transparent text-xs font-extrabold text-slate-900 dark:text-white focus:outline-none truncate cursor-pointer"
              >
                {reports.map((rep) => (
                  <option key={rep.id} value={rep.id}>
                    {rep.athleteName} — {rep.ageYears} Yaş ({rep.branchName})
                  </option>
                ))}
              </select>
            </div>

            {/* DROPDOWN 1: Excel & Veri İşlemleri (Grouped Vertically) */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenHeaderMenu((prev) => (prev === 'excel' ? null : 'excel'))
                }
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  openHeaderMenu === 'excel'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200'
                    : 'border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Excel &amp; Veri İşlemleri</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {openHeaderMenu === 'excel' && (
                <div className="absolute left-0 top-full mt-1.5 w-72 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl p-1.5 z-40 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Excel Yükleme &amp; Şablonlar
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenHeaderMenu(null);
                      fileInputRef.current?.click();
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div>Excel Verisi Yükle (.xlsx / .csv)</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        Tekil veya çoklu sporcu ölçüm dosyası yükle
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenHeaderMenu(null);
                      setActiveLabTab('batch');
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Users className="w-4 h-4 text-violet-600 shrink-0" />
                    <div>
                      <div>Toplu Karne Oluştur (Excel)</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        Çoklu sporcu tablosundan toplu karne üret
                      </div>
                    </div>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  <button
                    type="button"
                    onClick={() => {
                      setOpenHeaderMenu(null);
                      downloadSportsFlyLabExcelTemplate(currentReport);
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-sky-600 shrink-0" />
                    <div>
                      <div>Örnek Excel Şablonu İndir (.xlsx)</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        Standart karne ölçüm şablonunu indir
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenHeaderMenu(null);
                      downloadBatchSportsFlyLabExcelTemplate(currentReport);
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div>Toplu Sporcu Excel Şablonu İndir</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        Çoklu sporcu satırlı örnek tablo (.xlsx)
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* DROPDOWN 2: Karne İşlemleri (Yeni Karne, Düzenle, Arşive Kaydet) */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenHeaderMenu((prev) => (prev === 'karne' ? null : 'karne'))
                }
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  openHeaderMenu === 'karne'
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/50 text-sky-900 dark:text-sky-200'
                    : 'border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Karne İşlemleri</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {openHeaderMenu === 'karne' && (
                <div className="absolute left-0 top-full mt-1.5 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl p-1.5 z-40 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Sporcu &amp; Karne Yönetimi
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenHeaderMenu(null);
                      setShowNewReportModal(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-sky-600 shrink-0" />
                    <div>
                      <div>Yeni Karne Oluştur</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        Yeni sporcu profili ve karne ekle
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenHeaderMenu(null);
                      setShowEditModal(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <div>Verileri Düzenle</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        Aktif sporcunun ölçümlerini güncelle
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenHeaderMenu(null);
                      handleOpenSaveArchiveModal(currentReport);
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <BookmarkPlus className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <div>Arşive İsimle Kaydet</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        Karne Arşivi&apos;ne dönem adıyla sakla
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* DROPDOWN 3: Karne Tasarım Şablonu Seçici (3 Modern Profesyonel PDF Şablonu) */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenHeaderMenu((prev) => (prev === 'templates' ? null : 'templates'))
                }
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  openHeaderMenu === 'templates'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200'
                    : 'border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>PDF Şablonu: {activeTemplate.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {openHeaderMenu === 'templates' && (
                <div className="absolute left-0 top-full mt-1.5 w-80 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl p-1.5 z-40 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    3 Profesyonel PDF Karne Şablonu (Tam A4)
                  </div>
                  {KARNE_TEMPLATES.map((tpl) => {
                    const isSelected = tpl.id === karneTemplate;
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => {
                          handleSelectKarneTemplate(tpl.id);
                          setOpenHeaderMenu(null);
                          notify(`Karne PDF şablonu "${tpl.name}" olarak güncellendi.`);
                        }}
                        className={`w-full px-3 py-2 rounded-lg text-left text-xs font-bold flex items-start justify-between gap-2 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white dark:bg-slate-800'
                            : 'text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span>{tpl.shortName}</span>
                          </div>
                          <div
                            className={`text-[10px] font-normal mt-0.5 ${
                              isSelected ? 'text-slate-300' : 'text-slate-500'
                            }`}
                          >
                            {tpl.subtitle}
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}

                  <div className="pt-1.5 mt-1 border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Anatomik Vücut Haritası (B)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowBodyMapInfographic((prev) => !prev);
                        notify(
                          !showBodyMapInfographic
                            ? 'Sayfa 1 Anatomik Vücut Haritası İnfografiği aktif edildi.'
                            : 'Anatomik Vücut Haritası gizlendi.'
                        );
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold cursor-pointer ${
                        showBodyMapInfographic
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {showBodyMapInfographic ? 'AÇIK' : 'KAPALI'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* DROPDOWN 3.5 (C): Dinamik Kulüp Renk Paleti Seçici */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenHeaderMenu((prev) => (prev === 'clubColors' ? null : 'clubColors'))
                }
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  openHeaderMenu === 'clubColors'
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/50 text-sky-900 dark:text-sky-200'
                    : 'border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                <span className="flex items-center -space-x-1 shrink-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs inline-block"
                    style={{ backgroundColor: effectivePrimaryHex }}
                  />
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs inline-block"
                    style={{ backgroundColor: effectiveSecondaryHex }}
                  />
                </span>
                <span>Kulüp Rengi: {activePaletteObj.shortName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {openHeaderMenu === 'clubColors' && (
                <div className="absolute left-0 top-full mt-1.5 w-80 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl p-2 z-40 space-y-1">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Dinamik Kulüp Renk Paleti (C)
                  </div>
                  {CLUB_COLOR_PALETTES.map((pal) => {
                    const isSelected = pal.id === clubColorPalette;
                    const pHex =
                      pal.id === 'custom'
                        ? customPrimaryHex
                        : pal.id === 'template-default'
                          ? activeTemplate.defaultPrimaryHex
                          : pal.primaryHex;
                    const sHex =
                      pal.id === 'custom'
                        ? customSecondaryHex
                        : pal.id === 'template-default'
                          ? activeTemplate.defaultSecondaryHex
                          : pal.secondaryHex;

                    return (
                      <button
                        key={pal.id}
                        type="button"
                        onClick={() => {
                          handleSelectClubColorPalette(pal.id);
                          if (pal.id !== 'custom') {
                            setOpenHeaderMenu(null);
                          }
                          notify(`Kulüp renk teması "${pal.name}" olarak uygulandı.`);
                        }}
                        className={`w-full px-2.5 py-2 rounded-lg text-left text-xs font-bold flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white dark:bg-slate-800'
                            : 'text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="flex items-center -space-x-1 shrink-0">
                            <span
                              className="w-4 h-4 rounded-full border border-white shadow-2xs inline-block"
                              style={{ backgroundColor: pHex }}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-white shadow-2xs inline-block"
                              style={{ backgroundColor: sHex }}
                            />
                          </span>
                          <span>{pal.name}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}

                  {clubColorPalette === 'custom' && (
                    <div className="pt-2 mt-1 border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">
                          Ana Kulüp Rengi
                        </label>
                        <input
                          type="color"
                          value={customPrimaryHex}
                          onChange={(e) => {
                            setCustomPrimaryHex(e.target.value);
                            try {
                              localStorage.setItem('sportsfly_lab_custom_primary_hex', e.target.value);
                            } catch {
                              // ignore
                            }
                          }}
                          className="w-full h-8 rounded cursor-pointer border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">
                          Vurgu Rengi
                        </label>
                        <input
                          type="color"
                          value={customSecondaryHex}
                          onChange={(e) => {
                            setCustomSecondaryHex(e.target.value);
                            try {
                              localStorage.setItem('sportsfly_lab_custom_secondary_hex', e.target.value);
                            } catch {
                              // ignore
                            }
                          }}
                          className="w-full h-8 rounded cursor-pointer border border-slate-300"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* DROPDOWN 4: Görünüm, Analiz & Okul Ayarları */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenHeaderMenu((prev) => (prev === 'panels' ? null : 'panels'))
                }
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  openHeaderMenu === 'panels' || showBrandingSettings
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200'
                    : 'border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Analiz &amp; Ayarlar</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {openHeaderMenu === 'panels' && (
                <div className="absolute left-0 sm:left-auto sm:right-0 xl:left-0 top-full mt-1.5 w-72 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl p-1.5 z-40 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Paneller &amp; Kurumsal Tasarım
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenHeaderMenu(null);
                      setShowBrandingSettings((prev) => !prev);
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-4 h-4 text-sky-600 shrink-0" />
                      <div>
                        <div>Okul Adı, Logo &amp; Şablon Ayarları</div>
                        <div className="text-[10px] font-normal text-slate-500">
                          Kulüp başlığı, logo ve 4 karne tasarım şablonu
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      {showBrandingSettings ? 'Açık' : 'Kapalı'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenHeaderMenu(null);
                      setActiveLabTab('studio');
                      setShowChartsPanel((prev) => !prev);
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <BarChart3 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div>Performans Grafikleri</div>
                        <div className="text-[10px] font-normal text-slate-500">
                          D3 Radar &amp; Gelişim Çizgi Grafikleri
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        showChartsPanel ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    >
                      {showChartsPanel ? 'Açık' : 'Kapalı'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenHeaderMenu(null);
                      setActiveLabTab('studio');
                      setShowAiPanel((prev) => !prev);
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div>
                        <div>Performans Önerileri (AI)</div>
                        <div className="text-[10px] font-normal text-slate-500">
                          Yapay zeka gelişim ve antrenman analizi
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        showAiPanel ? 'text-indigo-600' : 'text-slate-400'
                      }`}
                    >
                      {showAiPanel ? 'Açık' : 'Kapalı'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Clean Single-Line Page Switcher (without duplicate mode tabs) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl overflow-x-auto scrollbar-none max-w-full">
            <button
              type="button"
              onClick={() => {
                setActiveLabTab('studio');
                setViewMode('all');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeLabTab === 'studio' && viewMode === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {totalReportPages} Sayfa Tam Görünüm
            </button>
            {showBodyMapInfographic && (
              <button
                type="button"
                onClick={() => {
                  setActiveLabTab('studio');
                  setViewMode('single');
                  setActivePage(0);
                }}
                title="Tam Sayfa Anatomik Vücut Haritası & Bölgesel Antropometri İnfografiği"
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  activeLabTab === 'studio' && viewMode === 'single' && activePage === 0
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                    : 'text-emerald-700 dark:text-emerald-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                1. Vücut Haritası
              </button>
            )}
            {PAGE_TITLES.map((p) => (
              <button
                key={p.page}
                type="button"
                onClick={() => {
                  setActiveLabTab('studio');
                  setViewMode('single');
                  setActivePage(p.page);
                }}
                title={p.full}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  activeLabTab === 'studio' && viewMode === 'single' && activePage === p.page
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {showBodyMapInfographic
                  ? `${p.page + 1}. ${p.short.replace(/^\d+\.\s*/, '')}`
                  : p.short}
              </button>
            ))}
          </div>
        </div>

        {/* COLLAPSIBLE DRAWER: Spor Okulu Adı, Logo & 4 Karne Şablonu Ayarları */}
        {showBrandingSettings && (
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="bg-slate-50/90 dark:bg-slate-800/50 rounded-xl border border-slate-200/90 dark:border-slate-700/80 p-3 sm:p-3.5 space-y-3.5">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3.5">
                {/* Left: School Logo Preview + Upload Controls */}
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    onClick={() => schoolLogoInputRef.current?.click()}
                    className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-sky-500 bg-white dark:bg-slate-900 p-1 flex items-center justify-center shrink-0 cursor-pointer transition-colors overflow-hidden group relative"
                    title="Spor Okulu Logosunu Yüklemek İçin Tıklayın"
                  >
                    {effectiveSchoolLogo ? (
                      <img
                        src={effectiveSchoolLogo}
                        alt={effectiveClubName}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-sky-600">
                        <ImagePlus className="w-4 h-4" />
                        <span className="text-[9px] font-bold mt-0.5">LOGO</span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                        Karne Tasarım Ayarları — Spor Okulu Adı, Logosu &amp; Şablonu
                      </span>
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                        · Tarayıcıda Kalıcı
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <button
                        type="button"
                        onClick={() => schoolLogoInputRef.current?.click()}
                        className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <ImagePlus className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {effectiveSchoolLogo ? 'Logoyu Değiştir' : 'Okul Logosu Yükle'}
                        </span>
                      </button>
                      {effectiveSchoolLogo && (
                        <button
                          type="button"
                          onClick={() => {
                            handleSchoolBrandingChange({ logoDataUrl: '' });
                            notify(
                              'Özel logo kaldırıldı, varsayılan spor okulu arması aktif edildi.'
                            );
                          }}
                          className="px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-800/60 bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <Trash2 className="w-3 h-3 shrink-0" />
                          <span>Logoyu Kaldır</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Sport School Name & Branch Inputs + Apply & Close Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5 flex-1 xl:max-w-2xl">
                  <div className="flex-1 min-w-0">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 truncate">
                      Spor Okulu / Kulüp Adı
                    </label>
                    <input
                      type="text"
                      value={schoolBranding.schoolName}
                      onChange={(e) =>
                        handleSchoolBrandingChange({ schoolName: e.target.value })
                      }
                      placeholder="Örn: ATAŞEHİR SPOR OKULLARI"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-extrabold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 truncate">
                      Şube / Kampüs
                    </label>
                    <input
                      type="text"
                      value={schoolBranding.branchName}
                      onChange={(e) =>
                        handleSchoolBrandingChange({ branchName: e.target.value })
                      }
                      placeholder="Örn: Ataşehir Merkez Kampüsü"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleApplyBrandingToAllReports}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                      title="Girilen spor okulu adını ve logosunu listedeki tüm sporcu karnelerine uygula"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Tümüne Uygula</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBrandingSettings(false)}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                      title="Paneli Kapat"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 3 Visual Report Card Template Selector Cards + B & C Customizations */}
              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                    A) 3 Modern ve Profesyonel PDF Karne Şablonu (Tam Sayfa A4 Mizanpaj)
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBodyMapInfographic((prev) => !prev);
                      notify(
                        !showBodyMapInfographic
                          ? 'B) Anatomik Vücut Haritası İnfografiği (Sayfa 1) aktif edildi.'
                          : 'B) Anatomik Vücut Haritası İnfografiği gizlendi.'
                      );
                    }}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      showBodyMapInfographic
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>
                      B) Anatomik Vücut Haritası İnfografiği: {showBodyMapInfographic ? 'Açık' : 'Kapalı'}
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {KARNE_TEMPLATES.map((tpl) => {
                    const isSelected = tpl.id === karneTemplate;
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => {
                          handleSelectKarneTemplate(tpl.id);
                          notify(`Karne şablonu "${tpl.name}" olarak seçildi.`);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-sky-600 bg-sky-50/70 dark:bg-sky-950/40 ring-2 ring-sky-500/30'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                              {tpl.shortName}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${tpl.badgeColor}`}>
                              {isSelected ? 'AKTİF ŞABLON' : 'SEÇ'}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                            {tpl.subtitle}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* C) Dynamic Club Color Palette Bar */}
                <div className="pt-2.5 border-t border-slate-200/70 dark:border-slate-700/70">
                  <div className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mb-2">
                    C) Dinamik Kulüp Renk Paleti (Başlık, Tablo, Mühür ve Vurgu Renklerini Kulübünüze Uyarlar)
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {CLUB_COLOR_PALETTES.map((pal) => {
                      const isSelected = pal.id === clubColorPalette;
                      const pHex =
                        pal.id === 'custom'
                          ? customPrimaryHex
                          : pal.id === 'template-default'
                            ? activeTemplate.defaultPrimaryHex
                            : pal.primaryHex;
                      const sHex =
                        pal.id === 'custom'
                          ? customSecondaryHex
                          : pal.id === 'template-default'
                            ? activeTemplate.defaultSecondaryHex
                            : pal.secondaryHex;

                      return (
                        <button
                          key={pal.id}
                          type="button"
                          onClick={() => {
                            handleSelectClubColorPalette(pal.id);
                            notify(`Kulüp renk paleti "${pal.name}" olarak seçildi.`);
                          }}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-slate-900 dark:border-white bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className="flex items-center -space-x-1">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-white inline-block"
                              style={{ backgroundColor: pHex }}
                            />
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-white inline-block"
                              style={{ backgroundColor: sHex }}
                            />
                          </span>
                          <span>{pal.shortName}</span>
                        </button>
                      );
                    })}

                    {clubColorPalette === 'custom' && (
                      <div className="flex items-center gap-2 pl-2 border-l border-slate-300 dark:border-slate-700">
                        <label className="flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                          <span>Ana:</span>
                          <input
                            type="color"
                            value={customPrimaryHex}
                            onChange={(e) => {
                              setCustomPrimaryHex(e.target.value);
                              try {
                                localStorage.setItem('sportsfly_lab_custom_primary_hex', e.target.value);
                              } catch {
                                // ignore
                              }
                            }}
                            className="w-6 h-6 rounded cursor-pointer border border-slate-300"
                          />
                        </label>
                        <label className="flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                          <span>Vurgu:</span>
                          <input
                            type="color"
                            value={customSecondaryHex}
                            onChange={(e) => {
                              setCustomSecondaryHex(e.target.value);
                              try {
                                localStorage.setItem('sportsfly_lab_custom_secondary_hex', e.target.value);
                              } catch {
                                // ignore
                              }
                            }}
                            className="w-6 h-6 rounded cursor-pointer border border-slate-300"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TOPLU KARNE OLUŞTURMA (EXCEL TOPLU SPORCU VERİSİ) TAB VIEW */}
      {activeLabTab === 'batch' && (
        <div className="bg-white dark:bg-[#111c2e] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs print:hidden space-y-5">
          {/* Batch Header & Quick Template Actions */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Toplu Karne Oluşturma — Excel&apos;den Çoklu Sporcu Karnesi Üretimi
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-extrabold bg-violet-100 dark:bg-violet-950/70 text-violet-800 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                    {batchReports.length} Sporcu Yüklü · {selectedBatchReports.length} Seçili
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Birden fazla sporcunun ölçüm verilerini içeren Excel (.xlsx / .xls / .csv) dosyasını yükleyerek her sporcu için 7 sayfalık kurumsal karneyi toplu olarak oluşturun, arşive kaydedin veya tek tıkla toplu A4 PDF olarak indirin.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Grouped Sample Data & Template Dropdown in Batch View */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setOpenHeaderMenu((prev) =>
                      prev === 'batchSamples' ? null : 'batchSamples'
                    )
                  }
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Şablon &amp; Örnek Veriler</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {openHeaderMenu === 'batchSamples' && (
                  <div className="absolute right-0 top-full mt-1.5 w-72 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl p-1.5 z-40 space-y-1">
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Excel Şablonu &amp; Test Verileri
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenHeaderMenu(null);
                        downloadBatchSportsFlyLabExcelTemplate(currentReport);
                      }}
                      className="w-full px-3 py-2 rounded-lg text-left text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div>Toplu Sporcu Excel Şablonu İndir</div>
                        <div className="text-[10px] font-normal text-slate-500">
                          Her satırda 1 sporcu yer alan örnek .xlsx
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOpenHeaderMenu(null);
                        handleLoadSampleBatchData();
                      }}
                      className="w-full px-3 py-2 rounded-lg text-left text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4 text-violet-600 shrink-0" />
                      <div>
                        <div>Örnek Sporcu Veri Seti Yükle (6 Sporcu)</div>
                        <div className="text-[10px] font-normal text-slate-500">
                          6 farklı branştan hazır örnek sporcu tablosu
                        </div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setActiveLabTab('studio')}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Tekil Karne Görünümü</span>
              </button>
            </div>
          </div>

          {/* Step 1: Drag & Drop Excel Uploader + Batch Group Naming & Archive Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Excel Dropzone (Left 5 Cols) */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingBatchExcel(true);
              }}
              onDragLeave={() => setIsDraggingBatchExcel(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingBatchExcel(false);
                const droppedFile = e.dataTransfer.files?.[0];
                if (droppedFile) {
                  void processUploadedExcelFile(droppedFile, true);
                }
              }}
              onClick={() => batchFileInputRef.current?.click()}
              className={`lg:col-span-5 rounded-2xl border-2 border-dashed p-4 sm:p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDraggingBatchExcel
                  ? 'border-violet-500 bg-violet-50/70 dark:bg-violet-950/40'
                  : 'border-slate-300 dark:border-slate-700 hover:border-violet-500 bg-slate-50/60 dark:bg-slate-800/40'
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-300 flex items-center justify-center mb-2.5">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                Toplu Sporcu Excel Dosyasını Buraya Sürükleyin veya Seçin
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                Her satırda bir sporcunun yer aldığı <strong className="text-slate-700 dark:text-slate-200">.xlsx, .xls veya .csv</strong> dosyasını yükleyin. Tüm sporcular otomatik hesaplanır.
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-2xs">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Excel Dosyası Seç (.xlsx / .csv)</span>
                </span>
              </div>
              {batchSourceFileName && (
                <div className="mt-2.5 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate max-w-xs">Aktif Veri: {batchSourceFileName}</span>
                </div>
              )}
            </div>

            {/* Batch Configuration & Archive Naming Settings (Right 7 Cols) */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/40 p-4 sm:p-5 flex flex-col justify-between space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-violet-600 shrink-0" />
                  <span>Toplu Karne Dönem Başlığı &amp; Otomatik Arşivleme Ayarları</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Kurumsal Başlık: <strong className="text-slate-900 dark:text-white">{effectiveClubName}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Toplu Karne Dönem / Grup Başlığı
                  </label>
                  <input
                    type="text"
                    value={batchGroupTitle}
                    onChange={(e) => setBatchGroupTitle(e.target.value)}
                    placeholder="Örn: 2026 Eylül Dönemi 3. Ölçüm Karnesi"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Toplu Dönem Notu / Açıklama
                  </label>
                  <input
                    type="text"
                    value={batchGroupNote}
                    onChange={(e) => setBatchGroupNote(e.target.value)}
                    placeholder="Örn: U12 Akademi Fiziksel Uygunluk ve PHV Taraması"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoArchiveOnBatchCreate}
                    onChange={(e) => setAutoArchiveOnBatchCreate(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                  />
                  <span>
                    Toplu karne oluşturulduğunda seçili sporcuları otomatik olarak{' '}
                    <strong className="text-amber-600 dark:text-amber-400">Karne Arşivi</strong>&apos;ne de isimle kaydet
                  </span>
                </label>

                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Arşiv Formatı: [Sporcu Adı] — {batchGroupTitle || 'Dönem Karnesi'}
                </span>
              </div>
            </div>
          </div>

          {/* Live Batch PDF Generation Progress Banner */}
          {isGeneratingBatchPDF && batchPdfStatusText && (
            <div className="p-4 rounded-2xl bg-slate-900 text-white border border-violet-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-violet-400 animate-spin shrink-0" />
                <div>
                  <div className="text-xs sm:text-sm font-extrabold">
                    Toplu A4 PDF Karneler Oluşturuluyor — Lütfen Bekleyin
                  </div>
                  <div className="text-xs text-violet-300 font-mono mt-0.5">
                    {batchPdfStatusText}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                7 Sayfa × {selectedBatchReports.length} Sporcu ({selectedBatchReports.length * 7} A4 Sayfası)
              </span>
            </div>
          )}

          {/* Step 2: Primary Batch Action Bar (Create All, Combined PDF, Separate PDFs) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 text-white flex flex-col xl:flex-row xl:items-center justify-between gap-3.5">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleToggleBatchSelectAll}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {selectedBatchIds.length === batchReports.length && batchReports.length > 0 ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span>
                  {selectedBatchIds.length === batchReports.length && batchReports.length > 0
                    ? 'Tüm Seçimi Kaldır'
                    : 'Tüm Sporcuları Seç'}
                </span>
              </button>

              <div className="text-xs">
                <span className="text-slate-400">Seçili Sporcu: </span>
                <strong className="text-white font-mono">
                  {selectedBatchReports.length} / {batchReports.length} Sporcu
                </strong>
                <span className="text-slate-400 ml-2 hidden sm:inline">
                  (Toplam {selectedBatchReports.length * 7} A4 Karne Sayfası)
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCreateAndArchiveSelectedBatch}
                disabled={selectedBatchReports.length === 0 || isGeneratingBatchPDF}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                title="Seçili sporcuların 7 sayfalık karnelerini oluştur, aktif sporcu listesine ve Karne Arşivi'ne toplu kaydet"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Seçili Karneleri Toplu Oluştur &amp; Kaydet ({selectedBatchReports.length} Sporcu)
                </span>
              </button>

              <button
                type="button"
                onClick={() => void handleExportBatchPDF('combined')}
                disabled={selectedBatchReports.length === 0 || isGeneratingBatchPDF}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                title="Seçili tüm sporcuların 7'şer sayfalık karnelerini tek bir birleşik A4 PDF dosyası olarak indir"
              >
                <Files className="w-4 h-4 shrink-0" />
                <span>
                  Tek Birleşik PDF İndir ({selectedBatchReports.length * 7} Sayfa)
                </span>
              </button>

              <button
                type="button"
                onClick={() => void handleExportBatchPDF('separate')}
                disabled={selectedBatchReports.length === 0 || isGeneratingBatchPDF}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                title="Her sporcu için ayrı birer A4 PDF karne dosyası indir"
              >
                <FileDown className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Ayrı Ayrı PDF İndir ({selectedBatchReports.length} Dosya)</span>
              </button>
            </div>
          </div>

          {/* Search Filter for Batch Table */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={batchSearchQuery}
                onChange={(e) => setBatchSearchQuery(e.target.value)}
                placeholder="Tablodaki sporcu adı, branş veya sporcu kodu içinde ara..."
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {batchSearchQuery && (
                <button
                  type="button"
                  onClick={() => setBatchSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Tablodaki herhangi bir sporcunun <strong>&ldquo;Karneyi Aç&rdquo;</strong> veya <strong>&ldquo;PDF Önizle&rdquo;</strong> butonuna tıklayarak 7 sayfalık karnesini anında inceleyebilirsiniz.
            </div>
          </div>

          {/* Step 3: Multi-Athlete Batch Preview & Control Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700/80">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        batchReports.length > 0 &&
                        selectedBatchIds.length === batchReports.length
                      }
                      onChange={handleToggleBatchSelectAll}
                      className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3 font-extrabold">Sporcu Adı &amp; Kodu</th>
                  <th className="py-3 px-3 font-extrabold">Branş / Yaş / Cinsiyet</th>
                  <th className="py-3 px-3 font-extrabold text-center">Boy / Kilo / BKİ</th>
                  <th className="py-3 px-3 font-extrabold text-center">20m Sürat / Sıçrama</th>
                  <th className="py-3 px-3 font-extrabold text-center">VO2peak / Somatotip</th>
                  <th className="py-3 px-3 font-extrabold text-center">PHV / 18 Yaş Boy</th>
                  <th className="py-3 px-3 font-extrabold text-center">Performans Puanı</th>
                  <th className="py-3 px-3 font-extrabold text-right">Bireysel Karne İşlemleri</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
                {filteredBatchReports.map((rep) => {
                  const isSelected = selectedBatchIds.includes(rep.id);
                  const heightM3 =
                    rep.bodyComposition.find((x) => x.id === 'height')?.m3 ?? 149.5;
                  const weightM3 =
                    rep.bodyComposition.find((x) => x.id === 'weight')?.m3 ?? 43.2;
                  const bmiM3 =
                    rep.bodyComposition.find((x) => x.id === 'bmi')?.m3 ?? 19.3;
                  const sprintM3 =
                    rep.motorPerformance.find((x) => x.id === 'sprint')?.m3 ?? 3.85;
                  const vjM3 =
                    rep.motorPerformance.find((x) => x.id === 'vertical_jump')?.m3 ?? 29.0;

                  return (
                    <tr
                      key={rep.id}
                      className={`transition-colors ${
                        isSelected
                          ? 'bg-violet-50/40 dark:bg-violet-950/20 hover:bg-violet-50/80 dark:hover:bg-violet-950/30'
                          : 'bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleBatchRow(rep.id)}
                          className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-black text-[11px] flex items-center justify-center shrink-0">
                            {rep.athleteName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white">
                              {rep.athleteName}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                              {rep.athleteCode} · {rep.date3}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {rep.sportBranch}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {rep.ageYears} Yaş ({rep.gender}) · {effectiveClubName}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {heightM3} cm / {weightM3} kg
                        </div>
                        <div className="text-[10px] text-slate-500">BKİ: {bmiM3} kg/m²</div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {sprintM3} sn
                        </div>
                        <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                          Dikey Sıçrama: {vjM3} cm
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono">
                        <div className="font-bold text-emerald-700 dark:text-emerald-400">
                          {rep.cardio.test3Vo2} ml/kg/dk
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {rep.somatotype.m3.endo}-{rep.somatotype.m3.meso}-{rep.somatotype.m3.ecto}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono">
                        <div className="font-bold text-indigo-700 dark:text-indigo-400">
                          {rep.predictedAdultHeight} cm
                        </div>
                        <div className="text-[10px] text-slate-500">PHV: {rep.phvAge} Yaş</div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-black">
                          %{rep.scoreHistory.p3Score}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          I: %{rep.scoreHistory.p1Score} → III: %{rep.scoreHistory.p3Score}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenBatchReport(rep, 'view')}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                            title="Bu sporcunun 7 sayfalık karnesini aç ve incele"
                          >
                            <FolderOpen className="w-3 h-3 shrink-0" />
                            <span>Karneyi Aç</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenBatchReport(rep, 'pdf-preview')}
                            className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                            title="A4 PDF Önizle"
                          >
                            <Eye className="w-3 h-3 text-blue-600 shrink-0" />
                            <span>PDF</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenSaveArchiveModal(rep)}
                            className="p-1.5 rounded-lg border border-amber-200 dark:border-amber-800/60 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 transition-colors cursor-pointer"
                            title="Bu sporcuyu özel isimle Karne Arşivi'ne kaydet"
                          >
                            <BookmarkPlus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveFromBatch(rep.id)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Toplu listeden çıkar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KARNE ARŞİVİ TAB VIEW */}
      {activeLabTab === 'archive' && (
        <div className="bg-white dark:bg-[#111c2e] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs print:hidden space-y-5">
          {/* Archive Header & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                <Archive className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Karne Arşivi — Kayıtlı Sporcu Performans Karneleri
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-extrabold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    {archivedReports.length} Kayıtlı Karne
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Belirli bir isimle kaydettiğiniz 7 sayfalık sporcu karnelerini dilediğiniz zaman tekrar açıp inceleyebilir, karşılaştırabilir veya A4 PDF olarak indirebilirsiniz.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenSaveArchiveModal(currentReport)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <BookmarkPlus className="w-4 h-4 shrink-0" />
                <span>Aktif Karneyi ({currentReport.athleteName}) İsimle Kaydet</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveLabTab('studio')}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Aktif Karneye Dön</span>
              </button>
            </div>
          </div>

          {/* Search & Sort Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={archiveSearchQuery}
                onChange={(e) => setArchiveSearchQuery(e.target.value)}
                placeholder="Kaydedilen karne adı, sporcu adı, branş veya tarih ara..."
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {archiveSearchQuery && (
                <button
                  type="button"
                  onClick={() => setArchiveSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                Sıralama:
              </span>
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {[
                  { id: 'newest', label: 'En Yeni Kayıt' },
                  { id: 'score', label: 'En Yüksek Puan' },
                  { id: 'name', label: 'Karne İsmi (A-Z)' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setArchiveSortBy(opt.id as 'newest' | 'score' | 'name')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      archiveSortBy === opt.id
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Archive Cards Grid */}
          {filteredArchivedReports.length === 0 ? (
            <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
                <Archive className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Arşivde Eşleşen Karne Bulunamadı
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                Üstteki &ldquo;Arşive İsimle Kaydet&rdquo; butonunu kullanarak oluşturduğunuz sporcu karnelerini özel bir isimle arşive ekleyebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArchivedReports.map((item) => {
                const rep = item.reportSnapshot;
                const isCurrentlyLoaded = rep.id === currentReport.id;
                const heightVal =
                  rep.bodyComposition.find((x) => x.id === 'height')?.m3 || 149.5;
                const weightVal =
                  rep.bodyComposition.find((x) => x.id === 'weight')?.m3 || 43.2;

                return (
                  <div
                    key={item.archiveId}
                    className={`rounded-2xl border p-4 sm:p-5 transition-all flex flex-col justify-between bg-white dark:bg-slate-800/40 ${
                      isCurrentlyLoaded
                        ? 'border-amber-400 dark:border-amber-500/80 ring-1 ring-amber-400/30 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs'
                    }`}
                  >
                    <div>
                      {/* Card Top: Saved Custom Name + Date + Edit/Delete */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">
                              <Calendar className="w-3 h-3 text-amber-600 shrink-0" />
                              <span>Kayıt: {item.savedAt}</span>
                            </span>
                            {isCurrentlyLoaded && (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                                Şu An Açık
                              </span>
                            )}
                          </div>

                          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                            {item.archiveTitle}
                          </h3>

                          {item.archiveNote && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {item.archiveNote}
                            </p>
                          )}
                        </div>

                        {/* Rename & Delete Buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingArchiveItem(item);
                              setEditArchiveTitleInput(item.archiveTitle);
                              setEditArchiveNoteInput(item.archiveNote || '');
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Kaydedilen Karne İsmini Düzenle"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteArchiveItem(item)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Arşivden Kaldır"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Athlete & School Info Strip */}
                      <div className="mt-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/70 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0">
                            {rep.athleteName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                              {rep.athleteName}{' '}
                              <span className="font-normal text-slate-500">
                                ({rep.ageYears} Yaş · {rep.gender})
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {rep.sportBranch} · {effectiveClubName}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">
                            Genel Puan
                          </div>
                          <div className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                            %{rep.scoreHistory.p3Score}
                          </div>
                        </div>
                      </div>

                      {/* Key Metrics Snapshot Grid */}
                      <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                        <div className="p-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/60">
                          <div className="text-[9px] font-bold text-slate-400 uppercase">
                            Boy / Kilo
                          </div>
                          <div className="text-[11px] font-bold font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                            {heightVal}cm / {weightVal}kg
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/60">
                          <div className="text-[9px] font-bold text-slate-400 uppercase">
                            18 Yaş Boy
                          </div>
                          <div className="text-[11px] font-bold font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                            {rep.predictedAdultHeight} cm
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/60">
                          <div className="text-[9px] font-bold text-slate-400 uppercase">
                            VO2peak
                          </div>
                          <div className="text-[11px] font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                            {rep.cardio.test3Vo2}
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/60">
                          <div className="text-[9px] font-bold text-slate-400 uppercase">
                            Ölçüm Tarihi
                          </div>
                          <div className="text-[11px] font-bold font-mono text-slate-700 dark:text-slate-300 mt-0.5">
                            {rep.date3}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/70 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenArchivedReport(item, 'view')}
                        className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <FolderOpen className="w-3.5 h-3.5 shrink-0" />
                        <span>Karneyi Aç &amp; Görüntüle</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenArchivedReport(item, 'pdf-preview')}
                        className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        title="Bu karneyi A4 PDF önizleme modunda aç"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>PDF Önizle</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenArchivedReport(item, 'download-pdf')}
                        className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        title="7 sayfalık karneyi doğrudan A4 PDF olarak indir"
                      >
                        <FileDown className="w-3.5 h-3.5 shrink-0" />
                        <span>PDF İndir</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* D3 Radar & Line Performance Charts Panel */}
      {activeLabTab === 'studio' && showChartsPanel && (
        <div className="print:hidden">
          <SportsFlyLabPerformanceCharts report={currentReport} />
        </div>
      )}

      {/* AI-Powered Performance Recommendations & Improvement Areas Section */}
      {activeLabTab === 'studio' && showAiPanel && (
        <div className="bg-white dark:bg-[#111c2e] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs print:hidden">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Performans Önerileri — Yapay Zeka Metrik &amp; Gelişim Analizi
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    · {currentReport.athleteName} ({currentReport.ageYears} Yaş · {currentReport.sportBranch})
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Yüklenen Excel verilerindeki 3 dönemlik ölçüm metrikleri, Z-skor (SD) sapmaları ve PHV büyüme hızı otomatik analiz edilerek gelişime açık yönler belirlenmiştir.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleRunAiAnalysis(currentReport)}
                disabled={isAnalyzingAI}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:opacity-60"
                title="Gemini AI ile tüm ölçüm metriklerini yeniden analiz et"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzingAI ? 'animate-spin' : ''}`} />
                <span>{isAnalyzingAI ? 'AI Metrikleri Analiz Ediyor...' : 'Yapay Zeka ile Analizi Yenile'}</span>
              </button>

              <button
                type="button"
                onClick={handleApplyAiToExpertComment}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Yapay zeka özetini ve önerilerini 5. sayfadaki Uzman Görüşü alanına uygula"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Karne Uzman Görüşüne Aktar</span>
              </button>
            </div>
          </div>

          {aiError && (
            <div className="mt-3 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between">
              <span>
                Not: Sunucu AI bağlantısı kurulamadı ({aiError}). Veriler yerel normatif biyomekanik motoru ile analiz edildi.
              </span>
              <button
                type="button"
                onClick={() => setAiError(null)}
                className="text-amber-600 hover:text-amber-900 font-bold ml-2"
              >
                Kapat
              </button>
            </div>
          )}

          {/* Executive Summary & Readiness Strip */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-9 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700/70">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-extrabold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                  Genel Performans Sentezi &amp; Gelişim Yönü
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Son Analiz: {activeAiAnalysis.generatedAt}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                {activeAiAnalysis.overallSummary}
              </p>
              <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white">Beslenme, Somatotip &amp; Toparlanma Önerisi: </strong>
                {activeAiAnalysis.nutritionAndRecoveryTip}
              </div>
            </div>

            <div className="lg:col-span-3 bg-slate-900 text-white rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Atletik Hazırlık &amp; Gelişim Endeksi
                </div>
                <div className="text-3xl font-black font-mono text-emerald-400 mt-1">
                  %{activeAiAnalysis.readinessScore}
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  I. Ölçüm (%{currentReport.scoreHistory.p1Score}) → III. Ölçüm (%{currentReport.scoreHistory.p3Score})
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-700 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Gelişime Açık Alan:</span>
                <span className="font-mono font-bold text-amber-400">
                  {activeAiAnalysis.improvementAreas.length} Kritik Metrik
                </span>
              </div>
            </div>
          </div>

          {/* Main Grid: Improvement Areas (Left 7 cols) + Strengths & 8-Week Microcycle (Right 5 cols) */}
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left 7 Cols: Gelişime Açık Yönler & Spesifik Drill Reçetesi */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Gelişime Açık Yönler &amp; Bireysel Antrenman Reçetesi</span>
                </h3>
                <span className="text-[11px] text-slate-500">
                  Excel verilerinden otomatik tespit edilen öncelikli gelişim alanları
                </span>
              </div>

              <div className="space-y-2.5">
                {activeAiAnalysis.improvementAreas.map((item, idx) => {
                  const isHighPriority = item.priority.toLowerCase().includes('yüksek');
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/40 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                            {item.metricName}
                          </span>
                          <span className="text-[11px] text-slate-400">·</span>
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            {item.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-mono">
                          <span className="text-slate-600 dark:text-slate-300">
                            Mevcut: <strong className="text-slate-900 dark:text-white">{item.currentValue}</strong>
                          </span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                            Hedef: {item.targetValue}
                          </span>
                          <span
                            className={`font-sans text-[11px] font-bold ${
                              isHighPriority ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {item.priority}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                        {item.analysis}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                        <div className="text-slate-700 dark:text-slate-200">
                          <strong className="text-indigo-700 dark:text-indigo-400">Önerilen Drill: </strong>
                          {item.drillRecommendation}
                        </div>
                        <div className="font-mono font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                          {item.weeklyFrequency}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 5 Cols: Güçlü Yönler & 8 Haftalık Mikro-Döngü Planı */}
            <div className="lg:col-span-5 space-y-4">
              {/* Strengths */}
              <div className="border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 bg-slate-50/60 dark:bg-slate-800/30">
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Öne Çıkan Güçlü Parametreler (Avantajlar)</span>
                </h3>
                <div className="space-y-2">
                  {activeAiAnalysis.strengths.map((st, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 dark:text-white">{st.metricName}</span>
                        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {st.currentValue} · %{st.percentile} Yüzdelik
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                        {st.insight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8-Week Microcycle Prescription */}
              <div className="border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 bg-slate-50/60 dark:bg-slate-800/30">
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  <span>8 Haftalık Antrenman &amp; PHV Yüklenme Planı</span>
                </h3>
                <div className="space-y-2.5">
                  {activeAiAnalysis.trainingPrescription.map((block, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 text-xs"
                    >
                      <div className="font-bold text-indigo-700 dark:text-indigo-400">{block.focusArea}</div>
                      <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        Hedef: {block.microcycleGoal}
                      </div>
                      <ul className="mt-1 space-y-0.5 text-[11px] text-slate-600 dark:text-slate-300">
                        {block.recommendedDrills.map((d, dIdx) => (
                          <li key={dIdx}>· {d}</li>
                        ))}
                      </ul>
                      <div className="mt-1.5 pt-1 border-t border-slate-100 dark:border-slate-700 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        Yüklenme: {block.loadNote}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive A4 PDF Document Preview Bar (Shown when 'PDF Olarak Görüntüle' is active) */}
      {isPdfPreviewMode && (
        <div className="bg-slate-900 text-white rounded-2xl p-3.5 sm:px-5 border border-slate-700 flex flex-wrap items-center justify-between gap-3 shadow-lg print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold tracking-tight flex items-center gap-2">
                <span>A4 PDF Önizleme Modu — {currentReport.athleteName}</span>
                <span className="text-[11px] font-mono font-normal text-slate-300">
                  (210 × 297 mm · 7 Sayfa · Baskıya Hazır)
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Karnenin A4 yazdırma stillerini inceleyebilir, doğrudan yazıcıdan çıktı alabilir veya PDF olarak kaydedebilirsiniz.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
              {[85, 100, 110].map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => setPdfZoom(z)}
                  className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-colors cursor-pointer ${
                    pdfZoom === z ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  %{z}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handlePrintA4}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>A4 Yazdır / PDF Çıktısı Al</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-blue-600" />
              <span>
                {isGeneratingPDF
                  ? `İndiriliyor (${pdfProgressPage || 1}/7)...`
                  : 'Tüm Karneyi İndir'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsPdfPreviewMode(false)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Kapat</span>
            </button>
          </div>
        </div>
      )}

      {/* Report Card Pages Container (Wrapped with #sportsfly-lab-print-area for @media print A4 output) */}
      <div
        className={`${
          (activeLabTab === 'archive' || activeLabTab === 'batch') && !isGeneratingBatchPDF
            ? 'hidden print:block'
            : ''
        } ${
          isPdfPreviewMode
            ? 'bg-slate-800/95 p-4 sm:p-8 rounded-2xl border border-slate-700 shadow-2xl overflow-x-auto print:bg-white print:p-0 print:border-0 print:shadow-none'
            : ''
        }`}
      >
        <div
          id="sportsfly-lab-print-area"
          className={`mx-auto space-y-6 pb-8 print:space-y-0 print:pb-0 ${
            isPdfPreviewMode ? 'max-w-[210mm]' : 'max-w-5xl'
          }`}
          style={
            isPdfPreviewMode && pdfZoom !== 100
              ? { zoom: `${pdfZoom}%` }
              : undefined
          }
        >
          {showBodyMapInfographic && (
            <div className={`karne-page-wrapper ${viewMode === 'all' || activePage === 0 || isPdfPreviewMode ? 'block' : 'hidden print:block'}`}>
              {renderAnatomicalBodyMapPage()}
            </div>
          )}
          <div className={`karne-page-wrapper ${viewMode === 'all' || activePage === 1 || isPdfPreviewMode ? 'block' : 'hidden print:block'}`}>
            {renderPage1()}
          </div>
          <div className={`karne-page-wrapper ${viewMode === 'all' || activePage === 2 || isPdfPreviewMode ? 'block' : 'hidden print:block'}`}>
            {renderPage2()}
          </div>
          <div className={`karne-page-wrapper ${viewMode === 'all' || activePage === 3 || isPdfPreviewMode ? 'block' : 'hidden print:block'}`}>
            {renderPage3()}
          </div>
          <div className={`karne-page-wrapper ${viewMode === 'all' || activePage === 4 || isPdfPreviewMode ? 'block' : 'hidden print:block'}`}>
            {renderPage4()}
          </div>
          <div className={`karne-page-wrapper ${viewMode === 'all' || activePage === 5 || isPdfPreviewMode ? 'block' : 'hidden print:block'}`}>
            {renderPage5()}
          </div>
          <div className={`karne-page-wrapper ${viewMode === 'all' || activePage === 6 || isPdfPreviewMode ? 'block' : 'hidden print:block'}`}>
            {renderPage6()}
          </div>
          <div className={`karne-page-wrapper ${viewMode === 'all' || activePage === 7 || isPdfPreviewMode ? 'block' : 'hidden print:block'}`}>
            {renderPage7()}
          </div>
        </div>
      </div>

      {/* Save Report Card to Archive with Custom Name Modal */}
      {showSaveArchiveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111c2e] w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                  <BookmarkPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    Karneyi İsimlendir &amp; Arşive Kaydet
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Bu karneye özel bir isim vererek Karne Arşivi sekmesine kaydedin.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSaveArchiveModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSaveToArchive} className="p-5 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white">
                    {currentReport.athleteName} ({currentReport.ageYears} Yaş)
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {currentReport.sportBranch} · {effectiveClubName}
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-[10px] text-slate-400 uppercase">3. Ölçüm Puanı</div>
                  <div className="text-sm font-black text-emerald-600">
                    %{currentReport.scoreHistory.p3Score}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kayıtlı Karne İsmi (Arşiv Başlığı) *
                </label>
                <input
                  type="text"
                  required
                  value={archiveTitleInput}
                  onChange={(e) => setArchiveTitleInput(e.target.value)}
                  placeholder="Örn: Ege Örnektir - 2026 Yaz Dönemi 3. Ölçüm Karnesi"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Dönem Notu / Açıklama (İsteğe Bağlı)
                </label>
                <input
                  type="text"
                  value={archiveNoteInput}
                  onChange={(e) => setArchiveNoteInput(e.target.value)}
                  placeholder="Örn: Sezon öncesi fiziksel uygunluk ve PHV değerlendirmesi"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSaveArchiveModal(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>Karne Arşivine Kaydet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rename Archived Report Card Modal */}
      {editingArchiveItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111c2e] w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Arşivdeki Karne İsmini Düzenle
              </h3>
              <button
                type="button"
                onClick={() => setEditingArchiveItem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRenameArchiveSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Karne İsmi *
                </label>
                <input
                  type="text"
                  required
                  value={editArchiveTitleInput}
                  onChange={(e) => setEditArchiveTitleInput(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Dönem Notu / Açıklama
                </label>
                <input
                  type="text"
                  value={editArchiveNoteInput}
                  onChange={(e) => setEditArchiveNoteInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingArchiveItem(null)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-sky-600 text-white font-bold cursor-pointer"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Report Card Modal (Automatically applies localStorage school branding) */}
      {showNewReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111c2e] w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Yeni Sporcu Karnesi Oluştur (7 Sayfa)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Kaydedilen karne tasarım ayarlarınız (okul adı ve logo) yeni karneye otomatik uygulanır.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewReportModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewReport} className="p-5 space-y-4 text-xs">
              {/* Automatic Branding Preview Banner */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                  {effectiveSchoolLogo ? (
                    <img
                      src={effectiveSchoolLogo}
                      alt={effectiveClubName}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Building2 className="w-5 h-5 text-sky-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Otomatik Uygulanacak Kurumsal Başlık
                    </span>
                  </div>
                  <div className="font-extrabold text-slate-900 dark:text-white truncate">
                    {effectiveClubName}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {effectiveBranchName}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sporcu Adı Soyadı *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAthleteForm.athleteName}
                    onChange={(e) =>
                      setNewAthleteForm({ ...newAthleteForm, athleteName: e.target.value })
                    }
                    placeholder="Örn: Kerem Aktürkoğlu"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Branş / Grup
                  </label>
                  <input
                    type="text"
                    value={newAthleteForm.sportBranch}
                    onChange={(e) =>
                      setNewAthleteForm({ ...newAthleteForm, sportBranch: e.target.value })
                    }
                    placeholder="Örn: Futbol / U12 Gelişim"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Cinsiyet
                    </label>
                    <select
                      value={newAthleteForm.gender}
                      onChange={(e) =>
                        setNewAthleteForm({
                          ...newAthleteForm,
                          gender: e.target.value as 'Erkek' | 'Kadın',
                        })
                      }
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                    >
                      <option value="Erkek">Erkek</option>
                      <option value="Kadın">Kadın</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Yaş
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newAthleteForm.ageYears}
                      onChange={(e) =>
                        setNewAthleteForm({
                          ...newAthleteForm,
                          ageYears: parseFloat(e.target.value) || 10,
                        })
                      }
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewReportModal(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Karneyi Oluştur</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Data Editor Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111c2e] w-full max-w-3xl max-h-[88vh] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  SportsFly Lab Karne Verilerini Düzenle — {currentReport.athleteName}
                </h3>
                <p className="text-xs text-slate-500">
                  Değişiklikler anında 7 sayfalık karneye yansır. Toplu veri için Excel şablonunu da kullanabilirsiniz.
                </p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5 text-xs">
              {/* General Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Sporcu Adı Soyadı</label>
                  <input
                    type="text"
                    value={currentReport.athleteName}
                    onChange={(e) =>
                      handleUpdateCurrentReport({ ...currentReport, athleteName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Spor Okulu / Kulüp Adı</label>
                  <input
                    type="text"
                    value={schoolBranding.schoolName}
                    onChange={(e) => handleSchoolBrandingChange({ schoolName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Şube &amp; Yaş</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={schoolBranding.branchName}
                      onChange={(e) => handleSchoolBrandingChange({ branchName: e.target.value })}
                      className="w-1/2 px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={currentReport.ageYears}
                      onChange={(e) =>
                        handleUpdateCurrentReport({
                          ...currentReport,
                          ageYears: parseFloat(e.target.value) || 10,
                        })
                      }
                      className="w-1/2 px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* PHV & Overall Score Quick Inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">PHV Yaşı</label>
                  <input
                    type="number"
                    step="0.1"
                    value={currentReport.phvAge}
                    onChange={(e) =>
                      handleUpdateCurrentReport({
                        ...currentReport,
                        phvAge: parseFloat(e.target.value) || 12.8,
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">PHV Boy (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={currentReport.phvHeight}
                    onChange={(e) =>
                      handleUpdateCurrentReport({
                        ...currentReport,
                        phvHeight: parseFloat(e.target.value) || 165.8,
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">18 Yaş Tahmini Boy</label>
                  <input
                    type="number"
                    step="0.1"
                    value={currentReport.predictedAdultHeight}
                    onChange={(e) =>
                      handleUpdateCurrentReport({
                        ...currentReport,
                        predictedAdultHeight: parseFloat(e.target.value) || 172.7,
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">3. Test Genel Puan (%)</label>
                  <input
                    type="number"
                    value={currentReport.scoreHistory.p3Score}
                    onChange={(e) =>
                      handleUpdateCurrentReport({
                        ...currentReport,
                        scoreHistory: {
                          ...currentReport.scoreHistory,
                          p3Score: parseInt(e.target.value, 10) || 75,
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-slate-900"
                  />
                </div>
              </div>

              {/* Expert Comment */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Uzman Değerlendirmesi ve Antrenör Notu
                </label>
                <textarea
                  rows={3}
                  value={currentReport.expertComment}
                  onChange={(e) =>
                    handleUpdateCurrentReport({ ...currentReport, expertComment: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  notify('Karne verileri güncellendi.');
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
              >
                Tamam &amp; Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
