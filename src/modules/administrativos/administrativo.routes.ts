import { Router } from 'express';
import { administrativoController } from './controller/administrativo.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const administrativoRouter = Router();

// Rutas de lectura (cualquier autenticado)
administrativoRouter.get(
  '/',
  validateJwt,
  administrativoController.getAll,
);

administrativoRouter.get(
  '/:id',
  validateJwt,
  administrativoController.getById,
);

// Rutas de escritura (solo ADMIN)
administrativoRouter.post(
  '/',
  validateJwt,
  validateRole(Role.ADMIN),
  administrativoController.create,
);

administrativoRouter.patch(
  '/:id',
  validateJwt,
  validateRole(Role.ADMIN),
  administrativoController.update,
);

administrativoRouter.delete(
  '/:id',
  validateJwt,
  validateRole(Role.ADMIN),
  administrativoController.delete,
);