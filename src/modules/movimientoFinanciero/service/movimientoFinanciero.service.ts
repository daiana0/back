import MovimientoFinanciero from '../model/movimientoFinanciero.js';
import type { CreateMovimientoFinancieroDto } from '../dto/create-movimientoFinanciero.dto.js';
import type { UpdateMovimientoFinancieroDto } from '../dto/update-movimientoFinanciero.dto.js';

export const movimientoFinancieroService = {
  async getAll() {
    return await MovimientoFinanciero.findAll();
  },

  async getById(id: number) {
    return await MovimientoFinanciero.findByPk(id);
  },

  async create(data: CreateMovimientoFinancieroDto) {
    return await MovimientoFinanciero.create(data as any);
  },

  async update(id: number, data: UpdateMovimientoFinancieroDto) {
    const record = await MovimientoFinanciero.findByPk(id);
    if (!record) return null;
    await record.update(data as any);
    return record.reload();
  },

  async delete(id: number) {
    const record = await MovimientoFinanciero.findByPk(id);
    if (!record) return null;
    await record.destroy();
    return true;
  },
};