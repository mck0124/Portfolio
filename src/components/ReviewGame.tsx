"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { unlock } from "@/components/Fx";

type Pt = { x: number; y: number };
type Course = { pts: Pt[]; len: number };
type Kind = "shortcut" | "speed" | "gap";
type Round = { kind: Kind; cheater: number; decoy: number; speed: number[]; phase: number[] };
type Status = "idle" | "running" | "won";

const COURSE = "M40,300 C140,300 180,250 250,250 C330,250 330,60 420,60 C510,60 500,250 580,250 C650,250 690,150 760,120";
const COLORS = ["#a3e635", "#38bdf8", "#f472b6", "#fb923c", "#c084fc", "#2dd4bf"];
const BIBS = [101, 102, 103, 104, 105, 106];
const SAFETY = [0.12, 0.5, 0.9];
const CUT_FROM = 0.25;
const CUT_TO = 0.75;
const RIDE_FROM = 0.3;
const RIDE_TO = 0.62;
const RIDE_BOOST = 3.5;
const GAP_FROM = 0.28;
const GAP_TO = 0.7;
const RACE_SECONDS = 24;
const SAMPLES = 400;

const LEVELS: { kind: Kind; name: string; brief: string; decoy: string; solved: string; cheaterSpeed: number }[] = [
  {
    kind: "shortcut",
    name: "Shortcut",
    brief: "Six runners. One takes a shortcut. One just has bad GPS.",
    decoy: "has noisy GPS but stayed on the course. Bad data is not misconduct.",
    solved: "cut across the climb and missed safety point 2.",
    cheaterSpeed: 0.74,
  },
  {
    kind: "speed",
    name: "Free ride",
    brief: "Everyone stays on the course this time. One of them is not running.",
    decoy: "has noisy GPS, but the pace is human.",
    solved: `covered the climb at ${RIDE_BOOST} times their own pace. Nobody runs uphill like that.`,
    cheaterSpeed: 0.64,
  },
  {
    kind: "gap",
    name: "Signal lost",
    brief: "Two runners lose GPS on the climb. Only one of them has a problem.",
    decoy: "lost signal but came back after a believable time. A gap alone is not evidence.",
    solved: "lost signal, missed safety point 2 and reappeared sooner than anyone could run it.",
    cheaterSpeed: 0.8,
  },
];

function courseAt({ pts, len }: Course, d: number): Pt {
  const f = (Math.min(Math.max(d, 0), len) / len) * SAMPLES;
  const i = Math.min(Math.floor(f), SAMPLES - 1);
  const k = f - i;
  return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * k, y: pts[i].y + (pts[i + 1].y - pts[i].y) * k };
}

function cut(course: Course) {
  const a = courseAt(course, course.len * CUT_FROM);
  const b = courseAt(course, course.len * CUT_TO);
  return { a, b, chord: Math.hypot(b.x - a.x, b.y - a.y) };
}

// True position, progress 0..1 and whether GPS is lost, for runner i at race time t.
function locate(course: Course, round: Round, i: number, t: number): { p: Pt; progress: number; hidden: boolean } {
  const { len } = course;
  const d = (len / RACE_SECONDS) * round.speed[i] * t;
  const on = (dist: number, hidden = false) => ({ p: courseAt(course, dist), progress: Math.min(dist / len, 1), hidden });

  if (i === round.decoy && round.kind === "gap") return on(d, d > len * GAP_FROM && d < len * GAP_TO);
  if (i !== round.cheater) return on(d);

  if (round.kind === "speed") {
    const a = len * RIDE_FROM;
    const b = len * RIDE_TO;
    if (d < a) return on(d);
    const ride = a + (d - a) * RIDE_BOOST;
    return ride < b ? on(ride) : on(b + (ride - b) / RIDE_BOOST);
  }

  // Shortcut and gap both leave the course along the chord. In the gap level the GPS is off and the pace is a vehicle's.
  const { a, b, chord } = cut(course);
  const d1 = len * CUT_FROM;
  const boost = round.kind === "gap" ? 2.5 : 1;
  if (d < d1) return on(d);
  const off = (d - d1) * boost;
  if (off < chord) {
    const k = off / chord;
    return { p: { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k }, progress: CUT_FROM + (CUT_TO - CUT_FROM) * k, hidden: round.kind === "gap" };
  }
  return on(len * CUT_TO + (off - chord) / boost);
}

