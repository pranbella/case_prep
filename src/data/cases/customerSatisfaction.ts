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
      note: "NPS = %promoters - %detractors (passives are ignored). Prior-year and industry-average columns are for context only.",
      columns: [
        { key: "group", label: "Respondent group" },
        { key: "share", label: "% of respondents" },
        { key: "prior", label: "Prior year %" },
        { key: "industry", label: "Industry avg %" },
      ],
      data: [
        { group: "Promoters (9-10)", share: "40%", prior: "44%", industry: "38%" },
        { group: "Passives (7-8)", share: "35%", prior: "33%", industry: "37%" },
        { group: "Detractors (0-6)", share: "25%", prior: "23%", industry: "25%" },
      ],
    },
    {
      id: "ex-drivers",
      kind: "bar",
      title: "Exhibit 2: Detractor Reasons & First-Contact Resolution",
      note: "'% of detractors' = share citing each reason. '% resolved on first contact' is an operational metric shown for context.",
      categoryKey: "reason",
      series: [
        { key: "pct", label: "% of detractors" },
        { key: "fcr", label: "% resolved first contact" },
      ],
      data: [
        { reason: "Slow/unreliable service calls", pct: 44, fcr: 31 },
        { reason: "Network outages", pct: 28, fcr: 12 },
        { reason: "Billing errors", pct: 18, fcr: 58 },
        { reason: "Price", pct: 10, fcr: 74 },
      ],
    },
    {
      id: "ex-churn",
      kind: "line",
      title: "Exhibit 3: Monthly Churn, NPS & Call Wait (trailing 6 months)",
      note: "Churn % and NPS move together; average call wait (min) is shown for context.",
      categoryKey: "month",
      series: [
        { key: "churn", label: "Churn %" },
        { key: "nps", label: "NPS" },
        { key: "wait", label: "Avg call wait (min)" },
      ],
      data: [
        { month: "M1", churn: 1.8, nps: 28, wait: 6 },
        { month: "M2", churn: 1.9, nps: 26, wait: 7 },
        { month: "M3", churn: 2.1, nps: 22, wait: 9 },
        { month: "M4", churn: 2.3, nps: 19, wait: 11 },
        { month: "M5", churn: 2.5, nps: 17, wait: 13 },
        { month: "M6", churn: 2.7, nps: 15, wait: 14 },
      ],
    },
    {
      id: "ex-plan",
      kind: "table",
      title: "Exhibit 4: Subscriber Base by Plan",
      note: "Provided by finance. ARPU and tenure shown for context.",
      columns: [
        { key: "plan", label: "Plan" },
        { key: "subs", label: "Subscribers" },
        { key: "arpu", label: "ARPU ($/mo)" },
        { key: "tenure", label: "Avg tenure (yrs)" },
      ],
      data: [
        { plan: "Mobile prepaid", subs: 700000, arpu: 22, tenure: 1.8 },
        { plan: "Mobile postpaid", subs: 800000, arpu: 48, tenure: 3.4 },
        { plan: "Broadband", subs: 500000, arpu: 61, tenure: 4.1 },
      ],
    },
  ],
  questions: [
    {
      id: "csat-q1",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: ConnectCo currently has 40% promoters, 35% passives, and 25% detractors. If a service-fix campaign converts 10 percentage points of detractors into promoters, what is the resulting NPS?",
      exhibitRefs: ["ex-nps"],
      timeLimitSec: 150,
      expectedValue: 35,
      tolerance: 0,
      unitHint: "(NPS points)",
      rubric:
        "Current NPS = 40 - 25 = 15. After the shift: promoters = 50%, detractors = 15%, so NPS = 50 - 15 = 35.",
      modelAnswer: "New mix 50% promoters / 15% detractors => NPS = 50 - 15 = 35.",
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
        "Casey: Of the 500,000 detractors, how many cite billing errors or price (the two smallest drivers) as their reason? Use Exhibit 2. Answer in subscribers.",
      exhibitRefs: ["ex-drivers"],
      timeLimitSec: 150,
      expectedValue: 140000,
      tolerance: 0,
      unitHint: "subscribers",
      rubric:
        "Billing 18% + Price 10% = 28% of detractors. 28% x 500,000 = 140,000 subscribers.",
      modelAnswer: "(18% + 10%) x 500,000 = 0.28 x 500,000 = 140,000.",
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
