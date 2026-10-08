import React, { useState } from 'react';
import { GenreStat } from '../../types';

interface GenreDistributionChartProps {
  data: GenreStat[];
}

export const GenreDistributionChart: React.FC<GenreDistributionChartProps> = ({ data }) => {
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);

  const actualTotalBooks = data.reduce((acc, d) => acc + d.count, 0);
  const totalBooks = actualTotalBooks || 1;

  // Donut geometry calculations
  const size = 160;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeAngle = 0;

  return (
    <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="text-base font-semibold text-stone-900 tracking-tight font-sans">
          Genre Distribution
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Proportion of library across literary categories
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 my-4">
        {/* SVG Donut */}
        <div className="relative shrink-0 w-40 h-40 flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#F5F5F4"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {data.map((item) => {
              const strokeDasharray = `${(item.count / totalBooks) * circumference} ${circumference}`;
              const strokeDashoffset = -cumulativeAngle;
              cumulativeAngle += (item.count / totalBooks) * circumference;

              const isHovered = hoveredGenre === item.genre;

              return (
                <circle
                  key={item.genre}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={item.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  fill="transparent"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredGenre(item.genre)}
                  onMouseLeave={() => setHoveredGenre(null)}
                />
              );
            })}
          </svg>

          {/* Center text in donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
            <span className="text-xl font-bold font-mono text-stone-900 tabular-nums">
              {actualTotalBooks}
            </span>
            <span className="text-[10px] uppercase font-sans tracking-wider text-stone-400">
              Titles
            </span>
          </div>
        </div>

        {/* Ranked Genre List */}
        <div className="flex-1 w-full space-y-2">
          {data.length === 0 ? (
            <div className="py-6 text-center text-xs text-stone-400 font-sans">
              No books categorized yet.
            </div>
          ) : (
            data.slice(0, 5).map((item) => {
              const isHovered = hoveredGenre === item.genre;
              return (
                <div
                  key={item.genre}
                  onMouseEnter={() => setHoveredGenre(item.genre)}
                  onMouseLeave={() => setHoveredGenre(null)}
                  className={`flex items-center justify-between text-xs py-1 px-1.5 rounded transition-colors ${
                    isHovered ? 'bg-stone-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-stone-800 font-medium truncate">
                      {item.genre}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-stone-500 font-mono tabular-nums">
                    <span>{item.count}</span>
                    <span className="text-stone-300">·</span>
                    <span className="w-8 text-right font-medium text-stone-700">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
        <span>Most read category:</span>
        <span className="font-medium text-stone-900 truncate ml-2">
          {data[0]?.genre || 'None'}
        </span>
      </div>
    </div>
  );
};
