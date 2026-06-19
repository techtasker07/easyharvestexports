import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-logo"><img src="/easyharvest-logo.webp" alt="EasyHarvest Exports" /></div>
          <p>DAMAL PRIME SOLUTIONS LTD. Nigerian agro commodity sourcing, documentation support, and buyer follow-up built for international trade.</p>
        </div>
        <div>
          <strong>Company</strong>
          <p><Link href="/about">About</Link><br /><Link href="/products">Products</Link><br /><Link href="/contact">Request quote</Link></p>
        </div>
        <div>
          <strong>Buyer desk</strong>
          <p><Link href="/track">Track quote</Link><br /><Link href="/documentation">Documentation</Link><br /><Link href="/export-process">Export process</Link><br /><Link href="/privacy-terms">Privacy and terms</Link></p>
        </div>
        <div>
          <strong>Contact</strong>
          <p><a href="mailto:sales@easyharvestexports.com">sales@easyharvestexports.com</a><br /><a href="https://wa.me/" target="_blank">WhatsApp</a></p>
        </div>
      </div>
    </footer>
  );
}
