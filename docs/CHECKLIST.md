# MergePact — Pre-submission checklist

See [SUBMISSION_CHECKLIST.md](./SUBMISSION_CHECKLIST.md) for the full gate list.

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
npm run start
```

## Demo rehearsal

- Browser A: maintainer wallet — create pact, release
- Browser B: contributor wallet — claim, submit proof
- Browser C or projector: `/wall` — live updates
