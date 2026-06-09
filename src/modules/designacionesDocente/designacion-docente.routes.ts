import { Router } from 'express';
import { designacionDocenteController } from './controller/designacionDocente.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const designacionDocenteRouter = Router();

// Rutas de lectura (cualquier autenticado)
designacionDocenteRouter.get(
  '/',
  validateJwt,
  designacionDocenteController.getAll,
);

designacionDocenteRouter.get(
  '/:id',
  validateJwt,
  designacionDocenteController.getById,
);

// Rutas de escritura (solo ADMIN)
designacionDocenteRouter.post(
  '/',
  validateJwt,
  validateRole(Role.ADMIN),
  designacionDocenteController.create,
);

designacionDocenteRouter.patch(
  '/:id',
  validateJwt,
  validateRole(Role.ADMIN),
  designacionDocenteController.update,
);

designacionDocenteRouter.delete(
  '/:id',
  validateJwt,
  validateRole(Role.ADMIN),
  designacionDocenteController.delete,
);
