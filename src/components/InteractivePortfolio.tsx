"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Code2,
  Command,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  Layers3,
  Mail,
  Radar,
  Search,
  Terminal,
  Trophy,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { brandSignals, homeStats, profile, skillGroups } from "@/content/portfolio";

const missionCards = [
  {
    label: "Projects",
    eyebrow: "Selected work",
    href: "/projects",
    icon: FolderKanban,
    body: "ZOOP, Phi, systems work, and game projects.",
  },
  {
    label: "About",
    eyebrow: "Profile",
    href: "/about",
    icon: GraduationCap,
    body: "Education, training, experience, skills, and working style.",
  },
  {
    label: "Archive",
    eyebrow: "Awards",
    href: "/archive",
    icon: Trophy,
    body: "Awards, leadership, certifications, language profile, and milestones.",
  },
  {
    label: "Contact",
    eyebrow: "Connect",
    href: "/contact",
    icon: Mail,
    body: "Email, GitHub, LinkedIn, and project links.",
  },
];

const commands = [
  { label: "Open Projects", target: "/projects", icon: FolderKanban },
  { label: "Open ZOOP case study", target: "/projects/zoop", icon: Bot },
  { label: "Open About", target: "/about", icon: GraduationCap },
  { label: "Open Archive", target: "/archive", icon: Trophy },
  { label: "Open Lab", target: "/lab", icon: Radar },
  { label: "Open GitHub", target: profile.github, icon: Code2, external: true },
  { label: "Open LinkedIn", target: profile.linkedin, icon: ExternalLink, external: true },
  { label: "Email Minchan", target: `mailto:${profile.email}`, icon: Mail, external: true },
];

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="metric-tile">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function CommandPalette({
  navigate,
  onClose,
  open,
}: {
  navigate: (target: string, external?: boolean) => void;
  onClose: () => void;
  open: boolean;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => commands.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="command-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            className="command-panel"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="command-search">
              <Search size={18} />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Jump to a screen, project, or link"
              />
              <button className="icon-button" onClick={onClose} aria-label="Close command palette">
                <X size={18} />
              </button>
            </div>
            <div className="command-list">
              {filtered.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      navigate(item.target, item.external);
                      onClose();
                    }}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    <ArrowRight size={16} />
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function InteractivePortfolio() {
  const router = useRouter();
  const stageRef = useRef<HTMLElement | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);

  const topSkills = skillGroups.flatMap((group) => group.items).slice(0, 8);

  const navigate = (target: string, external?: boolean) => {
    if (external || target.startsWith("http") || target.startsWith("mailto:")) {
      window.open(target, target.startsWith("mailto:") ? "_self" : "_blank", "noopener,noreferrer");
      return;
    }

    router.push(target);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const stage = stageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    stage.style.setProperty("--cursor-x", `${event.clientX - rect.left}px`);
    stage.style.setProperty("--cursor-y", `${event.clientY - rect.top}px`);
    stage.classList.add("is-tracking");
  };

  const handlePointerLeave = () => {
    stageRef.current?.classList.remove("is-tracking");
  };

  return (
    <main className="home-shell">
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} navigate={navigate} />

      <section
        ref={stageRef}
        className="home-stage"
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
      >
        <div className="home-ambient" aria-hidden="true">
          <span className="ambient-plane ambient-plane-primary" />
          <span className="ambient-plane ambient-plane-secondary" />
          <span className="ambient-line ambient-line-one" />
          <span className="ambient-line ambient-line-two" />
        </div>
        <div className="cursor-reticle" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>

        <header className="top-nav">
          <Link className="brand-mark" href="/">
            <Terminal size={18} />
            Minchan Kim
          </Link>
          <nav aria-label="Primary navigation">
            <Link href="/projects">Projects</Link>
            <Link href="/about">About</Link>
            <Link href="/archive">Archive</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <button className="command-trigger" onClick={() => setCommandOpen(true)} aria-label="Open command palette">
            <Command size={17} />
            <span>Cmd K</span>
          </button>
        </header>

        <div className="home-layout">
          <section className="identity-panel" aria-label="Profile summary">
            <p className="section-kicker">Portfolio</p>
            <h1>{profile.name}</h1>
            <h2>{profile.title}</h2>
            <p>{profile.tagline}</p>
            <div className="hero-actions">
              <Link href="/projects">
                <Layers3 size={18} />
                Enter portfolio
              </Link>
              <a href={profile.github} target="_blank" rel="noreferrer">
                <Code2 size={18} />
                GitHub
              </a>
              <a href={`mailto:${profile.email}`}>
                <Mail size={18} />
                Contact
              </a>
            </div>
            <div className="hero-status">
              {homeStats.map((stat) => (
                <Metric key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </div>
            <div className="brand-rack" aria-label="Affiliations">
              {brandSignals.map((brand) => (
                <span key={brand.name}>
                  <span className="brand-rack-logo">
                    <Image src={brand.logo} alt={`${brand.name} logo`} width={110} height={42} />
                  </span>
                  <small>{brand.label}</small>
                </span>
              ))}
            </div>
            <div className="tech-dock" aria-label="Primary skills">
              {topSkills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </section>

          <section className="mission-panel" aria-label="Screen selection">
            <div className="mission-heading">
              <span>Explore</span>
              <strong>Start with the work</strong>
              <p>Clean routes into projects, background, credentials, and ways to reach me.</p>
            </div>
            <div className="mission-list">
              {missionCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Link className="mission-row" href={card.href} key={card.href}>
                    <span className="mission-icon">
                      <Icon size={22} />
                    </span>
                    <span className="mission-copy">
                      <span>{card.eyebrow}</span>
                      <strong>{card.label}</strong>
                      <p>{card.body}</p>
                    </span>
                    <ArrowRight className="mission-arrow" size={18} />
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
