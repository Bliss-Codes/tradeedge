"use client";

import { SESSIONS, Session } from "@/lib/types";

interface RadarPoint {
  session: Session;
  value: number; // raw metric value
  label: string; // formatted for display
  total: number; // trade count (to floor empty sessions)
}

/**
 * Four-axis radar ("diamond") plotting all sessions for one metric.
 * Axes (clockwise from top): London, New York, Asia, Overlap — fixed order
 * so every chart is read the same way.
 */
export function SessionRadar({ title, points }: { title: string; points: RadarPoint[] }) {
  const W = 264;
  const H = 208;
  const cx = W / 2;
  const cy = H / 2 + 2;
  const R = 58;

  // angles for the 4 axes (top, right, bottom, left)
  const angles: Record<Session, number> = {
    London: -Math.PI / 2,
    "New York": 0,
    Asia: Math.PI / 2,
    Overlap: Math.PI,
  };

  // normalize by max absolute value across sessions; negatives sit near center, flagged.
  const maxAbs = Math.max(...points.map((p) => Math.abs(p.value)), 0);
  const fracOf = (p: RadarPoint) => {
    if (p.total === 0) return 0;
    if (maxAbs === 0) return 0.12;
    if (p.value < 0) return 0.14; // losing session — pulled toward center, shown red
    return Math.max(0.12, Math.abs(p.value) / maxAbs);
  };

  const ordered = SESSIONS.map((s) => points.find((p) => p.session === s)!).filter(Boolean);
  const ptAt = (session: Session, frac: number): [number, number] => {
    const a = angles[session];
    return [cx + R * frac * Math.cos(a), cy + R * frac * Math.sin(a)];
  };

  const rings = [0.25, 0.5, 0.75, 1];
  const dataPath =
    ordered
      .map((p, i) => {
        const [x, y] = ptAt(p.session, fracOf(p));
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ") + " Z";

  const hasData = points.some((p) => p.total > 0);

  return (
    <div className="rounded-2xl border border-edge bg-card p-4 shadow-[var(--card-shadow)]">
      <div className="mb-1 text-sm font-semibold text-ink">{title}</div>
      {!hasData ? (
        <div className="flex h-[180px] items-center justify-center text-xs text-mute">No trades yet</div>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          {/* concentric diamonds */}
          {rings.map((r) => (
            <polygon
              key={r}
              points={SESSIONS.map((s) => ptAt(s, r).join(",")).join(" ")}
              fill="none"
              className="stroke-edge"
              strokeWidth="1"
            />
          ))}
          {/* axes */}
          {SESSIONS.map((s) => {
            const [x, y] = ptAt(s, 1);
            return <line key={s} x1={cx} y1={cy} x2={x} y2={y} className="stroke-edge" strokeWidth="1" />;
          })}
          {/* data polygon */}
          <path d={dataPath} style={{ fill: "rgb(var(--accent))", stroke: "rgb(var(--accent))" }} fillOpacity="0.18" strokeWidth="2" strokeLinejoin="round" />
          {/* dots */}
          {ordered.map((p) => {
            const [x, y] = ptAt(p.session, fracOf(p));
            const neg = p.value < 0;
            return <circle key={p.session} cx={x} cy={y} r="3.5" style={{ fill: neg ? "rgb(var(--neg))" : "rgb(var(--accent))" }} />;
          })}
          {/* axis labels + values */}
          {SESSIONS.map((s) => {
            const p = points.find((x) => x.session === s)!;
            const [lx, ly] = ptAt(s, 1);
            const a = angles[s];
            const ox = lx + Math.cos(a) * 11;
            const oy = ly + Math.sin(a) * 11;
            const anchor = Math.abs(Math.cos(a)) < 0.3 ? "middle" : Math.cos(a) > 0 ? "start" : "end";
            return (
              <g key={s}>
                <text x={ox} y={oy - 4} textAnchor={anchor} className="fill-mute" style={{ fontSize: 9 }}>
                  {s}
                </text>
                <text x={ox} y={oy + 6} textAnchor={anchor} className={p.value < 0 ? "fill-neg" : "fill-sub"} style={{ fontSize: 9, fontWeight: 600 }}>
                  {p.total > 0 ? p.label : "—"}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

export type { RadarPoint };
