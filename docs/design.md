# Bargad: design

Working name: **Bargad** (बरगद, the banyan). Status: design agreed on 2026-10-29, no code yet.

A family investing app. One household, many brokers, and every member stays in control of their own account. The family head can trade for members only with their approval (mode 1) or within limits they set (mode 2).

This is a new project, built from scratch. Nothing is reused from Vestico. Vestico keeps running unchanged for its current users, with fixes only.

---

## 1. Why this exists

- **Personal reason:** managing a parent's investment account from one place, with the parent still in control.
- **Goal:** a resume project first, with the family as real users from day one. It becomes a startup only if it takes off.
- **Positioning:** family and multi-broker *viewing* is not unique. INDmoney, Zerodha Console (family view, up to 10 accounts), MProfit (700+ brokers, ITR reports) and Kuvera (tax harvesting) already do it. Bargad's edge is **acting** across brokers and family members with each member's consent, which is also why it is regulated.
- **One-line pitch:** run the whole family's investments across any broker, and every member stays in control.

### The name

The banyan tree links to finance in several ways:

- **Market history:** in the 1850s Bombay's share brokers met under a banyan tree near the Town Hall, before moving to Dalal Street and becoming the BSE.
- **Compounding:** a banyan's aerial roots grow into new trunks that hold up more branches, so growth funds more growth.
- **Diversification:** an old banyan stands on many trunks. If one fails, the tree still stands.
- **Generations:** banyans live for centuries, which matches the idea of generational wealth.
- **Consent:** village panchayats met under the banyan, and decisions were made together, in the open.
- **Symbol:** it is India's national tree.

Interview line: *"Indian trading began under a banyan. Its roots compound into new trunks, and each trunk stands on its own roots, the way every member keeps control of their own account."*

- Taglines: *One family. Many roots.* · *Grow like a bargad.* · *Wealth with roots.*
- Logo idea: aerial roots drawn as rising chart lines.
- Light product vocabulary: household = tree, a member's accounts = roots, net worth = canopy.

**Name risk (resolve before any public launch):**

- **Domains:** bargadwealth.com is an existing investment adviser ("Bargad Wealth | Investment Adviser & Wealth Planning"), in the same trademark class (36). bargad.app and bargadapp.com redirect to "Onna", a family organiser app for calendar, expenses and documents. bargad.com (registered 2004), bargad.in, bargad.co.in and bargad.money are taken.
- **Free when checked on 2026-10-29:** getbargad.com, joinbargad.com, usebargad.com, bargadfamily.com, getbargad.in, bargadapp.in, getbargad.app, getbargad.money.
- **Searches:** no "Bargad" Play Store app was found, and no trademark in classes 9 or 36 turned up on third-party trackers. The official IP India registry has not been searched yet.
- **Fallbacks checked:** Grihast (.in and .app free), Vriksh (.app free), Ekatva (.app free). Avoid Heirly, Anumati, Kinora, Anvay, Dhaaga, Sahamati, Kutumb, Nidhi, Tijori, and anything with "Bank" or "Mutual Fund".

---

## 2. Scope

### Stage 0 only: private, the developer's own family

Everything is built and works, but only for one family. The public stages are listed in section 9 and are not built.

### Product rules

**Family**

- One family per person at a time.
- Exactly one head, who is also a normal member with their own broker accounts.
- The head invites members by email. Invites are single-use, tied to one email address, valid for 7 days, and revocable before use.
- Each member sets their own password and links their own broker. Neither the head nor the admin ever types in a member's credentials.
- Each member's relationship to the head is recorded and self-declared at invite time. Trading features (stored credentials, mode 1, mode 2) are only allowed for SEBI's family definition: self, spouse, dependent children and dependent parents. Anyone else, such as a sibling or an independent adult child, joins view-only.
- No minors.
- **Leaving or being removed:**
  - All grants are revoked.
  - Unexecuted baskets are cancelled, including open broker orders placed from them.
  - The head loses all read access, including history.
  - The member keeps their own audit log and history.
  - Trades that already executed stay.
- The head can remove a member, with the same effect as leaving. The member is notified.
- The head must hand the role to another adult member before leaving. If the head deletes their account instead, the family dissolves and everyone becomes a household of one.

**Broker accounts and login**

