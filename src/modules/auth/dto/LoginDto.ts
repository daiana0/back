import { z } from 'zod';
export const TipoDeRoles = z.enum(['ADMINISTRATIVO', 'DOCENTE', 'ESTUDIANTE', 'USUARIO']);
const LoginDto = z.object({
    email: z.string().email('Debe proporcionar un email válido'),
    contrasenia: z.string().regex(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/,
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial'
    ),
    rol: TipoDeRoles
});

export default LoginDto