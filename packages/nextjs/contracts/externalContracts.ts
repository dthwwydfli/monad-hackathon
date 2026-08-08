import deployedContracts from "~~/contracts/deployedContracts";
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const MONAD_TESTNET_CHAIN_ID = 10143;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const testnetAddress = process.env.NEXT_PUBLIC_MERGEPACT_CONTRACT_ADDRESS;
const mergePactAbiSource = deployedContracts[10143]?.MergePact;

function buildExternalContracts(): GenericContractsDeclaration {
  if (
    !testnetAddress ||
    testnetAddress === ZERO_ADDRESS ||
    !mergePactAbiSource ||
    !testnetAddress.startsWith("0x")
  ) {
    return {};
  }

  return {
    [MONAD_TESTNET_CHAIN_ID]: {
      MergePact: {
        address: testnetAddress as `0x${string}`,
        abi: mergePactAbiSource.abi,
        inheritedFunctions: mergePactAbiSource.inheritedFunctions ?? {},
      },
    },
  };
}

const externalContracts = buildExternalContracts();

export default externalContracts;
