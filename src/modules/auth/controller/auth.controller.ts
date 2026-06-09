import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authService } from '../service/auth.service.js';
import { AppError } from '../../../core/middlewares/error-handler.middleware.js';
import crypto from 'crypto';
import LoginDto from '../dto/LoginDto.js';
import RecuperarContraseniaDto from '../dto/RecuperarContraseniaDto.js';
import RestablecerContraseniaDto from '../dto/RestablecerContraseniaDto.js';
import { recuperacionService } from '../service/recuperacion.service.js';
import dotenv from 'dotenv';

dotenv.config();

export const authController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = LoginDto.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          status: 'error',
          message: 'Datos inválidos',
          errors: parsed.error.flatten().fieldErrors,
        });
      }

      const { email, contrasenia, rol } = parsed.data;
      const user = await authService.login({ email, password: contrasenia, rol });

      if (!user) {
        throw new AppError('Credenciales inválidas', 401);
      }

      // Generar un JWT ID único
      const jti = crypto.randomUUID();

      const payload: Record<string, unknown> = {
        id: user.id,
        email: user.email,
        rol: user.rol,
        nombre: user.nombre,
        apellido: user.apellido,
        entityType: user.entityType,
        jti,
      };

      if (user.idEstudiante != null) {
        payload.idEstudiante = user.idEstudiante;
      }

      //se coloca esto por que si no da un error de tipo en jwt.sign
      const expiresIn = process.env.JWT_EXPIRES_IN
        ? parseInt(process.env.JWT_EXPIRES_IN, 10)
        : 3600 * 8;

      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || 'secret_key_provisoria',
        { expiresIn }
      );

      res.status(200).json({
        status: 'success',
        token,
        user: {
          id: user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          rol: user.rol,
          ...(user.idEstudiante != null ? { idEstudiante: user.idEstudiante } : {}),
        },
      });
    } catch (err) {
      next(err);
    }
  },

  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // req.user ya contiene el payload del token, incluyendo jti y exp
      const user = req.user;
      if (!user || !user.jti || !user.exp) {
        return res.status(400).json({
          status: 'error',
          message: 'No se pudo cerrar sesión (token inválido)',
        });
      }

      // Agregar el token a la lista negra
      await authService.logout(user.jti, user.exp);
      res.status(200).json({ status: 'success', message: 'Sesión cerrada exitosamente' });
    } catch (err) {
      next(err);
    }
  },

  recuperarContrasenia: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = RecuperarContraseniaDto.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          status: 'error',
          message: 'Datos inválidos',
          errors: parsed.error.flatten().fieldErrors,
        });
      }

      // El service es best-effort: no lanza si el email no existe ni
      // si el envío del correo falla. Siempre respondemos lo mismo
      // para no revelar al cliente qué emails están registrados.
      await recuperacionService.iniciarRecuperacion(parsed.data.email, parsed.data.rol);

      res.status(200).json({
        status: 'success',
        message: 'Si el email existe en nuestro sistema, te enviamos un correo con un link para restablecer la contraseña.',
      });
    } catch (err) {
      next(err);
    }
  },

  restablecerContrasenia: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = RestablecerContraseniaDto.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          status: 'error',
          message: 'Datos inválidos',
          errors: parsed.error.flatten().fieldErrors,
        });
      }

      try {
        await recuperacionService.restablecerContrasenia(
          parsed.data.token,
          parsed.data.nuevaContrasenia,
        );
      } catch (err) {
        // Errores de negocio del service (token inválido / vencido / usado)
        // se mapean a 400 con el mensaje original.
        throw new AppError((err as Error).message, 400);
      }

      res.status(200).json({
        status: 'success',
        message: 'Contraseña actualizada. Ya podés iniciar sesión con tu nueva contraseña.',
      });
    } catch (err) {
      next(err);
    }
  },
};