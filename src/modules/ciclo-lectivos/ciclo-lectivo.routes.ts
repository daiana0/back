import { Router } from 'express';
import { cicloLectivoController } from './controller/ciclo-lectivo.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const cicloLectivoRouter = Router();

cicloLectivoRouter.get('/activo', validateJwt, cicloLectivoController.getActivo);
cicloLectivoRouter.get('/', validateJwt, cicloLectivoController.getAll);
cicloLectivoRouter.get('/:id', validateJwt, cicloLectivoController.getById);
cicloLectivoRouter.post('/', validateJwt, validateRole(Role.ADMIN), cicloLectivoController.create);
cicloLectivoRouter.patch('/:id', validateJwt, validateRole(Role.ADMIN), cicloLectivoController.update);
cicloLectivoRouter.delete('/:id', validateJwt, validateRole(Role.ADMIN), cicloLectivoController.delete);