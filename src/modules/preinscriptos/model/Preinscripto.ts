import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../../../config/database/conexion.js";

interface PreinscriptoAttributes extends InferAttributes<Preinscripto> {
  id: number;
  idCarrera: number;
  idUsuario: number;
  dni: string;
  domicilio: string;
  telefono: string;
  fechaInscripcion: string;
  cus: string;
  isa: string;
  emmac: string | null;
  analitico: string;
  partidaNacimiento: string;
  foto: string;
  estado: "pendiente" | "aprobado" | "rechazado";
}

interface PreinscriptoCreationAttributes extends InferCreationAttributes<Preinscripto> {
  idUsuario: number;
  idCarrera: number;
  dni: string;
  domicilio: string;
  telefono: string;
  fechaInscripcion: string;
  cus: string;
  isa: string;
  emmac: string | null;
  analitico: string;
  partidaNacimiento: string;
  foto: string;
}

class Preinscripto extends Model<PreinscriptoAttributes, PreinscriptoCreationAttributes> {
  declare id: CreationOptional<number>;
  declare idCarrera: number;
  declare idUsuario: number;
  declare dni: string;
  declare domicilio: string;
  declare telefono: string;
  declare fechaInscripcion: string;
  declare cus: string;
  declare isa: string;
  declare emmac: string | null;
  declare analitico: string;
  declare partidaNacimiento: string;
  declare foto: string;
  declare estado: CreationOptional<"pendiente" | "aprobado" | "rechazado">;
}

Preinscripto.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    idCarrera: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_carrera",
      references: {
        model: "carreras",
        key: "id"
      }
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_usuario",
      references: { model: "usuarios", key: "id" }
    },
    dni: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: { name: "dni", msg: "El DNI ya está registrado" },
      validate: {
        notEmpty: { msg: "El DNI es obligatorio" },
        esNumerico(value: string) {
          if (!/^\d+$/.test(value)) {
            throw new Error("El DNI debe contener únicamente números");
          }
        },
      },
    },
    domicilio: {
      type: DataTypes.STRING,
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fechaInscripcion: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    cus: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isa: {
      type: DataTypes.STRING,
      allowNull: false
    },
    emmac: {
      type: DataTypes.STRING,
      allowNull: true
    },
    analitico: {
      type: DataTypes.STRING,
      allowNull: false
    },
    partidaNacimiento: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "partida_nacimiento"
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "aprobado", "rechazado"),
      defaultValue: "pendiente"
    },
  },
  {
    sequelize,
    tableName: "preinscriptos",
    timestamps: true,
    indexes: [
      { fields: ["id_carrera"] },
      { fields: ["id_usuario"] },
      { fields: ["estado"] },
    ]
  }
);

export default Preinscripto;