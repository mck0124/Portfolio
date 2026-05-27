import Link from "next/link";
import { Code2, ExternalLink, Layers3, Mail, MapPin } from "lucide-react";
import { profile } from "@/content/portfolio";

export default function ContactPage() {
  return (
    <main className="page-shell contact-screen">
      <header className="page-nav">
        <Link className="brand-mark" href="/">
          <Layers3 size={18} />
          MK Build World
        </Link>
        <nav>
          <Link href="/projects">Projects</Link>
          <Link href="/about">About</Link>
          <Link href="/archive">Archive</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </header>

      <section className="page-hero">
        <p className="section-kicker">Contact screen</p>
        <h1>Let&apos;s build useful systems.</h1>
        <p>{profile.tagline}</p>
      </section>

      <section className="contact-card-grid">
        <a href={`mailto:${profile.email}`}>
          <Mail size={22} />
          Email
          <span>{profile.email}</span>
        </a>
        <a href={profile.github} target="_blank" rel="noreferrer">
          <Code2 size={22} />
          GitHub
          <span>mck0124</span>
        </a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">
          <ExternalLink size={22} />
          LinkedIn
          <span>minchankiim</span>
        </a>
        <div>
          <MapPin size={22} />
          Location
          <span>{profile.location}</span>
        </div>
      </section>
    </main>
  );
}
