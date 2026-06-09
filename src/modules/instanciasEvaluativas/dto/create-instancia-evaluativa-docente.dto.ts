import { z } from 'zod';

export const CreateInstanciaEvaluativaDocenteDto = z.object({
  idDivisionXUnidadCurricular: z.number().int().positive('La asignación es obligatoria'),
  descripcion: z.string().trim().min(1, 'El nombre es obligatorio'),
  fecha: z.string().date('La fecha debe tener formato YYYY-MM-DD'),
  tipo: z.enum([
    'trabajo practico',
    'parcial',
    'examen final',
    'recuperatorio',
    'coloquio',
    'proyecto integrador',
  ]),
});

export type CreateInstanciaEvaluativaDocenteDto = z.infer<typeof CreateInstanciaEvaluativaDocenteDto>;
