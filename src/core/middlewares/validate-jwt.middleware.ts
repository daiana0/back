import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import TokenBlacklist from '../../modules/auth/model/TokenBlacklist.js';

dotenv.config();

export interface JwtPayload {
  id: number;
  idEstudiante?: number;
  email: string;
  rol: string;
  entityType?: string;
  nombre?: string;
  apellido?: string;
  jti?: string;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const validateJwt = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Token no proporcionado o formato incorrecto',
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret_key_provisoria'
    ) as JwtPayload & { jti?: string; exp?: number };

    // Verificar si el token está en la lista negra
    if (decoded.jti) {
      const blacklisted = await TokenBlacklist.findOne({ where: { jti: decoded.jti } });
      if (blacklisted) {
        return res.status(401).json({
          status: 'error',
          message: 'Token revocado (sesión cerrada)',
        });
      }
    }

    req.user = {
      id: decoded.id,
      idEstudiante: decoded.idEstudiante,
      email: decoded.email,
      rol: decoded.rol,
      entityType: decoded.entityType,
      jti: decoded.jti,
      exp: decoded.exp,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Token inválido o expirado',
      error
    });
  }
};

