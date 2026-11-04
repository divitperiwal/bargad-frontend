# Bargad

A family investing app: one household, many brokers, and every member stays in control of their own account. The family head trades for a member only with their approval, or within limits they set.

The full design is in [docs/design.md](docs/design.md); the decisions behind it are in [docs/adr](docs/adr).

## Layout

```
apps/
  api/      Hono on Bun: the product (accounts, families, approvals, household view, assistant)
  engine/   Go: the money (every broker call, orders, reconciliation, price feed)
  app/      Expo: the member's phone (approvals, own view)
  web/      Next.js: the head's dashboard, landing page, demo
packages/
  shared/   Zod schemas shared by the API and both clients
db/
  migrations/   goose SQL, the one source of truth for the schema
  seed.sql      development data
  tests/        SQL checks that the schema refuses what the design forbids
```

The API and the engine never call each other. They share Postgres and nothing else.

## Running locally

Needs Bun, Go and Docker.

```sh
cp .env.example .env
bun install            # also installs the git hooks
bun run db:up          # Postgres and Valkey
bun run db:migrate
bun run db:seed        # a demo family on the fake broker; password bargad-dev
bun run dev            # everything, or one of:
bun run dev:api        # http://localhost:4000/health
bun run dev:engine     # http://localhost:8081/health/ready
bun run dev:web        # http://localhost:3000
bun run dev:app        # Expo
```

Scripts read `.env` from the repo root. Both services refuse to start without `DATABASE_URL`.

## Checks

```sh
bun run check          # lint, typecheck and test: run before pushing
bun run format         # Biome for TS/JSON/CSS, gofmt and goimports for Go
bun run lint           # Biome, then golangci-lint
bun run typecheck
bun run test
```

The pre-commit hook formats staged files. API tests are split into `test/unit` (no database) and `test/integration`, which needs `bun run db:up` and runs against a separate `bargad_test` database that is migrated and emptied automatically.

## Database

```sh
bun run db:status               # applied and pending migrations
bun run db:migrate              # apply pending migrations
bun run db:rollback             # undo the last migration
bun run db:new add_thing sql    # new numbered migration in db/migrations (sql, not go)
bun run db:test                 # schema guarantee checks, rolled back afterwards
bun run db:seed                 # dev data; safe to run again
bun run db:gen                  # regenerate DB code after a migration or query change
bun run db:psql                 # psql into the compose database
bun run goose <command>         # any other goose command; needs DATABASE_URL in the shell
```

`db:gen` writes two things, both committed:

- `apps/engine/internal/db`: sqlc's Go for the queries in `apps/engine/queries`. sqlc runs in Docker because its parser needs cgo.
- `apps/api/src/database/schema/` (one file per migration) and `relations.ts`: Drizzle's schema, pulled from the migrated database. Tables keep only columns and primary keys; read `db/migrations` for the constraints. It needs `db:migrate` first.

## Images

```sh
docker build -f apps/api/Dockerfile -t bargad-api .
docker build -f apps/engine/Dockerfile -t bargad-engine .
```
