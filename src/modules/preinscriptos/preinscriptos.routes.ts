import { Router } from 'express';
import { preinscriptoController } from './controller/preinscripto.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const preinscriptoRouter = Router();

// Todas las rutas requieren autenticación
preinscriptoRouter.get('/mias', validateJwt, preinscriptoController.getMine);
preinscriptoRouter.get('/:id', validateJwt, preinscriptoController.getById);
preinscriptoRouter.get('/', validateJwt, validateRole(Role.ADMIN), preinscriptoController.getAll);
preinscriptoRouter.post('/', validateJwt, preinscriptoController.create);
preinscriptoRouter.patch('/:id', validateJwt, validateRole(Role.ADMIN), preinscriptoController.update);
preinscriptoRouter.delete('/:id', validateJwt, validateRole(Role.ADMIN), preinscriptoController.delete);