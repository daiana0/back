import { AppError } from "../../../core/middlewares/error-handler.middleware.js";
import { CreateNotificacionDto } from "../dto/create-notificacion.dto.js";
import { UpdateNotificacionDto } from "../dto/update-notificacion.dto.js";
import Notificacion from "../model/notificacion.model.js";


const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const notificacionService = {
  getAll: async (page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) => {
    const offset = (page - 1) * limit;
    const { count, rows } = await Notificacion.findAndCountAll({
      offset,
      limit,
      order: [['fechaCreacion', 'DESC']],
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
    const notificacion = await Notificacion.findByPk(id);
    if (!notificacion) throw new AppError('Notificación no encontrada', 404);
    return notificacion;
  },

  create: async (data: CreateNotificacionDto) => {
    // Los campos con defaultValue (leida, fechaCreacion) se asignan automáticamente
    const nueva = await Notificacion.create(data as any);
    return nueva;
  },

  update: async (id: number, data: UpdateNotificacionDto) => {
    const notificacion = await Notificacion.findByPk(id);
    if (!notificacion) throw new AppError('Notificación no encontrada', 404);
    await notificacion.update(data);
    return notificacion;
  },

  delete: async (id: number) => {
    const notificacion = await Notificacion.findByPk(id);
    if (!notificacion) throw new AppError('Notificación no encontrada', 404);
    await notificacion.destroy();
    return true;
  },
};