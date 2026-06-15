import type { CaseStudy } from "@/lib/types";

// Helios Wearables - smartwatch market entry.
// Unit economics: price $250, variable cost $85 => contribution $165.
// Fixed investment $120M => break-even 727,273 units.
// 3% of $18B market at $250 => 2.16M units, comfortably above break-even.
export const marketEntryCase: CaseStudy = {
  id: "mkt-helios",
  type: "market-entry",
  title: "Helios Wearables: Entering the Smartwatch Arena",
  company: "Helios Electronics",
  clientObjective:
    "Helios, a consumer electronics maker, is deciding whether to enter the smartwatch market. Leadership wants a clear go / no-go grounded in the unit economics and competitive dynamics.",
  background:
    "Helios has strong manufacturing and retail distribution but no wearables presence. Entry requires a one-time $120M investment (R&D, tooling, launch marketing). The smartwatch market is large and growing, but dominated by two incumbents. You must assess whether entry clears a sensible financial bar.",
  exhibits: [
    {
      id: "ex-market",
      kind: "table",
      title: "Exhibit 1: Market & Target Assumptions",
      note: "Use average selling price (ASP), not the suggested retail price (MSRP), for Helios's revenue per unit.",
      columns: [
        { key: "metric", label: "Metric" },
        { key: "value", label: "Value" },
      ],
      data: [
        { metric: "Current market size (Year 1)", value: "$18.0B" },
        { metric: "Market growth rate", value: "8% per year" },
        { metric: "Helios target share (Year 1)", value: "3%" },
        { metric: "Average selling price (ASP)", value: "$250 / unit" },
        { metric: "Suggested retail price (MSRP)", value: "$279 / unit" },
        { metric: "Avg replacement cycle", value: "2.4 years" },
        { metric: "Helios unaided brand awareness", value: "11%" },
      ],
    },
    {
      id: "ex-econ",
      kind: "table",
      title: "Exhibit 2: Helios Unit Economics",
      note: "Variable cost per unit is all-in (BOM, assembly, freight). Warranty reserve and retailer margin are shown separately and are already reflected where relevant.",
      columns: [
        { key: "metric", label: "Metric" },
        { key: "value", label: "Value" },
      ],
      data: [
        { metric: "Average selling price (ASP)", value: "$250" },
        { metric: "Variable cost / unit (all-in)", value: "$85" },
        { metric: "One-time fixed investment", value: "$120,000,000" },
        { metric: "Warranty reserve / unit", value: "$6" },
        { metric: "Retailer margin (already in ASP)", value: "18%" },
        { metric: "Target gross margin", value: "66%" },
      ],
    },
    {
      id: "ex-share",
      kind: "pie",
      title: "Exhibit 3: Current Market Share by Player",
      categoryKey: "player",
      valueKey: "share",
      data: [
        { player: "Incumbent A", share: 42 },
        { player: "Incumbent B", share: 31 },
        { player: "Others", share: 27 },
      ],
    },
    {
      id: "ex-growth",
      kind: "line",
      title: "Exhibit 4: Market & Segment Forecast ($B)",
      note: "Total market vs. the premium sub-segment and global wearables category (broader than smartwatches).",
      categoryKey: "year",
      series: [
        { key: "size", label: "Smartwatch market ($B)" },
        { key: "premium", label: "Premium sub-segment ($B)" },
        { key: "category", label: "All wearables ($B)" },
      ],
      data: [
        { year: "Y1", size: 18.0, premium: 6.5, category: 44 },
        { year: "Y2", size: 19.4, premium: 7.3, category: 49 },
        { year: "Y3", size: 21.0, premium: 8.1, category: 54 },
        { year: "Y4", size: 22.7, premium: 9.0, category: 60 },
        { year: "Y5", size: 24.5, premium: 10.0, category: 66 },
      ],
    },
    {
      id: "ex-drivers",
      kind: "bar",
      title: "Exhibit 5: Consumer Purchase Drivers (% citing as top factor)",
      note: "Survey of 2,000 recent buyers; figures do not sum to 100% (multi-select).",
      categoryKey: "driver",
      series: [{ key: "pct", label: "% of buyers" }],
      data: [
        { driver: "Brand/ecosystem", pct: 38 },
        { driver: "Battery life", pct: 27 },
        { driver: "Health sensors", pct: 21 },
        { driver: "Price", pct: 19 },
        { driver: "Design/styling", pct: 14 },
      ],
    },
  ],
  questions: [
    {
      id: "mkt-q1",
      format: "multi",
      dimension: "structuring",
      prompt:
        "Casey: Select the 3 factors MOST critical to the go / no-go decision for entering this market.",
      exhibitRefs: [],
      selectCount: 3,
      timeLimitSec: 75,
      options: [
        { id: "a", text: "Per-unit contribution margin and break-even volume" },
        { id: "b", text: "Realistically attainable market share vs. break-even" },
        { id: "c", text: "Competitive response and differentiation" },
        { id: "d", text: "The CEO's personal interest in wearables" },
        { id: "e", text: "Color options for the watch band" },
        { id: "f", text: "Office location for the new division" },
      ],
      correctOptionIds: ["a", "b", "c"],
      rubric:
        "Entry hinges on whether attainable volume clears break-even (a,b) and whether Helios can survive incumbent response (c). The rest are immaterial.",
      modelAnswer:
        "Contribution margin/break-even, attainable share vs. break-even, and competitive response/differentiation.",
    },
    {
      id: "mkt-q2",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: Using Exhibit 2, how many units must Helios sell to break even on the $120M investment? Round to the nearest thousand units.",
      exhibitRefs: ["ex-econ"],
      timeLimitSec: 180,
      expectedValue: 727000,
      tolerance: 2000,
      unitHint: "units",
      rubric:
        "Contribution = 250 - 85 = $165. Break-even = 120,000,000 / 165 = 727,273 ≈ 727,000 units. Reward stating the formula and the contribution margin step.",
      modelAnswer:
        "Contribution = $250 - $85 = $165/unit. Break-even = $120M / $165 ≈ 727,000 units.",
    },
    {
      id: "mkt-q3",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: If Helios captures 3% of the $18B market at $250/unit, how many units does it sell in Year 1? Answer in units.",
      exhibitRefs: ["ex-market"],
      timeLimitSec: 180,
      expectedValue: 2160000,
      tolerance: 20000,
      unitHint: "units",
      rubric:
        "Revenue = $18B x 3% = $540M. Units = $540M / $250 = 2,160,000.",
      modelAnswer: "$18B x 3% = $540M; $540M / $250 = 2.16M units.",
    },
    {
      id: "mkt-q4",
      format: "single",
      dimension: "judgment",
      prompt:
        "Casey: Comparing your two calculations, what does the financial picture imply for entry?",
      exhibitRefs: ["ex-econ", "ex-market"],
      timeLimitSec: 75,
      options: [
        {
          id: "a",
          text: "Attainable volume (~2.16M) is ~3x break-even (~727K), so entry is financially viable if 3% share is realistic",
        },
        { id: "b", text: "The business loses money at any volume" },
        { id: "c", text: "Break-even exceeds attainable volume, so do not enter" },
        { id: "d", text: "There is not enough information to assess viability" },
      ],
      correctOptionIds: ["a"],
      rubric:
        "2.16M projected units vastly exceed the 727K break-even, so the economics work provided the 3% share is achievable against incumbents.",
      modelAnswer:
        "Projected 2.16M units is ~3x the 727K break-even, so entry is viable contingent on actually achieving ~3% share.",
    },
    {
      id: "mkt-q5",
      format: "long-text",
      dimension: "judgment",
      prompt:
        "Casey: The economics look favorable, but name the biggest RISK to achieving 3% share and how you would de-risk it (3-6 lines).",
      exhibitRefs: ["ex-share"],
      timeLimitSec: 240,
      charLimit: 500,
      rubric:
        "Strong answers note the market is concentrated (73% held by two incumbents) so winning 3% requires real differentiation and exposes Helios to a price war. De-risking: pick a defensible niche/segment, lean on existing distribution, stage the investment, or partner. Penalize generic 'marketing' answers with no link to the competitive structure.",
      modelAnswer:
        "Risk: two incumbents hold 73% share and can retaliate on price, so 3% is not guaranteed. De-risk by targeting a defensible niche (e.g., fitness or budget segment), exploiting Helios's existing retail distribution, and staging the $120M spend with a go/no-go gate after a pilot launch.",
    },
    {
      id: "mkt-q6",
      format: "single",
      dimension: "data",
      prompt:
        "Casey: What does Exhibit 3 imply about the competitive structure Helios is entering?",
      exhibitRefs: ["ex-share"],
      timeLimitSec: 75,
      options: [
        {
          id: "a",
          text: "Highly concentrated — two incumbents control 73%, so Helios must take share from entrenched players",
        },
        { id: "b", text: "Highly fragmented with no dominant player" },
        { id: "c", text: "A monopoly held by a single firm" },
        { id: "d", text: "An empty market with no competitors" },
      ],
      correctOptionIds: ["a"],
      rubric:
        "Incumbent A (42%) + B (31%) = 73%; the market is concentrated, so the 27% 'Others' pool is where a new entrant realistically competes.",
      modelAnswer:
        "Concentrated: two incumbents hold 73%, so Helios competes mainly within the 27% 'Others' segment.",
    },
    {
      id: "mkt-q7",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: Suppose a retail channel fee of $20/unit also applies. At 2.16M units, what is Helios's Year 1 operating profit (contribution net of the fee, less the $120M fixed cost)? Answer in dollars.",
      exhibitRefs: ["ex-econ", "ex-market"],
      timeLimitSec: 210,
      expectedValue: 193200000,
      tolerance: 1500000,
      unitHint: "$",
      rubric:
        "Net contribution = $250 - $85 - $20 = $145/unit. 2,160,000 x $145 = $313.2M. Less $120M fixed = $193.2M.",
      modelAnswer: "(250 - 85 - 20) = $145; 2.16M x 145 = $313.2M; - $120M = $193.2M.",
    },
    {
      id: "mkt-q8",
      format: "multi",
      dimension: "judgment",
      prompt:
        "Casey: Before committing the full $120M, select the 2 best ways to de-risk entry.",
      exhibitRefs: [],
      selectCount: 2,
      timeLimitSec: 75,
      options: [
        { id: "a", text: "Run a staged pilot launch with a go/no-go gate before full spend" },
        { id: "b", text: "Leverage Helios's existing retail distribution to lower go-to-market cost" },
        { id: "c", text: "Immediately start a price war with both incumbents" },
        { id: "d", text: "Skip market research to move faster" },
        { id: "e", text: "Match incumbent A's feature set exactly with no differentiation" },
      ],
      correctOptionIds: ["a", "b"],
      rubric:
        "Stage the capital with a pilot gate and exploit existing distribution to cut risk and cost. A price war or undifferentiated me-too play invites exactly the incumbent retaliation that threatens the 3% target.",
      modelAnswer:
        "Pilot with a stage-gate before full $120M, and use existing retail distribution to lower entry cost and risk.",
    },
  ],
};
