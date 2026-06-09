import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../../../config/database/conexion.js";

interface EquivalenciaUnidadCurricularAttributes extends InferAttributes<EquivalenciaUnidadCurricular> {
  id: number;
  idPlanEstudioOrigen: number;
  idPlanEstudioDestino: number;
  idUnidadCurricularOrigen: number;
  idUnidadCurricularDestino: number;
  tipoEquivalencia: string;
  observaciones: string | null;
  idAdministrativo: number;
}

interface EquivalenciaUnidadCurricularCreationAttributes extends InferCreationAttributes<EquivalenciaUnidadCurricular> {
  idPlanEstudioOrigen: number;
  idPlanEstudioDestino: number;
  idUnidadCurricularOrigen: number;
  idUnidadCurricularDestino: number;
  tipoEquivalencia: string;
  observaciones: string | null;
  idAdministrativo: number;
}

class EquivalenciaUnidadCurricular extends Model<EquivalenciaUnidadCurricularAttributes, EquivalenciaUnidadCurricularCreationAttributes> {
  declare id: CreationOptional<number>;
  declare idPlanEstudioOrigen: number;
  declare idPlanEstudioDestino: number;
  declare idUnidadCurricularOrigen: number;
  declare idUnidadCurricularDestino: number;
  declare tipoEquivalencia: string;
  declare observaciones: string | null;
  declare idAdministrativo: number;
}

EquivalenciaUnidadCurricular.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idPlanEstudioOrigen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_plan_estudio_origen",
      references: { model: "planes_estudios", key: "id" },
    },
    idPlanEstudioDestino: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_plan_estudio_destino",
      references: { model: "planes_estudios", key: "id" },
    },
    idUnidadCurricularOrigen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_unidad_curricular_origen",
      references: { model: "unidades_curriculares", key: "id" },
    },
    idUnidadCurricularDestino: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_unidad_curricular_destino",
      references: { model: "unidades_curriculares", key: "id" },
    },
    tipoEquivalencia: {
      type: DataTypes.ENUM("TOTAL", "PARCIAL"),
      allowNull: false,
      field: "tipo_equivalencia",
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    idAdministrativo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_administrativo",
      references: { model: "administrativos", key: "id" },
    },
  },
  {
    sequelize,
    tableName: "equivalencias_unidades_curriculares",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["id_plan_estudio_origen", "id_plan_estudio_destino", "id_unidad_curricular_origen", "id_unidad_curricular_destino"],
        name: "un_equivalencia_completa",
      },
    ],
  }
);

export default EquivalenciaUnidadCurricular;
