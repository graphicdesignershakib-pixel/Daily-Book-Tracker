import React, { useState } from 'react';
import { UserSettings, Language } from '../../types';
import {
  Download,
  Upload,
  FileText,
  User,
  Database,
  Info,
  Trash2,
  BookOpen,
  Languages,
  Sparkles,
} from 'lucide-react';
import { StorageService } from '../../services/storage';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onDataReloaded: () => void;
  showToast: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onDataReloaded,
  showToast,
}) => {
  const [userName, setUserName] = useState(settings.userName);
  const [isSaved, setIsSaved] = useState(false);
  const lang: Language = settings.language || 'en';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({ ...settings, userName: userName.trim() || 'Reader' });
    setIsSaved(true);
    showToast(lang === 'bn' ? 'প্রোফাইল তথ্য সংরক্ষিত হয়েছে' : 'Profile preferences updated');
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleLanguageChange = (newLang: Language) => {
    onUpdateSettings({ ...settings, language: newLang });
    showToast(newLang === 'bn' ? 'অ্যাপের ভাষা বাংলা করা হয়েছে' : 'App language changed to English');
  };

  const handleExportJSON = () => {
    const jsonStr = StorageService.exportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `book-reading-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(lang === 'bn' ? 'JSON ব্যাকআপ ডাউনলোড সম্পন্ন হয়েছে' : 'JSON backup exported successfully');
  };

  const handleExportCSV = () => {
    const csvStr = StorageService.exportCSV();
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-books-library-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(lang === 'bn' ? 'বইয়ের তালিকা CSV ফাইলে এক্সপোর্ট হয়েছে' : 'Library exported to CSV');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = StorageService.importJSON(content);
      if (success) {
        onDataReloaded();
        showToast(lang === 'bn' ? 'লাইব্রেরি ডেটা রিস্টোর সম্পন্ন হয়েছে' : 'Library data restored successfully');
      } else {
        alert(
          lang === 'bn'
            ? 'ব্যাকআপ ফাইলটি পড়তে ব্যর্থ হয়েছে। দয়া করে সঠিক JSON ফাইল সিলেক্ট করুন।'
            : 'Could not parse the backup file. Please verify it is a valid JSON file.'
        );
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearAll = () => {
    const msg =
      lang === 'bn'
        ? 'সব বই, রিডিং সেশন ও কোটস কি সম্পূর্ণ মুছে ফেলতে চান? আপনার লাইব্রেরি একদম ফ্রেশ হয়ে যাবে।'
        : 'Clear all books, reading sessions, and quotes? Your tracker will be completely clean.';
    if (confirm(msg)) {
      StorageService.clearAllData();
      onDataReloaded();
      showToast(
        lang === 'bn'
          ? 'সব তথ্য মুছে ফেলা হয়েছে। ফ্রেশ লাইব্রেরি শুরু করার জন্য প্রস্তুত!'
          : 'All default library data cleared. Ready for your own books!'
      );
    }
  };

  const handleLoadDemo = () => {
    const msg =
      lang === 'bn'
        ? 'প্রিভিউ দেখার জন্য কিছু নমুনা বই ও পড়ার হিসাব লোড করতে চান?'
        : 'Load sample books and reading sessions for preview?';
    if (confirm(msg)) {
      StorageService.loadDemoData();
      onDataReloaded();
      showToast(lang === 'bn' ? 'নমুনা লাইব্রেরি লোড করা হয়েছে' : 'Loaded sample library collection');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
          {lang === 'bn' ? 'সেটিংস ও ডেটা ব্যবস্থাপনা' : 'Settings & Data Management'}
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          {lang === 'bn'
            ? 'অ্যাপের ভাষা পরিবর্তন, প্রোফাইল নাম এবং পড়ার জার্নালের ব্যাকআপ নিয়ন্ত্রণ করুন।'
            : 'Configure language, profile, backup your reading journal, and maintain your library.'}
        </p>
      </div>

      {/* Language Section */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
          <Languages className="w-4 h-4 text-amber-800" />
          <h3 className="text-sm font-semibold text-stone-900 font-sans">
            {lang === 'bn' ? 'ভাষা নির্বাচন (App Language)' : 'App Language'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
          <button
            onClick={() => handleLanguageChange('bn')}
            className={`p-3.5 rounded-lg border text-left flex items-start gap-3 transition-all ${
              lang === 'bn'
                ? 'border-amber-700 bg-amber-50/40 ring-1 ring-amber-700/20'
                : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
            }`}
          >
            <div className="w-5 h-5 rounded-full border border-stone-400 flex items-center justify-center mt-0.5 shrink-0 bg-white">
              {lang === 'bn' && <div className="w-2.5 h-2.5 rounded-full bg-amber-800" />}
            </div>
            <div>
              <span className="text-sm font-bold text-stone-900 block font-serif">বাংলা (Bangla)</span>
              <span className="text-xs text-stone-500 block mt-0.5">
                সম্পূর্ণ ইন্টারফেস, নেভিগেশন ও পরিসংখ্যান বাংলায় দেখুন
              </span>
            </div>
          </button>

          <button
            onClick={() => handleLanguageChange('en')}
            className={`p-3.5 rounded-lg border text-left flex items-start gap-3 transition-all ${
              lang === 'en'
                ? 'border-amber-700 bg-amber-50/40 ring-1 ring-amber-700/20'
                : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
            }`}
          >
            <div className="w-5 h-5 rounded-full border border-stone-400 flex items-center justify-center mt-0.5 shrink-0 bg-white">
              {lang === 'en' && <div className="w-2.5 h-2.5 rounded-full bg-amber-800" />}
            </div>
            <div>
              <span className="text-sm font-bold text-stone-900 block font-sans">English</span>
              <span className="text-xs text-stone-500 block mt-0.5">
                Standard international reading tracker interface
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
          <User className="w-4 h-4 text-amber-800" />
          <h3 className="text-sm font-semibold text-stone-900 font-sans">
            {lang === 'bn' ? 'পাঠক পরিচিতি (Reader Profile)' : 'Reader Profile'}
          </h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              {lang === 'bn' ? 'আপনার নাম' : 'Display Name'}
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-md py-1.5 px-3 text-sm text-stone-900 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-stone-400"
              placeholder="e.g. Shakib"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              {lang === 'bn'
                ? 'ড্যাশবোর্ড গ্রিটিংস এবং এক্সপোর্ট কার্ডে প্রদর্শিত হবে।'
                : 'Used in the dashboard greeting and exported documents.'}
            </p>
          </div>

          <button
            type="submit"
            className="px-4 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors shadow-xs"
          >
            {isSaved
              ? lang === 'bn' ? 'সংরক্ষিত!' : 'Saved!'
              : lang === 'bn' ? 'প্রোফাইল সেভ করুন' : 'Save Profile'}
          </button>
        </form>
      </div>

      {/* Data Backup & Export Section */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
          <Database className="w-4 h-4 text-amber-800" />
          <h3 className="text-sm font-semibold text-stone-900 font-sans">
            {lang === 'bn' ? 'ডেটা ব্যাকআপ ও ব্যবস্থাপনা' : 'Data Portability & Backup'}
          </h3>
        </div>

        <p className="text-xs text-stone-500 leading-relaxed">
          {lang === 'bn'
            ? 'আপনার পড়ার সব রেকর্ড, লাইব্রেরির বই, লক্ষ্যমাত্রা এবং সেশন ব্রাউজারে সুরক্ষিত থাকে। যেকোনো সময় ব্যাকআপ ফাইল ডাউনলোড করে অন্য ডিভাইসে নিতে পারেন।'
            : 'Your reading records, book library, goals, and sessions are securely stored in your browser. You can export a snapshot at any time or transfer to another device.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-3 p-3.5 rounded-lg border border-stone-200 hover:border-stone-300 hover:bg-stone-50/80 transition-all text-left"
          >
            <div className="p-2 rounded-md bg-stone-100 text-stone-700">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-stone-900 block font-sans">
                {lang === 'bn' ? 'সম্পূর্ণ ব্যাকআপ ডাউনলোড (JSON)' : 'Export Full Backup (JSON)'}
              </span>
              <span className="text-[11px] text-stone-500 block">
                {lang === 'bn' ? 'সব বই, লগ ও লক্ষ্যের পূর্ণ ডাটাবেজ।' : 'Complete database of books, logs, and goals.'}
              </span>
            </div>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-3 p-3.5 rounded-lg border border-stone-200 hover:border-stone-300 hover:bg-stone-50/80 transition-all text-left"
          >
            <div className="p-2 rounded-md bg-stone-100 text-stone-700">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-stone-900 block font-sans">
                {lang === 'bn' ? 'বইয়ের তালিকা এক্সপোর্ট (CSV)' : 'Export Books to CSV'}
              </span>
              <span className="text-[11px] text-stone-500 block">
                {lang === 'bn' ? 'Excel বা Google Sheets-এ দেখার উপযোগী ফরম্যাট।' : 'Spreadsheet format for Excel or Google Sheets.'}
              </span>
            </div>
          </button>

          {/* Import JSON */}
          <label className="flex items-center gap-3 p-3.5 rounded-lg border border-stone-200 hover:border-stone-300 hover:bg-stone-50/80 transition-all text-left cursor-pointer">
            <div className="p-2 rounded-md bg-stone-100 text-stone-700">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-stone-900 block font-sans">
                {lang === 'bn' ? 'ব্যাকআপ থেকে রিস্টোর করুন' : 'Restore from Backup'}
              </span>
              <span className="text-[11px] text-stone-500 block">
                {lang === 'bn' ? 'পূর্বে সংরক্ষিত JSON ব্যাকআপ ফাইল সিলেক্ট করুন।' : 'Select a previously saved JSON backup file.'}
              </span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </div>
          </label>

          {/* Clear Library Data */}
          <button
            onClick={handleClearAll}
            className="flex items-center gap-3 p-3.5 rounded-lg border border-red-200/80 bg-red-50/20 hover:bg-red-50/60 hover:border-red-300 transition-all text-left"
          >
            <div className="p-2 rounded-md bg-red-100/70 text-red-700">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-stone-900 block font-sans">
                {lang === 'bn' ? 'সব বই ও রিডিং লগ মুছুন' : 'Clear All Books & Logs'}
              </span>
              <span className="text-[11px] text-stone-500 block">
                {lang === 'bn'
                  ? 'সব তথ্য মুছে ফ্রেশ ও খালি লাইব্রেরি তৈরি করুন।'
                  : 'Remove all default info and start with a completely clean tracker.'}
              </span>
            </div>
          </button>

          {/* Load Sample Demo */}
          <button
            onClick={handleLoadDemo}
            className="flex items-center gap-3 p-3.5 rounded-lg border border-stone-200 hover:border-stone-300 hover:bg-stone-50/80 transition-all text-left"
          >
            <div className="p-2 rounded-md bg-stone-100 text-stone-700">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-stone-900 block font-sans">
                {lang === 'bn' ? 'নমুনা লাইব্রেরি লোড করুন' : 'Load Sample Demo Library'}
              </span>
              <span className="text-[11px] text-stone-500 block">
                {lang === 'bn'
                  ? 'চার্ট ও অ্যানালিটিক্স প্রিভিউ দেখতে স্যাম্পল বই লোড করুন।'
                  : 'Load a small sample set to preview analytics and charts.'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Product Philosophy */}
      <div className="bg-stone-50/70 border border-stone-200/70 rounded-xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-stone-700 font-medium text-xs">
          <Info className="w-4 h-4 text-amber-800" />
          <span>{lang === 'bn' ? 'অ্যাপের মূলনীতি' : 'Product Principle'}</span>
        </div>
        <p className="text-xs text-stone-600 leading-relaxed font-sans">
          <strong>{lang === 'bn' ? 'কম হিসাব রাখুন, বেশি বুঝুন।' : 'Track less. Understand more.'}</strong>{' '}
          {lang === 'bn'
            ? 'আপনার প্রতিদিনের পড়ার লগ থেকে এই অ্যাপটি স্বয়ংক্রিয়ভাবে সমাপ্তির সম্ভাব্য তারিখ, পঠিত পৃষ্ঠা, গতি ও মাসিক মোমেন্টাম হিসাব করে দেয়।'
            : 'The system derives all progress percentages, pages remaining, completion dates, and monthly momentum automatically from your reading sessions.'}
        </p>
      </div>
    </div>
  );
};
