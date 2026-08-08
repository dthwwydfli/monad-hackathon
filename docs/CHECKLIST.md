# commit — Pre-submission checklist

See [SUBMISSION_CHECKLIST.md](./SUBMISSION_CHECKLIST.md) for the full gate list.

On-chain contract name remains `MergePact.sol`; the app product name is **commit**.

## Quick deploy

```bash
# 1. Fund deployer wallet on Monad Testnet (needs ~0.6 MON for deploy gas)
# 2. Deploy contract
cd packages/foundry
source .env
forge script script/DeployMergePactBroadcast.s.sol:DeployMergePactBroadcast \
  --rpc-url https://testnet-rpc.monad.xyz --broadcast

# 3. Generate frontend ABIs
node scripts-js/generateTsAbis.js

# 4. Set contract address
echo 'NEXT_PUBLIC_MERGEPACT_CONTRACT_ADDRESS=0x...' >> ../nextjs/.env.local

# 5. Run app
cd ../..
yarn start
```

## Demo rehearsal

- **No wallet:** homepage or `/how-it-works` Try it simulation (fund → claim → proof → receipt)
- Browser A: maintainer wallet — create commit, release
- Browser B: contributor wallet — claim, submit proof
- Browser C or projector: `/wall` — live updates
