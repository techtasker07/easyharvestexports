import Link from "next/link";

const sections = [
  ["Company information", "EasyHarvest Exports is a division of DAMAL PRIME SOLUTIONS LTD, operating from 73 Olaiya Street, Mafoluku, Oshodi, Lagos, Nigeria. You can reach the team at sales@easyharvestexports.com or through the website buyer desk."],
  ["Website use", "Use this website for lawful business purposes only. Website content may not be misused, copied, or distributed without permission. Product images are for reference; specifications, availability, and prices may change."],
  ["Products, quotations, and orders", "Final product terms are confirmed through quotations, contracts, or proforma invoices. Quotes are non-binding unless confirmed in writing. Orders remain subject to product availability and mutual agreement, while trade terms such as FOB or CIF are agreed separately for each transaction."],
  ["Payment and shipment", "Payment conditions are agreed for each transaction and may include TT, LC, or another mutually agreed method. Production or shipment can begin only after the agreed payment conditions are met. Buyers are responsible for meeting import regulations in their destination country."],
  ["Privacy and information we collect", "When you contact us, request a quote, track a request, use the assistant, or interact with the website, we may collect information you provide such as your name, company, email, phone number, country, product requirements, and business inquiry details. We may also collect limited technical usage data such as page visits and time spent, to improve website performance and support."],
  ["How information is used and shared", "Information may be used to respond to inquiries, prepare quotations, provide product information, process business communications, improve services, send relevant business updates, and comply with legal or regulatory duties. EasyHarvest does not sell, rent, or trade personal information. Information may be shared only when needed to fulfil a business request, comply with law, or support export, shipping, inspection, or documentation related to a transaction."],
  ["Security, cookies, and your rights", "Reasonable measures are used to protect personal information, though no online transmission or storage system is completely secure. The website may use cookies and analytics to improve experience and understand visitor behaviour; you may disable cookies through your browser settings. You may request access to, correction of, or deletion of your personal information where legally permitted, or withdraw consent for future communications."],
  ["Third-party links and intellectual property", "Third-party websites linked from this website have their own content and privacy practices. EasyHarvest is not responsible for them. Unless stated otherwise, the EasyHarvest name, logo, text, photographs, and other website content belong to EasyHarvest Exports and may not be used without permission."],
  ["Liability and governing law", "Website information is provided in good faith without a guarantee of completeness or accuracy, and EasyHarvest is not liable for indirect loss arising from website use. These terms are governed by the laws of the Federal Republic of Nigeria. This page may be updated, and the current version will be posted here."],
];

export default function PrivacyTermsPage() {
  return (
    <main className="page legal-page">
      <section className="legal-hero">
        <div className="container legal-hero-inner">
          <span className="eyebrow">Buyer confidence</span>
          <h1>Privacy, terms, and responsible trade guidance</h1>
          <p>Clear expectations for website use, quote requests, buyer information, documentation, and international trade conversations with EasyHarvest Exports.</p>
          <div className="legal-actions">
            <Link className="btn gold" href="/contact">Request a Quote</Link>
            <a className="btn secondary inverse" href="mailto:sales@easyharvestexports.com">Contact Sales</a>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="container legal-layout">
          <aside className="legal-summary">
            <span className="eyebrow">EasyHarvest Exports</span>
            <h2>Trade clarity, buyer privacy, and better follow-up.</h2>
            <p>Questions about a quote, your details, documentation, or website use can be sent to sales@easyharvestexports.com.</p>
            <a className="legal-whatsapp" href="https://wa.me/2348144901120" target="_blank" rel="noreferrer">WhatsApp +234 814 490 1120</a>
          </aside>
          <div className="legal-sections">
            {sections.map(([heading, body], index) => (
              <article className="legal-section" key={heading}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h2>{heading}</h2><p>{body}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
