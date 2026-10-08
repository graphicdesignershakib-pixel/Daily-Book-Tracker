import React from 'react';
import { Book } from '../../types';
import { Star, Bookmark } from 'lucide-react';

interface BookshelfViewProps {
  books: Book[];
  onOpenDetail: (book: Book) => void;
  onUpdateProgress: (book: Book) => void;
}

export const BookshelfView: React.FC<BookshelfViewProps> = ({
  books,
  onOpenDetail,
  onUpdateProgress,
}) => {
  // Group books into shelves of around 8-12 books each
  const SHELF_CAPACITY = 9;
  const shelves: Book[][] = [];
  for (let i = 0; i < books.length; i += SHELF_CAPACITY) {
    shelves.push(books.slice(i, i + SHELF_CAPACITY));
  }
  if (shelves.length === 0) {
    shelves.push([]);
  }

  // Calculate spine thickness based on totalPages
  const getSpineWidth = (pages: number) => {
    if (pages < 200) return 28;
    if (pages < 350) return 36;
    if (pages < 500) return 46;
    return 56;
  };

  // Calculate spine height based on format
  const getSpineHeight = (format?: string) => {
    if (format === 'Hardcover') return 195;
    if (format === 'Audiobook') return 170;
    return 185;
  };

  return (
    <div className="space-y-10 py-4 select-none">
      {shelves.map((shelfBooks, shelfIdx) => (
        <div key={shelfIdx} className="relative">
          {/* Books row */}
          <div className="flex items-end gap-1.5 sm:gap-2.5 px-4 sm:px-8 overflow-x-auto pb-0 min-h-[205px] scrollbar-none">
            {shelfBooks.map((book) => {
              const width = getSpineWidth(book.totalPages);
              const height = getSpineHeight(book.format);
              const isReading = book.status === 'Reading';
              const isCompleted = book.status === 'Completed';

              return (
                <div
                  key={book.id}
                  onClick={() => onOpenDetail(book)}
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    backgroundColor: book.coverColor || '#2C3E50',
                  }}
                  className="relative shrink-0 rounded-t-xs shadow-md cursor-pointer transition-all duration-200 hover:-translate-y-2 hover:shadow-xl group flex flex-col justify-between py-2.5 px-1 border-t border-r border-l border-white/15"
                >
                  {/* Spine Creases */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-black/20 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-black/10 pointer-events-none" />

                  {/* Bookmark ribbon for currently reading */}
                  {isReading && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2.5 h-4 bg-amber-500 rounded-b-xs shadow-xs pointer-events-none z-10" />
                  )}

                  {/* Top: Status or Format Icon */}
                  <div className="text-center">
                    {book.rating >= 4.5 && (
                      <span className="text-[10px] text-amber-300 opacity-90 block">★</span>
                    )}
                  </div>

                  {/* Middle: Rotated Title */}
                  <div className="flex-1 flex items-center justify-center overflow-hidden my-1">
                    <span
                      style={{ writingMode: 'vertical-rl' }}
                      className="text-stone-100/95 font-serif text-[11px] font-medium tracking-tight rotate-180 line-clamp-1 max-h-[140px] truncate drop-shadow-2xs"
                    >
                      {book.title}
                    </span>
                  </div>

                  {/* Bottom: Author Surname */}
                  <div className="text-center pt-1 border-t border-white/20">
                    <span className="text-[9px] font-sans text-stone-200/80 truncate block uppercase tracking-wider">
                      {book.author.split(' ').pop()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Wooden / Vellum Shelf Base */}
          <div className="relative w-full">
            {/* Shelf Top Surface */}
            <div className="h-3.5 bg-gradient-to-r from-[#D7CCC8] via-[#EFEBE9] to-[#D7CCC8] dark:from-[#3E2723] dark:via-[#4E342E] dark:to-[#3E2723] shadow-md border-t border-white/40 dark:border-white/10" />
            {/* Shelf Front Bevel */}
            <div className="h-4 bg-gradient-to-r from-[#BCAAA4] via-[#D7CCC8] to-[#BCAAA4] dark:from-[#271815] dark:via-[#3E2723] dark:to-[#271815] shadow-lg flex items-center justify-between px-6">
              <span className="text-[9px] font-serif italic text-stone-600 dark:text-stone-400 opacity-80">
                Shelf {shelfIdx + 1}
              </span>
              <span className="text-[9px] font-mono tabular-nums text-stone-500 dark:text-stone-400">
                {shelfBooks.length} volumes
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
