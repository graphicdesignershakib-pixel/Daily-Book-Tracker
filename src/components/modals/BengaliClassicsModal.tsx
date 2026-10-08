import React, { useState } from 'react';
import { Book, BookQuote, Language } from '../../types';
import { X, BookOpen, Quote, Plus, Check, Sparkles, Search, Library } from 'lucide-react';
import { formatNumberByLang } from '../../utils/i18n';

interface BengaliClassicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (book: Partial<Book>) => void;
  onAddQuote: (quoteText: string, author: string, bookTitle: string) => void;
  language: Language;
}

interface ClassicBookPreset {
  title: string;
  author: string;
  category: string;
  totalPages: number;
  coverColor: string;
  description: string;
}

interface ClassicQuotePreset {
  text: string;
  author: string;
  source: string;
}

const CLASSIC_BOOKS: ClassicBookPreset[] = [
  {
    title: 'শেষের কবিতা',
    author: 'রবীন্দ্রনাথ ঠাকুর',
    category: 'Classic Literature & Fiction',
    totalPages: 160,
    coverColor: '#8C5332',
    description: 'অমিত ও লাবণ্যের মনস্তাত্ত্বিক প্রেম ও আধুনিক ভাবনার অমূল্য আখ্যান।',
  },
  {
    title: 'গীতাঞ্জলি',
    author: 'রবীন্দ্রনাথ ঠাকুর',
    category: 'Philosophy & Psychology',
    totalPages: 148,
    coverColor: '#B45309',
    description: 'নোবেল বিজয়ী অমর কাব্যগ্রন্থ ও আধ্যাত্মিক ভাবনার অনন্য স্ফুরণ।',
  },
  {
    title: 'পথের পাঁচালী',
    author: 'বিভূতিভূষণ বন্দ্যোপাধ্যায়',
    category: 'Classic Literature & Fiction',
    totalPages: 320,
    coverColor: '#15803D',
    description: 'অপু ও দুর্গার শৈশব এবং গ্রামীণ বাংলার অপরূপ প্রকৃতির ধ্রুপদী জীবনকথা।',
  },
  {
    title: 'সঞ্চিতা',
    author: 'কাজী নজরুল ইসলাম',
    category: 'Classic Literature & Fiction',
    totalPages: 240,
    coverColor: '#B91C1C',
    description: 'বিদ্রোহ ও প্রেমের চিরন্তন কবি নজরুলের শ্রেষ্ঠ কবিতার সংকলন।',
  },
  {
    title: 'জোছনা ও জননীর গল্প',
    author: 'হুমায়ূন আহমেদ',
    category: 'History & Biography',
    totalPages: 520,
    coverColor: '#1E3A8A',
    description: '১৯৭১ সালের মহান মুক্তিযুদ্ধকে উপজীব্য করে রচিত কালজয়ী মহাকাব্যিক উপন্যাস।',
  },
  {
    title: 'শ্রীকান্ত',
    author: 'শরৎচন্দ্র চট্টোপাধ্যায়',
    category: 'Classic Literature & Fiction',
    totalPages: 480,
    coverColor: '#4338CA',
    description: 'বাঙালি জীবনের সুখ-দুঃখ ও আত্মানুসন্ধানের সুবিশাল চার পর্বের উপন্যাস।',
  },
  {
    title: 'চাঁদের পাহাড়',
    author: 'বিভূতিভূষণ বন্দ্যোপাধ্যায়',
    category: 'Classic Literature & Fiction',
    totalPages: 180,
    coverColor: '#D97706',
    description: 'শঙ্করের আফ্রিকার দুর্গম জঙ্গল ও পর্বত অভিযানের রোমাঞ্চকর আখ্যান।',
  },
  {
    title: 'পদ্মা নদীর মাঝি',
    author: 'মানিক বন্দ্যোপাধ্যায়',
    category: 'Classic Literature & Fiction',
    totalPages: 190,
    coverColor: '#0F766E',
    description: 'পদ্মাপাড়ের ধীবর সমাজের বাস্তবমুখী জীবন ও হোসেন মিয়ার ময়নাদ্বীপ।',
  },
  {
    title: 'দেবী',
    author: 'হুমায়ূন আহমেদ',
    category: 'Mystery & Thriller',
    totalPages: 140,
    coverColor: '#0369A1',
    description: 'মিসির আলি চরিত্রের প্রথম উপন্যাস, যুক্তি ও অতিপ্রাকৃতের টানাপোড়েন।',
  },
];

const CLASSIC_QUOTES: ClassicQuotePreset[] = [
  {
    text: 'মানুষের অভ্যন্তরে যে অন্তহীন বিকাশক্ষমতা রয়েছে, শিক্ষাই তাকে পূর্ণাঙ্গ রূপে প্রস্ফুটিত করে।',
    author: 'রবীন্দ্রনাথ ঠাকুর',
    source: 'শিক্ষার হেরফের',
  },
  {
    text: 'কালের যাত্রার ধ্বনি শুনিতে কি পাও? তারি রথ নিত্যই উড়ায় অন্ধকারের ধূলি।',
    author: 'রবীন্দ্রনাথ ঠাকুর',
    source: 'শেষের কবিতা',
  },
  {
    text: 'গাহি সাম্যের গান— যেখানে আসিয়া এক হয়ে গেছে সব বাধা-ব্যবধান।',
    author: 'কাজী নজরুল ইসলাম',
    source: 'সাম্যবাদী',
  },
  {
    text: 'বই পড়িয়া মানুষ যে আনন্দ পায়, তাহা সংসারের আর কিছুতেই পাওয়া যায় না।',
    author: 'প্রমথ চৌধুরী',
    source: 'বই পড়া',
  },
  {
    text: 'পথের ক্লান্তি ভুলে যাও যদি থাকে একটি মনের মতো বই আর শান্ত প্রহর।',
    author: 'বিভূতিভূষণ বন্দ্যোপাধ্যায়',
    source: 'আরণ্যক',
  },
  {
    text: 'মানুষ যা চায় তা কখনোই পায় না, আর যা পায় তার মূল্য সে বোঝে না।',
    author: 'হুমায়ূন আহমেদ',
    source: 'অপেক্ষা',
  },
];

