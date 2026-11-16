"use client";

import { useEffect, useRef, useState } from "react";

const RUNNERS = [
  { bib: 11, pace: 0.03, color: "#a3e635" },
  { bib: 24, pace: 0.027, color: "#38bdf8" },
  { bib: 37, pace: 0.0245, color: "#f472b6" },
  { bib: 42, pace: 0.022, color: "#fb923c" },
  { bib: 58, pace: 0.0195, color: "#c084fc" },
];
const PERIOD = 54;
const PING = 1;
const LATE = 2.7;

const point = (u: number) => ({ x: 50 + 700 * u, y: 150 - 75 * Math.sin(u * Math.PI * 3) * (0.45 + 0.55 * u) + 30 * u });
const coursePoints = Array.from({ length: 101 }, (_, i) => point(i / 100))
  .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
  .join(" ");

// Ping k of runner i: when it was recorded and when it reaches the browser. Every few pings one arrives late.
function ping(i: number, k: number) {
  const send = k * PING + i * 0.17;
  const late = k > 0 && (i * 7 + k * 13) % 6 === 0;
  return { send, arrival: send + (late ? LATE : 0.12 + i * 0.03), late };
}

// The ping the map currently trusts. With the guard, the newest recording wins. Without it, the last arrival wins.
function chosen(i: number, t: number, guard: boolean) {
  let best: ReturnType<typeof ping> | null = null;
  for (let k = Math.max(0, Math.floor(t / PING) - 5); k * PING <= t; k++) {
    const p = ping(i, k);
    if (p.arrival > t) continue;
    if (!best || (guard ? p.send > best.send : p.arrival > best.arrival)) best = p;
  }
  return best;
}

function shown(i: number, t: number, guard: boolean, smooth: boolean) {
  const at = (p: ReturnType<typeof ping> | null) => (p ? Math.min(1, RUNNERS[i].pace * p.send) : 0);
  const current = chosen(i, t, guard);
  if (!current || !smooth) return at(current);
  const previous = at(chosen(i, current.arrival - 0.001, guard));
  return previous + (at(current) - previous) * Math.min(1, (t - current.arrival) / PING);
}

export default function LiveDemo() {
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(true);
  const [guard, setGuard] = useState(true);
  const [smooth, setSmooth] = useState(true);
  const userStarted = useRef(false);

  useEffect(() => {
    if (!running) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches && !userStarted.current) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      setT((prev) => (prev + dt) % PERIOD);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  let stale = 0;
  const rows = RUNNERS.map((r, i) => {
    let justStale = false;
    for (let k = 1; k * PING <= t; k++) {
      const p = ping(i, k);
      if (!p.late || p.arrival > t) continue;
      stale++;
      if (t - p.arrival < 0.9) justStale = true;
    }
    return { ...r, progress: shown(i, t, guard, smooth), truth: Math.min(1, r.pace * t), justStale };
  });
  const ranking = [...rows].sort((a, b) => b.progress - a.progress);

  return (
    <div className="game live-demo">
      <div className="game-map">
        <svg viewBox="0 0 800 300" role="img" aria-label="Five runners on a live map">
          <polyline className="game-course" points={coursePoints} />
          {rows.map((r) => {
            const truth = point(r.truth);
            const p = point(r.progress);
            return (
              <g key={r.bib} className="runner-g">
                <circle className="ghost" cx={truth.x} cy={truth.y} r="9" stroke={r.color} />
                {r.justStale && !guard ? <circle className="stale-ring" cx={p.x} cy={p.y} r="15" /> : null}
                <circle cx={p.x} cy={p.y} r="6" fill={r.color} />
                <text x={p.x + 10} y={p.y - 10} className={r.justStale ? (guard ? "note" : "note warn") : ""}>
                  {r.bib}
                  {r.justStale ? (guard ? " old ping dropped" : " old ping applied") : ""}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="demo-legend">
          <span>
            <i className="key-dot" /> position on the map
          </span>
          <span>
            <i className="key-dot hollow" /> where the runner really is
          </span>
        </p>
      </div>

      <div className="game-side">
        <p className="game-status" aria-live="off">
          Estimated ranking · not official timing
          <br />
          <span className={guard ? "" : "warn"}>
            {stale} old {stale === 1 ? "ping" : "pings"} {guard ? "dropped" : "applied"}
          </span>
        </p>
        <ol className="roster ranking">
          {ranking.map((r, n) => (
            <li key={r.bib}>
              <span>{n + 1}</span>
              <i style={{ background: r.color }} />
              <span>Bib {r.bib}</span>
              <span className="pct">{Math.round(r.progress * 100)}%</span>
            </li>
          ))}
        </ol>
        <div className="demo-switches">
          <button type="button" role="switch" aria-checked={guard} onClick={() => setGuard((g) => !g)}>
            <span>Ignore old pings</span>
            <b>{guard ? "ON" : "OFF"}</b>
          </button>
          <button type="button" role="switch" aria-checked={smooth} onClick={() => setSmooth((s) => !s)}>
            <span>Interpolate motion</span>
            <b>{smooth ? "ON" : "OFF"}</b>
          </button>
          <button
            type="button"
            onClick={() => {
              userStarted.current = true;
              setRunning((r) => !r);
            }}
          >
            <span>{running ? "Pause" : "Play"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
