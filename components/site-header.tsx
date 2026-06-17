"use client";

import { useEffect, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="site-header">
      <nav className="container nav">
        <Link href="/" className="brand" aria-label="EasyHarvest Exports home">
          <img src="/easyharvest-logo.webp" alt="EasyHarvest Exports" />
        </Link>

        <div className="mobile-header-actions">
          <Link href="/contact" className="btn small">Get Quote</Link>
          <button
            aria-controls="site-menu"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
            className={`menu-toggle ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className={`nav-panel ${menuOpen ? "open" : ""}`} id="site-menu">
          <div className="nav-links">
            {links.map(([label, href]) => (
              <Link className={isActive(pathname, href) ? "active" : ""} href={href} key={href}>{label}</Link>
            ))}
          </div>
          <div className="nav-actions">
            <Link href="/contact" className="btn small">Get Quote</Link>
            <Link href="/track" className="btn secondary small">Track</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
