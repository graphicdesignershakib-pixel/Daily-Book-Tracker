import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  BookOpen,
  ChevronDown,
  Search,
  Timer,
  Command,
  Sparkles,
  Sun,
  Moon,
  Coffee,
  Languages,
  Gauge,
  Quote,
  SlidersHorizontal,
} from 'lucide-react';
import { ThemeMode, Language } from '../../types';
import { translations, formatNumberByLang } from '../../utils/i18n';

interface HeaderProps {
  currentYear: number;
  onYearChange: (year: number) => void;
  onOpenAddBook: () => void;
  onOpenLogReading: () => void;
  onOpenTimer: () => void;
  onOpenShortcuts: () => void;
  onOpenWrap: () => void;
  onOpenQuoteCard: () => void;
  onOpenSpeedEstimator: () => void;
  onOpenBengaliClassics: () => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentYear,
  onYearChange,
  onOpenAddBook,
  onOpenLogReading,
  onOpenTimer,
  onOpenShortcuts,
  onOpenWrap: _onOpenWrap,
  onOpenQuoteCard,
  onOpenSpeedEstimator,
  onOpenBengaliClassics,
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  searchQuery,
  onSearchChange,
  activeTab,
}) => {
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const years = [2027, 2026, 2025, 2024];
  const t = translations[language];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return t.dashboard;
      case 'goals':
        return t.goals;
      case 'books':
        return t.myBooks;
      case 'quotes':
        return t.quotes;
      case 'log':
        return t.readingLog;
      case 'settings':
        return t.settings;
      default:
        return t.trackerJournal;
    }
  };

  const cycleTheme = () => {
    if (theme === 'editorial') onThemeChange('sepia');
    else if (theme === 'sepia') onThemeChange('dark');
    else onThemeChange('editorial');
  };

  const getThemeIcon = () => {
    if (theme === 'dark') return <Moon className="w-3.5 h-3.5 text-amber-300" />;
    if (theme === 'sepia') return <Coffee className="w-3.5 h-3.5 text-amber-800" />;
    return <Sun className="w-3.5 h-3.5 text-amber-600" />;
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-stone-200/70 px-4 sm:px-6 lg:px-8 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Zone 1: Brand & Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-baseline gap-2">
            <h1 className="text-base sm:text-lg font-serif font-semibold text-stone-900 tracking-tight truncate">
              {getPageTitle()}
            </h1>
          </div>

          {/* Minimalist Year selector */}
          <div className="relative inline-flex items-center">
            <select
              value={currentYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
              aria-label="Select reading year"
              className="appearance-none bg-stone-100/80 hover:bg-stone-200/60 text-stone-700 text-xs font-mono font-medium py-1 pl-2 pr-6 rounded-md cursor-pointer transition-colors border-none focus:outline-hidden tabular-nums"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {formatNumberByLang(y, language)}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-stone-500 absolute right-1.5 pointer-events-none" />
          </div>
        </div>

        {/* Zone 2: Fast Clean Search */}
        <div className="hidden md:flex items-center flex-1 max-w-xs mx-auto">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white/80 hover:bg-white focus:bg-white border border-stone-200/70 rounded-full py-1.5 pl-8 pr-3 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-1 focus:ring-amber-800/40 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 hover:text-stone-700 w-4 h-4 rounded-full flex items-center justify-center bg-stone-100"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Zone 3: Minimal, Creative Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Creative Tools Menu (Bengali Classics, Quote Studio, Speed Estimator, Timer) */}
          <div className="relative" ref={toolsRef}>
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-200/80 rounded-md transition-colors shadow-2xs"
              title={language === 'bn' ? 'স্পেশাল রিডিং টুলস' : 'Creative Reading Tools'}
              aria-expanded={toolsOpen}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">
                {language === 'bn' ? 'টুলস' : 'Studio'}
              </span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {toolsOpen && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white border border-stone-200 rounded-lg shadow-lg py-1.5 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider font-mono">
                  {language === 'bn' ? 'স্পেশাল ফিচারস' : 'Creative Features'}
                </div>

                <button
                  onClick={() => {
                    setToolsOpen(false);
                    onOpenBengaliClassics();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-amber-50/70 hover:text-amber-900 flex items-center gap-2.5 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <div className="font-medium">{language === 'bn' ? 'বাংলা সাহিত্য ক্লাসিকস' : 'Bengali Classics'}</div>
                    <div className="text-[10px] text-stone-400">{language === 'bn' ? 'বিখ্যাত বই ও সাহিত্যিক উক্তি' : 'Curated masterworks & quotes'}</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setToolsOpen(false);
                    onOpenQuoteCard();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-amber-50/70 hover:text-amber-900 flex items-center gap-2.5 transition-colors"
                >
                  <Quote className="w-4 h-4 text-stone-600 shrink-0" />
                  <div>
                    <div className="font-medium">{language === 'bn' ? 'কোট কার্ড স্টুডিও' : 'Quote Card Studio'}</div>
                    <div className="text-[10px] text-stone-400">{language === 'bn' ? 'শেয়ারযোগ্য নান্দনিক ইমেজ' : 'Create shareable quote cards'}</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setToolsOpen(false);
                    onOpenSpeedEstimator();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-amber-50/70 hover:text-amber-900 flex items-center gap-2.5 transition-colors"
                >
                  <Gauge className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-medium">{language === 'bn' ? 'পড়ার গতি ও তারিখ প্রেডিক্টর' : 'Speed & Pace Estimator'}</div>
                    <div className="text-[10px] text-stone-400">{language === 'bn' ? 'বই শেষ করার সময় নির্ধারণ' : 'Calculate daily page pace'}</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setToolsOpen(false);
                    onOpenTimer();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-amber-50/70 hover:text-amber-900 flex items-center gap-2.5 transition-colors border-t border-stone-100"
                >
                  <Timer className="w-4 h-4 text-amber-800 shrink-0" />
                  <div>
                    <div className="font-medium">{language === 'bn' ? 'ফোকাস রিডিং টাইমার' : 'Focus Reading Timer'}</div>
                    <div className="text-[10px] text-stone-400">{language === 'bn' ? 'বৃষ্টি ও ক্যাফে অ্যাম্বিয়েন্স' : 'With ambient background soundscapes'}</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Direct Focus Timer Button */}
          <button
            onClick={onOpenTimer}
            className="p-1.5 text-stone-600 hover:text-amber-900 hover:bg-amber-50/60 rounded-md border border-stone-200/80 bg-white transition-colors"
            title={language === 'bn' ? 'রিডিং টাইমার শুরু করুন (T)' : 'Focus Timer (T)'}
            aria-label="Focus Timer"
          >
            <Timer className="w-4 h-4 text-amber-800" />
          </button>

          {/* Minimal Language Switcher Segmented Control */}
          <div className="flex items-center bg-stone-100/90 p-0.5 rounded-md border border-stone-200/60 text-[11px] font-medium">
            <button
              onClick={() => onLanguageChange('bn')}
              className={`px-2 py-0.5 rounded transition-all ${
                language === 'bn'
                  ? 'bg-white text-stone-900 font-semibold shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="বাংলা ভাষা"
            >
              বাং
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 rounded transition-all ${
                language === 'en'
                  ? 'bg-white text-stone-900 font-semibold shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* Theme switcher */}
          <button
            onClick={cycleTheme}
            className="p-1.5 text-stone-600 hover:text-stone-900 rounded-md border border-stone-200/80 bg-white transition-colors"
            title={`Current theme: ${theme}. Click to switch theme.`}
            aria-label="Switch reading theme"
          >
            {getThemeIcon()}
          </button>

          {/* Log Reading CTA */}
          <button
            onClick={onOpenLogReading}
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 rounded-md transition-colors shadow-2xs active:translate-y-px whitespace-nowrap"
            title={language === 'bn' ? 'আজকের পড়ার সেশন রেকর্ড করুন (L)' : 'Record today reading session (L)'}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-800" />
            <span className="hidden sm:inline">{language === 'bn' ? 'সেশন লগ' : 'Log Today'}</span>
            <span className="sm:hidden">{language === 'bn' ? 'লগ' : 'Log'}</span>
          </button>

          {/* Add Book CTA */}
          <button
            onClick={onOpenAddBook}
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors shadow-2xs active:translate-y-px whitespace-nowrap"
            title={language === 'bn' ? 'নতুন বই যোগ করুন (B)' : 'Add a new book (B)'}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'bn' ? 'নতুন বই' : 'Add Book'}</span>
            <span className="sm:hidden">{language === 'bn' ? 'বই' : 'Book'}</span>
          </button>

          {/* Shortcuts */}
          <button
            onClick={onOpenShortcuts}
            className="hidden xl:flex p-1.5 text-stone-400 hover:text-stone-700 rounded-md border border-stone-200/80 bg-white transition-colors"
            title="Keyboard shortcuts (?)"
          >
            <Command className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
