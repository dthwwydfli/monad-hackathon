"use client";

import { useEffect, useMemo, useReducer } from "react";
import {
  DEMO_CONTRIBUTOR,
  DEMO_EXAMPLE,
  DEMO_MAINTAINER,
  ScanLine,
  TIMING,
  buildScanLines,
  fakeTxHash,
} from "./demoData";
import { useReducedMotion } from "framer-motion";
import { demo } from "~~/config/demo";
import { PACT_STATE, PactStateValue } from "~~/lib/pact";

export type DemoStage =
  | "draft"
  | "funding"
  | "open"
  | "claiming"
  | "claimed"
  | "verifying"
  | "verified"
  | "releasing"
  | "released";

export type DemoField = "issueUrl" | "acceptance" | "bountyMon" | "proofUrl";

type DemoState = {
  stage: DemoStage;
  /** Sub-phase of the funding transaction, so the button can say two things. */
  txPhase: "signing" | "confirming";
  issueUrl: string;
  acceptance: string;
  bountyMon: string;
  proofUrl: string;
  fundTx: string | null;
  claimTx: string | null;
  releaseTx: string | null;
  /** Number of AI review lines that have finished. */
  scanStep: number;
  settledAt: string | null;
};

type Action =
  | { type: "field"; field: DemoField; value: string }
  | { type: "example" }
  | { type: "fund" }
  | { type: "tx:confirm" }
  | { type: "funded"; tx: string }
  | { type: "claim" }
  | { type: "claimed"; tx: string }
  | { type: "verify" }
  | { type: "scan:tick" }
  | { type: "verified" }
  | { type: "release" }
  | { type: "released"; tx: string; at: string }
  | { type: "reset" };

const INITIAL: DemoState = {
  stage: "draft",
  txPhase: "signing",
  issueUrl: "",
  acceptance: "",
  bountyMon: demo.defaultBountyMon,
  proofUrl: "",
  fundTx: null,
  claimTx: null,
  releaseTx: null,
  scanStep: 0,
  settledAt: null,
};

function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case "field":
      return { ...state, [action.field]: action.value };
    case "example":
      return {
        ...state,
        issueUrl: DEMO_EXAMPLE.issueUrl,
        acceptance: DEMO_EXAMPLE.acceptance,
        bountyMon: DEMO_EXAMPLE.bountyMon,
      };
    case "fund":
      return { ...state, stage: "funding", txPhase: "signing" };
    case "tx:confirm":
      return { ...state, txPhase: "confirming" };
    case "funded":
      return { ...state, stage: "open", fundTx: action.tx };
    case "claim":
      return { ...state, stage: "claiming" };
    case "claimed":
      return { ...state, stage: "claimed", claimTx: action.tx };
    case "verify":
      return { ...state, stage: "verifying", scanStep: 0 };
    case "scan:tick":
      return { ...state, scanStep: state.scanStep + 1 };
    case "verified":
      return { ...state, stage: "verified" };
    case "release":
      return { ...state, stage: "releasing" };
    case "released":
      return { ...state, stage: "released", releaseTx: action.tx, settledAt: action.at };
    case "reset":
      return { ...INITIAL };
  }
}

/** The contract state each demo stage corresponds to, so the real stamp can be reused. */
export function stageToPactState(stage: DemoStage): PactStateValue {
  switch (stage) {
    case "draft":
    case "funding":
      return PACT_STATE.Open;
    case "open":
    case "claiming":
      return PACT_STATE.Open;
    case "claimed":
      return PACT_STATE.Claimed;
    case "verifying":
    case "verified":
    case "releasing":
      return PACT_STATE.Submitted;
    case "released":
      return PACT_STATE.Released;
  }
}

const FUNDED_STAGES: DemoStage[] = ["open", "claiming", "claimed", "verifying", "verified", "releasing", "released"];

export type DemoFlow = {
  state: DemoState;
  scanLines: ScanLine[];
  maintainer: string;
  contributor: string | null;
  pactState: PactStateValue;
  isFunded: boolean;
  activeSide: "fund" | "solve";
  setField: (field: DemoField, value: string) => void;
  useExample: () => void;
  fund: () => void;
  claim: () => void;
  verify: () => void;
  reset: () => void;
};

export function useDemoFlow(): DemoFlow {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const reduced = useReducedMotion();

  const scanLines = useMemo(() => buildScanLines(state.proofUrl, state.acceptance), [state.proofUrl, state.acceptance]);

  const { stage, txPhase, scanStep } = state;
  const lineCount = scanLines.length;

  // One pending timeout at a time, re-armed whenever the stage advances. Effect
  // cleanup covers unmount and reset, so a timer can never fire into a stage it
  // no longer belongs to.
  useEffect(() => {
    // Reduced motion keeps the whole sequence — it just stops being a
    // performance. Every beat still lands, four times faster.
    const pace = (ms: number) => (reduced ? Math.max(60, ms * 0.2) : ms);
    let timer: ReturnType<typeof setTimeout> | undefined;

    switch (stage) {
      case "funding":
        timer =
          txPhase === "signing"
            ? setTimeout(() => dispatch({ type: "tx:confirm" }), pace(TIMING.signing))
            : setTimeout(() => dispatch({ type: "funded", tx: fakeTxHash() }), pace(TIMING.confirming));
        break;
      case "claiming":
        timer = setTimeout(() => dispatch({ type: "claimed", tx: fakeTxHash() }), pace(TIMING.claiming));
        break;
      case "verifying":
        timer =
          scanStep < lineCount
            ? setTimeout(() => dispatch({ type: "scan:tick" }), pace(TIMING.scanLine))
            : setTimeout(() => dispatch({ type: "verified" }), pace(TIMING.verdictHold));
        break;
      case "verified":
        timer = setTimeout(() => dispatch({ type: "release" }), pace(TIMING.verdictHold));
        break;
      case "releasing":
        timer = setTimeout(
          () =>
            dispatch({
              type: "released",
              tx: fakeTxHash(),
              at: new Date().toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }),
            }),
          pace(TIMING.releasing),
        );
        break;
      default:
        break;
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [stage, txPhase, scanStep, lineCount, reduced]);

  return {
    state,
    scanLines,
    maintainer: DEMO_MAINTAINER,
    contributor:
      stage === "draft" || stage === "funding" || stage === "open" || stage === "claiming" ? null : DEMO_CONTRIBUTOR,
    pactState: stageToPactState(stage),
    isFunded: FUNDED_STAGES.includes(stage),
    activeSide: stage === "draft" || stage === "funding" ? "fund" : "solve",
    setField: (field, value) => dispatch({ type: "field", field, value }),
    useExample: () => dispatch({ type: "example" }),
    fund: () => dispatch({ type: "fund" }),
    claim: () => dispatch({ type: "claim" }),
    verify: () => dispatch({ type: "verify" }),
    reset: () => dispatch({ type: "reset" }),
  };
}
