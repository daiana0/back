import ComprobanteAlumno from '../model/ComprobanteAlumno.js';
import type { CreateComprobanteAlumnoDto } from '../dto/create-comprobanteAlumno.dto.js';
import type { UpdateComprobanteAlumnoDto } from '../dto/update-comprobanteAlumno.dto.js';

export const comprobanteAlumnoService = {
  async getAll() {
    return await ComprobanteAlumno.findAll();
  },

  async getById(id: number) {
    return await ComprobanteAlumno.findByPk(id);
  },

  async create(data: CreateComprobanteAlumnoDto) {
    return await ComprobanteAlumno.create(data as any);
  },

  async update(id: number, data: UpdateComprobanteAlumnoDto) {
    const record = await ComprobanteAlumno.findByPk(id);
    if (!record) return null;
    await record.update(data as any);
    return record.reload();
  },

  async delete(id: number) {
    const record = await ComprobanteAlumno.findByPk(id);
    if (!record) return null;
    await record.destroy();
    return true;
  },
};