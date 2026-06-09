import { z } from 'zod';

export const CreateUsuarioDto = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  apellido: z.string().trim().min(1, 'El apellido es obligatorio'),
  email: z.string().email('Debe proporcionar un email válido').trim().toLowerCase(),
  contrasenia: z.string().regex(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/,
    'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial'
  ),
  activo: z.boolean().optional(),
});

export type CreateUsuarioDto = z.infer<typeof CreateUsuarioDto>;