import React, { useState, useMemo } from 'react';
import { ReadingSession, Book, Language } from '../../types';
import { Plus, Search, Clock, Trash2, ScrollText } from 'lucide-react';
import { formatNumberByLang } from '../../utils/i18n';

interface ReadingLogViewProps {
  sessions: ReadingSession[];
  books: Book[];
  onOpenLogReading: () => void;
  onDeleteSession: (sessionId: string) => void;
  language?: Language;
}

export const ReadingLogView: React.FC<ReadingLogViewProps> = ({
  sessions,
  books,
  onOpenLogReading,
  onDeleteSession,
  language = 'bn',
}) => {
  const isBn = language === 'bn';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookFilter, setSelectedBookFilter] = useState('All');

  // Summary figures
  const totalPages = sessions.reduce((acc, s) => acc + (s.pagesRead || 0), 0);
  const totalMinutes = sessions.reduce((acc, s) => acc + (s.readingMinutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Filtered sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      if (selectedBookFilter !== 'All' && s.bookId !== selectedBookFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = s.bookTitle.toLowerCase().includes(q);
        const matchNotes = (s.notes || '').toLowerCase().includes(q);
        if (!matchTitle && !matchNotes) return false;
      }
      return true;
    });
  }, [sessions, selectedBookFilter, searchQuery]);

  // Grouping by Date: Today, Yesterday, This Week, Earlier
  const groupedSessions = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

    const todayDate = new Date();
    const dayOfWeek = todayDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(todayDate);
    monday.setDate(todayDate.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    const groups: {
      today: ReadingSession[];
      yesterday: ReadingSession[];
      thisWeek: ReadingSession[];
      earlier: ReadingSession[];
    } = {
      today: [],
      yesterday: [],
      thisWeek: [],
      earlier: [],
    };

    filteredSessions.forEach((s) => {
      const sDate = new Date(s.date);
      if (s.date === todayStr) {
        groups.today.push(s);
      } else if (s.date === yesterdayStr) {
        groups.yesterday.push(s);
      } else if (sDate >= monday && sDate <= todayDate) {
        groups.thisWeek.push(s);
      } else {
        groups.earlier.push(s);
      }
    });

    return groups;
  }, [filteredSessions]);

  const renderGroup = (title: string, items: ReadingSession[]) => {
    if (items.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-800 font-mono">
            {title}
          </h3>
          <span className="text-xs font-mono tabular-nums text-stone-400">
            ({formatNumberByLang(items.length, language)} {isBn ? 'টি সেশন' : items.length === 1 ? 'session' : 'sessions'})
          </span>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-xl divide-y divide-stone-100 shadow-xs">
          {items.map((session) => (
            <div
              key={session.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-stone-50/50 transition-colors"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono tabular-nums text-stone-500">
                    {new Date(session.date).toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <h4 className="text-sm font-semibold text-stone-900 truncate font-serif">
                    {session.bookTitle}
                  </h4>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 font-mono tabular-nums pt-0.5">
                  <span className="bg-stone-100/90 text-stone-700 px-2 py-0.5 rounded text-[11px]">
                    {isBn ? 'পৃষ্ঠা' : 'Pages'} {formatNumberByLang(session.startPage, language)} → {formatNumberByLang(session.endPage, language)}
                  </span>
                  <span className="font-semibold text-stone-900">
                    +{formatNumberByLang(session.pagesRead, language)} {isBn ? 'পৃষ্ঠা' : 'pages'}
                  </span>
                  {session.readingMinutes > 0 && (
                    <>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className="flex items-center gap-1 text-stone-600">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        {formatNumberByLang(session.readingMinutes, language)} {isBn ? 'মিনিট' : 'min'}
                      </span>
                    </>
                  )}
                </div>

                {session.notes && (
                  <p className="text-xs text-stone-600 italic pt-1 font-serif leading-relaxed">
                    "{session.notes}"
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => onDeleteSession(session.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 rounded transition-colors opacity-80 group-hover:opacity-100"
                  title={isBn ? 'এই সেশন মুছে ফেলুন' : 'Delete this session'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
            {isBn ? 'পাঠ দিনলিপি (Reading Log)' : 'Reading Log'}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {isBn
              ? 'আপনার প্রতিটি পড়ার সেশন, পঠিত পৃষ্ঠা ও সাহিত্যিক অনুভূতির কালানুক্রমিক দিনলিপি।'
              : 'Chronological journal of every reading session, pacing duration, and literary notes.'}
          </p>
        </div>

        <button
          onClick={onOpenLogReading}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors shadow-2xs active:translate-y-px whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isBn ? 'নতুন সেশন লগ' : 'Log Reading'}</span>
        </button>
      </div>

      {/* Summary KPI Ribbon */}
      <div className="grid grid-cols-3 gap-3.5">
        <div className="bg-white border border-stone-200/80 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-stone-500 block">
            {isBn ? 'মোট সেশন' : 'Total Sessions'}
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1 block">
            {formatNumberByLang(sessions.length, language)}
          </span>
          <span className="text-[11px] text-stone-400 mt-0.5 block">
            {isBn ? 'রেকর্ডকৃত পাঠ সেশন' : 'Recorded sessions'}
          </span>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-stone-500 block">
            {isBn ? 'পঠিত পৃষ্ঠা' : 'Pages Logged'}
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1 block">
            {formatNumberByLang(totalPages, language)}
          </span>
          <span className="text-[11px] text-stone-400 mt-0.5 block">
            {isBn ? 'মোট পড়া পৃষ্ঠা' : 'Verified progress'}
          </span>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-stone-500 block">
            {isBn ? 'পড়ার সময়' : 'Time Immersed'}
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-stone-900 mt-1 block">
            {formatNumberByLang(totalHours, language)} {isBn ? 'ঘণ্টা' : 'hrs'}
          </span>
          <span className="text-[11px] text-stone-400 mt-0.5 block">
            {formatNumberByLang(totalMinutes, language)} {isBn ? 'মিনিট' : 'minutes'}
          </span>
        </div>
      </div>

      {/* Search & Book Filter */}
      <div className="bg-white border border-stone-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={isBn ? 'নোটস বা বইয়ের শিরোনাম দিয়ে খুঁজুন...' : 'Search notes or books...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-md py-1.5 pl-9 pr-3 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-amber-800 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500">{isBn ? 'বই ফিল্টার:' : 'Filter book:'}</span>
          <select
            value={selectedBookFilter}
            onChange={(e) => setSelectedBookFilter(e.target.value)}
            className="bg-stone-50 hover:bg-stone-100 border border-stone-200 py-1.5 px-2.5 rounded-md text-xs text-stone-700 cursor-pointer focus:outline-hidden max-w-[200px] truncate"
          >
            <option value="All">{isBn ? 'সব বই' : 'All Books'}</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Journal Timeline List */}
      {filteredSessions.length === 0 ? (
        <div className="bg-white border border-stone-200/80 rounded-xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
            <ScrollText className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="font-serif text-lg font-semibold text-stone-900">
              {isBn ? 'এখনও কোনো পাঠ সেশন যুক্ত করা হয়নি' : 'No reading sessions yet.'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1.5">
              {isBn
                ? 'প্রথম সেশনটি লগ করুন এবং আপনার পড়ার অভ্যাস ও দিনলিপি পর্যবেক্ষণ শুরু করুন।'
                : 'Log your first session to start seeing your reading journal, analytics, and timeline.'}
            </p>
          </div>
          <button
            onClick={onOpenLogReading}
            className="px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors shadow-2xs"
          >
            {isBn ? 'সেশন লগ করুন' : 'Log Reading'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {renderGroup(isBn ? 'আজ' : 'Today', groupedSessions.today)}
          {renderGroup(isBn ? 'গতকাল' : 'Yesterday', groupedSessions.yesterday)}
          {renderGroup(isBn ? 'এই সপ্তাহ' : 'This Week', groupedSessions.thisWeek)}
          {renderGroup(isBn ? 'পূর্ববর্তী দিনসমূহ' : 'Earlier Entries', groupedSessions.earlier)}
        </div>
      )}
    </div>
  );
};
