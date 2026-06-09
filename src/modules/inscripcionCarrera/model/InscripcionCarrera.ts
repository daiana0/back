import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../../../config/database/conexion.js";

interface InscripcionCarreraAttributes extends InferAttributes<InscripcionCarrera> {
  id: number;
  cupo: number | null;
  fechaDesde: string | null;
  fechaHasta: string | null;
  idPlanEstudio: number;
  idAdministrativo: number;
}

interface InscripcionCarreraCreationAttributes extends InferCreationAttributes<InscripcionCarrera> {
  cupo: number | null;
  fechaDesde: string | null;
  fechaHasta: string | null;
  idPlanEstudio: number;
  idAdministrativo: number;
}

class InscripcionCarrera extends Model<InscripcionCarreraAttributes, InscripcionCarreraCreationAttributes> {
  declare id: CreationOptional<number>;
  declare cupo: number | null;
  declare fechaDesde: string | null;
  declare fechaHasta: string | null;
  declare idPlanEstudio: number;
  declare idAdministrativo: number;
}

InscripcionCarrera.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cupo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fechaDesde: {
      type: DataTypes.DATEONLY,
      field: "fecha_desde",
    },
    fechaHasta: {
      type: DataTypes.DATEONLY,
      field: "fecha_hasta",
    },
    idPlanEstudio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_plan_estudio",
      references: {
        model: "planes_estudios",
        key: "id",
      },
    },
    idAdministrativo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_administrativo",
      references: {
        model: "administrativos",
        key: "id"
      }
    }
  },
  {
    sequelize,
    tableName: "inscripciones_carreras",
    timestamps: true,
    // Opcional: índices para optimizar consultas
    indexes: [
      { fields: ["id_plan_estudio"] },
      { fields: ["id_administrativo"] },
    ]
  }
);

export default InscripcionCarrera;