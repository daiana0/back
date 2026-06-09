import { Router } from 'express';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';
import { notificacionController } from './controller/notificacion.controller.js';

export const notificacionRouter = Router();

// Lectura: cualquier usuario autenticado
notificacionRouter.get('/', validateJwt, notificacionController.getAll);
notificacionRouter.get('/:id', validateJwt, notificacionController.getById);

// Escritura: solo ADMIN
notificacionRouter.post(
    '/',
    validateJwt,
    validateRole(Role.ADMIN),
    notificacionController.create
);
notificacionRouter.patch(
    '/:id',
    validateJwt,
    validateRole(Role.ADMIN),
    notificacionController.update
);
notificacionRouter.delete(
    '/:id',
    validateJwt,
    validateRole(Role.ADMIN),
    notificacionController.delete
);
