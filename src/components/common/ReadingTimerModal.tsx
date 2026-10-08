import React, { useState, useEffect } from 'react';
import { Book } from '../../types';
import { Play, Pause, RotateCcw, X, Check, Clock, BookOpen, Volume2, VolumeX } from 'lucide-react';
import { AmbientSound } from '../../utils/audio';

interface ReadingTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  onFinishTimerSession: (book: Book, minutesElapsed: number) => void;
  initialBook?: Book | null;
}

export const ReadingTimerModal: React.FC<ReadingTimerModalProps> = ({
  isOpen,
  onClose,
  books,
  onFinishTimerSession,
  initialBook,
}) => {
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [mode, setMode] = useState<'stopwatch' | 'countdown'>('stopwatch');
  const [countdownMinutes, setCountdownMinutes] = useState<number>(25);
  const [soundMode, setSoundMode] = useState<'off' | 'rain' | 'fireplace' | 'library'>('off');

  const selectedBook = books.find((b) => b.id === selectedBookId) || books[0];

  useEffect(() => {
    if (isOpen) {
      const activeBook = initialBook || books.find((b) => b.status === 'Reading') || books[0];
      if (activeBook) {
        setSelectedBookId(activeBook.id);
      }
      setSeconds(0);
      setIsActive(false);
      setSoundMode('off');
    } else {
      AmbientSound.stop();
    }
  }, [isOpen, initialBook, books]);

  // Audio control effect
  useEffect(() => {
    if (!isOpen || !isActive) {
      AmbientSound.stop();
      return;
    }

    if (soundMode === 'rain') {
      AmbientSound.playRain();
    } else if (soundMode === 'fireplace') {
      AmbientSound.playFireplace();
    } else if (soundMode === 'library') {
      AmbientSound.playLibraryWhiteNoise();
    } else {
      AmbientSound.stop();
    }

    return () => AmbientSound.stop();
  }, [soundMode, isActive, isOpen]);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (mode === 'countdown' && prev >= countdownMinutes * 60) {
            setIsActive(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, mode, countdownMinutes]);

  if (!isOpen) return null;

  const currentDisplaySeconds =
    mode === 'countdown' ? Math.max(0, countdownMinutes * 60 - seconds) : seconds;

  const mins = Math.floor(currentDisplaySeconds / 60);
  const secs = currentDisplaySeconds % 60;
  const formatTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const elapsedMinutes = Math.max(1, Math.round(seconds / 60));

  const handleFinish = () => {
    if (selectedBook) {
      onFinishTimerSession(selectedBook, elapsedMinutes);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
      <div className="bg-[#FAF9F5] border border-stone-200/90 rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-200 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ambient Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-medium mb-5">
          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-amber-600 animate-pulse' : 'bg-stone-400'}`} />
          <span>Ambient Focus Reading Session</span>
        </div>

        {/* Book Selector */}
        <div className="w-full mb-6">
          <select
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-lg py-2 px-3 text-xs sm:text-sm font-medium text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-stone-400 cursor-pointer shadow-xs truncate"
          >
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                📖 {b.title} ({b.currentPage}/{b.totalPages} p.)
              </option>
            ))}
          </select>
        </div>

        {/* Timer Digital Display */}
        <div className="my-4">
          <div className="font-mono tabular-nums text-6xl sm:text-7xl font-light tracking-tight text-stone-900 select-none">
            {formatTime}
          </div>
          <p className="text-xs text-stone-500 mt-2 font-mono">
            {mode === 'countdown' ? 'Remaining in reading block' : 'Elapsed focus time'}
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg my-3 text-xs">
          <button
            onClick={() => {
              setMode('stopwatch');
              setSeconds(0);
            }}
            className={`px-3 py-1 rounded-md transition-colors ${
              mode === 'stopwatch' ? 'bg-white text-stone-900 shadow-xs font-medium' : 'text-stone-600'
            }`}
          >
            Stopwatch
          </button>
          <button
            onClick={() => {
              setMode('countdown');
              setSeconds(0);
            }}
            className={`px-3 py-1 rounded-md transition-colors ${
              mode === 'countdown' ? 'bg-white text-stone-900 shadow-xs font-medium' : 'text-stone-600'
            }`}
          >
            25m Pomodoro
          </button>
        </div>

        {/* Ambient Relaxing Sound Atmosphere */}
        <div className="w-full my-2 bg-stone-100/70 p-2.5 rounded-xl border border-stone-200/50">
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1.5 px-1">
            <span className="flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-amber-800" />
              <span>Ambient Atmosphere:</span>
            </span>
            <span className="capitalize font-medium text-stone-700 font-mono">
              {soundMode === 'off' ? 'Silent' : soundMode}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1 text-[11px]">
            <button
              type="button"
              onClick={() => setSoundMode('off')}
              className={`py-1 px-1.5 rounded-md font-medium transition-colors ${
                soundMode === 'off' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              🔇 Silent
            </button>
            <button
              type="button"
              onClick={() => setSoundMode('rain')}
              className={`py-1 px-1.5 rounded-md font-medium transition-colors ${
                soundMode === 'rain' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              🌧️ Rain
            </button>
            <button
              type="button"
              onClick={() => setSoundMode('fireplace')}
              className={`py-1 px-1.5 rounded-md font-medium transition-colors ${
                soundMode === 'fireplace' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              🔥 Fireplace
            </button>
            <button
              type="button"
              onClick={() => setSoundMode('library')}
              className={`py-1 px-1.5 rounded-md font-medium transition-colors ${
                soundMode === 'library' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              ☕ Library
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 my-4">
          <button
            onClick={() => setSeconds(0)}
            className="p-3 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsActive(!isActive)}
            className="w-16 h-16 rounded-full bg-stone-900 hover:bg-stone-800 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
            title={isActive ? 'Pause' : 'Start'}
          >
            {isActive ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
          </button>

          <div className="w-11" /> {/* balance spacing */}
        </div>

        {/* Finish CTA */}
        <div className="w-full mt-6 pt-5 border-t border-stone-200/80">
          <button
            onClick={handleFinish}
            disabled={seconds < 30}
            className={`w-full py-2.5 px-4 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              seconds >= 30
                ? 'bg-amber-800 hover:bg-amber-900 text-white shadow-sm'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Finish Session & Log Reading ({elapsedMinutes} min)</span>
          </button>
          {seconds < 30 && (
            <p className="text-[11px] text-stone-400 mt-1.5">
              Timer must run for at least 30 seconds to record a session.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
