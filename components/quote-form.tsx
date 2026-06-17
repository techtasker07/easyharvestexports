"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase, trackingCode } from "@/lib/supabase";
import type { Product } from "@/lib/types";

export function QuoteForm() {
  const search = useSearchParams();
  const [savedCode, setSavedCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    buyer_name: "",
    email: "",
    contact_number: "",
    company: "",
    product_interest: search.get("product") || "",
    quantity: "",
    destination: "",
    message: ""
  });

  useEffect(() => {
    async function loadProducts() {
      if (!supabase) return;
      const { data } = await supabase.from("products").select("id,name").eq("active", true).order("name", { ascending: true });
      const rows = (data || []) as Product[];
      setProducts(rows);
      if (!form.product_interest && rows.length) {
        setForm((current) => ({ ...current, product_interest: rows[0].name }));
      }
    }
    loadProducts();
  }, [form.product_interest]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const code = trackingCode();
    const payload = { ...form, tracking_code: code, status: "submitted" };
    if (supabase) {
      const { error } = await supabase.from("quotes").insert(payload);
      if (error) {
        alert(error.message);
        setBusy(false);
        return;
      }
    }
    setSavedCode(code);
    setBusy(false);
  }

  if (savedCode) {
    return (
      <div className="card form-panel">
        <span className="eyebrow">Quote submitted</span>
        <h3>Your tracking code is {savedCode}</h3>
        <p>Keep this code. Use it on the Track Quote page to view responses and reply to the EasyHarvest team.</p>
        <a className="btn" href={`/track?code=${savedCode}`}>Track Quote</a>
      </div>
    );
  }

  return (
    <form className="card form-panel form-grid" onSubmit={submit}>
      <h3>Request an export quotation</h3>
      <div className="grid two">
        <input className="input" required placeholder="Full name" value={form.buyer_name} onChange={(event) => setForm({ ...form, buyer_name: event.target.value })} />
        <input className="input" required type="email" placeholder="Email address" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
      </div>
      <div className="grid two">
        <input className="input" required placeholder="WhatsApp / contact number" value={form.contact_number} onChange={(event) => setForm({ ...form, contact_number: event.target.value })} />
        <input className="input" placeholder="Company" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} />
      </div>
      <div className="grid two">
        <select className="select" required value={form.product_interest} onChange={(event) => setForm({ ...form, product_interest: event.target.value })}>
          <option value="" disabled>{products.length ? "Select product of interest" : "No products available yet"}</option>
          {products.map((product) => <option key={product.id} value={product.name}>{product.name}</option>)}
        </select>
        <input className="input" required placeholder="Quantity / volume" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} />
      </div>
      <div className="grid two">
        <input className="input" required placeholder="Destination country/port" value={form.destination} onChange={(event) => setForm({ ...form, destination: event.target.value })} />
      </div>
      <textarea className="textarea" required placeholder="Tell us your specification, timeline, documentation needs, and preferred shipping terms." value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
      <button className="btn" disabled={busy}>{busy ? "Submitting..." : "Submit Quote"}</button>
    </form>
  );
}
