import Link from "next/link";
import site from "@/data/site.json";
import NavLink from "./NavLink";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="container-page flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="group flex flex-col leading-tight">
          <span className="text-sm font-semibold text-ink">
            {site.brand.name}
          </span>
          <span className="text-xs text-ink-faint group-hover:text-brand-600">
            {site.brand.tagline}
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
