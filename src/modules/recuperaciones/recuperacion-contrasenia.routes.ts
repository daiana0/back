import { Router } from 'express';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';
import { recuperacionController } from './controller/recuperacion-contrasenia.controller.js';

export const recuperacionRouter = Router();

// Lectura: cualquier usuario autenticado
recuperacionRouter.get('/', validateJwt, recuperacionController.getAll);
recuperacionRouter.get('/:id', validateJwt, recuperacionController.getById);

// Escritura: solo ADMIN
recuperacionRouter.post(
    '/',
    validateJwt,
    validateRole(Role.ADMIN),
    recuperacionController.create
);
recuperacionRouter.patch(
    '/:id',
    validateJwt,
    validateRole(Role.ADMIN),
    recuperacionController.update
);
recuperacionRouter.delete(
    '/:id',
    validateJwt,
    validateRole(Role.ADMIN),
    recuperacionController.delete
);
