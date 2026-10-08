import React, { useState, useMemo } from 'react';
import { Book, BookQuote, Language } from '../../types';
import { Quote, Search, Copy, Check, Plus, Sparkles, Image as ImageIcon } from 'lucide-react';
import { formatNumberByLang } from '../../utils/i18n';

interface QuotesViewProps {
  books: Book[];
  onOpenBookDetail: (book: Book) => void;
  onAddQuoteToBook: (bookId: string, text: string, page?: number) => void;
  showToast: (msg: string) => void;
  language?: Language;
  onOpenCardStudio?: (quote: BookQuote) => void;
  onOpenBengaliClassics?: () => void;
}

export const QuotesView: React.FC<QuotesViewProps> = ({
  books,
  onOpenBookDetail,
  onAddQuoteToBook,
  showToast,
  language = 'en',
  onOpenCardStudio,
  onOpenBengaliClassics,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookFilter, setSelectedBookFilter] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New quote modal/drawer
  const [isAdding, setIsAdding] = useState(false);
  const [targetBookId, setTargetBookId] = useState(books[0]?.id || '');
  const [quoteText, setQuoteText] = useState('');
  const [quotePage, setQuotePage] = useState<number | ''>('');

  // Collect all quotes
  const allQuotes = useMemo(() => {
    const list: {
      quote: BookQuote;
      book: Book;
    }[] = [];

    books.forEach((b) => {
      if (b.quotes && b.quotes.length > 0) {
        b.quotes.forEach((q) => {
          list.push({ quote: q, book: b });
        });
      }
    });

    return list.sort(
      (a, b) => new Date(b.quote.dateAdded).getTime() - new Date(a.quote.dateAdded).getTime()
    );
  }, [books]);

  // Filter quotes
  const filteredQuotes = useMemo(() => {
    return allQuotes.filter(({ quote, book }) => {
      if (selectedBookFilter !== 'All' && book.id !== selectedBookFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchQuote = quote.text.toLowerCase().includes(q);
        const matchTitle = book.title.toLowerCase().includes(q);
        const matchAuthor = book.author.toLowerCase().includes(q);
        if (!matchQuote && !matchTitle && !matchAuthor) return false;
      }
      return true;
    });
  }, [allQuotes, selectedBookFilter, searchQuery]);

  const handleCopyQuote = (quote: BookQuote, book: Book) => {
    const pageText = quote.page
      ? ` (${language === 'bn' ? `পৃষ্ঠা ${formatNumberByLang(quote.page, 'bn')}` : `p. ${quote.page}`})`
      : '';
    const text = `"${quote.text}" — ${book.author}, ${book.title}${pageText}`;
    navigator.clipboard.writeText(text);
    setCopiedId(quote.id);
    showToast(language === 'bn' ? 'উদ্ধৃতি কপি করা হয়েছে!' : 'Quote copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBookId || !quoteText.trim()) return;
    onAddQuoteToBook(
      targetBookId,
      quoteText.trim(),
      typeof quotePage === 'number' ? quotePage : undefined
    );
    setQuoteText('');
    setQuotePage('');
    setIsAdding(false);
    showToast(language === 'bn' ? 'নতুন উদ্ধৃতি সংরক্ষিত হয়েছে' : 'Quote saved successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
            {language === 'bn' ? 'উদ্ধৃতি ও স্মরণীয় নোট' : 'Quotes & Highlights'}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {language === 'bn'
              ? 'আপনার পড়া বইয়ের প্রিয় ভাবনা, শিক্ষা ও অমূল্য সাহিত্যের সংকলন।'
              : 'A personal treasury of memorable passages and literary wisdom.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onOpenBengaliClassics && (
            <button
              onClick={onOpenBengaliClassics}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 rounded-md transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>{language === 'bn' ? 'বাংলা সাহিত্যের ক্লাসিকস' : 'Literary Classics'}</span>
            </button>
          )}

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors shadow-xs active:translate-y-px whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>
              {isAdding
                ? language === 'bn' ? 'ফর্ম বন্ধ করুন' : 'Close Form'
                : language === 'bn' ? 'উদ্ধৃতি যোগ করুন' : 'Add Quote'}
            </span>
          </button>
        </div>
      </div>

      {/* Add Quote Inline Card */}
      {isAdding && (
        <form
          onSubmit={handleSaveQuote}
          className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs space-y-4 animate-in fade-in duration-150"
        >
          <h3 className="text-sm font-semibold text-stone-900 font-sans">
            {language === 'bn' ? 'বইয়ের সাথে নতুন উদ্ধৃতি যোগ করুন' : 'Add New Quote to Library'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label className="block text-stone-600 mb-1 font-medium">
                {language === 'bn' ? 'বই নির্বাচন করুন' : 'Select Book'}
              </label>
              {books.length === 0 ? (
                <div className="text-xs text-stone-500 bg-stone-50 border border-stone-200 rounded-md p-2 font-sans">
                  {language === 'bn'
                    ? 'লাইব্রেরিতে কোনো বই নেই। উদ্ধৃতি যুক্ত করতে প্রথমে একটি বই যোগ করুন।'
                    : 'No books in library yet. Add a book first to attach quotes.'}
                </div>
              ) : (
                <select
                  value={targetBookId}
                  onChange={(e) => setTargetBookId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-md py-2 px-3 focus:outline-hidden"
                >
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.author})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-stone-600 mb-1 font-medium">
                {language === 'bn' ? 'পৃষ্ঠা নম্বর (ঐচ্ছিক)' : 'Page Number (Optional)'}
              </label>
              <input
                type="number"
                placeholder="e.g. 142"
                value={quotePage}
                onChange={(e) => setQuotePage(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-stone-50 border border-stone-200 rounded-md py-2 px-3 font-mono focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-600 mb-1 text-xs font-medium">
              {language === 'bn' ? 'উদ্ধৃতির বক্তব্য' : 'Quote Text'}
            </label>
            <textarea
              rows={3}
              required
              placeholder={language === 'bn' ? 'উদ্ধৃতিটি এখানে লিখুন...' : 'Paste or write quote...'}
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-md p-3 text-sm focus:outline-hidden font-serif"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3.5 py-1.5 text-xs text-stone-600 hover:text-stone-900"
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={books.length === 0}
              className="px-4 py-1.5 text-xs font-medium bg-stone-900 text-white rounded-md shadow-xs disabled:opacity-50"
            >
              {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Quote'}
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={language === 'bn' ? 'উদ্ধৃতি, বই বা লেখক খুঁজুন...' : 'Search quotes, books, authors...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-md py-1.5 pl-9 pr-3 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-stone-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500">
            {language === 'bn' ? 'বই ফিল্টার:' : 'Filter Book:'}
          </span>
          <select
            value={selectedBookFilter}
            onChange={(e) => setSelectedBookFilter(e.target.value)}
            className="bg-stone-50 hover:bg-stone-100 border border-stone-200 py-1.5 px-2.5 rounded-md text-xs text-stone-700 cursor-pointer focus:outline-hidden max-w-[200px] truncate"
          >
            <option value="All">{language === 'bn' ? 'সব বই' : 'All Books'}</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quotes Cards Grid */}
      {filteredQuotes.length === 0 ? (
        <div className="bg-white border border-stone-200/90 rounded-xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
            <Quote className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="font-serif text-lg font-semibold text-stone-900">
              {language === 'bn' ? 'কোনো উদ্ধৃতি পাওয়া যায়নি।' : 'No quotes found.'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1.5">
              {language === 'bn'
                ? 'বই পড়ার সময় প্রিয় লাইনগুলো সংরক্ষণ করুন অথবা ওপরের বাটন দিয়ে নতুন উদ্ধৃতি যুক্ত করুন।'
                : 'Highlight passages while reading or add your first quote to build your literary anthology.'}
            </p>
          </div>
          {books.length > 0 ? (
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors shadow-xs"
            >
              {language === 'bn' ? 'প্রথম উদ্ধৃতি যোগ করুন' : 'Add First Quote'}
            </button>
          ) : (
            <p className="text-xs text-stone-400">
              {language === 'bn'
                ? 'উদ্ধৃতি যুক্ত করার জন্য লাইব্রেরিতে প্রথমে একটি বই যোগ করুন।'
                : 'Add a book to your library first to attach quotes and highlights.'}
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredQuotes.map(({ quote, book }) => (
            <div
              key={quote.id}
              className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-stone-300 transition-colors group"
            >
              <div>
                <Quote className="w-5 h-5 text-amber-700/40 mb-3" />
                <p className="font-serif italic text-stone-800 text-sm sm:text-base leading-relaxed">
                  "{quote.text}"
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                <div
                  onClick={() => onOpenBookDetail(book)}
                  className="flex items-center gap-2.5 cursor-pointer min-w-0"
                >
                  <div
                    className="w-3.5 h-5 rounded-xs shrink-0 border border-black/10"
                    style={{ backgroundColor: book.coverColor || '#2C3E50' }}
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-stone-900 group-hover:text-amber-800 truncate">
                      {book.title}
                    </h4>
                    <span className="text-[11px] text-stone-500 truncate block">
                      {book.author}
                      {quote.page && (
                        <span>
                          {' '}
                          · {language === 'bn' ? `পৃষ্ঠা ${formatNumberByLang(quote.page, 'bn')}` : `p. ${quote.page}`}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {onOpenCardStudio && (
                    <button
                      onClick={() =>
                        onOpenCardStudio({
                          ...quote,
                          author: book.author,
                          bookTitle: book.title,
                        })
                      }
                      className="p-1.5 text-stone-400 hover:text-amber-800 rounded-md transition-colors"
                      title={language === 'bn' ? 'শেয়ারযোগ্য কার্ড তৈরি করুন' : 'Create shareable card'}
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleCopyQuote(quote, book)}
                    className="p-1.5 text-stone-400 hover:text-stone-800 rounded-md transition-colors"
                    title={language === 'bn' ? 'উদ্ধৃতি কপি করুন' : 'Copy quote with attribution'}
                  >
                    {copiedId === quote.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
