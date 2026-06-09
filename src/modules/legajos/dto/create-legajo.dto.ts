import { z } from 'zod';

export const CreateLegajoDto = z.object({
    idEstudiante: z.number().int().positive(),
    numeroLegajo: z.number().int().positive(),
    idPlanEstudio: z.number().int().positive(),
    activo: z.boolean().optional().default(true),
    idAdministrativo: z.number().int().positive(),
});

export type CreateLegajoDto = z.infer<typeof CreateLegajoDto>;