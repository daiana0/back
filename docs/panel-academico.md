# Panel Académico por Asignación Docente

El Panel Académico dentro del Módulo Docente consolida y presenta la información de los alumnos inscriptos en una comisión (asistencia, calificaciones y condición académica), facilitando el seguimiento del rendimiento general del curso.

## Contrato de Respuesta del Endpoint

El endpoint consolidado responde en la ruta:
`GET /api/v1/docentes/asignaciones/:idDivisionXUnidadCurricular/panel-academico`

### Estructura de Respuesta (JSON)

```json
{
  "status": "success",
  "data": {
    "asignacion": {
      "idDivisionXUnidadCurricular": 15,
      "materia": "Programación III",
      "division": "3°A"
    },
    "evaluaciones": [
      {
        "id": 1,
        "descripcion": "Primer Parcial",
        "tipo": "parcial",
        "fecha": "2026-05-10",
        "promedio": 6.8
      },
      {
        "id": 2,
        "descripcion": "Segundo Parcial",
        "tipo": "parcial",
        "fecha": "2026-06-15",
        "promedio": null
      }
    ],
    "alumnos": [
      {
        "idLegajo": 1,
        "dni": "40111222",
        "apellido": "Perez",
        "nombre": "Juan",
        "condicion": "regular",
        "porcentajeAsistencia": 82,
        "asistenciaInsuficiente": false,
        "notas": {
          "1": 8,
          "2": null
        }
      }
    ],
    "estadisticas": {
      "totalAlumnos": 1,
      "totalEvaluaciones": 2,
      "totalClases": 10,
      "promocionados": 0,
      "regulares": 1,
      "libres": 0,
      "porcentajePromocionados": 0,
      "porcentajeRegulares": 100,
      "porcentajeLibres": 0,
      "porcentajeAsistenciaGeneral": 82
    },
    "meta": {
      "total": 1
    }
  }
}
```

## Reglas de Negocio e Implementación Backend

### 1. Validación y Control de Accesos (Controller)
1. **Validación del ID**: Se verifica el formato numérico del parámetro de ruta `:idDivisionXUnidadCurricular`.
2. **Existencia**: El servicio valida si la asignación existe en la base de datos. Si no existe, se responde inmediatamente con `404 Not Found`.
3. **Pertenencia (Seguridad)**: Se verifica que el docente autenticado sea el titular de la asignación consultada. Si no lo es, se retorna `403 Forbidden` (con excepción de usuarios con rol `ADMIN`).

### 2. Consolidación de Datos (Service)
- **Orden de Alumnos**: Listado por `apellido ASC, nombre ASC`.
- **Orden de Evaluaciones**: Ordenado cronológicamente por `fecha ASC, id ASC`.
- **Cálculo de Notas**: Las notas se asocian mediante un mapeo indexado directo (`{ "evaluacionId": nota }`), facilitando el renderizado dinámico en la tabla. Si hay notas duplicadas por registro posterior, se toma la última registrada (`fechaRegistro DESC`).
- **Promedio de Evaluaciones**: Promedio aritmético de las calificaciones numéricas de la comisión por examen (ignorando valores nulos). Si no se han cargado notas para una instancia, retorna `null`.
- **Asistencia**: Reutiliza las clases cargadas en el módulo de asistencia. Si `totalClases` es `0`, el porcentaje de asistencia general de la comisión y los individuales retornan `null` en lugar de `0%` para evitar mostrar información confusa.
- **Asistencia Insuficiente**: Se marca `asistenciaInsuficiente: true` si el porcentaje de asistencia del alumno es inferior al `75%`.

---

## Interfaz de Usuario y Lógica Frontend (SIGI-FRONT)

### 1. Elementos de Pantalla
- **Selector de Asignación**: Componente dropdown que carga dinámicamente las comisiones a cargo del docente y limpia todos los filtros y paginado al cambiar de asignación.
- **Buscador en Tiempo Real**: Permite filtrar localmente por Nombre, Apellido o DNI del alumno.
- **Filtro por Condición**: Filtro local para aislar alumnos en condición de *Promocionado*, *Regular* o *Libre*.
- **Alerta de Calificaciones Pendientes**: Un cartel informativo superior advierte si existen notas sin cargar (`null`) en las evaluaciones de la comisión.
- **Tabla Académica**: Contenedor adaptativo con scroll horizontal suave y los siguientes elementos:
  - Columnas fijas iniciales: `Alumno` (con avatar) y `DNI`.
  - Columnas dinámicas: Una por cada instancia evaluativa de la asignatura con un tooltip informativo de MUI que detalla el promedio de comisión, tipo y fecha de examen.
  - Columnas finales: `% Asistencia` (rojo si es insuficiente), `Promedio` (promedio ponderado del alumno) y `Condición` (chips de colores).
- **Paginación Local**: Componente de paginación de a 5 alumnos por página que se restablece automáticamente a la página `1` al realizar búsquedas o filtrar.
- **Estadísticas Destacadas**: KPIs de alumnos totales, cantidad y porcentajes de las distintas condiciones académicas, y un banner premium al pie que resalta la cantidad de clases dictadas y el promedio de asistencia general de la comisión.
