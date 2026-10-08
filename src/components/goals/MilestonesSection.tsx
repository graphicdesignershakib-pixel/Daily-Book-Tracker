import React, { useMemo } from 'react';
import { Book, ReadingSession, ReadingMilestone } from '../../types';
import { AnalyticsSummary } from '../../utils/analytics';
import { Award, CheckCircle2, Lock, Flame, BookOpen, Layers, Compass, Star, Clock } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

interface MilestonesSectionProps {
  books: Book[];
  sessions: ReadingSession[];
  analytics: AnalyticsSummary;
  selectedYear: number;
}

export const MilestonesSection: React.FC<MilestonesSectionProps> = ({
  books,
  sessions,
  analytics,
  selectedYear,
}) => {
  const milestones: ReadingMilestone[] = useMemo(() => {
    // 1. Century Club: Read a 500+ page book
    const has500PageBook = books.some((b) => b.totalPages >= 500 && b.currentPage >= 500);

    // 2. Weekend Marathon: 100+ pages in a weekend
    let maxWeekendPages = 0;
    const dateMap = new Map<string, number>();
    sessions.forEach((s) => {
      dateMap.set(s.date, (dateMap.get(s.date) || 0) + (s.pagesRead || 0));
    });
    dateMap.forEach((pages, dStr) => {
      const day = new Date(dStr).getDay();
      if (day === 0 || day === 6) {
        if (pages > maxWeekendPages) maxWeekendPages = pages;
      }
    });

    // 3. Consistency Master: 7+ day streak
    const streak = analytics.currentStreakDays;

    // 4. Genre Explorer: Read across 4+ genres
    const uniqueGenres = new Set(books.filter((b) => b.currentPage > 0).map((b) => b.category)).size;

    // 5. Voracious Reader: 5+ books completed
    const booksCompleted = analytics.booksCompleted;

    // 6. Deep Focus: 60+ min single session
    const maxSessionMins = Math.max(0, ...sessions.map((s) => s.readingMinutes || 0));

    // 7. Critic's Eye: Rated 5+ books
    const ratedCount = books.filter((b) => b.rating > 0).length;

    // 8. Milestone Crusher: 100% of yearly goal
    const annualProgress = Math.round(analytics.annualProgressPct);

    return [
      {
        id: 'm-1',
        title: 'Century Club',
        description: 'Complete any monumental book exceeding 500 pages.',
        icon: 'book',
        target: 500,
        current: has500PageBook ? 500 : Math.max(0, ...books.map((b) => (b.status === 'Completed' ? b.totalPages : 0))),
        isUnlocked: has500PageBook,
        category: 'volume',
      },
      {
        id: 'm-2',
        title: 'Consistency Master',
        description: 'Maintain an uninterrupted 7-day reading habit streak.',
        icon: 'flame',
        target: 7,
        current: Math.min(7, streak),
        isUnlocked: streak >= 7,
        category: 'consistency',
      },
      {
        id: 'm-3',
        title: 'Genre Explorer',
        description: 'Read titles across at least 4 distinct literary genres.',
        icon: 'compass',
        target: 4,
        current: Math.min(4, uniqueGenres),
        isUnlocked: uniqueGenres >= 4,
        category: 'diversity',
      },
      {
        id: 'm-4',
        title: 'Voracious Reader',
        description: `Complete 5 or more volumes in ${selectedYear}.`,
        icon: 'award',
        target: 5,
        current: Math.min(5, booksCompleted),
        isUnlocked: booksCompleted >= 5,
        category: 'volume',
      },
      {
        id: 'm-5',
        title: 'Deep Focus Immersion',
        description: 'Record an unbroken 60-minute reading session.',
        icon: 'clock',
        target: 60,
        current: Math.min(60, maxSessionMins),
        isUnlocked: maxSessionMins >= 60,
        category: 'focus',
      },
      {
        id: 'm-6',
        title: "Literary Critic's Eye",
        description: 'Rate and review at least 5 books in your library.',
        icon: 'star',
        target: 5,
        current: Math.min(5, ratedCount),
        isUnlocked: ratedCount >= 5,
        category: 'diversity',
      },
      {
        id: 'm-7',
        title: 'Weekend Marathon',
        description: 'Log 100+ pages read across a single weekend.',
        icon: 'layers',
        target: 100,
        current: Math.min(100, maxWeekendPages),
        isUnlocked: maxWeekendPages >= 100,
        category: 'volume',
      },
      {
        id: 'm-8',
        title: 'Milestone Crusher',
        description: `Achieve 100% of your annual ${selectedYear} reading goal.`,
        icon: 'award',
        target: 100,
        current: Math.min(100, annualProgress),
        isUnlocked: annualProgress >= 100,
        category: 'volume',
      },
    ];
  }, [books, sessions, analytics, selectedYear]);

  const unlockedCount = milestones.filter((m) => m.isUnlocked).length;

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'flame':
        return <Flame className="w-5 h-5 text-amber-500" />;
      case 'compass':
        return <Compass className="w-5 h-5 text-blue-500" />;
      case 'clock':
        return <Clock className="w-5 h-5 text-indigo-500" />;
      case 'star':
        return <Star className="w-5 h-5 text-amber-400" />;
      case 'layers':
        return <Layers className="w-5 h-5 text-emerald-500" />;
      default:
        return <Award className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-4 pt-6 border-t border-stone-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-serif font-bold text-stone-900 tracking-tight">
            Reading Challenges & Milestones
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Badges unlocked automatically from your reading sessions and library pace.
          </p>
        </div>

        <span className="text-xs font-mono tabular-nums text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md self-start sm:self-auto font-medium">
          Unlocked: <strong className="text-stone-900">{unlockedCount}</strong> / {milestones.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {milestones.map((m) => {
          const pct = Math.round((m.current / m.target) * 100);
          return (
            <div
              key={m.id}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-colors ${
                m.isUnlocked
                  ? 'bg-amber-50/40 border-amber-200/80 shadow-2xs'
                  : 'bg-white border-stone-200/80 opacity-85 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                    {renderIcon(m.icon)}
                  </div>
                  {m.isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-stone-400 font-mono">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-semibold text-stone-900 font-sans mt-1">
                  {m.title}
                </h4>
                <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                  {m.description}
                </p>
              </div>

              <div className="mt-4 pt-2 space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono tabular-nums text-stone-500">
                  <span>
                    {m.current} / {m.target}
                  </span>
                  <span className="font-semibold text-stone-700">{pct}%</span>
                </div>
                <ProgressBar
                  progress={pct}
                  size="sm"
                  color={m.isUnlocked ? 'bg-amber-600' : 'bg-stone-300'}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
