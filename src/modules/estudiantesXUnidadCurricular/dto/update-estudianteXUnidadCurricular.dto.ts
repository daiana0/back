import { CreateEstudianteXUnidadCurricularDto } from './create-estudianteXUnidadCurricular.dto.js';
import { z } from 'zod';

export const UpdateEstudianteXUnidadCurricularDto = CreateEstudianteXUnidadCurricularDto.partial();
export type UpdateEstudianteXUnidadCurricularDto = z.infer<typeof UpdateEstudianteXUnidadCurricularDto>;
