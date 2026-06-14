import type { CaseStudy } from "@/lib/types";

// Northwind Coffee Co. - profitability decline driven by channel mix shift.
// All figures internally consistent: Year 1 operating profit $100M (12.5% margin),
// Year 3 operating profit $82M (9.1% margin) => an 18% profit decline.
export const profitabilityCase: CaseStudy = {
  id: "prof-northwind",
  type: "profitability",
  title: "Northwind Coffee Co.: The Vanishing Margin",
  company: "Northwind Coffee Co.",
  clientObjective:
    "Northwind, a national coffee chain, has grown revenue from $800M to $900M over two years, yet operating profit has fallen 18%. The CEO wants to know why margins are eroding and what to do about it.",
  background:
    "Northwind operates 1,200 company-owned cafes across three sales channels: in-store, drive-thru, and a recently expanded third-party delivery channel. Delivery orders carry a ~30% platform commission. The CEO suspects rising costs but has no clear diagnosis. You have been engaged to find the primary driver of the margin decline and recommend a fix.",
  exhibits: [
    {
      id: "ex-pl",
      kind: "table",
      title: "Exhibit 1: Operating P&L Summary ($M)",
      note: "Costs shown as both absolute $M and as a % of revenue.",
      columns: [
        { key: "line", label: "Line item" },
        { key: "y1", label: "Year 1 ($M)" },
        { key: "y1pct", label: "Year 1 (% rev)" },
        { key: "y3", label: "Year 3 ($M)" },
        { key: "y3pct", label: "Year 3 (% rev)" },
      ],
      data: [
        { line: "Revenue", y1: 800, y1pct: "100.0%", y3: 900, y3pct: "100.0%" },
        { line: "COGS", y1: 280, y1pct: "35.0%", y3: 333, y3pct: "37.0%" },
        { line: "Labor", y1: 240, y1pct: "30.0%", y3: 297, y3pct: "33.0%" },
        { line: "Rent", y1: 80, y1pct: "10.0%", y3: 95, y3pct: "10.6%" },
        { line: "Marketing", y1: 40, y1pct: "5.0%", y3: 55, y3pct: "6.1%" },
        { line: "Other", y1: 60, y1pct: "7.5%", y3: 38, y3pct: "4.2%" },
        { line: "Operating profit", y1: 100, y1pct: "12.5%", y3: 82, y3pct: "9.1%" },
      ],
    },
    {
      id: "ex-channel",
      kind: "bar",
      title: "Exhibit 2: Revenue by Channel ($M)",
      note: "Delivery surged from $40M to $130M. Delivery carries ~30% platform commission vs. ~0% for in-store/drive-thru.",
      categoryKey: "channel",
      series: [
        { key: "y1", label: "Year 1" },
        { key: "y3", label: "Year 3" },
      ],
      data: [
        { channel: "In-store", y1: 560, y3: 540 },
        { channel: "Drive-thru", y1: 200, y3: 230 },
        { channel: "Delivery", y1: 40, y3: 130 },
      ],
    },
    {
      id: "ex-ticket",
      kind: "line",
      title: "Exhibit 3: Same-Store Transactions vs. Avg Ticket (indexed, Y1=100)",
      categoryKey: "period",
      series: [
        { key: "transactions", label: "Transactions" },
        { key: "ticket", label: "Avg ticket" },
      ],
      data: [
        { period: "Y1 H1", transactions: 100, ticket: 100 },
        { period: "Y1 H2", transactions: 101, ticket: 102 },
        { period: "Y2 H1", transactions: 100, ticket: 105 },
        { period: "Y2 H2", transactions: 99, ticket: 108 },
        { period: "Y3 H1", transactions: 98, ticket: 111 },
        { period: "Y3 H2", transactions: 98, ticket: 113 },
      ],
    },
    {
      id: "ex-region",
      kind: "table",
      title: "Exhibit 4: Revenue by Region ($M)",
      note: "Regional split provided for completeness.",
      hardModeOnly: true,
      columns: [
        { key: "region", label: "Region" },
        { key: "y1", label: "Year 1" },
        { key: "y3", label: "Year 3" },
      ],
      data: [
        { region: "Northeast", y1: 240, y3: 261 },
        { region: "South", y1: 200, y3: 234 },
        { region: "Midwest", y1: 180, y3: 198 },
        { region: "West", y1: 180, y3: 207 },
      ],
    },
  ],
  questions: [
    {
      id: "prof-q1",
      format: "multi",
      dimension: "structuring",
      prompt:
        "Casey: To diagnose Northwind's profit decline efficiently, select the 3 MOST relevant data sources to examine first.",
      exhibitRefs: [],
      selectCount: 3,
      timeLimitSec: 75,
      options: [
        { id: "a", text: "Cost structure as a % of revenue over time (P&L trend)" },
        { id: "b", text: "Revenue and margin by sales channel" },
        { id: "c", text: "Transaction volume vs. average ticket trend" },
        { id: "d", text: "CEO's compensation history" },
        { id: "e", text: "Competitor store opening schedule" },
        { id: "f", text: "Employee satisfaction survey results" },
      ],
      correctOptionIds: ["a", "b", "c"],
      rubric:
        "Best answers isolate where margin is leaking: the P&L cost trend (a), channel economics (b), and volume vs. price decomposition (c). Distractors (d,e,f) are not first-order drivers of a margin decline.",
      modelAnswer:
        "P&L cost structure over time, revenue/margin by channel, and transactions vs. average ticket — these localize the leak by cost line, by channel, and by volume vs. price.",
    },
    {
      id: "prof-q2",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: Using Exhibit 1, what is Northwind's Year 3 operating margin? Answer as a percentage to one decimal place.",
      exhibitRefs: ["ex-pl"],
      timeLimitSec: 150,
      expectedValue: 9.1,
      tolerance: 0.2,
      unitHint: "%",
      rubric:
        "Operating profit 82 / revenue 900 = 9.11% ≈ 9.1%. Reward a clean ratio and correct rounding.",
      modelAnswer: "82 / 900 = 9.1%.",
    },
    {
      id: "prof-q3",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: By how many percentage points did labor as a share of revenue increase from Year 1 to Year 3? Answer in percentage points.",
      exhibitRefs: ["ex-pl"],
      timeLimitSec: 150,
      expectedValue: 3,
      tolerance: 0.3,
      unitHint: "percentage points",
      rubric:
        "Year 1 labor 240/800 = 30.0%; Year 3 labor 297/900 = 33.0%; increase = 3.0 pts.",
      modelAnswer: "30.0% to 33.0% = +3.0 percentage points.",
    },
    {
      id: "prof-q4",
      format: "single",
      dimension: "data",
      prompt:
        "Casey: Based on Exhibits 1 and 2, which factor BEST explains the margin compression?",
      exhibitRefs: ["ex-pl", "ex-channel"],
      timeLimitSec: 75,
      options: [
        {
          id: "a",
          text: "Mix shift toward delivery, which carries ~30% platform commission and dilutes margin",
        },
        { id: "b", text: "A collapse in total revenue" },
        { id: "c", text: "A one-time rent spike" },
        { id: "d", text: "Falling average ticket per customer" },
      ],
      correctOptionIds: ["a"],
      rubric:
        "Revenue grew (rules out b); rent moved only 10.0%->10.6% (rules out c); avg ticket rose per Exhibit 3 (rules out d). Delivery tripled to $130M and its commission inflates COGS/Other, compressing margin.",
      modelAnswer:
        "The channel mix shift to delivery — delivery revenue grew from $40M to $130M and its ~30% commission structurally lowers blended margin.",
    },
    {
      id: "prof-q5",
      format: "long-text",
      dimension: "judgment",
      prompt:
        "Casey: The CEO asks for your recommended next steps to restore margin without abandoning growth. Be specific and prioritized (3-6 lines).",
      exhibitRefs: ["ex-pl", "ex-channel"],
      timeLimitSec: 240,
      charLimit: 500,
      rubric:
        "Strong answers protect the profitable channels while fixing delivery economics: e.g., (1) renegotiate platform commissions or add a delivery surcharge / minimum basket, (2) push first-party app ordering to bypass commissions, (3) address labor productivity. Reward prioritization, quantified linkage to the margin gap, and avoiding the false choice of exiting delivery outright. Penalize generic 'cut costs' answers.",
      modelAnswer:
        "1) Fix delivery economics: renegotiate the ~30% commission, add a delivery surcharge/minimum basket, and steer customers to a first-party app to bypass platform fees. 2) Defend labor productivity (+3 pts of revenue) via scheduling to demand. 3) Keep growing drive-thru, the high-margin growth channel. Net: recover most of the 3.4 pt margin gap without sacrificing volume.",
    },
    {
      id: "prof-q6",
      format: "single",
      dimension: "data",
      prompt:
        "Casey: What does Exhibit 3 tell you about the source of Northwind's revenue growth?",
      exhibitRefs: ["ex-ticket"],
      timeLimitSec: 75,
      options: [
        {
          id: "a",
          text: "Growth came almost entirely from higher average ticket (+13%), not more transactions (roughly flat)",
        },
        { id: "b", text: "Growth came from a surge in transactions" },
        { id: "c", text: "Both transactions and ticket fell" },
        { id: "d", text: "Average ticket fell while transactions rose" },
      ],
      correctOptionIds: ["a"],
      rubric:
        "Transactions are flat-to-down (100 -> 98) while average ticket rose ~13% (100 -> 113); growth is price/mix-led, not volume-led — a fragile basis if pricing power fades.",
      modelAnswer:
        "Revenue growth was price-led: average ticket rose ~13% while transactions were flat-to-declining.",
    },
    {
      id: "prof-q7",
      format: "short-quant",
      dimension: "quant",
      prompt:
        "Casey: Using Exhibit 1, what is the combined COGS + Labor as a share of revenue in Year 3? Answer as a percentage to one decimal place.",
      exhibitRefs: ["ex-pl"],
      timeLimitSec: 120,
      expectedValue: 70,
      tolerance: 0.3,
      unitHint: "%",
      rubric: "COGS 37.0% + Labor 33.0% = 70.0% of revenue in Year 3.",
      modelAnswer: "37.0% + 33.0% = 70.0%.",
    },
    {
      id: "prof-q8",
      format: "multi",
      dimension: "structuring",
      prompt:
        "Casey: Select the 2 highest-leverage levers to restore margin without shrinking the business.",
      exhibitRefs: ["ex-channel"],
      selectCount: 2,
      timeLimitSec: 75,
      options: [
        { id: "a", text: "Renegotiate the third-party delivery commission" },
        { id: "b", text: "Drive customers to first-party app ordering to bypass commissions" },
        { id: "c", text: "Halve the marketing budget" },
        { id: "d", text: "Close all delivery operations immediately" },
        { id: "e", text: "Raise in-store prices another 15%" },
      ],
      correctOptionIds: ["a", "b"],
      rubric:
        "The margin leak is delivery commission, so attack it directly (renegotiate) and structurally (shift volume to first-party app). Cutting marketing or exiting delivery sacrifices growth; further price hikes risk the already-flat transactions.",
      modelAnswer:
        "Renegotiate delivery commissions and shift orders to a first-party app — both fix the delivery margin leak while preserving the growth channel.",
    },
  ],
};
