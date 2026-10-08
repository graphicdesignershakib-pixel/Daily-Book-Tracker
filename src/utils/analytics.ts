import { Book, ReadingSession, ReadingGoals, MonthlyReadingData, GenreStat, GoalProgress } from '../types';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface AnalyticsSummary {
  totalBooks: number;
  booksCompleted: number;
  currentlyReading: number;
  totalPagesRead: number;
  annualTarget: number;
  annualActual: number;
  annualUnit: 'books' | 'pages';
  annualProgressPct: number;
  annualRemaining: number;
  averageRating: number;
  booksPerMonth: number;
  pagesPerMonth: number;
  favoriteGenre: string;
  monthlyTrend: MonthlyReadingData[];
  genreDistribution: GenreStat[];
  goalsProgress: {
    daily: GoalProgress;
    weekly: GoalProgress;
    monthly: GoalProgress;
    yearly: GoalProgress;
  };
  currentStreakDays: number;
  totalReadingMinutes: number;
}

export function computeAnalytics(
  books: Book[],
  sessions: ReadingSession[],
  goals: ReadingGoals,
  selectedYear: number
): AnalyticsSummary {
  // 1. Filter sessions for selected year
  const yearSessions = sessions.filter((s) => {
    if (!s.date) return false;
    const sessionYear = new Date(s.date).getFullYear();
    return sessionYear === selectedYear;
  });

  // 2. Filter books related to selected year
  // A book is in the year if it was started, finished, or created in that year, or currently reading
  const yearBooks = books.filter((b) => {
    const createdYear = new Date(b.createdAt).getFullYear();
    const startYear = b.startDate ? new Date(b.startDate).getFullYear() : null;
    const finishYear = b.finishDate ? new Date(b.finishDate).getFullYear() : null;
    return (
      createdYear === selectedYear ||
      startYear === selectedYear ||
      finishYear === selectedYear ||
      (b.status === 'Reading' && selectedYear === new Date().getFullYear())
    );
  });

  // Completed books in this year
  const completedBooksThisYear = books.filter((b) => {
    if (b.status !== 'Completed') return false;
    if (b.finishDate) {
      return new Date(b.finishDate).getFullYear() === selectedYear;
    }
    return new Date(b.createdAt).getFullYear() === selectedYear;
  });

  // Currently reading (global active)
  const currentlyReadingBooks = books.filter((b) => b.status === 'Reading');

  // Total pages read in selected year:
  // Preferred source: sessions in this year!
  let totalPagesReadYear = yearSessions.reduce((acc, s) => acc + (s.pagesRead || 0), 0);
  // Fallback: If no sessions exist for year but books have page progress in that year
  if (totalPagesReadYear === 0) {
    totalPagesReadYear = yearBooks.reduce((acc, b) => acc + (b.currentPage || 0), 0);
  }

  // Reading minutes in this year
  const totalReadingMinutes = yearSessions.reduce((acc, s) => acc + (s.readingMinutes || 0), 0);

  // Annual Target calculation
  const yearlyTarget = goals.yearly.target || 20;
  const isYearlyInPages = goals.yearly.unit === 'pages';
  const annualActual = isYearlyInPages ? totalPagesReadYear : completedBooksThisYear.length;
  const annualProgressPct = yearlyTarget > 0 ? (annualActual / yearlyTarget) * 100 : 0;
  const annualRemaining = Math.max(0, yearlyTarget - annualActual);

  // Average Rating
  const ratedBooks = books.filter((b) => b.rating && b.rating > 0);
  const averageRating =
    ratedBooks.length > 0
      ? Number((ratedBooks.reduce((acc, b) => acc + b.rating, 0) / ratedBooks.length).toFixed(1))
      : 0;

  // Active months count for selected year
  const currentCalYear = new Date().getFullYear();
  const currentMonthIdx = new Date().getMonth(); // 0 to 11
  let activeMonths = 12;
  if (selectedYear === currentCalYear) {
    activeMonths = Math.max(1, currentMonthIdx + 1);
  } else if (selectedYear > currentCalYear) {
    activeMonths = 1;
  }

  const booksPerMonth = Number((completedBooksThisYear.length / activeMonths).toFixed(1));
  const pagesPerMonth = Math.round(totalPagesReadYear / activeMonths);

  // Favorite Genre
  const genreCountMap: Record<string, { count: number; pages: number }> = {};
  books.forEach((b) => {
    const genre = b.category || 'Uncategorized';
    if (!genreCountMap[genre]) {
      genreCountMap[genre] = { count: 0, pages: 0 };
    }
    genreCountMap[genre].count += 1;
    genreCountMap[genre].pages += b.currentPage || 0;
  });

  let favoriteGenre = 'General';
  let maxGenreWeight = 0;
  Object.entries(genreCountMap).forEach(([genre, stats]) => {
    const weight = stats.count * 1000 + stats.pages;
    if (weight > maxGenreWeight) {
      maxGenreWeight = weight;
      favoriteGenre = genre;
    }
  });

  // Monthly Reading Trend (12 months)
  const monthlyTrend: MonthlyReadingData[] = MONTH_NAMES.map((month, idx) => ({
    month,
    monthIndex: idx,
    booksCompleted: 0,
    pagesRead: 0,
  }));

  yearSessions.forEach((s) => {
    if (!s.date) return;
    const sDate = new Date(s.date);
    if (sDate.getFullYear() === selectedYear) {
      const mIdx = sDate.getMonth();
      if (monthlyTrend[mIdx]) {
        monthlyTrend[mIdx].pagesRead += s.pagesRead || 0;
      }
    }
  });

  completedBooksThisYear.forEach((b) => {
    const finishDateStr = b.finishDate || b.createdAt;
    const fDate = new Date(finishDateStr);
    if (fDate.getFullYear() === selectedYear) {
      const mIdx = fDate.getMonth();
      if (monthlyTrend[mIdx]) {
        monthlyTrend[mIdx].booksCompleted += 1;
      }
    }
  });

  // Genre Distribution
  const GENRE_COLORS = [
    '#B45309', // Warm amber / cognac
    '#1E3A2F', // Forest pine
    '#2563EB', // Sapphire
    '#7C3AED', // Violet
    '#D97706', // Ocher
    '#059669', // Emerald
    '#DC2626', // Terracotta red
    '#475569', // Slate
  ];

  const totalGenreBooks = books.length || 1;
  const genreDistribution: GenreStat[] = Object.entries(genreCountMap)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([genre, stats], idx) => ({
      genre,
      count: stats.count,
      pagesRead: stats.pages,
      percentage: Math.round((stats.count / totalGenreBooks) * 100),
      color: GENRE_COLORS[idx % GENRE_COLORS.length],
    }));

  // Goal Progress Calculations (Daily, Weekly, Monthly, Yearly)
  const todayStr = new Date().toISOString().split('T')[0];

  // Daily actual
  const todaySessions = sessions.filter((s) => s.date === todayStr);
  const dailyTarget = goals.daily.target || 20;
  const dailyActual =
    goals.daily.unit === 'minutes'
      ? todaySessions.reduce((acc, s) => acc + (s.readingMinutes || 0), 0)
      : todaySessions.reduce((acc, s) => acc + (s.pagesRead || 0), 0);
  const dailyProgressPct = dailyTarget > 0 ? (dailyActual / dailyTarget) * 100 : 0;

  // Weekly actual (last 7 days or current ISO week)
  const todayDate = new Date();
  const dayOfWeek = todayDate.getDay(); // 0 is Sunday
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(todayDate);
  monday.setDate(todayDate.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const thisWeekSessions = sessions.filter((s) => {
    const sDate = new Date(s.date);
    return sDate >= monday && sDate <= todayDate;
  });

  const weeklyTarget = goals.weekly.target || 150;
  let weeklyActual = 0;
  if (goals.weekly.unit === 'minutes') {
    weeklyActual = thisWeekSessions.reduce((acc, s) => acc + (s.readingMinutes || 0), 0);
  } else if (goals.weekly.unit === 'books') {
    weeklyActual = completedBooksThisYear.filter((b) => {
      if (!b.finishDate) return false;
      const fDate = new Date(b.finishDate);
      return fDate >= monday && fDate <= todayDate;
    }).length;
  } else {
    weeklyActual = thisWeekSessions.reduce((acc, s) => acc + (s.pagesRead || 0), 0);
  }
  const weeklyProgressPct = weeklyTarget > 0 ? (weeklyActual / weeklyTarget) * 100 : 0;

  // Monthly actual (current month)
  const currentMonthSessions = sessions.filter((s) => {
    const sDate = new Date(s.date);
    return sDate.getFullYear() === currentCalYear && sDate.getMonth() === currentMonthIdx;
  });

  const monthlyTarget = goals.monthly.target || 2;
  let monthlyActual = 0;
  if (goals.monthly.unit === 'minutes') {
    monthlyActual = currentMonthSessions.reduce((acc, s) => acc + (s.readingMinutes || 0), 0);
  } else if (goals.monthly.unit === 'books') {
    monthlyActual = completedBooksThisYear.filter((b) => {
      const fDate = new Date(b.finishDate || b.createdAt);
      return fDate.getFullYear() === currentCalYear && fDate.getMonth() === currentMonthIdx;
    }).length;
  } else {
    monthlyActual = currentMonthSessions.reduce((acc, s) => acc + (s.pagesRead || 0), 0);
  }
  const monthlyProgressPct = monthlyTarget > 0 ? (monthlyActual / monthlyTarget) * 100 : 0;

  // Streak Calculation (consecutive days with sessions up to today or yesterday)
  const sessionDatesSet = new Set(sessions.map((s) => s.date));
  let streak = 0;
  const checkDate = new Date();
  
  // If no session today yet, check if there was one yesterday to keep streak alive
  const todaySessionExists = sessionDatesSet.has(todayStr);
  if (!todaySessionExists) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dStr = checkDate.toISOString().split('T')[0];
    if (sessionDatesSet.has(dStr)) {
      streak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return {
    totalBooks: books.length,
    booksCompleted: completedBooksThisYear.length,
    currentlyReading: currentlyReadingBooks.length,
    totalPagesRead: totalPagesReadYear,
    annualTarget: yearlyTarget,
    annualActual,
    annualUnit: goals.yearly.unit,
    annualProgressPct,
    annualRemaining,
    averageRating,
    booksPerMonth,
    pagesPerMonth,
    favoriteGenre,
    monthlyTrend,
    genreDistribution,
    goalsProgress: {
      daily: {
        title: 'Daily Reading',
        frequency: 'daily',
        target: dailyTarget,
        actual: dailyActual,
        unit: goals.daily.unit,
        progressPct: dailyProgressPct,
        remaining: Math.max(0, dailyTarget - dailyActual),
        isCompleted: dailyActual >= dailyTarget,
      },
      weekly: {
        title: 'Weekly Target',
        frequency: 'weekly',
        target: weeklyTarget,
        actual: weeklyActual,
        unit: goals.weekly.unit,
        progressPct: weeklyProgressPct,
        remaining: Math.max(0, weeklyTarget - weeklyActual),
        isCompleted: weeklyActual >= weeklyTarget,
      },
      monthly: {
        title: 'Monthly Pace',
        frequency: 'monthly',
        target: monthlyTarget,
        actual: monthlyActual,
        unit: goals.monthly.unit,
        progressPct: monthlyProgressPct,
        remaining: Math.max(0, monthlyTarget - monthlyActual),
        isCompleted: monthlyActual >= monthlyTarget,
      },
      yearly: {
        title: `${selectedYear} Annual Goal`,
        frequency: 'yearly',
        target: yearlyTarget,
        actual: annualActual,
        unit: goals.yearly.unit,
        progressPct: annualProgressPct,
        remaining: annualRemaining,
        isCompleted: annualActual >= yearlyTarget,
      },
    },
    currentStreakDays: streak,
    totalReadingMinutes,
  };
}
