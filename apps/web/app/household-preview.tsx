'use client';

import { animate, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { CheckIcon } from './icons';

/*
 * A still preview of the signed-in household view for the brand panel: the
 * family's total, each member's portfolio, and an approval request on top.
 * Every figure here is an illustration, not anyone's data; in the app all
 * amounts come from the API. Shown on wide screens only, so a sample amount
 * is never mistaken for a balance on a phone.
 */

const TOTAL = 18_420_500;
const rupees = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

const members = [
  {
    initial: 'A',
    name: 'Asha',
    note: 'You',
    value: '₹62,40,100',
    change: '+1.4%',
    tone: 'bg-[#e6efe9] text-[#1d4a37]',
  },
  {
    initial: 'R',
    name: 'Ramesh',
    note: 'Father, approves each trade',
    value: '₹71,85,000',
    change: '+0.9%',
    tone: 'bg-[#e7ebf3] text-[#28395e]',
  },
  {
    initial: 'S',
    name: 'Sunita',
    note: 'Mother, limit ₹50,000 a week',
    value: '₹49,95,400',
    change: '+1.1%',
    tone: 'bg-[#f3ece2] text-[#5b3c1c]',
  },
];

const basket = [
  { name: 'Infosys', qty: 'Buy 10', price: '₹1,512' },
  { name: 'HDFC Bank', qty: 'Buy 8', price: '₹1,689' },
  { name: 'ITC', qty: 'Buy 40', price: '₹462' },
];

function CountUp() {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(Math.round(TOTAL * 0.94));

  useEffect(() => {
    if (reduce) {
      setShown(TOTAL);
      return;
    }
    const controls = animate(TOTAL * 0.94, TOTAL, {
      duration: 1.4,
      delay: 0.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (n) => setShown(Math.round(n)),
    });
    return () => controls.stop();
  }, [reduce]);

  return <>₹{rupees.format(shown)}</>;
}

export function HouseholdPreview() {
  return (
    <figure
      aria-label="Preview of the household view: the family's total, each member's portfolio, and a trade waiting for approval"
      className="relative w-[440px] pt-[150px] text-ink"
    >
      <div
        aria-hidden="true"
        className="rounded-2xl bg-surface p-6 shadow-[0_30px_60px_-24px_rgb(0_0_0/0.55)]"
      >
        <p className="text-[13px] text-ink-3">Sharma household</p>
        <p className="mt-3 font-serif text-[40px] leading-none tracking-[-0.02em] tabular-nums">
          <CountUp />
        </p>
        <p className="mt-2 text-[13px] text-ink-3">
          <span className="text-gain">+₹2,14,300</span> this month, across 6 broker accounts
        </p>

        <ul className="mt-5 divide-y divide-line border-t border-line">
          {members.map((m) => (
            <li key={m.name} className="flex items-center gap-3 py-3">
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[13px] font-semibold ${m.tone}`}
              >
                {m.initial}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{m.name}</span>
                <span className="block truncate text-[12px] text-ink-3">{m.note}</span>
              </span>
              <span className="text-right">
                <span className="block text-sm tabular-nums">{m.value}</span>
                <span className="block text-[12px] text-gain tabular-nums">{m.change}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 right-[-80px] w-[300px] rounded-2xl bg-surface p-4 shadow-[0_24px_48px_-16px_rgb(0_0_0/0.6)]"
      >
        <p className="flex items-center gap-2 text-[12px] font-medium text-ink-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#c98a1b]" />
          Waiting for Ramesh
        </p>
        <p className="mt-1.5 text-sm font-medium">Asha sent a basket for approval</p>
        <ul className="mt-3 space-y-1.5 text-[13px]">
          {basket.map((b) => (
            <li key={b.name} className="flex justify-between gap-3">
              <span>
                {b.qty} {b.name}
              </span>
              <span className="text-ink-3 tabular-nums">limit {b.price}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2">
          <span className="grid h-9 flex-1 place-items-center rounded-xl border border-line-strong text-[13px] font-medium">
            Decline
          </span>
          <span className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand text-[13px] font-medium text-brand-ink">
            <CheckIcon size={15} />
            Approve
          </span>
        </div>
      </motion.div>
    </figure>
  );
}
