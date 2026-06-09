import { Router } from 'express';
import { movimientoFinancieroController } from './controller/movimientoFinanciero.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const movimientoFinancieroRouter = Router();

movimientoFinancieroRouter.get('/', validateJwt, validateRole(Role.ADMIN), movimientoFinancieroController.getAll);
movimientoFinancieroRouter.get('/:id', validateJwt, validateRole(Role.ADMIN), movimientoFinancieroController.getById);
movimientoFinancieroRouter.post('/', validateJwt, validateRole(Role.ADMIN), movimientoFinancieroController.create);
movimientoFinancieroRouter.patch('/:id', validateJwt, validateRole(Role.ADMIN), movimientoFinancieroController.update);
movimientoFinancieroRouter.delete('/:id', validateJwt, validateRole(Role.ADMIN), movimientoFinancieroController.delete);