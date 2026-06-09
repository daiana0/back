import InstanciaEvaluativa from '../model/InstanciaEvaluativa.js';
import type { CreateInstanciaEvaluativaDto } from '../dto/create-instancia-evaluativa.dto.js';
import type { UpdateInstanciaEvaluativaDto } from '../dto/update-instancia-evaluativa.dto.js';
import { sequelize, LegajoXInstanciaEvaluativa, EstudianteXUnidadCurricular, Docente } from '../../index.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const instanciaEvaluativaService = {

  async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
    const offset = (page - 1) * limit;
    const { count, rows } = await InstanciaEvaluativa.findAndCountAll({
      limit,
      offset,
      order: [['fecha', 'ASC']],
    });

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  },

  async getById(id: number) {
    return InstanciaEvaluativa.findByPk(id);
  },

  async getByDivisionXUnidadCurricular(idDivisionXUnidadCurricular: number) {
    return InstanciaEvaluativa.findAll({
      where: { idDivisionXUnidadCurricular },
      order: [['fecha', 'ASC']],
    });
  },

  async create(data: CreateInstanciaEvaluativaDto) {
    return InstanciaEvaluativa.create(data as any);
  },

  async update(id: number, data: UpdateInstanciaEvaluativaDto) {
    const instancia = await InstanciaEvaluativa.findByPk(id);
    if (!instancia) return null;
    await instancia.update(data as any);
    return instancia;
  },

  async delete(id: number) {
    const instancia = await InstanciaEvaluativa.findByPk(id);
    if (!instancia) return null;
    await instancia.destroy();
    return true;
  },

  async getCalificaciones(idInstanciaEvaluativa: number) {
    const instancia = await InstanciaEvaluativa.findByPk(idInstanciaEvaluativa);
    if (!instancia) return [];

    const inscritos = await EstudianteXUnidadCurricular.findAll({
      where: { idDivisionXUnidadCurricular: instancia.idDivisionXUnidadCurricular },
    });

    const notasExistentes = await LegajoXInstanciaEvaluativa.findAll({
      where: { idInstanciaEvaluativa },
    });

    return inscritos.map((ins) => {
      const notaReg = notasExistentes.find((n) => n.idLegajo === ins.idLegajo);
      return {
        idLegajo: ins.idLegajo,
        nota: notaReg ? notaReg.nota : null,
      };
    });
  },

  async guardarCalificaciones(
    idInstanciaEvaluativa: number,
    payload: { calificaciones: { idLegajo: number; nota: number | null }[] },
    userId: number,
    userRole: string
  ) {
    let idAdministrativo = userId;

    if (userRole === 'DOCENTE') {
      const docente = await Docente.findByPk(userId);
      if (docente) {
        idAdministrativo = docente.idAdministrativo;
      }
    }

    const transaction = await sequelize.transaction();
    try {
      const fechaRegistro = new Date().toISOString().split('T')[0];

      for (const item of payload.calificaciones) {
        const existing = await LegajoXInstanciaEvaluativa.findOne({
          where: {
            idInstanciaEvaluativa,
            idLegajo: item.idLegajo,
          },
          transaction,
        });

        if (item.nota === null) {
          if (existing) {
            await existing.destroy({ transaction });
          }
        } else {
          if (existing) {
            await existing.update(
              {
                nota: item.nota,
                fechaRegistro,
                idAdministrativo,
              },
              { transaction }
            );
          } else {
            await LegajoXInstanciaEvaluativa.create(
              {
                idInstanciaEvaluativa,
                idLegajo: item.idLegajo,
                nota: item.nota,
                fechaRegistro,
                idAdministrativo,
              } as any,
              { transaction }
            );
          }
        }
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
