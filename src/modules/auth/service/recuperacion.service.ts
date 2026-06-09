import crypto from 'crypto';
import { Op } from 'sequelize';
import dotenv from 'dotenv';
import Administrativo from '../../administrativos/model/Administrativo.js';
import Docente from '../../docentes/model/Docente.js';
import Usuario from '../../usuarios/model/Usuario.js';
import Estudiante from '../../estudiantes/model/Estudiante.js';
import RecuperacionContrasenia from '../../recuperaciones/model/recuperacion-contrasenia.model.js';
import { enviarEmailRecuperacionContrasenia } from './recuperacionEmail.service.js';

dotenv.config();

const FRONT_URL = process.env.FRONT_URL || 'http://localhost:5173';
const EXPIRACION_MINUTOS = 60; // 1 hora

/**
 * Prefijo de portal en el front según el rol, para que el link del email
 * abra la pantalla de restablecer del portal correcto y, al terminar, el
 * botón "Iniciar sesión" lleve al login que corresponde.
 * ADMINISTRATIVO no tiene portal propio aún en el front → link sin prefijo
 * (cae al fallback global que vuelve a la landing).
 */
const PORTAL_PREFIX: Record<RolRecuperacion, string> = {
  DOCENTE: '/docentes',
  ESTUDIANTE: '/estudiante',
  USUARIO: '/usuario',
  ADMINISTRATIVO: '',
};

/**
 * Sujeto al que pertenece un token de recuperación: una de las
 * cuatro entidades autenticables. El password vive distinto en cada una:
 * - ADMINISTRATIVO → tabla administrativos
 * - DOCENTE        → tabla docentes
 * - ESTUDIANTE     → password vive en el Usuario asociado vía idUsuario
 * - USUARIO        → tabla usuarios
 */
type RolRecuperacion = 'ADMINISTRATIVO' | 'DOCENTE' | 'ESTUDIANTE' | 'USUARIO';

interface Sujeto {
  rol: RolRecuperacion;
  /** id en la tabla de la entidad correspondiente */
  entidadId: number;
  /** id del Usuario donde vive el password (== entidadId si rol === USUARIO/ADMIN/DOCENTE) */
  usuarioParaPassword: { rol: RolRecuperacion; id: number };
  email: string;
  nombre: string;
}

/**
 * Busca un sujeto autenticable por email en la tabla que corresponde al rol.
 * Devuelve null si no existe (sin revelar info al cliente).
 */
const buscarSujeto = async (email: string, rol: RolRecuperacion): Promise<Sujeto | null> => {
  if (rol === 'ADMINISTRATIVO') {
    const admin = await Administrativo.findOne({ where: { email, activo: true } });
    if (!admin) return null;
    return {
      rol,
      entidadId: admin.id,
      usuarioParaPassword: { rol: 'ADMINISTRATIVO', id: admin.id },
      email: admin.email,
      nombre: admin.nombre,
    };
  }
  if (rol === 'DOCENTE') {
    const docente = await Docente.findOne({ where: { email, activo: true } });
    if (!docente) return null;
    return {
      rol,
      entidadId: docente.id,
      usuarioParaPassword: { rol: 'DOCENTE', id: docente.id },
      email: docente.email,
      nombre: docente.nombre,
    };
  }
  if (rol === 'ESTUDIANTE') {
    const estudiante = await Estudiante.findOne({ where: { email, activo: true } });
    if (!estudiante || !estudiante.idUsuario) return null;
    const usuario = await Usuario.findByPk(estudiante.idUsuario);
    if (!usuario) return null;
    return {
      rol,
      entidadId: estudiante.id,
      usuarioParaPassword: { rol: 'USUARIO', id: usuario.id },
      email: estudiante.email,
      nombre: estudiante.nombre,
    };
  }
  // USUARIO
  const usuario = await Usuario.findOne({ where: { email, activo: true } });
  if (!usuario) return null;
  return {
    rol,
    entidadId: usuario.id,
    usuarioParaPassword: { rol: 'USUARIO', id: usuario.id },
    email: usuario.email,
    nombre: usuario.nombre,
  };
};

