import { z } from "zod";

export const CreatePlanEstudioDto = z.object({
  version: z.string().trim().min(1, "La versión es obligatoria"),
  fechaDeAprobacion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Debe tener formato YYYY-MM-DD"),
  fechaDeCierre: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Debe tener formato YYYY-MM-DD"),
  duracionEnAnios: z.number().int().positive("La duración debe ser un entero positivo"),
  estado: z.string().trim().optional(),
  idCarrera: z.number().int().positive("Debe ser un ID de carrera válido"),
  idAdministrativo: z.number().int().positive("Debe ser un ID de administrativo válido"),
});

export type CreatePlanEstudioDto = z.infer<typeof CreatePlanEstudioDto>;