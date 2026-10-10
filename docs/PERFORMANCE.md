# Performance smoke check

Run the app and database, then execute `npm run perf`. The script sends 100 concurrent requests (10 at a time) to the public monster-list API, reports throughput and latency percentiles, and fails if any request fails or p95 exceeds 500 ms.

`npm run test:api` also performs an end-to-end functional smoke test. It creates temporary accounts through the API and removes those accounts and their gameplay records afterward.

Configure a different target or threshold with:

```sh
PERF_URL=http://localhost:3000 PERF_REQUESTS=250 PERF_CONCURRENCY=20 PERF_P95_LIMIT_MS=500 npm run perf
```

This is a repeatable smoke benchmark, not a load test or a performance certification. Record the machine, database, request count, concurrency, and p95 when comparing runs.
