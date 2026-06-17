import { ProductsCatalog } from "@/components/products-catalog";

export default function ProductsPage() {
  return (
    <main className="page band">
      <div className="container">
        <div className="page-title">
          <span className="eyebrow">Products</span>
          <h1>Nigerian agro commodities prepared for export buyers</h1>
          <p>Explore active products, review export-use notes, and request a quote for the volume and destination market you need.</p>
        </div>
        <ProductsCatalog />
      </div>
    </main>
  );
}
