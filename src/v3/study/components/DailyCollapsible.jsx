import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { readUser, writeUser } from '../utils/dailyStudy.js';
export default function DailyCollapsible({
  userId,
  name,
  title,
  description,
  children,
  defaultOpen = false,
  onError
}) {
  const [open, setOpen] = useState(() => readUser(userId, `section_${name}`, defaultOpen));
  return <section className="glass-panel daily-card" data-section={name}>
    <h2><button className="w-full text-left flex items-center justify-between gap-3 min-h-12" aria-expanded={open} aria-controls={`section-${name}`} onClick={() => {
        const value = !open;
        setOpen(value);
        try {
          writeUser(userId, `section_${name}`, value);
        } catch {
          onError?.('Section preference could not be saved.', 'error');
        }
      }}><span><span className="daily-title block">{title}</span><span className="daily-muted block mt-1">{description}</span></span><ChevronDown className={`shrink-0 ${open ? 'rotate-180' : ''}`} size={18} /></button></h2>
    <div id={`section-${name}`} hidden={!open} className="mt-5">{typeof children === 'function' ? children(open) : children}</div>
  </section>;
}
