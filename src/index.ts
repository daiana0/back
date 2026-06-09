import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { sequelize } from "./modules/index.js";
import { errorHandler } from "./core/middlewares/error-handler.middleware.js";

import { administrativoRouter } from "./modules/administrativos/administrativo.routes.js";
import { asistenciaRouter } from "./modules/asistencia/asistencia.routes.js";
import { cambioPlanEstudioRouter } from "./modules/cambioPlanEstudio/cambioPlanEstudio.routes.js";
import { carreraRouter } from "./modules/carreras/carrera.routes.js";
import { cicloLectivoRouter } from "./modules/ciclo-lectivos/ciclo-lectivo.routes.js";
import { comprobanteAlumnoRouter } from "./modules/comprobanteAlumno/comprobanteAlumno.routes.js";
import { correlatividadRouter } from "./modules/correlatividad/correlatividad.routes.js";
import { cursoRouter } from "./modules/cursos/curso.routes.js";
import { designacionDocenteRouter } from "./modules/designacionesDocente/designacion-docente.routes.js";
import { divisionRouter } from "./modules/division/division.routes.js";
import { divisionXUnidadCurricularRouter } from "./modules/divisionXUnidadCurricular/divisionXUnidadCurricular.routes.js";
import { docenteRouter } from "./modules/docentes/docentes.routes.js";
import { documentoLegajoRouter } from "./modules/documentoLegajo/documentoLegajo.routes.js";
import { dossierInstitucionalRouter } from "./modules/dossierInstitucional/dossierInstitucional.routes.js";
import { equivalenciaRouter } from "./modules/equivalenciaUnidadCurricular/equivalenciaUnidadCurricular.routes.js";
import { estudianteRouter } from "./modules/estudiantes/estudiante.routes.js";
import { estudianteXUnidadCurricularRouter } from "./modules/estudiantesXUnidadCurricular/estudiantesXUnidadCurricular.routes.js";
import { informacionExtraRouter } from "./modules/informacionExtra/informacionExtra.routes.js";
import { inscripcionCarreraRouter } from "./modules/inscripcionCarrera/inscripcionCarrera.routes.js";
import { instanciaEvaluativaRouter } from "./modules/instanciasEvaluativas/instancia-evaluativa.routes.js";
import { legajoRouter } from "./modules/legajos/legajo.routes.js";
import { legajoXInstanciaEvaluativaRouter } from "./modules/legajosXInstanciasEvaluativas/legajo-x-instancia-evaluativa.routes.js";
import { mesaExamenRouter } from "./modules/mesasExamenes/mesa-examen.routes.js";
import { mesaExamenXLegajoRouter } from "./modules/mesaExamenXLegajo/mesaExamenXLegajo.routes.js";
import { movimientoFinancieroRouter } from "./modules/movimientoFinanciero/movimientoFinanciero.routes.js";
import { notificacionRouter } from "./modules/notificaciones/notificacion.routes.js";
import { planEstudioRouter } from "./modules/planes_estudios/plan-estudio.routes.js";
import { preinscriptoRouter } from "./modules/preinscriptos/preinscriptos.routes.js";
import { recuperacionRouter } from "./modules/recuperaciones/recuperacion-contrasenia.routes.js";
import { rolRouter } from "./modules/roles/roles.routes.js";
import { sesionRouter } from "./modules/sesiones/sesion-usuario.routes.js";
import { tipoDocumentoRouter } from "./modules/tipoDocumentoRequerido/tipoDocumentoRequerido.routes.js";
import { turnoExamenRouter } from "./modules/turnos-examenes/turno-examen.routes.js";
import { unidadCurricularRouter } from "./modules/unidades_curriculares/unidad-curricular.routes.js";
import { usuarioRouter } from "./modules/usuarios/usuarios.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { uploadRouter } from "./modules/uploads/uploads.routes.js";
import { startTokenCleanupScheduler } from "./helpers/token-cleanup.js";
import path from "path";
import { notificacionXEmailRouter } from "./modules/notificacionesXEmail/notificacionXEmail.routes.js";
import { notificacionesCron } from "./core/cron-taeras/notificaciones.cron.js";

