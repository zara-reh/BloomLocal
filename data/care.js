import { plants } from './mockData';
import { addDays, dateFromIso, daysBetween, isoDay } from './calendar';

// Days between waterings for each water need, before the weather is considered.
const WATER_DAYS = { Low: 10, Moderate: 5, High: 3 };
const SOAKING_RAIN_INCHES = 0.25;
const HOT_DEGREES = 90;
const FROZEN_DEGREES = 40;

// Tasks due within this many days are shown.
export const LOOKAHEAD_DAYS = 6;

// When each plant needs cutting back, as [month, day] to [month, day] every year.
const pruning = {
  peony: { action: 'Cut Back', from: [10, 1], to: [11, 30], tip: 'Cut stems to 2 to 3 inches above the ground once the leaves die back.' },
  hellebore: { action: 'Trim', from: [1, 1], to: [1, 31], tip: 'Remove last year’s tattered leaves so the new flowers show.' },
  'lambs-ear': { action: 'Deadhead', from: [8, 16], to: [9, 15], tip: 'Snip spent flower stalks at the base and pull off any dead leaves.' },
  boxwood: { action: 'Trim', from: [6, 1], to: [6, 30], tip: 'Lightly shear the new growth to keep the shape. Skip hot afternoons.' },
  'maple-tree': { action: 'Prune', from: [11, 15], to: [12, 31], tip: 'Remove dead or crossing branches while the tree is asleep.' },
  primrose: { action: 'Deadhead', from: [5, 16], to: [6, 15], tip: 'Pinch off spent flowers to encourage more blooms.' },
  bluebonnet: { action: 'Cut Back', from: [6, 15], to: [7, 15], tip: 'Let the seed pods dry and drop, then cut the plants back.' },
};

const harvestTips = {
  carrot: 'Loosen the soil, then pull carrots when they are about 1 inch wide.',
  beet: 'Pull beets when they are about 2 inches wide for the best flavor.',
  peas: 'Pick pods when they are plump and bright green.',
  watermelon: 'Ripe when the underside turns yellow and the nearby tendril dries brown.',
};

const mulching = [
  { name: 'spring', from: [3, 15], to: [4, 30], tip: 'Spread 2 to 3 inches of mulch to hold in moisture before summer.' },
  { name: 'fall', from: [11, 1], to: [12, 15], tip: 'Spread 2 to 3 inches of mulch to protect roots from winter cold.' },
];

const waterTips = {
  Low: 'Soak the soil deeply, then let it dry out before the next watering.',
  Moderate: 'Water at the base until the top inch of soil is damp.',
  High: 'Water at the base early in the morning so the leaves stay dry.',
};
const HOT_WATER_TIP = 'It is hot today. Water at the base early or in the evening.';

const colorsByType = {
  water: '#C1E5FF',
  prune: '#CBE8C1',
  harvest: '#F5E3A3',
  mulch: '#E9D5C0',
};
const iconsByType = { water: 'drop', prune: 'scissors', harvest: 'scissors', mulch: 'shovel' };

function makeTask(type, key, plantId, title, dueInDays, tip) {
  return { id: key, type, plantId, title, icon: iconsByType[type], iconColor: colorsByType[type], dueInDays, tip };
}

// The most recent time a plant got water: the day it was planted, a day it was watered, or a soaking rain.
function lastWater(plantId, plantedOn, completions, history) {
  let last = { date: plantedOn, rained: false };
  completions.forEach((completion) => {
    if (completion.type === 'water' && completion.plantId === plantId && completion.doneOn > last.date) {
      last = { date: completion.doneOn, rained: false };
    }
  });
  history.forEach((day) => {
    if (day.rain >= SOAKING_RAIN_INCHES && day.date > last.date) {
      last = { date: day.date, rained: true };
    }
  });
  return last;
}

function windowOffsets(today, year, rule) {
  const start = new Date(year, rule.from[0] - 1, rule.from[1]);
  const end = new Date(year, rule.to[0] - 1, rule.to[1]);
  return { starts: daysBetween(today, start), ends: daysBetween(today, end) };
}

