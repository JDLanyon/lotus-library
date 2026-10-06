'use client';

import { useState } from 'react';

export function useNameCycler(names: string[], switchProbability = 0.1) {
  const [currentIdx, setCurrentIdx] = useState(0); // always start at first name
  const [altIdx, setAltIdx] = useState(1);
  const [showAlt, setShowAlt] = useState(false);

  const startGlitch = () => {
    if (names.length >= 2) {
      let randomIdx: number;
      do {
        randomIdx = Math.floor(Math.random() * names.length);
      } while (randomIdx === currentIdx && names.length > 1);
      setAltIdx(randomIdx);
      setShowAlt(true);
    }
  };

  const endGlitch = () => {
    if (names.length >= 2 && showAlt) {
      if (Math.random() < switchProbability) {
        setCurrentIdx(altIdx);
      } else {
        setCurrentIdx(0);
      }
      setShowAlt(false);
    }
  };

  return {
    currentName: names[currentIdx],
    altName: names[altIdx],
    showAlt,
    startGlitch,
    endGlitch,
  };
}
