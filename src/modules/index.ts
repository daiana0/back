import sequelize from "../config/database/conexion.js";

// ─── Modelos ─────────────────────────────────────────────────────
import Administrativo from "./administrativos/model/Administrativo.js";
import Asistencia from "./asistencia/model/Asistencia.js";
import CambioPlanEstudio from "./cambioPlanEstudio/model/CambioPlanEstudio.js";
import Carrera from "./carreras/model/Carrera.js";
import CicloLectivo from "./ciclo-lectivos/model/CicloLectivo.js";
import ComprobanteAlumno from "./comprobanteAlumno/model/ComprobanteAlumno.js";
import Correlatividad from "./correlatividad/model/Correlatividad.js";
import Curso from "./cursos/model/Curso.js";
import DesignacionesDocente from "./designacionesDocente/model/DesignacionDocente.js";
import Division from "./division/model/Division.js";
import DivisionXUnidadCurricular from "./divisionXUnidadCurricular/model/DivisionXUnidadCurricular.js";
import Docente from "./docentes/model/Docente.js";
import DocumentoLegajo from "./documentoLegajo/model/DocumentoLegajo.js";
import DossierInstitucional from "./dossierInstitucional/model/DossierInstitucional.js";
import EquivalenciaUnidadCurricular from "./equivalenciaUnidadCurricular/model/EquivalenciaUnidadCurricular.js";
import Estudiante from "./estudiantes/model/Estudiante.js";
import EstudianteXUnidadCurricular from "./estudiantesXUnidadCurricular/model/EstudianteXUnidadCurricular.js";
import InformacionExtra from "./informacionExtra/model/InformacionExtra.js";
import InscripcionCarrera from "./inscripcionCarrera/model/InscripcionCarrera.js";
import InstanciaEvaluativa from "./instanciasEvaluativas/model/InstanciaEvaluativa.js";
import Legajo from "./legajos/model/Legajo.js";
import LegajoXInstanciaEvaluativa from "./legajosXInstanciasEvaluativas/model/LegajoXInstanciaEvaluativa.js";
import MesaExamen from "./mesasExamenes/model/MesaExamen.js";
import MesaExamenXLegajo from "./mesaExamenXLegajo/model/MesaExamenXLegajo.js";
import MovimientoFinanciero from "./movimientoFinanciero/model/movimientoFinanciero.js";
import Notificacion from "./notificaciones/model/notificacion.model.js";
import PlanEstudio from "./planes_estudios/model/PlanEstudio.js";
import Preinscripto from "./preinscriptos/model/Preinscripto.js";
import RecuperacionContrasenia from "./recuperaciones/model/recuperacion-contrasenia.model.js";
import Rol from "./roles/model/Rol.js";
import SesionUsuario from "./sesiones/model/sesion-usuario.model.js";
import TipoDocumentoRequerido from "./tipoDocumentoRequerido/model/TipoDocumentoRequerido.js";
import TurnoExamen from "./turnos-examenes/model/TurnoExamen.js";
import UnidadCurricular from "./unidades_curriculares/model/UnidadCurricular.js";
import Usuario from "./usuarios/model/Usuario.js";
import TokenBlacklist from "./auth/model/TokenBlacklist.js";
import NotificacionXEmail from "./notificacionesXEmail/model/notificacionXEmail.model.js";

// ─── Relaciones BelongsTo (claves foráneas) ──────────────────────

Administrativo.belongsTo(Rol, { foreignKey: "idRol", as: "rol" });

Asistencia.belongsTo(DivisionXUnidadCurricular, { foreignKey: "idDivisionXUnidadCurricular", as: "divisionXUnidadCurricular" });
Asistencia.belongsTo(Legajo, { foreignKey: "idLegajo", as: "legajo" });
Asistencia.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });

CambioPlanEstudio.belongsTo(Legajo, { foreignKey: "idLegajo", as: "legajo" });
CambioPlanEstudio.belongsTo(PlanEstudio, { foreignKey: "idPlanEstudioOrigen", as: "planEstudioOrigen" });
CambioPlanEstudio.belongsTo(PlanEstudio, { foreignKey: "idPlanEstudioDestino", as: "planEstudioDestino" });
CambioPlanEstudio.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });

Carrera.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });

CicloLectivo.belongsTo(PlanEstudio, { foreignKey: "idPlanEstudio", as: "planEstudio" });
CicloLectivo.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });

ComprobanteAlumno.belongsTo(MovimientoFinanciero, { foreignKey: "idMovimientoFinanciero", as: "movimientoFinanciero" });
ComprobanteAlumno.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });

