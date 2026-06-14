import type { CaseStudy } from "@/lib/types";

// ConnectCo (telecom) - declining NPS and rising churn.
// NPS = %promoters - %detractors = 40% - 25% = 15.
export const customerSatisfactionCase: CaseStudy = {
  id: "csat-connectco",
  type: "customer-satisfaction",
  title: "ConnectCo: The Net Promoter Problem",
  company: "ConnectCo",
  clientObjective:
    "ConnectCo, a regional telecom, has seen its Net Promoter Score slide and churn climb. The CMO wants to know what is driving dissatisfaction and where to focus to recover loyalty.",
  background:
    "ConnectCo serves 2 million broadband and mobile subscribers. NPS has fallen over the past year and monthly churn is rising. Leadership has competing theories: price, network reliability, and customer service. You must identify the primary driver and prioritize fixes.",
  exhibits: [
    {
      id: "ex-nps",
      kind: "table",
      title: "Exhibit 1: Latest NPS Survey (n = 5,000)",
      columns: [
        { key: "group", label: "Respondent group" },
        { key: "share", label: "% of respondents" },
      ],
      data: [
        { group: "Promoters (9-10)", share: "40%" },
        { group: "Passives (7-8)", share: "35%" },
        { group: "Detractors (0-6)", share: "25%" },
      ],
    },
    {
      id: "ex-drivers",
      kind: "bar",
      title: "Exhibit 2: Top Reasons Cited by Detractors (% of detractors)",
      categoryKey: "reason",
      series: [{ key: "pct", label: "% of detractors" }],
      data: [
        { reason: "Slow/unreliable service calls", pct: 44 },
        { reason: "Network outages", pct: 28 },
        { reason: "Billing errors", pct: 18 },
        { reason: "Price", pct: 10 },
      ],
    },
    {
      id: "ex-churn",
      kind: "line",
      title: "Exhibit 3: Monthly Churn vs. NPS (trailing 6 months)",
      hardModeOnly: true,
      categoryKey: "month",
      series: [
        { key: "churn", label: "Churn %" },
        { key: "nps", label: "NPS" },
      ],
      data: [
        { month: "M1", churn: 1.8, nps: 28 },
        { month: "M2", churn: 1.9, nps: 26 },
        { month: "M3", churn: 2.1, nps: 22 },
        { month: "M4", churn: 2.3, nps: 19 },
        { month: "M5", churn: 2.5, nps: 17 },
        { month: "M6", churn: 2.7, nps: 15 },
      ],
    },
  ],
  questions: [
    {
      id: "csat-q1",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: Using Exhibit 1, calculate ConnectCo's current Net Promoter Score (NPS).",
      exhibitRefs: ["ex-nps"],
      timeLimitSec: 120,
      expectedValue: 15,
      tolerance: 0,
      unitHint: "(NPS points)",
      rubric: "NPS = %promoters - %detractors = 40 - 25 = 15.",
      modelAnswer: "40% promoters - 25% detractors = NPS of 15.",
    },
    {
      id: "csat-q2",
      format: "single",
      dimension: "data",
      prompt:
        "Casey: Based on Exhibit 2, where should ConnectCo focus FIRST to lift NPS?",
      exhibitRefs: ["ex-drivers"],
      timeLimitSec: 75,
      options: [
        {
          id: "a",
          text: "Customer service responsiveness — cited by 44% of detractors, the largest single driver",
        },
        { id: "b", text: "Price — only 10% of detractors cite it" },
        { id: "c", text: "Rebranding the company logo" },
        { id: "d", text: "Billing errors — the second-largest driver" },
      ],
      correctOptionIds: ["a"],
      rubric:
        "Service-call experience is the dominant detractor driver (44%); fixing it addresses the largest share of dissatisfaction.",
      modelAnswer:
        "Customer service responsiveness, the single largest detractor driver at 44%.",
    },
    {
      id: "csat-q3",
      format: "multi",
      dimension: "structuring",
      prompt:
        "Casey: To build a credible improvement plan, select the 3 most useful additional analyses.",
      exhibitRefs: [],
      selectCount: 3,
      timeLimitSec: 90,
      options: [
        { id: "a", text: "Churn rate split by detractor reason" },
        { id: "b", text: "Cost and time-to-fix for each top driver" },
        { id: "c", text: "Revenue at risk from detractors likely to churn" },
        { id: "d", text: "Number of pages on the company website" },
        { id: "e", text: "The CEO's commute time" },
        { id: "f", text: "Cafeteria menu satisfaction" },
      ],
      correctOptionIds: ["a", "b", "c"],
      rubric:
        "Prioritize by impact and feasibility: link drivers to churn (a), quantify revenue at risk (c), and weigh fix cost/effort (b). The rest are irrelevant.",
      modelAnswer:
        "Churn by driver, cost/effort to fix each driver, and revenue at risk from likely-to-churn detractors.",
    },
    {
      id: "csat-q4",
      format: "single",
      dimension: "judgment",
      prompt:
        "Casey: Exhibit 3 shows churn rising as NPS falls. What is the correct interpretation for action?",
      exhibitRefs: ["ex-churn"],
      timeLimitSec: 75,
      options: [
        {
          id: "a",
          text: "Falling NPS is associated with rising churn, so recovering NPS (via the top drivers) should help stem churn — but confirm causation before over-investing",
        },
        { id: "b", text: "Churn and NPS are unrelated" },
        { id: "c", text: "Rising churn causes higher NPS" },
        { id: "d", text: "Nothing can be done about churn" },
      ],
      correctOptionIds: ["a"],
      rubric:
        "The inverse correlation supports targeting NPS drivers to reduce churn, with a caution that correlation is not proof of causation.",
      modelAnswer:
        "NPS and churn move inversely; fixing top NPS drivers should reduce churn, but validate the causal link before scaling spend.",
    },
    {
      id: "csat-q5",
      format: "long-text",
      dimension: "judgment",
      prompt:
        "Casey: Recommend ConnectCo's top 2-3 priorities to recover loyalty, in order, with rationale (3-6 lines).",
      exhibitRefs: ["ex-drivers"],
      timeLimitSec: 240,
      charLimit: 500,
      rubric:
        "Strong answers prioritize the biggest, most fixable drivers: service responsiveness (44%) first, then network reliability (28%) and billing (18%); de-prioritize price (10%). Reward sequencing by impact x feasibility and tying back to churn/revenue. Penalize unprioritized laundry lists.",
      modelAnswer:
        "1) Fix service responsiveness (44% of detractors) — reduce call wait/resolution times, the biggest and most addressable lever. 2) Improve network reliability (28%) — target outage hotspots. 3) Eliminate billing errors (18%) via automated checks. Skip broad price cuts (only 10% cite price). Track NPS and churn together to confirm the fixes are working.",
    },
    {
      id: "csat-q6",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: ConnectCo has 2,000,000 subscribers. If the survey's 25% detractor rate holds across the base, how many detractors is that? Answer in subscribers.",
      exhibitRefs: ["ex-nps"],
      timeLimitSec: 120,
      expectedValue: 500000,
      tolerance: 0,
      unitHint: "subscribers",
      rubric: "25% x 2,000,000 = 500,000 detractors.",
      modelAnswer: "0.25 x 2,000,000 = 500,000.",
    },
    {
      id: "csat-q7",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: Using Exhibit 2, what combined share of detractor complaints do the top two drivers (service calls + network outages) represent? Answer as a percentage.",
      exhibitRefs: ["ex-drivers"],
      timeLimitSec: 90,
      expectedValue: 72,
      tolerance: 0.5,
      unitHint: "%",
      rubric: "44% (service) + 28% (outages) = 72% of detractor complaints.",
      modelAnswer: "44% + 28% = 72%.",
    },
    {
      id: "csat-q8",
      format: "single",
      dimension: "judgment",
      prompt:
        "Casey: Service fixes are relatively cheap and fast; network upgrades are slow and capital-intensive. What sequencing makes most sense?",
      exhibitRefs: ["ex-drivers"],
      timeLimitSec: 90,
      options: [
        {
          id: "a",
          text: "Tackle service responsiveness first for a quick NPS win, while starting network upgrades in parallel as a longer-term track",
        },
        { id: "b", text: "Do only the slow, expensive network upgrades first" },
        { id: "c", text: "Cut prices instead of fixing either driver" },
        { id: "d", text: "Wait until all fixes can be done simultaneously" },
      ],
      correctOptionIds: ["a"],
      rubric:
        "Sequence by impact x feasibility: service is the biggest driver and fastest/cheapest to fix (quick win), while network upgrades run in parallel as the slower structural fix.",
      modelAnswer:
        "Fix service first for a fast, high-impact win; run network upgrades in parallel as the longer-term track.",
    },
  ],
};
