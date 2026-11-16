import Link from "next/link";
import { Pipeline, SiteFooter, SiteHeader } from "@/components/Chrome";
import ReviewGame from "@/components/ReviewGame";
import Terrain from "@/components/Terrain";
import Terminal from "@/components/Terminal";
import { awards, caseStudies, education, experience, moreProjects, profile, skillGroups } from "@/content/portfolio";

export default function Home() {
  const [fairplay, live, ...others] = caseStudies;

  return (
    <>
      <SiteHeader />
      <main>
        <div className="hero-band">
          <Terrain />
        <section className="wrap hero">
          <div className="hero-copy">
            <p className="status">
              <span className="pulse" aria-hidden="true" />
              Player 1 · {profile.availability}
            </p>
            <h1>
              {profile.headline}
              <span className="cursor" aria-hidden="true" />
            </h1>
            <p className="lead">{profile.intro}</p>
            <dl className="sheet">
              <div>
                <dt>Class</dt>
                <dd>{profile.role}</dd>
              </div>
              <div>
                <dt>Guild</dt>
                <dd>HKU Computer Engineering</dd>
              </div>
              <div>
                <dt>Party</dt>
                <dd>WayMe R&amp;D</dd>
              </div>
              <div>
                <dt>Spawn</dt>
                <dd>{profile.location}</dd>
              </div>
            </dl>
            <div className="actions">
              <Link className="btn btn-primary" href="/#tutorial">
                ▶ Press start
              </Link>
              <a className="btn" href={profile.github} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
              <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
            </div>
          </div>
          <Terminal />
        </section>
        </div>

        <section className="wrap stat-row" aria-label="Highlights from WayMe">
          {fairplay.metrics.slice(0, 2).concat(fairplay.metrics[3], live.metrics[1]).map((m) => (
            <div key={m.label}>
              <strong>{m.value}</strong>
              <span>{m.label}</span>
            </div>
          ))}
        </section>

        <section className="wrap section" id="tutorial">
          <p className="label">Tutorial level · playable</p>
          <h2>Be the reviewer. Spot the shortcut.</h2>
          <p className="lead game-lead">
            This is the problem FairPlay solves, as a toy simulation with made-up runners. Three levels, three kinds of evidence. Watch the GPS traces and
            flag the runner who did not run the course.
          </p>
          <ReviewGame />
        </section>

        <section className="wrap section" id="work">
          <p className="label">Quest log · selected work</p>
          <h2>Main quests shipped to production.</h2>

          <div className="feature-list">
            {[fairplay, live].map((cs, i) => (
              <Link className="feature-card" href={`/work/${cs.slug}`} key={cs.slug}>
                <div className="feature-head">
                  <p className="meta">
                    <kbd>{i + 1}</kbd> Main quest · {cs.context} · <span className="tag">{cs.status}</span>
                  </p>
                  <h3>{cs.title}</h3>
                  <p className="kicker">{cs.kicker}</p>
                  <p className="body">{cs.summary}</p>
                </div>
                <Pipeline steps={cs.pipeline} />
                <span className="more">Open quest →</span>
              </Link>
            ))}
          </div>

          <h3 className="sub-heading">Side quests</h3>
          <div className="card-grid">
            {others.map((cs, i) => (
              <Link className="card" href={`/work/${cs.slug}`} key={cs.slug}>
                <p className="meta">
                  <kbd>{i + 3}</kbd> {cs.timeline} · <span className="tag">{cs.status}</span>
                </p>
                <h3>{cs.title}</h3>
                <p className="kicker">{cs.kicker}</p>
                <p className="body">{cs.summary}</p>
                <ul className="chips">
                  {cs.stack.slice(0, 4).map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <span className="more">Open quest →</span>
              </Link>
            ))}
          </div>

          <h3 className="sub-heading">Bonus levels</h3>
          <ul className="row-list">
            {moreProjects.map((p) => (
              <li key={p.title}>
                <a href={p.href} target="_blank" rel="noreferrer">
                  <span className="row-title">{p.title} ↗</span>
                  <span className="row-body">{p.body}</span>
                  <span className="row-meta">{p.stack.join(" · ")}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="wrap section" id="experience">
          <p className="label">Campaign · experience</p>
          <h2>Save points so far.</h2>
          <div className="two-col">
            <ol className="timeline">
              {experience.map((e) => (
                <li key={e.title}>
                  <p className="meta">{e.timeline}</p>
                  <h3>{e.title}</h3>
                  <p className="org">
                    {e.org} · {e.place}
                  </p>
                  <p className="body">{e.body}</p>
                </li>
              ))}
            </ol>
            <div className="side-stack">
              <div>
                <h3 className="side-title">Training grounds · education</h3>
                {education.map((e) => (
                  <div className="side-item" key={e.school}>
                    <p className="meta">{e.timeline}</p>
                    <h4>{e.school}</h4>
                    <p className="body">{e.program}</p>
                    <p className="note">{e.note}</p>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="side-title">Achievements unlocked</h3>
                {awards.map((a) => (
                  <div className="side-item achievement" key={a.title}>
                    <span className="star" aria-hidden="true">
                      ★
                    </span>
                    <div>
                      <h4>{a.title}</h4>
                      <p className="note">
                        {a.detail} · {a.timeline}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="wrap section" id="skills">
          <p className="label">Inventory · skills</p>
          <h2>Equipped tools.</h2>
          <div className="inventory">
            {skillGroups.map((g) => (
              <div className="slot-group" key={g.title}>
                <h3>{g.title}</h3>
                <ul className="chips">
                  {g.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