export const BengaliClassicsModal: React.FC<BengaliClassicsModalProps> = ({
  isOpen,
  onClose,
  onAddBook,
  onAddQuote,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'books' | 'quotes'>('books');
  const [search, setSearch] = useState<string>('');
  const [addedBooks, setAddedBooks] = useState<Record<string, boolean>>({});
  const [addedQuotes, setAddedQuotes] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const filteredBooks = CLASSIC_BOOKS.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  const filteredQuotes = CLASSIC_QUOTES.filter(
    (q) =>
      q.text.toLowerCase().includes(search.toLowerCase()) ||
      q.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddBookClick = (book: ClassicBookPreset) => {
    onAddBook({
      title: book.title,
      author: book.author,
      category: book.category,
      totalPages: book.totalPages,
      currentPage: 0,
      language: 'Bangla',
      status: 'Want to Read',
      coverColor: book.coverColor,
      notes: book.description,
    });
    setAddedBooks((prev) => ({ ...prev, [book.title]: true }));
  };

  const handleAddQuoteClick = (quote: ClassicQuotePreset) => {
    onAddQuote(quote.text, quote.author, quote.source);
    setAddedQuotes((prev) => ({ ...prev, [quote.text]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200/90 w-full max-w-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-900 font-serif">
                {language === 'bn' ? 'বাংলা সাহিত্যের রত্নভাণ্ডার' : 'Bengali Literary Classics & Quotes'}
              </h2>
              <p className="text-xs text-stone-500">
                {language === 'bn'
                  ? 'কালজয়ী বাংলা বই ও অমর সাহিত্যের উক্তি ১-ক্লিকে আপনার লাইব্রেরিতে যুক্ত করুন'
                  : 'Discover masterpieces of Bengali literature and save them directly to your library'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch & Search */}
        <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-50/20">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('books')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'books'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Library className="w-3.5 h-3.5" />
              {language === 'bn' ? 'ক্লাসিক বইসমূহ' : 'Classic Books'} ({CLASSIC_BOOKS.length})
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'quotes'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Quote className="w-3.5 h-3.5" />
              {language === 'bn' ? 'অমর বাণী ও উদ্ধৃতি' : 'Inspiring Quotes'} ({CLASSIC_QUOTES.length})
            </button>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'bn' ? 'বই বা লেখক খুঁজুন...' : 'Search books, authors...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-md border border-stone-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-stone-400"
            />
          </div>
        </div>

        {/* Content list */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
          {activeTab === 'books' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredBooks.map((b) => {
                const isAdded = !!addedBooks[b.title];
                return (
                  <div
                    key={b.title}
                    className="p-3.5 rounded-xl border border-stone-200/90 hover:border-stone-300 bg-white hover:bg-stone-50/40 transition-all flex flex-col justify-between space-y-2.5 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-8 rounded-xs shrink-0"
                            style={{ backgroundColor: b.coverColor }}
                          />
                          <div>
                            <h3 className="text-sm font-bold text-stone-900 font-serif leading-snug">
                              {b.title}
                            </h3>
                            <p className="text-xs font-medium text-amber-800">{b.author}</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded shrink-0">
                          {formatNumberByLang(b.totalPages, language)}{' '}
                          {language === 'bn' ? 'পৃষ্ঠা' : 'p'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                        {b.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">
                        {b.category.split('&')[0]}
                      </span>
                      <button
                        onClick={() => handleAddBookClick(b)}
                        disabled={isAdded}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                          isAdded
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                            : 'bg-stone-900 hover:bg-stone-800 text-white shadow-2xs active:translate-y-px'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            {language === 'bn' ? 'যুক্ত হয়েছে' : 'Added'}
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            {language === 'bn' ? 'লাইব্রেরিতে যোগ' : 'Add to Library'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQuotes.map((q) => {
                const isAdded = !!addedQuotes[q.text];
                return (
                  <div
                    key={q.text}
                    className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-serif italic text-stone-900 leading-relaxed">
                        "{q.text}"
                      </p>
                      <p className="text-xs font-medium text-amber-800">
                        — {q.author} <span className="text-stone-500 font-serif italic">({q.source})</span>
                      </p>
                    </div>

                    <button
                      onClick={() => handleAddQuoteClick(q)}
                      disabled={isAdded}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md shrink-0 transition-all ${
                        isAdded
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-stone-900 hover:bg-stone-800 text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          {language === 'bn' ? 'সংরক্ষিত' : 'Saved'}
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          {language === 'bn' ? 'উদ্ধৃতিতে যোগ' : 'Save Quote'}
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-200 bg-stone-50/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded-md transition-colors"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
