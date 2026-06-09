import { z } from 'zod';

export const CreatePreinscriptoDto = z.object({
  idCarrera: z.number().int().positive(),
  idUsuario: z.number().int().positive(),
  fechaInscripcion: z.string().date(),

  // ✅ Campos nuevos (datos personales del alumno)
  dni: z.string().trim().min(1, 'El DNI es obligatorio'),
  domicilio: z.string().trim().min(1, 'El domicilio es obligatorio'),
  telefono: z.string().trim().default(''),   // no obligatorio, si no se envía queda vacío

  // Archivos
  cus: z.string().trim().min(1),
  isa: z.string().trim().min(1),
  emmac: z.string().nullable().optional(),
  analitico: z.string().trim().min(1),
  partidaNacimiento: z.string().trim().min(1),
  foto: z.string().trim().min(1),

  estado: z.enum(['pendiente', 'aprobado', 'rechazado']).default('pendiente'),
});

export type CreatePreinscriptoDto = z.infer<typeof CreatePreinscriptoDto>;