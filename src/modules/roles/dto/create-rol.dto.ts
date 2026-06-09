import { z } from 'zod';

export const CreateRolDto = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  descripcion: z.string().trim().min(1, 'La descripción es obligatoria'),
});

export type CreateRolDto = z.infer<typeof CreateRolDto>;