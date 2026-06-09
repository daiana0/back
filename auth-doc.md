# Documentación del Sistema de Autenticación (Auth)

## Introducción

El módulo `auth` implementa un sistema de autenticación basado en **JWT (JSON Web Tokens)** con capacidad de invalidación inmediata de sesiones. Está diseñado para manejar múltiples tipos de usuarios (administrativos, docentes, estudiantes) que se autentican contra distintas tablas en la base de datos. A continuación, se detalla su estructura, flujo de funcionamiento (login y logout), los middlewares de seguridad asociados y las ventajas que ofrece.

## Estructura del módulo

Dentro de `modules/auth` se encuentran los siguientes componentes:

- **controller** (`auth.controller.ts`): maneja las peticiones HTTP (login, logout), valida datos de entrada y coordina la lógica.
- **dto** (`LoginDto.ts`): define la validación de los datos de entrada para el login usando **Zod**.
- **service** (`auth.service.ts`): contiene la lógica de negocio para autenticar usuarios (buscar en distintas entidades) y para cerrar sesión (añadir token a la lista negra).
- **model** (`TokenBlacklist.ts`): modelo Sequelize para la tabla `token_blacklist`, donde se almacenan los tokens revocados.
- **routes** (`auth.routes.ts`): define las rutas `/login` y `/logout`, aplicando el middleware `validateJwt` solo en el logout.

Además, se complementa con middlewares globales:

- `validate-jwt.middleware.ts`: verifica la validez y vigencia del token JWT, y comprueba si está en la lista negra.
- `validate-role.middleware.ts`: restringe el acceso a rutas según el rol del usuario.
- `error-handler.middleware.ts`: maneja errores de forma centralizada mediante la clase `AppError`.

## Flujo de Login

1. **Validación de entrada**  
   El controlador recibe `req.body` y lo valida con `LoginDto.safeParse`.  
   `LoginDto` exige un objeto con:

   - `email`: string con formato de email válido.
   - `contrasenia`: string no vacío.  
     Si la validación falla, se responde con un error `400` detallando los campos inválidos.

2. **Autenticación del usuario**  
   Si los datos son válidos, se llama a `authService.login({ email, password })`.  
   El servicio busca secuencialmente en tres entidades:

   - **Administrativo**: incluye el rol asociado (`Rol`).
     - Solo permite login si el rol es `ADMIN` o `RECTOR` (definidos en `role.enum`).
     - Verifica la contraseña usando el método `validarContrasenia` propio del modelo.
   - **Docente**: verifica la contraseña; si es válida, devuelve el usuario con rol `DOCENTE`.
   - **Usuario** (estudiantes): verifica la contraseña; si es válida, devuelve el usuario con rol `ESTUDIANTE`.  
     En cada caso se incluye `entityType` (`'ADMINISTRATIVO'`, `'DOCENTE'` o `'USUARIO'`), que identifica la tabla de origen.

3. **Generación del JWT**  
   Si el servicio retorna un usuario (`AuthenticatedUser`), el controlador:

   - Genera un **JWT ID único** (`jti`) mediante `crypto.randomUUID()`.
   - Construye el payload con: `id`, `email`, `rol`, `entityType`, `jti`.
   - Obtiene el tiempo de expiración de la variable de entorno `JWT_EXPIRES_IN` (por defecto 8 horas).
   - Firma el token con `JWT_SECRET` (o una clave provisional si no está definida).
   - Responde con status `200`, el token y los datos básicos del usuario.

4. **Respuesta exitosa**
   ```json
   {
     "status": "success",
     "token": "eyJhbGciOi...",
     "user": {
       "id": 1,
       "nombre": "Juan",
       "apellido": "Pérez",
       "email": "juan@example.com",
       "rol": "ADMIN"
     }
   }
   ```

## Uso del Token, Logout y Middlewares

## Uso del token en peticiones

El token debe enviarse en las peticiones subsiguientes como `Authorization: Bearer <token>`.

## Flujo de Logout

### Ruta protegida

- El logout requiere un token válido, por lo que la ruta `/logout` aplica primero el middleware `validateJwt`.
- Este middleware decodifica el token, verifica que no esté en la lista negra y agrega el payload (incluyendo `jti` y `exp`) al objeto `req.user`.

