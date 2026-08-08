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

Monad Testnet (MergePact): _fund deployer wallet (~0.6 MON) then deploy_

The broadcast script is ready at `packages/foundry/script/DeployMergePactBroadcast.s.sol`. After a successful deploy, run `node scripts-js/generateTsAbis.js` and set:

- `NEXT_PUBLIC_MERGEPACT_CONTRACT_ADDRESS` in `packages/nextjs/.env.local`

## Test command

```bash
yarn foundry:test --match-contract MergePactTest
```

## Deployed app URL

Deploy via `yarn vercel:yolo` and set `NEXT_PUBLIC_MERGEPACT_CONTRACT_ADDRESS` on Vercel.

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
