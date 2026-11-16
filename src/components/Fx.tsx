"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { caseStudies, profile } from "@/content/portfolio";

export const ACHIEVEMENTS = [
  { id: "reviewer", title: "Reviewer", hint: "Catch a cheater in the tutorial level" },
  { id: "sharp", title: "Sharp eyes", hint: "Catch a cheater with your first flag" },
  { id: "chief", title: "Chief reviewer", hint: "Clear all three review levels" },
  { id: "explorer", title: "Explorer", hint: "Open all five quests" },
  { id: "hacker", title: "Terminal native", hint: "Run five different console commands" },
  { id: "sudo", title: "Recruiter mode", hint: "Find the secret console command" },
] as const;

type Id = (typeof ACHIEVEMENTS)[number]["id"];

const KEY = "mk-achievements";
const VISITED = "mk-visited";
const EMPTY: string[] = [];
const listeners = new Set<() => void>();
let cache: string[] | null = null;

function load(key: string): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function save(key: string, value: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be blocked. Progress then lasts for this page only.
  }
}

export function getUnlocked(): string[] {
  cache ??= load(KEY);
  return cache;
}

export function unlock(id: Id) {
  const current = getUnlocked();
  if (current.includes(id)) return;
  cache = [...current, id];
  save(KEY, cache);
  listeners.forEach((l) => l());
  window.dispatchEvent(new CustomEvent("achievement", { detail: id }));
}

function useUnlocked() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    getUnlocked,
    () => EMPTY,
  );
}

export function Trophies() {
  const unlocked = useUnlocked();
  const [open, setOpen] = useState(false);

  return (
    <div className="trophies">
      <button type="button" className="trophy-button" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span aria-hidden="true">★</span> {unlocked.length}/{ACHIEVEMENTS.length}
        <span className="sr-only"> achievements unlocked</span>
      </button>
      {open ? (
        <div className="trophy-panel">
          <p className="label">Achievements</p>
          <ul>
            {ACHIEVEMENTS.map((a) => (
              <li key={a.id} className={unlocked.includes(a.id) ? "got" : ""}>
                <span aria-hidden="true">{unlocked.includes(a.id) ? "★" : "☆"}</span>
                <span>
                  <b>{a.title}</b>
                  {a.hint}
                </span>
              </li>
            ))}
          </ul>
          {unlocked.length === ACHIEVEMENTS.length ? (
            <button type="button" className="btn" onClick={() => window.dispatchEvent(new Event("credits"))}>
              Roll credits
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// Page-level effects: scroll XP bar, reveal on scroll, stat count-up, achievement toasts, credits.
export default function Fx() {
  const pathname = usePathname();
  const bar = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [credits, setCredits] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    let timer = 0;
    const onUnlock = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      setToast(ACHIEVEMENTS.find((a) => a.id === id)?.title ?? id);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        setToast(null);
        if (getUnlocked().length === ACHIEVEMENTS.length) setCredits(true);
      }, 3500);
    };
    const onCredits = () => setCredits(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCredits(false);
    };
    window.addEventListener("achievement", onUnlock);
    window.addEventListener("credits", onCredits);
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("achievement", onUnlock);
      window.removeEventListener("credits", onCredits);
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const slug = /^\/work\/([^/]+)/.exec(pathname)?.[1];
    if (slug) {
      const visited = [...new Set([...load(VISITED), slug])];
      save(VISITED, visited);
      if (caseStudies.every((c) => visited.includes(c.slug))) unlock("explorer");
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const countUp = (el: Element) => {
      const final = el.textContent ?? "";
      const match = /^(\D*)(\d[\d,]*)(\D*)$/.exec(final);
      if (!match) return;
      const target = Number(match[2].replace(/,/g, ""));
      const start = performance.now();
      const step = (now: number) => {
        const k = Math.min((now - start) / 900, 1);
        el.textContent = k === 1 ? final : `${match[1]}${Math.round(target * (1 - (1 - k) ** 3)).toLocaleString("en-US")}${match[3]}`;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("in");
          entry.target.querySelectorAll(":scope.stat-row strong").forEach(countUp);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    document
      .querySelectorAll(".stat-row, .section > .label, .section > h2, .feature-card, .card, .game, .timeline li, .slot-group, .case-section, .row-list li")
      .forEach((el) => {
        el.classList.add("reveal");
        observer.observe(el);
      });
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <>
      <div className="xp" aria-hidden="true">
        <div ref={bar} />
      </div>
      {toast ? (
        <div className="toast" role="status">
          <span className="toast-star">★</span>
          <span>
            <b>Achievement unlocked</b>
            {toast}
          </span>
        </div>
      ) : null}
      {credits ? (
        <div className="credits" role="dialog" aria-modal="true" aria-label="Credits">
          <div className="credits-roll">
            <p className="label">100% complete</p>
            <h2>Thanks for playing.</h2>
            <dl>
              <dt>Player 1</dt>
              <dd>{profile.name}</dd>
              <dt>Main quests</dt>
              <dd>FairPlay · One Live &amp; N Live</dd>
              <dt>Side quests</dt>
              <dd>skill-gauge · ZOOP · Patrol Pro</dd>
              <dt>Runners</dt>
              <dd>All made up. None were harmed.</dd>
              <dt>Player 2</dt>
              <dd>Could be you.</dd>
            </dl>
            <div className="actions">
              <a className="btn btn-primary" href={`mailto:${profile.email}`}>
                Continue? {profile.email}
              </a>
              <button type="button" className="btn" onClick={() => setCredits(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
