import { z } from 'zod';

export const CreateDossierInstitucionalDto = z.object({
  idCarrera: z.number().int().positive(),
  titulo: z.string().trim().min(1, 'El título es obligatorio'),
  seccion: z.string().trim().min(1, 'La sección es obligatoria'),
  contenido: z.string().min(1, 'El contenido es obligatorio'),
  urlArchivo: z.string().url().nullable().optional(),
  tipo: z.enum(['NORMATIVA', 'INFORME', 'CIRCULAR']),
  estado: z.boolean().default(false),
  // fechaActualizacion: se asigna automáticamente por defaultValue en el modelo
  idAdministrativo: z.number().int().positive(),
});

export type CreateDossierInstitucionalDto = z.infer<typeof CreateDossierInstitucionalDto>;