import React from 'react';
import { LayoutDashboard, Target, Library, ScrollText, Settings, Flame, Quote } from 'lucide-react';
import { Language } from '../../types';
import { translations, formatNumberByLang } from '../../utils/i18n';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  streakDays: number;
  totalBooksCount: number;
  language: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  streakDays,
  totalBooksCount,
  language,
}) => {
  const t = translations[language];

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'goals', label: t.goals, icon: Target },
    { id: 'books', label: t.myBooks, icon: Library, badge: totalBooksCount },
    { id: 'quotes', label: t.quotes, icon: Quote },
    { id: 'log', label: t.readingLog, icon: ScrollText },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-stone-200/80 min-h-screen p-5 shrink-0 select-none">
      {/* Brand Wordmark */}
      <div className="flex items-center gap-2.5 px-2 py-2 mb-6">
        <div className="w-8 h-8 rounded-md bg-stone-900 text-amber-100 flex items-center justify-center font-serif text-lg font-bold shadow-xs">
          {language === 'bn' ? 'ব' : 'B'}
        </div>
        <div>
          <span className="font-serif text-base font-semibold text-stone-900 tracking-tight block leading-tight">
            {t.bookReading}
          </span>
          <span className="text-[11px] font-sans tracking-wide text-stone-600 block uppercase">
            {t.trackerJournal}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-stone-100 text-stone-950 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-800' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="text-xs font-mono tabular-nums text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">
                  {formatNumberByLang(item.badge, language)}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Reading Habit / Streak Anchor */}
      <div className="mt-auto pt-4 border-t border-stone-100 px-2 space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-700">
          <span className="flex items-center gap-1.5 font-medium text-stone-800">
            <Flame className="w-4 h-4 text-amber-700" />
            {t.readingStreak}
          </span>
          <span className="font-mono tabular-nums font-semibold text-stone-900">
            {formatNumberByLang(streakDays, language)}{' '}
            {streakDays === 1 ? t.streakDaySingle : t.streakDays}
          </span>
        </div>

        <div className="bg-stone-50/80 rounded-lg p-3 border border-stone-200/60">
          <p className="font-serif italic text-xs text-stone-700 leading-relaxed">
            {language === 'bn'
              ? '"প্রতিদিন পড়ুন, জ্ঞান ও ভাবনার আলোয় নিজেকে সমৃদ্ধ করুন।"'
              : '"Read consistently. Track intelligently. Understand your progress."'}
          </p>
        </div>
      </div>
    </aside>
  );
};
