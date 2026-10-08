import React, { useState, useEffect, useMemo } from 'react';
import {
  Book,
  ReadingSession,
  ReadingGoals,
  UserSettings,
  BookStatus,
  ThemeMode,
  Language,
  BookQuote,
} from './types';
import { StorageService } from './services/storage';
import { computeAnalytics } from './utils/analytics';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { MobileNav } from './components/common/MobileNav';
import { Toast } from './components/common/Toast';
import { DashboardView } from './components/dashboard/DashboardView';
import { GoalsView } from './components/goals/GoalsView';
import { LibraryView } from './components/library/LibraryView';
import { ReadingLogView } from './components/log/ReadingLogView';
import { SettingsView } from './components/settings/SettingsView';
import { QuotesView } from './components/quotes/QuotesView';
import { AddEditBookModal } from './components/modals/AddEditBookModal';
import { LogReadingModal } from './components/modals/LogReadingModal';
import { UpdateProgressModal } from './components/modals/UpdateProgressModal';
import { BookDetailModal } from './components/modals/BookDetailModal';
import { EditGoalsModal } from './components/modals/EditGoalsModal';
import { ReadingTimerModal } from './components/common/ReadingTimerModal';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';
import { ReadingWrapModal } from './components/modals/ReadingWrapModal';
import { QuoteCardModal } from './components/modals/QuoteCardModal';
import { ReadingSpeedModal } from './components/modals/ReadingSpeedModal';
import { BengaliClassicsModal } from './components/modals/BengaliClassicsModal';

