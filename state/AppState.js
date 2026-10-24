import { createContext, useContext, useState } from 'react';
import { useWeather } from './useWeather';
import { isoDay } from '../data/calendar';

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [name, setName] = useState('');
  const [zip, setZip] = useState('');
  const [zone, setZone] = useState(null);
  const [location, setLocation] = useState(null);
  const [sun, setSun] = useState(null);
  const [soil, setSoil] = useState(null);
  const [commitment, setCommitment] = useState(null);
  const [gardenIds, setGardenIds] = useState([]);
  const [plantedOn, setPlantedOn] = useState({});
  const [completions, setCompletions] = useState([]);
  const { status: weatherStatus, weather } = useWeather(location);

  const togglePlant = (id) => {
    if (gardenIds.includes(id)) {
      setGardenIds(gardenIds.filter((gardenId) => gardenId !== id));
    } else {
      setGardenIds([...gardenIds, id]);
      setPlantedOn({ ...plantedOn, [id]: isoDay(new Date()) });
    }
  };

  // Marks a task done today, or puts it back if it was already done.
  const toggleTask = (task) => {
    if (completions.some((completion) => completion.key === task.id)) {
      setCompletions(completions.filter((completion) => completion.key !== task.id));
    } else {
      setCompletions([
        ...completions,
        { key: task.id, type: task.type, plantId: task.plantId, doneOn: isoDay(new Date()), task },
      ]);
    }
  };

  const resetApp = () => {
    setName('');
    setZip('');
    setZone(null);
    setLocation(null);
    setSun(null);
    setSoil(null);
    setCommitment(null);
    setGardenIds([]);
    setPlantedOn({});
    setCompletions([]);
  };

  const value = {
    name, setName,
    zip, setZip,
    zone, setZone,
    location, setLocation,
    sun, setSun,
    soil, setSoil,
    commitment, setCommitment,
    gardenIds, togglePlant,
    plantedOn,
    completions, toggleTask,
    weather, weatherStatus,
    resetApp,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  return useContext(AppStateContext);
}
