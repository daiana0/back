# Documentación de Funcionalidad: Historial de Asistencia (Módulo Docente)

## 1. Descripción General
La funcionalidad **Historial de Asistencia** permite a los docentes consultar el histórico detallado de asistencias de sus comisiones asignadas, filtrado por mes y con estadísticas agregadas.

El objetivo principal es brindar visibilidad sobre el presentismo del curso, permitiendo buscar alumnos por nombre, apellido o DNI, y detectar de forma temprana a aquellos estudiantes cuyo porcentaje de asistencia se encuentre por debajo del mínimo institucional requerido (75%).

---

## 2. Lógica de Negocio y Fórmulas Clave

### A. Clases Dictadas (Período)
Se define como la **cantidad de fechas únicas con registros de asistencia** cargados para la comisión en el mes seleccionado.
* No se cuentan los registros individuales de alumnos.
* Una fecha solo se considera clase dictada si existe al menos un registro de asistencia guardado en ella.

### B. Porcentaje de Asistencia Individual
Indica el presentismo de un alumno en el período de consulta:
$$\text{Porcentaje Individual} = \frac{\text{Total de Asistencias Presentes del Alumno}}{\text{Total de Clases Dictadas en el Período}} \times 100$$

### C. Condición del Alumno (Estado)
* **Regular**: Porcentaje de asistencia individual $\ge 75\%$.
* **En riesgo**: Porcentaje de asistencia individual $< 75\%$.

### D. Porcentaje General de la Comisión
Representa el presentismo consolidado del curso completo en el período de consulta, calculado mediante:
$$\text{Porcentaje General} = \frac{\text{Total de Asistencias Presentes de toda la Comisión}}{\text{Total de Clases Dictadas} \times \text{Cantidad de Alumnos Inscriptos}} \times 100$$
*(Nota: No se calcula promediando los porcentajes individuales para evitar desvíos aritméticos).*

### E. Interpretación de Registros Faltantes
Dado que la carga de asistencia en el sistema se realiza de forma masiva y unificada para todos los alumnos inscriptos de la comisión, la ausencia de un registro individual para un alumno en una fecha con clases dictadas se interpreta automáticamente como **Ausente** (`presente = false`).

---

## 3. Seguridad y Validación de Pertenencia
Para garantizar que un docente no pueda consultar el historial de comisiones ajenas (incluso manipulando la URL o la petición HTTP):
1. El backend expone un validador en base de datos directo a través del método `docenteService.validarPertenenciaDocente(userId, idDivisionXUnidadCurricular)`.
2. Realiza una consulta `COUNT` en la tabla intermedia de asignaciones activas asociando el ID de usuario del docente logueado con el ID de la comisión consultada.
3. Si el contador retorna 0 (y el usuario no posee rol de Administrador), el backend bloquea la petición inmediatamente con un código `403 Forbidden`.

---

## 4. Endpoints del Backend

### A. Listar Asignaciones Docentes
* **Endpoint**: `GET /api/v1/docentes/me/asignaciones`
* **Descripción**: Retorna las materias y comisiones activas asignadas al docente autenticado para poblar el selector inicial de la pantalla.

### B. Obtener Resumen Histórico Mensual
* **Endpoint**: `GET /api/v1/asistencias/resumen/:idDivisionXUnidadCurricular`
* **Query Params**:
  * `mes` (Requerido, formato `YYYY-MM`, ej: `2026-06`): Filtra el rango de fechas en la base de datos desde el día 1 hasta el último día del mes.
* **Lógica del Endpoint**:
  * Realiza la validación de pertenencia docente.
  * Obtiene todos los alumnos inscriptos en la comisión.
  * Realiza un filtrado por fechas utilizando `Op.between` entre los límites del mes provisto.
  * Agrupa y calcula los totales individuales y colectivos de asistencia.
* **Payload de Respuesta (JSON)**:
  ```json
  {
    "status": "success",
    "data": {
      "resumenComision": {
        "totalClases": 8,
        "porcentajeGeneral": 82.5,
        "alumnosDebajoMinimo": 2
      },
      "alumnos": [
        {
          "idLegajo": 5,
          "nombre": "Juan",
          "apellido": "Pérez",
          "dni": "42111222",
          "porcentajeAsistencia": 87.5,
          "asistencias": [
            { "fecha": "2026-06-01", "presente": true },
            { "fecha": "2026-06-03", "presente": true },
            { "fecha": "2026-06-08", "presente": false }
          ]
        }
      ]
    }
  }
  ```

---

## 5. Diseño y Flujo en el Frontend

La pantalla **HistorialAsistenciaDocenteScreen.tsx** implementa la siguiente lógica de visualización:
1. **Selector de Asignación y Mes**: Permite navegar mes a mes con botones direccionales. Inicializa por defecto en el mes y año actual en curso.
2. **Buscador de Alumnos**: Filtro local interactivo por nombre, apellido o DNI. Normaliza caracteres especiales (ignora acentos y mayúsculas) y muestra un mensaje de alerta si ningún registro coincide.
3. **Tabla Histórica Dinámica**:
   - Columnas para el Nombre (con indicador de estado *Regular* o *En riesgo*), DNI, % de Asistencia, y una columna delgada por cada fecha de clase dictada.
   - Filas pintadas con fondo rojo claro para los alumnos en riesgo.
4. **Recuadro de Resumen Mensual**:
   - Ubicado debajo de las referencias en un contenedor destacado de fondo claro (`surfaceLight`).
   - Muestra un texto analítico que compara la asistencia general con el 75% institucional (*"La asistencia promedio del curso en el mes de [mes] se mantiene un [X]% por [encima/debajo] del promedio institucional"*).
   - Contiene 3 tarjetas blancas destacadas con los KPIs generales: **Porcentaje General**, **Alumnos en Riesgo** y **Clases Dictadas**.
