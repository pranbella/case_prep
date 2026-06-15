import type { CaseStudy } from "@/lib/types";

// Streamline (B2B SaaS) - price increase decision.
// Current: 10,000 seats x $50 = $500,000 MRR.
// Proposed: $60 (+20%) with expected 12% seat churn => 8,800 seats x $60 = $528,000 MRR (+5.6%).
export const pricingCase: CaseStudy = {
  id: "price-streamline",
  type: "pricing",
  title: "Streamline: Is a Price Increase Worth It?",
  company: "Streamline Inc.",
  clientObjective:
    "Streamline, a B2B SaaS workflow tool, has not raised prices in four years. The CFO wants to know whether a move from $50 to $60 per seat per month would grow revenue, and what the risks are.",
  background:
    "Streamline charges a flat $50 per seat per month and has 10,000 active seats. Sales worries that a price increase will trigger cancellations; product argues the tool is underpriced versus competitors. You must evaluate the revenue impact and the conditions under which the increase makes sense.",
  exhibits: [
    {
      id: "ex-current",
      kind: "table",
      title: "Exhibit 1: Current State",
      note: "MRR = price x active seats. Other metrics provided for context.",
      columns: [
        { key: "metric", label: "Metric" },
        { key: "value", label: "Value" },
      ],
      data: [
        { metric: "Price per seat / month", value: "$50" },
        { metric: "Active seats", value: "10,000" },
        { metric: "Current MRR", value: "$500,000" },
        { metric: "Gross margin", value: "85%" },
        { metric: "Net revenue retention (NRR)", value: "104%" },
        { metric: "Blended CAC", value: "$430 / seat" },
        { metric: "Support cost / seat / mo", value: "$7.50" },
        { metric: "Avg contract length", value: "14 months" },
      ],
    },
    {
      id: "ex-wtp",
      kind: "bar",
      title: "Exhibit 2: Willingness-to-Pay Survey",
      note: "Based on 1,200 admin responses. '% retained' = seats that say they would stay at that monthly price. '% would recommend' is an unrelated brand metric shown for context.",
      categoryKey: "price",
      series: [
        { key: "retained", label: "% seats retained" },
        { key: "recommend", label: "% would recommend" },
      ],
      data: [
        { price: "$45", retained: 100, recommend: 71 },
        { price: "$50", retained: 100, recommend: 70 },
        { price: "$55", retained: 94, recommend: 66 },
        { price: "$60", retained: 88, recommend: 61 },
        { price: "$70", retained: 72, recommend: 52 },
        { price: "$80", retained: 55, recommend: 44 },
      ],
    },
    {
      id: "ex-churn",
      kind: "table",
      title: "Exhibit 3: Customer Base by Segment",
      note: "Estimated churn at $60 varies by segment. ARPA and NPS shown for context.",
      columns: [
        { key: "segment", label: "Segment" },
        { key: "seats", label: "Seats" },
        { key: "churn", label: "Est. churn at $60" },
        { key: "arpa", label: "Avg seats / account" },
        { key: "nps", label: "Segment NPS" },
      ],
      data: [
        { segment: "Enterprise", seats: 6000, churn: "6%", arpa: 120, nps: 44 },
        { segment: "Mid-market", seats: 3000, churn: "15%", arpa: 30, nps: 31 },
        { segment: "SMB", seats: 1000, churn: "30%", arpa: 6, nps: 18 },
      ],
    },
    {
      id: "ex-comp",
      kind: "bar",
      title: "Exhibit 4: Competitor List Pricing ($ / seat / mo)",
      note: "List prices from public pricing pages; feature sets are not identical.",
      categoryKey: "vendor",
      series: [{ key: "price", label: "$ / seat / mo" }],
      data: [
        { vendor: "Streamline (today)", price: 50 },
        { vendor: "Competitor A", price: 65 },
        { vendor: "Competitor B", price: 72 },
        { vendor: "Competitor C", price: 58 },
        { vendor: "Budget tool D", price: 29 },
      ],
    },
  ],
  questions: [
    {
      id: "price-q1",
      format: "single",
      dimension: "structuring",
      prompt:
        "Casey: Which question should you answer FIRST to evaluate the price increase?",
      exhibitRefs: [],
      timeLimitSec: 60,
      options: [
        {
          id: "a",
          text: "Does the revenue gained from higher price exceed the revenue lost to churn?",
        },
        { id: "b", text: "What color should the new pricing page be?" },
        { id: "c", text: "How many engineers does Streamline employ?" },
        { id: "d", text: "What is the CEO's favorite competitor?" },
      ],
      correctOptionIds: ["a"],
      rubric:
        "Pricing is a trade-off between price uplift and volume loss; that net revenue question is the crux.",
      modelAnswer:
        "Whether the price uplift more than offsets churn-driven revenue loss.",
    },
    {
      id: "price-q2",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: Using Exhibit 2, if Streamline raises price to $60 (88% of seats retained), what is the new MRR? Answer in dollars.",
      exhibitRefs: ["ex-current", "ex-wtp"],
      timeLimitSec: 180,
      expectedValue: 528000,
      tolerance: 1000,
      unitHint: "$",
      rubric:
        "Retained seats = 10,000 x 88% = 8,800. New MRR = 8,800 x $60 = $528,000.",
      modelAnswer: "8,800 seats x $60 = $528,000 MRR.",
    },
    {
      id: "price-q3",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: At the new $60 price, what is the maximum percentage of the 10,000 seats Streamline could lose before monthly revenue falls back below today's $500,000? Answer as a percentage to one decimal place.",
      exhibitRefs: ["ex-current"],
      timeLimitSec: 180,
      expectedValue: 16.7,
      tolerance: 0.5,
      unitHint: "%",
      rubric:
        "Seats needed at $60 to reach $500,000 = 500,000 / 60 = 8,333. Max loss = 10,000 - 8,333 = 1,667 seats = 16.7% of seats.",
      modelAnswer: "500,000/60 = 8,333 seats; (10,000 - 8,333)/10,000 = 16.7%.",
    },
    {
      id: "price-q4",
      format: "single",
      dimension: "data",
      prompt:
        "Casey: Using Exhibit 3, which segment most threatens the price increase and why?",
      exhibitRefs: ["ex-churn"],
      timeLimitSec: 75,
      options: [
        {
          id: "a",
          text: "SMB - 30% churn is severe, though it is only 1,000 of 10,000 seats",
        },
        { id: "b", text: "Enterprise - it has the lowest churn" },
        { id: "c", text: "Mid-market - it has the most seats" },
        { id: "d", text: "No segment is at risk" },
      ],
      correctOptionIds: ["a"],
      rubric:
        "SMB has by far the highest churn (30%); note it is a small base, so a segmented price (hold SMB, raise enterprise) could capture most upside.",
      modelAnswer:
        "SMB at 30% churn is the most price-sensitive, but it is only 10% of seats — pointing to a segmented increase.",
    },
    {
      id: "price-q5",
      format: "long-text",
      dimension: "judgment",
      prompt:
        "Casey: Recommend whether and how Streamline should change pricing, and the single biggest risk to monitor (3-6 lines).",
      exhibitRefs: ["ex-wtp", "ex-churn"],
      timeLimitSec: 240,
      charLimit: 500,
      rubric:
        "Strong answers say yes, raise price (net +5.6% MRR, high gross margin so most flows to profit), but recommend a segmented/grandfathered approach given SMB sensitivity, and name churn beyond forecast (especially mid-market/SMB) as the key risk to monitor. Penalize blanket 'raise it' or 'don't raise it' with no nuance.",
      modelAnswer:
        "Raise to $60 — net MRR rises ~5.6% and at 85% margin most of that is profit. But protect price-sensitive SMB via grandfathering or a lower tier, and concentrate increases on low-churn enterprise seats. Key risk: actual churn exceeding the 12% assumption, especially in mid-market; monitor early cancellation and downgrade rates post-launch.",
    },
    {
      id: "price-q6",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: At an 85% gross margin, what is the annualized increase in GROSS PROFIT from moving to $60 (new MRR $528,000 vs current $500,000)? Answer in dollars per year.",
      exhibitRefs: ["ex-current"],
      timeLimitSec: 180,
      expectedValue: 285600,
      tolerance: 2000,
      unitHint: "$ / year",
      rubric:
        "Monthly MRR uplift = 528,000 - 500,000 = 28,000. Gross-profit uplift = 28,000 x 85% = 23,800/mo. Annualized = 23,800 x 12 = $285,600.",
      modelAnswer: "28,000 x 0.85 x 12 = $285,600 per year.",
    },
    {
      id: "price-q7",
      format: "single",
      dimension: "data",
      prompt:
        "Casey: Using Exhibit 2, which single price point MAXIMIZES total MRR across the 10,000 seats?",
      exhibitRefs: ["ex-wtp"],
      timeLimitSec: 90,
      options: [
        { id: "a", text: "$60 (88% retained -> 8,800 x $60 = $528,000)" },
        { id: "b", text: "$55 (94% retained -> 9,400 x $55 = $517,000)" },
        { id: "c", text: "$70 (72% retained -> 7,200 x $70 = $504,000)" },
        { id: "d", text: "$80 (55% retained -> 5,500 x $80 = $440,000)" },
      ],
      correctOptionIds: ["a"],
      rubric:
        "Compute price x retained seats at each point: $60 yields the highest MRR ($528K), beating $55 ($517K), $70 ($504K), and $80 ($440K).",
      modelAnswer: "$60 maximizes MRR at $528,000.",
    },
    {
      id: "price-q8",
      format: "multi",
      dimension: "structuring",
      prompt:
        "Casey: Select the 2 actions that best protect revenue during the price-increase rollout.",
      exhibitRefs: ["ex-churn"],
      selectCount: 2,
      timeLimitSec: 75,
      options: [
        { id: "a", text: "Grandfather or offer a lower tier to price-sensitive SMB" },
        { id: "b", text: "Strengthen onboarding/value delivery to reduce churn" },
        { id: "c", text: "Jump straight to $80 to maximize headline price" },
        { id: "d", text: "Remove the ability to downgrade" },
        { id: "e", text: "Hide the price change from customers" },
      ],
      correctOptionIds: ["a", "b"],
      rubric:
        "Protect the high-churn SMB base (grandfather/tier) and attack churn directly via value/onboarding. Jumping to $80, blocking downgrades, or hiding the change all increase churn or trust risk.",
      modelAnswer:
        "Grandfather/tier SMB and invest in onboarding to cut churn — both defend the revenue base during the increase.",
    },
  ],
};