- One person can have many broker accounts. "Multi-broker" applies within a single person, not only across the family.
- When linking each account, the member chooses how it logs in:
  - **Broker login (default):** the member logs in on the broker's own page and the app gets a token.
    - **Dhan:** a consent flow (`generate-consent` → browser login → `consume-consent`). Third-party apps need a partner ID from Dhan, or each member uses their own API key.
    - **mStock:** a partner login that redirects back with a JWT, using a platform key issued by mStock.
  - **Stored credentials (opt-in):** the server keeps the PIN and TOTP secret and logs in automatically, as Vestico does today. A passkey (biometric) is required to link, view or change credentials, and to approve a basket.
- **No session on trade day:** a member on the broker login who hasn't logged in gets a push notification ("log in to let today's trades run"). If the window closes, the trades carry over to the next trading day. The system never falls back to stored credentials the member didn't choose.
- **Admin:** cannot view or edit credentials. The admin can only revoke them, which wipes them and forces the member to relink.

**Trading: everything is a basket**

- Every trade is a basket of orders. A manual trade is a basket of one.
- **Mode 1, per-trade approval:**
  - The head proposes a basket and the member approves it on their own phone.
  - Approval locks a price band, ±1% of the price the member saw by default.
  - Approval is valid until the end of that trading day. If the band is breached, the member must approve again.
- **Mode 2, limited grant:** the member grants the head time-limited access with limits:
  - Duration: 1 hour to 7 days.
  - A total ₹ cap across the grant, with buys and sells counted separately.
  - A per-order ₹ cap.
  - Equity cash, delivery (CNC) only: no F&O, intraday or margin.
  - Sells only of holdings the member already has.
  - Limit orders only. An instrument allow-list is a cheap extra if possible.
  - Every trade sends a notification to the member's phone, with a one-tap revoke.
- **Order type:** all family trades are sent as LIMIT orders priced at the latest price ± the band, never raw MARKET orders, whatever the broker allows. Brokers handle API market orders differently under the algo framework: some convert them to protected limit orders, some reject or ban them.
- **Abuse by the family head** is out of scope beyond the per-trade notification and revoke.

**Visibility**

- **Head:** sees each member's holdings, orders, P&L and manual ledger, except anything the member hides (per broker account or per ledger entry).
- **Members:** see their own data plus household totals, not each other's data.
- **Hidden items:** excluded from household totals as well, so they can't be worked out by subtraction.

**Household view and manual ledger**

- Live holdings across all brokers, plus manual entries.
- **Ledger entry:** name, type, value, as-of date.
  - Assets: bank/cash, FD, EPF/PPF/NPS, gold, real estate, vehicle, other.
  - Liabilities: home, car, personal or education loan, credit card, each with an optional EMI and interest rate.
- **Per member:** optional monthly income and monthly expenses.

**Audit log**

- An append-only family audit log.
- **Recorded:** every proposal, approval, rejection, grant, revoke, order placed under a grant, and every view or change of stored credentials.
- **Visibility:** each member sees the entries that touch their own accounts.

**Assistant (v1.5, after mode 1 works end to end)**

- Read-only: it answers questions and runs "what if" sums. It never places orders or creates baskets.
- Talks only in amounts and allocation, and never names a security to buy or sell.
- Sees exactly what the person asking can see (section above). It sees how much is invested, but no strategy holdings or plans.
- Every figure comes from deterministic tools, e.g. `netWorth()`, `liquidAssets()`, `emiFor(amount, rate, months)`, `cashFlow()`. The model chooses the tools and explains the result; it never does arithmetic itself.
- `projectYearEnd()` combines:
  - the savings run rate (income − expenses − EMIs) for the remaining months;
  - investments grown under three labelled scenarios: 0%, the household's own trailing 12-month return, and a conservative rate set by the user (e.g. 8%).
  It is always shown as a range, never a single figure.
- Chats are visible only to the person who had them.
- **Limits:** a daily message cap per person (e.g. 30) and a monthly spend cap for the app.
- **Model:** one `AssistantModel` interface. A local model through Ollama for now ($0), Claude later. A model is only enabled after passing a test set that checks it calls the right tools and never names a security.

**Out of scope / later**

- Strategies and the rebalancer: no strategies in v1, and all baskets are built by hand. The standing "auto-approve my strategy's rebalance up to ₹X" grant and per-account strategies are for later.
- A human advisor role: a read-only member type, such as a registered adviser or CA, with no trading rights.
- Mutual funds (through a distributor partner), bank accounts (through Account Aggregator, which would replace manual ledger entries), household tax harvesting, HUF accounts (where the karta legally operates the account), minors' accounts.
- No advice and no tax filing.

