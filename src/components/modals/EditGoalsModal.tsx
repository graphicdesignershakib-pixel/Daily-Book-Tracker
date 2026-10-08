import React, { useState, useEffect } from 'react';
import { ReadingGoals, GoalUnit } from '../../types';
import { X } from 'lucide-react';

interface EditGoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: ReadingGoals;
  onSaveGoals: (goals: ReadingGoals) => void;
}

export const EditGoalsModal: React.FC<EditGoalsModalProps> = ({
  isOpen,
  onClose,
  goals,
  onSaveGoals,
}) => {
  const [dailyTarget, setDailyTarget] = useState<number>(goals.daily.target);
  const [dailyUnit, setDailyUnit] = useState<GoalUnit>(goals.daily.unit);

  const [weeklyTarget, setWeeklyTarget] = useState<number>(goals.weekly.target);
  const [weeklyUnit, setWeeklyUnit] = useState<GoalUnit>(goals.weekly.unit);

  const [monthlyTarget, setMonthlyTarget] = useState<number>(goals.monthly.target);
  const [monthlyUnit, setMonthlyUnit] = useState<GoalUnit>(goals.monthly.unit);

  const [yearlyTarget, setYearlyTarget] = useState<number>(goals.yearly.target);
  const [yearlyUnit, setYearlyUnit] = useState<'books' | 'pages'>(goals.yearly.unit);

  useEffect(() => {
    if (isOpen) {
      setDailyTarget(goals.daily.target);
      setDailyUnit(goals.daily.unit);
      setWeeklyTarget(goals.weekly.target);
      setWeeklyUnit(goals.weekly.unit);
      setMonthlyTarget(goals.monthly.target);
      setMonthlyUnit(goals.monthly.unit);
      setYearlyTarget(goals.yearly.target);
      setYearlyUnit(goals.yearly.unit);
    }
  }, [isOpen, goals]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveGoals({
      daily: { target: Math.max(1, dailyTarget), unit: dailyUnit },
      weekly: { target: Math.max(1, weeklyTarget), unit: weeklyUnit },
      monthly: { target: Math.max(1, monthlyTarget), unit: monthlyUnit },
      yearly: {
        target: Math.max(1, yearlyTarget),
        unit: yearlyUnit,
        year: goals.yearly.year,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-serif font-bold text-stone-900">
              Customize Reading Goals
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Set target counts and units across all four frequencies.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {/* Daily Goal */}
          <div className="bg-stone-50/70 p-3.5 rounded-lg border border-stone-200/60 space-y-2">
            <span className="font-semibold text-stone-800 text-xs block">
              1. Daily Goal
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-600 mb-1">Target</label>
                <input
                  type="number"
                  min="1"
                  value={dailyTarget}
                  onChange={(e) => setDailyTarget(Number(e.target.value))}
                  className="w-full bg-white border border-stone-200 rounded-md py-1.5 px-3 font-mono tabular-nums focus:outline-hidden focus:ring-1 focus:ring-stone-400"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1">Unit</label>
                <select
                  value={dailyUnit}
                  onChange={(e) => setDailyUnit(e.target.value as GoalUnit)}
                  className="w-full bg-white border border-stone-200 rounded-md py-1.5 px-2.5 focus:outline-hidden focus:ring-1 focus:ring-stone-400"
                >
                  <option value="pages">Pages per Day</option>
                  <option value="minutes">Minutes per Day</option>
                </select>
              </div>
            </div>
          </div>

          {/* Weekly Goal */}
          <div className="bg-stone-50/70 p-3.5 rounded-lg border border-stone-200/60 space-y-2">
            <span className="font-semibold text-stone-800 text-xs block">
              2. Weekly Target
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-600 mb-1">Target</label>
                <input
                  type="number"
                  min="1"
                  value={weeklyTarget}
                  onChange={(e) => setWeeklyTarget(Number(e.target.value))}
                  className="w-full bg-white border border-stone-200 rounded-md py-1.5 px-3 font-mono tabular-nums focus:outline-hidden focus:ring-1 focus:ring-stone-400"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1">Unit</label>
                <select
                  value={weeklyUnit}
                  onChange={(e) => setWeeklyUnit(e.target.value as GoalUnit)}
                  className="w-full bg-white border border-stone-200 rounded-md py-1.5 px-2.5 focus:outline-hidden focus:ring-1 focus:ring-stone-400"
                >
                  <option value="pages">Pages per Week</option>
                  <option value="books">Books per Week</option>
                  <option value="minutes">Minutes per Week</option>
                </select>
              </div>
            </div>
          </div>

          {/* Monthly Goal */}
          <div className="bg-stone-50/70 p-3.5 rounded-lg border border-stone-200/60 space-y-2">
            <span className="font-semibold text-stone-800 text-xs block">
              3. Monthly Cadence
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-600 mb-1">Target</label>
                <input
                  type="number"
                  min="1"
                  value={monthlyTarget}
                  onChange={(e) => setMonthlyTarget(Number(e.target.value))}
                  className="w-full bg-white border border-stone-200 rounded-md py-1.5 px-3 font-mono tabular-nums focus:outline-hidden focus:ring-1 focus:ring-stone-400"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1">Unit</label>
                <select
                  value={monthlyUnit}
                  onChange={(e) => setMonthlyUnit(e.target.value as GoalUnit)}
                  className="w-full bg-white border border-stone-200 rounded-md py-1.5 px-2.5 focus:outline-hidden focus:ring-1 focus:ring-stone-400"
                >
                  <option value="books">Books per Month</option>
                  <option value="pages">Pages per Month</option>
                  <option value="minutes">Minutes per Month</option>
                </select>
              </div>
            </div>
          </div>

          {/* Yearly Goal */}
          <div className="bg-stone-50/70 p-3.5 rounded-lg border border-stone-200/60 space-y-2">
            <span className="font-semibold text-stone-800 text-xs block">
              4. Annual Milestone
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-600 mb-1">Target</label>
                <input
                  type="number"
                  min="1"
                  value={yearlyTarget}
                  onChange={(e) => setYearlyTarget(Number(e.target.value))}
                  className="w-full bg-white border border-stone-200 rounded-md py-1.5 px-3 font-mono tabular-nums focus:outline-hidden focus:ring-1 focus:ring-stone-400"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1">Unit</label>
                <select
                  value={yearlyUnit}
                  onChange={(e) => setYearlyUnit(e.target.value as 'books' | 'pages')}
                  className="w-full bg-white border border-stone-200 rounded-md py-1.5 px-2.5 focus:outline-hidden focus:ring-1 focus:ring-stone-400"
                >
                  <option value="books">Books per Year</option>
                  <option value="pages">Pages per Year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors shadow-xs"
            >
              Save Goals
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
