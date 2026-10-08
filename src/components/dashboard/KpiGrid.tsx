import React from 'react';
import {
  BookMarked,
  CheckCircle2,
  BookOpen,
  Layers,
  Award,
  Percent,
  Star,
  Calendar,
  BookmarkCheck,
  TrendingUp,
} from 'lucide-react';
import { AnalyticsSummary } from '../../utils/analytics';
import { Language } from '../../types';
import { formatNumberByLang } from '../../utils/i18n';

interface KpiGridProps {
  analytics: AnalyticsSummary;
  selectedYear: number;
  language?: Language;
}

export const KpiGrid: React.FC<KpiGridProps> = ({
  analytics,
  selectedYear,
  language = 'bn',
}) => {
  const isBn = language === 'bn';

  const cards = [
    {
      label: isBn ? 'মোট বই' : 'Total Books',
      value: formatNumberByLang(analytics.totalBooks, language),
      subtext: isBn ? 'আপনার ব্যক্তিগত সংগ্রহে' : 'In your library collection',
      icon: BookMarked,
    },
    {
      label: isBn ? 'সমাপ্ত বই' : 'Books Completed',
      value: formatNumberByLang(analytics.booksCompleted, language),
      subtext: isBn
        ? `${formatNumberByLang(selectedYear, language)} সালে সমাপ্ত`
        : `Finished in ${selectedYear}`,
      icon: CheckCircle2,
      accent: 'text-emerald-700',
    },
    {
      label: isBn ? 'বর্তমানে পড়ছি' : 'Currently Reading',
      value: formatNumberByLang(analytics.currentlyReading, language),
      subtext: isBn ? 'চলমান সক্রিয় বই' : 'Active titles in progress',
      icon: BookOpen,
      accent: 'text-amber-800',
    },
    {
      label: isBn ? 'মোট পঠিত পৃষ্ঠা' : 'Total Pages Read',
      value: formatNumberByLang(analytics.totalPagesRead, language),
      subtext: isBn
        ? `${formatNumberByLang(selectedYear, language)} সালে পঠিত`
        : `Pages logged in ${selectedYear}`,
      icon: Layers,
    },
    {
      label: isBn ? 'বার্ষিক লক্ষ্য' : 'Annual Target',
      value: `${formatNumberByLang(analytics.annualTarget, language)} ${
        isBn ? 'টি বই' : analytics.annualUnit
      }`,
      subtext: isBn
        ? `${formatNumberByLang(selectedYear, language)} সালের সংকল্প`
        : `${selectedYear} commitment`,
      icon: Award,
    },
    {
      label: isBn ? 'লক্ষ্য অগ্রগতি' : 'Target Completion',
      value: `${formatNumberByLang(Math.round(analytics.annualProgressPct), language)}%`,
      subtext: isBn
        ? `${formatNumberByLang(analytics.annualActual, language)} / ${formatNumberByLang(
            analytics.annualTarget,
            language
          )} সম্পন্ন`
        : `${analytics.annualActual} of ${analytics.annualTarget} completed`,
      icon: Percent,
    },
    {
      label: isBn ? 'গড় রেটিং' : 'Average Rating',
      value:
        analytics.averageRating > 0
          ? `${formatNumberByLang(analytics.averageRating, language)} ★`
          : '—',
      subtext: isBn ? 'মূল্যায়নকৃত বইগুলোর' : 'Across rated titles',
      icon: Star,
    },
    {
      label: isBn ? 'পড়ার গতি (বই/মাস)' : 'Pace (Books/Mo)',
      value: formatNumberByLang(analytics.booksPerMonth, language),
      subtext: isBn ? 'মাসিক গড় সমাপ্তি' : 'Average monthly completion',
      icon: Calendar,
    },
    {
      label: isBn ? 'পড়ার ধারাবাহিকতা' : 'Reading Streak',
      value: `${formatNumberByLang(analytics.currentStreakDays, language)} ${
        isBn ? 'দিন' : 'days'
      }`,
      subtext: isBn
        ? 'নিয়মিত পাঠের রেকর্ড'
        : 'Active habit streak',
      icon: BookmarkCheck,
      accent: 'text-amber-700',
    },
    {
      label: isBn ? 'মোট পড়ার সময়' : 'Time Invested',
      value: `${formatNumberByLang(
        Math.round((analytics.totalReadingMinutes / 60) * 10) / 10,
        language
      )} ${isBn ? 'ঘণ্টা' : 'hrs'}`,
      subtext: isBn
        ? `${formatNumberByLang(analytics.totalReadingMinutes, language)} মিনিট মোট`
        : `${analytics.totalReadingMinutes} minutes total`,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-stone-200/80 rounded-lg p-3.5 flex flex-col justify-between hover:border-stone-300 transition-colors shadow-2xs"
          >
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-medium text-stone-600 truncate">{c.label}</span>
              <Icon className={`w-3.5 h-3.5 shrink-0 ${c.accent || 'text-stone-400'}`} />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-mono tabular-nums font-semibold text-stone-900 tracking-tight">
                {c.value}
              </div>
              <p className="text-[11px] text-stone-400 truncate mt-0.5">{c.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
