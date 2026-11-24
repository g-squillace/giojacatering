"use client";

import { useEffect } from "react";

const EXCLUDED_HOSTS = [
  "guidosquillace.it",
  "iubenda.com",
  "cantierecreativo.net",
];

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackLead(event: string, label: string): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, {
    event_category: "contatto",
    event_label: label,
  });
}

function classify(href: string): { event: string; label: string } | null {
  const value = href.trim().toLowerCase();
  if (value.startsWith("mailto:")) {
    const address = value.slice(7).split("?")[0];
    if (EXCLUDED_HOSTS.some((host) => address.endsWith(host))) return null;
    return { event: "contact_email_click", label: address };
  }
  if (value.startsWith("tel:")) {
    return { event: "contact_phone_click", label: value.slice(4) };
  }
  if (value.includes("wa.me/") || value.includes("api.whatsapp.com")) {
    return { event: "contact_whatsapp_click", label: "whatsapp" };
  }
  return null;
}

export default function LeadTracking() {
  useEffect(() => {
    function onClick(nativeEvent: MouseEvent) {
      const target = nativeEvent.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (anchor === null) return;
      const href = anchor.getAttribute("href");
      if (href === null) return;
      const classified = classify(href);
      if (classified === null) return;
      trackLead(classified.event, classified.label);
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, []);

  return null;
}
