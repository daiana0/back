import { Router } from 'express';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';
import { notificacionXEmailController } from './controller/notificacionXEmail.controller.js';

export const notificacionXEmailRouter = Router();

// Lectura: cualquier usuario autenticado menos el usuario comun (USUARIO)
notificacionXEmailRouter.get('/', validateJwt, validateRole(Role.ADMIN, Role.DOCENTE, Role.ESTUDIANTE, Role.RECTOR), notificacionXEmailController.getAll);
notificacionXEmailRouter.get('/:id', validateJwt, validateRole(Role.ADMIN, Role.DOCENTE, Role.ESTUDIANTE, Role.RECTOR), notificacionXEmailController.getById);

// Escritura: solo ADMIN,RECTOR,DOCENTE
notificacionXEmailRouter.post(
    '/',
    validateJwt,
    validateRole(Role.ADMIN, Role.RECTOR, Role.DOCENTE),
    notificacionXEmailController.create
);
notificacionXEmailRouter.patch(
    '/:id',
    validateJwt,
    validateRole(Role.ADMIN, Role.RECTOR, Role.DOCENTE),
    notificacionXEmailController.update
);
notificacionXEmailRouter.delete(
    '/:id',
    validateJwt,
    validateRole(Role.ADMIN, Role.RECTOR, Role.DOCENTE),
    notificacionXEmailController.delete
);

