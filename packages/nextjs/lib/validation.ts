const MAX_ISSUE_URL_BYTES = 180;
const MAX_ACCEPTANCE_BYTES = 140;
const MAX_PROOF_URL_BYTES = 220;

export function byteLength(value: string): number {
  return new TextEncoder().encode(value).length;
}

export function isValidGithubIssueUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname === "github.com" && url.length > 0;
  } catch {
    return false;
  }
}

export function isValidProofUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (parsed.protocol === "https:" || parsed.protocol === "http:") && url.length > 0;
  } catch {
    return false;
  }
}

export function validateCreateForm(input: {
  issueUrl: string;
  acceptance: string;
  bountyMon: string;
  claimDeadline: Date;
  workDeadline: Date;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  const now = Date.now();
  const minMs = 15 * 60 * 1000;
  const maxMs = 7 * 24 * 60 * 60 * 1000;

  if (!isValidGithubIssueUrl(input.issueUrl)) {
    errors.issueUrl = "Enter a valid https://github.com/ issue URL.";
  } else if (byteLength(input.issueUrl) > MAX_ISSUE_URL_BYTES) {
    errors.issueUrl = `Issue URL must be ${MAX_ISSUE_URL_BYTES} bytes or less.`;
  }

  if (input.acceptance.trim().length < 10) {
    errors.acceptance = "Acceptance sentence must be at least 10 characters.";
  } else if (byteLength(input.acceptance) > MAX_ACCEPTANCE_BYTES) {
    errors.acceptance = `Acceptance must be ${MAX_ACCEPTANCE_BYTES} bytes or less.`;
  }

  const bounty = parseFloat(input.bountyMon);
  if (Number.isNaN(bounty) || bounty <= 0) {
    errors.bountyMon = "Enter a bounty greater than zero.";
  } else if (bounty > 5) {
    errors.bountyMon = "Demo bounty cannot exceed 5 Testnet MON.";
  }

  const claimMs = input.claimDeadline.getTime() - now;
  const workMs = input.workDeadline.getTime() - now;

  if (claimMs < minMs || claimMs > maxMs) {
    errors.claimDeadline = "Claim deadline must be 15 minutes to 7 days from now.";
  }
  if (workMs <= claimMs) {
    errors.workDeadline = "Work deadline must be later than the claim deadline.";
  } else if (workMs > maxMs) {
    errors.workDeadline = "Work deadline cannot be more than 7 days from now.";
  }

  return errors;
}

export function validateProofUrl(proofUrl: string): string | undefined {
  if (!isValidProofUrl(proofUrl)) {
    return "Enter a valid public URL.";
  }
  if (byteLength(proofUrl) > MAX_PROOF_URL_BYTES) {
    return `Proof URL must be ${MAX_PROOF_URL_BYTES} bytes or less.`;
  }
  return undefined;
}

export function parseIssuePath(issueUrl: string): string {
  try {
    const parsed = new URL(issueUrl);
    return parsed.pathname.replace(/^\//, "");
  } catch {
    return issueUrl;
  }
}
