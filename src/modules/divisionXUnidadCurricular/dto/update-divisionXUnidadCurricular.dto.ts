import { CreateDivisionXUnidadCurricularDto } from './create-divisionXUnidadCurricular.dto.js';
import { z } from 'zod';

export const UpdateDivisionXUnidadCurricularDto = CreateDivisionXUnidadCurricularDto.partial();

export type UpdateDivisionXUnidadCurricularDto = z.infer<typeof UpdateDivisionXUnidadCurricularDto>;
