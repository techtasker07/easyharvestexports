import { Suspense } from "react";
import { QuoteForm } from "@/components/quote-form";

export default function ContactPage() {
  return (
    <main className="page band">
      <div className="container grid two">
        <div className="page-title">
          <span className="eyebrow">Request quote</span>
          <h1>Tell EasyHarvest what you need and track the response</h1>
          <p>Submit product, volume, destination, and shipment notes. The system gives you a tracking code so you can follow up without losing context.</p>
        </div>
        <Suspense fallback={<div className="card form-panel">Loading quote form...</div>}>
          <QuoteForm />
        </Suspense>
      </div>
    </main>
  );
}
