import React from 'react';
import { LayoutDashboard, Target, Library, ScrollText, Settings } from 'lucide-react';
import { Language } from '../../types';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  language: Language;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange, language }) => {
  const tabs = [
    { id: 'dashboard', label: language === 'bn' ? 'হোম' : 'Home', icon: LayoutDashboard },
    { id: 'goals', label: language === 'bn' ? 'লক্ষ্য' : 'Goals', icon: Target },
    { id: 'books', label: language === 'bn' ? 'লাইব্রেরি' : 'Books', icon: Library },
    { id: 'log', label: language === 'bn' ? 'লগ' : 'Log', icon: ScrollText },
    { id: 'settings', label: language === 'bn' ? 'সেটিংস' : 'More', icon: Settings },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-md transition-colors ${
                isActive ? 'text-stone-900 font-semibold' : 'text-stone-600 hover:text-stone-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-amber-800' : 'text-stone-400'}`} />
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
