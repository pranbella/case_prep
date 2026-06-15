import type { CaseStudy } from "@/lib/types";

// Meridian Bank - digital transformation / channel migration.
// Branch cost/txn $4.25, digital $0.10. Migrating 20M txns => savings (4.25-0.10)*20M = $83M.
export const digitalTransformationCase: CaseStudy = {
  id: "digital-meridian",
  type: "digital-transformation",
  title: "Meridian Bank: From Branch to App",
  company: "Meridian Bank",
  clientObjective:
    "Meridian Bank wants to cut cost-to-serve by shifting routine transactions from branches to digital channels. The COO needs the savings opportunity quantified and a view on the risks of moving too fast.",
  background:
    "Meridian processes 120M transactions a year, still heavily branch-based. Digital transactions cost a fraction of branch transactions. Leadership wants to migrate routine activity (deposits, transfers, balance checks) to the mobile app, but worries about alienating older customers and rural areas with weak connectivity.",
  exhibits: [
    {
      id: "ex-cost",
      kind: "table",
      title: "Exhibit 1: Cost per Transaction by Channel",
      note: "Use the current cost / transaction. Prior-period and peer-benchmark columns are for context only.",
      columns: [
        { key: "channel", label: "Channel" },
        { key: "cost", label: "Cost / transaction (now)" },
        { key: "prior", label: "3 years ago" },
        { key: "peer", label: "Peer benchmark" },
      ],
      data: [
        { channel: "Branch (teller)", cost: "$4.25", prior: "$3.90", peer: "$4.40" },
        { channel: "Call center", cost: "$2.40", prior: "$2.10", peer: "$2.55" },
        { channel: "ATM", cost: "$0.85", prior: "$0.80", peer: "$0.90" },
        { channel: "Digital (app/web)", cost: "$0.10", prior: "$0.14", peer: "$0.12" },
      ],
    },
    {
      id: "ex-mix",
      kind: "pie",
      title: "Exhibit 2: Current Transaction Mix (of 120M/yr)",
      note: "Routine transactions (deposits, transfers, balance checks) make up ~70% of branch volume.",
      categoryKey: "channel",
      valueKey: "share",
      data: [
        { channel: "Branch", share: 35 },
        { channel: "Call center", share: 15 },
        { channel: "ATM", share: 20 },
        { channel: "Digital", share: 30 },
      ],
    },
    {
      id: "ex-adopt",
      kind: "bar",
      title: "Exhibit 3: Digital Adoption & Satisfaction by Age",
      note: "% using the app and their app satisfaction score. Adoption skews young; satisfaction is high across ages.",
      categoryKey: "age",
      series: [
        { key: "adoption", label: "% using app" },
        { key: "csat", label: "App satisfaction (%)" },
      ],
      data: [
        { age: "18-34", adoption: 82, csat: 88 },
        { age: "35-54", adoption: 61, csat: 84 },
        { age: "55-69", adoption: 34, csat: 79 },
        { age: "70+", adoption: 12, csat: 72 },
      ],
    },
    {
      id: "ex-network",
      kind: "table",
      title: "Exhibit 4: Branch Network by Region",
      note: "Provided by real estate. Rural branches have the lowest transaction volume per branch.",
      columns: [
        { key: "region", label: "Region" },
        { key: "branches", label: "Branches" },
        { key: "staff", label: "Avg staff / branch" },
        { key: "rural", label: "% rural" },
      ],
      data: [
        { region: "Metro", branches: 180, staff: 9, rural: 5 },
        { region: "Suburban", branches: 140, staff: 6, rural: 12 },
        { region: "Rural", branches: 80, staff: 4, rural: 88 },
      ],
    },
  ],
  questions: [
    {
      id: "digital-q1",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: If Meridian migrates 20M routine transactions from branch to digital, what is the annual cost saving? Use Exhibit 1. Answer in dollars.",
      exhibitRefs: ["ex-cost"],
      timeLimitSec: 180,
      expectedValue: 83000000,
      tolerance: 100000,
      unitHint: "$",
      rubric:
        "Saving per txn = $4.25 - $0.10 = $4.15. Total = $4.15 x 20,000,000 = $83,000,000.",
      modelAnswer: "($4.25 - $0.10) x 20M = $4.15 x 20M = $83M.",
    },
    {
      id: "digital-q2",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: If Meridian raises digital's share from 30% to 50% of its 120M transactions (the increase coming out of the branch channel), what is the resulting annual cost saving? Use Exhibits 1 and 2. Answer in dollars.",
      exhibitRefs: ["ex-cost", "ex-mix"],
      timeLimitSec: 210,
      expectedValue: 99600000,
      tolerance: 600000,
      unitHint: "$",
      rubric:
        "Shift = (50% - 30%) x 120M = 24M transactions moved from branch ($4.25) to digital ($0.10). Saving = 24M x ($4.25 - $0.10) = 24M x $4.15 = $99.6M.",
      modelAnswer: "(0.20 x 120M) x ($4.25 - $0.10) = 24M x $4.15 = $99.6M.",
    },
    {
      id: "digital-q3",
      format: "single",
      dimension: "data",
      prompt:
        "Casey: Given Exhibit 1, which migration delivers the LARGEST saving per transaction moved?",
      exhibitRefs: ["ex-cost"],
      timeLimitSec: 75,
      options: [
        { id: "a", text: "Branch -> Digital ($4.15 saved per txn)" },
        { id: "b", text: "ATM -> Digital ($0.75 saved per txn)" },
        { id: "c", text: "Call center -> ATM ($1.55 saved per txn)" },
        { id: "d", text: "Call center -> Digital ($2.30 saved per txn)" },
      ],
      correctOptionIds: ["a"],
      rubric:
        "Branch->Digital saves the most per transaction ($4.15), and branch is also the largest non-digital pool — the priority migration.",
      modelAnswer: "Branch to digital, saving $4.15 per transaction moved.",
    },
    {
      id: "digital-q4",
      format: "multi",
      dimension: "structuring",
      prompt:
        "Casey: Before forcing migration, select the 3 factors most important to a responsible rollout.",
      exhibitRefs: [],
      selectCount: 3,
      timeLimitSec: 90,
      options: [
        { id: "a", text: "Which transaction types can be safely digitized" },
        { id: "b", text: "Customer segments at risk of being underserved (age, rural)" },
        { id: "c", text: "Digital reliability/security and support fallback" },
        { id: "d", text: "The color scheme of the mobile app icon" },
        { id: "e", text: "The CEO's favorite branch" },
        { id: "f", text: "Number of parking spots at HQ" },
      ],
      correctOptionIds: ["a", "b", "c"],
      rubric:
        "Responsible migration depends on what is digitizable (a), who could be excluded (b), and whether the digital channel is reliable/secure with a fallback (c).",
      modelAnswer:
        "What is safely digitizable, which segments risk exclusion, and digital reliability/security with a support fallback.",
    },
    {
      id: "digital-q5",
      format: "long-text",
      dimension: "judgment",
      prompt:
        "Casey: Recommend how Meridian should capture the savings while managing customer risk (3-6 lines).",
      exhibitRefs: ["ex-cost", "ex-mix"],
      timeLimitSec: 240,
      charLimit: 500,
      rubric:
        "Strong answers: prioritize migrating routine branch transactions (biggest $/txn and large pool), but use nudges/incentives rather than forcing it, keep branch/assisted options for vulnerable segments (older, rural), and invest in app reliability. Tie to the ~$83M opportunity. Penalize 'close all branches' bluntness that ignores customer risk.",
      modelAnswer:
        "Migrate routine branch transactions first — largest saving ($4.15/txn) and a 42M-txn pool worth tens of millions. Drive adoption with in-app nudges, fee differentials, and branch staff coaching rather than forced closure. Preserve assisted channels for older and rural customers, and harden app reliability/security. Phase branch downsizing only as digital adoption proves out.",
    },
    {
      id: "digital-q6",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: Using Exhibits 1 and 2, what is Meridian's total annual transaction cost today across all channels (120M transactions)? Answer in dollars.",
      exhibitRefs: ["ex-cost", "ex-mix"],
      timeLimitSec: 240,
      expectedValue: 245700000,
      tolerance: 500000,
      unitHint: "$",
      rubric:
        "Branch 42M x $4.25 = $178.5M; Call center 18M x $2.40 = $43.2M; ATM 24M x $0.85 = $20.4M; Digital 36M x $0.10 = $3.6M. Total = $245.7M.",
      modelAnswer:
        "42M(4.25) + 18M(2.40) + 24M(0.85) + 36M(0.10) = 178.5 + 43.2 + 20.4 + 3.6 = $245.7M.",
    },
    {
      id: "digital-q7",
      format: "single",
      dimension: "data",
      prompt:
        "Casey: Which channel is the biggest cost problem — driving a disproportionate share of cost relative to its share of volume?",
      exhibitRefs: ["ex-cost", "ex-mix"],
      timeLimitSec: 90,
      options: [
        {
          id: "a",
          text: "Branch — 35% of volume but ~73% of total cost ($178.5M of $245.7M)",
        },
        { id: "b", text: "Digital — 30% of volume and the highest cost" },
        { id: "c", text: "ATM — the most expensive channel" },
        { id: "d", text: "Call center — the majority of all transactions" },
      ],
      correctOptionIds: ["a"],
      rubric:
        "Branch is only 35% of volume yet ~73% of cost ($178.5M / $245.7M), making it the dominant cost driver and the priority for migration.",
      modelAnswer:
        "Branch — 35% of volume but ~73% of total cost.",
    },
    {
      id: "digital-q8",
      format: "single",
      dimension: "judgment",
      prompt:
        "Casey: What is the single biggest risk of aggressively forcing migration off branches?",
      exhibitRefs: [],
      timeLimitSec: 75,
      options: [
        {
          id: "a",
          text: "Excluding or alienating segments that rely on branches (older, rural, low-connectivity), risking attrition and reputational/regulatory issues",
        },
        { id: "b", text: "Saving too much money too quickly" },
        { id: "c", text: "The app becoming too popular" },
        { id: "d", text: "Tellers having too little work for one afternoon" },
      ],
      correctOptionIds: ["a"],
      rubric:
        "The main risk is underserving branch-dependent customers; manage it with assisted-digital options and a phased, opt-in transition rather than abrupt closures.",
      modelAnswer:
        "Alienating branch-dependent customers (older/rural) — leading to churn and reputational/regulatory risk.",
    },
  ],
};
