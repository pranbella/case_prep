import Anthropic from "@anthropic-ai/sdk";
import type { GradeRequestPayload } from "@/lib/grading";

const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5";

export function getClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
}

const SYSTEM_PROMPT = `You are a former BCG case team leader grading a candidate's response in the BCG Casey online case assessment. You are demanding, precise, and concise — exactly like a real BCG interviewer debrief.

GRADING PHILOSOPHY:
- Reward: MECE structure, sharp prioritization, brevity, quantified reasoning, and direct business relevance tied to the client's objective.
- Penalize hard: generic memorized frameworks (e.g., reciting "Porter's 5 Forces" or a full profitability tree with no tailoring), verbosity and repetition, unsupported conclusions, and answers that ignore the exhibits or the question actually asked.
- A "10" is a crisp, top-1% answer a partner would be impressed by. A "5" is mediocre/incomplete. Be willing to give low scores; most real candidates score 4-7.
- For quantitative answers, correctness of the final number AND a clean, well-set-up approach both matter. If a deterministic check says the number is wrong, the score must reflect that (cap at ~4 unless the method was otherwise excellent).

You MUST respond with ONLY a single valid JSON object, no prose before or after, in exactly this shape:
{
  "score": <number 0-10, one decimal allowed>,
  "whatWorked": "<specific strengths, 1-3 sentences>",
  "whatWasMissing": "<specific weaknesses/gaps, 1-3 sentences>",
  "whatABCGConsultantWouldDo": "<concrete example of the consulting move expected>",
  "betterAnswer": "<a stronger model answer, concise, in the candidate's voice>",
  "communicationReview": { "structure": <0-10>, "precision": <0-10>, "prioritization": <0-10>, "judgment": <0-10> },
  "caseyReadiness": "<one of: Strong pass | Pass | Borderline | Likely fail>"
}`;

export function buildUserPrompt(p: GradeRequestPayload): string {
  return `CASE: ${p.caseTitle} (${p.caseType})
CLIENT OBJECTIVE: ${p.clientObjective}
DIFFICULTY MODE: ${p.mode}${p.isFinalRecommendation ? "\nTHIS IS THE FINAL 60-SECOND RECOMMENDATION (synthesis under time pressure). Grade on: clear recommendation, supporting evidence, risks, and next steps — delivered concisely." : ""}

EXHIBIT CONTEXT AVAILABLE TO THE CANDIDATE:
${p.exhibitsContext || "(none)"}

QUESTION (${p.questionFormat}, skill: ${p.dimension}):
${p.questionPrompt}

GRADING RUBRIC (internal guidance, do not quote verbatim):
${p.rubric}

REFERENCE STRONG ANSWER (for your calibration, do not copy verbatim into feedback):
${p.modelAnswer}
${p.objectiveVerdict ? `\nDETERMINISTIC CHECK RESULT: ${p.objectiveVerdict}` : ""}

CANDIDATE'S ANSWER:
"""
${p.userAnswer || "(no answer submitted)"}
"""

Grade now. Return ONLY the JSON object.`;
}

export async function gradeWithClaude(
  client: Anthropic,
  payload: GradeRequestPayload
): Promise<string> {
  const msg = await client.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 1024,
    temperature: 0.2,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(payload) }],
  });

  const text = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");
  return text;
}