---

## 3. Regulatory findings

The quotes come from the circulars as extracted during the planning sessions. Re-check them against the originals before relying on them.

- **OAuth only:** SEBI circular SEBI/HO/MIRSD/MIRSD-PoD/P/CIR/2025/0000013 (4 Feb 2025), para 5(I)(d), says brokers shall "have OAuth (Open Authentication) based authentication only and all other authentication mechanisms shall be discontinued" and "authenticate access to API through two factor authentication". Footnote 3 defines OAuth as access "without requiring users to share their login credentials".
- **In force:** SEBI circular 2025/132 (30 Sep 2025), para 8, applies the framework to all brokers from 1 April 2026.
- **Vendors are algo providers:** para 5(I)(a) treats any "fintech/vendor" as an "Algo Provider" acting as the broker's agent, and brokers must "deal with empaneled algo providers only". Para 5(III)(a) requires algo providers to be empanelled with the exchanges.
- **Family exception:** para 5(I)(c) lets a retail investor use their own algo "for their family (but not for other investors)", where family means "self, spouse, dependent children and dependent parents".
- **Research Analyst:** para 5(V) says algos "where the logic is not known to the user" need Research Analyst registration.
- **Static IPs:** NSE/INVG/67858 (5 May 2025), A.7: "A static IP can only be mapped to one client at a time. However, static IPs can be shared between clients provided such clients belong to one family." A.5: for empanelled algo providers, the static IP is the vendor's.
- **Broker liability:** under the same circular, brokers are "fully responsible and liable for all orders emanating through" their APIs. API sessions must be logged out every day.
- **NSE retail algo FAQ (3 Nov 2025):** every order sent through the API counts as an algo order (Q8). An empanelled provider's strategies must run on the broker's servers (Q5). Algo market orders are not permitted (Q11).
- **Not yet read:** NSE/INVG/70309 (empanelment criteria; reported but unconfirmed: ISO 27001 and VAPT audits every six months) and NSE/INVG/73992 (30 Apr 2026).

**What this means for Bargad**

- **Stored credentials:** defensible only for the family, under the family-algo exception plus a written request to each broker to map the family to one static IP. It's still a grey area, so ask each broker in writing.
- **Public users:** they need the broker login, exchange empanelment or a partner, and the vendor's own static IP.
- **Mode 2 for the public:** as designed, it can't be offered publicly. Possible routes are an HUF account or a member-approved plan executed by software, and both need a lawyer's opinion.
- **Advice:** not regulated while the app is private and free for one family. If it goes public, an AI or tool that names securities becomes regulated advice. That is why the assistant never names securities and why a human advisor holding the licence is the later route.
- **Data protection:** under the DPDP Act, each member's financial data is theirs.

Sources:
- SEBI Feb 2025 circular (CSE copy): https://www.cse-india.com/upload/upload/Feb_042025.pdf
- SEBI Sep 2025 circular: https://www.sebi.gov.in/sebi_data/attachdocs/sep-2025/1759232056254.pdf
- NSE/INVG/67858: https://nsearchives.nseindia.com/content/circulars/INVG67858.pdf
- NSE empanelled algo providers: https://www.nseindia.com/static/trade/empanelled-algo-providers-exchange
- DhanHQ authentication: https://dhanhq.co/docs/v2/authentication/
- mStock partner login flow: https://tradingapi.mstock.com/docs/v1/Partners-Onboarding/login-flow/
- Market orders under the algo framework:
  - https://www.angelone.in/news/market-updates/what-s-changing-in-angel-one-s-smartapi-access-from-april-1-2026
  - https://www.kotakneo.com/support/are-market-orders-allowed-trade-api/
  - https://tradingqna.com/t/api-market-protection-parameter-clarification-needed-on-correct-usage/193504

---

## 4. Architecture

### The split: product vs money

| Bun + Hono: **the product** (everything the user sees) | Go: **the money** (anything that can place, change or verify an order) |
|---|---|
| Accounts, passkeys, families, invites, relationships | **Every** broker call: logins, sessions, orders, holdings sync |
| Baskets, approvals, grants (recording them) | Order executor: cap checks, re-check before sending, idempotency |
| Household view, ledger, visibility rules | Reconciler, carry-over, circuit breakers, kill switches |
| Assistant and its finance tools, push, email, SSE | Price feed, invariant checker, grant and invite expiry |

