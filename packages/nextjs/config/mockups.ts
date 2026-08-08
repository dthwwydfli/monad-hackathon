import { PACT_STATE, PactStateValue } from "~~/lib/pact";

export type MockPact = {
  id: number;
  issueUrl: string;
  acceptance: string;
  bountyMon: string;
  maintainer: string;
  contributor: string;
  state: PactStateValue;
  claimDeadline: string;
  workDeadline: string;
  proofUrl?: string;
};

export type MockPulseEvent = {
  id: string;
  message: string;
  timestamp: string;
};

export const MOCK_SUMMARY = {
  open: 2,
  claimed: 1,
  review: 1,
  released: 2,
  totalBountyMon: "3.45",
};

export const MOCK_PACTS: MockPact[] = [
  {
    id: 101,
    issueUrl: "https://github.com/monad-developers/docs/issues/12",
    acceptance: "Add a getting-started guide for testnet faucet setup with screenshots.",
    bountyMon: "0.50",
    maintainer: "0x7a3f…c91e",
    contributor: "0x0000…0000",
    state: PACT_STATE.Open,
    claimDeadline: "Aug 15, 2026",
    workDeadline: "Aug 22, 2026",
  },
  {
    id: 102,
    issueUrl: "https://github.com/mergepact/demo/issues/7",
    acceptance: "Fix pagination on the pact board when more than 20 entries exist.",
    bountyMon: "0.25",
    maintainer: "0x4b2e…8a01",
    contributor: "0x0000…0000",
    state: PACT_STATE.Open,
    claimDeadline: "Aug 12, 2026",
    workDeadline: "Aug 19, 2026",
  },
  {
    id: 103,
    issueUrl: "https://github.com/monad-developers/sdk/issues/34",
    acceptance: "Implement typed contract read helpers for MergePact state queries.",
    bountyMon: "0.75",
    maintainer: "0x7a3f…c91e",
    contributor: "0x9c1d…4f82",
    state: PACT_STATE.Claimed,
    claimDeadline: "Aug 10, 2026",
    workDeadline: "Aug 17, 2026",
  },
  {
    id: 104,
    issueUrl: "https://github.com/mergepact/demo/issues/3",
    acceptance: "Add proof URL validation for GitHub pull request links only.",
    bountyMon: "0.15",
    maintainer: "0x4b2e…8a01",
    contributor: "0x2e8a…b103",
    state: PACT_STATE.Submitted,
    claimDeadline: "Aug 8, 2026",
    workDeadline: "Aug 14, 2026",
    proofUrl: "https://github.com/mergepact/demo/pull/18",
  },
  {
    id: 105,
    issueUrl: "https://github.com/monad-developers/docs/issues/8",
    acceptance: "Document the full pact lifecycle with sequence diagrams.",
    bountyMon: "1.00",
    maintainer: "0x7a3f…c91e",
    contributor: "0x5f3c…d291",
    state: PACT_STATE.Released,
    claimDeadline: "Aug 1, 2026",
    workDeadline: "Aug 8, 2026",
    proofUrl: "https://github.com/monad-developers/docs/pull/45",
  },
  {
    id: 106,
    issueUrl: "https://github.com/mergepact/demo/issues/1",
    acceptance: "Prototype the live wall projection layout for hackathon demo.",
    bountyMon: "0.80",
    maintainer: "0x4b2e…8a01",
    contributor: "0x1a7b…e504",
    state: PACT_STATE.Released,
    claimDeadline: "Jul 28, 2026",
    workDeadline: "Aug 4, 2026",
    proofUrl: "https://github.com/mergepact/demo/pull/12",
  },
  {
    id: 107,
    issueUrl: "https://github.com/monad-developers/cli/issues/22",
    acceptance: "Add `--network testnet` flag to deployment scripts.",
    bountyMon: "0.30",
    maintainer: "0x7a3f…c91e",
    contributor: "0x0000…0000",
    state: PACT_STATE.Cancelled,
    claimDeadline: "Jul 20, 2026",
    workDeadline: "Jul 27, 2026",
  },
];

export const MOCK_TIMELINE = [
  { step: "Funded", label: "Maintainer locks MON", timestamp: "Aug 1, 10:42", active: true },
  { step: "Claimed", label: "Contributor commits", timestamp: "Aug 2, 14:18", active: true },
  { step: "Proof", label: "PR submitted on GitHub", timestamp: "Aug 5, 09:03", active: true },
  { step: "Released", label: "Bounty sent on-chain", timestamp: "Aug 6, 16:55", active: true },
];

export const MOCK_PULSE: MockPulseEvent[] = [
  { id: "1", message: "Pact #105 released — 1.00 MON to 0x5f3c…d291", timestamp: "2m ago" },
  { id: "2", message: "Pact #104 proof submitted — awaiting review", timestamp: "18m ago" },
  { id: "3", message: "Pact #103 claimed by 0x9c1d…4f82", timestamp: "1h ago" },
  { id: "4", message: "Pact #102 funded — 0.25 MON locked", timestamp: "3h ago" },
];

export const MOCK_DETAIL = MOCK_PACTS.find(p => p.state === PACT_STATE.Submitted)!;
