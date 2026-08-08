# MergePact

Public, Testnet-only work commitments on Monad. A maintainer funds a GitHub issue; a contributor claims it, submits proof, and receives Testnet MON when approved.

**Prototype only. Testnet MON has no cash value.**

## Problem → solution

| Pain | MergePact |
| --- | --- |
| Contributors can't verify a bounty is real | Maintainer locks Testnet MON in contract before anyone claims |
| No visible ownership of work | On-chain assignment + proof URL + release event |
| Trust requires a backend | Contract + events are the only source of truth |

## User journey

1. Maintainer connects wallet on Monad Testnet (chain `10143`) and funds a pact at `/create`.
2. Contributor browses open pacts at `/pacts`, claims one, does work on GitHub.
3. Contributor submits a public proof URL; maintainer reviews on GitHub and releases bounty.
4. `/wall` shows live confirmed activity for demo observers.

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

Monad Testnet (MergePact): `0x0091e2766bc15f02a058987fcb4afa114c7e88f8`

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
- [Demo script](docs/DEMO_SCRIPT.md)
- [Submission checklist](docs/SUBMISSION_CHECKLIST.md)

## Team credits

Monad Blitz London hackathon — **MergePact**.
