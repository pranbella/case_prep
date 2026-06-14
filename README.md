# BCG Casey Chatbot Simulator

A Vercel-deployable web app that simulates **BCG's Casey online case assessment** as realistically as possible: a timed, one-way (no clarifying questions, no mid-case coaching), multi-format case, graded by an AI ex-BCG interviewer.

Built for consulting candidates who want to practice structured thinking, data analysis, business judgment, quantitative reasoning, and concise written communication **under pressure**.

## Features

- **Realistic Casey flow** — case briefing → 8 timed questions → a 60s-prep / 60s-present video final recommendation (9 steps total per case).
- **Two practice tracks** — *Full simulation* (mixed formats: multiple choice, numeric entry, written) and *Written practice* where every question is answered in typed prose (quant still appears, but you write out your reasoning and final number).
- **One-way assessment** — you cannot ask Casey questions, pause the global timer, or revisit previous questions. Single-select answers submit on click, just like the real test. A practice-only **Skip** button is available (skipped questions score 0).
- **Five question types** — dataset/structuring (multi-select + written), data interpretation, business judgment, quantitative (calculator-allowed), and long-form written response with a character limit.
- **Real exhibits** — bar / line / pie charts (Recharts) and data tables, with distractor data in Hard Mode.
- **Always-visible 30-minute timer** with reminders every 5 minutes, plus per-question timers (60–90s MC, 2–4m quant, 3–5m written) that auto-submit on expiry.
- **AI grading (Claude Sonnet)** — every answer returns a 0–10 score, what worked, what was missing, what a BCG consultant would have done, a stronger example answer, a communication review (structure / precision / prioritization / judgment), and a **Casey Readiness** estimate (Strong pass / Pass / Borderline / Likely fail).
- **Deterministic quant/MC checks** feed the grader so numeric and multiple-choice correctness is scored objectively.
- **Hard Mode** — more exhibits, ~30% less time, extra ambiguous data, tougher calculations and judgment calls.
- **Configurable feedback** — immediate per-question (study mode) or end-of-case only (max stress).
- **Final recommendation** — typed answer (graded) plus an optional local webcam recording (stored in your browser, not uploaded or graded).
- **Local analytics** — average overall score and breakdown by dimension (structuring, data, judgment, quant, recommendation), plus a score trend across attempts. Stored in `localStorage`; nothing leaves your machine except answers sent for grading.

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Recharts (charts)
- Anthropic Claude (`@anthropic-ai/sdk`) via a server-side API route

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Add your Anthropic API key:

```bash
cp .env.example .env.local
# then edit .env.local and set ANTHROPIC_API_KEY=sk-ant-...
```

> Without a key the app still runs in **offline grading mode**: multiple-choice and quantitative answers are graded deterministically, and written answers get a basic heuristic score. Add a key for full ex-BCG feedback.

3. Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Add the environment variable `ANTHROPIC_API_KEY` (and optionally `ANTHROPIC_MODEL`) in the Vercel project settings.
4. Deploy. The grading route runs as a Node serverless function (`src/app/api/grade/route.ts`).

## How grading works

1. The client evaluates objective questions (MC selections, numeric answers within tolerance) deterministically.
2. The answer, the relevant exhibits, the rubric, and the deterministic verdict are sent to `POST /api/grade`.
3. The server prompts Claude as a demanding ex-BCG interviewer and returns strict JSON feedback, which is validated and clamped before display.
4. If the API key is missing or a call fails, the app falls back to offline grading so a session is never blocked.

## Project structure

```
src/
  app/
    page.tsx            # landing + settings
    simulate/page.tsx   # core timed simulation engine
    results/page.tsx    # per-question feedback + scorecard
    analytics/page.tsx  # local analytics dashboard
    api/grade/route.ts  # Claude grading endpoint (server)
  components/           # timers, exhibits, question card, feedback, final rec
  lib/                  # types, case engine, grading, storage, claude client
  data/cases/          # curated case bank (verified numbers + rubrics)
```

## Notes & limitations

- Cases are a **curated bank** (hand-authored with verified math and rubrics) rather than fully AI-generated, to keep exhibit numbers internally consistent and grading fair. Case selection, question order, and option order are randomized.
- The optional webcam recording is kept only in the browser tab and is **not** transcribed or graded.
- This is an independent practice tool and is not affiliated with or endorsed by BCG.
