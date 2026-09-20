import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  User,
  Users,
  CheckCircle2,
  XCircle,
  X,
  FileSpreadsheet,
  FileText,
  Filter,
  Layers,
} from 'lucide-react';
import { SportsFlyIcon } from '../SportsFlyLogo';
import { INITIAL_ANTRENMANLAR } from '../../data/mockAntrenmanlar';
import { AntrenmanItem, AntrenmanAttendee } from '../../types';

type CalendarViewMode = 'ay' | 'hafta' | 'gun';

export const AntrenmanTakvimiView: React.FC = () => {
  // State
  const [antrenmanlar, setAntrenmanlar] = useState<AntrenmanItem[]>(INITIAL_ANTRENMANLAR);
  const [viewMode, setViewMode] = useState<CalendarViewMode>('ay');

  // Currently focused date: 2026-09-11 (matching screenshot and environment local time)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8); // 0-indexed: 8 is September (Eylül)
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-11');
  const [branchFilter, setBranchFilter] = useState<string>('Tümü');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<AntrenmanItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formBranch, setFormBranch] = useState('Basketbol');
  const [formDate, setFormDate] = useState('2026-09-11');
  const [formStartTime, setFormStartTime] = useState('14:00');
  const [formEndTime, setFormEndTime] = useState('15:30');
  const [formTrainer, setFormTrainer] = useState('Can Aksoy');
  const [formFacility, setFormFacility] = useState('Saraçgym Nilüfer - A Salonu');
  const [formCapacity, setFormCapacity] = useState(16);
  const [formColor, setFormColor] = useState<'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'sky'>('blue');
  const [formNotes, setFormNotes] = useState('');

  // New Attendee in modal
  const [newAttendeeName, setNewAttendeeName] = useState('');
  const [newAttendeePhone, setNewAttendeePhone] = useState('');

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const currentMonthName = monthNames[currentMonth];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Navigate Date
  const handlePrev = () => {
    if (viewMode === 'ay') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((prev) => prev - 1);
      } else {
        setCurrentMonth((prev) => prev - 1);
      }
    } else if (viewMode === 'gun') {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() - 1);
      const iso = d.toISOString().split('T')[0];
      setSelectedDate(iso);
      setCurrentMonth(d.getMonth());
      setCurrentYear(d.getFullYear());
    } else {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() - 7);
      const iso = d.toISOString().split('T')[0];
      setSelectedDate(iso);
      setCurrentMonth(d.getMonth());
      setCurrentYear(d.getFullYear());
    }
  };

  const handleNext = () => {
    if (viewMode === 'ay') {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear((prev) => prev + 1);
      } else {
        setCurrentMonth((prev) => prev + 1);
      }
    } else if (viewMode === 'gun') {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + 1);
      const iso = d.toISOString().split('T')[0];
      setSelectedDate(iso);
      setCurrentMonth(d.getMonth());
      setCurrentYear(d.getFullYear());
    } else {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + 7);
      const iso = d.toISOString().split('T')[0];
      setSelectedDate(iso);
      setCurrentMonth(d.getMonth());
      setCurrentYear(d.getFullYear());
    }
  };

  const handleToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(8); // September
    setSelectedDate('2026-09-11');
  };

  // Add Antrenman
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newAntrenman: AntrenmanItem = {
      id: `ant-${Date.now()}`,
      title: formTitle,
      branch: formBranch,
      date: formDate,
      startTime: formStartTime,
      endTime: formEndTime,
      trainerName: formTrainer,
      facilityName: formFacility,
      capacity: Number(formCapacity) || 15,
      enrolledCount: 1,
      status: 'Planlandı',
      color: formColor,
      notes: formNotes,
      attendees: [
        { id: `att-${Date.now()}`, name: 'Kayıtlı Sporcu (Örnek)', present: false }
      ],
    };

    setAntrenmanlar((prev) => [newAntrenman, ...prev]);
    setShowAddModal(false);
    triggerToast('Yeni antrenman başarıyla takvime eklendi!');
    // Reset
    setFormTitle('');
    setFormNotes('');
  };

  // Toggle Attendance
  const handleToggleAttendance = (sessionId: string, attendeeId: string) => {
    setAntrenmanlar((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) return session;
        const updatedAttendees = session.attendees.map((att) =>
          att.id === attendeeId ? { ...att, present: !att.present } : att
        );
        return { ...session, attendees: updatedAttendees };
      })
    );

    if (selectedSession && selectedSession.id === sessionId) {
      setSelectedSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          attendees: prev.attendees.map((att) =>
            att.id === attendeeId ? { ...att, present: !att.present } : att
          ),
        };
      });
    }
  };

  // Add attendee to session
  const handleAddAttendee = (sessionId: string) => {
    if (!newAttendeeName.trim()) return;
    const newAtt: AntrenmanAttendee = {
      id: `att-${Date.now()}`,
      name: newAttendeeName,
      phone: newAttendeePhone || undefined,
      present: true,
    };

    setAntrenmanlar((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        return {
          ...s,
          enrolledCount: s.enrolledCount + 1,
          attendees: [...s.attendees, newAtt],
        };
      })
    );

    if (selectedSession && selectedSession.id === sessionId) {
      setSelectedSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          enrolledCount: prev.enrolledCount + 1,
          attendees: [...prev.attendees, newAtt],
        };
      });
    }

    setNewAttendeeName('');
    setNewAttendeePhone('');
    triggerToast('Sporcu yoklama listesine eklendi!');
  };

  // Delete session
  const handleDeleteSession = (sessionId: string) => {
    setAntrenmanlar((prev) => prev.filter((s) => s.id !== sessionId));
    setSelectedSession(null);
    triggerToast('Antrenman takvimden kaldırıldı.');
  };

  // Color helper for badges
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/80';
      case 'sky':
        return 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100/80';
      case 'emerald':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/80';
      case 'purple':
        return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100/80';
      case 'amber':
        return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/80';
      case 'rose':
        return 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/80';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100/80';
    }
  };

  // -------------------------------------------------------------
  // Left Column: Mini Calendar Calculation (Monday-first: PZT - PZR)
  // Matching screenshot:
  // PZT SAL ÇAR PER CUM CMR PZR
  // 31, 1, 2, 3, 4, 5, 6
  // 7, 8, 9, 10, 11, 12, 13 ...
  // -------------------------------------------------------------
  const renderMiniCalendarGrid = () => {
    // For currentYear and currentMonth
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();

    // In JS, getDay(): 0 is Sunday, 1 is Monday... 6 is Saturday.
    // Monday first index: (day + 6) % 7
    const firstDayMonIndex = (firstDay.getDay() + 6) % 7;

    // Previous month days
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();

    const cells: {
      dayNumber: number;
      dateStr: string;
      isCurrentMonth: boolean;
      isToday: boolean;
      isSelected: boolean;
      hasEvents: boolean;
    }[] = [];

    // Fill previous month days
    for (let i = firstDayMonIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const prevM = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevY = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      cells.push({
        dayNumber: dayNum,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === '2026-09-11',
        isSelected: dateStr === selectedDate,
        hasEvents: antrenmanlar.some((a) => a.date === dateStr),
      });
    }

    // Fill current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: true,
        isToday: dateStr === '2026-09-11',
        isSelected: dateStr === selectedDate,
        hasEvents: antrenmanlar.some((a) => a.date === dateStr),
      });
    }

    // Fill next month days up to 42 cells (6 rows * 7)
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      const nextM = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextY = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      cells.push({
        dayNumber: i,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === '2026-09-11',
        isSelected: dateStr === selectedDate,
        hasEvents: antrenmanlar.some((a) => a.date === dateStr),
      });
    }

    return cells;
  };

  const miniCalendarCells = renderMiniCalendarGrid();

  // -------------------------------------------------------------
  // Right Column: Main Calendar Calculation (Sunday-first: Paz - Cmt)
  // Matching screenshot header:
  // Paz | Pzt | Sal | Çar | Per | Cum | Cmt
  // 30 | 31 | 1 | 2 | 3 | 4 | 5
  // 6 | 7 | 8 | 9 | 10 | 11 (blue background) | 12
  // -------------------------------------------------------------
  const renderMainMonthGrid = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Sunday first: getDay() gives 0 for Sunday, 1 for Mon, etc.
    const startSunIndex = firstDay.getDay();

    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();

    const cells: {
      dayNumber: number;
      dateStr: string;
      isCurrentMonth: boolean;
      isToday: boolean;
      isSelected: boolean;
    }[] = [];

    // Preceding days
    for (let i = startSunIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const prevM = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevY = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      cells.push({
        dayNumber: dayNum,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === '2026-09-11',
        isSelected: dateStr === selectedDate,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: true,
        isToday: dateStr === '2026-09-11',
        isSelected: dateStr === selectedDate,
      });
    }

    // Fill to 35 or 42 cells
    const targetLength = cells.length > 35 ? 42 : 35;
    const remaining = targetLength - cells.length;
    for (let i = 1; i <= remaining; i++) {
      const nextM = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextY = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      cells.push({
        dayNumber: i,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === '2026-09-11',
        isSelected: dateStr === selectedDate,
      });
    }

    return cells;
  };

  const mainMonthCells = renderMainMonthGrid();

  // Filtered antrenmanlar
  const filteredAntrenmanlar = antrenmanlar.filter((a) => {
    if (branchFilter !== 'Tümü' && a.branch !== branchFilter) return false;
    return true;
  });

  // Today's sessions for quick card
  const selectedDaySessions = antrenmanlar.filter((a) => a.date === selectedDate);

  // Week View Days
  const getWeekDays = () => {
    const selected = new Date(selectedDate);
    const dayOfWeek = selected.getDay(); // 0 is Sunday
    // Start week on Monday
    const diff = (dayOfWeek + 6) % 7;
    const monday = new Date(selected);
    monday.setDate(selected.getDate() - diff);

    const week: { dateStr: string; dayName: string; dayNum: number }[] = [];
    const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    for (let i = 0; i < 7; i++) {
      const curr = new Date(monday);
      curr.setDate(monday.getDate() + i);
      week.push({
        dateStr: curr.toISOString().split('T')[0],
        dayName: dayNames[i],
        dayNum: curr.getDate(),
      });
    }
    return week;
  };

  const weekDays = getWeekDays();

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <SportsFlyIcon className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Controls Bar Matching Screenshot */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Antrenman Takvimi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tüm branşlar, tesisler ve eğitmenler için haftalık ve aylık antrenman planı
          </p>
        </div>

        {/* Controls: Month Dropdown + View Pills + Today Nav + Antrenman Ekle Button */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Month Selector Dropdown */}
          <div className="relative">
            <select
              value={`${currentYear}-${currentMonth}`}
              onChange={(e) => {
                const [y, m] = e.target.value.split('-').map(Number);
                setCurrentYear(y);
                setCurrentMonth(m);
              }}
              className="appearance-none bg-white border border-slate-200/90 hover:border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl pl-3.5 pr-8 py-2 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="2026-7">Ağustos 2026</option>
              <option value="2026-8">Eylül 2026</option>
              <option value="2026-9">Ekim 2026</option>
              <option value="2026-10">Kasım 2026</option>
            </select>
            <ChevronRight className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
          </div>

          {/* View Selector Pills: Ay, Hafta, Gün */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
            <button
              onClick={() => setViewMode('ay')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'ay'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              Ay
            </button>
            <button
              onClick={() => setViewMode('hafta')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'hafta'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              Hafta
            </button>
            <button
              onClick={() => setViewMode('gun')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'gun'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              Gün
            </button>
          </div>

          {/* Navigation Controls: Bugün, <, Month Text, > */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handleToday}
              className="px-3.5 py-1.5 bg-blue-100/70 hover:bg-blue-200/80 text-blue-700 rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-2xs"
            >
              Bugün
            </button>

            <button
              onClick={handlePrev}
              className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Önceki"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <span className="text-xs sm:text-sm font-bold text-slate-800 px-1 min-w-[85px] text-center">
              {currentMonthName} {currentYear}
            </span>

            <button
              onClick={handleNext}
              className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Sonraki"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Antrenman Ekle Action Button */}
          <button
            onClick={() => {
              setFormDate(selectedDate);
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Antrenman Ekle</span>
          </button>
        </div>
      </div>

      {/* Main Layout Grid: Left Mini Calendar (1/4) + Right Main Calendar (3/4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Mini Calendar Card & Quick Filters */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          {/* Mini Calendar Card matching screenshot */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
            {/* Weekdays Header: PZT, SAL, ÇAR, PER, CUM, CMR, PZR */}
            <div className="grid grid-cols-7 text-center border-b border-slate-100 pb-2.5">
              {['PZT', 'SAL', 'ÇAR', 'PER', 'CUM', 'CMR', 'PZR'].map((day) => (
                <span
                  key={day}
                  className="text-[11px] font-extrabold text-slate-800 tracking-wider underline decoration-slate-300 decoration-1 underline-offset-4"
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Numbers Grid */}
            <div className="grid grid-cols-7 gap-y-2 text-center text-xs">
              {miniCalendarCells.map((cell, idx) => {
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedDate(cell.dateStr);
                      const [y, m] = cell.dateStr.split('-').map(Number);
                      setCurrentYear(y);
                      setCurrentMonth(m - 1);
                    }}
                    className={`h-8 w-8 mx-auto flex flex-col items-center justify-center rounded-lg font-medium transition-all relative ${
                      cell.isSelected
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : cell.isToday
                        ? 'bg-blue-100 text-blue-700 font-bold border border-blue-300'
                        : cell.isCurrentMonth
                        ? 'text-slate-800 hover:bg-slate-100'
                        : 'text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cell.dayNumber}</span>
                    {cell.hasEvents && !cell.isSelected && (
                      <span className="w-1 h-1 rounded-full bg-blue-500 absolute bottom-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mini Calendar Footer Text matching screenshot: "Eylül, 2026" */}
            <div className="pt-2 text-center border-t border-slate-100">
              <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
                {currentMonthName}, {currentYear}
              </span>
            </div>
          </div>

          {/* Quick Filter by Branch */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                Branş Filtresi
              </span>
              {branchFilter !== 'Tümü' && (
                <button
                  onClick={() => setBranchFilter('Tümü')}
                  className="text-blue-600 hover:underline text-[11px]"
                >
                  Sıfırla
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'Tümü', color: 'slate' },
                { label: 'Basketbol', color: 'blue' },
                { label: 'Yüzme', color: 'sky' },
                { label: 'Fitness', color: 'emerald' },
                { label: 'Pilates', color: 'purple' },
                { label: 'Tenis', color: 'amber' },
                { label: 'Futbol', color: 'rose' },
              ].map((b) => (
                <button
                  key={b.label}
                  onClick={() => setBranchFilter(b.label)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    branchFilter === b.label
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Day Overview */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                {selectedDate === '2026-09-11' ? 'Bugünün Seansları' : `${selectedDate} Seansları`}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {selectedDaySessions.length} Antrenman
              </span>
            </div>

            {selectedDaySessions.length === 0 ? (
              <p className="text-xs text-slate-400 py-2 text-center">
                Bu tarihte planlanmış antrenman bulunmuyor.
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {selectedDaySessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${getColorClasses(
                      session.color
                    )}`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.startTime} - {session.endTime}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/80 font-bold border border-current">
                        {session.branch}
                      </span>
                    </div>
                    <p className="font-semibold text-xs mt-1 text-slate-900 truncate">
                      {session.title}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-600 mt-1">
                      <span className="flex items-center gap-1 truncate">
                        <User className="w-3 h-3 text-slate-400 shrink-0" />
                        {session.trainerName}
                      </span>
                      <span className="font-semibold shrink-0">
                        {session.enrolledCount}/{session.capacity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Main Calendar Area */}
        <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* MONTH VIEW (AY) */}
          {viewMode === 'ay' && (
            <div className="overflow-x-auto">
              <div className="min-w-[600px] lg:min-w-0">
                {/* Header: Paz, Pzt, Sal, Çar, Per, Cum, Cmt */}
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/50">
                  {['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'].map((d) => (
                    <div
                      key={d}
                      className="py-3 text-center text-xs sm:text-sm font-bold text-slate-800"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Day Grid */}
                <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
                  {mainMonthCells.map((cell, idx) => {
                    const dayEvents = filteredAntrenmanlar.filter(
                      (a) => a.date === cell.dateStr
                    );

                    // Highlight cell for today (Day 11) matching the soft blue box in screenshot
                    const isTodayCell = cell.dateStr === '2026-09-11';
                    const isSelectedCell = cell.dateStr === selectedDate;

                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedDate(cell.dateStr)}
                        className={`min-h-[105px] sm:min-h-[125px] p-1.5 sm:p-2 flex flex-col transition-colors cursor-pointer group ${
                          isTodayCell
                            ? 'bg-blue-100/60 hover:bg-blue-100/90'
                            : isSelectedCell
                            ? 'bg-blue-50/40 hover:bg-blue-50/70'
                            : cell.isCurrentMonth
                            ? 'bg-white hover:bg-slate-50/80'
                            : 'bg-slate-50/30 text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        {/* Top bar in cell: date number + add hover icon */}
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-xs sm:text-sm font-bold ${
                              isTodayCell
                                ? 'text-blue-900 font-extrabold'
                                : cell.isCurrentMonth
                                ? 'text-slate-800'
                                : 'text-slate-400'
                            }`}
                          >
                            {cell.dayNumber}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormDate(cell.dateStr);
                              setShowAddModal(true);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white rounded-md text-slate-500 hover:text-blue-600 transition-opacity"
                            title="Bu güne antrenman ekle"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Training Badges inside day cell */}
                        <div className="flex-1 space-y-1 overflow-y-auto max-h-[85px] pr-0.5">
                          {dayEvents.map((session) => (
                            <div
                              key={session.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSession(session);
                              }}
                              className={`px-1.5 py-1 rounded-md text-[10px] sm:text-[11px] font-semibold border truncate transition-shadow hover:shadow-2xs ${getColorClasses(
                                session.color
                              )}`}
                              title={`${session.startTime} - ${session.title} (${session.trainerName})`}
                            >
                              <span className="font-bold mr-1 text-slate-900">
                                {session.startTime}
                              </span>
                              <span>{session.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* WEEK VIEW (HAFTA) */}
          {viewMode === 'hafta' && (
            <div className="overflow-x-auto">
              <div className="min-w-[600px] lg:min-w-0">
                {/* Header Days of Selected Week */}
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/60 divide-x divide-slate-100">
                  {weekDays.map((d) => (
                    <div
                      key={d.dateStr}
                      onClick={() => setSelectedDate(d.dateStr)}
                      className={`py-3 text-center cursor-pointer transition-colors ${
                        d.dateStr === '2026-09-11'
                          ? 'bg-blue-100/70 text-blue-900'
                          : d.dateStr === selectedDate
                          ? 'bg-blue-50 text-blue-800'
                          : 'text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <p className="text-xs font-semibold text-slate-500">{d.dayName}</p>
                      <p className="text-base font-extrabold">{d.dayNum}</p>
                    </div>
                  ))}
                </div>

                {/* Week Schedule Columns */}
                <div className="grid grid-cols-7 divide-x divide-slate-100 min-h-[480px]">
                  {weekDays.map((d) => {
                    const dayEvents = filteredAntrenmanlar.filter(
                      (a) => a.date === d.dateStr
                    );
                    return (
                      <div
                        key={d.dateStr}
                        className="p-2 space-y-2 bg-white hover:bg-slate-50/40 transition-colors"
                      >
                        {dayEvents.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-center p-2 text-[11px] text-slate-400">
                            <span>Seans yok</span>
                          </div>
                        ) : (
                          dayEvents.map((session) => (
                            <div
                              key={session.id}
                              onClick={() => setSelectedSession(session)}
                              className={`p-2 rounded-xl border text-xs font-semibold cursor-pointer shadow-2xs hover:scale-[1.02] transition-transform ${getColorClasses(
                                session.color
                              )}`}
                            >
                              <div className="flex items-center justify-between text-[11px] font-bold">
                                <span>{session.startTime}</span>
                                <span className="text-[9px] px-1 py-0.5 rounded-sm bg-white/80 border">
                                  {session.branch}
                                </span>
                              </div>
                              <p className="font-bold text-slate-900 mt-1 line-clamp-2">
                                {session.title}
                              </p>
                              <p className="text-[10px] text-slate-600 mt-1">
                                {session.trainerName}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* DAY VIEW (GÜN) */}
          {viewMode === 'gun' && (
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedDate} Günlük Antrenman Programı
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tüm salonlar ve branşların seans akışı
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFormDate(selectedDate);
                    setShowAddModal(true);
                  }}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  Bu Güne Ekle
                </button>
              </div>

              {selectedDaySessions.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <CalendarIcon className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-sm font-semibold">Bu tarihe ait antrenman kaydı yok.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDaySessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => setSelectedSession(session)}
                      className="p-4 rounded-2xl border border-slate-200/90 hover:border-blue-300 transition-all bg-white hover:shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className="px-3 py-2 rounded-xl bg-blue-50 text-blue-700 font-extrabold text-sm border border-blue-200/70 text-center shrink-0">
                          <div>{session.startTime}</div>
                          <div className="text-[10px] font-medium text-slate-500">
                            {session.endTime}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                              {session.branch}
                            </span>
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              {session.status}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-base mt-1">
                            {session.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              {session.trainerName}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {session.facilityName}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                        <div className="text-right">
                          <p className="text-xs text-slate-500 font-medium">Katılım</p>
                          <p className="text-sm font-bold text-slate-900">
                            {session.enrolledCount} / {session.capacity}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSession(session);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-xs transition-colors"
                        >
                          Yoklama &amp; Detay
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Yeni Antrenman Ekle */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-5 sm:p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Yeni Antrenman Planla
                  </h3>
                  <p className="text-xs text-slate-500">
                    Takvime yeni antrenman seansı veya grup dersi ekleyin
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Antrenman Adı / Başlık *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: U14 Basketbol Taktik & Şut Antrenmanı"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Branş
                  </label>
                  <select
                    value={formBranch}
                    onChange={(e) => setFormBranch(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Basketbol">Basketbol</option>
                    <option value="Yüzme">Yüzme</option>
                    <option value="Fitness">Fitness & Kondisyon</option>
                    <option value="Pilates">Pilates & Reformer</option>
                    <option value="Tenis">Tenis</option>
                    <option value="Futbol">Futbol</option>
                    <option value="Voleybol">Voleybol</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tarih
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Başlangıç Saati
                  </label>
                  <input
                    type="time"
                    required
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bitiş Saati
                  </label>
                  <input
                    type="time"
                    required
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Eğitmen / Antrenör
                  </label>
                  <select
                    value={formTrainer}
                    onChange={(e) => setFormTrainer(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Can Aksoy">Can Aksoy</option>
                    <option value="Deniz Erdem">Deniz Erdem</option>
                    <option value="Selin Kara">Selin Kara</option>
                    <option value="Mert Koçak">Mert Koçak</option>
                    <option value="Tolga Arıkan">Tolga Arıkan</option>
                    <option value="Emre Yılmaz">Emre Yılmaz</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kontenjan
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tesis &amp; Salon
                </label>
                <input
                  type="text"
                  value={formFacility}
                  onChange={(e) => setFormFacility(e.target.value)}
                  placeholder="Saraçgym Nilüfer - A Salonu"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Antrenman Hedefleri &amp; Notlar
                </label>
                <textarea
                  rows={2}
                  placeholder="Antrenman içeriği, getirilecek ekipmanlar vb."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 resize-none font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
                >
                  Antrenmanı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Antrenman Detay & Yoklama Listesi */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-5 sm:p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {selectedSession.branch}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {selectedSession.date} • {selectedSession.startTime} - {selectedSession.endTime}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg mt-1">
                  {selectedSession.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Eğitmen</span>
                <strong className="text-slate-800 font-bold">{selectedSession.trainerName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Tesis</span>
                <strong className="text-slate-800 font-bold truncate block">{selectedSession.facilityName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Katılım Durumu</span>
                <strong className="text-slate-800 font-bold">
                  {selectedSession.enrolledCount} / {selectedSession.capacity} Sporcu
                </strong>
              </div>
            </div>

            {selectedSession.notes && (
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-blue-900">
                <span className="font-bold block mb-0.5">Antrenman Notu:</span>
                {selectedSession.notes}
              </div>
            )}

            {/* Yoklama / Sporcu Listesi */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  Yoklama &amp; Katılımcı Listesi
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  Katılan: {selectedSession.attendees.filter((a) => a.present).length} / {selectedSession.attendees.length}
                </span>
              </div>

              {/* Attendee rows */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {selectedSession.attendees.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-3">
                    Henüz kayıtlı sporcu yok. Aşağıdan yeni sporcu ekleyebilirsiniz.
                  </p>
                ) : (
                  selectedSession.attendees.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[11px]">
                          {att.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{att.name}</p>
                          {att.phone && (
                            <p className="text-[10px] text-slate-400">{att.phone}</p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleAttendance(selectedSession.id, att.id)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors ${
                          att.present
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        {att.present ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Katıldı
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-slate-400" />
                            Yok
                          </>
                        )}
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add athlete to this session */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Sporcu Ad Soyad ekle..."
                  value={newAttendeeName}
                  onChange={(e) => setNewAttendeeName(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleAddAttendee(selectedSession.id)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Ekle
                </button>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleDeleteSession(selectedSession.id)}
                className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                Antrenmanı İptal Et
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    triggerToast('Yoklama listesi PDF / yazıcıya gönderildi!');
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Yoklama Raporu Al
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSession(null)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Tamam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
