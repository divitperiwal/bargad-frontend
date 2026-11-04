/**
 * A faint field of hanging aerial roots for the canopy panel: thin strands
 * dropping from the top edge, swaying a little, some splitting in two, the
 * way a banyan's roots come down to become new trunks. Generated from a fixed
 * seed so it renders the same on the server and in the browser.
 */

const W = 640;
const H = 1000;

function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Strand = { d: string; w: number; o: number };

function strand(rand: () => number, x0: number, y0: number, length: number): string {
  const amp = 2 + rand() * 7;
  const wave = 90 + rand() * 120;
  const phase = rand() * Math.PI * 2;
  let d = `M${x0.toFixed(1)} ${y0.toFixed(1)}`;
  const step = 40;
  for (let y = y0 + step; y <= y0 + length; y += step) {
    const x = x0 + Math.sin(y / wave + phase) * amp + (y - y0) * 0.012;
    const cx = x0 + Math.sin((y - step / 2) / wave + phase) * amp * 1.2 + (y - y0) * 0.012;
    d += ` Q${cx.toFixed(1)} ${(y - step / 2).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

function build(): Strand[] {
  const rand = rng(1850);
  const out: Strand[] = [];
  for (let x = 8; x < W; x += 14 + rand() * 18) {
    const long = rand() < 0.35;
    const length = long ? 620 + rand() * 360 : 180 + rand() * 380;
    const y0 = -20 + rand() * 40;
    out.push({ d: strand(rand, x, y0, length), w: 0.6 + rand() * 0.9, o: 0.5 + rand() * 0.5 });
    if (rand() < 0.3) {
      const at = y0 + length * (0.3 + rand() * 0.3);
      out.push({
        d: strand(rand, x + 2, at, length * (0.25 + rand() * 0.35)),
        w: 0.5,
        o: 0.45,
      });
    }
  }
  return out;
}

const strands = build();

export function RootsPattern({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMin slice"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
    >
      <defs>
        <linearGradient id="roots-fade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.75" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="roots-mask">
          <rect width={W} height={H} fill="url(#roots-fade)" />
        </mask>
      </defs>
      <g mask="url(#roots-mask)">
        {strands.map((s) => (
          <path key={s.d} d={s.d} strokeWidth={s.w} strokeOpacity={s.o} />
        ))}
      </g>
    </svg>
  );
}
