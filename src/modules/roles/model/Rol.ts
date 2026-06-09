import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../../../config/database/conexion.js";

interface RolAttributes extends InferAttributes<Rol> {
  id: number;
  nombre: string;
  descripcion: string;
}

interface RolCreationAttributes extends InferCreationAttributes<Rol> {
  nombre: string;
  descripcion: string;
}

class Rol extends Model<RolAttributes, RolCreationAttributes> {
  declare id: CreationOptional<number>;
  declare nombre: string;
  declare descripcion: string;
}

Rol.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: { msg: "El nombre es obligatorio" },
      },
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "La descripción es obligatoria" },
      },
    },
  },
  {
    sequelize,
    tableName: "roles",
    timestamps: true,
    // Opcional: índices para optimizar consultas
    indexes: [
      { fields: ["nombre"] }
    ]
  }
);

export default Rol;