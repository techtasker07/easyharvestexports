import Link from "next/link";
import { PostFeed } from "@/components/post-feed";
import { processSteps } from "@/lib/seed";

export default function Home() {
  return (
    <main className="page">
      <section className="hero">
        <div className="container hero-shell">
          <div className="hero-copy">
            <span className="eyebrow">Quality Global Sourcing</span>
            <h1>Premium agro commodities exported from Nigeria to the world</h1>
            <p>EasyHarvest Exports helps international buyers source hibiscus, ginger, sesame, cocoa, and other Nigerian agricultural products with a clearer quote process, richer product visibility, and responsive follow-up.</p>
            <div className="hero-actions">
              <Link className="btn gold" href="/contact">Request Quote</Link>
              <Link className="btn secondary inverse" href="/track">Track Existing Quote</Link>
            </div>
            <div className="hero-trust">
              <span>Product sourcing</span>
              <span>Export documentation</span>
              <span>Buyer response tracking</span>
            </div>
          </div>
          <div className="hero-visual" aria-label="EasyHarvest export showcase">
            <div className="hero-logo-panel">
              <img src="/easyharvest-logo.webp" alt="EasyHarvest Exports" />
            </div>
            <div className="harvest-board">
              <span style={{ backgroundImage: "linear-gradient(160deg, rgba(7, 91, 57, .64), rgba(199, 154, 45, .72)), url('/products/hibiscus.webp')" }}>Hibiscus</span>
              <span style={{ backgroundImage: "linear-gradient(160deg, rgba(7, 91, 57, .64), rgba(199, 154, 45, .72)), url('/products/ginger.jpeg')" }}>Ginger</span>
              <span style={{ backgroundImage: "linear-gradient(160deg, rgba(7, 91, 57, .64), rgba(199, 154, 45, .72)), url('/products/sesame.jpg')" }}>Sesame</span>
              <span style={{ backgroundImage: "linear-gradient(160deg, rgba(7, 91, 57, .64), rgba(199, 154, 45, .72)), url('/products/cocoa.webp')" }}>Cocoa</span>
            </div>
          </div>
        </div>
      </section>

      <section className="band updates-band">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Interactive updates</span>
              <h2>Posts buyers can react to, comment on, and share</h2>
            </div>
            <p>The owner can publish market notes, product updates, shipment readiness posts, and campaign announcements from the admin console.</p>
          </div>
          <PostFeed />
        </div>
      </section>

      <section className="band">
        <div className="container grid two">
          <div className="workflow-copy">
            <span className="eyebrow">Export workflow</span>
            <h2>Clear steps from quote to shipment readiness</h2>
            <p>Buyers do not have to guess what happens next. The process is visible, trackable, and designed for continuous follow-up.</p>
            <Link className="btn" href="/export-process">View Process</Link>
          </div>
          <div className="process">
            {processSteps.map((step) => <div className="card process-item" key={step}>{step}</div>)}
          </div>
        </div>
      </section>
    </main>
  );
}
