const DAY_MS = 24 * 60 * 60 * 1000;

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_LETTERS = ['M', 'T', 'W', 'Th', 'F', 'Sat', 'Sun'];

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Whole days from one date to another. Negative if the second date is earlier.
export function daysBetween(from, to) {
  return Math.round((startOfDay(to) - startOfDay(from)) / DAY_MS);
}

export function monthTitle(date) {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

export function seasonName(date) {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) {
    return 'Spring';
  }
  if (month >= 5 && month <= 7) {
    return 'Summer';
  }
  if (month >= 8 && month <= 10) {
    return 'Autumn';
  }
  return 'Winter';
}

// The seven days of the week (Monday first) that contains the date.
export function weekOf(date) {
  const mondayOffset = (date.getDay() + 6) % 7;
  return DAY_LETTERS.map((letter, index) => {
    const day = new Date(date.getFullYear(), date.getMonth(), date.getDate() - mondayOffset + index);
    return { letter, day, dayOfMonth: day.getDate(), today: daysBetween(date, day) === 0 };
  });
}

// "Mar 15" for March 15.
export function formatDay(date) {
  return `${MONTH_NAMES[date.getMonth()].slice(0, 3)} ${date.getDate()}`;
}

// Five months with the current one in the middle, for example Mar Apr May Jun Jul.
export function monthsAround(date) {
  return [-2, -1, 0, 1, 2].map((offset) => {
    const month = new Date(date.getFullYear(), date.getMonth() + offset, 1);
    return {
      index: month.getMonth(),
      year: month.getFullYear(),
      name: MONTH_NAMES[month.getMonth()].slice(0, 3),
      current: offset === 0,
    };
  });
}
