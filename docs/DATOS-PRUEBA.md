# Datos de prueba — SIGI Backend

Guía para **limpiar la base de datos** y **cargar registros de prueba** con el script [`scripts/db-setup.ts`](../scripts/db-setup.ts).

El seed inserta **3 registros por tabla** en orden de dependencias (FK), con datos coherentes para probar login, legajos, calificaciones, mesas, finanzas y admisión.

## Requisitos

1. MySQL en ejecución.
2. Archivo `.env` en `SIGI-BACK` con:

```env
DB_HOST=localhost
DB_USER_M=root
DB_PASSWORD=tu_password
DB_NAME=sigi_db
```

3. Dependencias instaladas:

```bash
cd SIGI-BACK
npm install
```

## Comandos

### Limpiar y recrear todo (recomendado)

Borra todas las tablas, las recrea desde los modelos Sequelize e inserta los datos de prueba:

```bash
cd SIGI-BACK
npm run db:reset
```

Equivale a `SEED_FORCE=true` + `sequelize.sync({ force: true })` + seed.

### Primera vez (BD no existe)

```bash
cd SIGI-BACK
npm run db:setup
```

Crea la base de datos si no existe, sincroniza el schema e inserta datos.

### Solo insertar datos (sin borrar tablas)

```bash
cd SIGI-BACK
npm run db:seed
```

**Advertencia:** fallará si ya hay filas que violan unicidad (email, DNI, número de legajo, etc.). Usá `db:reset` para empezar limpio.

### Preservar tablas existentes (sync sin force)

```bash
cd SIGI-BACK
cross-env SEED_FORCE=false npm run db:setup
```

Sincroniza sin dropear; útil solo si el schema ya coincide y las tablas están vacías.

## Excepciones al criterio “3 por tabla”

| Tabla | Registros | Motivo |
| ----- | --------- | ------ |
| `roles` | 4 | Catálogo fijo: `ADMIN`, `DOCENTE`, `ESTUDIANTE`, `RECTOR` |
| `notificacion_x_email` | 0 | Se llena en runtime al enviar emails |
| `token_blacklist` | 0 | Se llena en runtime al hacer logout |

**Impacto de las tablas vacías:**

- **Login y sesiones:** funcionan con normalidad. `token_blacklist` solo bloquea JWT ya revocados (tras logout).
- **Notificaciones in-app:** la tabla `notificaciones` sí tiene 3 registros. `notificacion_x_email` es independiente (cola de correo).

## Contraseñas y hashing

En el script se escriben contraseñas en **texto plano**. Los modelos Sequelize las hashean con **bcrypt** en hooks `beforeCreate` / `beforeUpdate`:

- `Administrativo`
- `Docente`
- `Usuario`

**Importante:** usar siempre `Model.create()` para esas entidades (no `bulkCreate`), para que corran los hooks.

En la base de datos verás hashes bcrypt; para iniciar sesión usá las contraseñas en claro de la tabla siguiente.

## Credenciales de login

Endpoint: `POST /api/v1/auth/login`

Body JSON:

```json
{
  "email": "usuario@ejemplo.com",
  "contrasenia": "Contraseña123!",
  "rol": "ESTUDIANTE"
}
```

Valores de `rol`: `ADMINISTRATIVO` | `DOCENTE` | `ESTUDIANTE` | `USUARIO`

### Administrativos (`rol: "ADMINISTRATIVO"`)

| Email | Contraseña | Rol en BD |
| ----- | ---------- | --------- |
| `maria.gomez@instituto.edu` | `Admin1234!` | ADMIN |
| `carlos.perez@instituto.edu` | `Admin1234!` | RECTOR |
| `laura.rios@instituto.edu` | `Admin1234!` | ADMIN |

### Docentes (`rol: "DOCENTE"`)

| Email | Contraseña |
| ----- | ---------- |
| `lucia.martinez@instituto.edu` | `Docente1234!` |
| `roberto.suarez@instituto.edu` | `Docente1234!` |
| `patricia.vega@instituto.edu` | `Docente1234!` |

### Estudiantes (`rol: "ESTUDIANTE"`)

La contraseña está en la tabla `usuarios` (vinculada por `estudiantes.idUsuario`). El email debe coincidir entre `estudiantes` y `usuarios`.

| Email | Contraseña |
| ----- | ---------- |
| `juan.lopez@correo.com` | `Segura1234!` |
| `ana.martinez@correo.com` | `Segura1234!` |
| `pedro.fernandez@correo.com` | `Segura1234!` |

### Usuarios genéricos (`rol: "USUARIO"`)

Mismos emails y contraseñas que los estudiantes (son registros de `usuarios`). El rol en el body del login distingue el flujo.

| Email | Contraseña |
| ----- | ---------- |
| `juan.lopez@correo.com` | `Segura1234!` |
| `ana.martinez@correo.com` | `Segura1234!` |
| `pedro.fernandez@correo.com` | `Segura1234!` |

## Escenarios útiles incluidos en el seed

- **Ana Martínez:** inscripta en `division_x_uc` de la 2.ª división (condición `libre`) con nota **6** en el parcial de esa misma división — coherente para probar calificaciones en el front.
- **Juan López:** inscripto en división 1, nota 8, mesa de examen `ausente`.
- **Pedro Fernández:** legajo en plan TSD, nota 7 en Bases de Datos.
- **3 carreras:** TSP, TSD, TSAS con planes, ciclos, documentación y preinscriptos.
- **Ciclos lectivos:** años 2026 (TSP, activo), 2025 (TSD) y 2024 (TSAS) — el campo `anio` es único en toda la tabla.
- **Instancias evaluativas:** fecha dinámica (hoy + 7 días) para cumplir validación del modelo.

## Verificación rápida

Con el servidor en marcha (`npm run dev`):

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"ana.martinez@correo.com\",\"contrasenia\":\"Segura1234!\",\"rol\":\"ESTUDIANTE\"}"
```

Deberías recibir un JWT y datos del usuario.

## Limpieza manual (alternativa)

Si preferís no usar el script:

```sql
DROP DATABASE sigi_db;
CREATE DATABASE sigi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Luego ejecutá `npm run db:setup` o `npm run db:reset`.
