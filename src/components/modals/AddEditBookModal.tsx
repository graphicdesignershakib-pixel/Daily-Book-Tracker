import React, { useState, useEffect } from 'react';
import { Book, BookStatus, BookFormat } from '../../types';
import { X, Check } from 'lucide-react';
import { GENRES, LANGUAGES, COVER_PALETTES } from '../../services/storage';

interface AddEditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBook: (bookData: Partial<Book>) => void;
  initialBook?: Book | null;
}

export const AddEditBookModal: React.FC<AddEditBookModalProps> = ({
  isOpen,
  onClose,
  onSaveBook,
  initialBook,
}) => {
  const isEditing = !!initialBook;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState(GENRES[0]);
  const [language, setLanguage] = useState('English');
  const [format, setFormat] = useState<BookFormat>('Hardcover');
  const [totalPages, setTotalPages] = useState<number | ''>(300);
  const [currentPage, setCurrentPage] = useState<number | ''>(0);
  const [status, setStatus] = useState<BookStatus>('Reading');
  const [rating, setRating] = useState<number>(0);
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const [notes, setNotes] = useState('');
  const [coverColor, setCoverColor] = useState(COVER_PALETTES[0]);
  const [coverImage, setCoverImage] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [pauseReason, setPauseReason] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialBook) {
      setTitle(initialBook.title);
      setAuthor(initialBook.author);
      setCategory(initialBook.category || GENRES[0]);
      setLanguage(initialBook.language || 'English');
      setFormat(initialBook.format || 'Hardcover');
      setTotalPages(initialBook.totalPages);
      setCurrentPage(initialBook.currentPage);
      setStatus(initialBook.status);
      setRating(initialBook.rating || 0);
      setStartDate(initialBook.startDate || '');
      setFinishDate(initialBook.finishDate || '');
      setNotes(initialBook.notes || '');
      setCoverColor(initialBook.coverColor || COVER_PALETTES[0]);
      setCoverImage(initialBook.coverImage || '');
      setTagsInput(initialBook.tags ? initialBook.tags.join(', ') : '');
      setPauseReason(initialBook.pauseReason || '');
    } else {
      setTitle('');
      setAuthor('');
      setCategory(GENRES[0]);
      setLanguage('English');
      setFormat('Hardcover');
      setTotalPages(320);
      setCurrentPage(0);
      setStatus('Want to Read');
      setRating(0);
      setStartDate(new Date().toISOString().split('T')[0]);
      setFinishDate('');
      setNotes('');
      setCoverColor(COVER_PALETTES[Math.floor(Math.random() * COVER_PALETTES.length)]);
      setCoverImage('');
      setTagsInput('');
      setPauseReason('');
    }
    setErrors({});
  }, [initialBook, isOpen]);

  if (!isOpen) return null;

  // Handle current page changes and auto-prompt completion if current == total
  const handleCurrentPageChange = (val: number | '') => {
    setCurrentPage(val);
    if (typeof val === 'number' && typeof totalPages === 'number' && val >= totalPages && totalPages > 0) {
      if (status !== 'Completed') {
        setStatus('Completed');
        if (!finishDate) {
          setFinishDate(new Date().toISOString().split('T')[0]);
        }
      }
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = 'Book title is required';
    }
    if (!author.trim()) {
      newErrors.author = 'Author name is required';
    }
    if (typeof totalPages !== 'number' || totalPages <= 0) {
      newErrors.totalPages = 'Total pages must be a positive number';
    }
    if (typeof currentPage !== 'number' || currentPage < 0) {
      newErrors.currentPage = 'Current page cannot be negative';
    }
    if (
      typeof totalPages === 'number' &&
      typeof currentPage === 'number' &&
      currentPage > totalPages
    ) {
      newErrors.currentPage = 'Current page cannot exceed total pages';
    }
    if (startDate && finishDate && new Date(finishDate) < new Date(startDate)) {
      newErrors.finishDate = 'Finish date cannot precede start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const numTotal = Number(totalPages);
    const numCurrent = Number(currentPage) || 0;

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    onSaveBook({
      title: title.trim(),
      author: author.trim(),
      category,
      language,
      format,
      totalPages: numTotal,
      currentPage: Math.min(numCurrent, numTotal),
      status,
      rating,
      startDate: startDate || undefined,
      finishDate: finishDate || undefined,
      notes: notes.trim(),
      coverColor,
      coverImage: coverImage.trim() || undefined,
      tags: parsedTags.length > 0 ? parsedTags : undefined,
      pauseReason: pauseReason.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[92vh] flex flex-col border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-900">
              {isEditing ? 'Edit Book Details' : 'Add New Book'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {isEditing
                ? 'Update page count, rating, or personal literary reflections.'
                : 'Enter book specifications to begin tracking reading pace.'}
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs sm:text-sm">
          {/* Section 1: Basic Information */}
          <div className="space-y-3.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 block">
              1. Book Details
            </span>

            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Book Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Klara and the Sun"
                className={`w-full bg-stone-50 border rounded-md py-2 px-3 text-stone-900 focus:outline-hidden focus:bg-white focus:ring-1 ${
                  errors.title ? 'border-rose-400 focus:ring-rose-400' : 'border-stone-200 focus:ring-stone-400'
                }`}
              />
              {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Author <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Kazuo Ishiguro"
                  className={`w-full bg-stone-50 border rounded-md py-2 px-3 text-stone-900 focus:outline-hidden focus:bg-white focus:ring-1 ${
                    errors.author ? 'border-rose-400 focus:ring-rose-400' : 'border-stone-200 focus:ring-stone-400'
                  }`}
                />
                {errors.author && <p className="text-xs text-rose-500 mt-1">{errors.author}</p>}
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Category / Genre
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-md py-2 px-3 text-stone-900 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-stone-400 cursor-pointer"
                >
                  {GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-md py-2 px-3 text-stone-900 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-stone-400 cursor-pointer"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Edition Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as BookFormat)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-md py-2 px-3 text-stone-900 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-stone-400 cursor-pointer"
                >
                  <option value="Hardcover">Hardcover</option>
                  <option value="Paperback">Paperback</option>
                  <option value="E-Book">E-Book</option>
                  <option value="Audiobook">Audiobook</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Cover Cloth Palette
                </label>
                <div className="flex items-center gap-2 pt-2">
                  {COVER_PALETTES.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setCoverColor(color)}
                      className={`w-6 h-6 rounded-xs transition-transform ${
                        coverColor === color ? 'scale-115 ring-2 ring-stone-900 ring-offset-1' : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Custom Cover Image URL (Optional)
              </label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://... (direct link to book cover image)"
                className="w-full bg-stone-50 border border-stone-200 rounded-md py-1.5 px-3 text-stone-900 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-stone-400 font-mono text-xs"
              />
            </div>
          </div>

          {/* Section 2: Progress & Status */}
          <div className="space-y-3.5 pt-3 border-t border-stone-100">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 block">
              2. Reading Progress
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Total Pages <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={totalPages}
                  onChange={(e) => setTotalPages(e.target.value ? Number(e.target.value) : '')}
                  className={`w-full bg-stone-50 border rounded-md py-2 px-3 text-stone-900 font-mono tabular-nums focus:outline-hidden focus:bg-white focus:ring-1 ${
                    errors.totalPages ? 'border-rose-400 focus:ring-rose-400' : 'border-stone-200 focus:ring-stone-400'
                  }`}
                />
                {errors.totalPages && (
                  <p className="text-xs text-rose-500 mt-1">{errors.totalPages}</p>
                )}
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Current Page
                </label>
                <input
                  type="number"
                  min="0"
                  max={typeof totalPages === 'number' ? totalPages : undefined}
                  value={currentPage}
                  onChange={(e) => handleCurrentPageChange(e.target.value ? Number(e.target.value) : '')}
                  className={`w-full bg-stone-50 border rounded-md py-2 px-3 text-stone-900 font-mono tabular-nums focus:outline-hidden focus:bg-white focus:ring-1 ${
                    errors.currentPage ? 'border-rose-400 focus:ring-rose-400' : 'border-stone-200 focus:ring-stone-400'
                  }`}
                />
                {errors.currentPage && (
                  <p className="text-xs text-rose-500 mt-1">{errors.currentPage}</p>
                )}
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Reading Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as BookStatus)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-md py-2 px-3 text-stone-900 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-stone-400 cursor-pointer"
                >
                  <option value="Want to Read">Want to Read</option>
                  <option value="Reading">Reading</option>
                  <option value="Completed">Completed</option>
                  <option value="Paused">Paused</option>
                  <option value="Dropped">Dropped</option>
                </select>
              </div>
            </div>

            {(status === 'Paused' || status === 'Dropped') && (
              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Reason for Pausing or Dropping (Optional)
                </label>
                <input
                  type="text"
                  value={pauseReason}
                  onChange={(e) => setPauseReason(e.target.value)}
                  placeholder="e.g. Too dense for now, repetitive chapters, prioritize work book..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-md py-1.5 px-3 text-stone-900 focus:outline-hidden text-xs"
                />
              </div>
            )}

            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Rating (0 to 5)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(rating === star ? 0 : star)}
                    className="p-1 text-lg transition-transform hover:scale-115 focus:outline-hidden"
                  >
                    <span className={star <= rating ? 'text-amber-500' : 'text-stone-300'}>
                      ★
                    </span>
                  </button>
                ))}
                <span className="text-xs font-mono tabular-nums text-stone-500 ml-2">
                  {rating > 0 ? `${rating}.0 / 5.0` : 'Unrated'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Dates */}
          <div className="space-y-3.5 pt-3 border-t border-stone-100">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 block">
              3. Dates & Timeline
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-md py-2 px-3 text-stone-900 font-mono focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-stone-400"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Finish Date
                </label>
                <input
                  type="date"
                  value={finishDate}
                  onChange={(e) => setFinishDate(e.target.value)}
                  className={`w-full bg-stone-50 border rounded-md py-2 px-3 text-stone-900 font-mono focus:outline-hidden focus:bg-white focus:ring-1 ${
                    errors.finishDate ? 'border-rose-400 focus:ring-rose-400' : 'border-stone-200 focus:ring-stone-400'
                  }`}
                />
                {errors.finishDate && (
                  <p className="text-xs text-rose-500 mt-1">{errors.finishDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Notes / Review */}
          <div className="space-y-3.5 pt-3 border-t border-stone-100">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 block">
              4. Review & Reflections
            </span>

            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Notes & Takeaways
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Key insights, favourite quotes, or review summary..."
                className="w-full bg-stone-50 border border-stone-200 rounded-md py-2 px-3 text-stone-900 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-stone-400 font-serif"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Custom Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Focus, Productivity, Philosophy, MustRead"
                className="w-full bg-stone-50 border border-stone-200 rounded-md py-1.5 px-3 text-stone-900 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-stone-400 font-mono text-xs"
              />
              <p className="text-[11px] text-stone-400 mt-0.5">
                Tags help organize your library by custom collections or shelf themes.
              </p>
            </div>
          </div>

          {/* Footer CTAs */}
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
              {isEditing ? 'Save Changes' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
