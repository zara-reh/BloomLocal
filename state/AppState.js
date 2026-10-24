import { createContext, useContext, useState } from 'react';

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [name, setName] = useState('');
  const [zip, setZip] = useState('');
  const [zone, setZone] = useState(null);
  const [sun, setSun] = useState(null);
  const [soil, setSoil] = useState(null);
  const [commitment, setCommitment] = useState(null);
  const [gardenIds, setGardenIds] = useState([]);
  const [doneTaskIds, setDoneTaskIds] = useState([]);

  const togglePlant = (id) => {
    setGardenIds((ids) => (ids.includes(id) ? ids.filter((gardenId) => gardenId !== id) : [...ids, id]));
  };

  const value = {
    name, setName,
    zip, setZip,
    zone, setZone,
    sun, setSun,
    soil, setSoil,
    commitment, setCommitment,
    gardenIds, togglePlant,
    doneTaskIds, setDoneTaskIds,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  return useContext(AppStateContext);
}
