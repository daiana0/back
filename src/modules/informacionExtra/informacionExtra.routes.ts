import { Router } from 'express';
import { informacionExtraController } from './controller/informacion-extra.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const informacionExtraRouter = Router();

// Lectura: cualquier autenticado puede ver
informacionExtraRouter.get('/', validateJwt, informacionExtraController.getAll);
informacionExtraRouter.get('/:id', validateJwt, informacionExtraController.getById);

// Escritura: solo ADMIN
informacionExtraRouter.post('/', validateJwt, validateRole(Role.ADMIN), informacionExtraController.create);
informacionExtraRouter.patch('/:id', validateJwt, validateRole(Role.ADMIN), informacionExtraController.update);
informacionExtraRouter.delete('/:id', validateJwt, validateRole(Role.ADMIN), informacionExtraController.delete);