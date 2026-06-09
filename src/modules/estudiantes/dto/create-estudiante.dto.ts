import { z } from 'zod';

export const CreateEstudianteDto = z.object({
    dni: z.string().regex(/^\d+$/, 'El DNI debe contener solo números'),
    nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
    apellido: z.string().trim().min(1, 'El apellido es obligatorio'),
    email: z.string().email('Debe ser un email válido'),
    telefono: z.string().trim().min(1, 'El teléfono es obligatorio'),
    domicilio: z.string().trim().min(1, 'El domicilio es obligatorio'),
    provincia: z.string().trim().min(2, 'La provincia debe tener al menos 2 caracteres').nullable().optional(),
    localidad: z.string().trim().min(2, 'La localidad debe tener al menos 2 caracteres').nullable().optional(),
    fechaDeNacimiento: z.string().refine((date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate);
    }, 'La fecha de nacimiento debe ser una fecha válida'),
    foto: z.string().nullable().optional(),
    trabaja: z.boolean().nullable().optional(),
    activo: z.boolean().optional().default(true),
    idUsuario: z.number().int().positive(),
    idAdministrativo: z.number().int().positive(),
});

export type CreateEstudianteDto = z.infer<typeof CreateEstudianteDto>;