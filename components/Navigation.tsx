import Link from "next/link";
import { AuthControls } from "@/components/AuthControls";

const links = [
  { href: "/", label: "Home" },
  { href: "/monsters", label: "Monsters" },
  { href: "/collection", label: "Collection" },
  { href: "/team", label: "Team" },
  { href: "/encounter", label: "Encounter" },
  { href: "/history", label: "History" },
];

export function Navigation() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="text-lg font-black tracking-wide text-white">Monster Tamers</Link>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full border border-slate-700 px-3 py-1.5 transition hover:border-violet-400 hover:text-white">
              {link.label}
            </Link>
          ))}
          <AuthControls />
        </div>
      </nav>
    </header>
  );
}
