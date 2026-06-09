import { AppError } from "../../../core/middlewares/error-handler.middleware.js";
import { CreateSesionDto } from "../dto/create-sesion.dto.js";
import { UpdateSesionDto } from "../dto/update-sesion.dto.js";
import SesionUsuario from "../model/sesion-usuario.model.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const sesionService = {
  getAll: async (page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) => {
    const offset = (page - 1) * limit;
    const { count, rows } = await SesionUsuario.findAndCountAll({
      offset,
      limit,
      order: [['fechaInicioSesion', 'DESC']],
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
    const sesion = await SesionUsuario.findByPk(id);
    if (!sesion) throw new AppError('Sesión de usuario no encontrada', 404);
    return sesion;
  },

  create: async (data: CreateSesionDto) => {
    const nueva = await SesionUsuario.create(data as any);
    return nueva;
  },

  update: async (id: number, data: UpdateSesionDto) => {
    const sesion = await SesionUsuario.findByPk(id);
    if (!sesion) throw new AppError('Sesión de usuario no encontrada', 404);
    await sesion.update(data);
    return sesion;
  },

  delete: async (id: number) => {
    const sesion = await SesionUsuario.findByPk(id);
    if (!sesion) throw new AppError('Sesión de usuario no encontrada', 404);
    await sesion.destroy();
    return true;
  },
};
