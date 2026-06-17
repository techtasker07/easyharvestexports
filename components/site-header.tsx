"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["Home", "/", "home"],
  ["Products", "/products", "products"],
  ["About", "/about", "about"],
  ["Documentation", "/documentation", "docs"],
  ["Export Process", "/export-process", "process"],
  ["Track Quote", "/track", "track"]
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
            {links.map(([label, href, icon]) => (
              <Link className={isActive(pathname, href) ? "active" : ""} href={href} key={href}>
                <MenuIcon name={icon} />
                <span>{label}</span>
              </Link>
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

function MenuIcon({ name }: { name: string }) {
  const paths: Record<string, JSX.Element> = {
    home: <><path d="M4 10.5 12 4l8 6.5" /><path d="M6.5 10v9h11v-9" /><path d="M10 19v-5h4v5" /></>,
    products: <><path d="M4.5 8.5 12 4l7.5 4.5v7L12 20l-7.5-4.5Z" /><path d="M4.8 8.8 12 13l7.2-4.2" /><path d="M12 13v7" /></>,
    about: <><circle cx="12" cy="8" r="3.2" /><path d="M5.8 19a6.4 6.4 0 0 1 12.4 0" /></>,
    docs: <><path d="M7 4h7l3 3v13H7Z" /><path d="M14 4v4h4" /><path d="M9.5 12h5" /><path d="M9.5 15.5h5" /></>,
    process: <><path d="M5 7h10" /><path d="M15 7l-2-2" /><path d="M15 7l-2 2" /><path d="M19 17H9" /><path d="M9 17l2-2" /><path d="M9 17l2 2" /></>,
    track: <><path d="M12 21s6-5.2 6-10.2A6 6 0 0 0 6 10.8C6 15.8 12 21 12 21Z" /><circle cx="12" cy="10.8" r="2.2" /></>
  };

  return (
    <svg className="menu-link-icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
