import { useMemo } from 'react';
import { useAppState } from './AppState';
import { buildCare } from '../data/care';
import { isoDay } from '../data/calendar';

// What the garden needs: { tasks, done, statuses }. See buildCare in data/care.js.
export function useCare() {
  const { gardenIds, plantedOn, completions, weather } = useAppState();
  const day = isoDay(new Date());

  return useMemo(
    () => buildCare({ gardenIds, plantedOn, completions, weather, today: new Date() }),
    [gardenIds, plantedOn, completions, weather, day]
  );
}
