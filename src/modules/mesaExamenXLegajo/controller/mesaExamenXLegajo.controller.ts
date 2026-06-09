import { Request, Response } from 'express';
import { mesaExamenXLegajoService } from '../service/mesaExamenXLegajo.service.js';

export const mesaExamenXLegajoController = {
  async getAll(req: Request, res: Response) {
    const data = await mesaExamenXLegajoService.getAll();
    res.json(data);
  },

  async getById(req: Request, res: Response) {
    const data = await mesaExamenXLegajoService.getById(Number(req.params.id));
    data ? res.json(data) : res.status(404).json({ message: 'No encontrado' });
  },

  async create(req: Request, res: Response) {
    const data = await mesaExamenXLegajoService.create(req.body);
    res.status(201).json(data);
  },

  async update(req: Request, res: Response) {
    const data = await mesaExamenXLegajoService.update(Number(req.params.id), req.body);
    data ? res.json(data) : res.status(404).json({ message: 'No encontrado' });
  },

  async delete(req: Request, res: Response) {
    const success = await mesaExamenXLegajoService.delete(Number(req.params.id));
    success ? res.status(204).send() : res.status(404).json({ message: 'No encontrado' });
  }
};