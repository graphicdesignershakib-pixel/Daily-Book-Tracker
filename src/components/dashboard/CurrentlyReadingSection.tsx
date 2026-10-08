import React from 'react';
import { Book, Language } from '../../types';
import { ProgressBar } from '../common/ProgressBar';
import { ArrowRight, BookOpen, Timer } from 'lucide-react';
import { formatNumberByLang } from '../../utils/i18n';

interface CurrentlyReadingSectionProps {
  books: Book[];
  onOpenBookDetail: (book: Book) => void;
  onQuickUpdateProgress: (book: Book) => void;
  onQuickLogReading: (book: Book) => void;
  onViewAllBooks: () => void;
  onStartTimer?: (book: Book) => void;
  language?: Language;
}

export const CurrentlyReadingSection: React.FC<CurrentlyReadingSectionProps> = ({
  books,
  onOpenBookDetail,
  onQuickUpdateProgress,
  onQuickLogReading,
  onViewAllBooks,
  onStartTimer,
  language = 'bn',
}) => {
  return (
    <div className="bg-white border border-stone-200/80 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div>
          <h3 className="text-base font-semibold text-stone-900 tracking-tight font-serif">
            {language === 'bn' ? 'বর্তমানে পঠিত বইসমূহ' : 'Currently Reading'}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {language === 'bn' ? 'চলমান বইয়ের অগ্রগতির তালিকা' : 'Active volumes currently in progress'}
          </p>
        </div>
        <button
          onClick={onViewAllBooks}
          className="inline-flex items-center gap-1 text-xs font-medium text-amber-800 hover:text-amber-900 transition-colors"
        >
          <span>{language === 'bn' ? 'সম্পূর্ণ লাইব্রেরি' : 'Library'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {books.length === 0 ? (
        <div className="py-10 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-stone-800">
              {language === 'bn' ? 'বর্তমানে কোনো বই পড়ছেন না' : 'No active reading in progress'}
            </h4>
            <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1">
              {language === 'bn'
                ? 'লাইব্রেরি থেকে একটি বই পড়া শুরু করুন বা নতুন বই যোগ করে ট্র্যাকিং শুরু করুন।'
                : 'Pick a book from your library or add a new title to start tracking.'}
            </p>
          </div>
          <button
            onClick={onViewAllBooks}
            className="text-xs font-medium text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-md transition-colors"
          >
            {language === 'bn' ? 'লাইব্রেরি দেখুন' : 'Explore Library'}
          </button>
        </div>
      ) : (
        <div className="divide-y divide-stone-100 mt-1">
          {books.map((book) => {
            const progressPct =
              book.totalPages > 0 ? Math.round((book.currentPage / book.totalPages) * 100) : 0;
            const remainingPages = Math.max(0, book.totalPages - book.currentPage);

            return (
              <div
                key={book.id}
                className="py-4 first:pt-3 last:pb-1 group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div
                  className="flex items-start gap-3.5 cursor-pointer min-w-0"
                  onClick={() => onOpenBookDetail(book)}
                >
                  {/* Subtle Book Spine / Cloth indicator */}
                  <div
                    className="w-11 h-15 rounded-sm shrink-0 book-shadow flex flex-col justify-between p-1.5 text-white/95 border border-black/10 relative overflow-hidden transition-transform group-hover:-translate-y-0.5"
                    style={{ backgroundColor: book.coverColor || '#2C3E50' }}
                  >
                    {/* Spine crease */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-black/25" />
                    {/* Tiny golden bookmark ribbon accent */}
                    <div className="absolute right-2 top-0 w-1.5 h-3 bg-amber-400/90 rounded-b-xs shadow-2xs" />
                    <div className="w-full h-0.5 bg-white/20 pl-1" />
                    <span className="text-[9px] font-serif leading-none truncate opacity-85 pl-1 font-medium">
                      {book.author.split(' ').pop()}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-medium text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1 font-serif">
                      {book.title}
                    </h4>
                    <p className="text-xs text-stone-500 truncate mt-0.5">
                      {book.author}
                    </p>
                    {/* Zero-pill metadata line */}
                    <div className="flex items-center gap-2 text-xs text-stone-400 mt-1.5 font-sans">
                      <span className="text-stone-600">{book.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums text-stone-600">
                        {formatNumberByLang(book.currentPage, language)} / {formatNumberByLang(book.totalPages, language)} {language === 'bn' ? 'পৃ' : 'p'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Progress & Quick Actions */}
                <div className="sm:w-56 shrink-0 flex flex-col justify-center space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono tabular-nums font-semibold text-stone-800">
                      {formatNumberByLang(progressPct, language)}%
                    </span>
                    <span className="text-stone-500 font-mono tabular-nums text-[11px]">
                      {language === 'bn'
                        ? `${formatNumberByLang(remainingPages, language)} পৃ বাকি`
                        : `${remainingPages} pages left`}
                    </span>
                  </div>
                  <ProgressBar progress={progressPct} size="sm" color="bg-amber-800" />

                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => onQuickUpdateProgress(book)}
                      className="text-xs text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 border border-stone-200/80 px-2.5 py-1 rounded transition-colors"
                      title={language === 'bn' ? 'পৃষ্ঠা নম্বর পরিবর্তন করুন' : 'Update page number'}
                    >
                      {language === 'bn' ? 'পৃষ্ঠা আপডেট' : 'Update Page'}
                    </button>
                    <button
                      onClick={() => onQuickLogReading(book)}
                      className="text-xs font-medium text-amber-900 hover:text-amber-950 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/60 px-2.5 py-1 rounded transition-colors"
                      title={language === 'bn' ? 'এই বইয়ের পড়ার সেশন লগ করুন' : 'Log reading session'}
                    >
                      {language === 'bn' ? 'লগ' : 'Log'}
                    </button>
                    {onStartTimer && (
                      <button
                        onClick={() => onStartTimer(book)}
                        className="p-1 text-stone-400 hover:text-amber-800 hover:bg-amber-50 rounded transition-colors"
                        title={language === 'bn' ? 'এই বইটির সাথে টাইমার চালু করুন' : 'Start timer'}
                      >
                        <Timer className="w-3.5 h-3.5 text-amber-800" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
