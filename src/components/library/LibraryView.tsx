import React, { useState, useMemo } from 'react';
import { Book, BookStatus, Language } from '../../types';
import { BookCard } from './BookCard';
import { BookListRow } from './BookListRow';
import { BookshelfView } from './BookshelfView';
import { Plus, Search, LayoutGrid, List, SlidersHorizontal, BookOpen, X, Library, Sparkles } from 'lucide-react';
import { GENRES, LANGUAGES } from '../../services/storage';
import { formatNumberByLang } from '../../utils/i18n';

interface LibraryViewProps {
  books: Book[];
  externalSearchQuery?: string;
  onClearExternalSearch?: () => void;
  onOpenAddBook: () => void;
  onOpenDetail: (book: Book) => void;
  onUpdateProgress: (book: Book) => void;
  onLogReading: (book: Book) => void;
  onEditBook: (book: Book) => void;
  language?: Language;
  onOpenBengaliClassics?: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  books,
  externalSearchQuery,
  onClearExternalSearch,
  onOpenAddBook,
  onOpenDetail,
  onUpdateProgress,
  onLogReading,
  onEditBook,
  language = 'en',
  onOpenBengaliClassics,
}) => {
  const [activeStatus, setActiveStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>(externalSearchQuery || '');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedRating, setSelectedRating] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('recently-added');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'bookshelf'>('grid');

  React.useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: books.length,
      Reading: 0,
      Completed: 0,
      'Want to Read': 0,
      Paused: 0,
      Dropped: 0,
    };
    books.forEach((b) => {
      if (counts[b.status] !== undefined) {
        counts[b.status]++;
      }
    });
    return counts;
  }, [books]);

  // Filter & Sort
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Status filter
        if (activeStatus !== 'All' && book.status !== activeStatus) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = book.title.toLowerCase().includes(q);
          const matchAuthor = book.author.toLowerCase().includes(q);
          const matchGenre = book.category.toLowerCase().includes(q);
          if (!matchTitle && !matchAuthor && !matchGenre) return false;
        }

        // Genre filter
        if (selectedGenre !== 'All' && book.category !== selectedGenre) return false;

        // Language filter
        if (selectedLanguage !== 'All' && book.language !== selectedLanguage) return false;

        // Rating filter
        if (selectedRating !== 'All') {
          const minRating = Number(selectedRating);
          if ((book.rating || 0) < minRating) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'title':
            return a.title.localeCompare(b.title);
          case 'author':
            return a.author.localeCompare(b.author);
          case 'progress': {
            const pA = a.totalPages > 0 ? a.currentPage / a.totalPages : 0;
            const pB = b.totalPages > 0 ? b.currentPage / b.totalPages : 0;
            return pB - pA;
          }
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'pages':
            return b.totalPages - a.totalPages;
          case 'recently-added':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [books, activeStatus, searchQuery, selectedGenre, selectedLanguage, selectedRating, sortBy]);

  const hasActiveFilters =
    selectedGenre !== 'All' ||
    selectedLanguage !== 'All' ||
    selectedRating !== 'All' ||
    searchQuery.trim() !== '';

  const clearAllFilters = () => {
    setSearchQuery('');
    if (onClearExternalSearch) onClearExternalSearch();
    setSelectedGenre('All');
    setSelectedLanguage('All');
    setSelectedRating('All');
    setActiveStatus('All');
  };

  const statusTabs = [
    { id: 'All', labelEn: 'All Books', labelBn: 'সব বই' },
    { id: 'Reading', labelEn: 'Reading', labelBn: 'এখন পড়ছি' },
    { id: 'Completed', labelEn: 'Completed', labelBn: 'পড়া শেষ' },
    { id: 'Want to Read', labelEn: 'Want to Read', labelBn: 'পড়তে চাই' },
    { id: 'Paused', labelEn: 'Paused', labelBn: 'স্থগিত' },
    { id: 'Dropped', labelEn: 'Dropped', labelBn: 'ছেড়ে দিয়েছি' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
            {language === 'bn' ? 'আমার লাইব্রেরি' : 'My Books'}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {language === 'bn'
              ? 'ব্যক্তিগত বইয়ের সংগ্রহশালা, পড়ার অগ্রগতি এবং সাহিত্যিক ইতিহাস পর্যবেক্ষণ করুন।'
              : 'Manage your personal library, track progress, and review literary history.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onOpenBengaliClassics && (
            <button
              onClick={onOpenBengaliClassics}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 rounded-md transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>{language === 'bn' ? 'বাংলা সাহিত্যের রত্নভাণ্ডার' : 'Bengali Classics'}</span>
            </button>
          )}

          <button
            onClick={onOpenAddBook}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors shadow-xs active:translate-y-px whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন বই যোগ করুন' : 'Add Book'}</span>
          </button>
        </div>
      </div>

      {/* Status Segmented Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-stone-200/80 scrollbar-none">
        {statusTabs.map((status) => {
          const isActive = activeStatus === status.id;
          const count = statusCounts[status.id] || 0;
          return (
            <button
              key={status.id}
              onClick={() => setActiveStatus(status.id)}
              className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-2 ${
                isActive
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <span>{language === 'bn' ? status.labelBn : status.labelEn}</span>
              <span
                className={`text-[11px] font-mono tabular-nums px-1.5 py-0.2 rounded ${
                  isActive ? 'bg-stone-800 text-stone-200' : 'bg-stone-200/70 text-stone-600'
                }`}
              >
                {formatNumberByLang(count, language)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Controls Bar: Search, Filters, Sort, View Toggle */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-3.5 space-y-3 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={
                language === 'bn'
                  ? 'বইয়ের শিরোনাম, লেখক বা ক্যাটাগরি দিয়ে খুঁজুন...'
                  : 'Search by title, author, or genre...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-md py-1.5 pl-9 pr-8 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-stone-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* View Mode & Sort */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-stone-50 hover:bg-stone-100 border border-stone-200 py-1.5 px-2.5 rounded-md text-xs text-stone-700 cursor-pointer focus:outline-hidden"
            >
              <option value="recently-added">{language === 'bn' ? 'সম্প্রতি যোগ করা' : 'Recently Added'}</option>
              <option value="title">{language === 'bn' ? 'বইয়ের নাম (A-Z)' : 'Title (A-Z)'}</option>
              <option value="author">{language === 'bn' ? 'লেখক (A-Z)' : 'Author (A-Z)'}</option>
              <option value="progress">{language === 'bn' ? 'সর্বোচ্চ অগ্রগতি' : 'Highest Progress'}</option>
              <option value="rating">{language === 'bn' ? 'সর্বোচ্চ রেটিং' : 'Highest Rating'}</option>
              <option value="pages">{language === 'bn' ? 'পৃষ্ঠা সংখ্যা' : 'Page Count'}</option>
            </select>

            {/* View Toggles */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded-md border border-stone-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-2xs text-stone-900' : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-2xs text-stone-900' : 'text-stone-500 hover:text-stone-800'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('bookshelf')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'bookshelf' ? 'bg-white shadow-2xs text-stone-900' : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Spine Bookshelf view"
              >
                <Library className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Grid or List */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white border border-stone-200/90 rounded-xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="font-serif text-lg font-semibold text-stone-900">
              {language === 'bn' ? 'আপনার লাইব্রেরি সম্পূর্ণ ফ্রেশ ও প্রস্তুত।' : 'Your library is waiting.'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1.5">
              {language === 'bn'
                ? 'আপনার পছন্দের প্রথম বইটি যোগ করে পাঠযাত্রা শুরু করুন, অথবা বাংলা সাহিত্যের কালজয়ী সংকলন থেকে বই বেছে নিন।'
                : 'Add your first book and start building your reading journey, or explore classic literature presets.'}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
              >
                {language === 'bn' ? 'ফিল্টার পরিষ্কার করুন' : 'Clear Filters'}
              </button>
            )}
            {onOpenBengaliClassics && (
              <button
                onClick={onOpenBengaliClassics}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>{language === 'bn' ? 'বাংলা ক্লাসিক বই দেখুন' : 'Explore Bengali Classics'}</span>
              </button>
            )}
            <button
              onClick={onOpenAddBook}
              className="px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors shadow-xs"
            >
              {language === 'bn' ? 'নতুন বই যোগ করুন' : 'Add Book'}
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onOpenDetail={onOpenDetail}
              onUpdateProgress={onUpdateProgress}
              onLogReading={onLogReading}
              onEditBook={onEditBook}
              language={language}
            />
          ))}
        </div>
      ) : viewMode === 'bookshelf' ? (
        <BookshelfView
          books={filteredBooks}
          onOpenDetail={onOpenDetail}
          onUpdateProgress={onUpdateProgress}
        />
      ) : (
        <div className="bg-white border border-stone-200/90 rounded-xl overflow-hidden shadow-xs divide-y divide-stone-100">
          {filteredBooks.map((book) => (
            <BookListRow
              key={book.id}
              book={book}
              onOpenDetail={onOpenDetail}
              onUpdateProgress={onUpdateProgress}
              onLogReading={onLogReading}
              onEditBook={onEditBook}
            />
          ))}
        </div>
      )}
    </div>
  );
};