Correlatividad.belongsTo(PlanEstudio, { foreignKey: "idPlan", as: "plan" });
Correlatividad.belongsTo(UnidadCurricular, { foreignKey: "idUnidadCurricular", as: "unidadCurricular" });
Correlatividad.belongsTo(UnidadCurricular, { foreignKey: "idUnidadCurricularCorrelativa", as: "unidadCurricularCorrelativa" });

Curso.belongsTo(CicloLectivo, { foreignKey: "idCicloLectivo", as: "cicloLectivo" });
Curso.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });

DesignacionesDocente.belongsTo(Docente, { foreignKey: "idDocente", as: "docente" });
DesignacionesDocente.belongsTo(DivisionXUnidadCurricular, { foreignKey: "idDivisionXUnidadCurricular", as: "divisionXUnidadCurricular" });
DesignacionesDocente.belongsTo(CicloLectivo, { foreignKey: "idCicloLectivo", as: "cicloLectivo" });
DesignacionesDocente.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });

Division.belongsTo(Docente, { foreignKey: "idDocente", as: "docente" });
Division.belongsTo(Curso, { foreignKey: "idCurso", as: "curso" });
Division.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });

DivisionXUnidadCurricular.belongsTo(Division, { foreignKey: "idDivision", as: "division" });
DivisionXUnidadCurricular.belongsTo(UnidadCurricular, { foreignKey: "idUnidadCurricular", as: "unidadCurricular" });
DivisionXUnidadCurricular.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });

Docente.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });

DocumentoLegajo.belongsTo(Legajo, { foreignKey: "idLegajo", as: "legajo" });
DocumentoLegajo.belongsTo(TipoDocumentoRequerido, { foreignKey: "idTipoDocumentoRequerido", as: "tipoDocumentoRequerido" });
DocumentoLegajo.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });

DossierInstitucional.belongsTo(Carrera, { foreignKey: "idCarrera", as: "carrera" });
DossierInstitucional.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });

EquivalenciaUnidadCurricular.belongsTo(PlanEstudio, { foreignKey: "idPlanEstudioOrigen", as: "planEstudioOrigen" });
EquivalenciaUnidadCurricular.belongsTo(PlanEstudio, { foreignKey: "idPlanEstudioDestino", as: "planEstudioDestino" });
EquivalenciaUnidadCurricular.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });

Estudiante.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });
Estudiante.belongsTo(Usuario, { foreignKey: "idUsuario", as: "usuario" });

EstudianteXUnidadCurricular.belongsTo(DivisionXUnidadCurricular, { foreignKey: "idDivisionXUnidadCurricular", as: "divisionXUnidadCurricular" });
EstudianteXUnidadCurricular.belongsTo(Legajo, { foreignKey: "idLegajo", as: "legajo" });
EstudianteXUnidadCurricular.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });

InformacionExtra.belongsTo(Carrera, { foreignKey: "idCarrera", as: "carrera" });

InscripcionCarrera.belongsTo(PlanEstudio, { foreignKey: "idPlanEstudio", as: "planEstudio" });
InscripcionCarrera.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });

InstanciaEvaluativa.belongsTo(DivisionXUnidadCurricular, { foreignKey: "idDivisionXUnidadCurricular", as: "divisionXUnidadCurricular" });
InstanciaEvaluativa.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });

Legajo.belongsTo(Estudiante, { foreignKey: "idEstudiante", as: "estudiante" });
Legajo.belongsTo(PlanEstudio, { foreignKey: "idPlanEstudio", as: "planEstudio" });
Legajo.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });

LegajoXInstanciaEvaluativa.belongsTo(InstanciaEvaluativa, { foreignKey: "idInstanciaEvaluativa", as: "instanciaEvaluativa" });
LegajoXInstanciaEvaluativa.belongsTo(Legajo, { foreignKey: "idLegajo", as: "legajo" });
LegajoXInstanciaEvaluativa.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });

MesaExamen.belongsTo(TurnoExamen, { foreignKey: "idTurnoExamen", as: "turnoExamen" });
MesaExamen.belongsTo(UnidadCurricular, { foreignKey: "idUnidadCurricular", as: "unidadCurricular" });
MesaExamen.belongsTo(Docente, { foreignKey: "idDocentePresidente", as: "docentePresidente" });
MesaExamen.belongsTo(Docente, { foreignKey: "idDocenteVocal1", as: "docenteVocal1" });
MesaExamen.belongsTo(Docente, { foreignKey: "idDocenteVocal2", as: "docenteVocal2" });
MesaExamen.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });

