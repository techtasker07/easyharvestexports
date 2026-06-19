"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { recordActivity } from "@/lib/activity";
import type { Quote, QuoteMessage } from "@/lib/types";

export function TrackQuote() {
  const search = useSearchParams();
  const [code, setCode] = useState(search.get("code") || "");
  const [email, setEmail] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [messages, setMessages] = useState<QuoteMessage[]>([]);
  const [reply, setReply] = useState("");
  const [notice, setNotice] = useState("");

  async function lookup(event?: React.FormEvent) {
    event?.preventDefault();
    setNotice("");
    if (!supabase) {
      setNotice("Supabase is not connected yet. Add the schema and deploy environment variables to enable live tracking.");
      return;
    }
    const { data, error } = await supabase.from("quotes").select("*").eq("tracking_code", code.trim()).maybeSingle();
    if (error || !data || (email && data.email.toLowerCase() !== email.toLowerCase())) {
      setQuote(null);
      setMessages([]);
      setNotice("No quote found for that tracking code and email.");
      return;
    }
    setQuote(data as Quote);
    const { data: rows } = await supabase.from("quote_messages").select("*").eq("quote_id", data.id).order("created_at", { ascending: true });
    setMessages((rows || []) as QuoteMessage[]);
    void recordActivity("quote_tracked", "Quote tracking code checked");
  }

  async function sendReply() {
    if (!reply || !quote) return;
    const optimistic: QuoteMessage = { id: crypto.randomUUID(), quote_id: quote.id, sender_name: quote.buyer_name, sender_role: "buyer", message: reply, created_at: new Date().toISOString() };
    setMessages((prev) => [...prev, optimistic]);
    setReply("");
    if (supabase) {
      await supabase.from("quote_messages").insert({ quote_id: quote.id, sender_name: quote.buyer_name, sender_role: "buyer", message: optimistic.message });
    }
    void recordActivity("quote_reply", "Buyer replied to a quote", { quote_id: quote.id });
  }

  return (
    <div className="grid two">
      <form className="card form-panel form-grid" onSubmit={lookup}>
        <h3>Track a submitted quote</h3>
        <input className="input" required placeholder="Tracking code, e.g. EHX-123ABC" value={code} onChange={(event) => setCode(event.target.value)} />
        <input className="input" type="email" placeholder="Email address for extra privacy" value={email} onChange={(event) => setEmail(event.target.value)} />
        <button className="btn">Check Status</button>
        {notice ? <div className="notice">{notice}</div> : null}
      </form>
      <div className="card form-panel">
        {quote ? (
          <>
            <span className="badge">{quote.status}</span>
            <h3>{quote.product_interest}</h3>
            <p>{quote.quantity} to {quote.destination}</p>
            <div className="comments">
              {messages.map((message) => (
                <div className="comment" key={message.id}>
                  <strong>{message.sender_name} · {message.sender_role}</strong>
                  <p>{message.message}</p>
                </div>
              ))}
            </div>
            <textarea className="textarea" placeholder="Reply to the export team" value={reply} onChange={(event) => setReply(event.target.value)} />
            <button className="btn small" onClick={sendReply}>Send Reply</button>
          </>
        ) : (
          <>
            <span className="eyebrow">Follow-up workspace</span>
            <h3>Quote responses appear here</h3>
            <p>Buyers can see status updates, admin replies, and continue the conversation without starting over on WhatsApp or email.</p>
          </>
        )}
      </div>
    </div>
  );
}
