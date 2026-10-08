import React from 'react';
import { Target, CheckCircle2, TrendingUp, Calendar, Clock, Edit2, Flame } from 'lucide-react';
import { Book, ReadingSession, Language } from '../../types';
import { AnalyticsSummary } from '../../utils/analytics';
import { ProgressBar } from '../common/ProgressBar';
import { MilestonesSection } from './MilestonesSection';
import { formatNumberByLang } from '../../utils/i18n';

interface GoalsViewProps {
  analytics: AnalyticsSummary;
  selectedYear: number;
  books: Book[];
  sessions: ReadingSession[];
  onEditGoals: () => void;
  onOpenLogReading: () => void;
  language?: Language;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  analytics,
  selectedYear,
  books,
  sessions,
  onEditGoals,
  onOpenLogReading,
  language = 'bn',
}) => {
  const isBn = language === 'bn';
  const { daily, weekly, monthly, yearly } = analytics.goalsProgress;

  const goalCards = [
    {
      title: isBn ? 'দৈনিক লক্ষ্য' : 'Daily Goal',
      frequency: isBn ? 'প্রতিদিন' : 'Every Day',
      description: isBn
        ? 'সকাল ও সন্ধ্যায় পৃষ্ঠা উল্টে পড়ার নিয়মিত অভ্যাস গড়ে ওঠে।'
        : 'Consistency is built page by page every morning and evening.',
      target: daily.target,
      actual: daily.actual,
      unit: isBn ? 'পৃষ্ঠা' : daily.unit,
      progressPct: daily.progressPct,
      remaining: daily.remaining,
      isCompleted: daily.isCompleted,
      icon: Clock,
      color: 'bg-amber-700',
    },
    {
      title: isBn ? 'সাপ্তাহিক টার্গেট' : 'Weekly Target',
      frequency: isBn ? 'এই ক্যালেন্ডার সপ্তাহ' : 'This Calendar Week',
      description: isBn
        ? 'ব্যস্ততার মধ্যেও সাপ্তাহিক ছন্দ পড়ার গতিকে সচল রাখে।'
        : 'Weekly pacing maintains momentum through busy schedules.',
      target: weekly.target,
      actual: weekly.actual,
      unit: isBn ? 'পৃষ্ঠা' : weekly.unit,
      progressPct: weekly.progressPct,
      remaining: weekly.remaining,
      isCompleted: weekly.isCompleted,
      icon: TrendingUp,
      color: 'bg-amber-700',
    },
    {
      title: isBn ? 'মাসিক সংকল্প' : 'Monthly Cadence',
      frequency: isBn ? 'চলতি মাস' : 'This Month',
      description: isBn
        ? 'মনোযোগ দিয়ে পড়লে প্রতি মাসে একাধিক নতুন বই সমাপ্ত করা সম্ভব।'
        : 'Deep focus allows multiple books or hundreds of pages per month.',
      target: monthly.target,
      actual: monthly.actual,
      unit: isBn ? 'বই' : monthly.unit,
      progressPct: monthly.progressPct,
      remaining: monthly.remaining,
      isCompleted: monthly.isCompleted,
      icon: Calendar,
      color: 'bg-amber-700',
    },
    {
      title: isBn
        ? `${formatNumberByLang(selectedYear, language)} সালের বার্ষিক প্রতিশ্রুতি`
        : `${selectedYear} Annual Commitment`,
      frequency: isBn ? 'বার্ষিক মাইলফলক' : 'Yearly Milestone',
      description: isBn
        ? 'আপনার দীর্ঘমেয়াদী মননশীল পাঠযাত্রা ও বুদ্ধিবৃত্তিক দিগন্ত।'
        : 'Your long-term intellectual journey and literary horizon.',
      target: yearly.target,
      actual: yearly.actual,
      unit: isBn ? 'বই' : yearly.unit,
      progressPct: yearly.progressPct,
      remaining: yearly.remaining,
      isCompleted: yearly.isCompleted,
      icon: Target,
      color: 'bg-stone-900',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
            {isBn ? 'পড়ার লক্ষ্যমাত্রা' : 'Reading Goals'}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {isBn
              ? 'দৈনিক, সাপ্তাহিক, মাসিক ও বার্ষিক লক্ষ্য নির্ধারণ করুন এবং পাঠাভ্যাস পরিমাপ করুন।'
              : 'Define daily, weekly, monthly, and yearly targets. Measure real habits.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onOpenLogReading}
            className="px-3.5 py-2 text-xs sm:text-sm font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-200/80 rounded-md transition-colors shadow-2xs"
          >
            {isBn ? 'সেশন লগ' : 'Log Session'}
          </button>
          <button
            onClick={onEditGoals}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors shadow-2xs"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isBn ? 'লক্ষ্য সম্পাদনা' : 'Customize Targets'}</span>
          </button>
        </div>
      </div>

      {/* Streak Banner */}
      <div className="bg-white border border-stone-200/80 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 fill-amber-500 text-amber-700" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900 font-sans">
              {isBn ? 'পড়ার নিয়মিত ধারাবাহিকতা (Streak)' : 'Current Reading Habit Streak'}
            </h3>
            <p className="text-xs text-stone-500">
              {isBn ? (
                <>
                  আপনি টানা{' '}
                  <strong className="text-stone-800 font-mono tabular-nums font-semibold">
                    {formatNumberByLang(analytics.currentStreakDays, language)} দিন
                  </strong>{' '}
                  পড়েছেন। দারুণ ছন্দ বজায় রাখুন!
                </>
              ) : (
                <>
                  You have recorded active reading for{' '}
                  <strong className="text-stone-800 font-mono tabular-nums font-semibold">
                    {analytics.currentStreakDays} consecutive{' '}
                    {analytics.currentStreakDays === 1 ? 'day' : 'days'}
                  </strong>
                  .
                </>
              )}
            </p>
          </div>
        </div>

        <div className="text-xs text-stone-500 flex items-center gap-6">
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-stone-400">
              {isBn ? 'মোট পড়ার সময়' : 'Total Minutes'}
            </span>
            <span className="text-base font-bold font-mono tabular-nums text-stone-800">
              {formatNumberByLang(analytics.totalReadingMinutes, language)} {isBn ? 'মিনিট' : 'min'}
            </span>
          </div>
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-stone-400">
              {isBn ? 'পঠিত পৃষ্ঠা' : 'Pages Completed'}
            </span>
            <span className="text-base font-bold font-mono tabular-nums text-stone-800">
              {formatNumberByLang(analytics.totalPagesRead, language)}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {goalCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-stone-200/80 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:border-stone-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 font-mono">
                      {card.frequency}
                    </span>
                    <h3 className="text-lg font-serif font-semibold text-stone-900 mt-0.5">
                      {card.title}
                    </h3>
                  </div>
                  <div
                    className={`p-2 rounded-lg ${
                      card.isCompleted
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-stone-50 text-stone-500'
                    }`}
                  >
                    {card.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                </div>

                <p className="text-xs text-stone-500 leading-relaxed mb-6">
                  {card.description}
                </p>

                {/* Numbers */}
                <div className="flex items-baseline justify-between mb-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-stone-900">
                      {formatNumberByLang(card.actual, language)}
                    </span>
                    <span className="text-stone-400 text-lg font-sans">/</span>
                    <span className="text-lg font-mono tabular-nums text-stone-500">
                      {formatNumberByLang(card.target, language)}
                    </span>
                    <span className="text-xs font-medium text-stone-500 ml-1">
                      {card.unit}
                    </span>
                  </div>

                  <span className="text-sm font-mono tabular-nums font-semibold text-stone-800">
                    {formatNumberByLang(Math.round(card.progressPct), language)}%
                  </span>
                </div>

                {/* Progress bar */}
                <ProgressBar
                  progress={card.progressPct}
                  size="md"
                  color={card.isCompleted ? 'bg-emerald-700' : card.color}
                />
              </div>

              <div className="pt-4 mt-6 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>
                  {card.isCompleted
                    ? isBn
                      ? 'সম্পূর্ণ হয়েছে ✓'
                      : 'Completed ✓'
                    : isBn
                    ? `আরও ${formatNumberByLang(card.remaining, language)} ${card.unit} বাকি`
                    : `${card.remaining} ${card.unit} remaining`}
                </span>
                <button
                  onClick={onEditGoals}
                  className="text-stone-400 hover:text-stone-800 transition-colors"
                >
                  {isBn ? 'পরিবর্তন' : 'Edit'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Literary Milestones */}
      <MilestonesSection
        analytics={analytics}
        books={books}
        sessions={sessions}
        selectedYear={selectedYear}
      />
    </div>
  );
};
