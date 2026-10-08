import { Book, ReadingSession, ReadingGoals, UserSettings } from '../types';

const STORAGE_KEYS = {
  BOOKS: 'book_tracker_books_v2',
  SESSIONS: 'book_tracker_sessions_v2',
  GOALS: 'book_tracker_goals_v2',
  SETTINGS: 'book_tracker_settings_v2',
};

export const GENRES = [
  'Philosophy & Psychology',
  'Technology & AI',
  'Productivity & Business',
  'Science & Physics',
  'Literary Fiction',
  'Biography & Memoir',
  'History & Society',
  'Art & Design',
  'Sci-Fi & Speculative',
];

export const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Other'];

export const COVER_PALETTES = [
  '#2C3E50', // Slate Navy
  '#1E3A2F', // Deep Forest
  '#7A3E26', // Warm Russet / Cognac
  '#4A3B32', // Rich Walnut
  '#2C2C34', // Charcoal
  '#1F3A44', // Dark Teal
  '#5C3D2E', // Roasted Chestnut
  '#3E2723', // Deep Espresso
];

// Clean defaults: Start with an empty library so user can track their own books
export const INITIAL_BOOKS: Book[] = [];

export const INITIAL_SESSIONS: ReadingSession[] = [];

// Optional sample collection available if user wishes to test with sample data from Settings
export const SAMPLE_DEMO_BOOKS: Book[] = [
  {
    id: 'b-1',
    title: 'Deep Work: Rules for Focused Success',
    author: 'Cal Newport',
    category: 'Productivity & Business',
    totalPages: 304,
    currentPage: 218,
    language: 'English',
    status: 'Reading',
    format: 'Hardcover',
    rating: 4.8,
    startDate: '2026-09-24',
    coverColor: '#1E3A2F',
    tags: ['Focus', 'Productivity', 'Mindset'],
    quotes: [
      {
        id: 'q-1',
        text: 'Clarity about what matters provides clarity about what does not.',
        page: 64,
        dateAdded: '2026-09-28T10:00:00.000Z',
      },
    ],
    notes: 'Crucial distinction between shallow metrics and cognitively demanding deep tasks.',
    createdAt: '2026-09-24T10:00:00.000Z',
  },
  {
    id: 'b-2',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    category: 'Literary Fiction',
    totalPages: 320,
    currentPage: 320,
    language: 'English',
    status: 'Completed',
    format: 'Paperback',
    rating: 4.9,
    startDate: '2026-09-02',
    finishDate: '2026-09-18',
    coverColor: '#7A3E26',
    tags: ['Fiction', 'Empathy', 'Favorite'],
    notes: 'Remarkable exploration of empathy, solitude, and what constitutes the human heart.',
    createdAt: '2026-09-02T09:00:00.000Z',
  },
  {
    id: 'b-3',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    category: 'Productivity & Business',
    totalPages: 256,
    currentPage: 256,
    language: 'English',
    status: 'Completed',
    format: 'Paperback',
    rating: 4.7,
    startDate: '2026-08-10',
    finishDate: '2026-08-28',
    coverColor: '#2C3E50',
    notes: 'Doing well with money has a little to do with how smart you are and a lot to do with how you behave.',
    createdAt: '2026-08-10T14:30:00.000Z',
  },
];

export const SAMPLE_DEMO_SESSIONS: ReadingSession[] = [
  {
    id: 's-1',
    bookId: 'b-1',
    bookTitle: 'Deep Work: Rules for Focused Success',
    date: '2026-10-07',
    startPage: 194,
    endPage: 218,
    pagesRead: 24,
    readingMinutes: 35,
    notes: 'Chapter on eliminating social media and scheduling every minute of the day.',
    createdAt: '2026-10-07T18:30:00.000Z',
  },
  {
    id: 's-2',
    bookId: 'b-2',
    bookTitle: 'Klara and the Sun',
    date: '2026-09-17',
    startPage: 280,
    endPage: 320,
    pagesRead: 40,
    readingMinutes: 55,
    notes: 'The poignant closing chapter at the utility yard.',
    createdAt: '2026-09-17T21:30:00.000Z',
  },
];

export const INITIAL_GOALS: ReadingGoals = {
  daily: { target: 25, unit: 'pages' },
  weekly: { target: 150, unit: 'pages' },
  monthly: { target: 2, unit: 'books' },
  yearly: { target: 18, unit: 'books', year: 2026 },
};

export const INITIAL_SETTINGS: UserSettings = {
  userName: 'Shakib',
  currentYear: 2026,
};

