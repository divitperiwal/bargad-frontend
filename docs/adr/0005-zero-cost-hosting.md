# 5. Stage 0 runs on one free VM

Status: accepted, 2026-10-29

## Context

The budget is $0. The brokers require orders to come from a static IP registered with them.

## Decision

- One Oracle Cloud Always Free ARM VM in Mumbai or Hyderabad, with its reserved public IP as the IP registered with the brokers.
- Postgres, Valkey, the API and the engine run in Docker Compose behind Caddy.
- WAL-G archives to Oracle object storage, with a weekly automated restore test.
- Monitoring runs off the VM: Grafana Cloud free, Healthchecks.io, Sentry free.
- The assistant runs on a local model through Ollama.

## Alternatives

- **AWS RDS with a standby.** The right answer once there's a budget; the code doesn't change.
- **Free managed Postgres (Neon, Supabase).** No static outbound IP for the engine, and free tiers pause.

## Revisit when

There's a budget, or the family's real money makes a database standby worth paying for.
