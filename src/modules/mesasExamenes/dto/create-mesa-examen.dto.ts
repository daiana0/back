import { z } from 'zod';

// Definimos un Enum para el tipo de mesa para asegurar consistencia con la DB
export const TipoMesaExamen = z.enum(["REGULAR", "LIBRE", "PROMOCIONAL"]);
export const CategoriaMesa = z.enum(["ORDINARIAS", "EXTRAORDINARIAS"]);

export const CreateMesaExamenDto = z.object({
  idTurnoExamen: z.number().int().positive(),
  idUnidadCurricular: z.number().int().positive(),
  fecha: z.string().date('La fecha debe tener formato YYYY-MM-DD'),
  hora: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido (HH:mm)"),
  idDocentePresidente: z.number().int().positive(),
  idDocenteVocal1: z.number().int().positive(),
  idDocenteVocal2: z.number().int().positive(),
  tipo: TipoMesaExamen,
  categoria: CategoriaMesa,
  idAdministrativo: z.number().int().positive(),
});

export type CreateMesaExamenDto = z.infer<typeof CreateMesaExamenDto>;