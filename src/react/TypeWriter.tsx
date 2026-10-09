'use client';

import * as React from 'react';
import type { TypeWriterProps } from '../core/types';
import { deleteLastWord } from '../core/utils';

/**
 * Cycling typewriter heading. Types out each heading in turn, then deletes it
 * word-by-word (mimicking Ctrl+Backspace) before moving to the next.
 *
 * The word-deletion logic lives in core (`deleteLastWord`) so the React and Vue
 * bindings share it; styling lives in `.lotus-typewriter*` (core components.css).
 */
export function TypeWriter({
  headings,
  speed = 240,
  delayBetweenHeadings = 4000,
  className = '',
}: TypeWriterProps) {
  const [currentHeadingIndex, setCurrentHeadingIndex] = React.useState(0);
  const [currentText, setCurrentText] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    const currentFullText = headings[currentHeadingIndex] ?? '';
    let timer: ReturnType<typeof setTimeout>;

    // Milliseconds per character (1 word == 5 chars).
    const charDelayMs = speed > 0 ? 12000 / speed : 60;
    // Word deletion delay (simulates Ctrl+Backspace).
    const wordDeleteDelayMs = 150;

    if (!isDeleting && currentText === currentFullText) {
      timer = setTimeout(() => setIsDeleting(true), delayBetweenHeadings);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentHeadingIndex((prev) => (prev + 1) % headings.length);
    } else {
      const delay = isDeleting ? wordDeleteDelayMs : charDelayMs;
      timer = setTimeout(() => {
        if (isDeleting) {
          setCurrentText(deleteLastWord(currentText));
        } else {
          setCurrentText(currentFullText.substring(0, currentText.length + 1));
        }
      }, delay);
    }

    return () => clearTimeout(timer);
  }, [
    currentText,
    isDeleting,
    currentHeadingIndex,
    headings,
    speed,
    delayBetweenHeadings,
  ]);

  const currentFullText = headings[currentHeadingIndex] ?? '';
  const remainingText = !isDeleting
    ? currentFullText.substring(currentText.length)
    : '';
  const isIdle = !isDeleting && currentText === currentFullText;

  return (
    <span className={`lotus-typewriter ${className}`.trim()}>
      <span>{currentText}</span>
      <span
        className={`lotus-typewriter-caret ${isIdle ? 'is-idle' : ''}`}
        aria-hidden="true"
      />
      {remainingText && (
        <span className="lotus-typewriter-rest">{remainingText}</span>
      )}
    </span>
  );
}

export default TypeWriter;
