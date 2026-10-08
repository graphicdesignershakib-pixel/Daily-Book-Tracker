import React from 'react';
import { Book } from '../../types';
import { ProgressBar } from '../common/ProgressBar';
import { Star, Edit3, ArrowUpRight, BookOpen } from 'lucide-react';

interface BookListRowProps {
  book: Book;
  onOpenDetail: (book: Book) => void;
  onUpdateProgress: (book: Book) => void;
  onLogReading: (book: Book) => void;
  onEditBook: (book: Book) => void;
}

export const BookListRow: React.FC<BookListRowProps> = ({
  book,
  onOpenDetail,
  onUpdateProgress,
  onLogReading,
  onEditBook,
}) => {
  const progressPct =
    book.totalPages > 0 ? Math.round((book.currentPage / book.totalPages) * 100) : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reading':
        return 'text-amber-800 font-medium';
      case 'Completed':
        return 'text-emerald-700 font-medium';
      case 'Want to Read':
        return 'text-stone-500';
      case 'Paused':
        return 'text-stone-400';
      case 'Dropped':
        return 'text-rose-600';
      default:
        return 'text-stone-600';
    }
  };

  return (
    <tr className="hover:bg-stone-50/80 transition-colors border-b border-stone-100 group">
      {/* Title & Author */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-10 rounded-xs shrink-0 border border-black/10"
            style={{ backgroundColor: book.coverColor || '#2C3E50' }}
          />
          <div className="min-w-0">
            <h4
              onClick={() => onOpenDetail(book)}
              className="text-sm font-medium text-stone-900 group-hover:text-amber-900 cursor-pointer truncate max-w-xs sm:max-w-sm"
            >
              {book.title}
            </h4>
            <p className="text-xs text-stone-500 truncate">{book.author}</p>
          </div>
        </div>
      </td>

      {/* Genre */}
      <td className="py-3 px-4 hidden md:table-cell text-xs text-stone-600 whitespace-nowrap">
        {book.category}
      </td>

      {/* Status */}
      <td className="py-3 px-4 text-xs whitespace-nowrap">
        <span className={getStatusColor(book.status)}>{book.status}</span>
      </td>

      {/* Progress */}
      <td className="py-3 px-4">
        <div className="w-32 sm:w-40 space-y-1">
          <div className="flex justify-between items-center text-[11px] font-mono tabular-nums text-stone-500">
            <span>
              {book.currentPage}/{book.totalPages}
            </span>
            <span className="font-semibold text-stone-800">{progressPct}%</span>
          </div>
          <ProgressBar
            progress={progressPct}
            size="sm"
            color={book.status === 'Completed' ? 'bg-emerald-700' : 'bg-amber-700'}
          />
        </div>
      </td>

      {/* Rating */}
      <td className="py-3 px-4 hidden sm:table-cell text-xs whitespace-nowrap">
        {book.rating > 0 ? (
          <span className="flex items-center gap-1 text-stone-700 font-mono tabular-nums">
            <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
            {book.rating}
          </span>
        ) : (
          <span className="text-stone-300">—</span>
        )}
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => onUpdateProgress(book)}
            className="text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 px-2 py-1 rounded transition-colors"
            title="Update Page"
          >
            Update
          </button>
          <button
            onClick={() => onLogReading(book)}
            className="text-xs text-amber-800 hover:text-amber-900 hover:bg-amber-50 px-2 py-1 rounded transition-colors"
            title="Log Reading"
          >
            Log
          </button>
          <button
            onClick={() => onEditBook(book)}
            className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors"
            title="Edit Book"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onOpenDetail(book)}
            className="p-1 text-stone-400 hover:text-stone-900 rounded transition-colors"
            title="View Dossier"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};
