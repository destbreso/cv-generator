"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { GA_ID } from "@/lib/analytics";

/**
 * Owns page views. The config in the layout sets send_page_view:false, so
 * without this nothing would be reported at all, and with both enabled the
 * first view would be counted twice. Firing an event rather than re-running
 * config is the GA4 pattern for client-side navigation.
 */
export default function GAListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID || typeof window.gtag !== "function") return;
    const query = searchParams.toString();
    window.gtag("event", "page_view", {
      page_path: pathname + (query ? `?${query}` : ""),
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