### Invalidación del token

- El controlador `logout` extrae `jti` y `exp` de `req.user`. Si no existen, responde con error `400` (token inválido).
- Llama a `authService.logout(jti, exp)`, que inserta un registro en la tabla `token_blacklist` con el `jti` y la fecha de expiración (convertida de timestamp Unix a `Date`).

### Respuesta

- Se responde con `200` y un mensaje de éxito.
- A partir de ese momento, el token es rechazado por el middleware `validateJwt` en cualquier petición posterior porque se encuentra en la lista negra.

## Middleware de validación de JWT (`validateJwt`)

Este middleware se encarga de:

- Extraer el token del header `Authorization` (formato `Bearer <token>`).
- Verificar la firma y la expiración con `jwt.verify`.
- Buscar el `jti` del token en la tabla `token_blacklist`: si existe, el token ha sido revocado y la petición se rechaza con `401`.
- Si todo es válido, enriquece `req.user` con los datos del payload (`id`, `email`, `rol`, `entityType`, `jti`, `exp`) para que los siguientes middlewares o controladores puedan usarlos.

## Middleware de validación de roles (`validateRole`)

- Función de orden superior que recibe una lista de roles permitidos.
- Comprueba que `req.user` exista y que su `rol` esté entre los roles permitidos.
- Si no tiene el rol adecuado, responde con `403` (Acceso no autorizado para este rol).
- Es útil para proteger rutas según el tipo de usuario, por ejemplo: `validateRole(Role.ADMIN, Role.RECTOR)`.

## Ventajas del sistema de autenticación

### Seguridad robusta

- Uso de JWT con firma secreta, evitando almacenar sesiones en el servidor.
- Invalidación inmediata de sesiones mediante la lista negra (`token_blacklist`), lo que permite cerrar sesión en cualquier momento y evitar el uso de tokens aunque no hayan expirado.
- Cada token tiene un identificador único (`jti`) que garantiza trazabilidad.

### Flexibilidad multi-entidad

- Soporta autenticación para múltiples tipos de usuarios (administrativos, docentes, estudiantes) que pueden residir en tablas separadas con distintas estructuras.
- El campo `entityType` permite saber desde qué entidad se autenticó el usuario, facilitando auditorías o reglas de negocio posteriores.

### Validación de datos de entrada

- Uso de Zod para validar el cuerpo de la petición de login, lo que asegura que solo datos bien formados lleguen al servicio, reduciendo errores y ataques de inyección.

### Centralización y claridad

- La lógica de autenticación está encapsulada en un módulo con separación de responsabilidades (controller, service, model, dto, routes).
- Los middlewares de seguridad (`validateJwt`, `validateRole`) están desacoplados y se pueden reutilizar en cualquier ruta de la aplicación.

### Manejo consistente de errores

- El sistema utiliza `AppError` para lanzar errores con códigos de estado específicos (`401`, `403`, etc.) que son capturados por un middleware de errores global, garantizando respuestas uniformes.

### Configuración externalizada

- Las variables `JWT_SECRET` y `JWT_EXPIRES_IN` se toman de variables de entorno, lo que permite modificar la seguridad y la duración del token sin cambiar el código.

### Rendimiento y escalabilidad

- La validación de tokens contra la lista negra solo ocurre si el token tiene un `jti`, y se realiza mediante una consulta rápida a la base de datos. Para mejorar aún más el rendimiento, se podría migrar a una caché (Redis) en el futuro.
- Al ser JWT stateless, el sistema escala horizontalmente sin necesidad de compartir estado de sesión entre instancias.

### Traza y auditoría

- El uso de `jti` y la tabla de blacklist permite saber exactamente qué tokens fueron revocados, cuándo y por qué (logout), facilitando análisis de seguridad.

### Fácil extensión

- Agregar un nuevo tipo de usuario (por ejemplo, "visitante") solo requiere añadir una nueva búsqueda en `authService.login` y un nuevo rol en el enum.
- La estructura modular permite añadir más funcionalidades (refresh tokens, restablecimiento de contraseña, etc.) sin afectar el código existente.

### Protección de rutas granular

- El middleware `validateRole` permite proteger endpoints según roles específicos, garantizando que solo usuarios autorizados accedan a determinadas funcionalidades.
