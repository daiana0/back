import { Router } from 'express';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';
import { sesionController } from './controller/sesion-usuario.controller.js';

export const sesionRouter = Router();

// Lectura: cualquier usuario autenticado
sesionRouter.get('/', validateJwt, sesionController.getAll);
sesionRouter.get('/:id', validateJwt, sesionController.getById);

// Escritura: solo ADMIN
sesionRouter.post(
    '/',
    validateJwt,
    validateRole(Role.ADMIN),
    sesionController.create
);
sesionRouter.patch(
    '/:id',
    validateJwt,
    validateRole(Role.ADMIN),
    sesionController.update
);
sesionRouter.delete(
    '/:id',
    validateJwt,
    validateRole(Role.ADMIN),
    sesionController.delete
);
