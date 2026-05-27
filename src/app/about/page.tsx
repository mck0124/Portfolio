import Link from "next/link";
import Image from "next/image";
import { BriefcaseBusiness, GraduationCap, Layers3, MapPin } from "lucide-react";
import { brandSignals, education, experience, languages, profile, skillGroups } from "@/content/portfolio";

export default function AboutPage() {
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

      <section className="page-hero about-hero">
        <p className="section-kicker">Player profile</p>
        <h1>{profile.name}</h1>
        <p>{profile.intro}</p>
        <div className="profile-strip">
          <span>
            <MapPin size={16} />
            {profile.location}
          </span>
          <span>HKU Computer Engineering</span>
          <span>AI / Backend / Mobile / Systems</span>
        </div>
      </section>

      <section className="institution-showcase" aria-label="Affiliations and education">
        {brandSignals.map((brand) => (
          <article className="institution-card" key={brand.name}>
            {brand.image ? (
              <div className="institution-image">
                <Image src={brand.image} alt={brand.imageAlt ?? brand.name} fill sizes="(max-width: 720px) 100vw, 32vw" />
              </div>
            ) : (
              <div className="institution-image institution-image-logo">
                <Image src={brand.logo} alt={`${brand.name} logo`} width={92} height={92} />
              </div>
            )}
            <div className="institution-copy">
              <span className="institution-logo">
                <Image src={brand.logo} alt={`${brand.name} logo`} width={112} height={46} />
              </span>
              <p>{brand.label}</p>
              <h2>{brand.name}</h2>
              <small>{brand.detail}</small>
            </div>
          </article>
        ))}
      </section>

      <section className="profile-grid">
        <article className="profile-card large">
          <h2>
            <GraduationCap size={22} />
            Education
          </h2>
          {education.map((item) => (
            <div className="education-item" key={item.school}>
              <div className="education-logo">
                <Image src={item.logo} alt={`${item.school} logo`} width={86} height={86} />
              </div>
              <div className="education-copy">
                <span>{item.timeline}</span>
                <h3>{item.school}</h3>
                <p>{item.program}</p>
                <div>
                  {item.details.map((detail) => (
                    <small key={detail}>{detail}</small>
                  ))}
                </div>
              </div>
              <div className="education-visual">
                <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 720px) 100vw, 320px" />
              </div>
            </div>
          ))}
        </article>

        <article className="profile-card">
          <h2>Working Style</h2>
          <p>
            I like projects where software architecture, AI workflows, and product clarity meet. The strongest signal in
            my work is not just shipping a demo, but making the system explainable, reproducible, and useful for real users.
          </p>
        </article>

        <article className="profile-card">
          <h2>Languages</h2>
          {languages.map((item) => (
            <p className="language-row" key={item}>
              {item}
            </p>
          ))}
        </article>
      </section>

      <section className="timeline-panel">
        <div className="panel-heading">
          <BriefcaseBusiness size={22} />
          <h2>Experience</h2>
        </div>
        {experience.map((item) => (
          <article key={item.title}>
            <div className="timeline-logo">
              {item.logo ? <Image src={item.logo} alt={`${item.org} logo`} width={58} height={58} /> : <BriefcaseBusiness size={22} />}
            </div>
            <div className="timeline-copy">
              <span>{item.timeline}</span>
              <h3>{item.title}</h3>
              <p className="org">
                {item.org} {item.location ? `- ${item.location}` : ""}
              </p>
              <p>{item.body}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="skill-matrix">
        <div className="panel-heading">
          <h2>Technical skill map</h2>
        </div>
        <div className="skill-grid">
          {skillGroups.map((group) => (
            <article key={group.title}>
              <h3>{group.title}</h3>
              <div>
                {group.items.map((item) => (
                  <span className="tech-chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
