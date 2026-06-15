import type { CaseStudy } from "@/lib/types";

// Verde Retail - sustainability investment.
// Solar: $50M capex saves $8M/yr => simple payback 50/8 = 6.25 years.
export const sustainabilityCase: CaseStudy = {
  id: "sustain-verde",
  type: "sustainability",
  title: "Verde Retail: The Green Investment Case",
  company: "Verde Retail",
  clientObjective:
    "Verde, a big-box retailer, has pledged to cut Scope 1-2 emissions 50% by 2030. The CFO wants to know whether the flagship initiative — on-site solar — makes financial sense and how to sequence the broader program.",
  background:
    "Verde operates 400 stores and 8 distribution centers. Energy is its largest controllable emission source. A proposed $50M solar program would cut grid electricity purchases. The CFO is sympathetic to the climate goal but insists each initiative clear a reasonable financial bar, not just an ESG one.",
  exhibits: [
    {
      id: "ex-solar",
      kind: "table",
      title: "Exhibit 1: On-Site Solar Program Economics",
      note: "The annual energy cost saving is already net of O&M. Use it directly for payback and net-savings calcs; degradation, IRR and grid-inflation figures are sensitivities for context.",
      columns: [
        { key: "metric", label: "Metric" },
        { key: "value", label: "Value" },
      ],
      data: [
        { metric: "Upfront capital cost", value: "$50,000,000" },
        { metric: "Annual energy cost saving (net of O&M)", value: "$8,000,000" },
        { metric: "Asset useful life", value: "25 years" },
        { metric: "Annual CO2 reduction", value: "120,000 tonnes" },
        { metric: "O&M cost (already netted in saving)", value: "$0.6M / yr" },
        { metric: "Panel degradation", value: "0.5% / yr" },
        { metric: "Assumed grid price inflation", value: "3% / yr" },
        { metric: "Estimated project IRR", value: "11%" },
      ],
    },
    {
      id: "ex-abatement",
      kind: "bar",
      title: "Exhibit 2: Abatement Options",
      note: "Negative $/tonne = net savings. 'Annual tonnes' is the volume each lever could abate per year.",
      categoryKey: "lever",
      series: [
        { key: "costPerTonne", label: "$ / tonne CO2" },
        { key: "tonnes", label: "Annual tonnes (000s)" },
      ],
      data: [
        { lever: "LED lighting retrofit", costPerTonne: -60, tonnes: 30 },
        { lever: "On-site solar", costPerTonne: -25, tonnes: 120 },
        { lever: "Fleet electrification", costPerTonne: 35, tonnes: 80 },
        { lever: "Green hydrogen heating", costPerTonne: 210, tonnes: 40 },
      ],
    },
    {
      id: "ex-emissions",
      kind: "pie",
      title: "Exhibit 3: Emissions by Source (Scope 1-2)",
      categoryKey: "source",
      valueKey: "share",
      data: [
        { source: "Grid electricity", share: 48 },
        { source: "Refrigerants", share: 22 },
        { source: "Fleet/logistics", share: 20 },
        { source: "Heating", share: 10 },
      ],
    },
    {
      id: "ex-energy",
      kind: "bar",
      title: "Exhibit 4: Annual Energy Use by Facility Type (GWh)",
      note: "Distribution centers are energy-intensive but few in number; provided for context.",
      categoryKey: "facility",
      series: [{ key: "gwh", label: "Energy use (GWh)" }],
      data: [
        { facility: "Stores (sales floor)", gwh: 420 },
        { facility: "Refrigeration", gwh: 260 },
        { facility: "Distribution centers", gwh: 180 },
        { facility: "Offices", gwh: 40 },
      ],
    },
  ],
  questions: [
    {
      id: "sustain-q1",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: Using Exhibit 1, what is the simple payback period of the solar program in years? Answer to two decimal places.",
      exhibitRefs: ["ex-solar"],
      timeLimitSec: 150,
      expectedValue: 6.25,
      tolerance: 0.05,
      unitHint: "years",
      rubric: "Payback = $50M / $8M per year = 6.25 years.",
      modelAnswer: "$50M / $8M = 6.25 years.",
    },
    {
      id: "sustain-q2",
      format: "single",
      dimension: "judgment",
      prompt:
        "Casey: The asset lasts 25 years with a 6.25-year payback. How should the CFO view this?",
      exhibitRefs: ["ex-solar"],
      timeLimitSec: 75,
      options: [
        {
          id: "a",
          text: "Attractive — it pays back in ~6 years and then generates ~19 years of net savings, while cutting emissions",
        },
        { id: "b", text: "Reject — the payback exceeds the asset life" },
        { id: "c", text: "Indifferent — solar never saves money" },
        { id: "d", text: "Defer — there is no financial case at all" },
      ],
      correctOptionIds: ["a"],
      rubric:
        "Payback (6.25 yrs) is well within the 25-year life, leaving ~19 years of net savings; it is both financially and environmentally positive.",
      modelAnswer:
        "Attractive: 6.25-year payback against a 25-year life means ~19 years of net savings on top of the emissions cut.",
    },
    {
      id: "sustain-q3",
      format: "single",
      dimension: "data",
      prompt:
        "Casey: Using Exhibit 2, which lever should Verde prioritize on a pure cost-effectiveness basis?",
      exhibitRefs: ["ex-abatement"],
      timeLimitSec: 75,
      options: [
        {
          id: "a",
          text: "LED retrofit — the most negative cost per tonne (-$60), i.e., it saves the most money while cutting CO2",
        },
        { id: "b", text: "Green hydrogen heating — the highest cost per tonne" },
        { id: "c", text: "Fleet electrification — positive cost per tonne" },
        { id: "d", text: "All levers cost the same" },
      ],
      correctOptionIds: ["a"],
      rubric:
        "On the abatement cost curve, the most negative $/tonne (LED at -$60) is the cheapest emissions cut and is itself cash-positive; do the money-savers first.",
      modelAnswer:
        "LED retrofit at -$60/tonne — the cheapest, cash-positive abatement; sequence the negative-cost levers first.",
    },
    {
      id: "sustain-q4",
      format: "multi",
      dimension: "structuring",
      prompt:
        "Casey: To build the 2030 roadmap, select the 3 most decision-relevant inputs.",
      exhibitRefs: [],
      selectCount: 3,
      timeLimitSec: 90,
      options: [
        { id: "a", text: "Abatement cost per tonne for each lever" },
        { id: "b", text: "Total tonnes abatable by each lever vs. the 50% target" },
        { id: "c", text: "Capital available and payback hurdle" },
        { id: "d", text: "The font used in the ESG report" },
        { id: "e", text: "The CFO's astrological sign" },
        { id: "f", text: "Number of plants in the lobby" },
      ],
      correctOptionIds: ["a", "b", "c"],
      rubric:
        "A credible roadmap needs cost-effectiveness (a), the size of each lever vs. the target (b), and capital/hurdle constraints (c).",
      modelAnswer:
        "Cost per tonne by lever, abatement potential vs. the 50% target, and available capital plus the payback hurdle.",
    },
    {
      id: "sustain-q5",
      format: "long-text",
      dimension: "judgment",
      prompt:
        "Casey: Recommend how Verde should sequence its decarbonization program to hit the target cost-effectively (3-6 lines).",
      exhibitRefs: ["ex-abatement"],
      timeLimitSec: 240,
      charLimit: 500,
      rubric:
        "Strong answers sequence up the abatement cost curve: do the cash-positive levers first (LED, solar), reinvest savings into more expensive levers (fleet), and treat the costliest (hydrogen) as later/last or contingent on cost declines — while checking the total adds up to 50%. Reward 'fund later steps with early savings' logic. Penalize doing everything at once or ignoring the target.",
      modelAnswer:
        "Move up the abatement cost curve: deploy the cash-positive levers first (LED retrofit, then solar), banking their savings to fund pricier steps. Add fleet electrification next as costs fall, and defer green hydrogen until it is cheaper or unavoidable to hit 50%. Validate that the chosen levers' combined tonnage actually reaches the 2030 target before committing capital.",
    },
    {
      id: "sustain-q6",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: Ignoring discounting, what is the net lifetime savings of the solar program ($8M/yr saving over a 25-year life, less the $50M cost)? Answer in dollars.",
      exhibitRefs: ["ex-solar"],
      timeLimitSec: 150,
      expectedValue: 150000000,
      tolerance: 1000000,
      unitHint: "$",
      rubric: "$8M x 25 = $200M gross savings; minus $50M cost = $150M net.",
      modelAnswer: "$8M x 25 - $50M = $200M - $50M = $150M.",
    },
    {
      id: "sustain-q7",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: What are the solar program's net lifetime savings per tonne of CO2 avoided? (Net savings = $8M/yr x 25 - $50M; CO2 avoided = 120,000 t/yr x 25.) Answer in dollars per tonne.",
      exhibitRefs: ["ex-solar"],
      timeLimitSec: 180,
      expectedValue: 50,
      tolerance: 3,
      unitHint: "$ / tonne",
      rubric:
        "Net savings = $8M x 25 - $50M = $200M - $50M = $150M. CO2 avoided = 120,000 x 25 = 3,000,000 tonnes. $150M / 3,000,000 = $50 of net savings per tonne avoided (a negative abatement cost — it pays for itself).",
      modelAnswer: "$150M net / 3,000,000 t = $50/tonne saved.",
    },
    {
      id: "sustain-q8",
      format: "single",
      dimension: "data",
      prompt:
        "Casey: Besides the LED retrofit, which lever in Exhibit 2 is also cash-positive (a negative cost per tonne)?",
      exhibitRefs: ["ex-abatement"],
      timeLimitSec: 75,
      options: [
        { id: "a", text: "On-site solar (-$25/tonne)" },
        { id: "b", text: "Fleet electrification (+$35/tonne)" },
        { id: "c", text: "Green hydrogen heating (+$210/tonne)" },
        { id: "d", text: "None of the others are cash-positive" },
      ],
      correctOptionIds: ["a"],
      rubric:
        "Only LED (-$60) and on-site solar (-$25) have negative cost per tonne; fleet (+$35) and hydrogen (+$210) cost money per tonne abated.",
      modelAnswer: "On-site solar at -$25/tonne is the other cash-positive lever.",
    },
  ],
};
