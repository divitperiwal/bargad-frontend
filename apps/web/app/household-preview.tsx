/**
 * Two still cards for the sign-in frame, previewing what a family sees once
 * they're in: the household total and a parent approving a trade. The figures
 * are an illustration, not anyone's data; real amounts always come from the
 * API. Shown on wide screens only, so a sample amount is never mistaken for a
 * balance on a phone.
 */
export function HouseholdPreview() {
  return (
    <div
      role="img"
      aria-label="Preview: a household's combined investments, and a parent approving a trade"
      className="flex items-end gap-3"
    >
      <div className="w-[260px] rounded-xl bg-surface/95 p-4 text-ink shadow-[0_20px_40px_-18px_rgb(4_20_26/0.55)]">
        <p className="text-[13px] text-ink-3">Household net worth</p>
        <p className="mt-1.5 font-serif text-[34px] leading-none tracking-[-0.02em] tabular-nums">
          ₹1.84 Cr
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-[13px] text-gain">
          <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
            <path d="M5 1.5 9 7.5H1z" fill="currentColor" />
          </svg>
          ₹2,14,300 this month
        </p>
      </div>
      <div className="w-[280px] rounded-xl bg-surface/95 p-4 text-ink shadow-[0_20px_40px_-18px_rgb(4_20_26/0.55)]">
        <p className="flex items-center gap-2.5 text-sm font-medium">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#e3eef0] text-[12px] font-semibold text-[#17566a]">
            R
          </span>
          Ramesh approved your basket
        </p>
        <p className="mt-2 text-[13px] text-ink-3">3 limit orders, price locked within 1%</p>
      </div>
    </div>
  );
}
