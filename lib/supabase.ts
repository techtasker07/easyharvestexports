"use client";

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const hasSupabase = Boolean(url && key);

export const supabase = hasSupabase ? createClient(url, key) : null;

export function visitorId() {
  if (typeof window === "undefined") return "server";
  const keyName = "easyharvest_visitor_id";
  const existing = window.localStorage.getItem(keyName);
  if (existing) return existing;
  const id = crypto.randomUUID();
  window.localStorage.setItem(keyName, id);
  return id;
}

export function trackingCode() {
  const letters = "EHX";
  const body = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${letters}-${body}`;
}
