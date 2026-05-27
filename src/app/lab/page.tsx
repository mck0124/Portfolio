import Link from "next/link";
import { Bot, Command, Gamepad2, Layers3, MousePointer2, Radar } from "lucide-react";

const experiments = [
  {
    title: "Mouse-follow scout",
    icon: MousePointer2,
    body: "A reticle and 3D scout that react to pointer movement, creating a game-like entry interaction.",
  },
  {
    title: "Command palette",
    icon: Command,
    body: "Fast keyboard navigation for people who want direct access instead of exploration.",
  },
  {
    title: "ZOOP AI simulation",
    icon: Bot,
    body: "A stable walkthrough of candidate ranking, portfolio matching, and interview question generation.",
  },
  {
    title: "World-node routing",
    icon: Radar,
    body: "Project and profile areas mapped as navigable objects rather than a single resume page.",
  },
  {
    title: "Systems game room",
    icon: Gamepad2,
    body: "A place to connect C/C++, gameplay, and low-level systems thinking to the portfolio interface.",
  },
];

export default function LabPage() {
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
        <p className="section-kicker">Lab screen</p>
        <h1>Interaction experiments</h1>
        <p>Small interface systems that make the portfolio feel like a product instead of a static resume.</p>
      </section>

      <section className="lab-grid">
        {experiments.map((experiment) => {
          const Icon = experiment.icon;
          return (
            <article key={experiment.title}>
              <Icon size={24} />
              <h2>{experiment.title}</h2>
              <p>{experiment.body}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
