import React, { useState } from 'react';
import { MonthlyReadingData } from '../../types';

interface MonthlyTrendChartProps {
  data: MonthlyReadingData[];
  selectedYear: number;
}

export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ data, selectedYear }) => {
  const [metric, setMetric] = useState<'pages' | 'books'>('pages');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const values = data.map((d) => (metric === 'pages' ? d.pagesRead : d.booksCompleted));
  const maxValue = Math.max(...values, metric === 'pages' ? 100 : 3);
  const totalValue = values.reduce((a, b) => a + b, 0);

  // SVG dimensions
  const height = 180;
  const paddingBottom = 28;
  const paddingTop = 20;
  const chartHeight = height - paddingBottom - paddingTop;

  return (
    <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-semibold text-stone-900 tracking-tight font-sans">
            Monthly Reading Trend
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Total {metric === 'pages' ? 'pages read' : 'books completed'} in {selectedYear}:{' '}
            <strong className="text-stone-800 font-mono tabular-nums font-semibold">
              {metric === 'pages' ? totalValue.toLocaleString() : totalValue}
            </strong>
          </p>
        </div>

        {/* Toggle metric */}
        <div className="flex items-center p-0.5 bg-stone-100 rounded-lg shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMetric('pages')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              metric === 'pages'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Pages
          </button>
          <button
            type="button"
            onClick={() => setMetric('books')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              metric === 'books'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Books
          </button>
        </div>
      </div>

      {/* Responsive Bar Chart View */}
      <div className="relative w-full pt-4">
        {/* Tooltip on hover */}
        {hoveredIndex !== null && (
          <div
            className="absolute top-0 -translate-y-full transform pointer-events-none z-20 bg-stone-900 text-white text-xs px-2.5 py-1 rounded shadow-md font-mono tabular-nums"
            style={{
              left: `${((hoveredIndex + 0.5) / 12) * 100}%`,
              transform: 'translateX(-50%) translateY(-6px)',
            }}
          >
            {data[hoveredIndex].month}: {values[hoveredIndex].toLocaleString()}{' '}
            {metric === 'pages' ? 'pages' : 'books'}
          </div>
        )}

        <div className="grid grid-cols-12 gap-1.5 sm:gap-2.5 items-end h-[160px] pb-6 border-b border-stone-100">
          {data.map((item, idx) => {
            const val = values[idx];
            const heightPct = maxValue > 0 ? Math.round((val / maxValue) * 100) : 0;
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={item.month}
                className="flex flex-col items-center h-full justify-end group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Bar */}
                <div className="w-full max-w-[28px] h-full flex items-end">
                  <div
                    className={`w-full rounded-t-sm transition-all duration-300 ${
                      val > 0
                        ? isHovered
                          ? 'bg-amber-600'
                          : 'bg-stone-800 group-hover:bg-amber-700'
                        : 'bg-stone-100 group-hover:bg-stone-200'
                    }`}
                    style={{
                      height: `${Math.max(4, heightPct)}%`,
                    }}
                  />
                </div>
                {/* Label */}
                <span
                  className={`text-[11px] font-mono mt-2 transition-colors ${
                    isHovered ? 'text-stone-900 font-semibold' : 'text-stone-400'
                  }`}
                >
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Accessible summary */}
      <div className="mt-4 pt-3 flex items-center justify-between text-xs text-stone-600">
        <span>Average monthly pace:</span>
        <span className="font-mono tabular-nums font-semibold text-stone-900">
          {metric === 'pages'
            ? `${Math.round(totalValue / 12).toLocaleString()} pages/mo`
            : `${(totalValue / 12).toFixed(1)} books/mo`}
        </span>
      </div>
    </div>
  );
};
