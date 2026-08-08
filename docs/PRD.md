# MergePact — Product Requirements

**Product type:** Desktop-first, responsive Monad Testnet web application with one Solidity contract.

**Status:** Build specification for Monad Blitz London hackathon.

## Product promise

MergePact turns a GitHub issue into a small, funded, public work commitment. A maintainer locks Testnet MON against a clearly described issue. One contributor claims the work, submits a pull-request or commit URL as proof, and the maintainer releases the Testnet bounty after reviewing it on GitHub.

**Memorable thing:** "The issue is funded on-chain before I touch the code, and everyone can see exactly where the pact stands."

## MVP scope

**Build:** landing, public pact board, create-pact form, pact detail page, release receipt, live wall, how-it-works, one `MergePact.sol` contract.

**Do not build:** GitHub OAuth/API, webhooks, backend, database, marketplace, disputes, real MON, relayers, account abstraction.

## State machine

```
Open → Claimed (claimPact)
Open → Cancelled (cancelPact)
Open → Reclaimed (reclaimUnclaimed after claim deadline)
Claimed → Submitted (submitProof)
Claimed → Reclaimed (reclaimUnsubmitted after work deadline)
Submitted → Released (approveAndRelease)
```

## Contract interface

See [`packages/foundry/contracts/MergePact.sol`](../packages/foundry/contracts/MergePact.sol).

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing + live board preview |
| `/create` | Fund a pact |
| `/pacts` | Public board (default filter: Open) |
| `/pacts/[id]` | Pact detail + role actions |
| `/wall` | Live projection (no wallet) |
| `/how-it-works` | Four-step explainer |

## Disclosure

Prototype only. Testnet MON has no cash value. Not a legal agreement or real payment.

See [DESIGN.md](./DESIGN.md), [DEMO_SCRIPT.md](./DEMO_SCRIPT.md), [SUBMISSION_CHECKLIST.md](./SUBMISSION_CHECKLIST.md).
