import Administrativo from '../../administrativos/model/Administrativo.js';
import Docente from '../../docentes/model/Docente.js';
import Usuario from '../../usuarios/model/Usuario.js';
import Rol from '../../roles/model/Rol.js';
import { Role } from '../../../core/enums/role.enum.js';
import TokenBlacklist from '../model/TokenBlacklist.js';
import Estudiante from '../../estudiantes/model/Estudiante.js';

interface Credentials {
  email: string;
  password: string;
  rol: string;
}

interface AuthenticatedUser {
  id: number;
  email: string;
  rol: Role;
  nombre?: string;
  apellido?: string;
  entityType: 'ADMINISTRATIVO' | 'DOCENTE' | 'ESTUDIANTE' | 'USUARIO';
  idEstudiante?: number;
}

export const authService = {
  async login({ email, password, rol }: Credentials): Promise<AuthenticatedUser | null> {


    if (rol === "ADMINISTRATIVO") {
      // 1. Buscar en Administrativo
      const admin = await Administrativo.findOne({
        where: { email, activo: true },
        include: [{ model: Rol, as: 'rol', attributes: ['nombre'] }],
      });
      if (admin) {
        const isValid = await admin.validarContrasenia(password);
        const rol = await Rol.findByPk(admin.idRol);
        if (isValid && (rol?.nombre === Role.ADMIN || rol?.nombre === Role.RECTOR)) {
          const rolNombre = rol?.nombre as Role;
          return {
            id: admin.id,
            email: admin.email,
            rol: rolNombre || Role.ADMIN, // por defecto ADMIN si no tiene rol asignado
            nombre: admin.nombre,
            apellido: admin.apellido,
            entityType: 'ADMINISTRATIVO',
          };
        }
      }
    }

    if (rol === "DOCENTE") {
      // 2. Buscar en Docente
      const docente = await Docente.findOne({ where: { email, activo: true } });
      if (docente) {
        const isValid = await docente.validarContrasenia(password);
        if (isValid) {
          return {
            id: docente.id,
            email: docente.email,
            rol: Role.DOCENTE,
            nombre: docente.nombre,
            apellido: docente.apellido,
            entityType: 'DOCENTE',
          };
        }
      }
    }

    if (rol === "ESTUDIANTE") {
      //verificar si existe el estudiante
      const estudiante = await Estudiante.findOne({ where: { email, activo: true } });
      const id = estudiante?.idUsuario;
      if (estudiante) {
        // 3. Buscar en Usuario (las credenciales del estudiante)
        const usuario = await Usuario.findByPk(id);
        //validar que los correos sean los mismos.
        //para evitar posible inconsistencia
        if (estudiante.email !== usuario?.email) {
          return null;
        }
        if (usuario) {
          const isValid = await usuario.validarContrasenia(password);
          if (isValid) {
            return {
              id: usuario.id,
              email: usuario.email,
              rol: Role.ESTUDIANTE,
              nombre: usuario.nombre,
              apellido: usuario.apellido,
              entityType: 'ESTUDIANTE',
              idEstudiante: estudiante.id,
            };
          }
        }
      }
      return null;
    }
    if (rol === "USUARIO") {
      // 3. Buscar en Usuario
      const usuario = await Usuario.findOne({ where: { email, activo: true } });
      if (usuario) {
        const isValid = await usuario.validarContrasenia(password);
        if (isValid) {
          return {
            id: usuario.id,
            email: usuario.email,
            rol: Role.USUARIO,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            entityType: 'USUARIO',
          };
        }
      }
    }

    // Credenciales inválidas
    return null;
  },
  async logout(jti: string, exp: number): Promise<void> {
    // Convertir exp (timestamp Unix en segundos) a fecha y guardar en la lista negra
    await TokenBlacklist.create({
      jti,
      exp: new Date(exp * 1000), // convertir a milisegundos
    });
  },
};