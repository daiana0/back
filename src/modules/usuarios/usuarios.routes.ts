import { Router } from 'express';
import { usuarioController } from './controller/usuario.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const usuarioRouter = Router();

usuarioRouter.get('/', validateJwt, validateRole(Role.ADMIN, Role.RECTOR), usuarioController.getAll);
usuarioRouter.get('/:id', validateJwt, usuarioController.getById);
usuarioRouter.post('/', usuarioController.create);
usuarioRouter.patch('/:id', validateJwt, usuarioController.update);
usuarioRouter.delete('/:id', validateJwt, validateRole(Role.ADMIN), usuarioController.delete);