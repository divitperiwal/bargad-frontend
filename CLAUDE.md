# Bargad frontend

Frontend-only export of the Bargad monorepo (a family investing app). The backend (`apps/api`, Hono + Postgres, and the Go engine) lives in a separate private repo and is **not** here. Build the UI against the contract below and mock the API.

Read `docs/design.md` (product, roles, consent modes) and `docs/design-principles.md` (UI principles) before designing screens. `docs/adr/` explains why the backend is shaped the way it is.

## Layout
- `apps/web` — Next.js 16 (App Router), React 19, Tailwind 4, `motion` + `gsap`. This is where all work happens.
- `packages/shared` — shared types (`ApiErrorBody`). Keep it type-only.
- Don't add `apps/api`, `apps/engine` or `db/` — they're intentionally absent.

## Commands
- `bun install` then `bun run dev:web` (or `cd apps/web && bun dev`) — runs on :3000
- `cd apps/web && bun run typecheck`
- `bun run lint` / `bunx biome check --write` (Biome 2, 2-space JS style per `biome.json`)

## Existing screens
Splash, login, signup (with date field), forgot password, terms, privacy, 404 — under `apps/web/app`. Shared pieces: `auth-shell.tsx`, `auth-flow.tsx`, `toast.tsx`, `validation.ts` (client-side profile rules: name ≥2 chars, 10-digit Indian mobile `[6-9]\d{9}`, age ≥18, password ≥10 chars, terms accepted). Reuse these before adding new ones.

## API contract (backend is in progress — mock it)
Base URL from `NEXT_PUBLIC_API_URL` (default `http://localhost:4000`). No real values or secrets in the repo.

- Success: `{ "success": true, "data": ... }`
- Error: `{ "success": false, "error": string, "issues"?: Record<string, string[]> }` (`ApiErrorBody`; `issues` is per-field validation messages)
- Auth is a session cookie named `session` (httpOnly) — send `credentials: "include"`.

Endpoints (under `/auth`; signup/login bodies include a `client` field, use `"web"`):
- `POST /auth/signup` → 201, signed-in result (user + session)
- `POST /auth/login` → 200, same shape
- `POST /auth/logout` (needs session) → `{ signedOut: true }`
- `GET /auth/me` (needs session) → `{ user }`
- `GET /health` → `{ status: "ok" }`

Exact request/response field names for signup/login are not final. Put all API calls behind one small typed client module so they're a one-file change when the backend lands, and use MSW or fixtures for now.

## Rules
- Money is rendered, never computed, in the browser: all amounts and balances come from the API (the Go engine owns the money — ADR 0001). Orders are limit orders only (ADR 0004).
- No new dependencies without a reason; no Vestico code or branding.
- Keep `apps/web` typecheck and Biome clean before committing.
