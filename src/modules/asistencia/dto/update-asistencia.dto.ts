import { CreateAsistenciaDto } from './create-asistencia.dto.js';
import { z } from 'zod';

export const UpdateAsistenciaDto = CreateAsistenciaDto.partial();
export type UpdateAsistenciaDto = z.infer<typeof UpdateAsistenciaDto>;
