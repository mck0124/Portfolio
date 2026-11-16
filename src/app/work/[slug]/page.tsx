import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pipeline, SiteFooter, SiteHeader } from "@/components/Chrome";
import LiveDemo from "@/components/LiveDemo";
import TraceMap from "@/components/TraceMap";
import { caseStudies } from "@/content/portfolio";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  return cs ? { title: `${cs.title}: ${cs.kicker}`, description: cs.summary } : {};
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const index = caseStudies.findIndex((c) => c.slug === slug);
  if (index === -1) notFound();
  const cs = caseStudies[index];
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <>
      <SiteHeader />
      <main className="wrap case">
        <Link className="back" href="/#work">
          ← Quest log
        </Link>

        <header className="case-head">
          <p className="meta">
            {cs.context} · {cs.timeline} · <span className="tag">{cs.status}</span>
          </p>
          <h1>{cs.title}</h1>
          <p className="kicker">{cs.kicker}</p>
          <p className="lead">{cs.summary}</p>
          {cs.links.length > 0 ? (
            <div className="actions">
              {cs.links.map((l) => (
                <a className="btn" href={l.href} target="_blank" rel="noreferrer" key={l.href}>
                  {l.label} ↗
                </a>
              ))}
            </div>
          ) : null}
        </header>

        <section className="stat-row" aria-label="Loot: results">
          {cs.metrics.map((m) => (
            <div key={m.label}>
              <strong>{m.value}</strong>
              <span>{m.label}</span>
            </div>
          ))}
        </section>

        {cs.image ? (
          <Image className="case-image" src={cs.image.src} alt={cs.image.alt} width={cs.image.width} height={cs.image.height} priority />
        ) : null}

        {cs.slug === "fairplay" ? <TraceMap /> : null}

        {cs.slug === "live-tracking" ? (
          <section className="case-section">
            <h2>Playable demo</h2>
            <p className="prose demo-intro">
              Two of the decisions below, as switches. Turn them off and watch the map. This is a toy simulation: the runners and the late pings are made up
              to make the effect visible.
            </p>
            <LiveDemo />
          </section>
        ) : null}

        {cs.problem ? (
          <section className="case-section">
            <h2>Objective</h2>
            <p className="prose">{cs.problem}</p>
          </section>
        ) : null}

        <section className="case-section">
          <h2>Walkthrough</h2>
          <Pipeline steps={cs.pipeline} />
        </section>

        <section className="case-section">
          <h2>What I built</h2>
          <ul className="built">
            {cs.built.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>

        {cs.decisions ? (
          <section className="case-section">
            <h2>Key decisions</h2>
            <div className="decisions">
              {cs.decisions.map((d) => (
                <article key={d.title}>
                  <h3>{d.title}</h3>
                  <p>{d.body}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {cs.limits ? (
          <section className="case-section">
            <h2>Known bugs · limits</h2>
            <ul className="built limits">
              {cs.limits.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="case-section">
          <h2>Loadout · stack</h2>
          <ul className="chips">
            {cs.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        <Link className="next-case" href={`/work/${next.slug}`}>
          <span className="meta">Next quest</span>
          <strong>{next.title} →</strong>
          <span>{next.kicker}</span>
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
