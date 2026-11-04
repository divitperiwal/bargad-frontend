# 2. Postgres is the only link between the services, and the job queue

Status: accepted, 2026-10-29

## Context

An approval and the job that places its order must never come apart. A crash between them would either approve something that never runs, or run something that was never approved.

## Decision

- Hono writes the approval and an outbox row in one transaction.
- The engine claims jobs with `SELECT … FOR UPDATE SKIP LOCKED` and is woken by `LISTEN/NOTIFY`. NOTIFY is only a signal; the table is the state.
- The engine writes order status and holdings back to tables, and Hono reads them.
- Order-status events reach the app through NOTIFY → Hono → SSE. NOTIFY fires only on commit, so a rolled-back status is never shown.
- No HTTP between the services.

## Alternatives

- **BullMQ / pg-boss.** Node-only, so Go couldn't consume them, and BullMQ's Redis can't share a transaction with Postgres.
- **Kafka, RabbitMQ, NATS.** Built for far more than this system's traffic (see the capacity section in design.md), and each is one more thing to run and back up.
- **HTTP calls from Hono to the engine.** Creates a second path where an approval and its order could disagree.

## Revisit when

Over 10k events per second, or several independent consumers need the same stream.
