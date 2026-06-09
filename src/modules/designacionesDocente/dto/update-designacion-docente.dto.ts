import { CreateDesignacionDocenteDto } from './create-designacion-docente.dto.js';
import { z } from 'zod';

export const UpdateDesignacionDocenteDto = CreateDesignacionDocenteDto.partial();
export type UpdateDesignacionDocenteDto = z.infer<typeof UpdateDesignacionDocenteDto>;
