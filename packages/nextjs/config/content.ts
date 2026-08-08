export const content = {
  productName: "commit",
  eyebrow: "MONAD TESTNET · FUNDED GITHUB ISSUES",
  heroEyebrow: "MONAD TESTNET · FUNDED GITHUB ISSUES",
  heroHeadline: "Get paid for GitHub work that's already funded.",
  heroBody:
    "Put test tokens on an issue. Claim it, ship the fix on GitHub, post a proof link, and get paid when the maintainer releases it — all visible on-chain.",
  headline: "Fund the issue. Everyone can see it.",
  body: "commit is a public bounty board for GitHub issues. GitHub is where you review the code. The chain shows who funded what, who claimed it, and whether it was paid.",
  testnetNote: "Prototype only. Testnet MON has no cash value.",
  publicDataWarning:
    "Issue URL, what counts as done, and proof URL are public on Monad Testnet. Do not include passwords, private links, personal data, or secrets.",
  proofWarning: "This URL becomes public. Do not link to a private repo, customer data, or anything with secrets.",
  createDisclaimer: "This creates a public testnet record. It is not a legal agreement or real payment.",
  exampleLedger: "EXAMPLE, NOT LIVE",
  ledgerNotConfigured: "Board not configured yet.",
  emptyBoard: "No funded issues yet. Be the first to post one.",
  showingLatest: "Latest funded issues",
  placeholders: {
    issueUrl: "https://github.com/org/repo/issues/42",
    acceptance: "Done when the receipt page shows a confirmed state after a contract write.",
  },
  demo: {
    eyebrow: "TRY IT — NOTHING IS REAL",
    headline: "Two sides. Play both.",
    body: "Fund an issue on the left, take it on from the right. Type any GitHub URL and any amount — this whole panel is a simulation, so nothing here touches a wallet or the chain.",
    stamp: "SIMULATION — NOT LIVE",
    disclaimer:
      "Simulated end to end. On Monad Testnet there is no AI reviewer and no auto-payout: a human maintainer reads the proof on GitHub and releases the bounty themselves.",
    fund: {
      side: "Maintainer",
      title: "Fund the issue",
      lead: "Point at an issue, say what done means, put testnet tokens behind it.",
      useExample: "Use an example",
      submit: "Lock the bounty",
      signing: "Signing…",
      confirming: "Confirming on Monad Testnet…",
      fundedNote: "Bounty is held by the contract. Nobody can spend it elsewhere.",
    },
    solve: {
      side: "Contributor",
      title: "Take on the issue",
      lead: "Claim it, ship the work on GitHub, then post the link as proof.",
      dormant: "Waiting for a funded issue. Fund one on the left and it lands here.",
      claim: "Claim this issue",
      claiming: "Claiming…",
      proofLabel: "Proof URL",
      proofPlaceholder: "https://github.com/org/repo/pull/45",
      verify: "Verify with AI",
      releasing: "Releasing bounty…",
      replay: "Run it again",
    },
    scan: {
      title: "AI review",
      running: "Reviewing your work",
      verdict: "VERIFIED",
      verdictNote: "Proof matches the acceptance criteria. Releasing the bounty.",
    },
    receipt: {
      title: "Payout receipt",
      paid: "Paid",
      from: "From",
      to: "To",
      issue: "Issue",
      proof: "Proof",
      verdict: "AI verdict",
      confidence: "Confidence",
      tx: "Transaction",
      settled: "Settled",
    },
  },
  howItWorks: {
    steps: [
      {
        title: "Fund the issue.",
        body: "A maintainer locks Testnet MON on a GitHub issue and writes one sentence for what done looks like.",
        actor: "Maintainer",
        records: "Bounty amount, issue URL, done criteria, and two deadlines.",
        irreversible:
          "The tokens sit in the contract. The maintainer can cancel while nobody has claimed, but cannot spend them elsewhere.",
      },
      {
        title: "Claim the work.",
        body: "A contributor sees the funded issue and claims it.",
        actor: "Contributor",
        records: "The contributor's wallet address, tied to this issue.",
        irreversible: "One person per issue. Public and exclusive — nobody else can claim, and you cannot un-claim.",
      },
      {
        title: "Post the proof.",
        body: "After shipping on GitHub, the contributor pastes a public PR or commit URL.",
        actor: "Contributor",
        records: "A public proof URL with a timestamp on-chain.",
        irreversible: "Once proof is in, the maintainer cannot take the bounty back on the work deadline.",
      },
      {
        title: "Release the bounty.",
        body: "The maintainer reviews on GitHub and sends the locked Testnet MON to the contributor.",
        actor: "Maintainer",
        records: "The payment and the final status.",
        irreversible: "Done. The bounty has moved and nobody can edit the record.",
      },
    ],
    branches: [
      {
        title: "Nobody claims it",
        body: "The maintainer cancels while the issue is still open, or gets the tokens back after the claim deadline. Either way, the money returns.",
      },
      {
        title: "The contributor goes quiet",
        body: "If no proof shows up before the work deadline, the maintainer gets the bounty back. The record stays public.",
      },
    ],
    limitation:
      "commit is a testnet demo. It does not read your code, guarantee quality, settle disputes, or create a legal agreement.",
    noDispute:
      "There is no reject button. After proof is submitted, the maintainer cannot reclaim on the deadline — unreleased bounty stays locked until they release it. People judge the work; the chain only records what happened.",
    githubNote:
      "GitHub is where you review the code. Monad Testnet shows who funded what, who claimed it, and whether it was paid.",
  },
} as const;
