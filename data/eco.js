// Rough yearly pounds of oxygen produced and carbon dioxide absorbed by one plant of each kind.
// These are ballpark figures that vary a lot with age and size.
const YEARLY_POUNDS = {
  Trees: { oxygen: 260, carbon: 48 },
  Shrubs: { oxygen: 20, carbon: 8 },
  Perennials: { oxygen: 4, carbon: 2 },
  Annuals: { oxygen: 2, carbon: 1 },
  'Edible Plants': { oxygen: 3, carbon: 1.5 },
};
const POINTS_PER_POLLINATOR_PLANT = 20;

function pounds(amount) {
  return `${amount < 10 ? Math.round(amount * 10) / 10 : Math.round(amount)} lbs`;
}

// Estimated yearly impact of the plants in a garden.
export function ecoEstimate(garden) {
  let oxygen = 0;
  let carbon = 0;
  let pollinators = 0;
  garden.forEach((plant) => {
    oxygen += YEARLY_POUNDS[plant.category].oxygen;
    carbon += YEARLY_POUNDS[plant.category].carbon;
    pollinators += plant.pollinator ? 1 : 0;
  });
  return {
    oxygen: pounds(oxygen),
    carbon: pounds(carbon),
    pollinatorScore: `${Math.min(100, pollinators * POINTS_PER_POLLINATOR_PLANT)} pts`,
  };
}
