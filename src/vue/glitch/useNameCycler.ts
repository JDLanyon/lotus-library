import { ref } from 'vue';

/** Vue mirror of the React `useNameCycler` hook. */
export function useNameCycler(names: string[], switchProbability = 0.1) {
  const currentIdx = ref(0);
  const altIdx = ref(1);
  const showAlt = ref(false);

  function startGlitch() {
    if (names.length >= 2) {
      let randomIdx: number;
      do {
        randomIdx = Math.floor(Math.random() * names.length);
      } while (randomIdx === currentIdx.value && names.length > 1);
      altIdx.value = randomIdx;
      showAlt.value = true;
    }
  }

  function endGlitch() {
    if (names.length >= 2 && showAlt.value) {
      if (Math.random() < switchProbability) {
        currentIdx.value = altIdx.value;
      } else {
        currentIdx.value = 0;
      }
      showAlt.value = false;
    }
  }

  return {
    currentName: () => names[currentIdx.value],
    altName: () => names[altIdx.value],
    showAlt,
    startGlitch,
    endGlitch,
  };
}
