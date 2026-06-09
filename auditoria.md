# Informe de auditoría — backend SIGI v002

Fecha: 2026-05-11
Alcance: revisión del README contra el código real (`src/`, `mock/`, `package.json`, `tsconfig.json`) — estructura, controladores, modelos, DTOs, rutas, middlewares y helpers.

---

## 1. Lo que está OK (cumple el README)

### Stack y configuración base
- `package.json` declara Express 5, Sequelize, mysql2, zod, bcrypt, morgan, dotenv y tsx; coincide con el README.
- `src/config/database/configDataBase.ts` lee las variables `DB_NAME`, `DB_USER_M`, `DB_PASSWORD`, `DB_HOST`, `DB_DIALECT_M` desde `.env` y tira excepción si falta alguna.
- `src/index.ts` registra todas las rutas bajo `/api/v1`, expone `GET /health`, monta `errorHandler` al final y ejecuta `sequelize.sync({ force: false })`.

### Capa core
- `core/constants/http.status.ts`, `core/enums/role.enum.ts` (4 roles: ADMIN/DOCENTE/ESTUDIANTE/RECTOR) y los 3 middlewares (`error-handler`, `validate-jwt`, `validate-role`) están presentes y se comportan como dice el README.
- `error-handler.middleware.ts` distingue `AppError`, `ZodError`, `ValidationError`, `UniqueConstraintError`, `ForeignKeyConstraintError`, `SequelizeBaseError` y fallback 500.

### Arquitectura por capas
- Los 35 módulos en `src/modules/` tienen las 4 subcarpetas `controller/`, `dto/`, `model/`, `service/` y un archivo `*.routes.ts` en la raíz del módulo.
- DTOs con Zod (`Create*Dto` + `Update*Dto = Create*Dto.partial()`), controllers que hacen `safeParse` y delegan al service, services con `findAndCountAll` y meta paginada `{ total, page, limit, totalPages }`.
- Modelos `Administrativo`, `Docente` y `Usuario` tienen hooks `beforeValidate` / `beforeCreate` / `beforeUpdate` con bcrypt (10 saltos), tal como dice el README.
- Las asociaciones `belongsTo` / `hasMany` están centralizadas en `src/modules/index.ts`.
- `mock/demoSigi.sql` existe (18 KB) con `SET FOREIGN_KEY_CHECKS = 0/1` y placeholder `USE NombreDeTuBaseDeDatos`.

---

## 2. Inconsistencias y desvíos del README

### Críticos

1. **`mesaExamenXLegajo/mesaExamenXLegajo.routes.ts` no tiene `validateJwt` ni `validateRole`** — es el único router sin middlewares de seguridad. El README promete "JWT (+ ADMIN)" para `/mesas-examenes-x-legajos`.
2. **Las contraseñas SÍ se devuelven en Docente y Usuario**. El README afirma "Las contraseñas nunca se devuelven en las respuestas". Solo `administrativos/service/administrativo.service.ts` usa `attributes: { exclude: ['contrasenia'] }`. `docente.service.ts` y `usuario.service.ts` no excluyen el campo.
3. **Colisión de nombres de router**: `mesasExamenes/mesa-examen.routes.ts` y `mesaExamenXLegajo/mesaExamenXLegajo.routes.ts` ambos exportan `mesaExamenRouter` (`src/index.ts:31-32` se ve forzado a renombrar con alias). Renombrar a `mesaExamenXLegajoRouter`.
4. **`mesaExamenController.getAll` rompe el formato de paginación uniforme** — devuelve `meta: { page, limit }` sin `total` ni `totalPages`, y no pasa `page/limit` al service (`mesasExamenes/controller/mesaExamen.controller.ts:14-20`). El service sí soporta paginación correcta.

### Menores

