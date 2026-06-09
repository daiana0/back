import { CreatePlanEstudioDto } from "./create-plan-estudio.dto.js";
import { z } from "zod";

export const UpdatePlanEstudioDto = CreatePlanEstudioDto.partial();
export type UpdatePlanEstudioDto = z.infer<typeof UpdatePlanEstudioDto>;