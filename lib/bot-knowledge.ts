export type BotIntent = {
  id: string;
  category: string;
  trainingPhrases: string[];
  response: string;
  quickReplies: string[];
  route?: string;
};

export type BotReply = Pick<BotIntent, "id" | "response" | "quickReplies" | "route">;

// Enhanced from the supplied EasyHarvest FAQ dataset. Responses avoid live-price
// promises and make final trade terms subject to quotation and written confirmation.
export const botKnowledge: BotIntent[] = [
  {
    id: "welcome.start",
    category: "greeting",
    trainingPhrases: ["hello", "hi", "good morning", "good afternoon", "help", "can you assist me", "what can you do"],
    response: "Welcome to EasyHarvest Exports. I can help you explore Nigerian agro commodities, prepare a quote request, track an existing quote, understand export documentation, or point you to the right page.",
    quickReplies: ["View products", "Request a quote", "Track my quote", "Export documents"]
  },
  {
    id: "company.about",
    category: "company",
    trainingPhrases: ["what is easyharvest", "who are you", "about easyharvest", "company information", "is this a Nigerian export company"],
    response: "EasyHarvest Exports is the export-facing platform for DAMAL PRIME SOLUTIONS LTD. It helps international buyers review commodity options, request quotes, follow discussions, and plan documentation with the export team.",
    quickReplies: ["View products", "Export process", "Talk to sales"],
    route: "/about"
  },
  {
    id: "products.overview",
    category: "products",
    trainingPhrases: ["what products do you export", "what can i buy", "available commodities", "list products", "agro products", "view products"],
    response: "EasyHarvest focuses on Nigerian agro commodities such as hibiscus, ginger, sesame, cocoa, and active products listed in the catalog. Availability, grade, packaging, and pricing are confirmed against your actual request.",
    quickReplies: ["Hibiscus", "Ginger", "Sesame", "Cocoa", "Request a quote"],
    route: "/products"
  },
  {
    id: "quote.start",
    category: "quote",
    trainingPhrases: ["request a quote", "i need a quote", "send quotation", "i want to buy", "how much is", "request price", "open quote form"],
    response: "For a useful quote, share the product, required quantity, destination country or port, preferred Incoterms if known, packaging preference, quality expectations, and any documents or certificates you require. Final terms are confirmed in writing.",
    quickReplies: ["Open quote form", "What are Incoterms?", "Required documents"],
    route: "/contact"
  },
  {
    id: "quote.track",
    category: "tracking",
    trainingPhrases: ["track my quote", "track quote", "quote status", "where is my quotation", "follow up on quote", "open tracker"],
    response: "Use your EasyHarvest tracking code to view the quote status, read the team's response, and continue the conversation in the same thread. If you lost the code, contact sales with the details used for your request.",
    quickReplies: ["Open tracker", "I lost my code", "Talk to sales"],
    route: "/track"
  },
  {
    id: "quote.lost_code",
    category: "support",
    trainingPhrases: ["lost my code", "forgot tracking code", "cannot find my code", "no tracking code"],
    response: "Please contact the EasyHarvest team with the email or WhatsApp number used for the request, the product, and the approximate date submitted. The team can help locate the correct quote thread.",
    quickReplies: ["Talk to sales", "Request a quote"],
    route: "/contact"
  },
  {
    id: "documentation.overview",
    category: "documentation",
    trainingPhrases: ["export documents", "what documents", "documentation", "commercial invoice", "packing list", "certificates", "required documents"],
    response: "Export documents can include a commercial invoice, packing list, product specification, and destination-dependent certificates or permits. The final document set depends on the product, buyer requirements, destination rules, and agreed contract terms.",
    quickReplies: ["Documentation page", "Request a quote", "Certificate guidance"],
    route: "/documentation"
  },
  {
    id: "incoterms.explain",
    category: "trade_help",
    trainingPhrases: ["what are incoterms", "FOB", "CIF", "which incoterm", "incoterm meaning"],
    response: "Incoterms explain where responsibilities for cost, risk, and logistics transfer between buyer and seller. If you already have a preference such as FOB or CIF, include it in your quote request. Otherwise, share the destination and shipment expectations for discussion with the team.",
    quickReplies: ["Request a quote", "Export process", "Talk to sales"],
    route: "/contact"
  },
  {
    id: "pricing.live_price",
    category: "pricing",
    trainingPhrases: ["price", "cost", "price list", "price per ton", "how much", "current price"],
    response: "Commodity pricing changes with grade, season, quantity, packaging, destination, Incoterms, and document requirements. I cannot give a reliable generic price here. Send your request and the team can prepare a considered quotation.",
    quickReplies: ["Request a quote", "Quote details needed", "View products"],
    route: "/contact"
  },
  {
    id: "availability.stock",
    category: "availability",
    trainingPhrases: ["is it available", "do you have stock", "available quantity", "supply now", "shipment readiness"],
    response: "Availability is reviewed against the commodity, quantity, quality expectation, and timing. Share those details with the buyer desk so sourcing and inspection options can be assessed properly.",
    quickReplies: ["Request a quote", "View products", "Talk to sales"],
    route: "/contact"
  },
  {
    id: "shipping.destination",
    category: "shipping",
    trainingPhrases: ["ship to my country", "international delivery", "ship to dubai", "ship to europe", "destination market", "shipping"],
    response: "International shipment planning depends on the commodity, destination, Incoterms, documentation, and logistics feasibility. Add your destination country or port to the quote request for a proper review.",
    quickReplies: ["Request a quote", "Export process", "Documentation page"],
    route: "/contact"
  },
  {
    id: "packaging.ask",
    category: "packaging",
    trainingPhrases: ["packaging", "25kg bags", "how are goods packed", "packing options", "packaging preference"],
    response: "Packaging depends on the product, buyer requirements, destination, and shipment plan. Include your preferred bag, carton, labeling, or pallet requirement in the quote request so it is reviewed with the commodity details.",
    quickReplies: ["Request a quote", "Packing list", "View products"],
    route: "/contact"
  },
  {
    id: "quality.inspection",
    category: "quality",
    trainingPhrases: ["quality", "inspection", "moisture", "grade", "specification", "quality control"],
    response: "Quality expectations should be stated clearly in your request, including grade, moisture, cleanliness, sorting, or buyer-specific specifications. The team will review these before confirming any final commercial terms.",
    quickReplies: ["Request a quote", "Documentation page", "View products"],
    route: "/contact"
  },
  {
    id: "payment.ask",
    category: "payment",
    trainingPhrases: ["payment", "pay", "TT", "LC", "letter of credit", "payment terms"],
    response: "Payment terms are agreed per transaction. Depending on the deal, accepted methods may include TT, LC, or another mutually agreed method. Production or shipment can only proceed after agreed payment conditions are met.",
    quickReplies: ["Request a quote", "Terms and privacy", "Talk to sales"],
    route: "/privacy-terms"
  },
  {
    id: "sample.ask",
    category: "buyer_advice",
    trainingPhrases: ["sample", "can i get a sample", "test sample", "product sample"],
    response: "For sample requests, tell the team the product, specification, intended test, destination, and timeline. Sample availability and shipment arrangements depend on the product and the agreed buyer process.",
    quickReplies: ["Request a quote", "Talk to sales", "View products"],
    route: "/contact"
  },
  {
    id: "terms.privacy",
    category: "policy",
    trainingPhrases: ["privacy", "terms", "data protection", "cookies", "delete my data", "website policy"],
    response: "EasyHarvest uses the information you submit to respond to inquiries, prepare quotes, and support business communications. It does not sell, rent, or trade personal information. You can request access, correction, deletion where permitted, or withdrawal from future communications.",
    quickReplies: ["Open terms and privacy", "Contact sales"],
    route: "/privacy-terms"
  },
  {
    id: "human.support",
    category: "support",
    trainingPhrases: ["talk to sales", "human agent", "speak to someone", "contact", "whatsapp", "complaint", "no response"],
    response: "The buyer desk can help with a product request, quote follow-up, documentation question, or concern. Use the quote form for a structured request or contact the team directly with your product and destination details.",
    quickReplies: ["Request a quote", "Track my quote", "Terms and privacy"],
    route: "/contact"
  },
  {
    id: "fallback.guidance",
    category: "fallback",
    trainingPhrases: [],
    response: "I can guide you on products, quote requests, tracking, export documents, shipping preparation, and EasyHarvest policies. For a request specific to your business, use the quote form and the team will review the details.",
    quickReplies: ["View products", "Request a quote", "Track my quote", "Talk to sales"],
    route: "/contact"
  }
];

