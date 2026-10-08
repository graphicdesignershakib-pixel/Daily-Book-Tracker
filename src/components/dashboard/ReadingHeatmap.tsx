import React, { useState, useMemo } from 'react';
import { ReadingSession } from '../../types';

interface ReadingHeatmapProps {
  sessions: ReadingSession[];
  selectedYear: number;
}

export const ReadingHeatmap: React.FC<ReadingHeatmapProps> = ({ sessions, selectedYear }) => {
  const [hoveredDay, setHoveredDay] = useState<{
    dateStr: string;
    pages: number;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  // Group pages and session count by YYYY-MM-DD for selectedYear
  const dayStatsMap = useMemo(() => {
    const map = new Map<string, { pages: number; count: number }>();
    sessions.forEach((s) => {
      if (!s.date) return;
      const sYear = new Date(s.date).getFullYear();
      if (sYear === selectedYear) {
        const existing = map.get(s.date) || { pages: 0, count: 0 };
        map.set(s.date, {
          pages: existing.pages + (s.pagesRead || 0),
          count: existing.count + 1,
        });
      }
    });
    return map;
  }, [sessions, selectedYear]);

  // Generate days for the selected year
  const weeks = useMemo(() => {
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);

    // Adjust to starting Sunday/Monday of the first week
    const startDay = startDate.getDay(); // 0 is Sunday
    const calendarStart = new Date(startDate);
    calendarStart.setDate(startDate.getDate() - startDay);

    const weekList: { date: Date; dateStr: string; inYear: boolean }[][] = [];
    let currentWeek: { date: Date; dateStr: string; inYear: boolean }[] = [];
    const cur = new Date(calendarStart);

    while (cur <= endDate || currentWeek.length > 0) {
      const dateStr = cur.toISOString().split('T')[0];
      const inYear = cur.getFullYear() === selectedYear;

      currentWeek.push({
        date: new Date(cur),
        dateStr,
        inYear,
      });

      if (currentWeek.length === 7) {
        weekList.push(currentWeek);
        currentWeek = [];
        if (cur > endDate) break;
      }

      cur.setDate(cur.getDate() + 1);
    }

    return weekList;
  }, [selectedYear]);

  // Statistics
  const activeDaysCount = dayStatsMap.size;
  const isLeapYear = (selectedYear % 4 === 0 && selectedYear % 100 !== 0) || selectedYear % 400 === 0;
  const totalYearDays = isLeapYear ? 366 : 365;
  const consistencyPct = Math.round((activeDaysCount / totalYearDays) * 100);

  // Cell coloring
  const getCellColor = (pages: number, inYear: boolean) => {
    if (!inYear) return 'bg-transparent';
    if (pages === 0) return 'bg-stone-100 hover:bg-stone-200';
    if (pages < 20) return 'bg-amber-200/80 hover:bg-amber-300';
    if (pages < 45) return 'bg-amber-400 hover:bg-amber-500';
    if (pages < 80) return 'bg-amber-600 hover:bg-amber-700';
    return 'bg-amber-800 hover:bg-amber-900';
  };

  const monthLabels = [
    { label: 'Jan', weekIdx: 0 },
    { label: 'Feb', weekIdx: 4 },
    { label: 'Mar', weekIdx: 8 },
    { label: 'Apr', weekIdx: 13 },
    { label: 'May', weekIdx: 17 },
    { label: 'Jun', weekIdx: 21 },
    { label: 'Jul', weekIdx: 26 },
    { label: 'Aug', weekIdx: 30 },
    { label: 'Sep', weekIdx: 35 },
    { label: 'Oct', weekIdx: 39 },
    { label: 'Nov', weekIdx: 43 },
    { label: 'Dec', weekIdx: 48 },
  ];

  return (
    <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-semibold text-stone-900 tracking-tight font-sans">
            Reading Habit Heatmap
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Daily frequency matrix across all 52 weeks of {selectedYear}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-stone-600">
          <span>
            Active Days:{' '}
            <strong className="text-stone-900 font-semibold">{activeDaysCount}</strong> /{' '}
            {totalYearDays} ({consistencyPct}%)
          </span>
        </div>
      </div>

      {/* Grid View */}
      <div className="overflow-x-auto pb-2 scrollbar-none">
        <div className="min-w-[700px]">
          {/* Month labels */}
          <div className="flex text-[10px] text-stone-400 font-mono mb-1.5 pl-6">
            {monthLabels.map((m) => (
              <span
                key={m.label}
                className="w-14 shrink-0 text-left"
                style={{ marginLeft: m.weekIdx === 0 ? 0 : undefined }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex gap-1 items-start">
            {/* Day of week labels */}
            <div className="flex flex-col gap-1 text-[9px] text-stone-400 font-mono pr-2 shrink-0">
              <span className="h-3 leading-3">Sun</span>
              <span className="h-3 leading-3 opacity-0">Mon</span>
              <span className="h-3 leading-3">Tue</span>
              <span className="h-3 leading-3 opacity-0">Wed</span>
              <span className="h-3 leading-3">Thu</span>
              <span className="h-3 leading-3 opacity-0">Fri</span>
              <span className="h-3 leading-3">Sat</span>
            </div>

            {/* Matrix squares */}
            <div className="flex gap-1 flex-1">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1 shrink-0">
                  {week.map((day) => {
                    const stats = dayStatsMap.get(day.dateStr) || { pages: 0, count: 0 };
                    return (
                      <div
                        key={day.dateStr}
                        onMouseEnter={(e) => {
                          if (day.inYear) {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredDay({
                              dateStr: day.dateStr,
                              pages: stats.pages,
                              count: stats.count,
                              x: rect.left + rect.width / 2,
                              y: rect.top,
                            });
                          }
                        }}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`w-3 h-3 rounded-[2px] transition-colors cursor-pointer ${getCellColor(
                          stats.pages,
                          day.inYear
                        )}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-stone-500 pt-3 mt-3 border-t border-stone-100">
        <span className="text-[11px]">Consecutive habit compounds into lifetime wisdom.</span>
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-stone-100" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-amber-200/80" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-amber-600" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-amber-800" />
          <span>More</span>
        </div>
      </div>

      {/* Floating Tooltip */}
      {hoveredDay && (
        <div className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full transform pb-2.5 transition-all text-xs"
             style={{ left: hoveredDay.x, top: hoveredDay.y }}>
          <div className="bg-stone-900 text-white px-2.5 py-1.5 rounded shadow-lg text-[11px] font-mono tabular-nums whitespace-nowrap">
            <strong className="block text-amber-200">{hoveredDay.dateStr}</strong>
            {hoveredDay.pages > 0
              ? `${hoveredDay.pages} pages read (${hoveredDay.count} ${
                  hoveredDay.count === 1 ? 'session' : 'sessions'
                })`
              : 'No reading logged'}
          </div>
        </div>
      )}
    </div>
  );
};
