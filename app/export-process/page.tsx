import Link from "next/link";
import { processSteps } from "@/lib/seed";

export default function ExportProcessPage() {
  return (
    <main className="page band">
      <div className="container grid two">
        <div className="page-title">
          <span className="eyebrow">Export process</span>
          <h1>A visible buyer journey from requirement to readiness</h1>
          <p>The rebuilt process gives buyers confidence by showing how requirements are captured, validated, quoted, and followed up.</p>
          <Link className="btn" href="/contact">Start a Quote</Link>
        </div>
        <div className="process">
          {processSteps.map((step) => <div className="card process-item" key={step}>{step}</div>)}
        </div>
      </div>
    </main>
  );
}
