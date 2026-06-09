import { CreateUnidadCurricularDto } from "./create-unidad-curricular.dto.js";
import { z } from "zod";

export const UpdateUnidadCurricularDto = CreateUnidadCurricularDto.partial();
export type UpdateUnidadCurricularDto = z.infer<typeof UpdateUnidadCurricularDto>;