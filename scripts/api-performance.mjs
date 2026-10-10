const baseUrl = (process.env.PERF_URL ?? "http://localhost:3000").replace(/\/$/, "");
const requestCount = Number(process.env.PERF_REQUESTS ?? 100);
const concurrency = Number(process.env.PERF_CONCURRENCY ?? 10);
const p95LimitMs = Number(process.env.PERF_P95_LIMIT_MS ?? 500);

if (!Number.isInteger(requestCount) || requestCount < 1 || requestCount > 5000) {
  throw new Error("PERF_REQUESTS must be an integer between 1 and 5000");
}
if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 100) {
  throw new Error("PERF_CONCURRENCY must be an integer between 1 and 100");
}
if (!Number.isFinite(p95LimitMs) || p95LimitMs <= 0) {
  throw new Error("PERF_P95_LIMIT_MS must be a positive number");
}

const samples = [];
let nextRequest = 0;
let failures = 0;

async function worker() {
  while (nextRequest < requestCount) {
    nextRequest += 1;
    const startedAt = performance.now();
    try {
      const response = await fetch(`${baseUrl}/api/monsters`);
      await response.arrayBuffer();
      if (!response.ok) failures += 1;
      samples.push(performance.now() - startedAt);
    } catch (error) {
      failures += 1;
      samples.push(performance.now() - startedAt);
      console.error("Performance request failed:", error);
    }
  }
}

const startedAt = performance.now();
await Promise.all(Array.from({ length: Math.min(concurrency, requestCount) }, () => worker()));
const elapsedMs = performance.now() - startedAt;
samples.sort((a, b) => a - b);
const percentile = (fraction) => samples[Math.min(samples.length - 1, Math.ceil(samples.length * fraction) - 1)];
const summary = {
  url: `${baseUrl}/api/monsters`,
  requests: requestCount,
  concurrency,
  failures,
  elapsedMs: Number(elapsedMs.toFixed(1)),
  requestsPerSecond: Number((samples.length / (elapsedMs / 1000)).toFixed(1)),
  p50Ms: Number(percentile(0.5).toFixed(1)),
  p95Ms: Number(percentile(0.95).toFixed(1)),
  p95LimitMs,
};

console.log(JSON.stringify(summary, null, 2));
if (failures > 0 || summary.p95Ms > p95LimitMs) process.exitCode = 1;
