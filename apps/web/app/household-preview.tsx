import { CheckIcon } from './icons';

const members = [
  { initial: 'A', name: 'Asha', tone: 'bg-[#efe3f1] text-[#4a2852]' },
  { initial: 'R', name: 'Ramesh', tone: 'bg-[#e4e9f6] text-[#25365f]' },
  { initial: 'S', name: 'Sunita', tone: 'bg-[#f6ebdf] text-[#5d3a17]' },
  { initial: 'M', name: 'Meera', tone: 'bg-[#e2f0ea] text-[#1f4a37]' },
];

/**
 * A still preview of the household view for the sign-in panel: what a family
 * sees once they're in. The figures are an illustration, not anyone's data;
 * real amounts always come from the API.
 */
export function HouseholdPreview() {
  return (
    <figure
      aria-label="Preview: a household's combined investments and a trade approved by a parent"
      className="w-[320px] rounded-2xl bg-surface p-5 text-ink shadow-[0_24px_48px_-16px_rgb(20_8_24/0.45),0_2px_6px_rgb(20_8_24/0.12)]"
    >
      <div className="flex items-center justify-between text-[13px] text-ink-3">
        <span>Sharma household</span>
        <span>4 members</span>
      </div>

      <p className="mt-3 font-serif text-[40px] leading-none tracking-[-0.02em] tabular-nums">
        ₹1.84 Cr
      </p>
      <p className="mt-2 text-[13px] text-ink-3">Across 6 broker accounts</p>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex -space-x-2">
          {members.map((m) => (
            <span
              key={m.name}
              title={m.name}
              className={`grid h-8 w-8 place-items-center rounded-full text-[13px] font-medium ring-2 ring-surface ${m.tone}`}
            >
              {m.initial}
            </span>
          ))}
        </div>
        <span className="text-[13px] text-ink-2">Asha, Ramesh, Sunita, Meera</span>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-xl bg-brand-soft p-3">
        <CheckIcon size={20} className="mt-px shrink-0 text-brand" />
        <div className="min-w-0 flex-1">
          <p className="flex items-baseline justify-between gap-2 text-sm font-medium">
            Ramesh approved your basket
            <span className="font-mono text-xs font-normal text-ink-3">10:42</span>
          </p>
          <p className="mt-0.5 text-[13px] leading-snug text-ink-3">
            3 limit orders, price locked within 1%
          </p>
        </div>
      </div>
    </figure>
  );
}
