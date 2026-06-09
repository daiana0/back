import { z } from "zod";

export const CreateCarreraDto = z.object({
  codigo: z.string().trim().min(1, "El código es obligatorio"),
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),
  tipo: z.enum(["permanente", "a_termino"]),
  activo: z.boolean().optional().default(true),
  imagen: z.string().optional().nullable(),
  descripcion: z.string().optional().nullable(),
  dossier: z.string().optional().nullable(),
  idAdministrativo: z.number().int().positive(),
});

export type CreateCarreraDto = z.infer<typeof CreateCarreraDto>;