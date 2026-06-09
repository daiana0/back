import Correlatividad from '../model/Correlatividad.js';
import { CreateCorrelatividadDto } from '../dto/create-correlatividad.dto.js';
import { UpdateCorrelatividadDto } from '../dto/update-correlatividad.dto.js';
import { Op } from "sequelize";

export const CorrelatividadService = {

  async getAll(page: number = 1, limit: number = 10, filter?: { nombre?: string }) {
    const offset = (page - 1) * limit;
    const where: any = {};
    if (filter?.nombre) where.nombre = { [Op.like]: `%${filter.nombre}%` };

    const { count, rows } = await Correlatividad.findAndCountAll({
      where,
      limit,
      offset,
      order: [["id", "ASC"]],
    });

    return {
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  },

  async getById(id: number) {
    return Correlatividad.findByPk(id);
  },

  async create(data: CreateCorrelatividadDto) {
    return Correlatividad.create(data as any);
  },

  async update(id: number, data: UpdateCorrelatividadDto) {
    const correlatividad = await Correlatividad.findByPk(id);
    if (!correlatividad) return null;
    await correlatividad.update(data as any);
    return correlatividad.reload();
  },

  async delete(id: number) {
    const correlatividad = await Correlatividad.findByPk(id);
    if (!correlatividad) return null;
    await correlatividad.destroy();
    return true;
  },
}
