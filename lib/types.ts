export type Product = {
  id: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  image_url: string;
  specs: string[];
  active?: boolean;
};

export type Post = {
  id: string;
  title: string;
  subtitle?: string | null;
  body: string;
  image_url: string;
  cta_label?: string | null;
  cta_url?: string | null;
  created_at?: string;
};

export type Comment = {
  id: string;
  post_id: string;
  author_name: string;
  body: string;
  admin_reply?: string | null;
  admin_replied_at?: string | null;
  created_at?: string;
};

export type Quote = {
  id: string;
  tracking_code: string;
  buyer_name: string;
  email: string;
  contact_number?: string | null;
  company?: string | null;
  product_interest: string;
  quantity: string;
  destination: string;
  message: string;
  status: string;
  created_at?: string;
};

export type QuoteMessage = {
  id: string;
  quote_id: string;
  sender_name: string;
  sender_role: "buyer" | "admin";
  message: string;
  created_at?: string;
};

export type BotMessage = {
  id: string;
  visitor_id: string;
  session_id: string;
  role: "user" | "bot";
  content: string;
  intent_id?: string | null;
  route?: string | null;
  page_path?: string | null;
  created_at?: string;
};

export type SiteActivitySession = {
  id: string;
  visitor_id: string;
  session_id: string;
  started_at?: string;
  last_seen_at?: string;
  duration_seconds: number;
  page_views: number;
  last_path?: string | null;
  user_agent?: string | null;
};

export type SiteActivityEvent = {
  id: string;
  visitor_id: string;
  session_id: string;
  event_type: string;
  event_label: string;
  page_path?: string | null;
  created_at?: string;
};
