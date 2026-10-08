import React from 'react';
import { Book, Language } from '../../types';
import { ProgressBar } from '../common/ProgressBar';
import { Star, Edit3, ArrowUpRight, BookOpen } from 'lucide-react';
import { formatNumberByLang, translations } from '../../utils/i18n';

interface BookCardProps {
  book: Book;
  onOpenDetail: (book: Book) => void;
  onUpdateProgress: (book: Book) => void;
  onLogReading: (book: Book) => void;
  onEditBook: (book: Book) => void;
  language?: Language;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onOpenDetail,
  onUpdateProgress,
  onLogReading,
  onEditBook,
  language = 'bn',
}) => {
  const isBn = language === 'bn';
  const progressPct =
    book.totalPages > 0 ? Math.round((book.currentPage / book.totalPages) * 100) : 0;
  const remainingPages = Math.max(0, book.totalPages - book.currentPage);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'Reading':
        return {
          text: isBn ? 'বর্তমানে পড়ছি' : 'Reading',
          color: 'text-amber-800 font-medium',
        };
      case 'Completed':
        return {
          text: isBn ? 'পড়া সম্পন্ন' : 'Completed',
          color: 'text-emerald-700 font-medium',
        };
      case 'Want to Read':
        return {
          text: isBn ? 'পড়ার তালিকায়' : 'Want to Read',
          color: 'text-stone-500',
        };
      case 'Paused':
        return {
          text: isBn ? 'স্থগিত' : 'Paused',
          color: 'text-stone-400',
        };
      case 'Dropped':
        return {
          text: isBn ? 'অসমাপ্ত' : 'Dropped',
          color: 'text-rose-600',
        };
      default:
        return {
          text: status,
          color: 'text-stone-600',
        };
    }
  };

  const statusInfo = getStatusDisplay(book.status);

  return (
    <div className="bg-white border border-stone-200/80 rounded-xl p-4 sm:p-5 flex flex-col justify-between hover:border-stone-300 hover:shadow-xs transition-all duration-200 group">
      <div>
        {/* Book Cloth Cover & Header */}
        <div className="flex gap-4 mb-4">
          {/* Stylized Cloth-Bound Cover or Cover Image */}
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              referrerPolicy="no-referrer"
              onClick={() => onOpenDetail(book)}
              className="w-16 h-24 rounded-sm shadow-xs shrink-0 object-cover border border-black/10 cursor-pointer hover:opacity-95 transition-opacity"
            />
          ) : (
            <div
              onClick={() => onOpenDetail(book)}
              className="w-16 h-24 rounded-sm book-shadow shrink-0 flex flex-col justify-between p-2 text-white/95 relative overflow-hidden cursor-pointer hover:opacity-95 transition-all group-hover:-translate-y-0.5 border border-black/10 select-none"
              style={{ backgroundColor: book.coverColor || '#2C3E50' }}
            >
              {/* Book spine simulated crease */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black/25" />
              {/* Bookmark ribbon */}
              <div className="absolute right-2 top-0 w-1.5 h-3.5 bg-amber-400/90 rounded-b-xs shadow-2xs" />

              <div className="pl-1 flex flex-col justify-between h-full">
                <span className="font-serif text-[10px] leading-tight font-medium line-clamp-3 text-amber-50/90 drop-shadow-xs">
                  {book.title}
                </span>
                <span className="text-[9px] font-sans opacity-80 truncate text-stone-200">
                  {book.author.split(' ').pop()}
                </span>
              </div>
            </div>
          )}

          {/* Title & Metadata */}
          <div className="min-w-0 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-1">
                <h3
                  onClick={() => onOpenDetail(book)}
                  className="font-serif text-base font-semibold text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-2 cursor-pointer leading-snug"
                >
                  {book.title}
                </h3>
              </div>
              <p className="text-xs text-stone-500 truncate mt-1">{book.author}</p>
            </div>

            {/* Zero-pill metadata with calm separators */}
            <div className="text-xs text-stone-400 mt-2 flex flex-wrap items-center gap-1.5 font-sans">
              <span className={statusInfo.color}>{statusInfo.text}</span>
              <span aria-hidden="true">·</span>
              <span className="truncate max-w-[110px] text-stone-600">{book.category}</span>
              {book.format && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{book.format}</span>
                </>
              )}
            </div>

            {/* Optional Tags */}
            {book.tags && book.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 mt-1.5 text-[10px] text-stone-400 font-mono">
                {book.tags.slice(0, 3).map((t) => (
                  <span key={t}>#{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-1.5 pt-2 border-t border-stone-100">
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono tabular-nums text-stone-600">
              <strong className="text-stone-900 font-semibold">{formatNumberByLang(book.currentPage, language)}</strong> /{' '}
              {formatNumberByLang(book.totalPages, language)} {isBn ? 'পৃষ্ঠা' : 'p.'}
            </span>
            <span className="font-mono tabular-nums font-semibold text-stone-800">
              {formatNumberByLang(progressPct, language)}%
            </span>
          </div>

          <ProgressBar
            progress={progressPct}
            size="sm"
            color={book.status === 'Completed' ? 'bg-emerald-700' : 'bg-amber-700'}
          />

          <div className="flex justify-between items-center text-[11px] text-stone-400 pt-0.5">
            <span>
              {book.status === 'Completed'
                ? isBn ? 'সম্পন্ন' : 'Completed'
                : remainingPages > 0
                ? isBn
                  ? `${formatNumberByLang(remainingPages, language)} পৃষ্ঠা বাকি`
                  : `${remainingPages} pages left`
                : isBn ? 'সমাপ্ত' : 'Finished'}
            </span>
            {book.rating > 0 && (
              <span className="flex items-center gap-1 text-amber-800 font-medium">
                <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                <span className="font-mono tabular-nums">{formatNumberByLang(book.rating, language)}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Footer */}
      <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onUpdateProgress(book)}
            className="text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200/80 px-2 py-1 rounded transition-colors"
            title={isBn ? 'পৃষ্ঠা নম্বর পরিবর্তন করুন' : 'Update page number'}
          >
            {isBn ? 'পৃষ্ঠা আপডেট' : 'Update Page'}
          </button>
          <button
            onClick={() => onLogReading(book)}
            className="text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200/80 px-2 py-1 rounded transition-colors"
            title={isBn ? 'পড়ার সেশন রেকর্ড করুন' : 'Log reading session'}
          >
            {isBn ? 'সেশন লগ' : 'Log Session'}
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEditBook(book)}
            className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors"
            title={isBn ? 'বইয়ের বিবরণ সম্পাদনা' : 'Edit book'}
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onOpenDetail(book)}
            className="p-1 text-stone-400 hover:text-stone-900 rounded transition-colors"
            title={isBn ? 'বইয়ের পূর্ণাঙ্গ ডসিয়ার দেখুন' : 'View book dossier'}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
