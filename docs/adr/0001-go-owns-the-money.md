# 1. Go owns the money, Hono owns the product

Status: accepted, 2026-10-29

## Context

Two languages are only worth it if each owns a clear half. If the rules that protect money (no duplicate orders, no order over a grant's cap, no order after a revoke) are split across both, every guarantee has to be proven twice.

## Decision

- `apps/engine` (Go) makes every broker call: logins, sessions, orders, holdings sync, reconciliation, the price feed.
- `apps/api` (Hono on Bun) serves everything the user sees and records approvals and grants.
- Hono never calls a broker. Go never serves the app; its only HTTP listener is for health checks.

The split is by who owns the money, not by CPU work versus waiting. Broker calls are mostly waiting, and they belong to Go.

## Alternatives

- **One TypeScript service.** Simpler to run. Rejected because the engine benefits from Go's concurrency model and static binaries, and the split gives each half one job.
- **Split by workload (CPU vs I/O).** Rejected: broker calls would drift into Hono and the guarantees would end up in two places.

## Revisit when

Never for the rule itself. The engine may be split further only if one part of it needs to scale on its own.
