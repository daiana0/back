
import { CreateDocumentoLegajoDto } from '../dto/create-documento-legajo.dto.js';
import { UpdateDocumentoLegajoDto } from '../dto/update-documento-legajo.dto.js';
import { AppError } from '../../../core/middlewares/error-handler.middleware.js';
import DocumentoLegajo from '../model/DocumentoLegajo.js';


const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const documentoLegajoService = {
  getAll: async (page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) => {
    const offset = (page - 1) * limit;
    const { count, rows } = await DocumentoLegajo.findAndCountAll({
      offset,
      limit,
      order: [['fechaCarga', 'DESC']],
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
    const doc = await DocumentoLegajo.findByPk(id);
    if (!doc) throw new AppError('Documento de legajo no encontrado', 404);
    return doc;
  },

  create: async (data: CreateDocumentoLegajoDto) => {
    // El campo estado y fechaCarga tienen valores por defecto en el modelo
    const nuevo = await DocumentoLegajo.create(data as any);
    return nuevo;
  },

  update: async (id: number, data: UpdateDocumentoLegajoDto) => {
    const doc = await DocumentoLegajo.findByPk(id);
    if (!doc) throw new AppError('Documento de legajo no encontrado', 404);
    await doc.update(data);
    return doc;
  },

  delete: async (id: number) => {
    const doc = await DocumentoLegajo.findByPk(id);
    if (!doc) throw new AppError('Documento de legajo no encontrado', 404);
    await doc.destroy();
    return true;
  },
};