- **Hono never calls a broker, and Go never serves the app.** The split is about who owns the money, not about CPU work versus waiting. Broker calls are mostly waiting, and Go owns them.
- **The two services talk only through Postgres:**
  - Hono writes the approval and an outbox/job row in one transaction.
  - Go claims jobs with `SELECT … FOR UPDATE SKIP LOCKED`, woken by `LISTEN/NOTIFY`.
  - Go writes order status and synced holdings back to tables, and Hono reads them.
  - There is no HTTP between the services.

### Repo layout

```
apps/
  api/      Hono (Bun)   product API, SSE, push, assistant
  engine/   Go           broker calls, orders, reconciler, price feed
  app/      Expo         phones (Android first): approvals, own view, passkey, assistant
  web/      Next.js      head's dashboard, household view, ledger, landing page, public demo
packages/
  shared/   Zod schemas + typed Hono client (used by app and web)
db/
  migrations/   goose SQL, the single source of truth for both languages
docs/
  adr/  runbooks/  design.md
```

- **Web:** every action is possible on the web except approvals and passkey sign-off, which happen only on the member's phone.
- **Expo:** builds for Android and iOS only, with no Expo web build. There is one web app, and it's Next.js.

### Diagram

```
 Expo app (Android) ─┐
                     ├─HTTPS─▶ API (Hono, stateless) ──SSE──▶ clients
 Next.js web ────────┘              │  one transaction: state change + outbox job
                                    ▼
                         Postgres (source of truth)  ◀──── Redis/Valkey (cache, ticks)
                                    ▲  SKIP LOCKED + LISTEN/NOTIFY        ▲
                                    │                                     │
 Engine (Go): executor · reconciler · expiry · invariant checker · price feed
     │
     ▼  via the registered static outbound IP
 Dhan / mStock APIs ──order updates──▶ reconciler

 Assistant (in API) ──▶ AssistantModel (Ollama now, Claude later) ──▶ read-only finance tools
```

### Technology choices

| Need | Choice | Why not the usual alternative |
|---|---|---|
| Database | **Postgres 18** | Transactions across approvals, grants and orders |
| Job queue | **Outbox table + `SKIP LOCKED`** in Go | BullMQ and pg-boss are Node-only, and an approval and its job must share one transaction |
| Waking Go | **`LISTEN/NOTIFY`** | Only a signal; the tables hold the durable state |
| Live order status | **Postgres NOTIFY → Hono → SSE** | NOTIFY fires only when a transaction commits, so a rolled-back status is never shown. Updates are one-way, so WebSockets aren't needed. |
| Prices, valuation cache, hot rate limits | **Redis (Valkey)** | Ticks don't belong in Postgres: they would bloat the WAL and the WAL-G archive |
| Go DB access | **pgx + sqlc**, migrations with **goose** | One set of SQL files for both languages |
| TS DB access | **Drizzle** (schema pulled from the database) + **Zod** | — |
| Order pacing per broker | `golang.org/x/time/rate` | One engine instance for now |
| Circuit breaker | `sony/gobreaker` | — |
| Credential sealing | **libsodium sealed boxes**: `libsodium-wrappers` in TS, `x/crypto/nacl/box` in Go | Hono encrypts with Go's public key; only Go holds the private key (Vault/KMS would be overkill) |
| Passkeys | **SimpleWebAuthn** in Hono; device biometrics in Expo | — |
| Push / email | **Expo push** / **Resend free tier** | — |
| HTTPS | **Caddy** + a free DuckDNS subdomain until a domain is bought | — |
| Backups | **WAL-G** to Oracle object storage, with a weekly automated restore test | Nightly dumps alone lose up to a day, and the audit log can't be rebuilt from the brokers |
| Monitoring | **Grafana Cloud free** (metrics, logs, traces, alerts) + **Healthchecks.io** + **Sentry free** | Monitoring on the same VM dies with the VM |
| Tracing | **OpenTelemetry**, with trace context written into the outbox row so Go continues the same trace | — |
| CI/CD | **GitHub Actions + GHCR**, deploy over SSH with `docker compose pull`, blocked 09:00–15:30 IST unless overridden | — |
| Android builds | `eas build --local` or the EAS free tier; **EAS Update** for JS fixes | — |
| LLM | **Ollama** (local) behind `AssistantModel` | — |

### Redis rules

- **Exactly three jobs:**
  - latest prices, with tick pub/sub feeding SSE;
  - a **per-member** valuation cache, invalidated by events (holdings sync, ledger edit, new price);
  - hot rate limits.
