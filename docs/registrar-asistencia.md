# Documentación de Funcionalidad: Registrar Asistencia

## 1. Descripción General
La funcionalidad **Registrar Asistencia** permite al personal docente y administrativo de la institución registrar, editar y consultar el estado de presencia (`Presente` / `Ausente`) de los estudiantes inscriptos en una determinada **División por Unidad Curricular** (materia y comisión) para una fecha específica.

El sistema soporta tanto la asignación individual como la **carga masiva** (toma de asistencia diaria de todo el curso de manera unificada), garantizando que no se puedan registrar asistencias duplicadas para un mismo alumno en la misma fecha y materia.

---

## 2. Modelo de Datos (`Asistencia`)
El registro de asistencia se define mediante el modelo `Asistencia` en la base de datos relacional.

### Estructura de la Tabla (`asistencias`)

| Campo | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Auto-increment | Identificador único del registro de asistencia. |
| `id_division_x_unidad_curricular` | `INTEGER` | Foreign Key (tabla `divisiones_x_unidades_curriculares`), `allowNull: false` | Relación con la materia y comisión correspondiente. |
| `fecha` | `DATEONLY` | `allowNull: false` | Fecha en la cual se toma la asistencia (Formato `YYYY-MM-DD`). |
| `presente` | `BOOLEAN` | Default: `false` | Indica si el estudiante estuvo presente (`true`) o ausente (`false`). |
| `id_legajo` | `INTEGER` | Foreign Key (tabla `legajos`), `allowNull: false` | Relación con el legajo del estudiante. |
| `id_administrativo` | `INTEGER` | Foreign Key (tabla `administrativos`), `allowNull: false` | Identificador del administrativo o docente responsable del registro. |

### Restricciones de Integridad
* **Índice Único Colectivo (`un_asistencia_alumno_div_fecha`)**: 
  Se establece una restricción de unicidad compuesta sobre las columnas `(id_division_x_unidad_curricular, fecha, id_legajo)`. Esto previene de forma física en la base de datos que exista más de un registro de asistencia para un estudiante, en una materia y fecha específicas.

---

## 3. Endpoints de la API (Backend)

Todos los endpoints están expuestos bajo el prefijo `/api/v1/asistencias`.

### A. Consultar Asistencia por Comisión y Fecha
* **Endpoint**: `GET /asistencias/asignacion/:idDivisionXUnidadCurricular/fecha/:fecha`
* **Descripción**: Retorna el listado de todos los estudiantes inscriptos en la comisión y su estado de asistencia cargado para el día seleccionado.
* **Comportamiento**:
  * Si ya existen registros guardados en esa fecha, retorna un campo `"modo": "EDICION"` junto con el estado de asistencia de cada alumno (`true` o `false`).
  * Si no existen registros guardados, retorna `"modo": "CREACION"` y el estado `presente` de cada alumno en `null` para que el cliente pueda inicializar el formulario.
* **Restricción**: No se permite consultar ni registrar asistencia para fechas futuras (mayor a la fecha local actual).

### B. Registro y Actualización Masiva
* **Endpoint**: `POST /asistencias/masivo`
* **Descripción**: Registra o actualiza de forma atómica (en una transacción SQL) las asistencias de un grupo de estudiantes.
* **Payload (JSON)**:
  ```json
  {
    "idDivisionXUnidadCurricular": 12,
    "fecha": "2026-06-06",
    "asistencias": [
      { "idLegajo": 1, "presente": true },
      { "idLegajo": 2, "presente": false }
    ]
  }
  ```
* **Lógica del Servicio**:
  * Valida que no haya estados de asistencia nulos o indefinidos en la lista.
  * Valida que la fecha no sea futura.
  * Resuelve automáticamente el `idAdministrativo` responsable:
    * Si el usuario autenticado tiene el rol `ADMIN`, se usa su `userId`.
    * Si el usuario autenticado tiene el rol `DOCENTE`, se busca en base de datos su asignación para obtener el `idAdministrativo` asociado a su registro docente.
  * Si un registro ya existe para esa combinación, realiza un `UPDATE`. Si no existe, realiza un `CREATE`. Todo el bloque se ejecuta dentro de una transacción para evitar inconsistencias si ocurre algún fallo intermedio.

### C. Obtener Resumen de Estadísticas
* **Endpoint**: `GET /asistencias/resumen/:idDivisionXUnidadCurricular`
* **Descripción**: Calcula y retorna las estadísticas acumuladas de asistencia de los estudiantes inscriptos en una comisión.
* **Respuesta**: Un array de objetos con el siguiente formato:
  ```json
  {
    "status": "success",
    "data": [
      {
        "idLegajo": 1,
        "alumno": "López, Juan",
        "presentes": 15,
        "ausentes": 3,
        "porcentaje": 83.33
      }
    ]
  }
  ```

---

## 4. Reglas de Negocio Clave

1. **Restricción Temporal**: No se permite registrar asistencias correspondientes a días futuros.
2. **Completitud Obligatoria**: Al utilizar el método masivo, se debe proveer el estado de presencia de todos los estudiantes listados (no se admiten valores `null` o vacíos).
3. **Auditoría**: Cada registro guarda obligatoriamente el ID del administrativo o docente que realizó la última carga o modificación.
4. **Modificación Transaccional**: La edición masiva es segura contra fallos del sistema mediante el uso de transacciones gerenciadas por Sequelize, asegurando que se actualicen todos los alumnos o ninguno.