MesaExamenXLegajo.belongsTo(MesaExamen, { foreignKey: "idMesaExamen", as: "mesaExamen" });
MesaExamenXLegajo.belongsTo(Legajo, { foreignKey: "idLegajo", as: "legajo" });
MesaExamenXLegajo.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });

MovimientoFinanciero.belongsTo(Estudiante, { foreignKey: "idEstudiante", as: "estudiante" });
MovimientoFinanciero.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });

Notificacion.belongsTo(Estudiante, { foreignKey: "idEstudiante", as: "estudiante" });
Notificacion.belongsTo(Docente, { foreignKey: "idDocente", as: "docente" });
Notificacion.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });

PlanEstudio.belongsTo(Carrera, { foreignKey: "idCarrera", as: "carrera" });
PlanEstudio.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });


Preinscripto.belongsTo(Carrera, { foreignKey: "idCarrera", as: "carrera" });
Preinscripto.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuario' });
RecuperacionContrasenia.belongsTo(Usuario, { foreignKey: "idUsuario", as: "usuario" });
RecuperacionContrasenia.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });
RecuperacionContrasenia.belongsTo(Docente, { foreignKey: "idDocente", as: "docente" });

SesionUsuario.belongsTo(Usuario, { foreignKey: "idUsuario", as: "usuario" });
SesionUsuario.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });
SesionUsuario.belongsTo(Docente, { foreignKey: "idDocente", as: "docente" });

TipoDocumentoRequerido.belongsTo(Carrera, { foreignKey: "idCarrera", as: "carrera" });
TipoDocumentoRequerido.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });

TurnoExamen.belongsTo(CicloLectivo, { foreignKey: "idCicloLectivo", as: "cicloLectivo" });
TurnoExamen.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });

UnidadCurricular.belongsTo(PlanEstudio, { foreignKey: "idPlanEstudio", as: "planEstudio" });
UnidadCurricular.belongsTo(Administrativo, { foreignKey: "idAdministrativo", as: "administrativo" });



// ─── Relaciones HasMany (inversas) ────────────────────────────────

Administrativo.hasMany(Asistencia, { foreignKey: "idAdministrativo", as: "asistencias" });
Administrativo.hasMany(CambioPlanEstudio, { foreignKey: "idAdministrativo", as: "cambiosPlanEstudio" });
Administrativo.hasMany(Carrera, { foreignKey: "idAdministrativo", as: "carreras" });
Administrativo.hasMany(CicloLectivo, { foreignKey: "idAdministrativo", as: "ciclosLectivos" });
Administrativo.hasMany(ComprobanteAlumno, { foreignKey: "idAdministrativo", as: "comprobantesAlumnos" });
Administrativo.hasMany(Curso, { foreignKey: "idAdministrativo", as: "cursos" });
Administrativo.hasMany(DesignacionesDocente, { foreignKey: "idAdministrativo", as: "designacionesDocentes" });
Administrativo.hasMany(Division, { foreignKey: "idAdministrativo", as: "divisiones" });
Administrativo.hasMany(DivisionXUnidadCurricular, { foreignKey: "idAdministrativo", as: "divisionesXUnidadCurricular" });
Administrativo.hasMany(Docente, { foreignKey: "idAdministrativo", as: "docentes" });
Administrativo.hasMany(DocumentoLegajo, { foreignKey: "idAdministrativo", as: "documentosLegajos" });
Administrativo.hasMany(DossierInstitucional, { foreignKey: "idAdministrativo", as: "dossiersInstitucionales" });
Administrativo.hasMany(EquivalenciaUnidadCurricular, { foreignKey: "idAdministrativo", as: "equivalencias" });
Administrativo.hasMany(Estudiante, { foreignKey: "idAdministrativo", as: "estudiantes" });
Administrativo.hasMany(EstudianteXUnidadCurricular, { foreignKey: "idAdministrativo", as: "estudiantesXUnidadCurricular" });
Administrativo.hasMany(InscripcionCarrera, { foreignKey: "idAdministrativo", as: "inscripcionesCarreras" });
Administrativo.hasMany(InstanciaEvaluativa, { foreignKey: "idAdministrativo", as: "instanciasEvaluativas" });
Administrativo.hasMany(Legajo, { foreignKey: "idAdministrativo", as: "legajos" });
Administrativo.hasMany(LegajoXInstanciaEvaluativa, { foreignKey: "idAdministrativo", as: "legajosXInstanciasEvaluativas" });
Administrativo.hasMany(MesaExamen, { foreignKey: "idAdministrativo", as: "mesasExamenes" });
Administrativo.hasMany(MesaExamenXLegajo, { foreignKey: "idAdministrativo", as: "mesasExamenesXLegajos" });
Administrativo.hasMany(MovimientoFinanciero, { foreignKey: "idAdministrativo", as: "movimientosFinancieros" });
Administrativo.hasMany(Notificacion, { foreignKey: "idAdministrativo", as: "notificaciones" });
Administrativo.hasMany(PlanEstudio, { foreignKey: "idAdministrativo", as: "planesEstudios" });

