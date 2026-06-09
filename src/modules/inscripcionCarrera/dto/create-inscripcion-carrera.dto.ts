import { z } from 'zod';

export const CreateInscripcionCarreraDto = z.object({
    cupo: z.number().int().nullable().optional(),
    fechaDesde: z.string().date().nullable().optional(),
    fechaHasta: z.string().date().nullable().optional(),
    idPlanEstudio: z.number().int().positive(),
    idAdministrativo: z.number().int().positive(),
});

export type CreateInscripcionCarreraDto = z.infer<typeof CreateInscripcionCarreraDto>;