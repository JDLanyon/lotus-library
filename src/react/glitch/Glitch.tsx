'use client';

import * as React from 'react';
import { useGlitchState } from './glitch_state';
import { useNameCycler } from './name_state';
import { ShakeEffect } from './effects/ShakeEffect';
import { ChromaticAberrationEffect } from './effects/ChromaticAberrationEffect';
import { MotionBlurEffect } from './effects/MotionBlurEffect';
import { NoiseEffect } from './effects/NoiseEffect';
import { ScanlineEffect } from './effects/ScanlineEffect';
import { FlickerEffect } from './effects/FlickerEffect';
import { PositionDisplacementEffect } from './effects/PositionDisplacementEffect';

export interface GlitchHandle {
  glitch: () => void;
}

export interface GlitchProps {
  ref?: React.Ref<GlitchHandle>;
  /** Rotating names — when set, enables name-cycler mode. */
  names?: string[];
  duration?: number;
  delay?: number;
  variance?: number;
  glitchCountForFlash?: number;
  glitchIntensity?: number;
  className?: string;
  children?: React.ReactNode;
  nameSwitchProbability?: number;
  preserveSpace?: boolean;
  onGlitchComplete?: () => void;
  /** Auto-trigger glitches on a timer. Set false for manual (e.g. hover-only). */
  autoGlitch?: boolean;
}

export const Glitch = function Glitch({
  ref,
  names,
  duration = 200,
  delay = 8000,
  variance = 500,
  glitchCountForFlash = 5,
  glitchIntensity = 1,
  className = '',
  children,
  nameSwitchProbability = 0.1,
  preserveSpace = true,
  onGlitchComplete,
  autoGlitch = true,
}: GlitchProps) {
  const isNameMode = !!names && names.length > 0;
  const nameCycler = useNameCycler(names ?? [], nameSwitchProbability);

  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [maxNameWidth, setMaxNameWidth] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!preserveSpace || !names || names.length === 0) return;
    if (!measureRef.current) return;

    const measure = document.createElement('span');
    const cs = window.getComputedStyle(measureRef.current);
    measure.style.position = 'absolute';
    measure.style.visibility = 'hidden';
    measure.style.whiteSpace = 'nowrap';
    measure.style.font = cs.font;
    measure.style.fontSize = cs.fontSize;
    measure.style.fontFamily = cs.fontFamily;
    measure.style.fontWeight = cs.fontWeight;
    measure.style.letterSpacing = cs.letterSpacing;
    document.body.appendChild(measure);

    let max = 0;
    names.forEach((name) => {
      measure.textContent = name;
      max = Math.max(max, measure.getBoundingClientRect().width);
    });

    document.body.removeChild(measure);
    setMaxNameWidth(max);
  }, [preserveSpace, names]);

  const { phase, intensity, isInverted, displacement, glitchDuration, triggerGlitch } =
    useGlitchState({
      duration,
      delay,
      variance,
      glitchCountForFlash,
      glitchIntensity,
      enabled: autoGlitch,
    });

  React.useImperativeHandle(ref, () => ({ glitch: triggerGlitch }));

  React.useEffect(() => {
    if (phase === 'idle') onGlitchComplete?.();
  }, [phase, onGlitchComplete]);

  const flickerRef = React.useRef(false);
  React.useEffect(() => {
    if (phase === 'active') {
      flickerRef.current = Math.random() <= 0.1;
    }
  }, [phase]);

  React.useEffect(() => {
    if (!isNameMode) return;
    if (phase !== 'idle') nameCycler.startGlitch();
    else nameCycler.endGlitch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, isNameMode]);

  const mainContent = isNameMode
    ? nameCycler.showAlt
      ? nameCycler.altName
      : nameCycler.currentName
    : children;

  const chromaContent = (() => {
    if (isNameMode && names) {
      const idx = nameCycler.showAlt
        ? (names.indexOf(nameCycler.altName) + 1) % names.length
        : names.indexOf(nameCycler.currentName);
      return names[idx] ?? mainContent;
    }
    return mainContent;
  })();

  const widthStyle: React.CSSProperties = { display: 'inline-block' };
  if (preserveSpace && maxNameWidth !== null) widthStyle.minWidth = maxNameWidth;

  return (
    <span style={{ display: 'inline-block' }}>
      <span
        ref={measureRef}
        aria-hidden="true"
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
      >
        {names?.[0]}
      </span>

      <PositionDisplacementEffect intensity={intensity} duration={glitchDuration} phase={phase}>
        <span
          className={`lotus-glitch ${className}`.trim()}
          style={{
            ...widthStyle,
            position: 'relative',
            filter: isInverted ? 'invert(1)' : 'none',
            transition: isInverted ? 'filter 0.02s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            willChange: 'transform, filter, opacity',
          }}
        >
          <ShakeEffect intensity={intensity} duration={glitchDuration} phase={phase}>
            <span style={{ position: 'relative', zIndex: 10 }}>{mainContent}</span>
          </ShakeEffect>

          <ChromaticAberrationEffect
            intensity={intensity}
            displacement={displacement}
            duration={glitchDuration}
          >
            {chromaContent}
          </ChromaticAberrationEffect>

          <MotionBlurEffect intensity={intensity * 2} />
          <NoiseEffect intensity={intensity} duration={glitchDuration} />
          <ScanlineEffect intensity={intensity} duration={glitchDuration} />
          <FlickerEffect phase={phase} shouldFlicker={flickerRef.current} />
        </span>
      </PositionDisplacementEffect>
    </span>
  );
};

Glitch.displayName = 'Glitch';
