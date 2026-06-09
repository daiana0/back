import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import sequelize from '../../../config/database/conexion.js';

interface InstanciaEvaluativaAttributes extends InferAttributes<InstanciaEvaluativa> {
  id: number;
  idDivisionXUnidadCurricular: number;
  descripcion: string;
  fecha: Date;
  tipo: 'trabajo practico' | 'parcial' | 'examen final' | 'recuperatorio' | 'coloquio' | 'proyecto integrador';
  idAdministrativo: number;
}

interface InstanciaEvaluativaCreationAttributes extends InferCreationAttributes<InstanciaEvaluativa> {
  idDivisionXUnidadCurricular: number;
  descripcion: string;
  fecha: Date;
  tipo: 'trabajo practico' | 'parcial' | 'examen final' | 'recuperatorio' | 'coloquio' | 'proyecto integrador';
  idAdministrativo: number;
}

class InstanciaEvaluativa extends Model<InstanciaEvaluativaAttributes, InstanciaEvaluativaCreationAttributes> {
  declare id: CreationOptional<number>;
  declare idDivisionXUnidadCurricular: number;
  declare descripcion: string;
  declare fecha: Date;
  declare tipo: 'trabajo practico' | 'parcial' | 'examen final' | 'recuperatorio' | 'coloquio' | 'proyecto integrador';
  declare idAdministrativo: number;
}

InstanciaEvaluativa.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idDivisionXUnidadCurricular: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_division_x_unidad_curricular',
      references: { model: 'divisiones_x_unidades_curriculares', key: 'id' },
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notBeforeToday(value: Date) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (value < today) {
            throw new Error('La fecha no puede ser anterior a la fecha actual.');
          }
        },
      },
    },
    tipo: {
      type: DataTypes.ENUM(
        'trabajo practico',
        'parcial',
        'examen final',
        'recuperatorio',
        'coloquio',
        'proyecto integrador',
      ),
      allowNull: false,
    },
    idAdministrativo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_administrativo',
      references: { model: 'administrativos', key: 'id' },
    },
  },
  {
    sequelize,
    tableName: 'instancias_evaluativas',
    timestamps: true,
    indexes: [
      { fields: ['id_division_x_unidad_curricular'], name: 'idx_instancia_div_uc' },
      { fields: ['fecha'] },
      { fields: ['tipo'] },
      { fields: ['id_administrativo'] },
    ],
  },
);

export default InstanciaEvaluativa;
