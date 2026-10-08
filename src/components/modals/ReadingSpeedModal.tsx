import React, { useState, useMemo } from 'react';
import { Book, ReadingSession, Language } from '../../types';
import { X, Gauge, Calendar, BookOpen, Clock, Target, ArrowRight, Sparkles } from 'lucide-react';
import { formatNumberByLang } from '../../utils/i18n';

interface ReadingSpeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  sessions: ReadingSession[];
  language: Language;
  initialBook?: Book | null;
}

export const ReadingSpeedModal: React.FC<ReadingSpeedModalProps> = ({
  isOpen,
  onClose,
  books,
  sessions,
  language,
  initialBook,
}) => {
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [dailyMinutesCommitment, setDailyMinutesCommitment] = useState<number>(30);
  const [targetFinishDate, setTargetFinishDate] = useState<string>('');

  // Calculate actual user reading speed from past sessions
  const historicalSpeed = useMemo(() => {
    const validSessions = sessions.filter((s) => s.readingMinutes > 0 && s.pagesRead > 0);
    if (validSessions.length === 0) {
      return { pagesPerHour: 35, minutesPerPage: 1.7, hasActualData: false };
    }
    const totalPages = validSessions.reduce((acc, s) => acc + s.pagesRead, 0);
    const totalMinutes = validSessions.reduce((acc, s) => acc + s.readingMinutes, 0);
    const pagesPerHour = Math.round((totalPages / (totalMinutes / 60)) * 10) / 10;
    const minutesPerPage = Math.round((totalMinutes / totalPages) * 10) / 10;
    return { pagesPerHour, minutesPerPage, hasActualData: true };
  }, [sessions]);

  // Set default book
  React.useEffect(() => {
    if (isOpen) {
      const active = initialBook || books.find((b) => b.status === 'Reading') || books[0];
      if (active) setSelectedBookId(active.id);
    }
  }, [isOpen, initialBook, books]);

  if (!isOpen) return null;

  const currentBook = books.find((b) => b.id === selectedBookId) || books[0];
  const remainingPages = currentBook
    ? Math.max(0, currentBook.totalPages - currentBook.currentPage)
    : 0;

  // Pages read per day with daily minutes commitment
  const pagesPerDayAtCurrentPace =
    Math.max(1, Math.round((dailyMinutesCommitment / 60) * historicalSpeed.pagesPerHour));

  // Days to finish at current pace
  const daysToFinish = remainingPages > 0 ? Math.ceil(remainingPages / pagesPerDayAtCurrentPace) : 0;

  const estimatedFinishDate = new Date();
  estimatedFinishDate.setDate(estimatedFinishDate.getDate() + daysToFinish);
  const finishDateStr = estimatedFinishDate.toLocaleDateString(
    language === 'bn' ? 'bn-BD' : 'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' }
  );

  // Target date calculation: required pages per day
  let requiredPagesPerDay: number | null = null;
  if (targetFinishDate && remainingPages > 0) {
    const target = new Date(targetFinishDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    requiredPagesPerDay = Math.ceil(remainingPages / diffDays);
  }

  // Reading profile descriptor
  const getPaceProfile = () => {
    const pph = historicalSpeed.pagesPerHour;
    if (pph < 25) {
      return {
        label: language === 'bn' ? 'গভীর ও মননশীল পাঠক' : 'Deep & Contemplative Reader',
        desc: language === 'bn'
          ? 'আপনি প্রতিটি লাইনের অর্থ গভীরভাবে উপলব্ধি করে ধীরে ধীরে পড়েন।'
          : 'You savor every nuance, idea, and detail with rich contemplation.',
      };
    }
    if (pph <= 45) {
      return {
        label: language === 'bn' ? 'ধারাবাহিক ও সুষম গতি' : 'Steady & Focused Reader',
        desc: language === 'bn'
          ? 'আপনার পড়ার গতি আদর্শ ও ভারসাম্যপূর্ণ, যা দীর্ঘস্থায়ী পাঠাভ্যাসের জন্য সবচেয়ে উপযোগী।'
          : 'Great balanced reading speed for steady comprehension and habit retention.',
      };
    }
    return {
      label: language === 'bn' ? 'দ্রুত পাঠক (Speed Reader)' : 'Avid Speed Reader',
      desc: language === 'bn'
        ? 'আপনি খুব দ্রুত বই পড়ে শেষ করতে পারেন এবং বেশি পরিমাণ বই অধ্যয়নে পারদর্শী।'
        : 'High-volume throughput reader capable of digesting multiple chapters in a sitting.',
    };
  };

  const profile = getPaceProfile();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200/90 w-full max-w-xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-900">
                {language === 'bn' ? 'পড়ার গতি ও বই সমাপ্তির সময় নির্ণায়ক' : 'Reading Speed & Completion Estimator'}
              </h2>
              <p className="text-xs text-stone-500">
                {language === 'bn'
                  ? 'আপনার পড়ার গতি অনুযায়ী বইটি শেষ করতে কত দিন লাগবে তা জেনে নিন'
                  : 'Estimate exact finish dates and daily targets based on your reading pace'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Historical speed stats banner */}
          <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-stone-500 uppercase block">
                {language === 'bn' ? 'আপনার বর্তমান পাঠ গতি' : 'Your Calculated Pace'}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold font-mono text-stone-900">
                  {formatNumberByLang(historicalSpeed.pagesPerHour, language)}
                </span>
                <span className="text-xs text-stone-600">
                  {language === 'bn' ? 'পৃষ্ঠা / ঘণ্টা' : 'pages / hour'}
                </span>
                <span className="text-xs text-stone-400">
                  (~{formatNumberByLang(historicalSpeed.minutesPerPage, language)}{' '}
                  {language === 'bn' ? 'মিনিট/পৃষ্ঠা' : 'mins/page'})
                </span>
              </div>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-200">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                <Sparkles className="w-3 h-3" />
                {profile.label}
              </span>
              <p className="text-[11px] text-stone-500 mt-1 max-w-xs">{profile.desc}</p>
            </div>
          </div>

          {/* Book selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              {language === 'bn' ? 'যে বইটির হিসাব করতে চান:' : 'Select Book to Analyze:'}
            </label>
            {books.length === 0 ? (
              <p className="text-xs text-stone-500 italic bg-stone-50 p-2.5 rounded-md border border-stone-200">
                {language === 'bn'
                  ? 'লাইব্রেরিতে কোনো বই নেই। হিসাব দেখতে প্রথমে একটি বই যোগ করুন।'
                  : 'No books available in your library yet. Add a book first.'}
              </p>
            ) : (
              <select
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 rounded-md border border-stone-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-stone-400 font-medium"
              >
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} ({b.author}) — {b.currentPage}/{b.totalPages} {language === 'bn' ? 'পৃষ্ঠা' : 'pages'}
                  </option>
                ))}
              </select>
            )}
          </div>

          {currentBook && (
            <div className="space-y-4">
              {/* Progress Summary */}
              <div className="flex items-center justify-between text-xs text-stone-600 px-1">
                <span>
                  {language === 'bn' ? 'বাকি পৃষ্ঠা সংখ্যা:' : 'Remaining Pages:'}{' '}
                  <strong className="text-stone-900 font-mono">
                    {formatNumberByLang(remainingPages, language)}
                  </strong>
                </span>
                <span>
                  {language === 'bn' ? 'বর্তমান অগ্রগতি:' : 'Current Progress:'}{' '}
                  <strong className="text-stone-900 font-mono">
                    {formatNumberByLang(
                      Math.round((currentBook.currentPage / currentBook.totalPages) * 100),
                      language
                    )}
                    %
                  </strong>
                </span>
              </div>

              {/* Daily Habit Slider */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    {language === 'bn' ? 'প্রতিদিন পড়ার সময় নির্ধারণ করুন' : 'Daily Reading Time Commitment'}
                  </label>
                  <span className="text-sm font-bold font-mono text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-md">
                    {formatNumberByLang(dailyMinutesCommitment, language)}{' '}
                    {language === 'bn' ? 'মিনিট / দিন' : 'mins / day'}
                  </span>
                </div>

                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={dailyMinutesCommitment}
                  onChange={(e) => setDailyMinutesCommitment(Number(e.target.value))}
                  className="w-full accent-amber-800 cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-stone-400 font-mono">
                  <span>5 mins</span>
                  <span>30 mins</span>
                  <span>60 mins</span>
                  <span>120 mins</span>
                </div>

                {/* Outcome Box */}
                <div className="mt-3 pt-3 border-t border-stone-200 grid grid-cols-2 gap-3 text-center">
                  <div className="bg-white p-2.5 rounded-lg border border-stone-200/80 shadow-2xs">
                    <span className="text-[11px] text-stone-500 block">
                      {language === 'bn' ? 'দৈনিক পৃষ্ঠা পড়া হবে' : 'Pages Read Daily'}
                    </span>
                    <span className="text-lg font-bold font-mono text-stone-900">
                      ~{formatNumberByLang(pagesPerDayAtCurrentPace, language)}{' '}
                      <span className="text-xs font-normal text-stone-500">{language === 'bn' ? 'পৃষ্ঠা' : 'pages'}</span>
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-stone-200/80 shadow-2xs">
                    <span className="text-[11px] text-stone-500 block">
                      {language === 'bn' ? 'বইটি শেষ হতে লাগবে' : 'Estimated Time to Finish'}
                    </span>
                    <span className="text-lg font-bold font-mono text-amber-900">
                      {remainingPages === 0 ? (
                        language === 'bn' ? 'পড়া শেষ!' : 'Completed!'
                      ) : (
                        <>
                          {formatNumberByLang(daysToFinish, language)}{' '}
                          <span className="text-xs font-normal text-stone-500">
                            {language === 'bn' ? 'দিন' : daysToFinish === 1 ? 'day' : 'days'}
                          </span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {remainingPages > 0 && (
                  <p className="text-center text-xs text-stone-600 font-medium">
                    📅 {language === 'bn' ? 'সম্ভাব্য সমাপ্তির তারিখ:' : 'Estimated completion date:'}{' '}
                    <span className="text-stone-900 font-semibold">{finishDateStr}</span>
                  </p>
                )}
              </div>

              {/* Target Date Planner */}
              <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-amber-800" />
                  <span className="text-xs font-semibold text-stone-800">
                    {language === 'bn' ? 'নির্দিষ্ট তারিখে শেষ করার প্ল্যানার' : 'Target Finish Date Planner'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500">
                  {language === 'bn'
                    ? 'কোন নির্দিষ্ট তারিখের মধ্যে বইটি শেষ করতে চান তা লিখুন, দৈনিক কত পৃষ্ঠা পড়তে হবে অ্যাপ তা হিসাব করে দেবে।'
                    : 'Set a deadline to automatically compute the daily pages needed to meet your goal.'}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="date"
                    value={targetFinishDate}
                    onChange={(e) => setTargetFinishDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="text-xs p-2 rounded-md border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-stone-400"
                  />
                  {requiredPagesPerDay !== null && (
                    <div className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md flex-1">
                      {language === 'bn'
                        ? `প্রতিদিন কমপক্ষে ${formatNumberByLang(requiredPagesPerDay, 'bn')} পৃষ্ঠা পড়তে হবে`
                        : `Read ~${requiredPagesPerDay} pages daily to finish on time`}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-200 bg-stone-50/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded-md transition-colors"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
