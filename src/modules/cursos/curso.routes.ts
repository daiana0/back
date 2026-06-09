import { Router } from 'express';
import { cursoController } from './controller/curso.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const cursoRouter = Router();

cursoRouter.get('/', validateJwt, cursoController.getAll);
cursoRouter.get('/:id', validateJwt, cursoController.getById);
cursoRouter.post('/', validateJwt, validateRole(Role.ADMIN), cursoController.create);
cursoRouter.patch('/:id', validateJwt, validateRole(Role.ADMIN), cursoController.update);
cursoRouter.delete('/:id', validateJwt, validateRole(Role.ADMIN), cursoController.delete);