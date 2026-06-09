import { Router } from 'express';
import { comprobanteAlumnoController } from './controller/comprobanteAlumno.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const comprobanteAlumnoRouter = Router();

comprobanteAlumnoRouter.get('/', validateJwt, validateRole(Role.ESTUDIANTE, Role.ADMIN), comprobanteAlumnoController.getAll);
comprobanteAlumnoRouter.get('/:id', validateJwt, validateRole(Role.ESTUDIANTE, Role.ADMIN), comprobanteAlumnoController.getById);
comprobanteAlumnoRouter.post('/', validateJwt, validateRole(Role.ESTUDIANTE, Role.ADMIN), comprobanteAlumnoController.create);
comprobanteAlumnoRouter.patch('/:id', validateJwt, validateRole(Role.ESTUDIANTE, Role.ADMIN), comprobanteAlumnoController.update);
comprobanteAlumnoRouter.delete('/:id', validateJwt, validateRole(Role.ESTUDIANTE, Role.ADMIN), comprobanteAlumnoController.delete);