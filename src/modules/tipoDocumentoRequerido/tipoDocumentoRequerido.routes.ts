import { Router } from 'express';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';
import { tipoDocumentoController } from './controller/tipoDocumentoRequerido.controller.js';

export const tipoDocumentoRouter = Router();

// Lectura: cualquier usuario autenticado
tipoDocumentoRouter.get('/', validateJwt, tipoDocumentoController.getAll);
tipoDocumentoRouter.get('/:id', validateJwt, tipoDocumentoController.getById);

// Escritura: solo ADMIN
tipoDocumentoRouter.post(
    '/',
    validateJwt,
    validateRole(Role.ADMIN),
    tipoDocumentoController.create
);
tipoDocumentoRouter.patch(
    '/:id',
    validateJwt,
    validateRole(Role.ADMIN),
    tipoDocumentoController.update
);
tipoDocumentoRouter.delete(
    '/:id',
    validateJwt,
    validateRole(Role.ADMIN),
    tipoDocumentoController.delete
);
