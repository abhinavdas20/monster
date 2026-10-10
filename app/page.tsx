import Link from "next/link";

const routes = [
  { href: "/monsters", title: "Available Monsters", description: "Browse the wild roster" },
  { href: "/collection", title: "Collection", description: "View the monsters you own" },
  { href: "/team", title: "Team Builder", description: "Select your battle squad" },
  { href: "/encounter", title: "Encounter", description: "Challenge a wild monster" },
  { href: "/history", title: "History", description: "Review battle outcomes" },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="card p-8 md:p-12">
        <p className="mb-3 inline-flex rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
          Monster Tamers
        </p>
        <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
          Build a squad. Hunt wild monsters. Grow your collection.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-300 md:text-lg">
          This proof-of-concept focuses on the core game loop: prepare, encounter, result, and progress.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {routes.map((route) => (
          <Link key={route.href} href={route.href} className="card flex h-full flex-col justify-between p-6 transition-transform hover:-translate-y-1">
            <div>
              <h2 className="text-xl font-bold text-white">{route.title}</h2>
              <p className="mt-2 text-sm text-slate-300">{route.description}</p>
            </div>
            <span className="mt-6 text-sm font-semibold text-cyan-300">Open →</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
