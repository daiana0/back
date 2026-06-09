import { z } from "zod";

export const CreateUnidadCurricularDto = z.object({
  idPlanEstudio: z.number().int().positive("Debe ser un ID de plan de estudio válido"),
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),
  duracion: z.enum(["anual", "cuatrimestral"]),
  cargaHoraria: z.number().int().positive("La carga horaria debe ser un entero positivo"),
  cuatrimestre: z.enum(["primero", "segundo"]).optional().nullable(),
  idAdministrativo: z.number().int().positive("Debe ser un ID de administrativo válido"),
});

export type CreateUnidadCurricularDto = z.infer<typeof CreateUnidadCurricularDto>;