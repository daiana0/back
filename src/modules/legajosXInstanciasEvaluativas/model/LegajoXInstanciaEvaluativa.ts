import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../../../config/database/conexion.js';

interface LegajoXInstanciaEvaluativaAttributes extends InferAttributes<LegajoXInstanciaEvaluativa> {
  id: number;
  idInstanciaEvaluativa: number;
  idLegajo: number;
  nota: number;
  fechaRegistro: string;
  idAdministrativo: number;
}

interface LegajoXInstanciaEvaluativaCreationAttributes extends InferCreationAttributes<LegajoXInstanciaEvaluativa> {
  idInstanciaEvaluativa: number;
  idLegajo: number;
  nota: number;
  fechaRegistro: string;
  idAdministrativo: number;
}

class LegajoXInstanciaEvaluativa extends Model<LegajoXInstanciaEvaluativaAttributes, LegajoXInstanciaEvaluativaCreationAttributes> {
  declare id: CreationOptional<number>;
  declare idInstanciaEvaluativa: number;
  declare idLegajo: number;
  declare nota: number;
  declare fechaRegistro: string;
  declare idAdministrativo: number;
}

LegajoXInstanciaEvaluativa.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idInstanciaEvaluativa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_instancia_evaluativa',
      references: { model: 'instancias_evaluativas', key: 'id' },
    },
    idLegajo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_legajo',
      references: { model: 'legajos', key: 'id' },
    },
    nota: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 10,
      },
    },
    fechaRegistro: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'fecha_registro',
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
    tableName: 'legajos_x_instancias_evaluativas',
    timestamps: true,
    indexes: [
      { fields: ['id_instancia_evaluativa'] },
      { fields: ['id_legajo'] },
      { fields: ['id_administrativo'] },
    ],
  },
);

export default LegajoXInstanciaEvaluativa;
