"use client";

import { useMemo } from "react";
import { sanitizeRichHtml } from "@/lib/rich-text";

export function RichContent({ value, className = "" }: { value: string; className?: string }) {
  const html = useMemo(() => sanitizeRichHtml(value), [value]);
  return <div className={`rich-content ${className}`.trim()} dangerouslySetInnerHTML={{ __html: html }} />;
}
