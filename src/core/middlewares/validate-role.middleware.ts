import { Request, Response, NextFunction } from 'express';
import { Role } from '../enums/role.enum.js';

export const validateRole = (...rolesPermitidos: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !rolesPermitidos.includes(user.rol as Role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Acceso no autorizado para este rol',
      });
    }
    next();
  };
};