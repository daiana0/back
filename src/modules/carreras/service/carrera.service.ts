import Carrera from "../model/Carrera.js";
import type { CreateCarreraDto } from "../dto/create-carrera.dto.js";
import type { UpdateCarreraDto } from "../dto/update-carrera.dto.js";
import { Op } from "sequelize";

export const carreraService = {
    
  async getAll(page: number = 1, limit: number = 10, filter?: { nombre?: string }) {
    const offset = (page - 1) * limit;
    const where: any = {};
    if (filter?.nombre) where.nombre = { [Op.like]: `%${filter.nombre}%` };

    const { count, rows } = await Carrera.findAndCountAll({
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
    return Carrera.findByPk(id);
  },

  async create(data: CreateCarreraDto) {
    return Carrera.create(data);
  },

  async update(id: number, data: UpdateCarreraDto) {
    const carrera = await Carrera.findByPk(id);
    if (!carrera) return null;
    await carrera.update(data);
    return carrera.reload();
  },

  async delete(id: number) {
    const carrera = await Carrera.findByPk(id);
    if (!carrera) return null;
    await carrera.destroy();
    return true;
  },
};