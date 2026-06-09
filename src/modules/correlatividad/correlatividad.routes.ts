import { Router } from 'express';
import { CorrelatividadController } from './controller/correlatividad.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { Role } from '../../core/enums/role.enum.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';

export const correlatividadRouter = Router();

// Aplicar autenticación a todas las rutas
correlatividadRouter.use(validateJwt);

// Lectura: cualquier usuario autenticado
correlatividadRouter.get('/', CorrelatividadController.getAll);
correlatividadRouter.get('/:id', CorrelatividadController.getById);

// Escritura: solo administradores
correlatividadRouter.post('/', validateRole(Role.ADMIN), CorrelatividadController.create);
correlatividadRouter.patch('/:id', validateRole(Role.ADMIN), CorrelatividadController.update);
correlatividadRouter.delete('/:id', validateRole(Role.ADMIN), CorrelatividadController.delete);
