import type { Post, Product } from "@/lib/types";

export const products: Product[] = [
  {
    id: "hibiscus",
    slug: "dried-hibiscus",
    name: "Dried Hibiscus",
    summary: "Deep red, export-ready hibiscus flowers sorted for color, aroma, and consistent moisture.",
    description: "Sourced from Nigerian growing clusters and prepared for beverage, food, and wellness buyers that need clean, dependable batches.",
    image_url: "/products/hibiscus.webp",
    specs: ["Whole dried petals", "Moisture-controlled", "Bulk export packaging", "Documentation support"],
    active: true
  },
  {
    id: "ginger",
    slug: "dried-ginger",
    name: "Dried Ginger",
    summary: "Split or whole ginger with strong aroma, careful handling, and reliable shipment preparation.",
    description: "Prepared for spice processors, distributors, and industrial buyers seeking pungency, cleanliness, and traceable sourcing.",
    image_url: "/products/ginger.jpeg",
    specs: ["Split or whole", "Fresh and dried options", "Sorted for defects", "Container-ready supply"],
    active: true
  },
  {
    id: "sesame",
    slug: "sesame-seeds",
    name: "Sesame Seeds",
    summary: "Natural or hulled sesame seed supply for global buyers that need purity and steady fulfillment.",
    description: "Quality-checked sesame sourced through verified partners and prepared for international food and oilseed markets.",
    image_url: "/products/sesame.jpg",
    specs: ["Natural or hulled", "Purity checks", "Export documentation", "Flexible lot sizes"],
    active: true
  },
  {
    id: "cocoa",
    slug: "cocoa-beans",
    name: "Cocoa Beans",
    summary: "Dried and fermented cocoa beans selected for flavor, quality, and export readiness.",
    description: "Built for cocoa processors and buyers who need a responsive Nigerian supply partner with shipment coordination.",
    image_url: "/products/cocoa.webp",
    specs: ["Dried or fermented", "Bagged lots", "Quality inspection", "Shipment support"],
    active: true
  }
];

export const posts: Post[] = [
  {
    id: "market-note",
    title: "New hibiscus lots are being prepared for export buyers",
    body: "Our sourcing team is validating color, dryness, and handling quality for the next hibiscus batch. Buyers can request destination-specific quotes and documentation guidance.",
    image_url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
    cta_label: "Request hibiscus quote",
    cta_url: "/contact"
  },
  {
    id: "buyer-update",
    title: "How we keep international buyers updated after a quote",
    body: "Every submitted quote receives a tracking code. Buyers can return to the website, check response status, and continue the conversation with the export team.",
    image_url: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=1200&q=80",
    cta_label: "Track a quote",
    cta_url: "/track"
  }
];

export const processSteps = [
  "Confirm product requirement, quantity, Incoterms, and destination market.",
  "Source, inspect, and reserve suitable commodity batches from verified partners.",
  "Prepare export documentation, packaging plan, and shipment coordination details.",
  "Send updates through the quote thread until the buyer is ready to proceed."
];
