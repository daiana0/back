import type { Request } from 'express';
import { AppError } from '../core/middlewares/error-handler.middleware.js';
import { Role } from '../core/enums/role.enum.js';
import Estudiante from '../modules/estudiantes/model/Estudiante.js';
import Legajo from '../modules/legajos/model/Legajo.js';

type AuthUser = {
  id: number;
  rol: string;
  idEstudiante?: number;
};

function getAuthUser(req: Request): AuthUser | undefined {
  return req.user as AuthUser | undefined;
}

export async function resolveIdEstudianteFromAuth(req: Request): Promise<number | null> {
  const user = getAuthUser(req);
  if (!user || user.rol !== Role.ESTUDIANTE) return null;

  if (user.idEstudiante != null) {
    return user.idEstudiante;
  }

  const estudiante = await Estudiante.findOne({
    where: { idUsuario: user.id, activo: true },
    attributes: ['id'],
  });

  return estudiante?.id ?? null;
}

export async function assertEstudianteOwnership(req: Request, idEstudiante: number): Promise<void> {
  const authIdEstudiante = await resolveIdEstudianteFromAuth(req);
  if (authIdEstudiante == null) return;

  if (authIdEstudiante !== idEstudiante) {
    throw new AppError('No autorizado para acceder a estos datos', 403);
  }
}

export async function assertLegajoOwnership(req: Request, legajoId: number): Promise<void> {
  const authIdEstudiante = await resolveIdEstudianteFromAuth(req);
  if (authIdEstudiante == null) return;

  const legajo = await Legajo.findByPk(legajoId, { attributes: ['id', 'idEstudiante'] });
  if (!legajo) {
    throw new AppError('Legajo no encontrado', 404);
  }

  if (legajo.idEstudiante !== authIdEstudiante) {
    throw new AppError('No autorizado para acceder a este legajo', 403);
  }
}
