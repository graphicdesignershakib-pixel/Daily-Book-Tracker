import React from 'react';
import { ReadingSession } from '../../types';
import { ArrowRight, Clock, BookOpen, ScrollText } from 'lucide-react';

interface RecentActivitySectionProps {
  sessions: ReadingSession[];
  onNavigateToLog: () => void;
  onOpenLogReading: () => void;
}

export const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({
  sessions,
  onNavigateToLog,
  onOpenLogReading,
}) => {
  const recentSessions = sessions.slice(0, 5);

  const formatSessionDate = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];

    if (dateStr === today) return 'Today';
    if (dateStr === yesterday) return 'Yesterday';

    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div>
          <h3 className="text-base font-semibold text-stone-900 tracking-tight font-sans">
            Recent Activity
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Your latest logged reading sessions
          </p>
        </div>
        <button
          onClick={onNavigateToLog}
          className="inline-flex items-center gap-1 text-xs font-medium text-amber-800 hover:text-amber-900 transition-colors"
        >
          <span>Full Log</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {recentSessions.length === 0 ? (
        <div className="py-10 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
            <ScrollText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-stone-800">No reading sessions yet</h4>
            <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1">
              Log your first reading session to start seeing your reading timeline and analytics.
            </p>
          </div>
          <button
            onClick={onOpenLogReading}
            className="text-xs font-medium text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-md transition-colors"
          >
            Log First Session
          </button>
        </div>
      ) : (
        <div className="divide-y divide-stone-100 mt-1">
          {recentSessions.map((session) => (
            <div key={session.id} className="py-3.5 first:pt-3 last:pb-1 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-stone-400 font-mono tabular-nums">
                    {formatSessionDate(session.date)}
                  </span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="text-xs font-medium text-stone-800 truncate">
                    {session.bookTitle}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-500 mt-1 font-mono tabular-nums">
                  <span>
                    p. {session.startPage}–{session.endPage}
                  </span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="font-semibold text-stone-700">
                    +{session.pagesRead} pages
                  </span>
                  {session.readingMinutes > 0 && (
                    <>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className="text-stone-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 inline text-stone-400" />
                        {session.readingMinutes} min
                      </span>
                    </>
                  )}
                </div>

                {session.notes && (
                  <p className="text-xs text-stone-600 italic mt-1.5 line-clamp-1">
                    "{session.notes}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
