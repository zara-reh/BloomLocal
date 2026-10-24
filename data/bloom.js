import { daysBetween, formatDay, MONTH_NAMES } from './calendar';

// A plant has a budding season and then a blooming season every year. Each one is
// [[startMonth, startDay], [endMonth, endDay]] with the month from 1 to 12. A season can run
// past the end of the year, like Hellebore blooming from December 20 to March 31.

// The next date on or after "after" that falls on this month and day.
function dateOnOrAfter(after, [month, day]) {
  let date = new Date(after.getFullYear(), month - 1, day);
  if (daysBetween(after, date) < 0) {
    date = new Date(after.getFullYear() + 1, month - 1, day);
  }
  return date;
}

// The dates of one run of the seasons, starting from the budding start in the given year.
function occurrence(season, year) {
  const budStart = new Date(year, season.budding[0][0] - 1, season.budding[0][1]);
  const budEnd = dateOnOrAfter(budStart, season.budding[1]);
  const bloomStart = dateOnOrAfter(budEnd, season.blooming[0]);
  const bloomEnd = dateOnOrAfter(bloomStart, season.blooming[1]);
  return { budStart, budEnd, bloomStart, bloomEnd };
}

function plural(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

function within(date, from, to) {
  return daysBetween(from, date) >= 0 && daysBetween(date, to) >= 0;
}

// Where a plant is on one date during one run of its seasons.
//   status:    'Peak Bloom', 'Ending Bloom', 'Budding', or 'Out of Season'
//   progress:  0 to 1 through the bloom (0 before it starts)
//   note:      the short line shown under the progress bar
//   daysUntil: days until budding starts (0 once it has)
function stateOn(run, date) {
  if (within(date, run.bloomStart, run.bloomEnd)) {
    const total = Math.max(daysBetween(run.bloomStart, run.bloomEnd), 1);
    const progress = Math.min(daysBetween(run.bloomStart, date) / total, 1);
    const remaining = daysBetween(date, run.bloomEnd);
    const ending = remaining <= 7 || progress >= 0.85;
    return {
      status: ending ? 'Ending Bloom' : 'Peak Bloom',
      progress,
      note: `${plural(remaining, 'day')} of bloom left`,
      daysUntil: 0,
    };
  }
  if (within(date, run.budStart, run.budEnd)) {
    return { status: 'Budding', progress: 0, note: `${plural(daysBetween(date, run.bloomStart), 'day')} until bloom`, daysUntil: 0 };
  }
  const finished = daysBetween(run.bloomEnd, date) > 0;
  return {
    status: 'Out of Season',
    progress: 0,
    note: finished ? `Bloom ended ${formatDay(run.bloomEnd)}` : `Buds in ${MONTH_NAMES[run.budStart.getMonth()]}`,
    daysUntil: Math.max(daysBetween(date, run.budStart), 0),
  };
}

// Where a plant is today, using the run of its seasons that is happening now or comes next.
export function bloomToday(season, today) {
  for (const year of [today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1]) {
    const run = occurrence(season, year);
    if (daysBetween(today, run.bloomEnd) >= 0) {
      return stateOn(run, today);
    }
  }
  return stateOn(occurrence(season, today.getFullYear() + 1), today);
}

// What shows for a plant when the Bloom Tracker is on a given month, or null if the plant is
// neither budding nor blooming at any point in that month.
//   For the current month the plant's state is as of today. For any other month it is as of
//   the middle of the month, or the closest day to it that falls in the plant's seasons.
//   blooming is true if the plant blooms at any point in the month.
export function bloomInMonth(season, month, today) {
  const monthStart = new Date(month.year, month.index, 1);
  const monthEnd = new Date(month.year, month.index + 1, 0);

  for (const year of [month.year - 1, month.year, month.year + 1]) {
    const run = occurrence(season, year);
    const from = daysBetween(monthStart, run.budStart) > 0 ? run.budStart : monthStart;
    const to = daysBetween(monthEnd, run.bloomEnd) < 0 ? run.bloomEnd : monthEnd;
    if (daysBetween(from, to) < 0) {
      continue;
    }

    const blooming =
      daysBetween(monthStart, run.bloomEnd) >= 0 && daysBetween(run.bloomStart, monthEnd) >= 0;
    const current = today.getFullYear() === month.year && today.getMonth() === month.index;

    let date = today;
    if (!current) {
      const middle = new Date(month.year, month.index, 15);
      date = daysBetween(middle, from) > 0 ? from : daysBetween(middle, to) < 0 ? to : middle;
    }

    const state = stateOn(run, date);
    if (!current) {
      state.note =
        state.status === 'Budding'
          ? `Buds ${formatDay(run.budStart)} - ${formatDay(run.budEnd)}`
          : `Blooms ${formatDay(run.bloomStart)} - ${formatDay(run.bloomEnd)}`;
    }
    return { state, blooming };
  }
  return null;
}
