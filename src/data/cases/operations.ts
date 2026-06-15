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
      note: "Capacity = lines x output/hr x hours/day x days/yr. The 300 operating days already exclude planned maintenance. Defects are reworked, not scrapped, so they do not reduce net output.",
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
        { metric: "Planned maintenance (already excluded)", value: "15 days" },
        { metric: "Defect rate (reworked, not scrapped)", value: "3%" },
        { metric: "Direct operators / line / shift", value: "6" },
        { metric: "Avg units in work-in-progress", value: "12,000" },
      ],
    },
    {
      id: "ex-options",
      kind: "table",
      title: "Exhibit 2: Capacity Expansion Options",
      note: "Annual cost is the incremental run-rate. Upfront capex and lead time shown for context.",
      columns: [
        { key: "option", label: "Option" },
        { key: "added", label: "Added capacity / yr" },
        { key: "cost", label: "Annual cost" },
        { key: "capex", label: "Upfront capex" },
        { key: "lead", label: "Lead time" },
      ],
      data: [
        { option: "Add a 3rd shift (existing lines)", added: "720,000", cost: "$9.0M", capex: "$0.5M", lead: "1 month" },
        { option: "Build a 4th line (2 shifts)", added: "480,000", cost: "$14.0M", capex: "$22M", lead: "10 months" },
        { option: "Outsource overflow", added: "Unlimited", cost: "$45 / unit", capex: "$0", lead: "6 weeks" },
      ],
    },
    {
      id: "ex-downtime",
      kind: "bar",
      title: "Exhibit 3: Unplanned Downtime & Maintenance Cost by Cause",
      note: "Lost hours per year and the associated maintenance spend. Downtime is already reflected in the 300 operating days.",
      categoryKey: "cause",
      series: [
        { key: "hours", label: "Lost hours / yr" },
        { key: "cost", label: "Maint. cost ($K)" },
      ],
      data: [
        { cause: "Changeovers", hours: 220, cost: 310 },
        { cause: "Breakdowns", hours: 180, cost: 540 },
        { cause: "Material delays", hours: 140, cost: 180 },
        { cause: "Quality stops", hours: 90, cost: 120 },
      ],
    },
    {
      id: "ex-backlog",
      kind: "line",
      title: "Exhibit 4: Order Backlog & On-Time Delivery",
      note: "Backlog in thousands of units (left concept) and on-time delivery rate (%). Provided for context.",
      categoryKey: "quarter",
      series: [
        { key: "backlog", label: "Backlog (000s units)" },
        { key: "otd", label: "On-time delivery (%)" },
      ],
      data: [
        { quarter: "Q1", backlog: 40, otd: 95 },
        { quarter: "Q2", backlog: 75, otd: 91 },
        { quarter: "Q3", backlog: 120, otd: 86 },
        { quarter: "Q4", backlog: 160, otd: 82 },
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
        "Casey: Apex adds a third shift on TWO of its three lines (each added shift = 100 units/hr x 8 hrs x 300 days). If demand grows to 1,760,000 units, what is plant utilization? Answer as a percentage to one decimal place.",
      exhibitRefs: ["ex-ops"],
      timeLimitSec: 210,
      expectedValue: 91.7,
      tolerance: 0.5,
      unitHint: "%",
      rubric:
        "Added capacity = 2 x 100 x 8 x 300 = 480,000. New capacity = 1,440,000 + 480,000 = 1,920,000. Utilization = 1,760,000 / 1,920,000 = 91.7%.",
      modelAnswer: "Added 480,000 -> 1,920,000 capacity; 1,760,000 / 1,920,000 = 91.7%.",
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
        "Casey: The 3rd-shift option costs $9.0M/yr and adds 720,000 units of capacity. What is its cost per unit of added capacity (which you can then compare to outsourcing at $45/unit)? Answer in dollars per unit.",
      exhibitRefs: ["ex-ops", "ex-options"],
      timeLimitSec: 180,
      expectedValue: 12.5,
      tolerance: 0.3,
      unitHint: "$ / unit",
      rubric:
        "$9,000,000 / 720,000 = $12.50 per unit of added capacity — far below the $45/unit outsourcing rate, so for large, sustained volume the 3rd shift is much cheaper per unit.",
      modelAnswer: "$9.0M / 720,000 = $12.50/unit, vs $45/unit outsourced.",
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
