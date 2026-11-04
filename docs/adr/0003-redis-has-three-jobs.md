# 3. Redis has exactly three jobs, none of them on the money path

Status: accepted, 2026-10-29

## Context

Price ticks arrive several times a second. Writing them to Postgres fills the WAL and the WAL-G archive with data nobody will ever restore.

## Decision

Redis (Valkey) does three things:

1. Latest prices, with pub/sub streaming ticks to SSE.
2. A per-member valuation cache, invalidated by events (holdings sync, ledger edit, new price). Never per household: a cached household total would show hidden accounts to the wrong person.
3. Hot rate limits.

It runs as a pure cache: no persistence, a TTL on every key, `maxmemory` with `volatile-lru`, and its hit rate on the dashboard.

No order, grant, job, idempotency key or committed-status event depends on Redis. The engine checks prices against its own feed or a fresh broker quote. A CI test runs trading with Redis stopped.

## Alternatives

- **No Redis.** Considered first. Rejected because ticks don't belong in Postgres.
- **Redis as the job queue or event bus.** Rejected; see ADR 2.

## Revisit when

The valuation cache's hit rate stays below 80% (fix the keys or remove it), or a new use is proposed; any new use needs its own ADR.
