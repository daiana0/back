import MesaExamenXLegajo from '../../../modules/mesaExamenXLegajo/model/MesaExamenXLegajo.js'
import type { CreateMesaExamenXLegajoDto } from '../dto/create-mesaExamenXLegajo.dto.js';
import type { UpdateMesaExamenXLegajoDto } from '../dto/update-mesaExamenXLegajo.dto.js';

export const mesaExamenXLegajoService = {
  async getAll() {
    return await MesaExamenXLegajo.findAll();
  },

  async getById(id: number) {''
    return await MesaExamenXLegajo.findByPk(id);
  },

  async create(data: CreateMesaExamenXLegajoDto) {
    // Usamos 'as any' para evitar el error de TS con los campos de creación
    return await MesaExamenXLegajo.create(data as any);
  },

  async update(id: number, data: UpdateMesaExamenXLegajoDto) {
    const record = await MesaExamenXLegajo.findByPk(id);
    if (!record) return null;
    await record.update(data as any);
    return record.reload();
  },

  async delete(id: number) {
    const record = await MesaExamenXLegajo.findByPk(id);
    if (!record) return null;
    await record.destroy();
    return true;
  },
};