- **Cache per member, never per household.** Each request assembles the household total from the subtotals that viewer is allowed to see, so hidden accounts never leak.
- **Never on the money path:** no order, grant, job, idempotency key or committed-status event depends on Redis. Go's price checks before sending use its own feed's latest price or a fresh broker quote, never a value read back from Redis. A CI test runs trading with Redis stopped.
- **Settings:** a pure cache. No persistence, a TTL on every key, `maxmemory` with `volatile-lru` eviction. The hit rate is on the dashboard; below 80%, fix the keys or remove the cache.
- **If Redis is down:** prices freeze and the UI shows their age, valuations are computed from Postgres more slowly, rate limits fall back to in-memory, and trading is unaffected.
- **Two event channels on purpose:** committed facts go through Postgres NOTIFY, short-lived ticks through Redis pub/sub.
- **Triggers for more infrastructure** (add only when measured):
  - a second engine instance needs leader election with a Postgres advisory lock first;
  - Kafka or NATS only above 10k events/s, or with several independent consumers of one stream.

---

## 5. Reliability: the guarantees

**Targets (market hours, 09:15–15:30 IST)**

- Zero duplicate orders.
- Zero orders above a grant's cap.
- Zero orders after a revoke or after a member leaves.
- p95 from approval to the broker accepting the order under 2 seconds.
- API availability 99.9% during market hours.
- Order status matches the broker within 60 seconds.

**Mechanisms**

1. **Approval and job commit together:** the approval and its outbox job are written in one transaction.
2. **Grant caps can't be raced:** each order locks the grant row (`SELECT … FOR UPDATE`), checks spend against the cap, records the spend and commits before the broker is called.
3. **Re-check just before sending:** the grant is still active, the member is still in the family, the session is valid, and the price is within the band and less than 30 seconds old. A revoke always wins over a queued order.
4. **Idempotency key first:** the key is claimed in the database before the broker call. A lost reply becomes an `UNKNOWN` order that the reconciler resolves; it is never sent a second time.
5. **One executor per broker account at a time,** so two jobs can't spend the same cash.
6. **Circuit breaker per broker:** after repeated errors or timeouts, that broker is paused, its baskets carry over to the next day and the member is notified. Other brokers keep trading.
7. **Kill switches:** global, per family and per broker, effective within one job cycle.
8. **Invariant checker:** runs every minute and looks for spend above a cap, an order with no approval, or an order after a revoke. A single hit pages.
9. The invariant checker and kill switches ship with the very first order the app can place.

### Failure modes

| Failure | What breaks | Detection | Automatic recovery |
|---|---|---|---|
| API instance dies | Nothing (when running ×2); downtime on the single stage 0 VM | Health check | Restart |
| Engine dies mid-order | That one order's outcome is unknown | Job lease times out | Job retries; the idempotency key stops a duplicate; the reconciler settles it |
| Postgres fails | Everything (stage 0 has no standby) | Grafana Cloud / Healthchecks | Restore with WAL-G; money guarantees unaffected |
| Broker API down or slow | That broker's orders | Circuit breaker, error rate | Paused, carried over, member notified |
| Broker reply lost | One order's status | `UNKNOWN` order count | Reconciler checks the broker's order book |
| Outbound IP / network down | Every broker call | Egress probe | Alert; trades carry over |
| Price feed drops | Valuations go stale | Price age > 30 s | Reconnect; UI shows the age; band check refuses stale prices |
| Redis down | Live prices and cache | Health check | Fall back as described in section 4 |
| Push down | Approvals arrive late | Push failure rate | Email fallback |
| LLM down | Assistant only | Error rate | "Assistant unavailable"; trading unaffected |
| Bad deploy | Anything | Error rate after the deploy | Market-hours deploy block; one-step rollback |

### Consistency vs availability (CAP)

- **Postgres** chooses consistency: during a failure, money state is briefly unavailable rather than wrong.
- **Prices in Redis** choose availability: a stale price is acceptable if it's labelled with its age, and band checks reject old prices.
- **Push** is delivered at least once, with a notification ID so the app shows each one only once.

### Monitoring

Each alert gets a runbook in `docs/runbooks/` before launch.

