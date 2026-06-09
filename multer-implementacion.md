Implementación de Subida Centralizada de Archivos
Se ha implementado el módulo genérico para manejar la subida de archivos (imágenes y PDFs) requerida por el sistema (Preinscriptos, Documentos de Legajo, Dossiers, etc).

🚀 Cambios Realizados
Instalación de Dependencias:

Se agregaron las librerías multer y @types/multer.
Directorio Base:

Se creó la carpeta uploads/ en la raíz del proyecto para guardar localmente los archivos.
Se agregó un .gitignore en dicha carpeta para que el repositorio ignore los archivos subidos, manteniendo la estructura mediante .gitkeep.
Middleware de Multer (src/core/middlewares/upload.middleware.ts):

Configurado con diskStorage para organizar los archivos automáticamente en subcarpetas dinámicas según el tipo de entidad (ej: uploads/preinscriptos/).
Se programó un validador que solo permite imágenes (JPG, JPEG, PNG) y documentos en PDF.
Se incluyó protección contra sobreescrituras generando nombres únicos con crypto.randomUUID().
Se estableció un límite estricto de tamaño de 5 MB por archivo.
Módulo de Uploads:

Se creó UploadController que construye dinámicamente la URL completa (http://localhost:PUERTO/uploads/carpeta/archivo.extensión).
Se habilitó la ruta POST /api/v1/uploads/:tipo. Esta ruta valida el token JWT, por lo que solo usuarios o alumnos autenticados pueden subir archivos.
Exposición en Express (src/index.ts):

Se configuró la carpeta estática para que los archivos guardados en uploads/ puedan ser leídos y mostrados en el frontend simplemente accediendo a su URL.
Se registró el nuevo enrutador de uploads.
🛠 ¿Cómo usarlo en el Frontend?
A partir de ahora, cuando un Preinscripto necesite subir un PDF con su título analítico, el frontend debe hacer lo siguiente:

Subir el archivo al nuevo endpoint, indicando la subcarpeta deseada:

http
POST /api/v1/uploads/preinscriptos
Authorization: Bearer <token>
Content-Type: multipart/form-data
(body con el campo "archivo": file)
El backend responderá con la información y URL del archivo guardado:

json
{
  "status": "success",
  "message": "Archivo subido correctamente",
  "data": {
    "url": "http://localhost:4000/uploads/preinscriptos/1234-abcd.pdf",
    "filename": "1234-abcd.pdf",
    "mimetype": "application/pdf",
    "size": 1048576
  }
}
El frontend toma ese string de la url y lo manda en su petición JSON original (como ya venían haciendo):

http
POST /api/v1/preinscriptos
{
   "cus": "http://localhost:4000/uploads/preinscriptos/cus.pdf",
   "analitico": "http://localhost:4000/uploads/preinscriptos/1234-abcd.pdf",
   "foto": "http://localhost:4000/uploads/perfiles/foto.jpg",
   // ... resto de datos
}
TIP

Si en el futuro desean migrar los archivos a la nube (AWS S3, Google Cloud Storage, Cloudinary), solamente tendremos que tocar el upload.middleware.ts. El resto de la base de datos y la comunicación con el frontend quedará intacta porque la base de datos ya está almacenando todo como simples strings (URLs).