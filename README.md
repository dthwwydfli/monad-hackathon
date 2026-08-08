# commit

A public bounty board for GitHub issues on Monad testnet. Maintainers fund issues. Contributors claim them, post proof, and get paid in Testnet MON when the maintainer approves.

**Prototype only. Testnet MON has no cash value.**

The on-chain contract is `MergePact.sol`. **commit** is the product name in the UI.

## How it works

1. **Fund the issue.** A maintainer locks Testnet MON on a GitHub issue and writes what "done" looks like at `/create`.
2. **Claim the work.** A contributor browses open bounties at `/pacts`, picks one, and claims it on-chain.
3. **Post proof.** After shipping on GitHub, the contributor pastes a public PR or commit URL.
4. **Release payment.** The maintainer reviews on GitHub and releases the locked Testnet MON.

GitHub is where you review the code. The chain shows who funded what, who claimed it, and whether it was paid.

## Why this exists

- Bounties are locked on-chain before anyone starts work
- Everyone can see who claimed what and whether it was paid
- No backend. The contract handles the money flow.

## Try it without a wallet

- `/` has an interactive demo and a live board preview
- `/how-it-works` walks through the four steps
- `/wall` shows live activity for demo observers

No wallet needed for any of the above.

## Run locally

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

## Deploy to Monad Testnet

Chain ID: `10143` · RPC: `https://testnet-rpc.monad.xyz`

```bash
cd packages/foundry
DEPLOYER_PRIVATE_KEY=0x... forge script script/DeployMergePactBroadcast.s.sol:DeployMergePactBroadcast \
  --rpc-url https://testnet-rpc.monad.xyz --broadcast
node scripts-js/generateTsAbis.js
```

Contract address (`MergePact.sol`): `0x0091e2766bc15f02a058987fcb4afa114c7e88f8`

Set in `packages/nextjs/.env.local`:

```
NEXT_PUBLIC_MERGEPACT_CONTRACT_ADDRESS=0x0091e2766bc15f02a058987fcb4afa114c7e88f8
```

## Deploy the frontend

```bash
cd packages/nextjs
vercel login
node ../../.yarn/releases/yarn-3.2.3.cjs vercel:yolo
```

Set `NEXT_PUBLIC_MERGEPACT_CONTRACT_ADDRESS` in the Vercel project environment before deploy.

## Tests

```bash
yarn foundry:test --match-contract MergePactTest
```

## Limitations

- No GitHub API integration. URLs are manual public evidence.
- Maintainer manually approves release after off-chain review.
- No dispute resolution or legal escrow.
- Testnet MON has no cash value.

## Docs

- [PRD](docs/PRD.md)
- [Design](docs/DESIGN.md)
- [Brand kit](docs/BRAND.md)
- [How it works](docs/HOW_IT_WORKS.md)
- [Demo script](docs/DEMO_SCRIPT.md)
- [Submission checklist](docs/SUBMISSION_CHECKLIST.md)

## Credits

Built for Monad Blitz London hackathon. **commit** (MergePact contract).
