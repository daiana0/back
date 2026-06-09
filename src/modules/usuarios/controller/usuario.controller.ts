import { Request, Response, NextFunction } from 'express';
import { usuarioService } from '../service/usuario.service.js';
import { CreateUsuarioDto } from '../dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto.js';
import { parsePagination } from '../../../helpers/parsePagination.js';
import { respondZodError } from '../../../helpers/respondZodError.js';

export const usuarioController = {

  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await usuarioService.getAll(page, limit);
      res.status(200).json({ status: 'success', ...result });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ status: 'error', message: 'ID inválido.' });
      }
      const usuario = await usuarioService.getById(id);
      if (!usuario) {
        return res.status(404).json({ status: 'error', message: 'Usuario no encontrado.' });
      }
      res.status(200).json({ status: 'success', data: usuario });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateUsuarioDto.safeParse(req.body);
      if (!parsed.success) return respondZodError(res, parsed.error);
      const nuevo = await usuarioService.create(parsed.data);
      const respuesta = {
        id: nuevo.id,
        nombre: nuevo.nombre,
        apellido: nuevo.apellido,
        email: nuevo.email,
        activo: nuevo.activo
      }
      res.status(201).json({ status: 'success', data: respuesta });
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const parsed = UpdateUsuarioDto.safeParse(req.body);
      if (!parsed.success) return respondZodError(res, parsed.error);

      const actualizado = await usuarioService.update(id, parsed.data);
      if (!actualizado) {
        return res.status(404).json({ status: 'error', message: 'Usuario no encontrado.' });
      }
      res.status(200).json({ status: 'success', data: actualizado });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const eliminado = await usuarioService.delete(id);
      if (!eliminado) {
        return res.status(404).json({ status: 'error', message: 'Usuario no encontrado.' });
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};