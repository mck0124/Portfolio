import Link from "next/link";
import { ArrowLeft, Code2, FileText, Play } from "lucide-react";
import { type Project } from "@/content/portfolio";

export default function ProjectDetail({ project }: { project: Project }) {
  return (
    <main className="detail-shell">
      <Link className="detail-back" href="/projects">
        <ArrowLeft size={18} />
        Back to projects
      </Link>

      <section className="detail-hero">
        <p className="section-kicker">{project.role}</p>
        <h1>{project.title}</h1>
        <p>{project.summary}</p>
        {project.slug === "zoop" ? (
          <div className="case-metrics" aria-label="ZOOP project metrics">
            <div>
              <strong>100+</strong>
              <span>candidate profiles processed</span>
            </div>
            <div>
              <strong>500+</strong>
              <span>AI interview questions generated</span>
            </div>
            <div>
              <strong>90%</strong>
              <span>screening time reduction</span>
            </div>
          </div>
        ) : null}
        <div className="detail-actions">
          {project.links.github ? (
            <a href={project.links.github} target="_blank" rel="noreferrer">
              <Code2 size={18} />
              GitHub
            </a>
          ) : null}
          {project.links.deck ? (
            <a href={project.links.deck} target="_blank" rel="noreferrer">
              <FileText size={18} />
              Deck
            </a>
          ) : null}
          {project.links.video ? (
            <a href={project.links.video} target="_blank" rel="noreferrer">
              <Play size={18} />
              Video
            </a>
          ) : null}
        </div>
      </section>

      <section className="detail-grid">
        <article>
          <h2>Problem</h2>
          <p>{project.detail.problem}</p>
        </article>
        <article>
          <h2>Outcome</h2>
          <p>{project.detail.outcome}</p>
        </article>
      </section>

      <section className="detail-grid">
        <article>
          <h2>Contribution</h2>
          <ul>
            {project.detail.contribution.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <h2>Technical Decisions</h2>
          <ul>
            {project.detail.technicalDecisions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="detail-stack">
        <h2>Stack</h2>
        <div>
          {project.stack.map((item) => (
            <span className="tech-chip" key={item}>
              {item}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
