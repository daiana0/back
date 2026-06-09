import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';
import sequelize from '../../../config/database/conexion.js';

interface CorrelatividadAttributes extends InferAttributes<Correlatividad> {
  id: number;
  idPlan: number;
  idUnidadCurricular: number;
  idUnidadCurricularCorrelativa: number;
  condicion: 'REGULARIZADA' | 'APROBADA' | 'PENDIENTE' | 'DESAPROBADA';
}

interface CorrelatividadCreationAttributes
  extends InferCreationAttributes<Correlatividad> {
  idPlan: number;
  idUnidadCurricular: number;
  idUnidadCurricularCorrelativa: number;
  condicion: 'REGULARIZADA' | 'APROBADA' | 'PENDIENTE' | 'DESAPROBADA';
}

class Correlatividad extends Model<
  CorrelatividadAttributes,
  CorrelatividadCreationAttributes
> {
  declare id: CreationOptional<number>;
  declare idPlan: ForeignKey<number>;
  declare idUnidadCurricular: ForeignKey<number>;
  declare idUnidadCurricularCorrelativa: ForeignKey<number>;
  declare condicion: 'REGULARIZADA' | 'APROBADA' | 'PENDIENTE' | 'DESAPROBADA';
}

Correlatividad.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idPlan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_plan',
      references: {
        model: 'planes_estudios',
        key: 'id',
      },
    },
    idUnidadCurricular: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_unidad_curricular',
      references: {
        model: 'unidades_curriculares',
        key: 'id',
      },
    },
    idUnidadCurricularCorrelativa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_unidad_curricular_correlativa',
      references: {
        model: 'unidades_curriculares',
        key: 'id',
      },
    },
    condicion: {
      type: DataTypes.ENUM('REGULARIZADA', 'APROBADA', 'PENDIENTE', 'DESAPROBADA'),
      allowNull: false,
      defaultValue: 'PENDIENTE',
    },
  },
  {
    sequelize,
    tableName: 'correlatividades',
    timestamps: true,
  }
);

export default Correlatividad;
