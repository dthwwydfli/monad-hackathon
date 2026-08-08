/**
 * Mock constants for the interactive landing demo. Nothing here touches a
 * wallet or the chain — the addresses and hashes are decorative and exist only
 * so the simulated flow reads like the real board. The same two addresses the
 * lifecycle example uses, so the two sections tell one consistent story.
 */
export const DEMO_MAINTAINER = "0x7a3f…c91e";
export const DEMO_CONTRIBUTOR = "0x9c1d…4f82";

export const DEMO_EXAMPLE = {
  issueUrl: "https://github.com/monad-developers/docs/issues/12",
  acceptance: "Add a getting-started guide for testnet faucet setup with screenshots.",
  bountyMon: "0.50",
  proofUrl: "https://github.com/monad-developers/docs/pull/45",
};

const HEX = "0123456789abcdef";

/**
 * Deterministic-looking but random hash. Only ever rendered as text, so a
 * cheap Math.random loop is enough — it never has to be a valid hash.
 */
export function fakeTxHash() {
  let out = "0x";
  for (let i = 0; i < 12; i += 1) out += HEX[Math.floor(Math.random() * 16)];
  out += "…";
  for (let i = 0; i < 4; i += 1) out += HEX[Math.floor(Math.random() * 16)];
  return out;
}

/** `https://github.com/org/repo/pull/45` → `org/repo`. Falls back for junk input. */
export function parseRepo(url: string) {
  const match = url.match(/github\.com\/([^/\s]+)\/([^/\s#?]+)/i);
  if (match) return `${match[1]}/${match[2]}`;
  return "monad-developers/docs";
}

/** Host of whatever the user typed, so the scan echoes their own input back. */
export function parseHost(url: string) {
  const match = url.match(/^(?:https?:\/\/)?([^/\s]+)/i);
  if (match) return match[1].replace(/^www\./, "");
  return "github.com";
}

export function truncate(text: string, max = 48) {
  const clean = text.trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1)}…`;
}

export type ScanLine = { label: string; result: string };

/**
 * The six review steps. Built from the user's own input so the console reads as
 * if it really went and looked at their link.
 */
export function buildScanLines(proofUrl: string, acceptance: string): ScanLine[] {
  return [
    { label: `Fetching ${parseHost(proofUrl)}`, result: "200 OK" },
    { label: `Resolving repository ${parseRepo(proofUrl)}`, result: "found" },
    { label: "Reading commits on the linked branch", result: "3 commits" },
    { label: "Diffing against acceptance criteria", result: truncate(acceptance) },
    { label: "Checking CI status", result: "passing" },
    { label: "Scoring match confidence", result: "0.94" },
  ];
}

export const DEMO_CONFIDENCE = "0.94";

/** Every dwell time in one place so the whole demo can be re-paced at once. */
export const TIMING = {
  signing: 700,
  confirming: 800,
  claiming: 900,
  scanLine: 640,
  verdictHold: 900,
  releasing: 1100,
} as const;
