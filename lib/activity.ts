"use client";

import { supabase, visitorId } from "@/lib/supabase";

export function activitySessionId() {
  if (typeof window === "undefined") return "server";
  const key = "easyharvest_activity_session_id";
  const existing = window.sessionStorage.getItem(key);
  if (existing) return existing;
  const id = crypto.randomUUID();
  window.sessionStorage.setItem(key, id);
  return id;
}

export async function recordActivity(eventType: string, eventLabel: string, metadata: Record<string, string | number | boolean> = {}) {
  if (!supabase || typeof window === "undefined") return;
  await supabase.from("site_activity_events").insert({
    visitor_id: visitorId(),
    session_id: activitySessionId(),
    event_type: eventType,
    event_label: eventLabel,
    page_path: window.location.pathname,
    metadata
  });
}
