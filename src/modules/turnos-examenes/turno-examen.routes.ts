import { Router } from 'express';
import { turnoExamenController } from './controller/turno-examen.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const turnoExamenRouter = Router();

turnoExamenRouter.get('/', validateJwt, turnoExamenController.getAll);
turnoExamenRouter.get('/:id', validateJwt, turnoExamenController.getById);
turnoExamenRouter.post('/', validateJwt, validateRole(Role.ADMIN), turnoExamenController.create);
turnoExamenRouter.patch('/:id', validateJwt, validateRole(Role.ADMIN), turnoExamenController.update);
turnoExamenRouter.delete('/:id', validateJwt, validateRole(Role.ADMIN), turnoExamenController.delete);