Administrativo.hasMany(RecuperacionContrasenia, { foreignKey: "idAdministrativo", as: "recuperaciones" });
Administrativo.hasMany(SesionUsuario, { foreignKey: "idAdministrativo", as: "sesiones" });
Administrativo.hasMany(TipoDocumentoRequerido, { foreignKey: "idAdministrativo", as: "tiposDocumentosRequeridos" });
Administrativo.hasMany(TurnoExamen, { foreignKey: "idAdministrativo", as: "turnosExamenes" });
Administrativo.hasMany(UnidadCurricular, { foreignKey: "idAdministrativo", as: "unidadesCurriculares" });


Carrera.hasMany(DossierInstitucional, { foreignKey: "idCarrera", as: "dossiers" });
Carrera.hasMany(InformacionExtra, { foreignKey: "idCarrera", as: "informacionesExtra" });
Carrera.hasMany(PlanEstudio, { foreignKey: "idCarrera", as: "planesEstudios" });
Carrera.hasMany(Preinscripto, { foreignKey: "idCarrera", as: "preinscriptos" });
Carrera.hasMany(TipoDocumentoRequerido, { foreignKey: "idCarrera", as: "tiposDocumentosRequeridos" });

CicloLectivo.hasMany(Curso, { foreignKey: "idCicloLectivo", as: "cursos" });
CicloLectivo.hasMany(DesignacionesDocente, { foreignKey: "idCicloLectivo", as: "designaciones" });
CicloLectivo.hasMany(TurnoExamen, { foreignKey: "idCicloLectivo", as: "turnosExamenes" });

Curso.hasMany(Division, { foreignKey: "idCurso", as: "divisiones" });

Division.hasMany(DivisionXUnidadCurricular, { foreignKey: "idDivision", as: "divisionesXUnidadCurricular" });

DivisionXUnidadCurricular.hasMany(Asistencia, { foreignKey: "idDivisionXUnidadCurricular", as: "asistencias" });
DivisionXUnidadCurricular.hasMany(DesignacionesDocente, { foreignKey: "idDivisionXUnidadCurricular", as: "designaciones" });
DivisionXUnidadCurricular.hasMany(EstudianteXUnidadCurricular, { foreignKey: "idDivisionXUnidadCurricular", as: "estudiantesXUnidadCurricular" });
DivisionXUnidadCurricular.hasMany(InstanciaEvaluativa, { foreignKey: "idDivisionXUnidadCurricular", as: "instanciasEvaluativas" });

Docente.hasMany(DesignacionesDocente, { foreignKey: "idDocente", as: "designaciones" });
Docente.hasMany(Division, { foreignKey: "idDocente", as: "divisiones" });
Docente.hasMany(MesaExamen, { foreignKey: "idDocentePresidente", as: "mesasPresidente" });
Docente.hasMany(MesaExamen, { foreignKey: "idDocenteVocal1", as: "mesasVocal1" });
Docente.hasMany(MesaExamen, { foreignKey: "idDocenteVocal2", as: "mesasVocal2" });
Docente.hasMany(RecuperacionContrasenia, { foreignKey: "idDocente", as: "recuperaciones" });
Docente.hasMany(SesionUsuario, { foreignKey: "idDocente", as: "sesiones" });

Estudiante.hasMany(Legajo, { foreignKey: "idEstudiante", as: "legajos" });
Estudiante.hasMany(MovimientoFinanciero, { foreignKey: "idEstudiante", as: "movimientosFinancieros" });


InstanciaEvaluativa.hasMany(LegajoXInstanciaEvaluativa, { foreignKey: "idInstanciaEvaluativa", as: "legajosXInstanciasEvaluativas" });

