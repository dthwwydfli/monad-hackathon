import { MOCK_PACTS } from "~~/config/mockups";
import { PactData } from "~~/lib/pact";

/**
 * Demo pacts derive from the same `MOCK_PACTS` the /preview route uses, so
 * there is exactly one set of illustrative data in the codebase.
 *
 * These are ONLY rendered when the contract is unconfigured or the ledger is
 * genuinely empty, and every card built from them must carry a visible
 * "EXAMPLE — NOT LIVE" stamp. docs/BRAND.md forbids unlabelled sample data on
 * chain-backed routes, and that label is what keeps this compliant.
 */

const ZERO = "0x0000000000000000000000000000000000000000" as const;

/** Mock addresses are display-shortened ("0x7a3f…c91e"), so pad to a real shape. */
function toAddress(display: string): `0x${string}` {
  const hex = display.replace(/[^0-9a-fA-F]/g, "");
  return `0x${hex.padEnd(40, "0").slice(0, 40)}` as `0x${string}`;
}

function toWei(mon: string): bigint {
  const [whole, fraction = ""] = mon.split(".");
  return BigInt(whole + fraction.padEnd(18, "0").slice(0, 18));
}

function toUnix(date: string): bigint {
  return BigInt(Math.floor(new Date(date).getTime() / 1000));
}

export const DEMO_PACTS: PactData[] = MOCK_PACTS.map(mock => ({
  id: mock.id,
  maintainer: toAddress(mock.maintainer),
  contributor: mock.contributor.startsWith("0x0000") ? ZERO : toAddress(mock.contributor),
  bountyWei: toWei(mock.bountyMon),
  claimDeadline: toUnix(mock.claimDeadline),
  workDeadline: toUnix(mock.workDeadline),
  state: mock.state,
  issueUrl: mock.issueUrl,
  acceptance: mock.acceptance,
  proofUrl: mock.proofUrl ?? "",
}));

export const DEMO_COUNTS = {
  open: DEMO_PACTS.filter(p => p.state === 0).length,
  claimed: DEMO_PACTS.filter(p => p.state === 1).length,
  review: DEMO_PACTS.filter(p => p.state === 2).length,
  released: DEMO_PACTS.filter(p => p.state === 3).length,
};