export function findBotReply(message: string, productNames: string[] = []): BotReply {
  const normalized = message.toLowerCase().trim();
  const humanReply = findHumanReply(normalized);
  if (humanReply) return humanReply;

  const dynamicProduct = productNames.find((name) => normalized.includes(name.toLowerCase()));
  if (dynamicProduct) {
    return {
      id: `product.${dynamicProduct.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      response: `${dynamicProduct} is listed in the EasyHarvest catalog. For availability, specification, packaging, destination planning, and a current commercial quote, share your quantity and destination with the buyer desk.`,
      quickReplies: ["View products", "Request a quote", "Required documents"],
      route: "/contact"
    };
  }

  const inputWords = wordSet(normalized);
  const score = (intent: BotIntent) => intent.trainingPhrases.reduce((total, phrase) => {
    if (!phrase) return total;
    if (normalized.includes(phrase)) return total + Math.max(7, phrase.split(" ").length + 4);
    const phraseWords = wordSet(phrase);
    const matchedWords = phraseWords.filter((word) => inputWords.includes(word)).length;
    const enoughContext = phraseWords.length > 1 && matchedWords >= Math.ceil(phraseWords.length * .7);
    return enoughContext ? total + matchedWords : total;
  }, 0);

  const best = botKnowledge.slice(0, -1).map((intent) => ({ intent, score: score(intent) })).sort((a, b) => b.score - a.score)[0];
  const intent = best && best.score >= 2 ? best.intent : botKnowledge[botKnowledge.length - 1];
  return { id: intent.id, response: intent.response, quickReplies: intent.quickReplies, route: intent.route };
}

function findHumanReply(message: string): BotReply | null {
  if (includesAny(message, ["what can you suggest", "what do you suggest", "suggest something", "can you advise", "i need advice", "what should i do", "recommend something"])) {
    return {
      id: "personal.suggestion",
      response: "Absolutely. If you are exploring EasyHarvest for the first time, I suggest keeping the next step simple: choose the product you are interested in, estimate the quantity you need, and note your destination country or port. From there, the team can give you a much more useful response. Are you choosing a product, preparing a quote, or following up on one?",
      quickReplies: ["View products", "Request a quote", "Track my quote", "Talk to sales"],
      route: "/products"
    };
  }

  if (includesAny(message, ["compare products", "which product", "better product", "hibiscus or ginger", "sesame or cocoa", "help me choose"])) {
    return {
      id: "buyer.product_comparison",
      response: "I can help you narrow it down. The best option depends on what you are buying for, the specification you need, your quantity, and your destination market. Hibiscus is often considered for beverage and wellness uses, ginger for spice and food processing, sesame for food or oilseed supply, and cocoa for processing. Tell me what you plan to use it for and where it is going, and I will suggest a sensible next step.",
      quickReplies: ["Hibiscus", "Ginger", "Sesame", "Cocoa"],
      route: "/products"
    };
  }

  if (includesAny(message, ["i am confused", "i'm confused", "not sure", "overwhelmed", "where do i start", "need guidance", "help me decide"])) {
    return {
      id: "personal.reassurance",
      response: "That is completely understandable. International sourcing has many moving parts, and you do not need to solve everything at once. Start with the product, your quantity, and destination; the rest can be clarified step by step. I can help you compare products or point you to the quote form when you are ready.",
      quickReplies: ["Compare products", "Request a quote", "Export documents"],
      route: "/products"
    };
  }

  if (includesAny(message, ["sad", "anxious", "stressed", "lonely", "upset", "feel bad", "feeling down", "mental health"])) {
    return {
      id: "personal.wellbeing",
      response: "I am sorry things feel heavy right now. A small next step can help: pause, take a breath, and consider reaching out to someone you trust. I can stay with practical EasyHarvest questions too, but for urgent emotional support or if you feel unsafe, please contact local emergency services or a qualified crisis and mental-health professional right away.",
      quickReplies: ["Return to buyer help", "Talk to sales"],
      route: "/contact"
    };
  }

  if (includesAny(message, ["thank you", "thanks", "appreciate it", "that's helpful"])) {
    return {
      id: "personal.gratitude",
      response: "You are very welcome. I am glad that helped. Whenever you are ready, I can help you narrow down a product, prepare your quote details, or find the right export information.",
      quickReplies: ["View products", "Request a quote", "Track my quote"]
    };
  }

  if (includesAny(message, ["how are you", "how is your day", "who made you"])) {
    return {
      id: "personal.smalltalk",
      response: "I am here, focused, and ready to help you think through the next practical step. I am the EasyHarvest website assistant, designed to make the buyer journey feel clearer and less overwhelming. What is on your mind today?",
      quickReplies: ["View products", "Request a quote", "Talk to sales"]
    };
  }

  if (includesAny(message, ["relationship", "family problem", "personal problem", "life advice"])) {
    return {
      id: "personal.life_guidance",
      response: "I can offer a calm space to think out loud, though I am not a substitute for a qualified counsellor or trusted person in your life. With personal decisions, it can help to name what matters most to you, separate what you can control from what you cannot, and take one kind, practical step at a time. If you would rather switch back to your buyer request, I can help there too.",
      quickReplies: ["Return to buyer help", "Talk to sales"]
    };
  }

  return null;
}

function includesAny(value: string, phrases: string[]) {
  return phrases.some((phrase) => value.includes(phrase));
}

function wordSet(value: string) {
  const ignored = new Set(["the", "and", "for", "with", "that", "this", "what", "can", "you", "your", "are", "how", "do", "does", "from", "about", "need", "want", "have", "will", "when", "where", "is", "it", "to", "of", "a", "an", "my"]);
  return value.split(/[^a-z0-9]+/).filter((word) => word.length > 2 && !ignored.has(word));
}
