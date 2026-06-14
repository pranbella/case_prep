import { NextRequest, NextResponse } from "next/server";
import { getClient, gradeWithClaude } from "@/lib/claude";
import {
  type GradeRequestPayload,
  parseGradeResponse,
  readinessFromScore,
} from "@/lib/grading";
import type { GradeResult } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  let payload: GradeRequestPayload;
  try {
    payload = (await req.json()) as GradeRequestPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const client = getClient();
  if (!client) {
    return NextResponse.json(
      { error: "no-api-key", message: "ANTHROPIC_API_KEY is not configured." },
      { status: 503 }
    );
  }

  try {
    const raw = await gradeWithClaude(client, payload);
    const grade: GradeResult = parseGradeResponse(raw);
    return NextResponse.json({ grade });
  } catch (err) {
    // If parsing fails, retry-free graceful degradation: a neutral grade.
    const message = err instanceof Error ? err.message : "Grading failed";
    const fallbackScore = 5;
    const grade: GradeResult = {
      score: fallbackScore,
      whatWorked: "Answer received.",
      whatWasMissing:
        "The grader could not produce structured feedback for this response.",
      whatABCGConsultantWouldDo:
        "Lead with the answer, support with evidence from the exhibits, and keep it concise.",
      betterAnswer: "",
      communicationReview: {
        structure: fallbackScore,
        precision: fallbackScore,
        prioritization: fallbackScore,
        judgment: fallbackScore,
      },
      caseyReadiness: readinessFromScore(fallbackScore),
    };
    return NextResponse.json({ grade, warning: message }, { status: 200 });
  }
}
