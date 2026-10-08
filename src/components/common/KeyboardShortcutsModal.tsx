import React from 'react';
import { X, Command } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'B', desc: 'Add new book to library' },
    { key: 'L', desc: 'Log a reading session' },
    { key: 'T', desc: 'Open ambient reading timer' },
    { key: '/', desc: 'Quick focus search input' },
    { key: '1', desc: 'Navigate to Dashboard' },
    { key: '2', desc: 'Navigate to Reading Goals' },
    { key: '3', desc: 'Navigate to My Books' },
    { key: '4', desc: 'Navigate to Reading Log' },
    { key: '5', desc: 'Navigate to Settings' },
    { key: '?', desc: 'Show this keyboard help' },
    { key: 'Esc', desc: 'Close any active modal' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Command className="w-4 h-4 text-amber-800" />
            <h2 className="text-base font-serif font-bold text-stone-900">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 divide-y divide-stone-100 text-xs sm:text-sm">
          {shortcuts.map((s) => (
            <div key={s.key} className="py-2.5 flex items-center justify-between">
              <span className="text-stone-600">{s.desc}</span>
              <kbd className="px-2 py-1 bg-stone-100 border border-stone-200 rounded font-mono text-xs font-semibold text-stone-800 shadow-2xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 bg-stone-50 border-t border-stone-100 text-center text-xs text-stone-500 rounded-b-xl">
          Press any key anywhere in the application to navigate instantly.
        </div>
      </div>
    </div>
  );
};
