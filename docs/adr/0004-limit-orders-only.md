# 4. Family trades are always limit orders

Status: accepted, 2026-10-29

## Context

Brokers handle API market orders differently under the algo framework: some convert them to protected limit orders, some reject them. NSE's retail algo FAQ says algo market orders are not permitted. A member who approves a basket approves it at a price.

## Decision

Every order placed through family features is a LIMIT order priced at the latest price ± the approval's band (±1% by default). Raw MARKET orders are never sent, whatever the broker allows.

## Alternatives

- **Market orders where the broker allows them.** Rejected: behaviour would differ by broker, and approval at any price isn't approval.

## Revisit when

A member-level setting for "any price within the circuit" is needed, e.g. for strategy rebalances. That would be an explicit grant setting, never a default.