function gps(course: Course, round: Round, i: number, t: number): Pt {
  const { p } = locate(course, round, i, t);
  const ph = round.phase[i];
  const noisy = i === round.decoy && round.kind !== "gap";
  let x = p.x + (noisy ? 5 : 1.4) * Math.sin(t * 2.3 + ph);
  let y = p.y + (noisy ? 5 : 1.4) * Math.cos(t * 1.7 + ph * 2);
  if (noisy) {
    const beat = Math.floor(t * 1.4 + ph);
    if (beat % 4 === 0) {
      x += 15 * Math.sin(beat * 7.1);
      y += 15 * Math.cos(beat * 3.3);
    }
  }
  return { x, y };
}

// What a reviewer can see: the recorded trace, straight jumps across GPS gaps, and the last known fix.
function trace(course: Course, round: Round, i: number, t: number) {
  const segments: string[][] = [[]];
  const gaps: [Pt, Pt][] = [];
  let last = gps(course, round, i, 0);
  let progress = 0;
  let lost = false;
  for (let s = 0; ; s = Math.min(s + 0.2, t)) {
    const here = locate(course, round, i, s);
    if (here.hidden) {
      lost = true;
    } else {
      const q = gps(course, round, i, s);
      if (lost) {
        gaps.push([last, q]);
        segments.push([]);
        lost = false;
      }
      segments[segments.length - 1].push(`${q.x.toFixed(1)},${q.y.toFixed(1)}`);
      last = q;
      progress = here.progress;
    }
    if (s >= t) break;
  }
  return { segments, gaps, marker: last, progress, lost };
}

