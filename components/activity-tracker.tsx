"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { activitySessionId, recordActivity } from "@/lib/activity";
import { supabase, visitorId } from "@/lib/supabase";

export function ActivityTracker() {
  const pathname = usePathname();
  const startedAt = useRef(Date.now());
  const pageViews = useRef(0);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    pageViews.current += 1;

    const syncSession = async () => {
      await client.from("site_activity_sessions").upsert({
        visitor_id: visitorId(),
        session_id: activitySessionId(),
        started_at: new Date(startedAt.current).toISOString(),
        last_seen_at: new Date().toISOString(),
        duration_seconds: Math.max(0, Math.floor((Date.now() - startedAt.current) / 1000)),
        page_views: pageViews.current,
        last_path: window.location.pathname,
        user_agent: navigator.userAgent.slice(0, 500)
      }, { onConflict: "session_id" });
    };

    void syncSession();
    void recordActivity("page_view", pathname);
    const interval = window.setInterval(() => void syncSession(), 30000);
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") void syncSession();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      void syncSession();
    };
  }, [pathname]);

  return null;
}
