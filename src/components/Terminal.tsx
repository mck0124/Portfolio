"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ACHIEVEMENTS, getUnlocked, unlock } from "@/components/Fx";
import { awards, caseStudies, education, experience, profile, skillGroups } from "@/content/portfolio";

type Line = { kind: "in" | "out" | "ok"; text: string };
type Result = { lines: Line[]; open?: string; clear?: boolean; play?: boolean; known?: boolean };

const boot = [
  "booting minchan-os 2026.11",
  `loading quests ......... ${caseStudies.length} found`,
  `loading achievements ... ${ACHIEVEMENTS.length} to unlock`,
  "player 1 ready.",
  "Type `help`, or press 1–5 to open a quest. Tab completes.",
].join("\n");

const suggestions = ["help", "quests", "man fairplay", "git log", "play", "sudo hire minchan"];
const commands = ["help", "whoami", "quests", "open", "man", "cat", "git", "inventory", "awards", "achievements", "play", "contact", "clear", "sudo"];
const hashes = ["9f2c1ab", "5d07e3c", "2b8a64f", "0c31d9e"];

const out = (...text: string[]): Line[] => text.map((t) => ({ kind: "out", text: t }));
const findQuest = (key: string) => (key ? (caseStudies[Number(key) - 1] ?? caseStudies.find((c) => c.slug.startsWith(key))) : undefined);

function run(cmd: string): Result {
  const [name, ...args] = cmd.trim().toLowerCase().split(/\s+/);
  const arg = args[0] ?? "";

  switch (name) {
    case "help":
      return {
        lines: out(
          "whoami          character sheet",
          "quests          list all quests",
          "open <quest>    open a quest page",
          "man <quest>     read a quest summary here",
          "cat resume      experience and education",
          "git log         career history",
          "inventory       skills and tools",
          "awards          real-world awards",
          "achievements    what you have unlocked on this site",
          "play            jump to the tutorial level",
          "contact         how to reach me",
          "clear           clear the screen",
        ),
      };
    case "whoami":
      return { lines: out(`${profile.name} · ${profile.role}`, "HKU Computer Engineering · R&D intern at WayMe", `${profile.location} · ${profile.coords}`) };
    case "quests":
    case "ls":
      return { lines: out(...caseStudies.map((c, i) => `[${i + 1}] ${c.slug.padEnd(14)} ${c.kicker}`)) };
    case "open":
    case "cd": {
      const cs = findQuest(arg);
      return cs ? { lines: [{ kind: "ok", text: `Loading quest: ${cs.title} …` }], open: cs.slug } : { lines: out(`No quest called "${arg}". Try \`quests\`.`), known: false };
    }
    case "man":
    case "cat": {
      if (name === "cat" && arg.startsWith("resume")) {
        return {
          lines: out(
            "EXPERIENCE",
            ...experience.map((e) => `  ${e.timeline.padEnd(20)} ${e.title}, ${e.org}`),
            "EDUCATION",
            ...education.map((e) => `  ${e.timeline.padEnd(20)} ${e.program}, ${e.school}`),
          ),
        };
      }
      const cs = findQuest(arg);
      if (!cs) return { lines: out(`Nothing found for "${arg}". Try \`man fairplay\` or \`cat resume\`.`), known: false };
      return {
        lines: out(
          `NAME      ${cs.title}: ${cs.kicker}`,
          `STATUS    ${cs.status} · ${cs.timeline}`,
          `SUMMARY   ${cs.summary}`,
          ...cs.metrics.map((m) => `LOOT      ${m.value} ${m.label}`),
          ...(cs.limits ?? []).map((l) => `BUGS      ${l}`),
          `SEE ALSO  open ${cs.slug}`,
        ),
      };
    }
    case "git":
      return arg === "log"
        ? { lines: out(...experience.map((e, i) => `${hashes[i]}${i === 0 ? " (HEAD)" : ""} ${e.title} @ ${e.org} · ${e.timeline}`)) }
        : { lines: out("Only `git log` works here. The history is read-only."), known: false };
    case "inventory":
    case "skills":
      return { lines: out(...skillGroups.map((g) => `${g.title.padEnd(22)} ${g.items.slice(0, 5).join(", ")}`)) };
    case "awards":
      return { lines: out(...awards.map((a) => `★ ${a.title} (${a.timeline})`)) };
    case "achievements":
    case "trophies": {
      const got = getUnlocked();
      return { lines: out(...ACHIEVEMENTS.map((a) => `${got.includes(a.id) ? "★" : "☆"} ${a.title.padEnd(16)} ${a.hint}`), `${got.length}/${ACHIEVEMENTS.length} unlocked`) };
    }
    case "play":
      return { lines: [{ kind: "ok", text: "Loading tutorial level …" }], play: true };
    case "contact":
      return { lines: out(profile.email, profile.github, profile.linkedin) };
    case "sudo":
      return args.join(" ") === "hire minchan"
        ? { lines: [{ kind: "ok", text: "Permission granted. +1 party member." }, ...out(`Send the offer to ${profile.email}`)] }
        : { lines: out("Nice try. The only sudo command here is `sudo hire minchan`."), known: false };
    case "exit":
    case "quit":
      return { lines: out("There is no exit. There is only `sudo hire minchan`."), known: false };
    case "rm":
      return { lines: out("Permission denied. The quest log is append-only."), known: false };
    case "clear":
      return { lines: [], clear: true };
    case "":
      return { lines: [], known: false };
    default:
      return { lines: out(`command not found: ${name}. Type \`help\`.`), known: false };
  }
}

