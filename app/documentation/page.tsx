const docs = [
  ["Commercial invoice", "Buyer, seller, product, value, and shipment details arranged for trade review."],
  ["Packing list", "Packaging counts, weights, volumes, and lot details for shipment coordination."],
  ["Product specification", "Quality notes, moisture expectations, grade notes, and buyer-specific product requirements."],
  ["Certificates and permits", "Destination-dependent certificates, inspection notes, or regulatory documents where required."]
];

const flow = [
  "Buyer submits product, volume, destination, and documentation expectations.",
  "EasyHarvest reviews product availability and export-readiness requirements.",
  "Quote thread keeps document notes, responses, and updates in one trackable place.",
  "Shipment documents are aligned with the selected commodity and destination market."
];

export default function DocumentationPage() {
  return (
    <main className="page">
      <section className="doc-hero">
        <div className="container doc-hero-grid">
          <div>
            <span className="eyebrow">Documentation</span>
            <h1>Export paperwork presented with clarity before shipment decisions</h1>
            <p>Documentation needs differ by product, destination, and buyer requirements. EasyHarvest collects those details through the quote workflow and keeps follow-up visible in the quote thread.</p>
          </div>
          <div className="doc-stack">
            <div>Commercial Invoice</div>
            <div>Packing List</div>
            <div>Product Specification</div>
            <div>Certificates</div>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="container doc-layout">
          <div className="doc-panel">
            <span className="eyebrow">Document set</span>
            <h2>Core export documents buyers commonly request</h2>
            <p>Each document is treated as part of the quote conversation rather than hidden behind informal messages.</p>
          </div>
          <div className="doc-cards">
            {docs.map(([title, body], index) => (
              <article className="card doc-card" key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band doc-flow-band">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Workflow</span>
              <h2>How documentation support fits into quote follow-up</h2>
            </div>
            <p>The website keeps requests, responses, and document notes connected to the buyer’s tracking code.</p>
          </div>
          <div className="doc-flow">
            {flow.map((item) => <div className="card process-item" key={item}>{item}</div>)}
          </div>
        </div>
      </section>
    </main>
  );
}
