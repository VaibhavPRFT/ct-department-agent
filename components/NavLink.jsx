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
        "rounded-full px-3.5 py-1.5 font-medium transition-colors " +
        (active
          ? "bg-accent text-ink"
          : "text-white/80 hover:bg-white/10 hover:text-white")
      }
    >
      {children}
    </Link>
  );
}