export default function App() {
  // Core state
  const [books, setBooks] = useState<Book[]>(() => StorageService.getBooks());
  const [sessions, setSessions] = useState<ReadingSession[]>(() => StorageService.getSessions());
  const [goals, setGoals] = useState<ReadingGoals>(() => StorageService.getGoals());
  const [settings, setSettings] = useState<UserSettings>(() => StorageService.getSettings());
  const [theme, setTheme] = useState<ThemeMode>(() => settings.theme || 'editorial');
  const [language, setLanguage] = useState<Language>(() => settings.language || 'bn');
  const [selectedYear, setSelectedYear] = useState<number>(() => settings.currentYear || 2026);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isLogReadingOpen, setIsLogReadingOpen] = useState(false);
  const [logReadingPreselectedBook, setLogReadingPreselectedBook] = useState<Book | null>(null);
  const [isUpdateProgressOpen, setIsUpdateProgressOpen] = useState(false);
  const [progressBook, setProgressBook] = useState<Book | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailBook, setDetailBook] = useState<Book | null>(null);
  const [isEditGoalsOpen, setIsEditGoalsOpen] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [timerInitialBook, setTimerInitialBook] = useState<Book | null>(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isWrapOpen, setIsWrapOpen] = useState(false);

  // Special Features modals
  const [isQuoteCardOpen, setIsQuoteCardOpen] = useState(false);
  const [quoteCardInitialQuote, setQuoteCardInitialQuote] = useState<BookQuote | null>(null);
  const [isSpeedModalOpen, setIsSpeedModalOpen] = useState(false);
  const [speedModalInitialBook, setSpeedModalInitialBook] = useState<Book | null>(null);
  const [isBengaliClassicsOpen, setIsBengaliClassicsOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    setSettings((prev) => ({ ...prev, theme, language }));
  }, [theme, language]);

  // Sync state to storage
  useEffect(() => {
    StorageService.saveBooks(books);
  }, [books]);

  useEffect(() => {
    StorageService.saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    StorageService.saveGoals(goals);
  }, [goals]);

  useEffect(() => {
    StorageService.saveSettings(settings);
  }, [settings]);

  // Derived Analytics calculation strictly computed from actual underlying data
  const analytics = useMemo(() => {
    return computeAnalytics(books, sessions, goals, selectedYear);
  }, [books, sessions, goals, selectedYear]);

  // Toast trigger
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Language change handler
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setSettings((prev) => ({ ...prev, language: newLang }));
    showToast(newLang === 'bn' ? 'ভাষা বাংলায় পরিবর্তিত হয়েছে' : 'Language set to English');
  };

  // Reload data from storage (e.g. after import or demo reset)
  const handleReloadData = () => {
    setBooks(StorageService.getBooks());
    setSessions(StorageService.getSessions());
    setGoals(StorageService.getGoals());
    const s = StorageService.getSettings();
    setSettings(s);
    if (s.theme) setTheme(s.theme);
    if (s.language) setLanguage(s.language);
    if (s.currentYear) setSelectedYear(s.currentYear);
  };

  // Add / Edit book handler
  const handleSaveBook = (bookData: Partial<Book>) => {
    if (editingBook) {
      setBooks((prev) =>
        prev.map((b) => (b.id === editingBook.id ? ({ ...b, ...bookData } as Book) : b))
      );
      if (detailBook && detailBook.id === editingBook.id) {
        setDetailBook((prev) => (prev ? ({ ...prev, ...bookData } as Book) : null));
      }
      showToast(
        language === 'bn' ? `"${bookData.title}" আপডেট করা হয়েছে` : `Updated "${bookData.title}"`
      );
    } else {
      const newBook: Book = {
        id: `b-${Date.now()}`,
        title: bookData.title || (language === 'bn' ? 'শিরোনামহীন বই' : 'Untitled'),
        author: bookData.author || (language === 'bn' ? 'অজানা লেখক' : 'Unknown'),
        category: bookData.category || 'Classic Literature & Fiction',
        totalPages: Number(bookData.totalPages) || 1,
        currentPage: Number(bookData.currentPage) || 0,
        language: bookData.language || (language === 'bn' ? 'Bangla' : 'English'),
        status: (bookData.status as BookStatus) || 'Want to Read',
        rating: Number(bookData.rating) || 0,
        startDate: bookData.startDate,
        finishDate: bookData.finishDate,
        notes: bookData.notes,
        coverColor: bookData.coverColor || '#2C3E50',
        createdAt: new Date().toISOString(),
      };
      setBooks((prev) => [newBook, ...prev]);
      showToast(
        language === 'bn'
          ? `"${newBook.title}" লাইব্রেরিতে যোগ করা হয়েছে`
          : `Added "${newBook.title}" to library`
      );
    }
    setEditingBook(null);
  };

  // Delete book
  const handleDeleteBook = (bookId: string) => {
    const bookToDelete = books.find((b) => b.id === bookId);
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    showToast(
      language === 'bn'
        ? `"${bookToDelete?.title || 'বই'}" মুছে ফেলা হয়েছে`
        : `Removed "${bookToDelete?.title || 'Book'}" from library`
    );
    if (detailBook && detailBook.id === bookId) {
      setIsDetailOpen(false);
      setDetailBook(null);
    }
  };

  // Quick update progress
  const handleSaveProgress = (bookId: string, newPage: number, markCompleted: boolean) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        const total = b.totalPages;
        const clampedPage = Math.min(total, Math.max(0, newPage));
        const isDone = markCompleted || clampedPage >= total;
        return {
          ...b,
          currentPage: clampedPage,
          status: isDone
            ? ('Completed' as BookStatus)
            : b.status === 'Completed'
            ? 'Reading'
            : b.status,
          finishDate: isDone
            ? b.finishDate || new Date().toISOString().split('T')[0]
            : b.finishDate,
        };
      })
    );

    if (detailBook && detailBook.id === bookId) {
      setDetailBook((prev) =>
        prev
          ? {
              ...prev,
              currentPage: Math.min(prev.totalPages, Math.max(0, newPage)),
              status:
                markCompleted || newPage >= prev.totalPages
                  ? 'Completed'
                  : prev.status === 'Completed'
                  ? 'Reading'
                  : prev.status,
            }
          : null
      );
    }

    showToast(language === 'bn' ? 'পড়ার অগ্রগতি সংরক্ষিত হয়েছে' : 'Progress saved');
  };

  // Status change handler
  const handleStatusChange = (bookId: string, newStatus: BookStatus) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        return {
          ...b,
          status: newStatus,
          finishDate:
            newStatus === 'Completed'
              ? b.finishDate || new Date().toISOString().split('T')[0]
              : b.finishDate,
        };
      })
    );

    if (detailBook && detailBook.id === bookId) {
      setDetailBook((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    showToast(language === 'bn' ? `স্ট্যাটাস: ${newStatus}` : `Status updated to ${newStatus}`);
  };

  // Save reading session
  const handleSaveReadingSession = (
    sessionData: Omit<ReadingSession, 'id' | 'createdAt'>,
    updateBookPage: boolean
  ) => {
    const newSession: ReadingSession = {
      ...sessionData,
      id: `s-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setSessions((prev) => [newSession, ...prev]);

    if (updateBookPage) {
      setBooks((prev) =>
        prev.map((b) => {
          if (b.id !== sessionData.bookId) return b;
          const targetPage = Math.min(b.totalPages, Math.max(b.currentPage, sessionData.endPage));
          const isFinished = targetPage >= b.totalPages;
          return {
            ...b,
            currentPage: targetPage,
            status: isFinished ? ('Completed' as BookStatus) : 'Reading',
            startDate: b.startDate || sessionData.date,
            finishDate: isFinished ? b.finishDate || sessionData.date : b.finishDate,
          };
        })
      );
    }

    showToast(
      language === 'bn'
        ? `পড়ার সেশন রেকর্ড: +${sessionData.pagesRead} পৃষ্ঠা`
        : `Logged session: +${sessionData.pagesRead} pages`
    );
  };

  // Delete reading session
  const handleDeleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    showToast(language === 'bn' ? 'সেশন মুছে ফেলা হয়েছে' : 'Session removed from log');
  };

  // Save goals
  const handleSaveGoals = (newGoals: ReadingGoals) => {
    setGoals(newGoals);
    showToast(language === 'bn' ? 'পড়ার লক্ষ্যমাত্রা আপডেট হয়েছে' : 'Reading goals updated');
  };

  // Open modals helper
  const openAddBook = () => {
    setEditingBook(null);
    setIsAddBookOpen(true);
  };

  const openEditBook = (book: Book) => {
    setEditingBook(book);
    setIsAddBookOpen(true);
  };

  const openLogReading = (book?: Book | null) => {
    setLogReadingPreselectedBook(book || null);
    setIsLogReadingOpen(true);
  };

  const openUpdateProgress = (book: Book) => {
    setProgressBook(book);
    setIsUpdateProgressOpen(true);
  };

  const openBookDetail = (book: Book) => {
    setDetailBook(book);
    setIsDetailOpen(true);
  };

  // Add quote to book
  const handleAddQuote = (bookId: string, quoteText: string, page?: number) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        const newQuote = {
          id: `q-${Date.now()}`,
          text: quoteText,
          page,
          dateAdded: new Date().toISOString(),
        };
        const updatedQuotes = [...(b.quotes || []), newQuote];
        return { ...b, quotes: updatedQuotes };
      })
    );

    if (detailBook && detailBook.id === bookId) {
      setDetailBook((prev) =>
        prev
          ? {
              ...prev,
              quotes: [
                ...(prev.quotes || []),
                {
                  id: `q-${Date.now()}`,
                  text: quoteText,
                  page,
                  dateAdded: new Date().toISOString(),
                },
              ],
            }
          : null
      );
    }
  };

  // Add classic book preset
  const handleAddClassicBook = (classicBook: Partial<Book>) => {
    const newBook: Book = {
      id: `b-${Date.now()}`,
      title: classicBook.title || 'Classic Book',
      author: classicBook.author || 'Author',
      category: classicBook.category || 'Classic Literature & Fiction',
      totalPages: classicBook.totalPages || 200,
      currentPage: 0,
      language: 'Bangla',
      status: 'Want to Read',
      rating: 0,
      notes: classicBook.notes,
      coverColor: classicBook.coverColor || '#8C5332',
      createdAt: new Date().toISOString(),
    };
    setBooks((prev) => [newBook, ...prev]);
    showToast(
      language === 'bn'
        ? `"${newBook.title}" লাইব্রেরিতে যোগ করা হয়েছে`
        : `Added "${newBook.title}" to library`
    );
  };

  // Add classic quote preset
  const handleAddClassicQuote = (text: string, author: string, source: string) => {
    // If we have a book by this title or author, attach it; otherwise attach to first book or create book
    let matchedBook = books.find((b) => b.title === source || b.author === author);
    if (!matchedBook) {
      const createdBook: Book = {
        id: `b-${Date.now()}`,
        title: source || 'বাংলা সাহিত্য সংকলন',
        author: author || 'অমর সাহিত্যিক',
        category: 'Classic Literature & Fiction',
        totalPages: 180,
        currentPage: 0,
        language: 'Bangla',
        status: 'Want to Read',
        rating: 5,
        coverColor: '#8C5332',
        createdAt: new Date().toISOString(),
        quotes: [
          {
            id: `q-${Date.now()}`,
            text,
            author,
            bookTitle: source,
            dateAdded: new Date().toISOString(),
          },
        ],
      };
      setBooks((prev) => [createdBook, ...prev]);
    } else {
      handleAddQuote(matchedBook.id, text);
    }
    showToast(
      language === 'bn'
        ? 'উদ্ধৃতিটি আপনার কোটস তালিকায় যুক্ত হয়েছে'
        : 'Quote added to your collection'
    );
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        if (e.key === 'Escape') {
          target.blur();
        }
        return;
      }

      if (e.key === 'Escape') {
        setIsAddBookOpen(false);
        setIsLogReadingOpen(false);
        setIsUpdateProgressOpen(false);
        setIsDetailOpen(false);
        setIsEditGoalsOpen(false);
        setIsTimerOpen(false);
        setIsShortcutsOpen(false);
        setIsQuoteCardOpen(false);
        setIsSpeedModalOpen(false);
        setIsBengaliClassicsOpen(false);
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'b' || key === 'n') {
        e.preventDefault();
        openAddBook();
      } else if (key === 'l') {
        e.preventDefault();
        openLogReading();
      } else if (key === 't') {
        e.preventDefault();
        setIsTimerOpen(true);
      } else if (key === 'w') {
        e.preventDefault();
        setIsWrapOpen(true);
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(true);
      } else if (key === '1') {
        setActiveTab('dashboard');
      } else if (key === '2') {
        setActiveTab('goals');
      } else if (key === '3') {
        setActiveTab('books');
      } else if (key === '4') {
        setActiveTab('quotes');
      } else if (key === '5') {
        setActiveTab('log');
      } else if (key === '6') {
        setActiveTab('settings');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openTimer = (book?: Book | null) => {
    setTimerInitialBook(book || null);
    setIsTimerOpen(true);
  };

  const handleFinishTimerSession = (book: Book, minutesElapsed: number) => {
    setLogReadingPreselectedBook(book);
    setIsLogReadingOpen(true);
  };

  // Collect all quotes across library
  const allQuotes = useMemo(() => {
    const list: BookQuote[] = [];
    books.forEach((b) => {
      if (b.quotes) {
        b.quotes.forEach((q) => {
          list.push({ ...q, author: b.author, bookTitle: b.title });
        });
      }
    });
    return list;
  }, [books]);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 flex">
      {/* Desktop Fixed/Collapsible Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        streakDays={analytics.currentStreakDays}
        totalBooksCount={books.length}
        language={language}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-12">
        {/* Top Header */}
        <Header
          currentYear={selectedYear}
          onYearChange={(y) => setSelectedYear(y)}
          onOpenAddBook={openAddBook}
          onOpenLogReading={() => openLogReading()}
          onOpenTimer={() => openTimer()}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onOpenWrap={() => setIsWrapOpen(true)}
          onOpenQuoteCard={() => {
            setQuoteCardInitialQuote(allQuotes[0] || null);
            setIsQuoteCardOpen(true);
          }}
          onOpenSpeedEstimator={() => {
            setSpeedModalInitialBook(books.find((b) => b.status === 'Reading') || books[0] || null);
            setIsSpeedModalOpen(true);
          }}
          onOpenBengaliClassics={() => setIsBengaliClassicsOpen(true)}
          theme={theme}
          onThemeChange={(newTheme) => setTheme(newTheme)}
          language={language}
          onLanguageChange={handleLanguageChange}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (q && activeTab !== 'books') {
              setActiveTab('books');
            }
          }}
          activeTab={activeTab}
        />

        {/* Viewport Content Container */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              userName={settings.userName}
              selectedYear={selectedYear}
              books={books}
              sessions={sessions}
              analytics={analytics}
              onOpenAddBook={openAddBook}
              onOpenLogReading={() => openLogReading()}
              onOpenBookDetail={openBookDetail}
              onQuickUpdateProgress={openUpdateProgress}
              onQuickLogReading={(book) => openLogReading(book)}
              onNavigateToGoals={() => setActiveTab('goals')}
              onNavigateToBooks={() => setActiveTab('books')}
              onNavigateToLog={() => setActiveTab('log')}
              onEditGoals={() => setIsEditGoalsOpen(true)}
              onStartTimer={(book) => openTimer(book)}
              onSaveSession={handleSaveReadingSession}
              onOpenQuoteCard={(quote, bookTitle, author) => {
                if (quote) {
                  setQuoteCardInitialQuote({ ...quote, bookTitle, author });
                }
                setIsQuoteCardOpen(true);
              }}
              language={language}
            />
          )}

          {activeTab === 'goals' && (
            <GoalsView
              analytics={analytics}
              selectedYear={selectedYear}
              books={books}
              sessions={sessions}
              onEditGoals={() => setIsEditGoalsOpen(true)}
              onOpenLogReading={() => openLogReading()}
              language={language}
            />
          )}

          {activeTab === 'books' && (
            <LibraryView
              books={books}
              externalSearchQuery={searchQuery}
              onClearExternalSearch={() => setSearchQuery('')}
              onOpenAddBook={openAddBook}
              onOpenDetail={openBookDetail}
              onUpdateProgress={openUpdateProgress}
              onLogReading={(book) => openLogReading(book)}
              onEditBook={openEditBook}
              language={language}
              onOpenBengaliClassics={() => setIsBengaliClassicsOpen(true)}
            />
          )}

          {activeTab === 'quotes' && (
            <QuotesView
              books={books}
              onOpenBookDetail={openBookDetail}
              onAddQuoteToBook={handleAddQuote}
              showToast={showToast}
              language={language}
              onOpenCardStudio={(quote) => {
                setQuoteCardInitialQuote(quote);
                setIsQuoteCardOpen(true);
              }}
              onOpenBengaliClassics={() => setIsBengaliClassicsOpen(true)}
            />
          )}

          {activeTab === 'log' && (
            <ReadingLogView
              sessions={sessions}
              books={books}
              onOpenLogReading={() => openLogReading()}
              onDeleteSession={handleDeleteSession}
              language={language}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={(newSettings) => setSettings(newSettings)}
              onDataReloaded={handleReloadData}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={language}
      />

      {/* Interactive Dialogs & Modals */}
      <AddEditBookModal
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
        onSaveBook={handleSaveBook}
        initialBook={editingBook}
      />

      <LogReadingModal
        isOpen={isLogReadingOpen}
        onClose={() => setIsLogReadingOpen(false)}
        books={books}
        onSaveSession={handleSaveReadingSession}
        preselectedBook={logReadingPreselectedBook}
      />

      <UpdateProgressModal
        isOpen={isUpdateProgressOpen}
        onClose={() => setIsUpdateProgressOpen(false)}
        book={progressBook}
        onSaveProgress={handleSaveProgress}
      />

      <BookDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        book={detailBook}
        sessions={sessions}
        onOpenEdit={openEditBook}
        onOpenUpdateProgress={openUpdateProgress}
        onOpenLogReading={(book) => openLogReading(book)}
        onStatusChange={handleStatusChange}
        onDeleteBook={handleDeleteBook}
        onAddQuote={handleAddQuote}
      />

      <EditGoalsModal
        isOpen={isEditGoalsOpen}
        onClose={() => setIsEditGoalsOpen(false)}
        goals={goals}
        onSaveGoals={handleSaveGoals}
      />

      <ReadingTimerModal
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
        books={books}
        onFinishTimerSession={handleFinishTimerSession}
        initialBook={timerInitialBook}
      />

      <ReadingWrapModal
        isOpen={isWrapOpen}
        onClose={() => setIsWrapOpen(false)}
        selectedYear={selectedYear}
        userName={settings.userName}
        books={books}
        sessions={sessions}
        analytics={analytics}
        showToast={showToast}
      />

      {/* SPECIAL FEATURES MODALS */}
      <QuoteCardModal
        isOpen={isQuoteCardOpen}
        onClose={() => setIsQuoteCardOpen(false)}
        quotes={allQuotes}
        books={books}
        initialQuote={quoteCardInitialQuote}
        userName={settings.userName}
        language={language}
      />

      <ReadingSpeedModal
        isOpen={isSpeedModalOpen}
        onClose={() => setIsSpeedModalOpen(false)}
        books={books}
        sessions={sessions}
        language={language}
        initialBook={speedModalInitialBook}
      />

      <BengaliClassicsModal
        isOpen={isBengaliClassicsOpen}
        onClose={() => setIsBengaliClassicsOpen(false)}
        onAddBook={handleAddClassicBook}
        onAddQuote={handleAddClassicQuote}
        language={language}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Floating Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
