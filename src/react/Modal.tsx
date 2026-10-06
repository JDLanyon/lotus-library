'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  /** When falsy the modal renders nothing. */
  open: boolean;
  /** Called on Escape, backdrop click, or the ✕ button. */
  onClose: () => void;
  /** Close when the backdrop (outside the container) is clicked. Default true. */
  closeOnBackdrop?: boolean;
  /** Close when Escape is pressed. Default true. */
  closeOnEscape?: boolean;
  /** Extra class(es) appended to `.lotus-modal-container`. */
  className?: string;
  /** Rendered in the header's left action zone (e.g. "View on GitHub"). */
  headerActionsLeft?: React.ReactNode;
  /** Rendered in the header's right action zone, before the ✕ button. */
  headerActionsRight?: React.ReactNode;
  /** Optional footer line (`.lotus-modal-signature`); omitted when null. */
  signature?: React.ReactNode;
  /** The scrollable body. */
  children?: React.ReactNode;
}

/**
 * Pure modal shell — no fetching, no routing. Controlled via `open`/`onClose`.
 * Renders into a portal on document.body and locks background scroll while open.
 *
 * Mirrors the Vue `Modal.vue` API exactly (same props/slots + class names).
 */
export function Modal({
  open,
  onClose,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = '',
  headerActionsLeft,
  headerActionsRight,
  signature,
  children,
}: ModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!open || !closeOnEscape) return;
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }, [open, closeOnEscape, onClose]);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="lotus-modal-backdrop"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        className={`lotus-modal-container ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="lotus-modal-header">
          <div className="lotus-modal-actions-left">{headerActionsLeft}</div>
          <div className="lotus-modal-actions-right">
            {headerActionsRight}
            <button
              type="button"
              className="lotus-modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              &#10005;
            </button>
          </div>
        </div>

        <div className="lotus-modal-scroll">{children}</div>

        {signature != null ? (
          <div className="lotus-modal-signature">{signature}</div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
