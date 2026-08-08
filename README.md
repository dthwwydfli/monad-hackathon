# commit

A public bounty board for GitHub issues on Monad testnet. A maintainer funds an issue; a contributor claims it, posts proof, and gets Testnet MON when the maintainer releases it.

**Prototype only. Testnet MON has no cash value.**

The on-chain contract is `MergePact.sol`; **commit** is the product name in the UI.

## Problem → solution

| Pain | commit |
| --- | --- |
| Contributors can't verify a bounty is real | Maintainer locks Testnet MON in contract before anyone claims |
| No visible ownership of work | On-chain assignment + proof URL + release event |
| Trust requires a backend | Contract + events are the only source of truth |

## User journey

1. Maintainer connects wallet on Monad Testnet (chain `10143`) and funds an issue at `/create`.
2. Contributor browses open commits at `/pacts`, claims one, does work on GitHub.
3. Contributor submits a public proof URL; maintainer reviews on GitHub and releases bounty.
4. `/wall` shows live confirmed activity for demo observers.

Try the interactive simulation on `/` or `/how-it-works` — no wallet required.

## Local setup

Requirements: Node >= 20.18.3, Yarn 3, Foundry.

```bash
node .yarn/releases/yarn-3.2.3.cjs install
export PATH="$HOME/.foundry/bin:$PATH"
yarn foundry:test

yarn chain   # terminal 1
yarn deploy  # terminal 2

cp packages/nextjs/.env.example packages/nextjs/.env.local
# Set NEXT_PUBLIC_MERGEPACT_CONTRACT_ADDRESS after deploy

yarn start
```

## Monad Testnet deployment

```bash
cd packages/foundry
DEPLOYER_PRIVATE_KEY=0x... forge script script/DeployMergePactBroadcast.s.sol:DeployMergePactBroadcast \
  --rpc-url https://testnet-rpc.monad.xyz --broadcast
node scripts-js/generateTsAbis.js
```

Chain ID: `10143` · RPC: `https://testnet-rpc.monad.xyz`

## Contract address

Monad Testnet (`MergePact.sol`): `0x0091e2766bc15f02a058987fcb4afa114c7e88f8`

**Deploy status:** Simulated address from `DeployMergePactBroadcast` — broadcast pending. Fund deployer `0x82AF2e2D2b7805C55FFc97159b28A7cEb9d67ba6` via [Monad testnet faucet](https://testnet.monad.xyz/) (~0.15 MON more needed; ~0.28 MON total for deploy), then:

```bash
cd packages/foundry
source .env
forge script script/DeployMergePactBroadcast.s.sol:DeployMergePactBroadcast \
  --rpc-url https://testnet-rpc.monad.xyz --broadcast --legacy
node scripts-js/generateTsAbis.js
```

Set in `packages/nextjs/.env.local`:

- `NEXT_PUBLIC_MERGEPACT_CONTRACT_ADDRESS=0x0091e2766bc15f02a058987fcb4afa114c7e88f8`

Until broadcast succeeds, the live ledger on `/` may show zero counts or an RPC warning. The homepage **Try it** panel is a simulation and works without a configured contract.

## Test command

```bash
yarn foundry:test --match-contract MergePactTest
```

## Deployed app URL

**Status:** Not deployed — Vercel CLI token invalid locally. Authenticate then deploy:

```bash
cd packages/nextjs
vercel login
node ../../.yarn/releases/yarn-3.2.3.cjs vercel:yolo
```

Set `NEXT_PUBLIC_MERGEPACT_CONTRACT_ADDRESS` in the Vercel project environment before deploy.

## Known limitations

- No GitHub API integration; URLs are manual public evidence
- Maintainer manually approves release after off-chain review
- No dispute resolution or legal escrow
- Testnet MON has no cash value

## Docs

- [PRD](docs/PRD.md)
- [Design](docs/DESIGN.md)
- [Brand kit](docs/BRAND.md)
- [How it works](docs/HOW_IT_WORKS.md)
- [Demo script](docs/DEMO_SCRIPT.md)
- [Submission checklist](docs/SUBMISSION_CHECKLIST.md)

## Team credits

Monad Blitz London hackathon — **commit** (MergePact contract).
