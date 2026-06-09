# Documentación de Funcionalidad: Crear Instancia Evaluativa (Módulo Docente)

## 1. Descripción General
La funcionalidad **Crear Instancia Evaluativa** permite a los docentes registrar nuevas evaluaciones (parciales, trabajos prácticos, coloquios, exámenes finales, recuperatorios, o proyectos integradores) asociadas a una de sus **Asignaciones Docentes** activas (comisiones).

El docente selecciona una comisión, visualiza en tiempo real el historial de evaluaciones creadas para ella, completa un formulario con la descripción, tipo y fecha de la evaluación, y la registra.

---

## 2. Modelo de Datos (`InstanciaEvaluativa`)
Las instancias evaluativas se almacenan en la tabla `instancias_evaluativas` de la base de datos relacional.

### Estructura de la Tabla (`instancias_evaluativas`)

| Campo | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Auto-increment | Identificador único de la instancia evaluativa. |
| `id_division_x_unidad_curricular` | `INTEGER` | Foreign Key (tabla `divisiones_x_unidades_curriculares`), `allowNull: false` | Relación con la comisión y materia correspondiente. |
| `descripcion` | `STRING(255)` | `allowNull: false` | Nombre/Descripción de la evaluación (Ej: "Primer Parcial", "TP1"). |
| `fecha` | `DATE` | `allowNull: false` | Fecha programada para la evaluación (no anterior a hoy). |
| `tipo` | `ENUM` | `allowNull: false` | Tipo de instancia: `'trabajo practico'`, `'parcial'`, `'examen final'`, `'recuperatorio'`, `'coloquio'`, `'proyecto integrador'`. |
| `id_administrativo` | `INTEGER` | Foreign Key (tabla `administrativos`), `allowNull: false` | Administrativo o docente creador (resuelto internamente). |

---

## 3. Endpoints de la API (Backend)

### Crear Instancia Evaluativa para Docente
* **Endpoint**: `POST /instancias-evaluativas/docente`
* **Acceso**: Autenticado con Rol `DOCENTE` (o `ADMIN`).
* **Payload (JSON)**:
  ```json
  {
    "idDivisionXUnidadCurricular": 5,
    "descripcion": "Primer Parcial",
    "fecha": "2026-06-15",
    "tipo": "parcial"
  }
  ```
* **Lógica del Servicio y Controlador**:
  1. **Autenticación y Autorización (CA-02)**: Valida que el docente autenticado (`req.user.id`) posea una designación activa (`activo: true`) para la comisión (`idDivisionXUnidadCurricular`) provista. Si no la posee, retorna un código `403 Forbidden`.
  2. **Validación de Duplicados (CA-03)**: Valida que no exista otra instancia con el mismo nombre para esa misma comisión. La búsqueda es sensible a minúsculas/mayúsculas y normaliza espacios en blanco (ej: `"Primer  Parcial "` es equivalente a `"primer parcial"`). En caso de duplicado, retorna un código `409 Conflict` con el código de error `DUPLICATE_NAME`.
  3. **Tipos Permitidos**: Admite los 6 tipos definidos en el modelo de base de datos.
  4. **Resolución de ID Administrativo**: Si es un docente, busca el `idAdministrativo` asociado a su legajo en la base de datos y lo asigna de forma transparente.

---

## 4. Reglas de Negocio Clave

1. **Restricción de Fecha**: La fecha de la evaluación no puede ser anterior a la fecha actual (validado en el modelo mediante Zod y restricciones de Sequelize).
2. **Validación estricta de asignación**: El backend no confía en payloads de frontend y verifica la relación `DesignacionesDocente` activa en base de datos.
3. **Normalización de Nombres**: Se realiza un filtrado del texto del nombre removiendo espacios dobles/múltiples y aplicando trim para evitar burlar la validación de duplicados con variaciones de espacios en blanco.

---

## 5. Diseño de Interfaz (Frontend)

El flujo se implementa en la pantalla **NuevaInstanciaEvaluativaScreen.tsx** con una estructura de dos columnas adaptativas:

* **Columna Izquierda (Formulario)**:
  - **Selector de Asignación Docente**: Carga las asignaciones del docente. Conserva el título standard (`fontSize: '0.75rem'`, `fontWeight: 700`).
  - **Campos del Formulario**: Nombre de la evaluación, Tipo (selector con las 6 opciones), y Fecha (campo fecha con restricción de días anteriores deshabilitados).
  - **Botón de Acción**: Botón **"Crear Evaluación"** ubicado en el interior de la tarjeta de carga, alineado a la derecha de los campos de texto, con el estilo institucional, con una tilde en un círculo (`CheckCircleIcon`) y con las mismas proporciones de diseño del resto del sistema.
* **Columna Derecha (Historial)**:
  - **Panel de Historial**: Con fondo gris/blanco hielo y un título destacado (**HISTORIAL** en `0.85rem` y `fontWeight: 800`).
  - **Tarjetas de Evaluaciones**: Tarjetas blancas redondeadas que muestran el título de la evaluación (sin negrita, con `fontWeight: 500`) y debajo el tipo y la fecha formateada (ej. `Trabajo Práctico - 15/6/2026`).
  - **Botón de Historial Completo**: Ubicado al final del recuadro con borde punteado que redirige al docente al listado completo de calificaciones.
