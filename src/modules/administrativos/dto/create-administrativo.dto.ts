import { z } from 'zod';

export const CreateAdministrativoDto = z.object({
  nombre: z.string().trim().min(1),
  apellido: z.string().trim().min(1),
  email: z.string().email(),
  dni: z.string().regex(/^\d+$/, 'Debe contener solo números'),
  contrasenia: z.string().regex(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/,
    'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial'
  ),
  telefono: z.string().min(1),
  domicilio: z.string().min(1),
  idRol: z.number().int().positive(),
  activo: z.boolean().optional().default(true),
});

export type CreateAdministrativoDto = z.infer<typeof CreateAdministrativoDto>;