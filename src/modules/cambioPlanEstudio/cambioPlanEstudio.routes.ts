import { Router } from 'express';
import { cambioPlanEstudioController } from './controller/cambio-plan-estudio.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const cambioPlanEstudioRouter = Router();

cambioPlanEstudioRouter.get('/', validateJwt, cambioPlanEstudioController.getAll);
cambioPlanEstudioRouter.get('/:id', validateJwt, cambioPlanEstudioController.getById);
cambioPlanEstudioRouter.post('/', validateJwt, validateRole(Role.ADMIN), cambioPlanEstudioController.create);
cambioPlanEstudioRouter.patch('/:id', validateJwt, validateRole(Role.ADMIN), cambioPlanEstudioController.update);
cambioPlanEstudioRouter.delete('/:id', validateJwt, validateRole(Role.ADMIN), cambioPlanEstudioController.delete);