| Metric | Alert |
|---|---|
| `invariant_violations_total` | ≥ 1, page immediately |
| `orders_unknown` older than 5 min | ≥ 1 |
| `approval_to_broker_ack_seconds` p95 | > 2 s for 5 min |
| `broker_circuit_open{broker}` | open during market hours |
| `reconcile_lag_seconds` | > 60 s |
| `price_age_seconds` | > 30 s during market hours |
| Job queue depth / oldest job | > 1,000 jobs, or oldest > 60 s |
| API 5xx rate | > 1% for 5 min |
| Redis cache hit rate | < 80% (review, not a page) |
| Backup / restore-test heartbeat | missed (Healthchecks.io) |

---

## 6. Capacity (sized for a hypothetical public stage, all inputs assumed)

| Input | 1x | 5x | 10x |
|---|---|---|---|
| Households (3 users each) | 100k | 500k | 1M |
| Daily active users (10%) | 30k | 150k | 300k |
| API QPS, average | 50 | 250 | 500 |
| API QPS, peak (3x) | 150 | 750 | 1,500 |
| Orders per month (20 per household) | 2M | 10M | 20M |
| Order burst at market open | 170/s | 830/s | 1,700/s |
| Storage per year | ~110 GB | ~550 GB | ~1.1 TB |

**Derivations**

- **API QPS:** 30k users × 60 requests/day = 1.8M requests/day. 80% of that in 8 hours: 1.44M ÷ 28,800 s = 50 QPS.
- **Burst:** 10% of a month's orders in the first 5 minutes: 200k ÷ 300 s.
- **Storage:** orders at about 2 KB each, plus audit events at 0.5 KB, five per order.

**Conclusions**

- One Postgres primary is enough even at 10x.
- **The real ceiling is the brokers:** each broker's API rate limits and NSE's per-client order limits. So queue and pace orders per broker rather than adding servers.
- **Scale-up path** (configuration, added only when measured): more API instances, read replicas, monthly partitions for `orders` and `audit_log`, and a second engine instance with leader election.

---

## 7. Hosting and cost: $0 for stage 0

| Need | Choice | Catch |
|---|---|---|
| Server + static IP | **Oracle Cloud Always Free** ARM VM (up to 4 cores and 24 GB RAM) in Mumbai or Hyderabad, with a reserved public IP registered with the brokers | Idle Always Free VMs can be reclaimed. Convert the account to pay-as-you-go to stop that (it stays $0 within free limits but needs a card). Check current limits. |
| Postgres, Redis, API, engine | **Docker Compose** on the same VM, behind Caddy | No database standby, so a database failure means restoring from backup |
| Backups | WAL-G to Oracle's free object storage | — |
| Assistant | Ollama on the VM or a PC | Slower answers and weaker tool use; the test set decides which model |
| Android app | APK / EAS free tier: $0 | iOS would need the $99/year Apple Developer account later |
| Domain | Free DuckDNS subdomain for now | A real domain costs about ₹500–1,000 a year |

- **Upgrade path once there's a budget:** managed Postgres (AWS RDS in Mumbai) with a synchronous standby. The code doesn't change.
- **Rough monthly cost at 10x public scale:**
  - compute (2 API + 2 engine instances): about $150;
  - Postgres with standby: about $300–500;
  - NAT, IPs, email and push: about $50–100;
  - LLM: depends on use, capped per user.

---

## 8. Showing it well (without overkill)

- **The test for every component:** one sentence of the form *"It's here because of [problem], and without it [specific failure]."* Anything that can't pass that test stays out.
- **Deliberately left out:** Kafka/RabbitMQ/NATS, event sourcing (the audit log is an append-only table), Redlock, Vault/KMS, service mesh/API gateway, multi-region, microservices beyond two, Kubernetes, GraphQL.
- **ADRs in `docs/adr/`,** including the rejected options and what would change each decision. For example:
  - why Postgres is the queue;
  - why Redis has exactly three jobs;
  - why Go owns the money;
  - why orders are limit-only;
  - why not Kafka.
- **Guarantee tests required in CI from the first order-placement step:**
  - Concurrency: 100 goroutines spend one grant at once, and total spend never exceeds the cap.
  - Crash: kill the engine at every step of order placement; no duplicate orders, and everything reconciles.
  - Revoke race: revoke while an order is queued; the order is never sent.
  - Fault injection: the fake broker returns timeouts, 500 errors and lost replies.
  - Redis stopped: trading still works.
- **Fake broker (Go):** used by the tests and selectable as a "broker" in a **public demo**, so an interviewer can try the app with no real money.
- **OpenTelemetry:** one trace from tapping Approve → Hono → Postgres → Go → broker → status back on the phone.
- **k6 load test** on the free VM, with numbers published in the README, e.g. "one free 4-core ARM VM handles N approvals/s, p95 M ms from approval to broker acknowledgement".

