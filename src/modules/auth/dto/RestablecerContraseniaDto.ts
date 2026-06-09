import { z } from 'zod';

/**
 * Body de `POST /auth/restablecer-contrasenia`:
 * El usuario llegó vía email + link, ingresa la nueva contraseña.
 * El `token` es el valor plano que el back hashea y compara contra DB.
 */
const RestablecerContraseniaDto = z.object({
  token: z.string().min(1, 'El token es obligatorio'),
  nuevaContrasenia: z.string().regex(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/,
    'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial'
  ),
});

export default RestablecerContraseniaDto;
