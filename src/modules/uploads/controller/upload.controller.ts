import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../core/middlewares/error-handler.middleware.js';

export const uploadController = {
  uploadFile: (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;

      if (!file) {
        throw new AppError('No se proporcionó ningún archivo o el formato no es válido.', 400);
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;

      // 1. Carpeta dinámica igual que en el middleware
      const folder = req.params.tipo || 'otros';

      // 2. Obtener el ID del segmento según el tipo
      let segmentId: number;
      if (folder === 'estudiante-foto-perfil') {
        const idEstudiante = req.user?.idEstudiante;
        if (!idEstudiante) {
          throw new AppError('El usuario no tiene un estudiante asociado', 400);
        }
        segmentId = idEstudiante;
      } else {
        const userId = req.user?.id;
        if (!userId) {
          throw new AppError('Usuario no autenticado', 401);
        }
        segmentId = userId;
      }

      // 3. Construir la URL con tipo y segmento
      const fileUrl = `${baseUrl}/uploads/${folder}/${segmentId}/${file.filename}`;


      return res.status(200).json({
        status: 'success',
        message: 'Archivo subido correctamente',
        data: {
          url: fileUrl,
          filename: file.filename,
          mimetype: file.mimetype,
          size: file.size
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
