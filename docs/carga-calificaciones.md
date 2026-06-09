# Documentación de Funcionalidad: Carga de Calificaciones

## 1. Descripción General
La funcionalidad **Carga de Calificaciones** permite al personal docente y administrativo registrar, modificar y consultar las calificaciones numéricas obtenidas por los estudiantes inscriptos en una comisión para una determinada **Instancia Evaluativa** (exámenes parciales, trabajos prácticos, coloquios, etc.).

El sistema soporta una grilla de carga y actualización masiva por evaluación, lo que permite guardar de forma unificada las notas de todo el curso de manera segura y auditable.

---

## 2. Modelo de Datos (`LegajoXInstanciaEvaluativa`)
Las calificaciones individuales de los alumnos se registran en la tabla relacional intermedia que conecta cada instancia evaluativa con los legajos de los estudiantes.

### Estructura de la Tabla (`legajos_x_instancias_evaluativas`)

| Campo | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id_instancia_evaluativa` | `INTEGER` | Primary Key, Foreign Key (`instancias_evaluativas`), `allowNull: false` | Relación con la evaluación creada. |
| `id_legajo` | `INTEGER` | Primary Key, Foreign Key (`legajos`), `allowNull: false` | Relación con el legajo del estudiante. |
| `nota` | `INTEGER` | `allowNull: true` (rango 1 a 10) | Calificación numérica del estudiante. Si es `null`, indica que no posee calificación. |
| `fecha_registro` | `DATEONLY` | `allowNull: false` | Fecha en la que se grabó o modificó la nota. |
| `id_administrativo` | `INTEGER` | Foreign Key (`administrativos`), `allowNull: false` | Identificador del administrativo o docente que registró la nota. |

---

## 3. Seguridad y Control de Acceso
Para impedir que un docente consulte o altere notas de alumnos en asignaturas que no tiene a su cargo:
1. Al recibir una petición, el backend recupera los datos de la **Instancia Evaluativa** seleccionada y extrae su `idDivisionXUnidadCurricular`.
2. Si el rol del usuario autenticado es `DOCENTE`, se valida mediante `docenteService.getMeAsignaciones(userId)` que posea asignada esa comisión.
3. Si el docente no está asignado a esa comisión específica, el sistema interrumpe la ejecución del controlador y responde con un código **`403 Forbidden`** (Acceso denegado).

---

## 4. Endpoints del Backend

Todos los endpoints están expuestos bajo el prefijo `/api/v1/instancias-evaluativas`.

### A. Consultar Calificaciones por Evaluación
* **Endpoint**: `GET /:idInstanciaEvaluativa/calificaciones`
* **Descripción**: Retorna la lista de estudiantes inscriptos en la comisión y sus respectivas calificaciones registradas para esa evaluación específica.
* **Comportamiento**:
  - Cruza los datos de inscripción (`EstudianteXUnidadCurricular`) con la tabla de calificaciones (`LegajoXInstanciaEvaluativa`).
  - Si un estudiante no tiene nota registrada, el backend devuelve su campo `nota` en `null` para que la grilla del frontend muestre el casillero en blanco.

### B. Registro y Guardado Masivo
* **Endpoint**: `POST /:idInstanciaEvaluativa/calificaciones`
* **Descripción**: Guarda o actualiza de manera masiva y atómica las notas de los alumnos para la evaluación indicada.
* **Esquema de Validación (Zod)**:
  El payload es verificado por el DTO `GuardarCalificacionesDto`:
  * `calificaciones`: Array de objetos que contienen:
    * `idLegajo`: Entero positivo (obligatorio).
    * `nota`: Entero entre 1 y 10 (o `null` para remover una calificación cargada previamente).
* **Lógica del Servicio (Transaccional)**:
  La operación se realiza bajo una **transacción SQL** de Sequelize para garantizar atomicidad (se guardan todas las notas o ninguna):
  1. Identifica el usuario responsable de la carga. Si es rol `DOCENTE`, asocia el `idAdministrativo` correspondiente a su legajo.
  2. Itera sobre cada registro del payload:
     - **Caso Nota = `null`**: Si el alumno tiene una nota guardada anteriormente en base de datos, el registro correspondiente en la tabla se elimina (`destroy`).
     - **Caso Nota $\ge 1$ y $\le 10$**:
       * Si ya existía una nota previa, se actualiza (`update`) con el nuevo valor, la fecha de registro actual y el ID del responsable de la auditoría.
       * Si no existía una nota previa, se inserta (`create`) el nuevo registro.
  3. Si todos los elementos se procesan con éxito, se realiza un `commit` de la transacción. Si hay un fallo, se ejecuta un `rollback` completo.

---

## 5. Diseño y Flujo en el Frontend

La pantalla **CalificacionesDocenteScreen.tsx** interactúa con este flujo:
1. **Grilla de Carga**: Muestra la lista de alumnos inscriptos con inputs editables de entrada de notas numéricas.
2. **Validación del Lado del Cliente**: Controla que las notas ingresadas estén dentro del rango válido (1 al 10) y que no se ingresen caracteres no numéricos o decimales.
3. **Persistencia Unificada**: Al presionar "Guardar", se envía el listado consolidado al endpoint masivo del backend, actualizando la base de datos de manera atómica y segura.
