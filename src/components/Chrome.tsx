import Link from "next/link";
import { Trophies } from "@/components/Fx";
import { profile } from "@/content/portfolio";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link className="wordmark" href="/">
          <span className="dot" aria-hidden="true" />
          minchan.kim
        </Link>
        <nav aria-label="Sections">
          <Link href="/#work">Quests</Link>
          <Link href="/#experience">Campaign</Link>
          <Link href="/#skills">Inventory</Link>
          <Link href="/#contact">Contact</Link>
          <Trophies />
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="wrap">
        <p className="label">Continue? · contact</p>
        <h2>Player 2 wanted. {profile.availability}.</h2>
        <p className="footer-lead">Software engineering, applied AI and quant development roles. Email is the fastest way to reach me.</p>
        <div className="actions">
          <a className="btn btn-primary" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <a className="btn" href={profile.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
        </div>
        <p className="colophon">
          {profile.name} · {profile.location} · {profile.coords}
        </p>
      </div>
    </footer>
  );
}

export function Pipeline({ steps }: { steps: string[] }) {
  return (
    <ol className="pipeline">
      {steps.map((step, i) => (
        <li key={step}>
          <span className="pipeline-n">{String(i + 1).padStart(2, "0")}</span>
          {step}
        </li>
      ))}
    </ol>
  );
}
