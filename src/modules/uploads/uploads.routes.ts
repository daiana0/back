import { Router, Request, Response, NextFunction } from 'express';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { uploadMiddleware } from '../../core/middlewares/upload.middleware.js';
import { uploadController } from './controller/upload.controller.js';
import multer from 'multer';

export const uploadRouter = Router();

// Middleware intermedio para manejar errores de Multer (ej: formato no válido o archivo muy grande)
const handleMulterError = (req: Request, res: Response, next: NextFunction) => {
  uploadMiddleware.single('archivo')(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      // Un error de Multer ocurrió al momento de la carga.
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ status: 'error', message: 'El archivo excede el tamaño máximo permitido de 5MB.' });
      }
      return res.status(400).json({ status: 'error', message: err.message });
    } else if (err) {
      // Un error desconocido ocurrió.
      return res.status(400).json({ status: 'error', message: err.message });
    }
    // Todo salió bien, continuar al controlador
    next();
  });
};

// Ruta: POST /api/v1/uploads/:tipo -> admitirá tipos: 'preinscritos', 'dossier', 'documentos' mas el id que se le asignará al archivo para su posterior asociación con el usuario o proceso correspondiente
// Se requiere estar autenticado para subir archivos
uploadRouter.post(
  '/:tipo',
  validateJwt,
  handleMulterError,
  uploadController.uploadFile
);