function complete(value: string): string {
  const parts = value.toLowerCase().split(/\s+/);
  if (parts.length === 1) {
    const hit = commands.filter((c) => c.startsWith(parts[0]));
    return hit.length === 1 ? `${hit[0]} ` : value;
  }
  if (parts.length === 2 && ["open", "cd", "man", "cat"].includes(parts[0])) {
    const options = [...caseStudies.map((c) => c.slug), ...(parts[0] === "cat" ? ["resume"] : [])];
    const hit = options.filter((o) => o.startsWith(parts[1]));
    return hit.length === 1 ? `${parts[0]} ${hit[0]}` : value;
  }
  if (value.toLowerCase() === "git ") return "git log";
  return value;
}

export default function Terminal() {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([]);
  const [typed, setTyped] = useState(0);
  const [showBoot, setShowBoot] = useState(true);
  const [value, setValue] = useState("");
  const screenRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const history = useRef<string[]>([]);
  const cursor = useRef(0);
  const used = useRef(new Set<string>());

  const submit = (cmd: string) => {
    const result = run(cmd);
    setLines((prev) => (result.clear ? [] : [...prev, { kind: "in", text: cmd }, ...result.lines]));
    setTyped(boot.length);
    setValue("");
    if (result.clear) setShowBoot(false);
    if (cmd.trim()) history.current.push(cmd);
    cursor.current = history.current.length;

    if (result.known !== false) {
      used.current.add(cmd.trim().toLowerCase().split(/\s+/)[0]);
      if (used.current.size >= 5) unlock("hacker");
    }
    if (cmd.trim().toLowerCase() === "sudo hire minchan") unlock("sudo");
    if (result.open) router.push(`/work/${result.open}`);
    if (result.play) document.getElementById("tutorial")?.scrollIntoView();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && value) {
      e.preventDefault();
      setValue(complete(value));
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      cursor.current = Math.min(Math.max(cursor.current + (e.key === "ArrowUp" ? -1 : 1), 0), history.current.length);
      setValue(history.current[cursor.current] ?? "");
    }
  };

  useEffect(() => {
    const timer = window.setInterval(() => setTyped((n) => (n >= boot.length ? n : n + 2)), 16);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    screenRef.current?.scrollTo({ top: screenRef.current.scrollHeight });
  }, [lines]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey || e.altKey) return;
      const quest = caseStudies[Number(e.key) - 1];
      if (quest) router.push(`/work/${quest.slug}`);
      if (e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
      <div className="terminal-bar">
        <span>console</span>
        <span>/ focus · tab complete · ↑ history</span>
      </div>
      <div className="terminal-screen" ref={screenRef} aria-live="polite">
        {showBoot ? <p className="t-out">{boot.slice(0, typed)}</p> : null}
        {lines.map((line, i) => (
          <p className={`t-${line.kind}`} key={i}>
            {line.kind === "in" ? <span className="prompt">&gt; </span> : null}
            {line.text}
          </p>
        ))}
      </div>
      <form
        className="terminal-input"
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
      >
        <span className="prompt">&gt;</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Console command"
          placeholder="type a command"
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
        />
      </form>
      <div className="terminal-keys">
        {suggestions.map((s) => (
          <button type="button" key={s} onClick={() => submit(s)}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
