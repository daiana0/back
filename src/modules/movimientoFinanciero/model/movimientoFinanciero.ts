import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../../../config/database/conexion.js";

interface MovimientoFinancieroAttributes extends InferAttributes<MovimientoFinanciero> {
  id: number;
  idEstudiante: number;
  tipo: string;
  concepto: string;
  monto: number;
  fecha: Date;
  medioPago: string;
  descripcion: string | null;
  idAdministrativo: number;
}

interface MovimientoFinancieroCreationAttributes extends InferCreationAttributes<MovimientoFinanciero> {
  idEstudiante: number;
  tipo: string;
  concepto: string;
  monto: number;
  fecha: Date;
  medioPago: string;
  descripcion: string | null;
  idAdministrativo: number;
}

class MovimientoFinanciero extends Model<MovimientoFinancieroAttributes, MovimientoFinancieroCreationAttributes> {
  declare id: CreationOptional<number>;
  declare idEstudiante: number;
  declare tipo: string;
  declare concepto: string;
  declare monto: number;
  declare fecha: Date;
  declare medioPago: string;
  declare descripcion: string | null;
  declare idAdministrativo: number;
}

MovimientoFinanciero.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idEstudiante: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_estudiante",
      references: { model: "estudiantes", key: "id" },
    },
    tipo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: { isIn: [["INGRESO", "EGRESO"]] },
    },
    concepto: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    monto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0 },
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    medioPago: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "medio_pago",
    },
    descripcion: {
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
    tableName: "movimientos_financieros",
    timestamps: true,
    // Opcional: índices para optimizar consultas
    indexes: [
      { fields: ["id_estudiante"] },
      { fields: ["tipo"] },
    ]
  }
);

export default MovimientoFinanciero;