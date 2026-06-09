/**
 * Prepara la base de datos de desarrollo end-to-end:
 *   1. Asegura que la BD exista (la crea si falta).
 *   2. Sincroniza el schema desde los modelos Sequelize ({ force: true } por default → destructivo).
 *   3. Inserta 3 registros coherentes por tabla (roles: 4 fijos; notificacion_x_email y token_blacklist: vacías).
 *
 * Uso:
 *   npm run db:setup           # crea schema + carga datos
 *   npm run db:reset           # borra/recrea tablas + carga datos
 *   npm run db:seed            # solo carga datos sobre tablas ya creadas
 *
 * Variables de entorno:
 *   SEED_FORCE=false  → no dropea/recrea tablas
 *   SEED_ONLY=true    → omite el sync y solo inserta datos
 */
import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';
import { sequelize } from '../src/modules/index.js';
import Rol from '../src/modules/roles/model/Rol.js';
import Administrativo from '../src/modules/administrativos/model/Administrativo.js';
import Usuario from '../src/modules/usuarios/model/Usuario.js';
import Docente from '../src/modules/docentes/model/Docente.js';
import Estudiante from '../src/modules/estudiantes/model/Estudiante.js';
import Carrera from '../src/modules/carreras/model/Carrera.js';
import PlanEstudio from '../src/modules/planes_estudios/model/PlanEstudio.js';
import CicloLectivo from '../src/modules/ciclo-lectivos/model/CicloLectivo.js';
import UnidadCurricular from '../src/modules/unidades_curriculares/model/UnidadCurricular.js';
import Correlatividad from '../src/modules/correlatividad/model/Correlatividad.js';
import Curso from '../src/modules/cursos/model/Curso.js';
import Division from '../src/modules/division/model/Division.js';
import DivisionXUnidadCurricular from '../src/modules/divisionXUnidadCurricular/model/DivisionXUnidadCurricular.js';
import DesignacionesDocente from '../src/modules/designacionesDocente/model/DesignacionDocente.js';
import Legajo from '../src/modules/legajos/model/Legajo.js';
import Asistencia from '../src/modules/asistencia/model/Asistencia.js';
import EstudianteXUnidadCurricular from '../src/modules/estudiantesXUnidadCurricular/model/EstudianteXUnidadCurricular.js';
import CambioPlanEstudio from '../src/modules/cambioPlanEstudio/model/CambioPlanEstudio.js';
import InstanciaEvaluativa from '../src/modules/instanciasEvaluativas/model/InstanciaEvaluativa.js';
import LegajoXInstanciaEvaluativa from '../src/modules/legajosXInstanciasEvaluativas/model/LegajoXInstanciaEvaluativa.js';
import TurnoExamen from '../src/modules/turnos-examenes/model/TurnoExamen.js';
import MesaExamen from '../src/modules/mesasExamenes/model/MesaExamen.js';
import MesaExamenXLegajo from '../src/modules/mesaExamenXLegajo/model/MesaExamenXLegajo.js';
import EquivalenciaUnidadCurricular from '../src/modules/equivalenciaUnidadCurricular/model/EquivalenciaUnidadCurricular.js';
import MovimientoFinanciero from '../src/modules/movimientoFinanciero/model/movimientoFinanciero.js';
import ComprobanteAlumno from '../src/modules/comprobanteAlumno/model/ComprobanteAlumno.js';
import TipoDocumentoRequerido from '../src/modules/tipoDocumentoRequerido/model/TipoDocumentoRequerido.js';
import DocumentoLegajo from '../src/modules/documentoLegajo/model/DocumentoLegajo.js';
import DossierInstitucional from '../src/modules/dossierInstitucional/model/DossierInstitucional.js';
import Preinscripto from '../src/modules/preinscriptos/model/Preinscripto.js';
import InscripcionCarrera from '../src/modules/inscripcionCarrera/model/InscripcionCarrera.js';
import InformacionExtra from '../src/modules/informacionExtra/model/InformacionExtra.js';
import SesionUsuario from '../src/modules/sesiones/model/sesion-usuario.model.js';
import RecuperacionContrasenia from '../src/modules/recuperaciones/model/recuperacion-contrasenia.model.js';
import Notificacion from '../src/modules/notificaciones/model/notificacion.model.js';

const FORCE = process.env.SEED_FORCE !== 'false';
const SEED_ONLY = process.env.SEED_ONLY === 'true';

function futureDate(daysAhead = 7): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + daysAhead);
  return d;
}

function printCredentials() {
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Credenciales de prueba — POST /api/v1/auth/login');
  console.log('Body: { "email": "...", "contrasenia": "...", "rol": "..." }');
  console.log('');
  console.log('ADMINISTRATIVO (rol: ADMINISTRATIVO):');
  console.log('  maria.gomez@instituto.edu   → Admin1234!   (ADMIN)');
  console.log('  carlos.perez@instituto.edu  → Admin1234!   (RECTOR)');
  console.log('  laura.rios@instituto.edu    → Admin1234!   (ADMIN)');
  console.log('');
  console.log('DOCENTE (rol: DOCENTE):');
  console.log('  lucia.martinez@instituto.edu   → Docente1234!');
  console.log('  roberto.suarez@instituto.edu   → Docente1234!');
  console.log('  patricia.vega@instituto.edu    → Docente1234!');
  console.log('');
  console.log('ESTUDIANTE (rol: ESTUDIANTE):');
  console.log('  juan.lopez@correo.com        → Segura1234!');
  console.log('  ana.martinez@correo.com      → Segura1234!');
  console.log('  pedro.fernandez@correo.com   → Segura1234!');
  console.log('');
  console.log('USUARIO (rol: USUARIO):');
  console.log('  juan.lopez@correo.com        → Segura1234!');
  console.log('  ana.martinez@correo.com      → Segura1234!');
  console.log('  pedro.fernandez@correo.com   → Segura1234!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Ver SIGI-BACK/docs/DATOS-PRUEBA.md para más detalle.');
}

