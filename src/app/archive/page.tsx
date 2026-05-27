import Link from "next/link";
import Image from "next/image";
import { Award, BadgeCheck, Layers3, Trophy } from "lucide-react";
import { awards, experience, profile } from "@/content/portfolio";

export default function ArchivePage() {
  return (
    <main className="page-shell">
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
        <p className="section-kicker">Archive screen</p>
        <h1>Awards, leadership, and proof points</h1>
        <p>
          Profile details are represented as structured site content. This screen collects the recognitions
          and milestones that support the project case studies.
        </p>
      </section>

      <section className="award-grid">
        {awards.map((award, index) => (
          <article key={award.title}>
            <div className="award-card-top">
              <div className="award-icon">
                {award.logo ? (
                  <Image src={award.logo} alt={`${award.issuer} logo`} width={30} height={30} />
                ) : index < 2 ? (
                  <Trophy size={22} />
                ) : (
                  <Award size={22} />
                )}
              </div>
              <span>{award.timeline}</span>
            </div>
            <h2>{award.title}</h2>
            <p className="org">{award.issuer}</p>
            <p>{award.body}</p>
          </article>
        ))}
      </section>

      <section className="archive-band">
        <div>
          <BadgeCheck size={24} />
          <h2>Leadership signal</h2>
          <p>
            {profile.name} combines student developer leadership, military responsibility, international education,
            and project-based AI engineering training.
          </p>
        </div>
        <div className="compact-timeline">
          {experience.map((item) => (
            <span key={item.title}>
              {item.logo ? <Image src={item.logo} alt={`${item.org} logo`} width={34} height={34} /> : <BadgeCheck size={18} />}
              <strong>{item.timeline}</strong>
              <em>{item.title}</em>
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
