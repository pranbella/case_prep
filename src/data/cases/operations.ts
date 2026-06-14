import type { CaseStudy } from "@/lib/types";

// Apex Manufacturing - capacity shortfall.
// 3 lines x 100 units/hr x 16 hrs/day x 300 days/yr = 1,440,000 units/yr capacity.
// Demand 1,600,000 => shortfall 160,000. Utilization at 1.2M demand = 83.3%.
export const operationsCase: CaseStudy = {
  id: "ops-apex",
  type: "operations",
  title: "Apex Manufacturing: The Capacity Crunch",
  company: "Apex Manufacturing",
  clientObjective:
    "Apex cannot fulfill all customer orders and is losing sales. The COO wants to know the size of the capacity gap and the most cost-effective way to close it.",
  background:
    "Apex runs a single plant with 3 production lines making industrial components. Each line produces 100 units/hour, runs two 8-hour shifts (16 hours) per day, 300 days per year. Annual demand is 1.6M units and growing. Options to add capacity include a third shift, a fourth line, or outsourcing.",
  exhibits: [
    {
      id: "ex-ops",
      kind: "table",
      title: "Exhibit 1: Current Production Parameters",
      columns: [
        { key: "metric", label: "Metric" },
        { key: "value", label: "Value" },
      ],
      data: [
        { metric: "Production lines", value: "3" },
        { metric: "Output per line", value: "100 units / hour" },
        { metric: "Operating hours / day", value: "16 (two shifts)" },
        { metric: "Operating days / year", value: "300" },
        { metric: "Annual demand", value: "1,600,000 units" },
      ],
    },
    {
      id: "ex-options",
      kind: "table",
      title: "Exhibit 2: Capacity Expansion Options",
      columns: [
        { key: "option", label: "Option" },
        { key: "added", label: "Added capacity / yr" },
        { key: "cost", label: "Annual cost" },
      ],
      data: [
        { option: "Add a 3rd shift (existing lines)", added: "720,000", cost: "$9.0M" },
        { option: "Build a 4th line (2 shifts)", added: "480,000", cost: "$14.0M" },
        { option: "Outsource overflow", added: "Unlimited", cost: "$45 / unit" },
      ],
    },
    {
      id: "ex-downtime",
      kind: "bar",
      title: "Exhibit 3: Unplanned Downtime by Cause (hours/yr)",
      hardModeOnly: true,
      categoryKey: "cause",
      series: [{ key: "hours", label: "Hours" }],
      data: [
        { cause: "Changeovers", hours: 220 },
        { cause: "Breakdowns", hours: 180 },
        { cause: "Material delays", hours: 140 },
        { cause: "Quality stops", hours: 90 },
      ],
    },
  ],
  questions: [
    {
      id: "ops-q1",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: Using Exhibit 1, what is Apex's current annual production capacity in units?",
      exhibitRefs: ["ex-ops"],
      timeLimitSec: 180,
      expectedValue: 1440000,
      tolerance: 0,
      unitHint: "units",
      rubric:
        "3 lines x 100 units/hr x 16 hrs/day x 300 days = 1,440,000 units/yr.",
      modelAnswer: "3 x 100 x 16 x 300 = 1,440,000 units per year.",
    },
    {
      id: "ops-q2",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: What is the annual capacity shortfall versus the 1.6M units of demand? Answer in units.",
      exhibitRefs: ["ex-ops"],
      timeLimitSec: 120,
      expectedValue: 160000,
      tolerance: 0,
      unitHint: "units",
      rubric: "1,600,000 - 1,440,000 = 160,000 unit shortfall.",
      modelAnswer: "1,600,000 - 1,440,000 = 160,000 units.",
    },
    {
      id: "ops-q3",
      format: "single",
      dimension: "judgment",
      prompt:
        "Casey: The shortfall is 160,000 units. Which option from Exhibit 2 is the most cost-effective way to close exactly this gap?",
      exhibitRefs: ["ex-options"],
      timeLimitSec: 90,
      options: [
        {
          id: "a",
          text: "Outsource the 160K overflow at $45/unit (~$7.2M) — lowest cost and exactly matches the gap",
        },
        {
          id: "b",
          text: "Build a 4th line for $14M, adding 480K units of mostly idle capacity",
        },
        {
          id: "c",
          text: "Add a 3rd shift for $9M, adding 720K units of mostly idle capacity",
        },
        { id: "d", text: "Do nothing and keep losing sales" },
      ],
      correctOptionIds: ["a"],
      rubric:
        "Outsourcing 160K at $45 = $7.2M, cheaper than the $9M third shift or $14M line, and it is right-sized to the gap. The capital options only win if demand is expected to keep growing well beyond 160K.",
      modelAnswer:
        "Outsource the 160K overflow (~$7.2M) — it exactly matches the gap and is cheaper than committing to a shift or line that would sit largely idle.",
    },
    {
      id: "ops-q4",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: If demand were only 1,200,000 units, what would plant utilization be? Answer as a percentage to one decimal place.",
      exhibitRefs: ["ex-ops"],
      timeLimitSec: 150,
      expectedValue: 83.3,
      tolerance: 0.3,
      unitHint: "%",
      rubric: "1,200,000 / 1,440,000 = 83.3%.",
      modelAnswer: "1,200,000 / 1,440,000 = 83.3%.",
    },
    {
      id: "ops-q5",
      format: "long-text",
      dimension: "judgment",
      prompt:
        "Casey: Beyond buying capacity, how could Apex close part of the gap by improving existing operations? Be specific and prioritized (3-6 lines).",
      exhibitRefs: ["ex-ops"],
      timeLimitSec: 240,
      charLimit: 500,
      rubric:
        "Strong answers attack effective capacity: reduce downtime/changeover losses, improve OEE, debottleneck the slowest line, or extend operating days. Reward quantified linkage (even rough) and prioritization. Penalize vague 'work harder' answers.",
      modelAnswer:
        "Lift effective capacity before spending capital: 1) cut changeover and breakdown downtime via SMED and preventive maintenance to reclaim run-hours, 2) raise line speed/yield (OEE) on the slowest line, 3) add operating days during peak demand. Even a few percent of recovered uptime offsets much of the 160K gap at minimal cost.",
    },
    {
      id: "ops-q6",
      format: "multi",
      dimension: "structuring",
      prompt:
        "Casey: Select the 3 analyses most relevant to choosing how to close the capacity gap.",
      exhibitRefs: [],
      selectCount: 3,
      timeLimitSec: 90,
      options: [
        { id: "a", text: "Cost per unit of each expansion option vs. the size of the gap" },
        { id: "b", text: "Demand growth forecast (is the gap temporary or growing?)" },
        { id: "c", text: "Root causes of unplanned downtime on existing lines" },
        { id: "d", text: "The CEO's preferred equipment vendor's logo" },
        { id: "e", text: "Number of parking spaces at the plant" },
        { id: "f", text: "The color of the safety helmets" },
      ],
      correctOptionIds: ["a", "b", "c"],
      rubric:
        "Right-sizing needs option cost vs. gap (a), the demand trajectory to decide capital vs. variable (b), and downtime root causes to see if free capacity can be unlocked (c).",
      modelAnswer:
        "Option cost vs. gap size, demand growth forecast, and downtime root-cause analysis.",
    },
    {
      id: "ops-q7",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: If Apex adds a 3rd shift on its existing lines (per Exhibit 2 adds 720,000 units/yr), what is the new total annual capacity? Answer in units.",
      exhibitRefs: ["ex-ops", "ex-options"],
      timeLimitSec: 120,
      expectedValue: 2160000,
      tolerance: 0,
      unitHint: "units",
      rubric: "1,440,000 current + 720,000 added = 2,160,000 units/yr.",
      modelAnswer: "1,440,000 + 720,000 = 2,160,000 units.",
    },
    {
      id: "ops-q8",
      format: "single",
      dimension: "judgment",
      prompt:
        "Casey: Suppose demand is forecast to keep climbing well past 1.8M units. How should that change the expansion choice versus closing only today's 160K gap?",
      exhibitRefs: ["ex-options"],
      timeLimitSec: 90,
      options: [
        {
          id: "a",
          text: "Favor committed capacity (3rd shift / new line) — at sustained high volume, $45/unit outsourcing becomes more expensive than owning capacity",
        },
        { id: "b", text: "Always outsource regardless of how high demand goes" },
        { id: "c", text: "Do nothing, since today's gap is small" },
        { id: "d", text: "Shut down a line to cut costs" },
      ],
      correctOptionIds: ["a"],
      rubric:
        "Outsourcing is best for a small/uncertain gap, but if high volume is durable, the per-unit premium compounds and owned capacity (3rd shift, then a line) becomes cheaper — match the commitment to the demand outlook.",
      modelAnswer:
        "If high demand is durable, shift to owned capacity (3rd shift/line); $45/unit outsourcing only wins for a small or uncertain gap.",
    },
  ],
};
