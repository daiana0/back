import { Router } from 'express';
import { inscripcionCarreraController } from './controller/inscripcion-carrera.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const inscripcionCarreraRouter = Router();

// Lectura: cualquier autenticado
inscripcionCarreraRouter.get('/', validateJwt, inscripcionCarreraController.getAll);
inscripcionCarreraRouter.get('/:id', validateJwt, inscripcionCarreraController.getById);

// Escritura: solo ADMIN
inscripcionCarreraRouter.post('/', validateJwt, validateRole(Role.ADMIN), inscripcionCarreraController.create);
inscripcionCarreraRouter.patch('/:id', validateJwt, validateRole(Role.ADMIN), inscripcionCarreraController.update);
inscripcionCarreraRouter.delete('/:id', validateJwt, validateRole(Role.ADMIN), inscripcionCarreraController.delete);