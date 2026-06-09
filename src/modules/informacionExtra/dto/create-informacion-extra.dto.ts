import { z } from 'zod';

export const CreateInformacionExtraDto = z.object({
    titulo: z.string().trim().min(1, 'El título es obligatorio'),
    icono: z.string().nullable().optional(),
    descripcion: z.string().min(1, 'La descripción es obligatoria'),
    idCarrera: z.number().int().positive(),
});

export type CreateInformacionExtraDto = z.infer<typeof CreateInformacionExtraDto>;