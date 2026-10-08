import React from 'react';
import { Book, ReadingSession, BookStatus } from '../../types';
import { X, Star, Calendar, Clock, BookOpen, Edit3, Trash2, CheckCircle2 } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

interface BookDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  sessions: ReadingSession[];
  onOpenEdit: (book: Book) => void;
  onOpenUpdateProgress: (book: Book) => void;
  onOpenLogReading: (book: Book) => void;
  onStatusChange: (bookId: string, newStatus: BookStatus) => void;
  onDeleteBook: (bookId: string) => void;
  onAddQuote?: (bookId: string, quoteText: string, page?: number) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  isOpen,
  onClose,
  book,
  sessions,
  onOpenEdit,
  onOpenUpdateProgress,
  onOpenLogReading,
  onStatusChange,
  onDeleteBook,
  onAddQuote,
}) => {
  const [newQuoteText, setNewQuoteText] = React.useState('');
  const [newQuotePage, setNewQuotePage] = React.useState<number | ''>('');
  const [showAddQuote, setShowAddQuote] = React.useState(false);

  if (!isOpen || !book) return null;

  const bookSessions = sessions.filter((s) => s.bookId === book.id);
  const progressPct =
    book.totalPages > 0 ? Math.round((book.currentPage / book.totalPages) * 100) : 0;
  const remainingPages = Math.max(0, book.totalPages - book.currentPage);

  // Reading duration calculation
  let durationText = 'In progress';
  if (book.startDate) {
    const start = new Date(book.startDate);
    const end = book.finishDate ? new Date(book.finishDate) : new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    durationText = `${diffDays} days`;
  }

  // Estimated completion date
  let estimatedFinishText = null;
  if (book.status === 'Reading' && remainingPages > 0) {
    const totalPagesLogged = bookSessions.reduce((acc, s) => acc + (s.pagesRead || 0), 0);
    const avgPace = bookSessions.length > 0 ? Math.max(5, Math.round(totalPagesLogged / bookSessions.length)) : 25;
    const estDays = Math.ceil(remainingPages / avgPace);
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + estDays);
    const formattedEstDate = estDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    estimatedFinishText = `~${estDays} days left at your current pace (~${avgPace} p/session) · Target finish: ${formattedEstDate}`;
  }

  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuoteText.trim() || !onAddQuote) return;
    onAddQuote(book.id, newQuoteText.trim(), typeof newQuotePage === 'number' ? newQuotePage : undefined);
    setNewQuoteText('');
    setNewQuotePage('');
    setShowAddQuote(false);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${book.title}" from your library?`)) {
      onDeleteBook(book.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[92vh] flex flex-col border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            Book Dossier
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenEdit(book);
              }}
              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
              title="Edit Book Details"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
              title="Delete Book"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Section: Cover & Metadata */}
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Cloth-bound cover */}
            <div
              className="w-28 h-40 rounded-sm shadow-md shrink-0 flex flex-col justify-between p-3 text-white border border-black/10 relative overflow-hidden select-none"
              style={{ backgroundColor: book.coverColor || '#2C3E50' }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/25" />
              <div className="pl-1.5 flex flex-col justify-between h-full">
                <span className="font-serif text-xs leading-snug font-medium line-clamp-4 text-amber-50">
                  {book.title}
                </span>
                <span className="text-[10px] font-sans opacity-75 truncate text-stone-200">
                  {book.author}
                </span>
              </div>
            </div>

            {/* Title, Author, Status, Rating */}
            <div className="min-w-0 flex-1 space-y-3">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
                  {book.title}
                </h2>
                <p className="text-sm text-stone-600 mt-1">by {book.author}</p>
              </div>

              {/* Zero-pill metadata line */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-sans">
                <span className="font-medium text-stone-800">{book.category}</span>
                <span aria-hidden="true">·</span>
                <span>{book.language}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{book.totalPages} pages</span>
              </div>

              {/* Status Selector & Rating */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400">Status:</span>
                  <select
                    value={book.status}
                    onChange={(e) => onStatusChange(book.id, e.target.value as BookStatus)}
                    className="bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-medium py-1 px-2.5 rounded-md text-stone-800 cursor-pointer focus:outline-hidden"
                  >
                    <option value="Want to Read">Want to Read</option>
                    <option value="Reading">Reading</option>
                    <option value="Completed">Completed</option>
                    <option value="Paused">Paused</option>
                    <option value="Dropped">Dropped</option>
                  </select>
                </div>

                {book.rating > 0 && (
                  <div className="flex items-center gap-1 text-xs text-amber-800 font-medium">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                    <span className="font-mono tabular-nums">{book.rating}.0 / 5.0</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Module */}
          <div className="bg-stone-50/80 border border-stone-200/80 rounded-xl p-4 sm:p-5 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="text-stone-500">Reading Progress: </span>
                <strong className="text-stone-900 font-mono tabular-nums text-sm">
                  {book.currentPage}
                </strong>
                <span className="text-stone-400 font-mono"> / {book.totalPages} pages</span>
              </div>
              <span className="font-mono tabular-nums font-semibold text-stone-800 text-sm">
                {progressPct}%
              </span>
            </div>

            <ProgressBar
              progress={progressPct}
              size="md"
              color={book.status === 'Completed' ? 'bg-emerald-700' : 'bg-amber-700'}
            />

            <div className="flex justify-between items-center text-xs text-stone-500 pt-1">
              <span>
                {book.status === 'Completed'
                  ? 'Finished'
                  : `${remainingPages} pages remaining`}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenUpdateProgress(book)}
                  className="px-2.5 py-1 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded transition-colors"
                >
                  Update Page
                </button>
                <button
                  onClick={() => onOpenLogReading(book)}
                  className="px-2.5 py-1 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded transition-colors"
                >
                  Log Session
                </button>
              </div>
            </div>

            {/* Estimated Finish Date */}
            {estimatedFinishText && (
              <div className="text-[11px] font-mono text-stone-600 bg-white/80 border border-stone-200/60 rounded px-2.5 py-1 mt-1">
                📅 {estimatedFinishText}
              </div>
            )}
          </div>

          {/* Dates & Timeline info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white border border-stone-200/70 p-3 rounded-lg">
              <span className="text-stone-400 block mb-0.5">Start Date</span>
              <span className="font-mono tabular-nums text-stone-800 font-medium">
                {book.startDate ? new Date(book.startDate).toLocaleDateString() : 'Not recorded'}
              </span>
            </div>

            <div className="bg-white border border-stone-200/70 p-3 rounded-lg">
              <span className="text-stone-400 block mb-0.5">Finish Date</span>
              <span className="font-mono tabular-nums text-stone-800 font-medium">
                {book.finishDate ? new Date(book.finishDate).toLocaleDateString() : 'In progress'}
              </span>
            </div>

            <div className="bg-white border border-stone-200/70 p-3 rounded-lg">
              <span className="text-stone-400 block mb-0.5">Reading Duration</span>
              <span className="font-mono tabular-nums text-stone-800 font-medium">
                {durationText}
              </span>
            </div>
          </div>

          {/* Quotes & Highlights */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Memorable Quotes & Highlights
              </h4>
              <button
                type="button"
                onClick={() => setShowAddQuote(!showAddQuote)}
                className="text-xs text-amber-800 hover:text-amber-900 font-medium"
              >
                {showAddQuote ? 'Cancel' : '+ Add Quote'}
              </button>
            </div>

            {showAddQuote && (
              <form onSubmit={handleCreateQuote} className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2 text-xs">
                <textarea
                  rows={2}
                  required
                  placeholder="Paste or type notable quote..."
                  value={newQuoteText}
                  onChange={(e) => setNewQuoteText(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded p-2 focus:outline-hidden font-serif"
                />
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-500">Page #:</span>
                    <input
                      type="number"
                      placeholder="e.g. 42"
                      value={newQuotePage}
                      onChange={(e) => setNewQuotePage(e.target.value ? Number(e.target.value) : '')}
                      className="w-20 bg-white border border-stone-200 rounded px-2 py-1 font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-stone-900 text-white rounded font-medium"
                  >
                    Save Quote
                  </button>
                </div>
              </form>
            )}

            {book.quotes && book.quotes.length > 0 ? (
              <div className="space-y-2">
                {book.quotes.map((q) => (
                  <div key={q.id} className="p-3 bg-amber-50/40 border border-amber-200/50 rounded-lg text-xs">
                    <p className="font-serif italic text-stone-800 leading-relaxed">
                      "{q.text}"
                    </p>
                    {q.page && (
                      <span className="block mt-1 text-[11px] font-mono text-stone-500">
                        — Page {q.page}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : !showAddQuote && (
              <p className="text-xs text-stone-400 italic">
                No quotes saved yet. Highlight resonant thoughts as you read.
              </p>
            )}
          </div>

          {/* Notes & Reflections */}
          {book.notes && (
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Notes & Literary Reflection
              </h4>
              <div className="bg-amber-50/40 border border-amber-200/40 rounded-lg p-4">
                <p className="font-serif italic text-stone-800 text-sm leading-relaxed">
                  "{book.notes}"
                </p>
              </div>
            </div>
          )}

          {/* Reading Session History for This Book */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Session Log History
              </h4>
              <span className="text-xs font-mono tabular-nums text-stone-400">
                {bookSessions.length} recorded {bookSessions.length === 1 ? 'session' : 'sessions'}
              </span>
            </div>

            {bookSessions.length === 0 ? (
              <p className="text-xs text-stone-400 italic">
                No individual sessions logged yet for this book.
              </p>
            ) : (
              <div className="divide-y divide-stone-100 border border-stone-200/70 rounded-lg overflow-hidden bg-white">
                {bookSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-3 text-xs flex items-center justify-between gap-3 font-mono tabular-nums"
                  >
                    <div>
                      <span className="text-stone-400 font-medium">
                        {new Date(session.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="mx-2 text-stone-300">·</span>
                      <span className="text-stone-700">
                        p. {session.startPage} → {session.endPage}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900">
                        +{session.pagesRead} pages
                      </span>
                      {session.readingMinutes > 0 && (
                        <span className="text-stone-400">({session.readingMinutes} min)</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