Legajo.hasMany(Asistencia, { foreignKey: "idLegajo", as: "asistencias" });
Legajo.hasMany(CambioPlanEstudio, { foreignKey: "idLegajo", as: "cambiosPlanEstudio" });
Legajo.hasMany(DocumentoLegajo, { foreignKey: "idLegajo", as: "documentosLegajos" });
Legajo.hasMany(EstudianteXUnidadCurricular, { foreignKey: "idLegajo", as: "estudiantesXUnidadCurricular" });
Legajo.hasMany(LegajoXInstanciaEvaluativa, { foreignKey: "idLegajo", as: "legajosXInstanciasEvaluativas" });
Legajo.hasMany(MesaExamenXLegajo, { foreignKey: "idLegajo", as: "mesasExamenesXLegajos" });

MesaExamen.hasMany(MesaExamenXLegajo, { foreignKey: "idMesaExamen", as: "legajosXInstanciasEvaluativas" });

MovimientoFinanciero.hasMany(ComprobanteAlumno, { foreignKey: "idMovimientoFinanciero", as: "comprobantesAlumnos" });

PlanEstudio.hasMany(CambioPlanEstudio, { foreignKey: "idPlanEstudioOrigen", as: "cambiosOrigen" });
PlanEstudio.hasMany(CambioPlanEstudio, { foreignKey: "idPlanEstudioDestino", as: "cambiosDestino" });
PlanEstudio.hasMany(CicloLectivo, { foreignKey: "idPlanEstudio", as: "ciclosLectivos" });
PlanEstudio.hasMany(EquivalenciaUnidadCurricular, { foreignKey: "idPlanEstudioOrigen", as: "equivalenciasOrigen" });
PlanEstudio.hasMany(EquivalenciaUnidadCurricular, { foreignKey: "idPlanEstudioDestino", as: "equivalenciasDestino" });
PlanEstudio.hasMany(InscripcionCarrera, { foreignKey: "idPlanEstudio", as: "inscripciones" });
PlanEstudio.hasMany(Legajo, { foreignKey: "idPlanEstudio", as: "legajos" });
PlanEstudio.hasMany(UnidadCurricular, { foreignKey: "idPlanEstudio", as: "unidadesCurriculares" });
PlanEstudio.hasMany(Correlatividad, { foreignKey: "idPlan", as: "correlatividades" });

Rol.hasMany(Administrativo, { foreignKey: "idRol", as: "administrativos" });

TurnoExamen.hasMany(MesaExamen, { foreignKey: "idTurnoExamen", as: "mesasExamenes" });

UnidadCurricular.hasMany(DivisionXUnidadCurricular, { foreignKey: "idUnidadCurricular", as: "divisionesXUnidadCurricular" });
UnidadCurricular.hasMany(MesaExamen, { foreignKey: "idUnidadCurricular", as: "mesasExamenes" });
UnidadCurricular.hasMany(Correlatividad, { foreignKey: "idUnidadCurricular", as: "correlatividades" });
UnidadCurricular.hasMany(Correlatividad, { foreignKey: "idUnidadCurricularCorrelativa", as: "correlatividadesCorrelativas" });

Usuario.hasMany(Estudiante, { foreignKey: "idUsuario", as: "estudiantes" });
Usuario.hasMany(RecuperacionContrasenia, { foreignKey: "idUsuario", as: "recuperaciones" });
Usuario.hasMany(SesionUsuario, { foreignKey: "idUsuario", as: "sesiones" });
Usuario.hasMany(Preinscripto, { foreignKey: 'idUsuario', as: 'preinscriptos' });

// ─── Exportaciones ─────────────────────────────────────────────────
export {
  sequelize,
  Administrativo,
  Asistencia,
  CambioPlanEstudio,
  Carrera,
  CicloLectivo,
  ComprobanteAlumno,
  Correlatividad,
  Curso,
  DesignacionesDocente,
  Division,
  DivisionXUnidadCurricular,
  Docente,
  DocumentoLegajo,
  DossierInstitucional,
  EquivalenciaUnidadCurricular,
  Estudiante,
  EstudianteXUnidadCurricular,
  InformacionExtra,
  InscripcionCarrera,
  InstanciaEvaluativa,
  Legajo,
  LegajoXInstanciaEvaluativa,
  MesaExamen,
  MesaExamenXLegajo,
  MovimientoFinanciero,
  Notificacion,
  PlanEstudio,
  Preinscripto,
  RecuperacionContrasenia,
  Rol,
  SesionUsuario,
  TipoDocumentoRequerido,
  TurnoExamen,
  UnidadCurricular,
  Usuario,
  NotificacionXEmail,
  TokenBlacklist,
};