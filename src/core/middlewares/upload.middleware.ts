import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import type { Request } from 'express';

// Destino base para todas las subidas
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Asegurar que exista la carpeta principal
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const FOTO_PERFIL_TIPO = 'estudiante-foto-perfil';

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 1. Obtener el tipo de la URL
    const folder = (req.params.tipo as string) || 'otros';

    // 2. Obtener el ID del segmento de carpeta según el tipo
    const user = (req as Request).user;
    let segmentId: string;

    if (folder === FOTO_PERFIL_TIPO) {
      const idEstudiante = user?.idEstudiante;
      if (!idEstudiante) {
        return cb(new Error('El usuario no tiene un estudiante asociado'), '');
      }
      segmentId = idEstudiante.toString();
    } else {
      const userId = user?.id;
      if (!userId) {
        return cb(new Error('Usuario no autenticado'), '');
      }
      segmentId = userId.toString();
    }

    // 3. Construir la ruta con el tipo y el ID correspondiente
    const folderPath = path.join(UPLOADS_DIR, folder, segmentId);

    // 4. Crear la carpeta recursivamente si no existe
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath);

  },
  filename: (req, file, cb) => {
    // Generar un nombre único para evitar colisiones
    const uniqueSuffix = crypto.randomUUID();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

// Filtro de archivos permitidos
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const folder = (req.params.tipo as string) || 'otros';

  const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const allowedMimeTypes =
    folder === FOTO_PERFIL_TIPO
      ? imageMimeTypes
      : [...imageMimeTypes, 'application/pdf'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if (folder === FOTO_PERFIL_TIPO) {
    cb(new Error('Formato de archivo no soportado. Solo se permiten JPG, JPEG y PNG.'));
  } else {
    cb(new Error('Formato de archivo no soportado. Solo se permiten JPG, JPEG, PNG y PDF.'));
  }
};

// Middleware configurado (con límite de tamaño de 5MB)
export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max
  }
});
