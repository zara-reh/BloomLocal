const careAllowed = {
  Low: ['Low'],
  Medium: ['Low', 'Medium'],
  High: ['Low', 'Medium', 'High'],
};

// Picks the plants that suit a garden. A choice that has not been made yet is ignored.
export function matchPlants(plants, { zone, sun, soil, commitment }) {
  const inZone = plants.filter((plant) => plant.zones.includes(zone));

  const matches = inZone.filter(
    (plant) =>
      (!sun || plant.sun.includes(sun)) &&
      (!soil || plant.soils.includes(soil)) &&
      (!commitment || careAllowed[commitment].includes(plant.care))
  );

  if (matches.length >= 3) {
    return matches;
  }
  // Too few matches: show everything that grows in the zone so the list is never empty.
  return inZone.length >= 3 ? inZone : plants;
}
