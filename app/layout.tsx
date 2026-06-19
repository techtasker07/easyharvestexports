import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ActivityTracker } from "@/components/activity-tracker";
import { HarvestAssistant } from "@/components/harvest-assistant";

export const metadata: Metadata = {
  title: "EasyHarvest Exports",
  description: "Premium Nigerian agro commodities, export documentation, buyer quotes, and shipment follow-up."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ActivityTracker />
        <SiteHeader />
        {children}
        <SiteFooter />
        <HarvestAssistant />
      </body>
    </html>
  );
}
