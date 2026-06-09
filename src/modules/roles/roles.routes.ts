import { Router } from 'express';
import { rolController } from './controller/rol.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const rolRouter = Router();

// Lectura: cualquier autenticado puede ver roles
rolRouter.get('/', validateJwt, rolController.getAll);
rolRouter.get('/:id', validateJwt, rolController.getById);

// Escritura: solo ADMIN puede crear, modificar o eliminar roles
rolRouter.post('/', validateJwt, validateRole(Role.ADMIN), rolController.create);
rolRouter.patch('/:id', validateJwt, validateRole(Role.ADMIN), rolController.update);
rolRouter.delete('/:id', validateJwt, validateRole(Role.ADMIN), rolController.delete);