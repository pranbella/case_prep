import type { CaseStudy } from "@/lib/types";

// FreshBox (subscription meal kit) - growth & unit economics.
// Monthly churn 5% => avg lifetime 1/0.05 = 20 months.
// Monthly contribution $12 => LTV = $240. CAC $40 => LTV/CAC = 6.0.
export const growthCase: CaseStudy = {
  id: "growth-freshbox",
  type: "growth",
  title: "FreshBox: Scaling the Subscription",
  company: "FreshBox",
  clientObjective:
    "FreshBox, a meal-kit subscription, wants to triple its subscriber base in two years. The CEO wants to know whether the unit economics support aggressive acquisition spend and where growth should come from.",
  background:
    "FreshBox has 200,000 subscribers acquired mostly through paid social. Investors are pushing for growth, but the CFO worries the company is buying unprofitable customers. You must assess unit economics and identify the highest-leverage growth lever.",
  exhibits: [
    {
      id: "ex-unit",
      kind: "table",
      title: "Exhibit 1: Subscriber Unit Economics",
      columns: [
        { key: "metric", label: "Metric" },
        { key: "value", label: "Value" },
      ],
      data: [
        { metric: "Customer acquisition cost (CAC)", value: "$40" },
        { metric: "Monthly contribution margin / subscriber", value: "$12" },
        { metric: "Monthly churn rate", value: "5%" },
        { metric: "Current subscribers", value: "200,000" },
      ],
    },
    {
      id: "ex-funnel",
      kind: "bar",
      title: "Exhibit 2: Acquisition Funnel by Channel (new subs / month)",
      categoryKey: "channel",
      series: [
        { key: "subs", label: "New subs / mo" },
        { key: "cac", label: "CAC ($)" },
      ],
      data: [
        { channel: "Paid social", subs: 9000, cac: 55 },
        { channel: "Referral", subs: 3000, cac: 15 },
        { channel: "Organic/SEO", subs: 2000, cac: 5 },
        { channel: "Partnerships", subs: 1000, cac: 30 },
      ],
    },
    {
      id: "ex-cohort",
      kind: "line",
      title: "Exhibit 3: Retention Curve (% of cohort still active)",
      hardModeOnly: true,
      categoryKey: "month",
      series: [{ key: "active", label: "% active" }],
      data: [
        { month: "M0", active: 100 },
        { month: "M3", active: 86 },
        { month: "M6", active: 74 },
        { month: "M12", active: 54 },
        { month: "M24", active: 30 },
      ],
    },
  ],
  questions: [
    {
      id: "growth-q1",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: Using Exhibit 1, what is the average subscriber lifetime in months given a 5% monthly churn rate?",
      exhibitRefs: ["ex-unit"],
      timeLimitSec: 120,
      expectedValue: 20,
      tolerance: 0,
      unitHint: "months",
      rubric: "Average lifetime = 1 / churn = 1 / 0.05 = 20 months.",
      modelAnswer: "1 / 0.05 = 20 months.",
    },
    {
      id: "growth-q2",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: What is the lifetime value (LTV) per subscriber, using monthly contribution of $12? Answer in dollars.",
      exhibitRefs: ["ex-unit"],
      timeLimitSec: 150,
      expectedValue: 240,
      tolerance: 0,
      unitHint: "$",
      rubric: "LTV = $12 x 20 months = $240.",
      modelAnswer: "$12 x 20 = $240.",
    },
    {
      id: "growth-q3",
      format: "single",
      dimension: "judgment",
      prompt:
        "Casey: Given LTV of $240 and blended CAC of $40, what does the LTV/CAC ratio of 6.0 imply?",
      exhibitRefs: ["ex-unit"],
      timeLimitSec: 75,
      options: [
        {
          id: "a",
          text: "Economics are healthy (well above the ~3x benchmark) — there is room to spend more to grow",
        },
        { id: "b", text: "The business loses money on every customer" },
        { id: "c", text: "FreshBox should immediately stop all acquisition" },
        { id: "d", text: "LTV/CAC is irrelevant to growth decisions" },
      ],
      correctOptionIds: ["a"],
      rubric:
        "6.0 is comfortably above the ~3x rule of thumb, signaling headroom to invest in acquisition — provided incremental CAC stays reasonable.",
      modelAnswer:
        "6.0x is well above the ~3x benchmark, so unit economics are strong and there is room to invest more in growth.",
    },
    {
      id: "growth-q4",
      format: "multi",
      dimension: "data",
      prompt:
        "Casey: Using Exhibit 2, select the 2 channels that offer the best combination of scale and efficiency to lean into.",
      exhibitRefs: ["ex-funnel"],
      selectCount: 2,
      timeLimitSec: 90,
      options: [
        { id: "a", text: "Referral (3,000 subs at $15 CAC)" },
        { id: "b", text: "Organic/SEO (2,000 subs at $5 CAC)" },
        { id: "c", text: "Paid social (9,000 subs at $55 CAC)" },
        { id: "d", text: "Partnerships (1,000 subs at $30 CAC)" },
      ],
      correctOptionIds: ["a", "b"],
      rubric:
        "Referral and organic combine meaningful volume with far lower CAC than paid social; scaling them improves blended efficiency. Paid social is high volume but its $55 CAC exceeds even LTV-justified targets and should be optimized, not the primary lever.",
      modelAnswer:
        "Referral and organic/SEO — solid volume at very low CAC ($15 and $5), so scaling them lowers blended CAC while paid social is tuned.",
    },
    {
      id: "growth-q5",
      format: "long-text",
      dimension: "judgment",
      prompt:
        "Casey: Recommend FreshBox's growth strategy to triple subscribers, and flag the main risk (3-6 lines).",
      exhibitRefs: ["ex-funnel"],
      timeLimitSec: 240,
      charLimit: 500,
      rubric:
        "Strong answers: exploit strong unit economics (LTV/CAC 6) to invest, but rebalance the mix toward low-CAC referral/organic and improve paid-social efficiency; consider retention improvements since lifetime drives LTV. Key risk: rising CAC / diminishing returns as spend scales, or churn worsening. Penalize 'just spend more on ads' with no efficiency or retention angle.",
      modelAnswer:
        "Lean into the strong 6x LTV/CAC: scale low-cost referral (referral incentives) and organic, while tightening paid-social targeting to hold CAC down. Pair acquisition with retention (onboarding, menu variety) since lifetime drives LTV. Main risk: CAC inflation as you scale paid channels — protect the blended LTV/CAC ratio and cut spend where incremental CAC nears LTV/3.",
    },
    {
      id: "growth-q6",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: Using your LTV of $240 and the $40 CAC, what is the LTV-to-CAC ratio? Answer as a number (e.g., 4.0).",
      exhibitRefs: ["ex-unit"],
      timeLimitSec: 120,
      expectedValue: 6,
      tolerance: 0.1,
      unitHint: "ratio",
      rubric: "LTV/CAC = 240 / 40 = 6.0.",
      modelAnswer: "240 / 40 = 6.0.",
    },
    {
      id: "growth-q7",
      format: "single",
      dimension: "data",
      prompt:
        "Casey: Using Exhibit 2, which channel is the least efficient and the first candidate for optimization?",
      exhibitRefs: ["ex-funnel"],
      timeLimitSec: 75,
      options: [
        { id: "a", text: "Paid social — highest CAC at $55, well above the other channels" },
        { id: "b", text: "Organic/SEO — lowest CAC at $5" },
        { id: "c", text: "Referral — CAC of $15" },
        { id: "d", text: "Partnerships — CAC of $30" },
      ],
      correctOptionIds: ["a"],
      rubric:
        "Paid social has by far the highest CAC ($55); it drives the most volume but is the least efficient and the clearest target for optimization before scaling.",
      modelAnswer: "Paid social — $55 CAC is the highest and least efficient.",
    },
    {
      id: "growth-q8",
      format: "multi",
      dimension: "structuring",
      prompt:
        "Casey: Select the 3 inputs you most need to set an aggressive but disciplined acquisition budget.",
      exhibitRefs: [],
      selectCount: 3,
      timeLimitSec: 90,
      options: [
        { id: "a", text: "LTV/CAC by channel" },
        { id: "b", text: "How incremental CAC rises as spend scales (diminishing returns)" },
        { id: "c", text: "Churn/retention trend (it drives LTV)" },
        { id: "d", text: "The CEO's social media following" },
        { id: "e", text: "Office snack budget" },
        { id: "f", text: "Brand logo font" },
      ],
      correctOptionIds: ["a", "b", "c"],
      rubric:
        "Budgeting needs channel-level efficiency (a), the incremental CAC curve to know when returns fade (b), and the churn/retention trend since lifetime drives LTV (c).",
      modelAnswer:
        "LTV/CAC by channel, the incremental CAC curve, and the churn/retention trend.",
    },
  ],
};
