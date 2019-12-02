import React, { createContext, useState } from 'react';
import modes from '../constants/modes';
import tones from '../constants/tones';

export const MessiaenContext = createContext();

const MessiaenProvider = ({
  defaultMode = modes[0],
  defaultTone = tones[tones.length - 1],
  children,
}) => {
  const [selectedMode, setSelectedMode] = useState(defaultMode);
  const [selectedTone, setSelectedTone] = useState(defaultTone);

  const messiaenConfig = {
    selectedMode,
    setSelectedMode,
    selectedTone,
    setSelectedTone
  };

  return (
    <MessiaenContext.Provider value={messiaenConfig}>
      {children}
    </MessiaenContext.Provider>
  );
};

export default MessiaenProvider;
