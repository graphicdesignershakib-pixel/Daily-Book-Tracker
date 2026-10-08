import React, { useState, useRef, useEffect } from 'react';
import { Book, BookQuote, Language } from '../../types';
import { X, Download, Copy, Check, Sparkles, BookOpen, User, RefreshCw } from 'lucide-react';
import { formatNumberByLang } from '../../utils/i18n';

interface QuoteCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotes?: BookQuote[];
  books?: Book[];
  initialQuote?: BookQuote | null;
  userName?: string;
  language: Language;
}

interface CardTheme {
  id: string;
  name: string;
  nameBn: string;
  bgGradient: string;
  canvasBg: string[];
  textColor: string;
  accentColor: string;
  subtextColor: string;
  borderColor: string;
  fontFamily: string;
}

const THEMES: CardTheme[] = [
  {
    id: 'vintage',
    name: 'Vintage Parchment',
    nameBn: 'ভিন্টেজ পার্চমেন্ট',
    bgGradient: 'bg-gradient-to-br from-[#FAF5EE] via-[#F3EBE0] to-[#E9DFD1]',
    canvasBg: ['#FAF5EE', '#E9DFD1'],
    textColor: '#2C221E',
    accentColor: '#8C5332',
    subtextColor: '#66574F',
    borderColor: '#D4C4B1',
    fontFamily: 'serif',
  },
  {
    id: 'midnight',
    name: 'Midnight Velvet',
    nameBn: 'মিডনাইট ভেলভেট',
    bgGradient: 'bg-gradient-to-br from-[#121824] via-[#0F141E] to-[#0A0D14]',
    canvasBg: ['#121824', '#0A0D14'],
    textColor: '#F8FAFC',
    accentColor: '#38BDF8',
    subtextColor: '#94A3B8',
    borderColor: '#1E293B',
    fontFamily: 'sans-serif',
  },
  {
    id: 'royal',
    name: 'Royal Bengal Serif',
    nameBn: 'রয়্যাল বেঙ্গল ক্ল্যাসিক',
    bgGradient: 'bg-gradient-to-br from-[#2A1B16] via-[#1E120D] to-[#120A07]',
    canvasBg: ['#2A1B16', '#120A07'],
    textColor: '#FDFBF7',
    accentColor: '#F59E0B',
    subtextColor: '#D97706',
    borderColor: '#452A20',
    fontFamily: 'serif',
  },
  {
    id: 'sage',
    name: 'Forest Sage',
    nameBn: 'শান্ত অরণ্য (Sage)',
    bgGradient: 'bg-gradient-to-br from-[#F2F7F2] via-[#E4EDE4] to-[#D5E2D5]',
    canvasBg: ['#F2F7F2', '#D5E2D5'],
    textColor: '#1A3026',
    accentColor: '#2D6A4F',
    subtextColor: '#406352',
    borderColor: '#B7CAB7',
    fontFamily: 'serif',
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    nameBn: 'গোধূলি আভা',
    bgGradient: 'bg-gradient-to-br from-[#FFF5EB] via-[#FDECE2] to-[#FED7AA]',
    canvasBg: ['#FFF5EB', '#FED7AA'],
    textColor: '#431407',
    accentColor: '#EA580C',
    subtextColor: '#7C2D12',
    borderColor: '#FDBA74',
    fontFamily: 'sans-serif',
  },
];

