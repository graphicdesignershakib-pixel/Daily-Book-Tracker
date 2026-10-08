import React from 'react';
import { Book, ReadingSession } from '../../types';
import { AnalyticsSummary } from '../../utils/analytics';
import { X, Sparkles, Copy, Check, Award, BookOpen, Clock, Flame, Star, Quote } from 'lucide-react';

interface ReadingWrapModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedYear: number;
  userName: string;
  books: Book[];
  sessions: ReadingSession[];
  analytics: AnalyticsSummary;
  showToast: (msg: string) => void;
}

export const ReadingWrapModal: React.FC<ReadingWrapModalProps> = ({
  isOpen,
  onClose,
  selectedYear,
  userName,
  books,
  sessions,
  analytics,
  showToast,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  // Compute Year Specific Highlights
  const completedThisYear = books.filter((b) => {
    if (b.status !== 'Completed') return false;
    const dateStr = b.finishDate || b.createdAt;
    return new Date(dateStr).getFullYear() === selectedYear;
  });

  // Longest book
  let longestBook = completedThisYear[0] || books[0];
  completedThisYear.forEach((b) => {
    if (b.totalPages > (longestBook?.totalPages || 0)) {
      longestBook = b;
    }
  });

  // Top rated book
  const rated = [...completedThisYear].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  const topRatedBook = rated[0] || completedThisYear[0] || books[0];

  // Standout quote
  let standoutQuote = '';
  let quoteAuthor = '';
  books.forEach((b) => {
    if (b.quotes && b.quotes.length > 0 && !standoutQuote) {
      standoutQuote = b.quotes[0].text;
      quoteAuthor = b.author;
    }
  });

  const totalHours = Math.round(analytics.totalReadingMinutes / 60);

  const handleCopyText = () => {
    const summary = `📚 My ${selectedYear} Reading Wrap (${userName}):
• Books Completed: ${analytics.booksCompleted}
• Pages Read: ${analytics.totalPagesRead.toLocaleString()}
• Time Immersed: ~${totalHours} hours
• Top Genre: ${analytics.favoriteGenre}
• Longest Book: ${longestBook?.title || 'None'} (${longestBook?.totalPages || 0} p.)
• Longest Streak: ${analytics.currentStreakDays} days
Tracked with Book Reading Tracker ✨`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    showToast('Copied reading wrap summary to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
      <div className="bg-[#1C1917] text-stone-100 border border-stone-800 rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800/80 flex items-center justify-between bg-stone-900/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-200 font-sans">
              {selectedYear} Reading Wrapped
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Storytelling Dossier Card */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Hero Banner */}
          <div className="text-center space-y-2 pb-4 border-b border-stone-800">
            <span className="text-xs font-mono text-stone-400 uppercase tracking-widest">
              Annual Literary Journey
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-50">
              {userName}'s {selectedYear} in Books
            </h1>
            <p className="text-xs text-stone-400 font-serif italic max-w-sm mx-auto">
              "A reader lives a thousand lives before he dies. The man who never reads lives only one."
            </p>
          </div>

          {/* Key Stat Blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-stone-900/90 border border-stone-800">
              <span className="text-[11px] text-stone-400 block">Volumes Finished</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-300 mt-1 block tabular-nums">
                {analytics.booksCompleted}
              </span>
              <span className="text-[10px] text-stone-500">books completed</span>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-900/90 border border-stone-800">
              <span className="text-[11px] text-stone-400 block">Total Pages</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-300 mt-1 block tabular-nums">
                {analytics.totalPagesRead.toLocaleString()}
              </span>
              <span className="text-[10px] text-stone-500">pages turned</span>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-900/90 border border-stone-800 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-stone-400 block">Time Immersed</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-300 mt-1 block tabular-nums">
                {totalHours}
              </span>
              <span className="text-[10px] text-stone-500">hours of focus</span>
            </div>
          </div>

          {/* Highlights Showcase */}
          <div className="space-y-3">
            {longestBook && (
              <div className="p-4 rounded-xl bg-stone-900/70 border border-stone-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-amber-950/60 text-amber-400 shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-stone-400 uppercase tracking-wider block">
                      Longest Tome Finished
                    </span>
                    <h4 className="text-sm font-semibold text-white truncate font-serif">
                      {longestBook.title}
                    </h4>
                    <span className="text-xs text-stone-400">{longestBook.author}</span>
                  </div>
                </div>
                <span className="text-xs font-mono tabular-nums text-amber-300 font-semibold shrink-0">
                  {longestBook.totalPages} pages
                </span>
              </div>
            )}

            {topRatedBook && (
              <div className="p-4 rounded-xl bg-stone-900/70 border border-stone-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-amber-950/60 text-amber-400 shrink-0">
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-stone-400 uppercase tracking-wider block">
                      Crown Title / Top Rated
                    </span>
                    <h4 className="text-sm font-semibold text-white truncate font-serif">
                      {topRatedBook.title}
                    </h4>
                    <span className="text-xs text-stone-400">{topRatedBook.author}</span>
                  </div>
                </div>
                <span className="text-xs font-mono tabular-nums text-amber-300 font-semibold shrink-0">
                  {topRatedBook.rating || 5}.0 ★
                </span>
              </div>
            )}

            <div className="p-4 rounded-xl bg-stone-900/70 border border-stone-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-950/60 text-amber-400 shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-stone-400 uppercase tracking-wider block">
                    Favorite Genre & Habit
                  </span>
                  <h4 className="text-sm font-semibold text-white font-sans">
                    {analytics.favoriteGenre}
                  </h4>
                </div>
              </div>
              <span className="text-xs font-mono text-stone-400">
                {analytics.currentStreakDays} day streak
              </span>
            </div>
          </div>

          {/* Standout Quote Card */}
          {standoutQuote && (
            <div className="p-5 rounded-xl bg-gradient-to-br from-amber-950/30 to-stone-900 border border-amber-900/30 relative space-y-2">
              <Quote className="w-6 h-6 text-amber-600/40 absolute top-3 right-3" />
              <span className="text-[10px] text-amber-400 uppercase tracking-widest font-mono">
                Resonant Quote of {selectedYear}
              </span>
              <p className="font-serif italic text-amber-100 text-sm leading-relaxed">
                "{standoutQuote}"
              </p>
              {quoteAuthor && (
                <span className="text-xs text-stone-400 block font-sans">
                  — {quoteAuthor}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="p-4 bg-stone-900/90 border-t border-stone-800 flex items-center justify-between">
          <span className="text-xs text-stone-400 font-mono">
            {selectedYear} Book Reading Tracker
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Share Summary'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-400 hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
