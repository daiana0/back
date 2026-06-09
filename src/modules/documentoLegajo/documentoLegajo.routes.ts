import { Router } from 'express';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';
import { documentoLegajoController } from './controller/documentoLegajo.controller.js';

export const documentoLegajoRouter = Router();

// Lectura: cualquier usuario autenticado
documentoLegajoRouter.get(
  '/',
  validateJwt,
  documentoLegajoController.getAll
);

documentoLegajoRouter.get(
  '/:id',
  validateJwt,
  documentoLegajoController.getById
);

// Escritura: solo ADMIN
documentoLegajoRouter.post(
  '/',
  validateJwt,
  validateRole(Role.ADMIN),
  documentoLegajoController.create
);

documentoLegajoRouter.patch(
  '/:id',
  validateJwt,
  validateRole(Role.ADMIN),
  documentoLegajoController.update
);

documentoLegajoRouter.delete(
  '/:id',
  validateJwt,
  validateRole(Role.ADMIN),
  documentoLegajoController.delete
);