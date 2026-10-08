import React, { useState } from 'react';
import { Book, ReadingSession, Language, BookQuote } from '../../types';
import {
  Flame,
  BookOpen,
  Check,
  Timer,
  Plus,
  Quote,
  Sparkles,
  ChevronDown,
  Calendar,
} from 'lucide-react';
import { formatNumberByLang } from '../../utils/i18n';

interface TodayReadingLedgerProps {
  books: Book[];
  sessions: ReadingSession[];
  language?: Language;
  onSaveSession: (
    sessionData: Omit<ReadingSession, 'id' | 'createdAt'>,
    updateBookPage: boolean
  ) => void;
  onStartTimer?: (book?: Book) => void;
  onOpenQuoteCard?: (quote?: BookQuote, bookTitle?: string, author?: string) => void;
  onOpenLogModal: () => void;
}

export const TodayReadingLedger: React.FC<TodayReadingLedgerProps> = ({
  books,
  sessions,
  language = 'bn',
  onSaveSession,
  onStartTimer,
  onOpenQuoteCard,
  onOpenLogModal,
}) => {
  const readingBooks = books.filter((b) => b.status === 'Reading');
  const [selectedBookId, setSelectedBookId] = useState<string>(
    readingBooks[0]?.id || books[0]?.id || ''
  );
  const [pagesRead, setPagesRead] = useState<number>(15);
  const [minutesRead, setMinutesRead] = useState<number>(25);
  const [justLogged, setJustLogged] = useState<boolean>(false);

  // Selected book
  const activeBook = books.find((b) => b.id === selectedBookId) || readingBooks[0] || books[0];

  // Today's date formatted
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter((s) => s.date === todayStr);
  const todayPagesLogged = todaySessions.reduce((acc, s) => acc + s.pagesRead, 0);
  const todayMinutesLogged = todaySessions.reduce((acc, s) => acc + (s.readingMinutes || 0), 0);

  // Calculate current streak
  const calculateStreak = () => {
    const dates = Array.from(new Set(sessions.map((s) => s.date))).sort().reverse();
    if (dates.length === 0) return 0;
    
    let streak = 0;
    const checkDate = new Date();
    
    // Check if read today
    const checkStr = checkDate.toISOString().split('T')[0];
    const readToday = dates.includes(checkStr);
    
    if (!readToday) {
      // Check yesterday
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayStr = checkDate.toISOString().split('T')[0];
      if (!dates.includes(yesterdayStr)) return 0;
    }

    // Count consecutive days
    const cur = new Date(readToday ? checkStr : checkDate.toISOString().split('T')[0]);
    while (true) {
      const dStr = cur.toISOString().split('T')[0];
      if (dates.includes(dStr)) {
        streak++;
        cur.setDate(cur.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const streakDays = calculateStreak();

  const handleQuickLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBook || pagesRead <= 0) return;

    const startPage = activeBook.currentPage;
    const endPage = Math.min(activeBook.totalPages, startPage + pagesRead);

    onSaveSession(
      {
        bookId: activeBook.id,
        bookTitle: activeBook.title,
        date: todayStr,
        startPage,
        endPage,
        pagesRead,
        readingMinutes: minutesRead || Math.round(pagesRead * 1.5),
        notes: language === 'bn' ? 'দৈনিক রিডিং লগ' : 'Daily reading log',
      },
      true
    );

    setJustLogged(true);
    setTimeout(() => setJustLogged(false), 2400);
  };

  // Curated inspiring quote of the day
  const dailyQuote = {
    text: language === 'bn' 
      ? 'বই পড়ার অভ্যাস যেন এক নিঃশব্দ প্রশান্তি—প্রতিটি পাতায় নতুন অনুভূতির আলো।'
      : 'A reader lives a thousand lives before he dies. The man who never reads lives only one.',
    author: language === 'bn' ? 'রবীন্দ্রনাথ ঠাকুর' : 'George R.R. Martin',
    bookTitle: language === 'bn' ? 'বিচিত্র প্রবন্ধ' : 'A Dance with Dragons',
  };

  return (
    <div className="bg-white border border-stone-200/80 rounded-xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
      {/* Decorative calm subtle background watermark */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-radial from-amber-500/5 to-transparent pointer-events-none rounded-full blur-2xl" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 font-mono">
              {language === 'bn' ? 'আজকের পঠন ডায়েরি' : "Today's Reading Ledger"}
            </span>
            <span className="text-stone-300" aria-hidden="true">·</span>
            <span className="text-xs text-stone-500">
              {new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
                month: 'short',
                day: 'numeric',
                weekday: 'short',
              })}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 tracking-tight mt-0.5">
            {language === 'bn' ? 'আজ কতটুকু পড়লেন?' : 'What did you read today?'}
          </h3>
        </div>

        {/* Streak & Today Summary */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {streakDays > 0 ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50/80 border border-amber-200/70 rounded-md text-xs font-medium text-amber-900">
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>
                {formatNumberByLang(streakDays, language)} {language === 'bn' ? 'দিনের স্ট্রিক' : 'day streak'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-50 border border-stone-200/60 rounded-md text-xs text-stone-600">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'bn' ? 'আজকের লক্ষ্য পূরণ করুন' : 'Start streak today'}</span>
            </div>
          )}

          {todayPagesLogged > 0 && (
            <div className="hidden md:flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200/60 rounded-md text-xs font-medium text-emerald-800">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {formatNumberByLang(todayPagesLogged, language)} {language === 'bn' ? 'পৃষ্ঠা পঠিত' : 'p. read today'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Form */}
      {books.length === 0 ? (
        <div className="py-8 text-center text-xs text-stone-500">
          {language === 'bn'
            ? 'আপনার লাইব্রেরিতে কোনো বই নেই। প্রথমে একটি বই যোগ করুন।'
            : 'No books in library. Add a book first to log your daily reading.'}
        </div>
      ) : (
        <form onSubmit={handleQuickLog} className="pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Book Selector Column */}
            <div className="md:col-span-5 space-y-1.5">
              <label className="text-xs font-medium text-stone-700 flex items-center justify-between">
                <span>{language === 'bn' ? 'বই নির্বাচন করুন' : 'Select Book'}</span>
                {activeBook && (
                  <span className="text-[11px] text-stone-500 font-mono tabular-nums">
                    {formatNumberByLang(activeBook.currentPage, language)} / {formatNumberByLang(activeBook.totalPages, language)} {language === 'bn' ? 'পৃ' : 'p'}
                  </span>
                )}
              </label>

              <div className="relative">
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="w-full appearance-none bg-stone-50/80 hover:bg-stone-100/60 border border-stone-200 rounded-lg py-2 pl-3 pr-8 text-xs text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-amber-700 transition-colors"
                >
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} — {b.author} ({b.status === 'Reading' ? (language === 'bn' ? 'পড়ছি' : 'Reading') : b.status})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Quick Page Increment Buttons */}
            <div className="md:col-span-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-stone-700">
                  {language === 'bn' ? 'আজ কত পৃষ্ঠা পড়লেন?' : 'Pages read today'}
                </span>
                <span className="font-mono tabular-nums text-amber-800 font-semibold">
                  +{formatNumberByLang(pagesRead, language)} {language === 'bn' ? 'পৃষ্ঠা' : 'pages'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {[5, 10, 20, 35, 50].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => setPagesRead(inc)}
                    className={`flex-1 py-1.5 text-xs font-mono rounded-md border transition-all ${
                      pagesRead === inc
                        ? 'bg-amber-900 text-white border-amber-900 font-semibold shadow-2xs'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    +{formatNumberByLang(inc, language)}
                  </button>
                ))}
              </div>
            </div>

            {/* Minutes & Submit CTA */}
            <div className="md:col-span-3 flex items-end gap-2 pt-1 md:pt-0">
              <div className="w-24 space-y-1">
                <label className="text-[11px] font-medium text-stone-500 block">
                  {language === 'bn' ? 'মিনিট' : 'Minutes'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="480"
                  value={minutesRead}
                  onChange={(e) => setMinutesRead(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-md py-1.5 px-2 text-xs font-mono tabular-nums text-stone-900 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={justLogged}
                className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                  justLogged
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-900 hover:bg-stone-800 text-white active:scale-98'
                }`}
              >
                {justLogged ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'সংরক্ষিত!' : 'Saved!'}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'লগ করুন' : 'Log Today'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Bottom Micro Actions: Ambient Timer & Detailed Log & Quote Snippet */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
            {/* Daily Quote Snippet */}
            <div className="flex items-center gap-2 min-w-0 text-stone-600">
              <Quote className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <p className="italic truncate text-[11px] sm:text-xs text-stone-600 font-serif">
                "{dailyQuote.text}"
              </p>
              <span className="text-stone-400 text-[10px] shrink-0 font-sans">
                — {dailyQuote.author}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              {onOpenQuoteCard && (
                <button
                  type="button"
                  onClick={() =>
                    onOpenQuoteCard(
                      { id: 'daily-q', text: dailyQuote.text, page: 1, dateAdded: new Date().toISOString() },
                      dailyQuote.bookTitle,
                      dailyQuote.author
                    )
                  }
                  className="inline-flex items-center gap-1 text-[11px] text-stone-600 hover:text-amber-800 transition-colors"
                  title={language === 'bn' ? 'এই উক্তি দিয়ে কার্ড তৈরি করুন' : 'Create aesthetic card'}
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>{language === 'bn' ? 'কার্ড বানান' : 'Card'}</span>
                </button>
              )}

              {onStartTimer && activeBook && (
                <button
                  type="button"
                  onClick={() => onStartTimer(activeBook)}
                  className="inline-flex items-center gap-1 text-[11px] text-stone-600 hover:text-stone-900 transition-colors"
                  title={language === 'bn' ? 'টাইমার সহকারে মনোযোগ দিয়ে পড়ুন' : 'Read with focus timer'}
                >
                  <Timer className="w-3 h-3 text-amber-800" />
                  <span>{language === 'bn' ? 'টাইমার' : 'Timer'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={onOpenLogModal}
                className="text-[11px] font-medium text-amber-800 hover:text-amber-900 transition-colors"
              >
                {language === 'bn' ? 'বিস্তারিত লগ +' : 'Full Log +'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
