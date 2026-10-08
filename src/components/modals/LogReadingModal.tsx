import React, { useState, useEffect } from 'react';
import { Book, ReadingSession } from '../../types';
import { X, Clock, Layers, BookOpen } from 'lucide-react';

interface LogReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  onSaveSession: (sessionData: Omit<ReadingSession, 'id' | 'createdAt'>, updateBookPage: boolean) => void;
  preselectedBook?: Book | null;
}

export const LogReadingModal: React.FC<LogReadingModalProps> = ({
  isOpen,
  onClose,
  books,
  onSaveSession,
  preselectedBook,
}) => {
  const [selectedBookId, setSelectedBookId] = useState('');
  const [date, setDate] = useState('');
  const [startPage, setStartPage] = useState<number | ''>(0);
  const [endPage, setEndPage] = useState<number | ''>(0);
  const [pagesReadDirect, setPagesReadDirect] = useState<number | ''>('');
  const [isManualPages, setIsManualPages] = useState(false);
  const [readingMinutes, setReadingMinutes] = useState<number | ''>(30);
  const [notes, setNotes] = useState('');
  const [autoAdvanceBook, setAutoAdvanceBook] = useState(true);
  const [error, setError] = useState('');

  // Find currently selected book
  const currentBook = books.find((b) => b.id === selectedBookId);

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setDate(today);

      let targetBook = preselectedBook;
      if (!targetBook) {
        // default to first reading book or first book in list
        targetBook = books.find((b) => b.status === 'Reading') || books[0];
      }

      if (targetBook) {
        setSelectedBookId(targetBook.id);
        const curPage = targetBook.currentPage || 0;
        setStartPage(curPage);
        setEndPage(Math.min(targetBook.totalPages, curPage + 20));
      } else {
        setSelectedBookId('');
        setStartPage(0);
        setEndPage(20);
      }
      setIsManualPages(false);
      setPagesReadDirect('');
      setReadingMinutes(30);
      setNotes('');
      setAutoAdvanceBook(true);
      setError('');
    }
  }, [isOpen, preselectedBook, books]);

  // When book selection changes, sync start page
  const handleBookChange = (bookId: string) => {
    setSelectedBookId(bookId);
    const book = books.find((b) => b.id === bookId);
    if (book) {
      const cur = book.currentPage || 0;
      setStartPage(cur);
      setEndPage(Math.min(book.totalPages, cur + 20));
    }
  };

  if (!isOpen) return null;

  // Derived pages read
  const calcPagesRead = isManualPages
    ? Number(pagesReadDirect) || 0
    : Math.max(0, (Number(endPage) || 0) - (Number(startPage) || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentBook) {
      setError('Please select a book to log reading.');
      return;
    }

    const numStart = Number(startPage) || 0;
    const numEnd = Number(endPage) || 0;
    const pages = isManualPages ? Number(pagesReadDirect) || 0 : numEnd - numStart;

    if (pages <= 0) {
      setError('Pages read must be greater than zero.');
      return;
    }

    if (!isManualPages && numEnd > currentBook.totalPages) {
      setError(`Ending page cannot exceed book's total pages (${currentBook.totalPages}).`);
      return;
    }

    onSaveSession(
      {
        bookId: currentBook.id,
        bookTitle: currentBook.title,
        date: date || new Date().toISOString().split('T')[0],
        startPage: numStart,
        endPage: isManualPages ? numStart + pages : numEnd,
        pagesRead: pages,
        readingMinutes: Number(readingMinutes) || 0,
        notes: notes.trim() || undefined,
      },
      autoAdvanceBook
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-900">
              Log Reading Session
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Record pages completed today to update your daily goals and analytics.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {error && (
            <div className="p-3 rounded-md bg-rose-50 text-rose-700 text-xs border border-rose-200">
              {error}
            </div>
          )}

          {/* Book selector */}
          <div>
            <label className="block font-medium text-stone-700 mb-1">
              Select Book <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedBookId}
              onChange={(e) => handleBookChange(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-md py-2 px-3 text-stone-900 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-stone-400 cursor-pointer"
            >
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} (p. {b.currentPage} / {b.totalPages})
                </option>
              ))}
            </select>
          </div>

          {/* Date & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Date of Session
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-md py-2 px-3 text-stone-900 font-mono focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-stone-400"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Reading Time (minutes)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={readingMinutes}
                  onChange={(e) => setReadingMinutes(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-stone-50 border border-stone-200 rounded-md py-2 pl-3 pr-10 text-stone-900 font-mono tabular-nums focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-stone-400"
                />
                <Clock className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Page Range */}
          {!isManualPages ? (
            <div className="grid grid-cols-2 gap-3.5 bg-stone-50/70 p-3.5 rounded-lg border border-stone-200/60">
              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Starting Page
                </label>
                <input
                  type="number"
                  min="0"
                  value={startPage}
                  onChange={(e) => setStartPage(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-white border border-stone-200 rounded-md py-1.5 px-3 text-stone-900 font-mono tabular-nums focus:outline-hidden focus:ring-1 focus:ring-stone-400"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Ending Page
                </label>
                <input
                  type="number"
                  min={Number(startPage) || 0}
                  max={currentBook?.totalPages}
                  value={endPage}
                  onChange={(e) => setEndPage(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-white border border-stone-200 rounded-md py-1.5 px-3 text-stone-900 font-mono tabular-nums focus:outline-hidden focus:ring-1 focus:ring-stone-400"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Pages Read Directly
              </label>
              <input
                type="number"
                min="1"
                value={pagesReadDirect}
                onChange={(e) => setPagesReadDirect(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 25"
                className="w-full bg-stone-50 border border-stone-200 rounded-md py-2 px-3 text-stone-900 font-mono tabular-nums focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-stone-400"
              />
            </div>
          )}

          {/* Computed summary badge & toggle */}
          <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
            <span className="font-mono tabular-nums">
              Session pages read:{' '}
              <strong className="text-stone-900 font-semibold text-sm">
                +{calcPagesRead} pages
              </strong>
            </span>

            <button
              type="button"
              onClick={() => setIsManualPages(!isManualPages)}
              className="text-amber-800 hover:text-amber-900 underline text-[11px]"
            >
              {isManualPages ? 'Use start/end page numbers' : 'Enter page count directly'}
            </button>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium text-stone-700 mb-1">
              Session Reflections / Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Finished chapter 4, memorable quote on habits..."
              className="w-full bg-stone-50 border border-stone-200 rounded-md py-2 px-3 text-stone-900 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-stone-400 font-serif"
            />
          </div>

          {/* Auto advance checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-stone-700">
              <input
                type="checkbox"
                checked={autoAdvanceBook}
                onChange={(e) => setAutoAdvanceBook(e.target.checked)}
                className="rounded border-stone-300 text-stone-900 focus:ring-stone-400 cursor-pointer"
              />
              <span>
                Advance book progress in library to page{' '}
                <strong className="font-mono tabular-nums">{endPage || calcPagesRead}</strong>
              </span>
            </label>
          </div>

          {/* Submit CTAs */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors shadow-xs"
            >
              Save Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
