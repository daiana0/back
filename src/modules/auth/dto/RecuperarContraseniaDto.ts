import { z } from 'zod';
import { TipoDeRoles } from './LoginDto.js';

/**
 * Body de `POST /auth/recuperar-contrasenia`:
 * El usuario solicita el envío de un email con un link para restablecer.
 * El `rol` indica desde qué portal viene la solicitud, igual que el login.
 */
const RecuperarContraseniaDto = z.object({
  email: z.string().email('Debe proporcionar un email válido'),
  rol: TipoDeRoles,
});

export default RecuperarContraseniaDto;