5. **`usuarios/controller/usuario.controller.ts` duplica `respondZodError` y `parsePagination`** localmente en vez de importar los helpers (lo hacen bien todos los demás controllers).
6. **`auth.controller.ts` (usuarios) es código muerto** — define `authController.login` con JWT real (`jsonwebtoken`), pero nadie lo importa ni registra ruta de login. O se elimina o se monta como `POST /auth/login`.
7. **`correlatividad.routes.ts` usa `export default router`** mientras todos los demás usan `export const xxxRouter` (no rompe nada, pero rompe convención).
8. **Campos PascalCase en `MesaExamen`**: `IdTurnoExamen`, `IdUnidadCurricular` (resto del proyecto usa camelCase: `idDocentePresidente`, `idLegajo`, etc.). Renombrar a `idTurnoExamen` / `idUnidadCurricular`.
9. **Naming de carpetas mezclado**: conviven `camelCase` (`cambioPlanEstudio`, `mesasExamenes`), `kebab-case` (`ciclo-lectivos`, `turnos-examenes`) y `snake_case` (`planes_estudios`, `unidades_curriculares`). Funcionar funciona, pero no es coherente.
10. **README desactualizado vs realidad**:
    - El README dice "más de 25 módulos" — en realidad hay **35**.
    - La tabla de endpoints **no documenta 9 recursos** que sí están registrados: `/cambios-plan-estudio`, `/comprobantes-alumnos`, `/divisiones-x-unidades-curriculares`, `/dossiers-institucionales`, `/estudiantes-x-unidad-curricular`, `/informacion-extra`, `/inscripciones-carreras`, `/legajos`, `/turnos-examenes`.
    - El árbol del README usa `asistencias/` (plural) cuando la carpeta real es `asistencia/` (singular).

---

## 3. Recomendaciones priorizadas

1. Agregar `validateJwt` + `validateRole(Role.ADMIN)` a `mesaExamenXLegajo.routes.ts`.
2. Agregar `attributes: { exclude: ['contrasenia'] }` en los `getAll` / `getById` de `docente.service.ts` y `usuario.service.ts`.
3. Arreglar la paginación de `mesaExamenController.getAll` para usar el patrón estándar `{ status, data, meta: { total, page, limit, totalPages } }`.
4. Renombrar `mesaExamenRouter` en `mesaExamenXLegajo` a `mesaExamenXLegajoRouter` para eliminar el alias en `index.ts`.
5. Decidir qué hacer con `auth.controller.ts`: eliminarlo o montar `POST /api/v1/auth/login` (ya está casi todo hecho).
6. Actualizar README: completar la tabla de endpoints con los 9 recursos faltantes, ajustar el "25+" a "35", corregir nombres del árbol de carpetas.
7. Unificar convenciones: nombres de carpetas (recomendado `kebab-case` en todas), camelCase en columnas de modelo (`MesaExamen`), y named exports en todos los routers.

---

## 4. Resumen ejecutivo

El backend respeta la arquitectura por capas descrita en el README en los 35 módulos. Los puntos sólidos son: validación con Zod, manejo centralizado de errores, paginación uniforme en la mayoría de los servicios, hashing con bcrypt y separación clara entre routes/controller/service/dto/model.

Los hallazgos críticos son **4** y afectan principalmente a seguridad (mesa-examen-x-legajo sin auth, contraseñas devueltas) y consistencia (colisión de nombres y paginación inconsistente en mesa-examen). Todos son arreglos puntuales y de bajo riesgo.

---

## 5. Correcciones aplicadas a BUG-006, BUG-007 y BUG-008

### BUG-006 - `POST /auth/login` con body vacío
- Se agregó una validación explícita al inicio de `authController.login` para rechazar requests sin body.
- Respuesta: `400 Bad Request` con el mensaje `El body no puede estar vacío.`

### BUG-007 - `POST /auth/login` sin contraseña
- Se validó que `email` y `contrasenia` sean obligatorios antes de consultar la base.
- Respuesta: `400 Bad Request` con el mensaje `Email y contraseña son obligatorios.`

### BUG-008 - Acceso a rutas protegidas con token inválido o manual
- `validateJwt` dejó de simular autenticación y ahora verifica el JWT real con `jwt.verify`.
- El login ahora firma el token con `id`, `email` y `rol`, tomando el rol desde la relación `Usuario -> Administrativo -> Rol`.
- Si el token no existe, no tiene formato Bearer, está alterado o expiró, se responde con `401 Unauthorized`.

### Resultado
- Los errores de entrada del login ya no terminan en `500`.
- Las rutas protegidas ya no aceptan tokens inventados manualmente.
- `validateRole` sigue funcionando porque `req.user.rol` ahora se carga desde el JWT verificado.
