const values = [
  ["Quality-first sourcing", "Products are positioned around buyer specifications, export-readiness, and reliable commodity preparation.", "/about/quality-first-sourcing.webp"],
  ["Transparent follow-up", "Every quote can be tracked so buyers and the EasyHarvest team keep the full conversation in one place.", "/about/transparent-follow-up.webp"],
  ["Nigeria to global markets", "The platform presents Nigerian agro commodities with the clarity expected by international buyers.", "/about/nigeria-global-markets.jpg"]
];

const metrics = [
  ["4+", "Core commodity categories"],
  ["24/7", "Quote tracking access"],
  ["100%", "Buyer-focused workflow"]
];

export default function AboutPage() {
  return (
    <main className="page">
      <section className="about-hero">
        <div className="container about-hero-grid">
          <div>
            <span className="eyebrow">About EasyHarvest</span>
            <h1>Built as a modern export desk for trustworthy Nigerian sourcing</h1>
            <p>EasyHarvest Exports is the export-facing platform for DAMAL PRIME SOLUTIONS LTD, designed to help buyers inspect products, request quotes, track responses, and keep trade conversations organized.</p>
          </div>
          <div className="about-visual">
            <img src="/easyharvest-logo.webp" alt="EasyHarvest Exports" />
            <div className="about-visual-band">
              <span>Commodity visibility</span>
              <span>Buyer communication</span>
              <span>Export support</span>
            </div>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="container">
          <div className="about-metrics">
            {metrics.map(([value, label]) => (
              <div className="metric-card" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="about-story">
            <div>
              <span className="eyebrow">Operating model</span>
              <h2>From a static brochure to a working buyer-support system</h2>
            </div>
            <p>The rebuild turns the website into a practical export workspace. Buyers can react to updates, ask questions through comments, submit quote requests, and return with a tracking code to continue the conversation.</p>
          </div>

          <div className="grid three">
            {values.map(([title, body, image]) => (
              <article className="card value-card" key={title}>
                <div className="value-image">
                  <img src={image} alt={title} />
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
