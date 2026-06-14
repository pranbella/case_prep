import type { CaseStudy } from "@/lib/types";
import { profitabilityCase } from "./profitability";
import { marketEntryCase } from "./marketEntry";
import { pricingCase } from "./pricing";
import { operationsCase } from "./operations";
import { growthCase } from "./growth";
import { customerSatisfactionCase } from "./customerSatisfaction";
import { digitalTransformationCase } from "./digitalTransformation";
import { sustainabilityCase } from "./sustainability";

export const CASE_BANK: CaseStudy[] = [
  profitabilityCase,
  marketEntryCase,
  pricingCase,
  operationsCase,
  growthCase,
  customerSatisfactionCase,
  digitalTransformationCase,
  sustainabilityCase,
];
