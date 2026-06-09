import { z } from 'zod';

export const CreateDocenteDto = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  apellido: z.string().trim().min(1, 'El apellido es obligatorio'),
  email: z.string().email('Debe proporcionar un email válido').trim().toLowerCase(),
  contrasenia: z.string().regex(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/,
    'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial'
  ),
  dni: z.string().trim().regex(/^\d+$/, 'El DNI debe contener únicamente números'),
  titulo: z.string().trim().min(1, 'El título es obligatorio'),
  especialidad: z.string().trim().nullable().optional(),
  domicilio: z.string().trim().min(1, 'El domicilio es obligatorio'),
  telefono: z.string().trim().min(1, 'El teléfono es obligatorio'),
  foto: z.string().trim().nullable().optional(),
  idAdministrativo: z.number().int('El ID administrativo debe ser un entero'),
  activo: z.boolean().optional(),
});

export type CreateDocenteDto = z.infer<typeof CreateDocenteDto>;