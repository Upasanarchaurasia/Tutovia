import React, { useEffect, useRef } from 'react';
export default function DailyDialog({
  titleId,
  onClose,
  busy = false,
  children
}) {
  const root = useRef(null),
    close = useRef(onClose),
    locked = useRef(busy);
  close.current = onClose;
  locked.current = busy;
  useEffect(() => {
    const previous = document.activeElement,
      panel = root.current;
    const targets = () => [...panel.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex="0"]')].filter(node => node.getClientRects().length);
    (targets()[0] || panel).focus();
    const keydown = event => {
      if (event.key === 'Escape' && !locked.current) {
        event.preventDefault();
        close.current();
      }
      if (event.key === 'Tab') {
        const options = targets();
        if (!options.length) {
          event.preventDefault();
          panel.focus();
          return;
        }
        if (event.shiftKey && (document.activeElement === options[0] || document.activeElement === panel)) {
          event.preventDefault();
          options.at(-1).focus();
        } else if (!event.shiftKey && document.activeElement === options.at(-1)) {
          event.preventDefault();
          options[0].focus();
        }
      }
    };
    panel.addEventListener('keydown', keydown);
    return () => {
      panel.removeEventListener('keydown', keydown);
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  return <div className="daily-modal"><div ref={root} tabIndex={-1} className="daily-modal-card" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-busy={busy}>{children}</div></div>;
}
