"use client";

import Link from "next/link";
import { useState } from "react";

const docs = [
  ["Commercial invoice", "Buyer, seller, product, value, and shipment details arranged for trade review."],
  ["Packing list", "Packaging counts, weights, volumes, and lot details for shipment coordination."],
  ["Product specification", "Quality notes, moisture expectations, grade notes, and buyer-specific product requirements."],
  ["Certificates and permits", "Open the shipment and logistics briefing for document options, inspection support, packaging, and delivery planning."]
];

const flow = [
  "Buyer submits product, volume, destination, and documentation expectations.",
  "EasyHarvest reviews product availability and export-readiness requirements.",
  "Quote thread keeps document notes, responses, and updates in one trackable place.",
  "Shipment documents are aligned with the selected commodity and destination market."
];

const shipmentSections: Array<[string, string[]]> = [
  ["Products we ship", ["Natural white sesame seeds", "Dried hibiscus flower", "Dried ginger", "Raw cashew nuts", "Soybeans", "Groundnuts (peanuts)", "Other agricultural commodities"]],
  ["Export destinations", ["Asia", "Europe", "Middle East", "Africa", "North America"]],
  ["Shipping terms", ["FOB (Free on Board)", "CIF (Cost, Insurance & Freight)", "CFR (Cost & Freight)", "EXW (Ex Works), subject to agreement"]],
  ["Export documentation", ["Commercial invoice", "Packing list", "Bill of lading (B/L)", "Certificate of origin", "Phytosanitary certificate", "Fumigation certificate", "Certificate of analysis (COA)", "Inspection certificates where applicable"]],
  ["Packaging options", ["25kg bags", "50kg PP bags", "Jumbo bags", "Custom packaging, subject to agreement"]]
];

const shipmentSteps: Array<[string, string, string]> = [
  ["01", "Buyer requirement confirmation", "We review product specification, quantity, packaging, destination port, and commercial terms."],
  ["02", "Product sourcing and quality control", "Products are sourced through trusted suppliers and prepared to the agreed specification."],
  ["03", "Inspection and documentation", "Where required, third-party inspections such as SGS or Bureau Veritas can be arranged."],
  ["04", "Container loading", "Goods are packed and loaded under agreed export standards."],
  ["05", "Ocean freight and delivery", "Shipments move through major Nigerian ports to the buyer's destination."]
];

export default function DocumentationPage() {
  const [shipmentOpen, setShipmentOpen] = useState(false);

  return (
    <main className="page">
      <section className="doc-hero">
        <div className="container doc-hero-grid">
          <div>
            <span className="eyebrow">Documentation & Certificates</span>
            <h1>Export paperwork presented with clarity before shipment decisions</h1>
            <p>Documentation needs differ by product, destination, and buyer requirements. EasyHarvest collects those details through the quote workflow and keeps follow-up visible in the quote thread.</p>
          </div>
          <div className="doc-stack">
            <div>Commercial Invoice</div>
            <div>Packing List</div>
            <div>Product Specification</div>
            <button className="doc-stack-button" onClick={() => setShipmentOpen(true)} type="button">
              <span>Certificates</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13" /><path d="m13 6 6 6-6 6" /></svg>
            </button>
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
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                  {title === "Certificates and permits" ? <button className="doc-detail-trigger" onClick={() => setShipmentOpen(true)} type="button">Explore shipment details</button> : null}
                </div>
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
            <p>The website keeps requests, responses, and document notes connected to the buyer's tracking code.</p>
          </div>
          <div className="doc-flow">
            {flow.map((item) => <div className="card process-item" key={item}>{item}</div>)}
          </div>
        </div>
      </section>

      {shipmentOpen ? (
        <div className="modal-backdrop shipment-modal-backdrop" onClick={() => setShipmentOpen(false)} role="dialog" aria-modal="true" aria-label="Shipment and logistics details">
          <section className="shipment-modal" onClick={(event) => event.stopPropagation()}>
            <header className="shipment-modal-hero">
              <div><span className="eyebrow">Shipments and logistics</span><h2>Reliable export shipments from Nigeria to global markets</h2><p>We coordinate agricultural commodity shipments with clear documentation, agreed quality standards, and responsive buyer follow-up.</p></div>
              <button className="shipment-close" onClick={() => setShipmentOpen(false)} type="button" aria-label="Close shipment details">Close</button>
            </header>
            <div className="shipment-modal-body">
              <div className="shipment-intro"><strong>Ready for a tailored shipment plan?</strong><p>Tell us the commodity, quantity, destination port, packaging preference, and trade terms you have in mind.</p><Link className="btn gold" href="/contact">Request a Shipment Quote</Link></div>
              <div className="shipment-sections">{shipmentSections.map(([heading, items]) => <section className="shipment-section" key={heading}><h3>{heading}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>)}</div>
              <section className="shipment-process"><div><span className="eyebrow">Shipment process</span><h3>From buyer requirement to delivery</h3></div><div className="shipment-steps">{shipmentSteps.map(([number, title, text]) => <article key={number}><span>{number}</span><div><strong>{title}</strong><p>{text}</p></div></article>)}</div></section>
              <div className="shipment-footer"><div><strong>Why choose EasyHarvest Exports?</strong><p>Reliable supplier network, quality-focused sourcing, documentation support, flexible shipping terms, professional customer service, and global market experience.</p></div><div><a href="mailto:sales@easyharvestexports.com">sales@easyharvestexports.com</a><a href="https://wa.me/2348144901120" target="_blank" rel="noreferrer">WhatsApp +234 814 490 1120</a></div></div>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
