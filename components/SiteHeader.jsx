import Link from "next/link";
import site from "@/data/site.json";
import NavLink from "./NavLink";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-brand-900 via-brand-800 to-brand-600 shadow-sm">
      <div className="container-page flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="group flex items-center gap-3 leading-tight">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://avatars.githubusercontent.com/u/1084585?s=200&v=4"
            alt="commercetools"
            className="h-9 w-9 flex-none rounded-xl bg-white/10 object-cover shadow-inner"
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
