"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";

export function ProductGrid({ products: providedProducts }: { products?: Product[] }) {
  const [products, setProducts] = useState<Product[]>(providedProducts || []);
  const [loading, setLoading] = useState(!providedProducts);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    if (providedProducts) return;
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
  }, [providedProducts]);

  useEffect(() => {
    const syncVisibleCount = () => {
      setVisibleCount(window.matchMedia("(max-width: 900px)").matches ? 1 : 4);
    };
    syncVisibleCount();
    window.addEventListener("resize", syncVisibleCount);
    return () => window.removeEventListener("resize", syncVisibleCount);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [products.length, visibleCount]);

  useEffect(() => {
    if (products.length <= visibleCount) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % products.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [products.length, visibleCount]);

  if (loading) {
    return <div className="grid four">{[1, 2, 3, 4].map((item) => <div className="card product-card skeleton" key={item} />)}</div>;
  }

  if (!products.length) {
    return <div className="empty-state">No products are published yet. Add products from the admin console after running the Supabase schema.</div>;
  }

  const previous = () => setActiveIndex((index) => index === 0 ? products.length - 1 : index - 1);
  const next = () => setActiveIndex((index) => (index + 1) % products.length);
  const canLoop = products.length > visibleCount;
  const stepPercent = 100 / visibleCount;
  const loopedProducts = canLoop ? [...products, ...products.slice(0, visibleCount)] : products;

  return (
    <div className="product-carousel" aria-label="Products carousel">
      <div className="carousel-controls">
        <button className="action-btn" onClick={previous} aria-label="Previous product">Previous</button>
        <div className="carousel-dots">
          {products.map((product, index) => (
            <button
              aria-label={`Show ${product.name}`}
              className={index === activeIndex ? "active" : ""}
              key={product.id}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
        <button className="action-btn" onClick={next} aria-label="Next product">Next</button>
      </div>
      <div className="carousel-viewport">
        <div className="carousel-track" style={{ transform: `translateX(-${activeIndex * stepPercent}%)` }}>
          {loopedProducts.map((product, index) => (
            <article className="card product-card carousel-slide" key={`${product.id}-${index}`}>
              <div className="product-media">
                <img src={product.image_url} alt={product.name} />
                <span>{product.name}</span>
              </div>
              <div className="body">
                <p>{product.summary}</p>
                <Link className="btn small" href={`/contact?product=${encodeURIComponent(product.name)}`}>Request Quote</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
