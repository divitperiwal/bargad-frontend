'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CalendarIcon } from '../icons';
import { Label, Message } from './field';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const pad = (n: number) => String(n).padStart(2, '0');
const toIso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const daysIn = (y: number, m: number) => new Date(y, m + 1, 0).getDate();

function parseIso(s: string) {
  const hit = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  return hit ? { y: +hit[1], m: +hit[2] - 1, d: +hit[3] } : null;
}

function display(digits: string) {
  const d = digits.slice(0, 2);
  const m = digits.slice(2, 4);
  const y = digits.slice(4, 8);
  return [d, m, y].filter(Boolean).join('/');
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d={dir === 'left' ? 'M10 3.5 5.5 8 10 12.5' : 'M6 3.5 10.5 8 6 12.5'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const nav =
  'grid h-9 w-9 place-items-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent';
const headBtn =
  'h-9 rounded-full px-3 text-sm font-medium text-ink transition-colors hover:bg-surface-2';
const cell =
  'grid h-9 w-full place-items-center rounded-full text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-30';

type View = 'days' | 'months' | 'years';

/**
 * A date of birth you can type (DD/MM/YYYY) or pick from a calendar drawn in
 * the app's own style. Reports an ISO date once it is complete and real,
 * otherwise an empty string.
 */
export function DateField({
  id,
  value,
  onChange,
  error,
  inputClass,
}: {
  id: string;
  value: string;
  onChange: (iso: string) => void;
  error?: string;
  inputClass: string;
}) {
  const parsed = parseIso(value);
  const [digits, setDigits] = useState(() =>
    parsed ? `${pad(parsed.d)}${pad(parsed.m + 1)}${parsed.y}` : '',
  );
  const [localError, setLocalError] = useState<string | undefined>();
  const [open, setOpen] = useState(false);
  const [up, setUp] = useState(false);
  const [view, setView] = useState<View>('days');
  const [cursor, setCursor] = useState({ y: 0, m: 0 });
  const [yearPage, setYearPage] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  // The current date is read in handlers only (Next forbids reading the clock
  // while rendering); the calendar is closed until a handler has set it.
  const [now, setNow] = useState({ y: 9999, m: 11, d: 31 });
  const { y: ty, m: tm, d: td } = now;

  function readToday() {
    const t = new Date();
    return { y: t.getFullYear(), m: t.getMonth(), d: t.getDate() };
  }

  function commit(next: string) {
    setDigits(next);
    if (next.length < 8) {
      setLocalError(undefined);
      onChange('');
      return;
    }
    const d = +next.slice(0, 2);
    const m = +next.slice(2, 4) - 1;
    const y = +next.slice(4, 8);
    const t = readToday();
    const real = m >= 0 && m < 12 && d >= 1 && d <= daysIn(y, m) && y >= 1900;
    const future = y > t.y || (y === t.y && (m > t.m || (m === t.m && d > t.d)));
    if (!real || future) {
      setLocalError(future ? "That date hasn't happened yet." : "That date doesn't exist.");
      onChange('');
      return;
    }
    setLocalError(undefined);
    onChange(toIso(y, m, d));
  }

  function onType(e: React.ChangeEvent<HTMLInputElement>) {
    let next = e.target.value.replace(/\D/g, '').slice(0, 8);
    // Deleting a slash leaves the digits unchanged; treat it as deleting a digit.
    if (e.target.value.length < display(digits).length && next === digits) {
      next = digits.slice(0, -1);
    }
    commit(next);
  }

  function openCalendar() {
    const t = readToday();
    setNow(t);
    const base = parsed ?? { y: t.y - 30, m: 0, d: 1 };
    setCursor({ y: base.y, m: base.m });
    setYearPage(Math.floor(base.y / 12) * 12);
    setView('days');
    setOpen(true);
  }

  function pickDay(d: number) {
    commit(`${pad(d)}${pad(cursor.m + 1)}${cursor.y}`);
    setOpen(false);
    input.current?.focus();
  }

  useLayoutEffect(() => {
    if (!open || !root.current) return;
    const rect = root.current.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom;
    setUp(below < 380 && rect.top > below);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        input.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const selected = parsed;
  const shown = localError ?? error;
  const atCurrentMonth = cursor.y > ty || (cursor.y === ty && cursor.m >= tm);

  function stepMonth(by: number) {
    const idx = cursor.y * 12 + cursor.m + by;
    setCursor({ y: Math.floor(idx / 12), m: ((idx % 12) + 12) % 12 });
  }

  const lead = (new Date(cursor.y, cursor.m, 1).getDay() + 6) % 7;
  const total = daysIn(cursor.y, cursor.m);

  return (
    <div data-anim="rise" className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor={id}>Date of birth</Label>

      <div ref={root} className="relative">
        <input
          ref={input}
          id={id}
          name="dob"
          inputMode="numeric"
          autoComplete="bday"
          value={display(digits)}
          onChange={onType}
          placeholder="DD/MM/YYYY"
          aria-invalid={shown ? true : undefined}
          aria-describedby={shown ? `${id}-error` : undefined}
          className={`${inputClass} pr-12`}
        />
        <button
          type="button"
          onClick={() => (open ? setOpen(false) : openCalendar())}
          aria-label="Open calendar"
          aria-expanded={open}
          aria-haspopup="dialog"
          className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-ink-3 transition-colors duration-200 hover:bg-surface-2 hover:text-ink"
        >
          <CalendarIcon size={20} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              role="dialog"
              aria-label="Choose your date of birth"
              initial={{ opacity: 0, y: up ? 6 : -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: up ? 4 : -4, scale: 0.98 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: up ? 'bottom left' : 'top left' }}
              className={`absolute left-0 z-30 w-[min(100%,340px)] rounded-2xl border border-line bg-surface p-3 text-ink shadow-lg ${
                up ? 'bottom-full mb-2' : 'top-full mt-2'
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <button
                  type="button"
                  className={nav}
                  aria-label={
                    view === 'days'
                      ? 'Previous month'
                      : view === 'months'
                        ? 'Previous year'
                        : 'Earlier years'
                  }
                  onClick={() =>
                    view === 'days'
                      ? stepMonth(-1)
                      : view === 'months'
                        ? setCursor((c) => ({ ...c, y: c.y - 1 }))
                        : setYearPage((p) => p - 12)
                  }
                >
                  <Chevron dir="left" />
                </button>

                <div className="flex items-center">
                  {view === 'days' && (
                    <button type="button" className={headBtn} onClick={() => setView('months')}>
                      {MONTHS[cursor.m]}
                    </button>
                  )}
                  {view !== 'years' ? (
                    <button
                      type="button"
                      className={headBtn}
                      onClick={() => {
                        setYearPage(Math.floor(cursor.y / 12) * 12);
                        setView('years');
                      }}
                    >
                      {cursor.y}
                    </button>
                  ) : (
                    <span className="px-3 text-sm font-medium">
                      {yearPage} – {yearPage + 11}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  className={nav}
                  aria-label={
                    view === 'days' ? 'Next month' : view === 'months' ? 'Next year' : 'Later years'
                  }
                  disabled={
                    view === 'days'
                      ? atCurrentMonth
                      : view === 'months'
                        ? cursor.y >= ty
                        : yearPage + 12 > ty
                  }
                  onClick={() =>
                    view === 'days'
                      ? stepMonth(1)
                      : view === 'months'
                        ? setCursor((c) => ({ ...c, y: c.y + 1 }))
                        : setYearPage((p) => p + 12)
                  }
                >
                  <Chevron dir="right" />
                </button>
              </div>

              {view === 'days' && (
                <div role="grid" aria-label={`${MONTHS[cursor.m]} ${cursor.y}`}>
                  <div className="mb-1 grid grid-cols-7 text-center text-xs text-ink-3">
                    {WEEKDAYS.map((w) => (
                      <span key={w} className="py-1">
                        {w}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-y-0.5">
                    {Array.from({ length: lead }, (_, i) => (
                      <span key={`b${i}`} />
                    ))}
                    {Array.from({ length: total }, (_, i) => {
                      const d = i + 1;
                      const future =
                        cursor.y > ty ||
                        (cursor.y === ty && (cursor.m > tm || (cursor.m === tm && d > td)));
                      const isSel =
                        !!selected &&
                        selected.y === cursor.y &&
                        selected.m === cursor.m &&
                        selected.d === d;
                      const isToday = cursor.y === ty && cursor.m === tm && d === td;
                      return (
                        <button
                          key={d}
                          type="button"
                          disabled={future}
                          aria-pressed={isSel}
                          aria-label={`${d} ${MONTHS[cursor.m]} ${cursor.y}`}
                          onClick={() => pickDay(d)}
                          className={`${cell} ${
                            isSel
                              ? 'bg-brand font-medium text-brand-ink'
                              : isToday
                                ? 'border border-line hover:bg-surface-2'
                                : 'hover:bg-surface-2'
                          }`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {view === 'months' && (
                <div className="grid grid-cols-3 gap-1">
                  {MONTHS.map((name, i) => {
                    const future = cursor.y > ty || (cursor.y === ty && i > tm);
                    const isSel = !!selected && selected.y === cursor.y && selected.m === i;
                    return (
                      <button
                        key={name}
                        type="button"
                        disabled={future}
                        onClick={() => {
                          setCursor((c) => ({ ...c, m: i }));
                          setView('days');
                        }}
                        className={`${cell} h-11 rounded-xl ${
                          isSel ? 'bg-brand font-medium text-brand-ink' : 'hover:bg-surface-2'
                        }`}
                      >
                        {name.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              )}

              {view === 'years' && (
                <div className="grid grid-cols-3 gap-1">
                  {Array.from({ length: 12 }, (_, i) => yearPage + i).map((y) => {
                    const isSel = !!selected && selected.y === y;
                    return (
                      <button
                        key={y}
                        type="button"
                        disabled={y > ty || y < 1900}
                        onClick={() => {
                          setCursor((c) => ({ ...c, y }));
                          setView('months');
                        }}
                        className={`${cell} h-11 rounded-xl ${
                          isSel ? 'bg-brand font-medium text-brand-ink' : 'hover:bg-surface-2'
                        }`}
                      >
                        {y}
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Message id={id} error={shown} />
    </div>
  );
}
