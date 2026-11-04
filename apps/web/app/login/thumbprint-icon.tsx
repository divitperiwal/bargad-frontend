/**
 * A thumbprint: an oval whorl of nested ridges with a small core, the outer
 * ridges breaking at the sides and base the way a real print does.
 * Drawn for Bargad; strokes follow currentColor.
 */
export function ThumbprintIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={(size * 34) / 28}
      viewBox="0 0 28 34"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* outermost arch, broken low on both sides */}
      <path d="M2.6 20.5C2 11.6 7 2.8 14 2.8s12 8.8 11.4 17.7" />
      {/* second ridge */}
      <path d="M5.6 26.5C4.2 17 8.2 6.6 14 6.6s9.8 10.4 8.4 18.9" />
      {/* third ridge, shifts left as it nears the base */}
      <path d="M8.2 29.6C6.6 20.4 10 10.4 14 10.4s7.4 9.2 6.4 16.4" />
      {/* fourth ridge */}
      <path d="M11.2 31.4c-1.6-6.6-.8-16.6 2.8-16.6s4.2 7.4 3.2 13.4" />
      {/* core */}
      <path d="M13.8 32c-1.4-5.2-1.6-11 .2-11s1.2 5.2.6 8.6" />
      {/* loose ridges at the lower sides */}
      <path d="M1.8 25.8c.4 2.8 1.4 5 3 6.6" />
      <path d="M26.2 25.8c-.4 2.8-1.4 5-3 6.6" />
    </svg>
  );
}
