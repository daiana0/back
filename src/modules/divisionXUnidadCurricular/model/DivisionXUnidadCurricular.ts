// 1.19 DivisionXUnidadCurricular
import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../../../config/database/conexion.js";

interface DivisionXUnidadCurricularAttributes extends InferAttributes<DivisionXUnidadCurricular> {
  id: number;
  idDivision: number;
  idUnidadCurricular: number;
  idAdministrativo: number;
}

interface DivisionXUnidadCurricularCreationAttributes extends InferCreationAttributes<DivisionXUnidadCurricular> {
  idDivision: number;
  idUnidadCurricular: number;
  idAdministrativo: number;
}

class DivisionXUnidadCurricular extends Model<DivisionXUnidadCurricularAttributes, DivisionXUnidadCurricularCreationAttributes> {
  declare id: CreationOptional<number>;
  declare idDivision: number;
  declare idUnidadCurricular: number;
  declare idAdministrativo: number;
}

DivisionXUnidadCurricular.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idDivision: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_division",
      references: { model: "divisiones", key: "id" }
    },
    idUnidadCurricular: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_unidad_curricular",
      references: { model: "unidades_curriculares", key: "id" }
    },
    idAdministrativo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_administrativo",
      references: { model: "administrativos", key: "id" }
    },
  },
  {
    sequelize,
    tableName: "divisiones_x_unidades_curriculares",
    timestamps: true,
    // Opcional: índices para optimizar consultas
    indexes: [
      { fields: ["id_division"] },
      { fields: ["id_unidad_curricular"] },
      { fields: ["id_administrativo"] },
    ]
  }
);

export default DivisionXUnidadCurricular;