// Storage helper functions
export const StorageService = {
  getBooks(): Book[] {
    try {
      // Clean up legacy v1 mock data if present
      const v1Data = localStorage.getItem('book_tracker_books_v1');
      if (v1Data) {
        try {
          const parsedV1 = JSON.parse(v1Data);
          const hasLegacyMock = Array.isArray(parsedV1) && parsedV1.some((b: Book) => b.id === 'b-1' || b.id === 'b-2' || b.id === 'b-3');
          if (hasLegacyMock) {
            localStorage.removeItem('book_tracker_books_v1');
            localStorage.removeItem('book_tracker_sessions_v1');
            localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify([]));
            localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify([]));
            return [];
          }
        } catch {
          localStorage.removeItem('book_tracker_books_v1');
        }
      }

      const data = localStorage.getItem(STORAGE_KEYS.BOOKS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
        return INITIAL_BOOKS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_BOOKS;
    }
  },

  saveBooks(books: Book[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
    } catch (err) {
      console.error('Failed to save books:', err);
    }
  },

  getSessions(): ReadingSession[] {
    try {
      // Clean up legacy v1 mock sessions if present
      const v1Data = localStorage.getItem('book_tracker_sessions_v1');
      if (v1Data) {
        try {
          const parsedV1 = JSON.parse(v1Data);
          const hasLegacyMock = Array.isArray(parsedV1) && parsedV1.some((s: ReadingSession) => s.id === 's-1' || s.id === 's-2');
          if (hasLegacyMock) {
            localStorage.removeItem('book_tracker_sessions_v1');
            localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify([]));
            return [];
          }
        } catch {
          localStorage.removeItem('book_tracker_sessions_v1');
        }
      }

      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(INITIAL_SESSIONS));
        return INITIAL_SESSIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SESSIONS;
    }
  },

  saveSessions(sessions: ReadingSession[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (err) {
      console.error('Failed to save sessions:', err);
    }
  },

  getGoals(): ReadingGoals {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(INITIAL_GOALS));
        return INITIAL_GOALS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_GOALS;
    }
  },

  saveGoals(goals: ReadingGoals): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    } catch (err) {
      console.error('Failed to save goals:', err);
    }
  },

  getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
        return INITIAL_SETTINGS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  },

  clearAllData(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify([]));
      localStorage.removeItem('book_tracker_books_v1');
      localStorage.removeItem('book_tracker_sessions_v1');
    } catch (err) {
      console.error('Failed to clear data:', err);
    }
  },

  loadDemoData(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(SAMPLE_DEMO_BOOKS));
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(SAMPLE_DEMO_SESSIONS));
    } catch (err) {
      console.error('Failed to load demo data:', err);
    }
  },

  resetAllData(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(INITIAL_SESSIONS));
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(INITIAL_GOALS));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      localStorage.removeItem('book_tracker_books_v1');
      localStorage.removeItem('book_tracker_sessions_v1');
    } catch (err) {
      console.error('Failed to reset all data:', err);
    }
  },

  exportJSON(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      books: this.getBooks(),
      sessions: this.getSessions(),
      goals: this.getGoals(),
      settings: this.getSettings(),
    };
    return JSON.stringify(backup, null, 2);
  },

  exportCSV(): string {
    const books = this.getBooks();
    const headers = ['Title', 'Author', 'Category', 'Status', 'Total Pages', 'Current Page', 'Progress %', 'Rating', 'Start Date', 'Finish Date', 'Language', 'Notes'];
    const rows = books.map((b) => {
      const progress = b.totalPages > 0 ? Math.round((b.currentPage / b.totalPages) * 100) : 0;
      return [
        `"${b.title.replace(/"/g, '""')}"`,
        `"${b.author.replace(/"/g, '""')}"`,
        `"${b.category.replace(/"/g, '""')}"`,
        `"${b.status}"`,
        b.totalPages,
        b.currentPage,
        `${progress}%`,
        b.rating || '',
        b.startDate || '',
        b.finishDate || '',
        `"${b.language}"`,
        `"${(b.notes || '').replace(/"/g, '""')}"`,
      ].join(',');
    });
    return [headers.join(','), ...rows].join('\n');
  },

  importJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.books)) {
        this.saveBooks(parsed.books);
      }
      if (Array.isArray(parsed.sessions)) {
        this.saveSessions(parsed.sessions);
      }
      if (parsed.goals && typeof parsed.goals === 'object') {
        this.saveGoals(parsed.goals);
      }
      if (parsed.settings && typeof parsed.settings === 'object') {
        this.saveSettings(parsed.settings);
      }
      return true;
    } catch (err) {
      console.error('Import failed:', err);
      return false;
    }
  },
};
