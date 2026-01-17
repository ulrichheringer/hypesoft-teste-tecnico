"use client";

import { useReportWebVitals } from "next/web-vitals";

type WebVitalPayload = {
  name: string;
  value: number;
  rating?: string;
};

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    const payload: WebVitalPayload = {
      name: metric.name,
      value: metric.value,
      rating: metric.rating ?? "unknown",
    };

    const url = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"}/api/rum`;
    const body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
      return;
    }

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      // Silent: RUM should never block the UI.
    });
  });

  return null;
}