export const QuoteCardModal: React.FC<QuoteCardModalProps> = ({
  isOpen,
  onClose,
  quotes = [],
  books = [],
  initialQuote,
  userName = 'Reader',
  language,
}) => {
  const [selectedQuoteText, setSelectedQuoteText] = useState<string>('');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [selectedBookTitle, setSelectedBookTitle] = useState<string>('');
  const [selectedPage, setSelectedPage] = useState<number | undefined>(undefined);
  const [activeTheme, setActiveTheme] = useState<CardTheme>(THEMES[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuote) {
      setSelectedQuoteText(initialQuote.text);
      setSelectedAuthor(initialQuote.author || '');
      setSelectedBookTitle(initialQuote.bookTitle || '');
      setSelectedPage(initialQuote.page);
    } else if (quotes.length > 0) {
      const q = quotes[0];
      setSelectedQuoteText(q.text);
      setSelectedAuthor(q.author || '');
      setSelectedBookTitle(q.bookTitle || '');
      setSelectedPage(q.page);
    } else {
      setSelectedQuoteText(
        language === 'bn'
          ? 'বই পড়ার আনন্দই আলাদা, একটি ভালো বই মানুষের শ্রেষ্ঠ বন্ধু।'
          : 'A room without books is like a body without a soul.'
      );
      setSelectedAuthor(language === 'bn' ? 'রবীন্দ্রনাথ ঠাকুর' : 'Marcus Tullius Cicero');
      setSelectedBookTitle(language === 'bn' ? 'সাহিত্যের তাৎপর্য' : 'De Re Publica');
      setSelectedPage(undefined);
    }
  }, [isOpen, initialQuote, quotes, language]);

  if (!isOpen) return null;

  const handleCopyText = async () => {
    const pageText = selectedPage ? ` (Page ${selectedPage})` : '';
    const citation = selectedAuthor || selectedBookTitle
      ? `\n— ${[selectedAuthor, selectedBookTitle].filter(Boolean).join(', ')}${pageText}`
      : '';
    const fullText = `"${selectedQuoteText}"${citation}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownloadImage = () => {
    setIsGenerating(true);
    const canvas = document.createElement('canvas');
    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsGenerating(false);
      return;
    }

    // Gradient background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, activeTheme.canvasBg[0]);
    grad.addColorStop(1, activeTheme.canvasBg[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle border
    ctx.strokeStyle = activeTheme.borderColor;
    ctx.lineWidth = 12;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Decorative inner box
    ctx.strokeStyle = activeTheme.accentColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 60, width - 120, height - 120);

    // Quotation Mark decoration
    ctx.fillStyle = activeTheme.accentColor;
    ctx.font = 'bold 120px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('“', width / 2, 200);

    // Quote text with smart wrapping
    ctx.fillStyle = activeTheme.textColor;
    ctx.font = '500 40px "SolaimanLipi", "Kalpurush", Georgia, serif';
    ctx.textAlign = 'center';

    const words = selectedQuoteText.split(' ');
    let line = '';
    const lines: string[] = [];
    const maxWidth = width - 240;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        lines.push(line.trim());
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());

    // Center the lines vertically around middle
    const lineHeight = 56;
    const totalTextHeight = lines.length * lineHeight;
    let startY = Math.max(320, (height - totalTextHeight) / 2 - 20);

    lines.forEach((l) => {
      ctx.fillText(l, width / 2, startY);
      startY += lineHeight;
    });

    // Divider line
    startY += 30;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 80, startY);
    ctx.lineTo(width / 2 + 80, startY);
    ctx.strokeStyle = activeTheme.accentColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Author
    startY += 50;
    if (selectedAuthor) {
      ctx.fillStyle = activeTheme.accentColor;
      ctx.font = 'bold 34px "SolaimanLipi", "Kalpurush", sans-serif';
      ctx.fillText(selectedAuthor, width / 2, startY);
      startY += 40;
    }

    // Book & Page
    if (selectedBookTitle) {
      ctx.fillStyle = activeTheme.subtextColor;
      ctx.font = 'italic 28px "SolaimanLipi", "Kalpurush", serif';
      const pageStr = selectedPage ? ` • p. ${selectedPage}` : '';
      ctx.fillText(`“${selectedBookTitle}”${pageStr}`, width / 2, startY);
    }

    // Bottom Watermark / Branding
    ctx.fillStyle = activeTheme.subtextColor;
    ctx.font = '22px sans-serif';
    ctx.fillText(`Book Reading Tracker • ${userName}`, width / 2, height - 90);

    // Download trigger
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `quote-card-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsGenerating(false);
    }
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
              <h2 className="text-base font-semibold text-stone-900">
                {language === 'bn' ? 'উদ্ধৃতি ও বইয়ের কার্ড স্টুডিও' : 'Aesthetic Quote Card Studio'}
              </h2>
              <p className="text-xs text-stone-500">
                {language === 'bn'
                  ? 'আপনার প্রিয় উক্তিটি সুন্দর কার্ডে সাজিয়ে সোশ্যাল মিডিয়ায় শেয়ার বা ডাউনলোড করুন'
                  : 'Design and export shareable visual cards of your favorite book passages'}
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

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Card Preview */}
          <div className="flex justify-center">
            <div
              ref={cardRef}
              className={`w-full max-w-md aspect-square rounded-xl p-8 flex flex-col justify-between shadow-lg border relative transition-all duration-300 ${activeTheme.bgGradient}`}
              style={{ borderColor: activeTheme.borderColor }}
            >
              <div className="text-center">
                <span
                  className="font-serif text-5xl leading-none select-none block mb-2 opacity-80"
                  style={{ color: activeTheme.accentColor }}
                >
                  “
                </span>
                <p
                  className="text-base sm:text-lg font-serif italic leading-relaxed break-words line-clamp-6 text-center font-medium"
                  style={{ color: activeTheme.textColor }}
                >
                  {selectedQuoteText}
                </p>
              </div>

              <div className="text-center pt-4 border-t border-stone-300/30">
                {selectedAuthor && (
                  <p
                    className="text-sm font-semibold tracking-wide"
                    style={{ color: activeTheme.accentColor }}
                  >
                    {selectedAuthor}
                  </p>
                )}
                {selectedBookTitle && (
                  <p
                    className="text-xs font-serif italic mt-0.5"
                    style={{ color: activeTheme.subtextColor }}
                  >
                    {selectedBookTitle}
                    {selectedPage && (
                      <span className="ml-1 text-[11px] not-italic">
                        • {language === 'bn' ? `পৃষ্ঠা ${formatNumberByLang(selectedPage, 'bn')}` : `p. ${selectedPage}`}
                      </span>
                    )}
                  </p>
                )}

                <div
                  className="mt-3 text-[10px] tracking-wider uppercase font-sans font-medium opacity-60"
                  style={{ color: activeTheme.subtextColor }}
                >
                  Book Tracker • {userName}
                </div>
              </div>
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2 uppercase tracking-wide">
              {language === 'bn' ? 'কার্ডের থিম নির্বাচন করুন' : 'Select Card Theme'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {THEMES.map((theme) => {
                const isSelected = activeTheme.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setActiveTheme(theme)}
                    className={`p-2.5 rounded-lg border text-left transition-all flex flex-col items-center justify-center text-center gap-1.5 ${
                      isSelected
                        ? 'border-amber-600 ring-2 ring-amber-500/20 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full shadow-2xs border ${theme.bgGradient}`}
                      style={{ borderColor: theme.borderColor }}
                    />
                    <span className="text-[11px] font-medium text-stone-800 line-clamp-1">
                      {language === 'bn' ? theme.nameBn : theme.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quote & Citation Inputs */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                {language === 'bn' ? 'উদ্ধৃতির মূল বক্তব্য' : 'Quote Text'}
              </label>
              <textarea
                rows={3}
                value={selectedQuoteText}
                onChange={(e) => setSelectedQuoteText(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 rounded-md border border-stone-200 focus:outline-hidden focus:ring-1 focus:ring-stone-400"
                placeholder={language === 'bn' ? 'উদ্ধৃতিটি এখানে লিখুন...' : 'Type or edit quote here...'}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  {language === 'bn' ? 'লেখক' : 'Author'}
                </label>
                <input
                  type="text"
                  value={selectedAuthor}
                  onChange={(e) => setSelectedAuthor(e.target.value)}
                  className="w-full text-xs p-2 rounded-md border border-stone-200 focus:outline-hidden focus:ring-1 focus:ring-stone-400"
                  placeholder={language === 'bn' ? 'লেখকের নাম' : 'Author name'}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  {language === 'bn' ? 'বইয়ের নাম' : 'Book Title'}
                </label>
                <input
                  type="text"
                  value={selectedBookTitle}
                  onChange={(e) => setSelectedBookTitle(e.target.value)}
                  className="w-full text-xs p-2 rounded-md border border-stone-200 focus:outline-hidden focus:ring-1 focus:ring-stone-400"
                  placeholder={language === 'bn' ? 'বইয়ের শিরোনাম' : 'Book title'}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  {language === 'bn' ? 'পৃষ্ঠা নম্বর (ঐচ্ছিক)' : 'Page (Optional)'}
                </label>
                <input
                  type="number"
                  value={selectedPage || ''}
                  onChange={(e) => setSelectedPage(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full text-xs p-2 rounded-md border border-stone-200 focus:outline-hidden focus:ring-1 focus:ring-stone-400"
                  placeholder="e.g. 142"
                />
              </div>
            </div>

            {/* Quick Pick From Saved Quotes */}
            {quotes.length > 0 && (
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  {language === 'bn' ? 'সংরক্ষিত উক্তি থেকে বেছে নিন:' : 'Or choose from your saved quotes:'}
                </label>
                <select
                  onChange={(e) => {
                    const q = quotes.find((item) => item.id === e.target.value);
                    if (q) {
                      setSelectedQuoteText(q.text);
                      setSelectedAuthor(q.author || '');
                      setSelectedBookTitle(q.bookTitle || '');
                      setSelectedPage(q.page);
                    }
                  }}
                  className="w-full text-xs p-2 rounded-md border border-stone-200 bg-white"
                >
                  <option value="">{language === 'bn' ? '-- উক্তি সিলেক্ট করুন --' : '-- Select a quote --'}</option>
                  {quotes.map((q) => (
                    <option key={q.id} value={q.id}>
                      "{q.text.slice(0, 50)}..." — {q.author || q.bookTitle}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 border-t border-stone-200 bg-stone-50/70 flex items-center justify-between gap-3">
          <button
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded-md transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied
              ? language === 'bn' ? 'কপি হয়েছে!' : 'Copied!'
              : language === 'bn' ? 'টেক্সট কপি করুন' : 'Copy Text'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              onClick={handleDownloadImage}
              disabled={isGenerating || !selectedQuoteText.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-amber-800 hover:bg-amber-900 disabled:opacity-50 rounded-md transition-colors shadow-xs"
            >
              {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              {language === 'bn' ? 'কার্ড ডাউনলোড করুন (PNG)' : 'Download Card Image (PNG)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
