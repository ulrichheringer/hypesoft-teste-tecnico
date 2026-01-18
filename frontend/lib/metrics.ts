import client from "prom-client";

const register = new client.Registry();

client.collectDefaultMetrics({
  register,
  prefix: "nextjs_",
});

export const httpRequestDuration = new client.Histogram({
  name: "nextjs_http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

export const httpRequestsTotal = new client.Counter({
  name: "nextjs_http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

export const httpRequestsInProgress = new client.Gauge({
  name: "nextjs_http_requests_in_progress",
  help: "Number of HTTP requests currently in progress",
  labelNames: ["method", "route"],
  registers: [register],
});

export const appInfo = new client.Gauge({
  name: "nextjs_app_info",
  help: "Application info",
  labelNames: ["version", "nodejs_version"],
  registers: [register],
});

appInfo.set({ version: "0.1.0", nodejs_version: process.version }, 1);

export const upMetric = new client.Gauge({
  name: "nextjs_up",
  help: "Whether the Next.js application is up",
  registers: [register],
});
upMetric.set(1);

export { register };
