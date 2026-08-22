"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, children }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={
        "rounded-lg px-3 py-1.5 font-medium transition-colors " +
        (active
          ? "bg-brand-50 text-brand-700"
          : "text-ink-soft hover:bg-slate-100 hover:text-ink")
      }
    >
      {children}
    </Link>
  );
}