**30-second pitch:** *"A family investing app where a head can trade on members' accounts across brokers, but every member stays in control. Two services, split by who owns the money: Hono for the product, Go for every broker call. Postgres is the only link between them, through a transactional outbox, so an approval and its order can't come apart. I proved the guarantees with crash and race tests in CI, measured it on one free VM, and wrote down when I'd add Redis or Kafka, and why I haven't."*

---

## 9. Launch path beyond stage 0 (not being built)

| Stage | What | Needs |
|---|---|---|
| 0. Family (now) | Everything in this doc | Written request to each broker to map the family to the shared static IP |
| 1. Public, read-only | Household view, tools | CAS upload or broker read-only access, DPDP Act privacy policy and consent, a registered company. No SEBI licence. |
| 2. Public trading (mode 1 only) | Head proposes, member approves | smallcase Gateway (about 20 brokers; may require a registered partner, so ask) or own NSE empanelment |
| 3. Strategies, mutual funds, advice | Rankings, mutual funds, human advisor | Research Analyst licence; AMFI distributor registration or a partner; an adviser holding the licence |

- **Before stage 2:** a few hours with a SEBI-compliance lawyer.
- **Dhan:** check its terms on sharing credentials (not found during planning).

---

## 10. Build order

Each step is shippable.

| # | Step | Includes |
|---|---|---|
| 0 | **Foundation** | Monorepo, Docker Compose (Postgres, Valkey), goose/sqlc/Drizzle, CI, Sentry + OTel + Grafana, first ADRs, Oracle VM + Caddy + WAL-G + restore test. **Apply to Dhan (Partner ID) and mStock (platform key) now; approval may take weeks.** |
| 1 | **Accounts** | Sign-up, passkeys, sessions, login on web and app |
| 2 | **Families** | Invites, relationships, roles, leave/remove/handover, visibility, audit log |
| 3 | **Engine foundation** | Outbox and job runner, fake broker, broker interface, sealed credentials, Dhan and mStock stored-credential login, holdings sync, price feed into Redis |
| 4 | **Household view** | Ledger, per-member valuation cache, SSE live updates (web first) |
| 5 | **Baskets and mode 1** | Approvals in the app, push, price band, limit orders, idempotency, reconciler, circuit breaker, kill switches, invariant checker, all the guarantee tests |
| 6 | **Mode 2 grants** | Caps, expiry, revoke, a notification for every trade |
| 7 | **Proof** | k6 numbers, end-to-end traces, public demo on the fake broker, README |
| 8 | **Broker redirect login** | Dhan consent and mStock partner login |
| 9 | **Assistant (v1.5)** | Finance tools, projection, Ollama, test set |

**Real money is first used after step 5,** on the family's own accounts, with small amounts and a low global cap.

---

## 11. Decision log