// Works out what every plant in the garden needs, from the garden, the day, the weather and
// what has already been done. completions are { key, type, plantId, doneOn, task }.
// Returns the tasks due in the next few days, the finished tasks, and one status for each plant.
export function buildCare({ gardenIds, plantedOn, completions, weather, today }) {
  const todayIso = isoDay(today);
  const history = weather ? weather.history : [];
  const todayWeather = history.length > 0 ? history[history.length - 1] : null;
  const isDone = (key) => completions.some((completion) => completion.key === key);
  const tasks = [];
  const statuses = {};

  gardenIds.forEach((id) => {
    const plant = plants.find((candidate) => candidate.id === id);
    const planted = plantedOn[id] || todayIso;
    const found = [];

    const last = lastWater(id, planted, completions, history);
    const hot = todayWeather !== null && todayWeather.high >= HOT_DEGREES;
    const frozen = todayWeather !== null && todayWeather.high < FROZEN_DEGREES;
    const interval = Math.max(1, WATER_DAYS[plant.water] - (hot ? 1 : 0));
    const waterDue = daysBetween(today, dateFromIso(last.date)) + interval;
    const sinceWater = daysBetween(dateFromIso(last.date), today);
    if (!frozen && waterDue <= LOOKAHEAD_DAYS) {
      const dueIso = isoDay(addDays(dateFromIso(last.date), interval));
      found.push(makeTask('water', `water:${id}:${dueIso}`, id, `Water ${plant.name}`, Math.max(waterDue, 0), hot ? HOT_WATER_TIP : waterTips[plant.water]));
    }

    const rule = pruning[id];
    if (rule) {
      [today.getFullYear(), today.getFullYear() + 1].forEach((year) => {
        const { starts, ends } = windowOffsets(today, year, rule);
        const key = `prune:${id}:${year}`;
        if (ends >= 0 && starts <= LOOKAHEAD_DAYS && !isDone(key)) {
          found.push(makeTask('prune', key, id, `${rule.action} ${plant.name}`, Math.max(starts, 0), rule.tip));
        }
      });
    }

    if (plant.edible) {
      const readyOn = addDays(dateFromIso(planted), parseInt(plant.growTime, 10));
      const offset = daysBetween(today, readyOn);
      const key = `harvest:${id}`;
      if (offset <= LOOKAHEAD_DAYS && !isDone(key)) {
        found.push(makeTask('harvest', key, id, `Harvest ${plant.name}`, Math.max(offset, 0), harvestTips[id]));
      }
    }

    tasks.push(...found);

    const urgent = found.filter((task) => task.dueInDays === 0);
    const pick = (type) => urgent.find((task) => task.type === type);
    if (pick('water')) {
      statuses[id] = { type: 'water', text: 'Water now!', urgent: true };
    } else if (pick('harvest')) {
      statuses[id] = { type: 'harvest', text: 'Harvest now!', urgent: true };
    } else if (pick('prune')) {
      statuses[id] = { type: 'prune', text: 'Prune now!', urgent: true };
    } else {
      const verb = last.rained ? 'Rained' : 'Watered';
      const text = sinceWater === 0 ? `${verb} today.` : `${verb} ${sinceWater} ${sinceWater === 1 ? 'day' : 'days'} ago.`;
      statuses[id] = { type: 'water', text, urgent: false };
    }
  });

  if (gardenIds.length > 0) {
    mulching.forEach((rule) => {
      const year = today.getFullYear();
      const { starts, ends } = windowOffsets(today, year, rule);
      const key = `mulch:${year}:${rule.name}`;
      if (ends >= 0 && starts <= LOOKAHEAD_DAYS && !isDone(key)) {
        tasks.push(makeTask('mulch', key, null, 'Add Mulch to Beds', Math.max(starts, 0), rule.tip));
      }
    });
  }

  tasks.sort((a, b) => a.dueInDays - b.dueInDays);

  const done = completions
    .filter((completion) => completion.plantId === null || gardenIds.includes(completion.plantId))
    .map((completion) => ({ ...completion.task, doneOn: completion.doneOn }))
    .reverse();

  return { tasks, done, statuses };
}