dotenv.config();

const app = express();
const PORT: number = Number(process.env.PORT) || 4000;
const RAIZ: string = "/api/v1";

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(`${RAIZ}/auth`, authRouter);
app.use(`${RAIZ}/uploads`, uploadRouter);
app.use(`${RAIZ}/administrativos`, administrativoRouter);
app.use(`${RAIZ}/asistencias`, asistenciaRouter);
app.use(`${RAIZ}/asistencia`, asistenciaRouter);
app.use(`${RAIZ}/cambios-plan-estudio`, cambioPlanEstudioRouter);
app.use(`${RAIZ}/carreras`, carreraRouter);
app.use(`${RAIZ}/ciclos-lectivos`, cicloLectivoRouter);
app.use(`${RAIZ}/comprobantes-alumnos`, comprobanteAlumnoRouter);
app.use(`${RAIZ}/correlatividades`, correlatividadRouter);
app.use(`${RAIZ}/cursos`, cursoRouter);
app.use(`${RAIZ}/designaciones-docentes`, designacionDocenteRouter);
app.use(`${RAIZ}/divisiones`, divisionRouter);
app.use(`${RAIZ}/divisiones-x-unidades-curriculares`, divisionXUnidadCurricularRouter);
app.use(`${RAIZ}/docentes`, docenteRouter);
app.use(`${RAIZ}/documentos-legajos`, documentoLegajoRouter);
app.use(`${RAIZ}/dossiers-institucionales`, dossierInstitucionalRouter);
app.use(`${RAIZ}/equivalencias`, equivalenciaRouter);
app.use(`${RAIZ}/estudiantes`, estudianteRouter);
app.use(`${RAIZ}/estudiantes-x-unidad-curricular`, estudianteXUnidadCurricularRouter);
app.use(`${RAIZ}/informacion-extra`, informacionExtraRouter);
app.use(`${RAIZ}/inscripciones-carreras`, inscripcionCarreraRouter);
app.use(`${RAIZ}/instancias-evaluativas`, instanciaEvaluativaRouter);
app.use(`${RAIZ}/legajos`, legajoRouter);
app.use(`${RAIZ}/legajos-x-instancias-evaluativas`, legajoXInstanciaEvaluativaRouter);
app.use(`${RAIZ}/mesas-examenes`, mesaExamenRouter);
app.use(`${RAIZ}/mesas-examenes-x-legajos`, mesaExamenXLegajoRouter);
app.use(`${RAIZ}/movimientos-financieros`, movimientoFinancieroRouter);
app.use(`${RAIZ}/notificaciones`, notificacionRouter);
app.use(`${RAIZ}/planes-estudios`, planEstudioRouter);
app.use(`${RAIZ}/preinscriptos`, preinscriptoRouter);
app.use(`${RAIZ}/recuperaciones-contrasenia`, recuperacionRouter);
app.use(`${RAIZ}/roles`, rolRouter);
app.use(`${RAIZ}/sesiones-usuarios`, sesionRouter);
app.use(`${RAIZ}/tipos-documentos-requeridos`, tipoDocumentoRouter);
app.use(`${RAIZ}/turnos-examenes`, turnoExamenRouter);
app.use(`${RAIZ}/unidades-curriculares`, unidadCurricularRouter);
app.use(`${RAIZ}/usuarios`, usuarioRouter);
app.use(`${RAIZ}/notificaciones-x-email`, notificacionXEmailRouter);

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: 200,
    msg: "App funcionando 🧑‍💻",
    url: `http://localhost:${PORT}`,
  });
});

app.use(errorHandler);

const main = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos exitosa!");
    
    await sequelize.sync({ force: false });
    
    startTokenCleanupScheduler();
    notificacionesCron();
    
    app.listen(PORT, () => {
      console.log(`🚀 App de asistencia corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

main();