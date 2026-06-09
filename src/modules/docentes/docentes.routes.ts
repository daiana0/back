import { Router } from 'express';
import { docenteController } from './controller/docente.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const docenteRouter = Router();

// Lectura: cualquier usuario autenticado puede ver docentes
docenteRouter.get('/me/asignaciones', validateJwt, validateRole(Role.DOCENTE), docenteController.getMeAsignaciones);
docenteRouter.get('/asignaciones/:idDivisionXUnidadCurricular/alumnos', validateJwt, validateRole(Role.ADMIN, Role.DOCENTE), docenteController.getAsignacionAlumnos);
docenteRouter.get('/asignaciones/:idDivisionXUnidadCurricular/panel-academico', validateJwt, validateRole(Role.ADMIN, Role.DOCENTE), docenteController.getPanelAcademico);
docenteRouter.get('/', validateJwt, docenteController.getAll);
docenteRouter.get('/:id', validateJwt, docenteController.getById);

// Escritura: solo ADMIN puede crear, modificar o eliminar docentes
docenteRouter.post('/', validateJwt, validateRole(Role.ADMIN), docenteController.create);
docenteRouter.patch('/:id', validateJwt, validateRole(Role.ADMIN), docenteController.update);
docenteRouter.delete('/:id', validateJwt, validateRole(Role.ADMIN), docenteController.delete);