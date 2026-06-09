import { AppError } from "../../../core/middlewares/error-handler.middleware.js";
import { CreateTipoDocumentoDto } from "../dto/create-tipo-documento-requerido.dto.js";
import { UpdateTipoDocumentoDto } from "../dto/update-tipo-documento-requerido.dto.js";
import TipoDocumentoRequerido from "../model/TipoDocumentoRequerido.js";


const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const tipoDocumentoService = {
  getAll: async (page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) => {
    const offset = (page - 1) * limit;
    const { count, rows } = await TipoDocumentoRequerido.findAndCountAll({
      offset,
      limit,
      order: [['nombreDocumento', 'ASC']],
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
    const tipo = await TipoDocumentoRequerido.findByPk(id);
    if (!tipo) throw new AppError('Tipo de documento no encontrado', 404);
    return tipo;
  },

  create: async (data: CreateTipoDocumentoDto) => {
    const nuevo = await TipoDocumentoRequerido.create(data as any);
    return nuevo;
  },

  update: async (id: number, data: UpdateTipoDocumentoDto) => {
    const tipo = await TipoDocumentoRequerido.findByPk(id);
    if (!tipo) throw new AppError('Tipo de documento no encontrado', 404);
    await tipo.update(data);
    return tipo;
  },

  delete: async (id: number) => {
    const tipo = await TipoDocumentoRequerido.findByPk(id);
    if (!tipo) throw new AppError('Tipo de documento no encontrado', 404);
    await tipo.destroy();
    return true;
  },
};
