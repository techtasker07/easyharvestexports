"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["Home", "/"],
  ["Products", "/products"],
  ["About", "/about"],
  ["Documentation", "/documentation"],
  ["Export Process", "/export-process"],
  ["Track Quote", "/track"]
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <nav className="container nav">
        <Link href="/" className="brand" aria-label="EasyHarvest Exports home">
          <img src="/easyharvest-logo.webp" alt="EasyHarvest Exports" />
        </Link>
        <div className="nav-links">
          {links.map(([label, href]) => (
            <Link className={isActive(pathname, href) ? "active" : ""} href={href} key={href}>{label}</Link>
          ))}
        </div>
        <div className="nav-actions">
          <Link href="/contact" className="btn small">Get Quote</Link>
          <Link href="/track" className="btn secondary small">Track</Link>
        </div>
      </nav>
    </header>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
