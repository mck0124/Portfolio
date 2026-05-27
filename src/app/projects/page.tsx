import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code2, Layers3, Play } from "lucide-react";
import { lenses, projects } from "@/content/portfolio";

export default function ProjectsPage() {
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
        <p className="section-kicker">Project screen</p>
        <h1>Systems worth opening</h1>
        <p>
          Case studies are separated into focused rooms so recruiters can inspect the architecture,
          product contribution, and proof of work without scrolling through one long page.
        </p>
        <div className="lens-row">
          {lenses.map((lens) => (
            <span key={lens}>{lens}</span>
          ))}
        </div>
      </section>

      <section className="project-index">
        {projects.map((project, index) => (
          <article className={project.image ? "project-index-card featured" : "project-index-card"} key={project.slug}>
            {project.image ? (
              <div className="project-image">
                <Image src={project.image} alt={`${project.shortTitle} preview`} width={680} height={420} />
              </div>
            ) : (
              <div className="project-symbol" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </div>
            )}
            <div className="project-index-copy">
              <p className="section-kicker">{project.role}</p>
              <h2>{project.title}</h2>
              <p>{project.summary}</p>
              <div className="impact-list">
                {project.impact.slice(0, 3).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <div className="tech-list">
                {project.stack.slice(0, 7).map((item) => (
                  <span className="tech-chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
              <div className="project-index-actions">
                <Link href={`/projects/${project.slug}`}>
                  Case study
                  <ArrowRight size={17} />
                </Link>
                {project.links.github ? (
                  <a href={project.links.github} target="_blank" rel="noreferrer" aria-label={`${project.shortTitle} GitHub`}>
                    <Code2 size={18} />
                  </a>
                ) : null}
                {project.links.video ? (
                  <a href={project.links.video} target="_blank" rel="noreferrer" aria-label={`${project.shortTitle} video`}>
                    <Play size={18} />
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
