import { Suspense } from "react";
import { TrackQuote } from "@/components/track-quote";

export default function TrackPage() {
  return (
    <main className="page band">
      <div className="container">
        <div className="page-title">
          <span className="eyebrow">Track quote</span>
          <h1>Follow up on submitted quotes and continue the conversation</h1>
          <p>Buyers can check response status, read admin replies, and send additional details from the quote thread.</p>
        </div>
        <Suspense fallback={<div className="card form-panel">Loading tracker...</div>}>
          <TrackQuote />
        </Suspense>
      </div>
    </main>
  );
}
