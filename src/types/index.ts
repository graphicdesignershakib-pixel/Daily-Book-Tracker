export type BookStatus = 'Want to Read' | 'Reading' | 'Completed' | 'Paused' | 'Dropped';

export type BookFormat = 'Hardcover' | 'Paperback' | 'E-Book' | 'Audiobook';

export type ThemeMode = 'editorial' | 'sepia' | 'dark';

export type Language = 'en' | 'bn';

export interface BookQuote {
  id: string;
  bookId?: string;
  bookTitle?: string;
  author?: string;
  text: string;
  page?: number;
  dateAdded: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string; // Genre
  totalPages: number;
  currentPage: number;
  language: string;
  status: BookStatus;
  format?: BookFormat;
  rating: number; // 0-5
  startDate?: string; // YYYY-MM-DD
  finishDate?: string; // YYYY-MM-DD
  notes?: string;
  quotes?: BookQuote[];
  coverColor: string;
  coverImage?: string;
  tags?: string[];
  pauseReason?: string;
  createdAt: string;
}

export interface ReadingSession {
  id: string;
  bookId: string;
  bookTitle: string;
  date: string; // YYYY-MM-DD
  startPage: number;
  endPage: number;
  pagesRead: number;
  readingMinutes: number;
  notes?: string;
  createdAt: string;
}

export type GoalUnit = 'pages' | 'books' | 'minutes';

export interface GoalDefinition {
  target: number;
  unit: GoalUnit;
}

export interface ReadingGoals {
  daily: GoalDefinition;
  weekly: GoalDefinition;
  monthly: GoalDefinition;
  yearly: {
    target: number;
    unit: 'books' | 'pages';
    year: number;
  };
}

export interface GoalProgress {
  title: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  target: number;
  actual: number;
  unit: GoalUnit;
  progressPct: number;
  remaining: number;
  isCompleted: boolean;
}

export interface UserSettings {
  userName: string;
  currentYear: number;
  theme?: ThemeMode;
  language?: Language;
}

export interface ReadingMilestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  current: number;
  isUnlocked: boolean;
  unlockedDate?: string;
  category: 'volume' | 'consistency' | 'diversity' | 'focus';
}

export interface MonthlyReadingData {
  month: string; // 'Jan', 'Feb', etc.
  monthIndex: number; // 0-11
  booksCompleted: number;
  pagesRead: number;
}

export interface GenreStat {
  genre: string;
  count: number;
  pagesRead: number;
  percentage: number;
  color: string;
}