export default function ReviewGame() {
  const pathRef = useRef<SVGPathElement>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [round, setRound] = useState<Round | null>(null);
  const [level, setLevel] = useState(0);
  const [done, setDone] = useState<number[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [t, setT] = useState(0);
  const [rate, setRate] = useState(1);
  const [cleared, setCleared] = useState<number[]>([]);
  const [message, setMessage] = useState("");

  const config = LEVELS[level];

  const start = (index: number) => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    const pts = Array.from({ length: SAMPLES + 1 }, (_, i) => {
      const { x, y } = path.getPointAtLength((len * i) / SAMPLES);
      return { x, y };
    });
    const cheater = Math.floor(Math.random() * BIBS.length);
    const decoy = (cheater + 1 + Math.floor(Math.random() * (BIBS.length - 1))) % BIBS.length;
    setCourse({ pts, len });
    setRound({
      kind: LEVELS[index].kind,
      cheater,
      decoy,
      speed: BIBS.map((_, i) => (i === cheater ? LEVELS[index].cheaterSpeed : 0.88 + Math.random() * 0.2)),
      phase: BIBS.map(() => Math.random() * 6.28),
    });
    setLevel(index);
    setT(0);
    setCleared([]);
    setMessage("");
    setStatus("running");
  };

  const pick = (index: number) => {
    setLevel(index);
    setRound(null);
    setStatus("idle");
  };

  useEffect(() => {
    if (status === "idle") return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      setT((prev) => Math.min(prev + dt * rate, RACE_SECONDS * 1.4));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [status, rate]);

  const flag = (i: number) => {
    if (status !== "running" || !round || cleared.includes(i)) return;
    if (i === round.cheater) {
      const nowDone = [...new Set([...done, level])];
      setDone(nowDone);
      setStatus("won");
      unlock("reviewer");
      if (cleared.length === 0) unlock("sharp");
      if (nowDone.length === LEVELS.length) unlock("chief");
      return;
    }
    setCleared((prev) => [...prev, i]);
    setMessage(i === round.decoy ? `Bib ${BIBS[i]} ${config.decoy} Look again.` : `Bib ${BIBS[i]} ran a clean race. Look again.`);
  };

  const live = course && round;
  const traces = live ? BIBS.map((_, i) => trace(course, round, i, t)) : null;
  const over = live ? BIBS.every((_, i) => locate(course, round, i, t).progress >= 1) : false;
  const won = status === "won" && live;
  const shortcut = won && round.kind !== "speed" ? cut(course) : null;
  const ride =
    won && round.kind === "speed"
      ? course.pts
          .slice(SAMPLES * RIDE_FROM, SAMPLES * RIDE_TO)
          .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
          .join(" ")
      : null;

  return (
    <div className="game">
      <div className="game-map">
        <svg viewBox="0 0 800 360" role="img" aria-label="Race course with six runners">
          <path ref={pathRef} className="game-course" d={COURSE} />
          {ride ? <polyline className="evidence solid" points={ride} /> : null}
          {course
            ? SAFETY.map((s, n) => {
                const p = courseAt(course, course.len * s);
                const missed = !!shortcut && n === 1;
                return (
                  <g key={s} className={missed ? "sp missed" : "sp"}>
                    <rect x={p.x - 7} y={p.y - 7} width="14" height="14" />
                    <text x={p.x + 12} y={p.y - 10}>
                      SP{n + 1}
                      {missed ? " missed" : ""}
                    </text>
                  </g>
                );
              })
            : null}

          {live && traces
            ? BIBS.map((bib, i) => {
                const { segments, gaps, marker, lost } = traces[i];
                const dim = cleared.includes(i) || (status === "won" && i !== round.cheater);
                return (
                  <g key={bib} className={`runner-g${dim ? " dim" : ""}${lost ? " lost" : ""}`} onClick={() => flag(i)}>
                    {segments.map((points, n) => (
                      <polyline key={n} points={points.join(" ")} stroke={COLORS[i]} />
                    ))}
                    {gaps.map(([a, b], n) => (
                      <line key={n} className="gap-line" x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={COLORS[i]} />
                    ))}
                    <circle cx={marker.x} cy={marker.y} r="16" fill="transparent" />
                    <circle className="marker" cx={marker.x} cy={marker.y} r="6" fill={COLORS[i]} stroke={COLORS[i]} />
                    <text x={marker.x + 10} y={marker.y + 4}>
                      {bib}
                      {lost ? " no signal" : ""}
                    </text>
                  </g>
                );
              })
            : null}

          {shortcut ? <line className="evidence" x1={shortcut.a.x} y1={shortcut.a.y} x2={shortcut.b.x} y2={shortcut.b.y} /> : null}
        </svg>

        {status === "idle" ? (
          <div className="game-overlay">
            <p className="win-title">
              Level {level + 1}: {config.name}
            </p>
            <p>{config.brief}</p>
            <button type="button" className="btn btn-primary" onClick={() => start(level)}>
              ▶ Start race
            </button>
          </div>
        ) : null}

        {won ? (
          <div className="game-overlay win">
            <p className="win-title">Level {level + 1} cleared</p>
            <p>
              Bib {BIBS[round.cheater]} {config.solved} You found it with {cleared.length + 1} {cleared.length === 0 ? "flag" : "flags"}. FairPlay runs checks
              like this on every finished activity and shows the reviewer the evidence.
            </p>
            <div className="actions">
              {level + 1 < LEVELS.length ? (
                <button type="button" className="btn btn-primary" onClick={() => pick(level + 1)}>
                  Next level →
                </button>
              ) : (
                <Link className="btn btn-primary" href="/work/fairplay">
                  Open the FairPlay quest →
                </Link>
              )}
              <button type="button" className="btn" onClick={() => start(level)}>
                Play again
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="game-side">
        <div className="game-levels">
          {LEVELS.map((l, i) => (
            <button
              type="button"
              key={l.kind}
              className={i === level ? "on" : ""}
              disabled={i > 0 && !done.includes(i - 1)}
              onClick={() => pick(i)}
              title={l.name}
            >
              {done.includes(i) ? "★" : i > 0 && !done.includes(i - 1) ? "🔒" : "▶"} L{i + 1}
            </button>
          ))}
        </div>
        <p className="game-status" aria-live="polite">
          {status === "idle"
            ? `Level ${level + 1}: ${config.name}. Waiting for start.`
            : status === "won"
              ? "Evidence highlighted on the map."
              : message || (over ? "Race over. Review the traces and flag one." : "Watch the traces. Click a runner to flag.")}
        </p>
        <ul className="roster">
          {BIBS.map((bib, i) => (
            <li key={bib}>
              <button type="button" disabled={status !== "running" || cleared.includes(i)} onClick={() => flag(i)}>
                <i style={{ background: COLORS[i] }} />
                <span>Bib {bib}</span>
                <span className="bar">
                  <b style={{ width: `${(traces?.[i].progress ?? 0) * 100}%`, background: COLORS[i] }} />
                </span>
                <span className="flag">{cleared.includes(i) ? "clear" : "flag"}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="game-controls">
          <span>Playback</span>
          {[1, 2, 4].map((r) => (
            <button type="button" key={r} className={rate === r ? "on" : ""} onClick={() => setRate(r)}>
              {r}×
            </button>
          ))}
          <button type="button" onClick={() => start(level)} disabled={status === "idle"}>
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}
