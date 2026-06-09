import { z } from 'zod';

export const CreateInstanciaEvaluativaDto = z.object({
  idDivisionXUnidadCurricular: z.number().int().positive(),
  descripcion: z.string().trim().min(1),
  fecha: z.string().date('La fecha debe tener formato YYYY-MM-DD'),
  tipo: z.enum([
    'trabajo practico',
    'parcial',
    'examen final',
    'recuperatorio',
    'coloquio',
    'proyecto integrador',
  ]),
  idAdministrativo: z.number().int().positive(),
});

export type CreateInstanciaEvaluativaDto = z.infer<typeof CreateInstanciaEvaluativaDto>;
