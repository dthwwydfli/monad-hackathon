export const PACT_STATE = {
  Open: 0,
  Claimed: 1,
  Submitted: 2,
  Released: 3,
  Cancelled: 4,
  Reclaimed: 5,
} as const;

export type PactStateValue = (typeof PACT_STATE)[keyof typeof PACT_STATE];

export type PactData = {
  id: number;
  maintainer: `0x${string}`;
  contributor: `0x${string}`;
  bountyWei: bigint;
  claimDeadline: bigint;
  workDeadline: bigint;
  state: PactStateValue;
  issueUrl: string;
  acceptance: string;
  proofUrl: string;
};

export type WalletRole = "none" | "maintainer" | "contributor" | "other";

export function getWalletRole(address: `0x${string}` | undefined, pact: PactData): WalletRole {
  if (!address) return "none";
  if (address.toLowerCase() === pact.maintainer.toLowerCase()) return "maintainer";
  if (pact.contributor !== "0x0000000000000000000000000000000000000000") {
    if (address.toLowerCase() === pact.contributor.toLowerCase()) return "contributor";
  }
  return "other";
}

export const STATUS_LABELS: Record<PactStateValue, { label: string; shortLabel: string }> = {
  [PACT_STATE.Open]: { label: "OPEN / FUNDED", shortLabel: "Open" },
  [PACT_STATE.Claimed]: { label: "IN PROGRESS", shortLabel: "Claimed" },
  [PACT_STATE.Submitted]: { label: "AWAITING REVIEW", shortLabel: "Awaiting review" },
  [PACT_STATE.Released]: { label: "RELEASED", shortLabel: "Released" },
  [PACT_STATE.Cancelled]: { label: "CANCELLED", shortLabel: "Cancelled" },
  [PACT_STATE.Reclaimed]: { label: "RECLAIMED", shortLabel: "Reclaimed" },
};

export function parsePactFromContract(
  id: number,
  raw: {
    maintainer: string;
    contributor: string;
    bountyWei: bigint;
    claimDeadline: number | bigint;
    workDeadline: number | bigint;
    state: number;
    issueUrl: string;
    acceptance: string;
    proofUrl: string;
  },
): PactData {
  return {
    id,
    maintainer: raw.maintainer as `0x${string}`,
    contributor: raw.contributor as `0x${string}`,
    bountyWei: raw.bountyWei,
    claimDeadline: BigInt(raw.claimDeadline),
    workDeadline: BigInt(raw.workDeadline),
    state: raw.state as PactStateValue,
    issueUrl: raw.issueUrl,
    acceptance: raw.acceptance,
    proofUrl: raw.proofUrl,
  };
}

export const CONTRACT_ERROR_MESSAGES: Record<string, string> = {
  PactNotFound: "This pact does not exist.",
  ZeroBounty: "The bounty must be greater than zero.",
  EmptyIssueUrl: "Issue URL is required.",
  EmptyAcceptance: "Acceptance sentence is required.",
  EmptyProofUrl: "Proof URL is required.",
  FieldTooLong: "One of the fields is too long for the contract.",
  InvalidDeadline: "Deadlines are invalid. Work deadline must be after claim deadline.",
  InvalidPactState: "This action is not allowed in the current pact state.",
  DeadlineExpired: "The deadline for this action has passed.",
  DeadlineNotReached: "The reclaim deadline has not been reached yet.",
  MaintainerCannotClaim: "The maintainer cannot claim their own pact.",
  NotMaintainer: "Only the maintainer can perform this action.",
  NotContributor: "Only the assigned contributor can perform this action.",
  DirectTransferDisabled: "Direct transfers to the contract are disabled.",
  TransferFailed: "The Testnet MON transfer failed.",
};

export function mapContractError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  for (const [key, text] of Object.entries(CONTRACT_ERROR_MESSAGES)) {
    if (message.includes(key)) return text;
  }
  if (message.includes("User rejected")) {
    return "Nothing changed. You can try again when ready.";
  }
  return "Something went wrong. You can try again when ready.";
}