| # | Decision |
|---|---|
| Q1 | v1 is stage 0 only: everything works, but only for the developer's family |
| Q2 | Both login methods offered: stored credentials and broker login, behind one `BrokerLogin` interface |
| Q3 | Many broker accounts per person |
| Q4 | One family per person at a time |
| Q5 | Exactly one head, who is also a normal member |
| Q6 | The head invites; members set their own password and link their own broker |
| Q7 | Everything is a basket (manual trades now; strategy baskets later) |
| Q8 | Approvals on the phone (Expo app; originally a PWA); a dedicated app possible later |
| Q9 | AI assistant only for now; human advisor role later |
| Q10 | Assistant is read-only |
| Q11 | Assistant never names securities; it is not a proper advisor |
| Q12 | Manual ledger for non-broker assets and liabilities |
| Q13 | Assistant comes after mode 1 works (v1.5) |
| Q14 | Member picks the login method per broker account; broker login is the default |
| Q15 | Stored credentials log in automatically; passkey needed to link/view/change credentials and to approve |
| Q16 | No session on trade day → push, then carry over; never fall back to stored credentials |
| Q17 | Mode 2 limits as in section 2 |
| Q18 | Standing approval for strategy rebalances (deferred along with strategies, per Q43) |
| Q19 | Head sees everything not hidden; members see their own data plus totals |
| Q20 | Strategy per broker account (deferred along with strategies) |
| Q21 | Every user is at least a household of one |
| Q22 | Approval locks a ±1% price band, valid until the end of the trading day |
| Q23 | Family trades always use LIMIT orders at the latest price ± the band |
| Q24 | Assistant sees exactly what the asker sees; hidden items excluded from totals |
| Q25 | Assistant chats are private |
| Q26 | Append-only family audit log |
| Q27 | Leaving cancels everything; the head loses access, including history |
| Q28 | The head can remove members |
| Q29 | The head hands over the role before leaving; deleting the account dissolves the family |
| Q30 | The admin can't view or edit credentials, only revoke them |
| Q31 | Ledger types, EMIs, monthly income and expenses |
| Q32 | Assistant sees amounts invested but not strategy holdings; it also projects year-end at the current run rate |
| Q33 | All assistant numbers come from deterministic tools |
| Q34 | Assistant usage caps; local models are an option |
| Q35 | Relationship recorded; trading only for SEBI family relations, others view-only |
| Q36 | No minors |
| Q37 | Invites: single-use, tied to an email, 7 days, revocable |
| Q38 | Year-end projection as a three-scenario range |
| Q39 | `AssistantModel` interface, gated by a test set |
| Q40 | New project from scratch, not inside Vestico |
| Q41 | No factory workflow |
| Q42 | Vestico keeps running, fixes only |
| Q43 | No strategies or rebalancer in v1 |
| Q44 | Nothing reused from Vestico |
| Q45 | Bun + Hono, Postgres-based jobs, Expo (Android), Turbo monorepo with `apps/web` (Next.js) |
| Q46 | Working name Bargad (name risk noted in section 1) |
| Q47 | New user accounts; everything new |
| Q48 | The design doc lives in the new repo |
| Q49 | Managed Postgres in AWS Mumbai (superseded for now by Q56, the $0 budget) |
| Q50 | Invariant checker and kill switches ship with the first order |
| Q51 | No deploys 09:00–15:30 IST unless overridden |
| Q52 | Hono = product, Go = money; only Go calls brokers |
| Q53 | Services talk only through Postgres |
| Q54 | goose SQL migrations are the single schema source (sqlc for Go, Drizzle pull for TS) |
| Q55 | Credentials sealed with Go's public key |
| Q56 | Stage 0 on one Oracle Always Free VM |
| Q57 | Local model (Ollama) for the assistant until there's a budget |
| Q58 | Android first |
| Q59 | Live order status: SSE fed by `LISTEN/NOTIFY` |
| Q60 | Monitoring off the server |
| Q61 | WAL-G with weekly restore tests |
| Q62 | (Replaced by Q67–Q69) |
| Q63 | ADRs, including rejected options |
| Q64 | Guarantee tests required in CI |
| Q65 | Fake broker plus public demo |
| Q66 | OpenTelemetry through the outbox; published k6 numbers |
| Q67 | Redis does exactly three jobs: prices/ticks, per-member valuation cache, hot rate limits |
| Q68 | Redis is never on the money path; CI test with Redis stopped |
| Q69 | Redis as a pure cache: no persistence, TTLs, `volatile-lru`, hit rate on the dashboard |
| Q70 | Everything on the web except approvals and passkey sign-off (phone only) |
| Q71 | Build order as in section 10 |
| Q72 | Relationships are declared relative to the head: a handover revokes all grants and resets every relationship, pausing trading until each member re-declares |
| Q73 | A mode 1 basket that can't run today needs a new approval tomorrow; grant baskets carry over while the grant is active |
| Q74 | Grant spend is counted when an order is placed and never given back, even if the order doesn't fill |
| Q75 | A basket belongs to one member and may span their broker accounts; one approval covers it |
| Q76 | Two Postgres roles (`bargad_api`, `bargad_engine`) enforce Q52 in the database: the API can't read credentials or write orders and spend, and the engine can't read passwords or sessions |
| Q77 | `audit_log` is the only history table: the live approval sits on the basket, notifications are audit rows delivered as push jobs, and an order's status lives on the order. The band is a CHECK on `orders` |

## 12. Open items

- **Name:** search the official IP India registry for "Bargad" in classes 9 and 36, and decide how to handle the Bargad Wealth conflict before any public launch.
- **Brokers:**
  - Apply for the Dhan Partner ID and the mStock platform key.
  - Ask both, in writing, about mapping the family's accounts to one static IP and about storing credentials.
  - Confirm how each handles API market orders.
- **Regulation:** read NSE/INVG/70309 and NSE/INVG/73992.
- **Hosting:** confirm the current Oracle Always Free limits and whether Mumbai or Hyderabad capacity is available.
