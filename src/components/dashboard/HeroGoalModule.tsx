import React from 'react';
import { Target, ArrowRight, Sparkles } from 'lucide-react';
import { GoalProgress, Language } from '../../types';
import { ProgressBar } from '../common/ProgressBar';
import { formatNumberByLang } from '../../utils/i18n';

interface HeroGoalModuleProps {
  selectedYear: number;
  annualProgress: GoalProgress;
  dailyProgress: GoalProgress;
  weeklyProgress: GoalProgress;
  monthlyProgress: GoalProgress;
  onNavigateToGoals: () => void;
  onEditGoals: () => void;
  language?: Language;
}

export const HeroGoalModule: React.FC<HeroGoalModuleProps> = ({
  selectedYear,
  annualProgress,
  dailyProgress,
  weeklyProgress,
  monthlyProgress,
  onNavigateToGoals,
  onEditGoals,
  language = 'bn',
}) => {
  const isTargetAchieved = annualProgress.actual >= annualProgress.target && annualProgress.target > 0;

  // Calculate annual pace status based on day of year
  const now = new Date();
  const isSelectedCurrentYear = selectedYear === now.getFullYear();
  let paceText = '';
  let paceStatusColor = 'text-stone-600';

  if (isSelectedCurrentYear && annualProgress.target > 0) {
    const startOfYear = new Date(selectedYear, 0, 1);
    const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const expectedPace = (annualProgress.target / 365) * dayOfYear;
    const diff = annualProgress.actual - expectedPace;

    if (annualProgress.actual === 0) {
      paceText = language === 'bn' ? 'পড়ার লক্ষ্য শুরু করতে প্রস্তুত' : 'Ready to start your journey';
      paceStatusColor = 'text-stone-500';
    } else if (diff >= 1) {
      const rounded = Math.round(diff * 10) / 10;
      paceText = language === 'bn' 
        ? `লক্ষ্যের চেয়ে +${formatNumberByLang(rounded, language)} এগিয়ে আছেন` 
        : `+${rounded} ahead of schedule`;
      paceStatusColor = 'text-emerald-700';
    } else if (diff <= -1) {
      const rounded = Math.round(Math.abs(diff) * 10) / 10;
      paceText = language === 'bn' 
        ? `নির্ধারিত গতির চেয়ে ${formatNumberByLang(rounded, language)} পিছিয়ে আছেন` 
        : `${rounded} behind schedule`;
      paceStatusColor = 'text-amber-800';
    } else {
      paceText = language === 'bn' ? 'সঠিক গতিতে এগিয়ে চলেছেন' : 'On track with annual pacing';
      paceStatusColor = 'text-stone-600';
    }
  }

  const unitLabel = language === 'bn' ? 'টি বই' : annualProgress.unit;

  return (
    <div className="bg-white border border-stone-200/80 rounded-xl p-5 sm:p-6 lg:p-7 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-stone-600 tracking-wide">
              {formatNumberByLang(selectedYear, language)} {language === 'bn' ? 'সালের পড়ার লক্ষ্য' : 'Reading Journey'}
            </span>
            {paceText && (
              <>
                <span className="text-stone-300" aria-hidden="true">·</span>
                <span className={`font-medium ${paceStatusColor}`}>
                  {paceText}
                </span>
              </>
            )}
          </div>
          <div className="flex items-baseline gap-3 mt-1.5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              <span className="font-mono tabular-nums">{formatNumberByLang(annualProgress.actual, language)}</span>
              <span className="text-stone-400 font-sans font-light text-xl sm:text-2xl mx-1.5">/</span>
              <span className="font-mono tabular-nums text-stone-500">{formatNumberByLang(annualProgress.target, language)}</span>
              <span className="text-sm sm:text-base font-sans font-medium text-stone-500 ml-2">
                {unitLabel}
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onEditGoals}
            className="text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200/80 px-3 py-1.5 rounded-md transition-colors"
          >
            {language === 'bn' ? 'লক্ষ্য পরিবর্তন' : 'Adjust Target'}
          </button>
          <button
            onClick={onNavigateToGoals}
            className="inline-flex items-center gap-1 text-xs font-medium text-amber-800 hover:text-amber-900 transition-colors"
          >
            <span>{language === 'bn' ? 'সব লক্ষ্য' : 'All Goals'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress bar and metrics */}
      <div className="mt-5 space-y-2">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="font-semibold text-stone-900 tabular-nums font-mono">
            {formatNumberByLang(Math.round(annualProgress.progressPct), language)}% {language === 'bn' ? 'সম্পন্ন' : 'complete'}
          </span>
          <span className="text-stone-600 text-xs">
            {isTargetAchieved ? (
              <span className="text-emerald-700 font-medium">
                {language === 'bn' 
                  ? `লক্ষ্য অর্জিত! +${formatNumberByLang(annualProgress.actual - annualProgress.target, language)} টি বাড়তি`
                  : `Goal achieved! +${annualProgress.actual - annualProgress.target} over target`}
              </span>
            ) : (
              <span>
                <strong className="font-mono tabular-nums font-semibold text-stone-800">
                  {formatNumberByLang(annualProgress.remaining, language)}
                </strong>{' '}
                {language === 'bn' ? 'টি বই বাকি' : `${annualProgress.unit} remaining`}
              </span>
            )}
          </span>
        </div>
        <ProgressBar
          progress={annualProgress.progressPct}
          size="lg"
          color={isTargetAchieved ? 'bg-emerald-700' : 'bg-stone-900'}
        />
      </div>

      {/* Micro goal cadence strip (Daily / Weekly / Monthly) with Zero-Pill Discipline */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 mt-5 border-t border-stone-100">
        {/* Daily Goal */}
        <div className="p-3 rounded-lg bg-stone-50/70 border border-stone-200/50">
          <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5">
            <span className="font-medium text-stone-800">{language === 'bn' ? 'আজকের লক্ষ্য' : 'Today'}</span>
            <span className="font-mono tabular-nums text-stone-500">
              {formatNumberByLang(dailyProgress.actual, language)} / {formatNumberByLang(dailyProgress.target, language)} {language === 'bn' ? 'পৃষ্ঠা' : dailyProgress.unit}
            </span>
          </div>
          <ProgressBar
            progress={dailyProgress.progressPct}
            size="sm"
            color={dailyProgress.isCompleted ? 'bg-emerald-600' : 'bg-amber-700'}
          />
        </div>

        {/* Weekly Goal */}
        <div className="p-3 rounded-lg bg-stone-50/70 border border-stone-200/50">
          <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5">
            <span className="font-medium text-stone-800">{language === 'bn' ? 'এই সপ্তাহ' : 'This Week'}</span>
            <span className="font-mono tabular-nums text-stone-500">
              {formatNumberByLang(weeklyProgress.actual, language)} / {formatNumberByLang(weeklyProgress.target, language)} {language === 'bn' ? 'পৃষ্ঠা' : weeklyProgress.unit}
            </span>
          </div>
          <ProgressBar
            progress={weeklyProgress.progressPct}
            size="sm"
            color={weeklyProgress.isCompleted ? 'bg-emerald-600' : 'bg-amber-700'}
          />
        </div>

        {/* Monthly Goal */}
        <div className="p-3 rounded-lg bg-stone-50/70 border border-stone-200/50">
          <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5">
            <span className="font-medium text-stone-800">{language === 'bn' ? 'এই মাস' : 'This Month'}</span>
            <span className="font-mono tabular-nums text-stone-500">
              {formatNumberByLang(monthlyProgress.actual, language)} / {formatNumberByLang(monthlyProgress.target, language)} {language === 'bn' ? 'বই' : monthlyProgress.unit}
            </span>
          </div>
          <ProgressBar
            progress={monthlyProgress.progressPct}
            size="sm"
            color={monthlyProgress.isCompleted ? 'bg-emerald-600' : 'bg-amber-700'}
          />
        </div>
      </div>
    </div>
  );
};
