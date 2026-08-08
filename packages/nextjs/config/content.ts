export const content = {
  productName: "MERGE/PACT",
  eyebrow: "MONAD TESTNET · PUBLIC WORK COMMITMENTS",
  heroEyebrow: "MONAD TESTNET · OPEN ENGINEERING LEDGER",
  heroHeadline: "Get paid for GitHub work that's already funded.",
  heroBody:
    "A maintainer locks Testnet MON against an issue. You claim it, ship proof on GitHub, and receive the bounty when it's released on-chain.",
  headline: "Fund the fix. Make the pact visible.",
  body: "MergePact records a small software commitment from funded issue to confirmed release. GitHub holds the code. Monad holds the pact.",
  testnetNote: "Prototype only. Testnet MON has no cash value.",
  publicDataWarning:
    "Issue URL, acceptance sentence and proof URL are public on Monad Testnet. Do not include passwords, internal links, personal data or private code.",
  proofWarning:
    "This URL becomes public in the pact. Do not include a private repository link, customer data, secret, or access token.",
  createDisclaimer: "This creates a public Monad Testnet pact. It is not a legal agreement or real payment.",
  exampleLedger: "EXAMPLE LEDGER, NOT LIVE",
  ledgerNotConfigured: "Ledger not configured yet.",
  emptyBoard: "No pacts are live yet. Fund the first clear issue.",
  showingLatest: "Showing latest pacts",
  placeholders: {
    issueUrl: "https://github.com/org/repo/issues/42",
    acceptance: "Show confirmed receipt state after a contract write.",
  },
  howItWorks: {
    steps: [
      { title: "Fund the issue.", body: "A maintainer locks Testnet MON and publishes one acceptance sentence." },
      { title: "Claim the work.", body: "A contributor sees the funded pact and claims it on-chain." },
      { title: "Record the proof.", body: "After work on GitHub, the contributor submits a public proof URL." },
      { title: "Release the Testnet bounty.", body: "The maintainer reviews on GitHub and releases the locked MON." },
    ],
    limitation:
      "MergePact is a Testnet prototype. It does not inspect code, guarantee outcome quality, settle disputes or create a legal agreement.",
    githubNote:
      "GitHub remains where work is reviewed. Monad Testnet keeps the funding, assignment, proof and release state public and shared.",
  },
} as const;
