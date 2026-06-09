
import { AppError } from '../../../core/middlewares/error-handler.middleware.js';
import { CreateRecuperacionDto } from '../dto/create-recuperacion.dto.js';
import { UpdateRecuperacionDto } from '../dto/update-recuperacion.dto.js';
import RecuperacionContrasenia from '../model/recuperacion-contrasenia.model.js';


const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const recuperacionService = {
  getAll: async (page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) => {
    const offset = (page - 1) * limit;
    const { count, rows } = await RecuperacionContrasenia.findAndCountAll({
      offset,
      limit,
      order: [['fechaExpiracion', 'DESC']],
    });
    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  },

  getById: async (id: number) => {
    const recuperacion = await RecuperacionContrasenia.findByPk(id);
    if (!recuperacion) throw new AppError('Solicitud de recuperación no encontrada', 404);
    return recuperacion;
  },

  create: async (data: CreateRecuperacionDto) => {
    const nueva = await RecuperacionContrasenia.create(data as any);
    return nueva;
  },

  update: async (id: number, data: UpdateRecuperacionDto) => {
    const recuperacion = await RecuperacionContrasenia.findByPk(id);
    if (!recuperacion) throw new AppError('Solicitud de recuperación no encontrada', 404);
    await recuperacion.update(data);
    return recuperacion;
  },

  delete: async (id: number) => {
    const recuperacion = await RecuperacionContrasenia.findByPk(id);
    if (!recuperacion) throw new AppError('Solicitud de recuperación no encontrada', 404);
    await recuperacion.destroy();
    return true;
  },
};