const hashToken = (token: string): string =>
  crypto.createHash('sha256').update(token).digest('hex');

export const recuperacionService = {
  /**
   * Inicia el flujo de recuperación: genera un token, lo guarda
   * hasheado en `recuperaciones_contrasenia` y envía un email con
   * el link al usuario.
   *
   * Importante: no revela si el email existe o no — siempre completa
   * sin lanzar errores visibles al cliente.
   */
  async iniciarRecuperacion(email: string, rol: RolRecuperacion): Promise<void> {
    const sujeto = await buscarSujeto(email, rol);
    if (!sujeto) {
      // No existe el sujeto — terminamos sin email y sin error
      return;
    }

    // Generar token plano (lo recibe solo el usuario en el email) +
    // hash que se guarda en DB.
    const tokenPlano = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(tokenPlano);
    const fechaExpiracion = new Date(Date.now() + EXPIRACION_MINUTOS * 60 * 1000);

    // Mapear el sujeto a las FK del modelo. Solo una de las 3 va llena;
    // las otras dos quedan en null. Para estudiantes, el password vive
    // en el Usuario asociado, así que apuntamos a ese idUsuario.
    const fks: {
      idUsuario: number | null;
      idDocente: number | null;
      idAdministrativo: number | null;
    } = { idUsuario: null, idDocente: null, idAdministrativo: null };

    if (sujeto.usuarioParaPassword.rol === 'USUARIO') {
      fks.idUsuario = sujeto.usuarioParaPassword.id;
    } else if (sujeto.usuarioParaPassword.rol === 'DOCENTE') {
      fks.idDocente = sujeto.usuarioParaPassword.id;
    } else if (sujeto.usuarioParaPassword.rol === 'ADMINISTRATIVO') {
      fks.idAdministrativo = sujeto.usuarioParaPassword.id;
    }

    await RecuperacionContrasenia.create({
      tokenHash,
      fechaExpiracion,
      fechaUso: null,
      ...fks,
    } as any);

    const prefijoPortal = PORTAL_PREFIX[sujeto.rol];
    const linkRestablecer = `${FRONT_URL}${prefijoPortal}/restablecer-contrasenia/${tokenPlano}`;
    await enviarEmailRecuperacionContrasenia(
      sujeto.email,
      sujeto.nombre,
      linkRestablecer,
      EXPIRACION_MINUTOS,
    );
  },

  /**
   * Consume un token de recuperación y actualiza la contraseña del
   * usuario al que pertenece. Lanza Error con mensaje al cliente si
   * el token no sirve (no existe / vencido / usado).
   */
  async restablecerContrasenia(tokenPlano: string, nuevaContrasenia: string): Promise<void> {
    const tokenHash = hashToken(tokenPlano);

    const registro = await RecuperacionContrasenia.findOne({
      where: {
        tokenHash,
        usado: false,
        fechaExpiracion: { [Op.gt]: new Date() },
      },
    });

    if (!registro) {
      throw new Error('El enlace de recuperación es inválido, está vencido o ya fue usado.');
    }

    // Actualizar la contraseña en la tabla correspondiente.
    // El hook beforeUpdate de cada modelo hashea con bcrypt.
    if (registro.idUsuario != null) {
      const usuario = await Usuario.findByPk(registro.idUsuario);
      if (!usuario) throw new Error('Usuario no encontrado.');
      usuario.contrasenia = nuevaContrasenia;
      await usuario.save();
    } else if (registro.idDocente != null) {
      const docente = await Docente.findByPk(registro.idDocente);
      if (!docente) throw new Error('Docente no encontrado.');
      docente.contrasenia = nuevaContrasenia;
      await docente.save();
    } else if (registro.idAdministrativo != null) {
      const admin = await Administrativo.findByPk(registro.idAdministrativo);
      if (!admin) throw new Error('Administrativo no encontrado.');
      admin.contrasenia = nuevaContrasenia;
      await admin.save();
    } else {
      throw new Error('Registro de recuperación inconsistente: sin entidad asociada.');
    }

    // Marcar el token como usado para que no se pueda reutilizar.
    registro.usado = true;
    registro.fechaUso = new Date();
    await registro.save();
  },
};
