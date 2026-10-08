import React, { useState, useEffect } from 'react';
import { Book } from '../../types';
import { X, Check } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

interface UpdateProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  onSaveProgress: (bookId: string, newPage: number, markCompleted: boolean) => void;
}

export const UpdateProgressModal: React.FC<UpdateProgressModalProps> = ({
  isOpen,
  onClose,
  book,
  onSaveProgress,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [markCompleted, setMarkCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (book) {
      setCurrentPage(book.currentPage || 0);
      setMarkCompleted(book.status === 'Completed');
    }
  }, [book, isOpen]);

  if (!isOpen || !book) return null;

  const totalPages = book.totalPages || 1;
  const progressPct = Math.min(100, Math.round((currentPage / totalPages) * 100));

  const handlePageChange = (val: number) => {
    const clamped = Math.min(totalPages, Math.max(0, val));
    setCurrentPage(clamped);
    if (clamped >= totalPages) {
      setMarkCompleted(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProgress(book.id, currentPage, markCompleted || currentPage >= totalPages);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-serif font-bold text-stone-900">
              Update Reading Page
            </h2>
            <p className="text-xs text-stone-500 truncate max-w-xs">{book.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Progress Overview */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono tabular-nums text-stone-600">
                Page <strong className="text-stone-900 text-sm">{currentPage}</strong> of{' '}
                {totalPages}
              </span>
              <span className="font-mono tabular-nums font-semibold text-stone-800">
                {progressPct}%
              </span>
            </div>
            <ProgressBar progress={progressPct} size="md" color="bg-amber-700" />
          </div>

          {/* Page Numeric Input & Slider */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Current Page Number
              </label>
              <input
                type="number"
                min="0"
                max={totalPages}
                value={currentPage}
                onChange={(e) => handlePageChange(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-md py-2 px-3 text-lg font-mono tabular-nums text-stone-900 text-center font-bold focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-stone-400"
              />
            </div>

            <input
              type="range"
              min="0"
              max={totalPages}
              value={currentPage}
              onChange={(e) => handlePageChange(Number(e.target.value))}
              className="w-full accent-amber-800 cursor-pointer"
            />
          </div>

          {/* Quick Step Buttons */}
          <div className="flex justify-center gap-2 text-xs">
            {[-10, -5, +5, +10, +25].map((delta) => (
              <button
                key={delta}
                type="button"
                onClick={() => handlePageChange(currentPage + delta)}
                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded font-mono tabular-nums transition-colors"
              >
                {delta > 0 ? `+${delta}` : delta}
              </button>
            ))}
          </div>

          {/* Suggest completion if at total pages */}
          {currentPage >= totalPages && (
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-lg p-3 text-xs text-emerald-800 flex items-center justify-between">
              <span>You've reached the final page! Mark as completed?</span>
              <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={markCompleted}
                  onChange={(e) => setMarkCompleted(e.target.checked)}
                  className="rounded border-emerald-400 text-emerald-700"
                />
                <span>Completed</span>
              </label>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors shadow-xs"
            >
              Update Progress
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
