import { Language, BookStatus, BookFormat } from '../types';

export const toBengaliDigits = (num: number | string): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
};

export const formatNumberByLang = (val: number | string, lang: Language): string => {
  if (lang === 'bn') {
    return toBengaliDigits(val);
  }
  return String(val);
};

export const translations = {
  en: {
    // Navigation
    dashboard: 'Overview',
    goals: 'Reading Goals',
    myBooks: 'My Library',
    quotes: 'Quotes & Highlights',
    readingLog: 'Reading Log',
    settings: 'Settings & Data',
    trackerJournal: 'Tracker & Journal',
    bookReading: 'Book Reading',
    readingStreak: 'Reading Streak',
    streakDays: 'days',
    streakDaySingle: 'day',

    // Quick Actions
    addBook: 'Add Book',
    logReading: 'Log Reading',
    focusTimer: 'Focus Timer',
    readingWrap: 'Year Wrap',
    quoteCardStudio: 'Quote Card Studio',
    speedEstimator: 'Reading Speed & Pace',
    bengaliClassics: 'Bengali Literary Classics',
    shortcuts: 'Keyboard Shortcuts',
    searchPlaceholder: 'Search books, authors... (/)',

    // Book Statuses
    'Want to Read': 'Want to Read',
    'Reading': 'Currently Reading',
    'Completed': 'Completed',
    'Paused': 'Paused',
    'Dropped': 'Dropped',

    // Book Formats
    'Hardcover': 'Hardcover',
    'Paperback': 'Paperback',
    'E-Book': 'E-Book',
    'Audiobook': 'Audiobook',

    // KPIs & Metrics
    pagesRead: 'Pages Read',
    booksCompleted: 'Books Finished',
    readingHours: 'Reading Time',
    currentStreak: 'Reading Streak',
    dailyTarget: 'Daily Target',
    weeklyTarget: 'Weekly Target',
    monthlyTarget: 'Monthly Target',
    annualGoal: 'Annual Reading Goal',
    pages: 'pages',
    books: 'books',
    mins: 'mins',
    hours: 'hours',
    progress: 'Progress',
    remaining: 'remaining',
    pageOf: 'of',
    
    // Pacing messages
    paceAhead: 'Ahead of schedule',
    paceOnTrack: 'On track with annual goal',
    paceBehind: 'Behind annual pace',
    paceReady: 'Ready to start your reading journey',

    // Empty States
    noBooksTitle: 'Your Library is Fresh & Ready',
    noBooksDesc: 'Start logging your reading life by adding your first book.',
    noReadingLogTitle: 'No Reading Sessions Yet',
    noReadingLogDesc: 'Log your daily pages to track speed, streaks, and habits.',
    noQuotesTitle: 'No Quotes Saved Yet',
    noQuotesDesc: 'Highlight meaningful lines, thoughts, or passages from your books.',
    noCurrentlyReading: 'No books currently in progress.',
    noRecentActivity: 'No reading activity logged yet this year.',

    // Common Buttons
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    close: 'Close',
    updateProgress: 'Update Progress',
    finish: 'Finish',
    download: 'Download',
    copy: 'Copy',
    copied: 'Copied!',
    clearData: 'Clear All Data',
    loadDemo: 'Load Demo Collection',
    language: 'Language',
    selectLanguage: 'Choose App Language',
  },
  bn: {
    // Navigation
    dashboard: 'সারসংক্ষেপ (Overview)',
    goals: 'পড়ার লক্ষ্যমাত্রা',
    myBooks: 'আমার লাইব্রেরি',
    quotes: 'উদ্ধৃতি ও নোট',
    readingLog: 'রিডিং লগ',
    settings: 'সেটিংস ও ডেটা',
    trackerJournal: 'রিডিং ট্র্যাকার ও জার্নাল',
    bookReading: 'বই পড়া ট্র্যাকার',
    readingStreak: 'ধারাবাহিক পাঠ (Streak)',
    streakDays: 'দিন',
    streakDaySingle: 'দিন',

    // Quick Actions
    addBook: 'নতুন বই যোগ করুন',
    logReading: 'পড়ার হিসাব রাখুন',
    focusTimer: 'ফোকাস টাইমার',
    readingWrap: 'ইয়ার র‍্যাপ (Year Wrap)',
    quoteCardStudio: 'উদ্ধৃতি কার্ড স্টুডিও',
    speedEstimator: 'পড়ার গতি ও সময় নির্ণায়ক',
    bengaliClassics: 'বাংলা সাহিত্যের ক্লাসিকস',
    shortcuts: 'শর্টকাট কীসমূহ',
    searchPlaceholder: 'বইয়ের নাম বা লেখক খুঁজুন... (/)',

    // Book Statuses
    'Want to Read': 'পড়তে চাই',
    'Reading': 'এখন পড়ছি',
    'Completed': 'পড়া সম্পন্ন',
    'Paused': 'সাময়িক স্থগিত',
    'Dropped': 'ছেড়ে দিয়েছি',

    // Book Formats
    'Hardcover': 'হার্ডকভার',
    'Paperback': 'পেপারব্যাক',
    'E-Book': 'ই-বুক',
    'Audiobook': 'অডিওবুক',

    // KPIs & Metrics
    pagesRead: 'পঠিত মোট পৃষ্ঠা',
    booksCompleted: 'সম্পন্ন বইয়ের সংখ্যা',
    readingHours: 'মোট পড়ার সময়',
    currentStreak: 'ধারাবাহিক পাঠ',
    dailyTarget: 'দৈনিক লক্ষ্য',
    weeklyTarget: 'সাপ্তাহিক লক্ষ্য',
    monthlyTarget: 'মাসিক লক্ষ্য',
    annualGoal: 'বার্ষিক পড়ার লক্ষ্য',
    pages: 'পৃষ্ঠা',
    books: 'টি বই',
    mins: 'মিনিট',
    hours: 'ঘণ্টা',
    progress: 'অগ্রগতি',
    remaining: 'বাকি আছে',
    pageOf: 'এর মধ্যে',

    // Pacing messages
    paceAhead: 'বার্ষিক লক্ষ্যের চেয়ে এগিয়ে আছেন 🎉',
    paceOnTrack: 'নির্ধারিত গতি অনুযায়ী এগিয়ে চলছেন ✨',
    paceBehind: 'লক্ষ্যের চেয়ে কিছুটা পিছিয়ে আছেন',
    paceReady: 'আপনার পাঠযাত্রা শুরু করার জন্য প্রস্তুত!',

    // Empty States
    noBooksTitle: 'আপনার লাইব্রেরি সম্পূর্ণ ফ্রেশ ও প্রস্তুত',
    noBooksDesc: 'আপনার পছন্দের প্রথম বইটি যোগ করে পাঠাভ্যাস রেকর্ড করা শুরু করুন।',
    noReadingLogTitle: 'এখনো কোনো পড়ার সেশন রেকর্ড করা হয়নি',
    noReadingLogDesc: 'প্রতিদিনের পড়ার পৃষ্ঠা ও সময় লিখে রাখুন, ধারাবাহিকতা বজায় থাকবে।',
    noQuotesTitle: 'এখনো কোনো উদ্ধৃতি সংরক্ষণ করা হয়নি',
    noQuotesDesc: 'বই পড়ার সময় প্রিয় বা শিক্ষণীয় লাইনগুলো সুন্দরভাবে টুকে রাখুন।',
    noCurrentlyReading: 'বর্তমানে কোনো বই পড়া হচ্ছে না।',
    noRecentActivity: 'এই বছরে এখনো কোনো পড়ার সেশন পাওয়া যায়নি।',

    // Common Buttons
    save: 'সংরক্ষণ করুন',
    cancel: 'বাতিল',
    edit: 'সম্পাদনা',
    delete: 'মুছুন',
    close: 'বন্ধ করুন',
    updateProgress: 'অগ্রগতি আপডেট করুন',
    finish: 'সম্পন্ন',
    download: 'ডাউনলোড করুন',
    copy: 'কপি করুন',
    copied: 'কপি করা হয়েছে!',
    clearData: 'সব ডেটা মুছে ফ্রেশ শুরু করুন',
    loadDemo: 'নমুনা লাইব্রেরি লোড করুন',
    language: 'ভাষা (Language)',
    selectLanguage: 'অ্যাপের ভাষা পরিবর্তন করুন',
  },
};

export const getStatusLabel = (status: BookStatus, lang: Language): string => {
  return translations[lang][status] || status;
};

export const getFormatLabel = (format: BookFormat | undefined, lang: Language): string => {
  if (!format) return '';
  return translations[lang][format] || format;
};
