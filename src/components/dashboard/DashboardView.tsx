import React from 'react';
import { Book, ReadingSession, Language, BookQuote } from '../../types';
import { AnalyticsSummary } from '../../utils/analytics';
import { TodayReadingLedger } from './TodayReadingLedger';
import { HeroGoalModule } from './HeroGoalModule';
import { KpiGrid } from './KpiGrid';
import { MonthlyTrendChart } from './MonthlyTrendChart';
import { GenreDistributionChart } from './GenreDistributionChart';
import { ReadingHeatmap } from './ReadingHeatmap';
import { CurrentlyReadingSection } from './CurrentlyReadingSection';
import { RecentActivitySection } from './RecentActivitySection';
import { formatNumberByLang } from '../../utils/i18n';

interface DashboardViewProps {
  userName: string;
  selectedYear: number;
  books: Book[];
  sessions: ReadingSession[];
  analytics: AnalyticsSummary;
  onOpenAddBook: () => void;
  onOpenLogReading: () => void;
  onOpenBookDetail: (book: Book) => void;
  onQuickUpdateProgress: (book: Book) => void;
  onQuickLogReading: (book: Book) => void;
  onNavigateToGoals: () => void;
  onNavigateToBooks: () => void;
  onNavigateToLog: () => void;
  onEditGoals: () => void;
  onStartTimer?: (book: Book) => void;
  onSaveSession: (
    sessionData: Omit<ReadingSession, 'id' | 'createdAt'>,
    updateBookPage: boolean
  ) => void;
  onOpenQuoteCard?: (quote?: BookQuote, bookTitle?: string, author?: string) => void;
  language?: Language;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userName,
  selectedYear,
  books,
  sessions,
  analytics,
  onOpenAddBook,
  onOpenLogReading,
  onOpenBookDetail,
  onQuickUpdateProgress,
  onQuickLogReading,
  onNavigateToGoals,
  onNavigateToBooks,
  onNavigateToLog,
  onEditGoals,
  onStartTimer,
  onSaveSession,
  onOpenQuoteCard,
  language = 'bn',
}) => {
  // Current time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (language === 'bn') {
      if (hour < 12) return 'শুভ সকাল';
      if (hour < 18) return 'শুভ অপরাহ্ন';
      return 'শুভ সন্ধ্যা';
    }
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const currentlyReadingBooks = books.filter((b) => b.status === 'Reading');

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Editorial Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-stone-200/60">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            {getGreeting()}, {userName}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 font-sans">
            {language === 'bn'
              ? 'পড়তে থাকুন, বইয়ের পাতায় নতুন অভিজ্ঞতা ও অন্তর্দৃষ্টি আপনার অপেক্ষায়।'
              : 'Keep reading. Your next chapter is closer than you think.'}
          </p>
        </div>

        <div className="text-xs font-mono tabular-nums text-stone-500 self-start sm:self-auto">
          <span>{language === 'bn' ? 'চলতি হিসাব বছর: ' : 'Active Reporting Year: '}</span>
          <strong className="text-stone-900 font-semibold">
            {formatNumberByLang(selectedYear, language)}
          </strong>
        </div>
      </div>

      {/* Creative & Attractive Today's Reading Quick-Logger */}
      <TodayReadingLedger
        books={books}
        sessions={sessions}
        language={language}
        onSaveSession={onSaveSession}
        onStartTimer={onStartTimer ? (book) => (book ? onStartTimer(book) : undefined) : undefined}
        onOpenQuoteCard={onOpenQuoteCard}
        onOpenLogModal={onOpenLogReading}
      />

      {/* Hero Goal Module */}
      <HeroGoalModule
        selectedYear={selectedYear}
        annualProgress={analytics.goalsProgress.yearly}
        dailyProgress={analytics.goalsProgress.daily}
        weeklyProgress={analytics.goalsProgress.weekly}
        monthlyProgress={analytics.goalsProgress.monthly}
        onNavigateToGoals={onNavigateToGoals}
        onEditGoals={onEditGoals}
        language={language}
      />

      {/* KPI Metric Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
            {language === 'bn' ? 'পাঠাভ্যাস সারসংক্ষেপ (Overview)' : 'Performance Overview'}
          </span>
          <span className="text-[11px] text-stone-400 font-mono">
            {language === 'bn' ? 'রিয়েল-টাইমে পরিগণিত' : 'Updated in real-time'}
          </span>
        </div>
        <KpiGrid analytics={analytics} selectedYear={selectedYear} language={language} />
      </div>

      {/* Analytics Row: Monthly Trend & Genre Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <MonthlyTrendChart
            data={analytics.monthlyTrend}
            selectedYear={selectedYear}
          />
        </div>
        <div className="lg:col-span-5">
          <GenreDistributionChart data={analytics.genreDistribution} />
        </div>
      </div>

      {/* Reading Habit Heatmap */}
      <ReadingHeatmap sessions={sessions} selectedYear={selectedYear} />

      {/* Lower Content: Currently Reading & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6">
          <CurrentlyReadingSection
            books={currentlyReadingBooks}
            onOpenBookDetail={onOpenBookDetail}
            onQuickUpdateProgress={onQuickUpdateProgress}
            onQuickLogReading={onQuickLogReading}
            onViewAllBooks={onNavigateToBooks}
            onStartTimer={onStartTimer}
            language={language}
          />
        </div>
        <div className="lg:col-span-6">
          <RecentActivitySection
            sessions={sessions}
            onNavigateToLog={onNavigateToLog}
            onOpenLogReading={onOpenLogReading}
          />
        </div>
      </div>
    </div>
  );
};
