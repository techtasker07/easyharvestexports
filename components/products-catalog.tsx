"use client";

import { useEffect, useState } from "react";
import { ProductGrid } from "@/components/product-grid";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";

export function ProductsCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      if (!supabase) {
        setProducts([]);
        setLoading(false);
        return;
      }
      const { data } = await supabase.from("products").select("*").eq("active", true).order("created_at", { ascending: false });
      setProducts((data || []) as Product[]);
      setLoading(false);
    }
    loadProducts();
  }, []);

  return (
    <>
      {loading ? <div className="grid four">{[1, 2, 3, 4].map((item) => <div className="card product-card skeleton" key={item} />)}</div> : <ProductGrid products={products} />}
      {!loading && products.length ? (
        <section className="export-notes">
          <div className="export-notes-head">
            <div>
              <span className="eyebrow">Export notes</span>
              <h2>Commodity intelligence for buyer decisions</h2>
            </div>
            <p>Each product carries sourcing notes, handling signals, and export-readiness details so buyers can compare requirements quickly.</p>
          </div>
          <div className="grid two product-detail-grid">
            {products.map((product, index) => (
              <article className="card product-detail-card" key={product.id}>
                <div className="product-detail-media">
                  <img src={product.image_url} alt={product.name} />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="product-detail-body">
                  <div className="product-detail-top">
                    <span className="badge">Export ready</span>
                    <span className="badge">Nigeria sourced</span>
                  </div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="spec-cloud">
                    {(product.specs || []).map((spec) => <span key={spec}>{spec}</span>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
