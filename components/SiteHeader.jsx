import Link from "next/link";
import site from "@/data/site.json";
import NavLink from "./NavLink";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-brand-900 via-brand-800 to-brand-600 shadow-sm">
      <div className="container-page flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="group flex items-center gap-3 leading-tight">
          <span
            className="h-9 w-9 flex-none rounded-xl bg-[radial-gradient(circle_at_30%_30%,#38bdf8,transparent_55%),radial-gradient(circle_at_70%_30%,#f472b6,transparent_55%),radial-gradient(circle_at_50%_75%,#facc15,transparent_55%)] bg-brand-700 shadow-inner"
            aria-hidden
          />
          <span className="flex flex-col">
            <span className="text-sm font-semibold text-white">
              {site.brand.name}
            </span>
            <span className="text-xs text-white/70">
              {site.brand.tagline}
            </span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm">
          {site.nav.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
