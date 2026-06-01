"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  Award,
  BriefcaseBusiness,
  Code2,
  ExternalLink,
  GitBranch,
  GraduationCap,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useRef } from "react";
import {
  awards,
  brandSignals,
  education,
  experience,
  homeStats,
  languages,
  profile,
  projects,
  skillGroups,
} from "@/content/portfolio";

const projectVisuals: Record<string, { image?: string; logo?: string; label: string }> = {
  zoop: {
    image: "/projects/zoop/zoop_hero_final.png",
    label: "AI recruiting workflow",
  },
  phi: {
    image: "/places/hku-campus.jpeg",
    logo: "/logos/hku-crest.png",
    label: "Location safety system",
  },
  "haunted-memories": {
    image: "/places/hku-engineering.jpg",
    label: "C++ systems game",
  },
  "movie-booking-web": {
    image: "/projects/zoop/careers1.png",
    label: "Web booking flow",
  },
};

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="section-heading">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {body ? <p>{body}</p> : null}
    </div>
  );
}

function ExternalAction({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} target={href.startsWith("mailto:") ? "_self" : "_blank"} rel="noreferrer">
      {children}
    </a>
  );
}

export default function InteractivePortfolio() {
  const shellRef = useRef<HTMLElement | null>(null);
  const featuredProjects = projects.slice(0, 4);
  const highlightedAwards = awards.slice(0, 4);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const shell = shellRef.current;
    if (!shell) return;

    const rect = shell.getBoundingClientRect();
    shell.style.setProperty("--cursor-x", `${event.clientX - rect.left}px`);
    shell.style.setProperty("--cursor-y", `${event.clientY - rect.top}px`);
  };

  return (
    <main className="site-shell" ref={shellRef} onPointerMove={handlePointerMove}>
      <div className="cursor-glow" aria-hidden="true" />

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Minchan Kim home">
          <span>MK</span>
          Minchan Kim
        </a>
        <nav aria-label="Portfolio sections">
          <a href="#work">Work</a>
          <a href="#profile">Profile</a>
          <a href="#stack">Stack</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="header-contact" href={`mailto:${profile.email}`}>
          <Mail size={17} />
          Email
        </a>
      </header>

      <section className="hero-section section-anchor" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <MapPin size={16} />
            {profile.location} based {profile.title}
          </p>
          <h1>AI products, clean systems, and interfaces people can actually use.</h1>
          <p className="hero-intro">{profile.intro}</p>
          <div className="hero-actions">
            <a href="#work">
              <Sparkles size={18} />
              View work
            </a>
            <ExternalAction href={profile.github}>
              <GitBranch size={18} />
              GitHub
            </ExternalAction>
            <ExternalAction href={profile.linkedin}>
              <ExternalLink size={18} />
              LinkedIn
            </ExternalAction>
          </div>
        </div>

        <aside className="hero-feature" aria-label="Featured project">
          <div className="hero-image">
            <Image
              src="/projects/zoop/zoop_main_banner.png"
              alt="ZOOP recruiting platform interface"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 44vw"
            />
          </div>
          <div className="feature-copy">
            <span>Featured build</span>
            <h2>ZOOP</h2>
            <p>AI-powered recruiting platform for candidate matching, screening, and interview generation.</p>
          </div>
          <div className="stat-strip" aria-label="Portfolio highlights">
            {homeStats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="logo-strip" aria-label="Affiliations">
        {brandSignals.map((brand) => (
          <article key={brand.name}>
            <Image src={brand.logo} alt={`${brand.name} logo`} width={150} height={58} />
            <div>
              <strong>{brand.name}</strong>
              <span>{brand.label}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="work-section section-anchor" id="work">
        <SectionHeading
          eyebrow="Selected work"
          title="Compact case studies with real systems behind them."
          body="The emphasis is on AI workflows, backend architecture, mobile products, and practical interfaces."
        />

        <div className="project-grid">
          {featuredProjects.map((project, index) => {
            const visual = projectVisuals[project.slug];
            return (
              <article className={index === 0 ? "project-card project-card-large" : "project-card"} key={project.slug}>
                <div className="project-media">
                  {visual?.image ? (
                    <Image
                      src={visual.image}
                      alt={`${project.shortTitle} visual`}
                      fill
                      sizes={index === 0 ? "(max-width: 900px) 100vw, 50vw" : "(max-width: 900px) 100vw, 33vw"}
                    />
                  ) : null}
                  {visual?.logo ? (
                    <span className="project-logo">
                      <Image src={visual.logo} alt="" width={52} height={52} />
                    </span>
                  ) : null}
                  <span className="project-label">{visual?.label ?? project.role}</span>
                </div>
                <div className="project-body">
                  <span>{project.timeline}</span>
                  <h3>{project.shortTitle}</h3>
                  <p>{project.summary}</p>
                  <div className="chip-row">
                    {project.stack.slice(0, 5).map((item) => (
                      <small key={item}>{item}</small>
                    ))}
                  </div>
                  <div className="project-links">
                    {project.links.github ? (
                      <ExternalAction href={project.links.github}>
                        GitHub
                        <ArrowUpRight size={16} />
                      </ExternalAction>
                    ) : null}
                    {project.links.video ? (
                      <ExternalAction href={project.links.video}>
                        Video
                        <ArrowUpRight size={16} />
                      </ExternalAction>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="profile-section section-anchor" id="profile">
        <SectionHeading
          eyebrow="Profile"
          title="Built from international education, product training, and service experience."
        />

        <div className="profile-grid">
          <div className="timeline-column">
            <div className="column-title">
              <BriefcaseBusiness size={20} />
              Experience
            </div>
            {experience.map((item) => (
              <article className="timeline-item" key={`${item.title}-${item.timeline}`}>
                <div className="timeline-logo">
                  {item.logo ? <Image src={item.logo} alt={`${item.org} logo`} width={48} height={48} /> : null}
                </div>
                <div>
                  <span>{item.timeline}</span>
                  <h3>{item.title}</h3>
                  <strong>{item.org}</strong>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="timeline-column">
            <div className="column-title">
              <GraduationCap size={20} />
              Education
            </div>
            {education.map((item) => (
              <article className="education-card" key={item.school}>
                <div className="education-image">
                  <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 900px) 100vw, 34vw" />
                </div>
                <div className="education-copy">
                  <Image src={item.logo} alt={`${item.school} logo`} width={54} height={54} />
                  <span>{item.timeline}</span>
                  <h3>{item.school}</h3>
                  <p>{item.program}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="stack-section section-anchor" id="stack">
        <div>
          <SectionHeading
            eyebrow="Stack"
            title="Tools selected for shipping real product flows."
            body={`Languages: ${languages.join(" / ")}`}
          />
        </div>
        <div className="stack-grid">
          {skillGroups.map((group) => (
            <article className="skill-card" key={group.title}>
              <h3>{group.title}</h3>
              <div className="chip-row">
                {group.items.map((item) => (
                  <small key={item}>{item}</small>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="archive-section">
        <SectionHeading eyebrow="Recognition" title="Awards and credentials without the clutter." />
        <div className="award-grid">
          {highlightedAwards.map((award) => (
            <article className="award-card" key={award.title}>
              <div className="award-icon">
                {award.logo ? <Image src={award.logo} alt={`${award.issuer} logo`} width={44} height={44} /> : <Award size={22} />}
              </div>
              <span>{award.timeline}</span>
              <h3>{award.title}</h3>
              <p>{award.body}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="contact-section section-anchor" id="contact">
        <div>
          <span className="eyebrow">
            <Code2 size={16} />
            Open to building
          </span>
          <h2>Let&apos;s make the next interface simpler, faster, and more useful.</h2>
        </div>
        <div className="contact-actions">
          <a href={`mailto:${profile.email}`}>
            <Mail size={18} />
            {profile.email}
          </a>
          <ExternalAction href={profile.github}>
            <GitBranch size={18} />
            GitHub
          </ExternalAction>
          <ExternalAction href={profile.linkedin}>
            <ExternalLink size={18} />
            LinkedIn
          </ExternalAction>
        </div>
      </footer>
    </main>
  );
}