async function ensureDatabaseExists() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER_M,
    password: process.env.DB_PASSWORD,
  });
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
  await conn.end();
  console.log(`✓ BD '${process.env.DB_NAME}' lista.`);
}

async function syncSchema() {
  await sequelize.authenticate();
  await sequelize.sync({ force: FORCE });
  console.log(`✓ Schema sincronizado (force=${FORCE}).`);
}

async function seed() {
  console.log('→ Insertando datos de prueba (3 por tabla)...');
  const fechaInstancia = futureDate(7);

  const roles = await Rol.bulkCreate([
    { nombre: 'ADMIN', descripcion: 'Administrador del sistema' },
    { nombre: 'DOCENTE', descripcion: 'Docente de la institución' },
    { nombre: 'ESTUDIANTE', descripcion: 'Alumno regular' },
    { nombre: 'RECTOR', descripcion: 'Rector de la institución' },
  ]);
  console.log(`  • ${roles.length} roles`);

  const admins = await Promise.all([
    Administrativo.create({
      nombre: 'María', apellido: 'Gómez', email: 'maria.gomez@instituto.edu',
      dni: '20123456', contrasenia: 'Admin1234!',
      telefono: '351-1111111', domicilio: 'Calle 1 N° 100', idRol: 1, activo: true,
    } as any),
    Administrativo.create({
      nombre: 'Carlos', apellido: 'Pérez', email: 'carlos.perez@instituto.edu',
      dni: '20765432', contrasenia: 'Admin1234!',
      telefono: '351-2222222', domicilio: 'Av. Siempre Viva 742', idRol: 4, activo: true,
    } as any),
    Administrativo.create({
      nombre: 'Laura', apellido: 'Ríos', email: 'laura.rios@instituto.edu',
      dni: '22333444', contrasenia: 'Admin1234!',
      telefono: '351-3333333', domicilio: 'Calle 3 N° 300', idRol: 1, activo: true,
    } as any),
  ]);
  const [adminMaria, , adminLaura] = admins;
  console.log(`  • ${admins.length} administrativos`);

  // ─── Usuarios ─────────────────────────────────────────
  const usuarios = await Promise.all([
    Usuario.create({
      nombre: 'Juan', apellido: 'López', email: 'juan.lopez@correo.com',
      contrasenia: 'Segura1234!', idAdministrativo: adminMaria.id,
    } as any),
    Usuario.create({
      nombre: 'Ana', apellido: 'Martínez', email: 'ana.martinez@correo.com',
      contrasenia: 'Segura1234!', idAdministrativo: adminMaria.id,
    } as any),
    Usuario.create({
      nombre: 'Pedro', apellido: 'Fernández', email: 'pedro.fernandez@correo.com',
      contrasenia: 'Segura1234!', idAdministrativo: adminLaura.id,
    } as any),
  ]);
  const [usuarioJuan, usuarioAna, usuarioPedro] = usuarios;
  console.log(`  • ${usuarios.length} usuarios`);

   // ─── Docentes ─────────────────────────────────────────
   const docentes = await Promise.all([
    Docente.create({
      nombre: 'Lucía', apellido: 'Martínez', email: 'lucia.martinez@instituto.edu',
      contrasenia: 'Docente1234!', dni: '28999888', titulo: 'Lic. en Sistemas',
      especialidad: 'Bases de datos', domicilio: 'Calle Falsa 100', telefono: '351-1234567',
      foto: null, idAdministrativo: adminMaria.id,
    } as any),
    Docente.create({
      nombre: 'Roberto', apellido: 'Suárez', email: 'roberto.suarez@instituto.edu',
      contrasenia: 'Docente1234!', dni: '27444555', titulo: 'Ing. en Informática',
      especialidad: 'Algoritmos', domicilio: 'Av. Test 200', telefono: '351-7654321',
      foto: null, idAdministrativo: adminMaria.id,
    } as any),
    Docente.create({
      nombre: 'Patricia', apellido: 'Vega', email: 'patricia.vega@instituto.edu',
      contrasenia: 'Docente1234!', dni: '26555666', titulo: 'Mg. en Educación',
      especialidad: 'Redes', domicilio: 'Av. Red 300', telefono: '351-9998877',
      foto: null, idAdministrativo: adminLaura.id,
    } as any),
  ]);
  const [docenteLucia, docenteRoberto, docentePatricia] = docentes;
  console.log(`  • ${docentes.length} docentes`);

// ─── Estudiantes ──────────────────────────────────────
  const estudiantes = await Promise.all([
    Estudiante.create({
      dni: '45111222', nombre: 'Juan', apellido: 'López', email: 'juan.lopez@correo.com',
      telefono: '351-1112223', domicilio: 'Mendoza 100', fechaDeNacimiento: '2005-03-15',
      foto: null, trabaja: false, idUsuario: usuarioJuan.id, idAdministrativo: adminMaria.id,
    } as any),
    Estudiante.create({
      dni: '40234567', nombre: 'Ana', apellido: 'Martínez', email: 'ana.martinez@correo.com',
      telefono: '351-2220000', domicilio: 'Calle Estudiante 2', fechaDeNacimiento: '2001-08-22',
      foto: null, trabaja: true, idUsuario: usuarioAna.id, idAdministrativo: adminMaria.id,
    } as any),
    Estudiante.create({
      dni: '42333444', nombre: 'Pedro', apellido: 'Fernández', email: 'pedro.fernandez@correo.com',
      telefono: '351-3334444', domicilio: 'Calle Estudiante 3', fechaDeNacimiento: '2003-11-10',
      foto: null, trabaja: false, idUsuario: usuarioPedro.id, idAdministrativo: adminLaura.id,
    } as any),
  ]);
  const [estudianteJuan, estudianteAna, estudiantePedro] = estudiantes;
  console.log(`  • ${estudiantes.length} estudiantes`);

  // ─── Carrera + Plan + Ciclo ───────────────────────────
  const carreras = await Promise.all([
    Carrera.create({
      codigo: 'TSP', nombre: 'Tecnicatura Superior en Programación', tipo: 'permanente',
      activo: true, imagen: null, descripcion: 'Carrera de 3 años con orientación en desarrollo',
      dossier: null, idAdministrativo: adminMaria.id,
    } as any),
    Carrera.create({
      codigo: 'TSD', nombre: 'Tecnicatura Superior en Desarrollo de Software', tipo: 'permanente',
      activo: true, imagen: null, descripcion: 'Carrera orientada a ingeniería de software',
      dossier: null, idAdministrativo: adminMaria.id,
    } as any),
    Carrera.create({
      codigo: 'TSAS', nombre: 'Tecnicatura Superior en Análisis de Sistemas', tipo: 'permanente',
      activo: true, imagen: null, descripcion: 'Carrera orientada a análisis y diseño',
      dossier: null, idAdministrativo: adminLaura.id,
    } as any),
  ]);
  const [carreraTSP, carreraTSD, carreraTSAS] = carreras;
  console.log(`  • ${carreras.length} carreras`);

  const planes = await Promise.all([
    PlanEstudio.create({
      version: '2026.1', fechaDeAprobacion: '2026-01-15', fechaDeCierre: '2030-12-31',
      duracionEnAnios: 3, estado: 'vigente', idCarrera: carreraTSP.id, idAdministrativo: adminMaria.id,
    } as any),
    PlanEstudio.create({
      version: '2026.1', fechaDeAprobacion: '2026-01-20', fechaDeCierre: '2030-12-31',
      duracionEnAnios: 3, estado: 'vigente', idCarrera: carreraTSD.id, idAdministrativo: adminMaria.id,
    } as any),
    PlanEstudio.create({
      version: '2026.1', fechaDeAprobacion: '2026-01-25', fechaDeCierre: '2030-12-31',
      duracionEnAnios: 3, estado: 'vigente', idCarrera: carreraTSAS.id, idAdministrativo: adminLaura.id,
    } as any),
  ]);
  const [planTSP, planTSD, planTSAS] = planes;
  console.log(`  • ${planes.length} planes de estudio`);

  // anio es único global en ciclos_lectivos
  const ciclos = await Promise.all([
    CicloLectivo.create({
      anio: 2026, activo: true, fechaInicio: '2026-03-01', fechaFin: '2026-12-15',
      idPlanEstudio: planTSP.id, idAdministrativo: adminMaria.id,
    } as any),
    CicloLectivo.create({
      anio: 2025, activo: false, fechaInicio: '2025-03-01', fechaFin: '2025-12-15',
      idPlanEstudio: planTSD.id, idAdministrativo: adminMaria.id,
    } as any),
    CicloLectivo.create({
      anio: 2024, activo: false, fechaInicio: '2024-03-01', fechaFin: '2024-12-15',
      idPlanEstudio: planTSAS.id, idAdministrativo: adminLaura.id,
    } as any),
  ]);
  const [cicloTSP, cicloTSD, cicloTSAS] = ciclos;
  console.log(`  • ${ciclos.length} ciclos lectivos`);

// ─── Unidades curriculares ────────────────────────────
  const ucs = await Promise.all([
    UnidadCurricular.create({
      idPlanEstudio: planTSP.id, nombre: 'Programación I', duracion: 'cuatrimestral',
      cargaHoraria: 96, cuatrimestre: 'primero', idAdministrativo: adminMaria.id,
    } as any),
    UnidadCurricular.create({
      idPlanEstudio: planTSP.id, nombre: 'Bases de Datos', duracion: 'cuatrimestral',
      cargaHoraria: 96, cuatrimestre: 'segundo', idAdministrativo: adminMaria.id,
    } as any),
    UnidadCurricular.create({
      idPlanEstudio: planTSP.id, nombre: 'Matemática Aplicada', duracion: 'cuatrimestral',
      cargaHoraria: 64, cuatrimestre: 'primero', idAdministrativo: adminMaria.id,
    } as any),
  ]);
  const [ucProg1, ucBD, ucMate] = ucs;
  console.log(`  • ${ucs.length} unidades curriculares`);

// ─── Correlatividades ───────────────────────────────────
  await Promise.all([
    Correlatividad.create({
      idPlan: planTSP.id, idUnidadCurricular: ucBD.id,
      idUnidadCurricularCorrelativa: ucProg1.id, condicion: 'APROBADA',
    } as any),
    Correlatividad.create({
      idPlan: planTSP.id, idUnidadCurricular: ucMate.id,
      idUnidadCurricularCorrelativa: ucProg1.id, condicion: 'REGULARIZADA',
    } as any),
    Correlatividad.create({
      idPlan: planTSP.id, idUnidadCurricular: ucBD.id,
      idUnidadCurricularCorrelativa: ucMate.id, condicion: 'APROBADA',
    } as any),
  ]);
  console.log(`  • 3 correlatividades`);

// ─── Cursos + División─────────────────────────────────────────
  const cursos = await Promise.all([
    Curso.create({
      cupoEstudiantes: 40, anioAcademico: 1, idCicloLectivo: cicloTSP.id,
      idAdministrativo: adminMaria.id,
    } as any),
    Curso.create({
      cupoEstudiantes: 35, anioAcademico: 1, idCicloLectivo: cicloTSD.id,
      idAdministrativo: adminMaria.id,
    } as any),
    Curso.create({
      cupoEstudiantes: 30, anioAcademico: 1, idCicloLectivo: cicloTSAS.id,
      idAdministrativo: adminLaura.id,
    } as any),
  ]);
  const [cursoTSP, , cursoTSAS] = cursos;
  console.log(`  • ${cursos.length} cursos`);

  const divisiones = await Promise.all([
    Division.create({
      idDocente: docenteLucia.id, idCurso: cursoTSP.id, idAdministrativo: adminMaria.id,
    } as any),
    Division.create({
      idDocente: docenteRoberto.id, idCurso: cursoTSP.id, idAdministrativo: adminMaria.id,
    } as any),
    Division.create({
      idDocente: docentePatricia.id, idCurso: cursoTSAS.id, idAdministrativo: adminLaura.id,
    } as any),
  ]);
  const [division1, division2, division3] = divisiones;
  console.log(`  • ${divisiones.length} divisiones`);

  // ─── Division x Unidad Curricular ─────────────────────
  const dxucs = await Promise.all([
    DivisionXUnidadCurricular.create({
      idDivision: division1.id, idUnidadCurricular: ucProg1.id, idAdministrativo: adminMaria.id,
    } as any),
    DivisionXUnidadCurricular.create({
      idDivision: division2.id, idUnidadCurricular: ucProg1.id, idAdministrativo: adminMaria.id,
    } as any),
    DivisionXUnidadCurricular.create({
      idDivision: division3.id, idUnidadCurricular: ucBD.id, idAdministrativo: adminLaura.id,
    } as any),
  ]);
  const [dxuc1, dxucAna, dxuc3] = dxucs;
  console.log(`  • ${dxucs.length} división x unidad curricular`);

  // ─── Designación docente ──────────────────────────────
  await Promise.all([
    DesignacionesDocente.create({
      idDocente: docenteLucia.id, idDivisionXUnidadCurricular: dxuc1.id,
      idCicloLectivo: cicloTSP.id, idAdministrativo: adminMaria.id,
      turno: 'Mañana', aula: 'Lab 1', horario: 'Lunes 8-12', nroMAB: 'MAB-001',
      fechaAltaMAB: '2026-03-01', fechaVtoMAB: '2026-12-31',
    } as any),
    DesignacionesDocente.create({
      idDocente: docenteRoberto.id, idDivisionXUnidadCurricular: dxucAna.id,
      idCicloLectivo: cicloTSP.id, idAdministrativo: adminMaria.id,
      turno: 'Tarde', aula: 'Lab 2', horario: 'Martes 14-18', nroMAB: 'MAB-002',
      fechaAltaMAB: '2026-03-01', fechaVtoMAB: '2026-12-31',
    } as any),
    DesignacionesDocente.create({
      idDocente: docentePatricia.id, idDivisionXUnidadCurricular: dxuc3.id,
      idCicloLectivo: cicloTSD.id, idAdministrativo: adminLaura.id,
      turno: 'Noche', aula: 'Lab 3', horario: 'Jueves 18-22', nroMAB: 'MAB-003',
      fechaAltaMAB: '2026-03-01', fechaVtoMAB: '2026-12-31',
    } as any),
  ]);
  console.log(`  • 3 designaciones docentes`);

  // ─── Legajos ─────────────────────────────────────────────
  const legajos = await Promise.all([
    Legajo.create({
      idEstudiante: estudianteJuan.id, numeroLegajo: 99001,
      idPlanEstudio: planTSP.id, activo: true, idAdministrativo: adminMaria.id,
    } as any),
    Legajo.create({
      idEstudiante: estudianteJuan.id, numeroLegajo: 99004,
      idPlanEstudio: planTSD.id, activo: false, idAdministrativo: adminMaria.id,
    } as any),
    Legajo.create({
      idEstudiante: estudianteAna.id, numeroLegajo: 99002,
      idPlanEstudio: planTSP.id, activo: true, idAdministrativo: adminMaria.id,
    } as any),
    Legajo.create({
      idEstudiante: estudiantePedro.id, numeroLegajo: 99003,
      idPlanEstudio: planTSD.id, activo: true, idAdministrativo: adminLaura.id,
    } as any),
  ]);
  const [legajoJuan, legajoJuanTSD, legajoAna, legajoPedro] = legajos;
  console.log(`  • ${legajos.length} legajos (Juan tiene 2: TSP activo + TSD inactivo)`);

  // ─── Asistencias ──────────────────────────────────────────
  await Promise.all([
    Asistencia.create({
      idDivisionXUnidadCurricular: dxuc1.id, fecha: '2026-04-01', presente: true,
      idLegajo: legajoJuan.id, idAdministrativo: adminMaria.id,
    } as any),
    Asistencia.create({
      idDivisionXUnidadCurricular: dxucAna.id, fecha: '2026-04-03', presente: true,
      idLegajo: legajoAna.id, idAdministrativo: adminMaria.id,
    } as any),
    Asistencia.create({
      idDivisionXUnidadCurricular: dxuc3.id, fecha: '2026-04-05', presente: false,
      idLegajo: legajoPedro.id, idAdministrativo: adminLaura.id,
    } as any),
  ]);
  console.log(`  • 3 asistencias`);

  // Cargar asistencias previas (semana anterior a hoy)
  const fechasAnteriores = ['2026-06-01', '2026-06-02', '2026-06-03', '2026-06-04', '2026-06-05'];
  for (const f of fechasAnteriores) {
    // Asistencias para Programación I (dxuc1)
    await Asistencia.create({
      idDivisionXUnidadCurricular: dxuc1.id, fecha: f, presente: true,
      idLegajo: legajoJuan.id, idAdministrativo: adminMaria.id,
    } as any);
    await Asistencia.create({
      idDivisionXUnidadCurricular: dxuc1.id, fecha: f, presente: false,
      idLegajo: legajoAna.id, idAdministrativo: adminMaria.id,
    } as any);
    await Asistencia.create({
      idDivisionXUnidadCurricular: dxuc1.id, fecha: f, presente: true,
      idLegajo: legajoPedro.id, idAdministrativo: adminMaria.id,
    } as any);
    await Asistencia.create({
      idDivisionXUnidadCurricular: dxuc1.id, fecha: f, presente: true,
      idLegajo: legajoJuanTSD.id, idAdministrativo: adminMaria.id,
    } as any);

    // Asistencias para Programación II (dxuc3)
    await Asistencia.create({
      idDivisionXUnidadCurricular: dxuc3.id, fecha: f, presente: true,
      idLegajo: legajoJuan.id, idAdministrativo: adminMaria.id,
    } as any);
    await Asistencia.create({
      idDivisionXUnidadCurricular: dxuc3.id, fecha: f, presente: true,
      idLegajo: legajoAna.id, idAdministrativo: adminMaria.id,
    } as any);
    await Asistencia.create({
      idDivisionXUnidadCurricular: dxuc3.id, fecha: f, presente: false,
      idLegajo: legajoPedro.id, idAdministrativo: adminMaria.id,
    } as any);
    await Asistencia.create({
      idDivisionXUnidadCurricular: dxuc3.id, fecha: f, presente: true,
      idLegajo: legajoJuanTSD.id, idAdministrativo: adminMaria.id,
    } as any);
  }
  console.log(`  • ${fechasAnteriores.length * 8} asistencias históricas creadas`);


    // ─── Estudiantes x Unidad Curricular ──────────────────
  const inscripcionesEstudiantes = await Promise.all([
    // Inscripciones para Juan López (legajoJuan -> TSP activo, legajoJuanTSD -> TSD inactivo)
    EstudianteXUnidadCurricular.create({
      idDivisionXUnidadCurricular: dxuc1.id, idLegajo: legajoJuan.id,
      fechaDeInscripcion: '2026-03-01', condicion: 'regular', idAdministrativo: adminMaria.id,
    } as any),
    EstudianteXUnidadCurricular.create({
      idDivisionXUnidadCurricular: dxuc3.id, idLegajo: legajoJuan.id,
      fechaDeInscripcion: '2026-03-01', condicion: 'regular', idAdministrativo: adminMaria.id,
    } as any),
    EstudianteXUnidadCurricular.create({
      idDivisionXUnidadCurricular: dxuc1.id, idLegajo: legajoJuanTSD.id,
      fechaDeInscripcion: '2026-03-01', condicion: 'regular', idAdministrativo: adminMaria.id,
    } as any),
    EstudianteXUnidadCurricular.create({
      idDivisionXUnidadCurricular: dxuc3.id, idLegajo: legajoJuanTSD.id,
      fechaDeInscripcion: '2026-03-01', condicion: 'regular', idAdministrativo: adminMaria.id,
    } as any),

    // Inscripciones para Ana Martínez (legajoAna -> TSP activo)
    EstudianteXUnidadCurricular.create({
      idDivisionXUnidadCurricular: dxuc1.id, idLegajo: legajoAna.id,
      fechaDeInscripcion: '2026-03-12', condicion: 'regular', idAdministrativo: adminMaria.id,
    } as any),
    EstudianteXUnidadCurricular.create({
      idDivisionXUnidadCurricular: dxucAna.id, idLegajo: legajoAna.id,
      fechaDeInscripcion: '2026-03-12', condicion: 'libre', idAdministrativo: adminMaria.id,
    } as any),
    EstudianteXUnidadCurricular.create({
      idDivisionXUnidadCurricular: dxuc3.id, idLegajo: legajoAna.id,
      fechaDeInscripcion: '2026-03-12', condicion: 'regular', idAdministrativo: adminMaria.id,
    } as any),

    // Inscripciones para Pedro Fernández (legajoPedro -> TSD activo)
    EstudianteXUnidadCurricular.create({
      idDivisionXUnidadCurricular: dxuc1.id, idLegajo: legajoPedro.id,
      fechaDeInscripcion: '2026-03-15', condicion: 'regular', idAdministrativo: adminLaura.id,
    } as any),
    EstudianteXUnidadCurricular.create({
      idDivisionXUnidadCurricular: dxuc3.id, idLegajo: legajoPedro.id,
      fechaDeInscripcion: '2026-03-15', condicion: 'regular', idAdministrativo: adminLaura.id,
    } as any),
  ]);
  console.log(`  • ${inscripcionesEstudiantes.length} estudiantes x unidad curricular`);

  // ─── Cambios de Plan de Estudio ────────────────────────
  await Promise.all([
    CambioPlanEstudio.create({
      idLegajo: legajoJuan.id, idPlanEstudioOrigen: planTSP.id,
      idPlanEstudioDestino: planTSD.id, idUsuarioGestor: usuarioJuan.id,
      estado: 'PENDIENTE', idAdministrativo: adminMaria.id,
    } as any),
    CambioPlanEstudio.create({
      idLegajo: legajoAna.id, idPlanEstudioOrigen: planTSP.id,
      idPlanEstudioDestino: planTSP.id, idUsuarioGestor: usuarioAna.id,
      estado: 'APROBADO', idAdministrativo: adminMaria.id,
    } as any),
    CambioPlanEstudio.create({
      idLegajo: legajoPedro.id, idPlanEstudioOrigen: planTSD.id,
      idPlanEstudioDestino: planTSAS.id, idUsuarioGestor: usuarioPedro.id,
      estado: 'PENDIENTE', idAdministrativo: adminLaura.id,
    } as any),
  ]);
  console.log(`  • 3 cambios plan estudio`);

// ─── Evaluación ───────────────────────────────────────
  const instancias = await Promise.all([
    InstanciaEvaluativa.create({
      idDivisionXUnidadCurricular: dxuc1.id, descripcion: 'Primer Parcial Programación I',
      fecha: fechaInstancia, tipo: 'parcial', idAdministrativo: adminMaria.id,
    } as any),
    InstanciaEvaluativa.create({
      idDivisionXUnidadCurricular: dxucAna.id, descripcion: 'Primer Parcial Programación I',
      fecha: fechaInstancia, tipo: 'parcial', idAdministrativo: adminMaria.id,
    } as any),
    InstanciaEvaluativa.create({
      idDivisionXUnidadCurricular: dxuc3.id, descripcion: 'Primer Parcial Bases de Datos',
      fecha: fechaInstancia, tipo: 'parcial', idAdministrativo: adminLaura.id,
    } as any),
  ]);
  const [instanciaJuan, instanciaAna, instanciaPedro] = instancias;
  await Promise.all([
    LegajoXInstanciaEvaluativa.create({
      idInstanciaEvaluativa: instanciaJuan.id, idLegajo: legajoJuan.id, nota: 8,
      fechaRegistro: '2026-05-20', idAdministrativo: adminMaria.id,
    } as any),
    LegajoXInstanciaEvaluativa.create({
      idInstanciaEvaluativa: instanciaAna.id, idLegajo: legajoAna.id, nota: 6,
      fechaRegistro: '2026-05-20', idAdministrativo: adminMaria.id,
    } as any),
    LegajoXInstanciaEvaluativa.create({
      idInstanciaEvaluativa: instanciaPedro.id, idLegajo: legajoPedro.id, nota: 7,
      fechaRegistro: '2026-05-22', idAdministrativo: adminLaura.id,
    } as any),
  ]);
  console.log(`  • 3 instancias evaluativas, 3 notas (Ana: nota 6 en su dxuc inscripto)`);

   // ─── Mesa de examen ───────────────────────────────────
  const turnos = await Promise.all([
    TurnoExamen.create({
      descripcion: 'Turno Julio 2026', fechaDesde: new Date('2026-07-01'),
      fechaHasta: new Date('2026-07-31'), idCicloLectivo: cicloTSP.id,
      idAdministrativo: adminMaria.id,
    } as any),
    TurnoExamen.create({
      descripcion: 'Turno Agosto 2026', fechaDesde: new Date('2026-08-01'),
      fechaHasta: new Date('2026-08-31'), idCicloLectivo: cicloTSD.id,
      idAdministrativo: adminMaria.id,
    } as any),
    TurnoExamen.create({
      descripcion: 'Turno Diciembre 2026', fechaDesde: new Date('2026-12-01'),
      fechaHasta: new Date('2026-12-20'), idCicloLectivo: cicloTSAS.id,
      idAdministrativo: adminLaura.id,
    } as any),
  ]);
  const [turno1, turno2, turno3] = turnos;

  const mesas = await Promise.all([
    MesaExamen.create({
      idTurnoExamen: turno1.id, idUnidadCurricular: ucProg1.id, fecha: '2026-07-10',
      hora: '09:00', idDocentePresidente: docenteLucia.id,
      idDocenteVocal1: docenteRoberto.id, idDocenteVocal2: docentePatricia.id,
      tipo: 'Regular', idAdministrativo: adminMaria.id,
    } as any),
    MesaExamen.create({
      idTurnoExamen: turno2.id, idUnidadCurricular: ucBD.id, fecha: '2026-08-12',
      hora: '10:00', idDocentePresidente: docenteRoberto.id,
      idDocenteVocal1: docenteLucia.id, idDocenteVocal2: docentePatricia.id,
      tipo: 'Regular', idAdministrativo: adminMaria.id,
    } as any),
    MesaExamen.create({
      idTurnoExamen: turno3.id, idUnidadCurricular: ucMate.id, fecha: '2026-12-05',
      hora: '11:00', idDocentePresidente: docentePatricia.id,
      idDocenteVocal1: docenteLucia.id, idDocenteVocal2: docenteRoberto.id,
      tipo: 'Libre', idAdministrativo: adminLaura.id,
    } as any),
  ]);
  const [mesa1, mesa2, mesa3] = mesas;

  await Promise.all([
    MesaExamenXLegajo.create({
      idMesaExamen: mesa1.id, idLegajo: legajoJuan.id, condicion: 'regular',
      fechaInscripcion: new Date('2026-07-01T10:00:00Z'),
      nota_oral: 0, nota_escrita: 0, nota_final: 0,
      fechaUltimaModificacion: new Date('2026-07-01T10:00:00Z'),
      resultado: 'ausente', idAdministrativo: adminMaria.id,
    } as any),
    MesaExamenXLegajo.create({
      idMesaExamen: mesa2.id, idLegajo: legajoAna.id, condicion: 'libre',
      fechaInscripcion: new Date('2026-08-02T10:00:00Z'),
      nota_oral: 7, nota_escrita: 6, nota_final: 6,
      fechaUltimaModificacion: new Date('2026-08-12T14:00:00Z'),
      resultado: 'aprobado', idAdministrativo: adminMaria.id,
    } as any),
    MesaExamenXLegajo.create({
      idMesaExamen: mesa3.id, idLegajo: legajoPedro.id, condicion: 'regular',
      fechaInscripcion: new Date('2026-12-01T10:00:00Z'),
      nota_oral: 0, nota_escrita: 0, nota_final: 0,
      fechaUltimaModificacion: new Date('2026-12-01T10:00:00Z'),
      resultado: 'ausente', idAdministrativo: adminLaura.id,
    } as any),
  ]);
  console.log(`  • 3 turnos, 3 mesas, 3 inscripciones a mesa`);

  // ─── Equivalencias ────────────────────────────────────
  await Promise.all([
    EquivalenciaUnidadCurricular.create({
      idPlanEstudioOrigen: planTSP.id, idPlanEstudioDestino: planTSD.id,
      idUnidadCurricularOrigen: ucProg1.id, idUnidadCurricularDestino: ucBD.id,
      tipoEquivalencia: 'PARCIAL', observaciones: 'Reconocimiento parcial Prog I',
      idAdministrativo: adminMaria.id,
    } as any),
    EquivalenciaUnidadCurricular.create({
      idPlanEstudioOrigen: planTSD.id, idPlanEstudioDestino: planTSAS.id,
      idUnidadCurricularOrigen: ucBD.id, idUnidadCurricularDestino: ucMate.id,
      tipoEquivalencia: 'TOTAL', observaciones: 'Equivalencia total BD',
      idAdministrativo: adminMaria.id,
    } as any),
    EquivalenciaUnidadCurricular.create({
      idPlanEstudioOrigen: planTSP.id, idPlanEstudioDestino: planTSAS.id,
      idUnidadCurricularOrigen: ucMate.id, idUnidadCurricularDestino: ucProg1.id,
      tipoEquivalencia: 'PARCIAL', observaciones: 'Reconocimiento matemática',
      idAdministrativo: adminLaura.id,
    } as any),
  ]);
  console.log(`  • 3 equivalencias`);

  // ─── Movimientos financieros + comprobantes ───────────
  const movimientos = await Promise.all([
    MovimientoFinanciero.create({
      idEstudiante: estudianteJuan.id, tipo: 'INGRESO', concepto: 'Pago cuota abril',
      monto: 25000, fecha: '2026-04-05', medioPago: 'Transferencia',
      descripcion: null, idAdministrativo: adminMaria.id,
    } as any),
    MovimientoFinanciero.create({
      idEstudiante: estudianteAna.id, tipo: 'INGRESO', concepto: 'Pago cuota mayo',
      monto: 25000, fecha: '2026-05-05', medioPago: 'Efectivo',
      descripcion: null, idAdministrativo: adminMaria.id,
    } as any),
    MovimientoFinanciero.create({
      idEstudiante: estudiantePedro.id, tipo: 'EGRESO', concepto: 'Devolución arancel',
      monto: 5000, fecha: '2026-05-10', medioPago: 'Transferencia',
      descripcion: 'Ajuste administrativo', idAdministrativo: adminLaura.id,
    } as any),
  ]);

  await Promise.all([
    ComprobanteAlumno.create({
      idMovimientoFinanciero: movimientos[0].id, urlComprobante: 'https://example.com/comprobante-01.pdf',
      concepto: 'Cuota abril', estado: 'VALIDADO', idAdministrativo: adminMaria.id,
    } as any),
    ComprobanteAlumno.create({
      idMovimientoFinanciero: movimientos[1].id, urlComprobante: 'https://example.com/comprobante-02.pdf',
      concepto: 'Cuota mayo', estado: 'VALIDADO', idAdministrativo: adminMaria.id,
    } as any),
    ComprobanteAlumno.create({
      idMovimientoFinanciero: movimientos[2].id, urlComprobante: 'https://example.com/comprobante-03.pdf',
      concepto: 'Devolución', estado: 'NO_VALIDADO', idAdministrativo: adminLaura.id,
    } as any),
  ]);
  console.log(`  • 3 movimientos financieros, 3 comprobantes`);

  // ─── Documentos ───────────────────────────────────────
  const tiposDoc = await Promise.all([
    TipoDocumentoRequerido.create({
      idCarrera: carreraTSP.id, nombreDocumento: 'DNI escaneado', obligatorio: true,
      esCritico: true, descripcion: 'Documento obligatorio para inscripción',
      diasVigencia: 365, idAdministrativo: adminMaria.id,
    } as any),
    TipoDocumentoRequerido.create({
      idCarrera: carreraTSD.id, nombreDocumento: 'Certificado analítico', obligatorio: true,
      esCritico: false, descripcion: 'Analítico secundario',
      diasVigencia: 180, idAdministrativo: adminMaria.id,
    } as any),
    TipoDocumentoRequerido.create({
      idCarrera: carreraTSAS.id, nombreDocumento: 'Foto carnet', obligatorio: true,
      esCritico: false, descripcion: 'Foto actualizada',
      diasVigencia: 90, idAdministrativo: adminLaura.id,
    } as any),
  ]);

  await Promise.all([
    DocumentoLegajo.create({
      idLegajo: legajoJuan.id, idTipoDocumentoRequerido: tiposDoc[0].id,
      idUsuarioCarga: usuarioJuan.id, urlArchivo: 'https://example.com/doc-juan.pdf',
      idAdministrativo: adminMaria.id,
    } as any),
    DocumentoLegajo.create({
      idLegajo: legajoAna.id, idTipoDocumentoRequerido: tiposDoc[1].id,
      idUsuarioCarga: usuarioAna.id, urlArchivo: 'https://example.com/doc-ana.pdf',
      idAdministrativo: adminMaria.id,
    } as any),
    DocumentoLegajo.create({
      idLegajo: legajoPedro.id, idTipoDocumentoRequerido: tiposDoc[2].id,
      idUsuarioCarga: usuarioPedro.id, urlArchivo: 'https://example.com/doc-pedro.pdf',
      idAdministrativo: adminLaura.id,
    } as any),
  ]);

  await Promise.all([
    DossierInstitucional.create({
      idCarrera: carreraTSP.id, titulo: 'Reglamento de Promoción',
      seccion: 'Normativa Académica', contenido: 'Texto del reglamento TSP...',
      urlArchivo: null, tipo: 'NORMATIVA', estado: true, idAdministrativo: adminMaria.id,
    } as any),
    DossierInstitucional.create({
      idCarrera: carreraTSD.id, titulo: 'Plan de estudios TSD',
      seccion: 'Documentación', contenido: 'Detalle del plan TSD...',
      urlArchivo: null, tipo: 'INFORME', estado: true, idAdministrativo: adminMaria.id,
    } as any),
    DossierInstitucional.create({
      idCarrera: carreraTSAS.id, titulo: 'Perfil del egresado TSAS',
      seccion: 'Institucional', contenido: 'Competencias del egresado...',
      urlArchivo: null, tipo: 'CIRCULAR', estado: true, idAdministrativo: adminLaura.id,
    } as any),
  ]);
  console.log(`  • 3 tipos documento, 3 documentos legajo, 3 dossiers`);

  // ─── Admisión ─────────────────────────────────────────
  await Promise.all([
    InscripcionCarrera.create({
      cupo: 50, fechaDesde: '2026-01-01', fechaHasta: '2026-02-28',
      idPlanEstudio: planTSP.id, idAdministrativo: adminMaria.id,
    } as any),
    InscripcionCarrera.create({
      cupo: 40, fechaDesde: '2026-01-01', fechaHasta: '2026-02-28',
      idPlanEstudio: planTSD.id, idAdministrativo: adminMaria.id,
    } as any),
    InscripcionCarrera.create({
      cupo: 35, fechaDesde: '2026-01-01', fechaHasta: '2026-02-28',
      idPlanEstudio: planTSAS.id, idAdministrativo: adminLaura.id,
    } as any),
  ]);

  await Promise.all([
    Preinscripto.create({
      idCarrera: carreraTSP.id, idUsuario: usuarioJuan.id,
      dni: '45111222', domicilio: 'Mendoza 100', telefono: '351-1112223',
      fechaInscripcion: '2026-02-01', cus: 'CUS-001', isa: 'ISA-001', emmac: null,
      analitico: 'analitico-juan.pdf', partidaNacimiento: 'partida-juan.pdf', foto: 'foto-juan.jpg',
      estado: 'pendiente',
    } as any),
    Preinscripto.create({
      idCarrera: carreraTSD.id, idUsuario: usuarioAna.id,
      dni: '40234567', domicilio: 'Calle Estudiante 2', telefono: '351-2220000',
      fechaInscripcion: '2026-02-05', cus: 'CUS-002', isa: 'ISA-002', emmac: 'EMMAC-002',
      analitico: 'analitico-ana.pdf', partidaNacimiento: 'partida-ana.pdf', foto: 'foto-ana.jpg',
      estado: 'aprobado',
    } as any),
    Preinscripto.create({
      idCarrera: carreraTSAS.id, idUsuario: usuarioPedro.id,
      dni: '42333444', domicilio: 'Calle Estudiante 3', telefono: '351-3334444',
      fechaInscripcion: '2026-02-10', cus: 'CUS-003', isa: 'ISA-003', emmac: null,
      analitico: 'analitico-pedro.pdf', partidaNacimiento: 'partida-pedro.pdf', foto: 'foto-pedro.jpg',
      estado: 'pendiente',
    } as any),
  ]);

  await Promise.all([
    InformacionExtra.create({
      titulo: 'Salida laboral', icono: 'briefcase',
      descripcion: 'Posibilidad de trabajo en desarrollo de software', idCarrera: carreraTSP.id,
    } as any),
    InformacionExtra.create({
      titulo: 'Prácticas profesionales', icono: 'building',
      descripcion: 'Convenios con empresas de la región', idCarrera: carreraTSD.id,
    } as any),
    InformacionExtra.create({
      titulo: 'Certificaciones', icono: 'award',
      descripcion: 'Preparación para certificaciones de industria', idCarrera: carreraTSAS.id,
    } as any),
  ]);
  console.log(`  • 3 inscripciones carrera, 3 preinscriptos, 3 informacion extra`);

  // ─── Seguridad / Sesiones / Notificaciones ────────────
  await Promise.all([
    SesionUsuario.create({
      idUsuario: usuarioJuan.id, intentoFallido: 0, bloqueado: false,
    } as any),
    SesionUsuario.create({
      idUsuario: usuarioAna.id, intentoFallido: 1, bloqueado: false,
    } as any),
    SesionUsuario.create({
      idUsuario: usuarioPedro.id, intentoFallido: 0, bloqueado: false,
    } as any),
  ]);

  await Promise.all([
    RecuperacionContrasenia.create({
      idUsuario: usuarioJuan.id,
      tokenHash: 'seed-dummy-token-hash-juan',
      fechaExpiracion: new Date(Date.now() + 24 * 3600 * 1000),
    } as any),
    RecuperacionContrasenia.create({
      idUsuario: usuarioAna.id,
      tokenHash: 'seed-dummy-token-hash-ana',
      fechaExpiracion: new Date(Date.now() + 48 * 3600 * 1000),
    } as any),
    RecuperacionContrasenia.create({
      idUsuario: usuarioPedro.id,
      tokenHash: 'seed-dummy-token-hash-pedro',
      fechaExpiracion: new Date(Date.now() + 72 * 3600 * 1000),
    } as any),
  ]);

  await Promise.all([
    Notificacion.create({
      idEstudiante: estudianteJuan.id, titulo: 'Bienvenido al sistema',
      mensaje: 'Tu cuenta fue creada exitosamente', tipo: 'BIENVENIDA',
      entidadRelacionada: null, entidadId: null,
    } as any),
    Notificacion.create({
      idEstudiante: estudianteAna.id, titulo: 'Nueva calificación',
      mensaje: 'Se registró una nota en Programación I', tipo: 'CALIFICACION',
      entidadRelacionada: 'instancia_evaluativa', entidadId: instanciaAna.id,
    } as any),
    Notificacion.create({
      idEstudiante: estudiantePedro.id, titulo: 'Recordatorio de pago',
      mensaje: 'Tenés un arancel pendiente de abril', tipo: 'FINANZAS',
      entidadRelacionada: null, entidadId: null,
    } as any),
  ]);
  console.log(`  • 3 sesiones, 3 recuperaciones, 3 notificaciones`);
  console.log(`  • notificacion_x_email: 0 (runtime)`);
  console.log(`  • token_blacklist: 0 (runtime)`);
  console.log('✓ Seed completo.');
}

async function main() {
  try {
    await ensureDatabaseExists();
    if (!SEED_ONLY) {
      await syncSchema();
    }
    await seed();
    printCredentials();
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en db-setup:', err);
    await sequelize.close();
    process.exit(1);
  }
}

main();
