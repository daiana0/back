import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from "sequelize";
import sequelize from "../../../config/database/conexion.js";


interface EstudianteAttributes extends InferAttributes<Estudiante> {
  id: number;
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  domicilio: string;
  provincia: string | null;
  localidad: string | null;
  fechaDeNacimiento: string;
  foto: string | null;
  trabaja: boolean | null;
  activo: boolean;
  idUsuario: number;
  idAdministrativo: number;
}

interface EstudianteCreationAttributes extends InferCreationAttributes<Estudiante> {
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  domicilio: string;
  fechaDeNacimiento: string;
  foto: string | null;
  trabaja: boolean | null;
  idUsuario: number;
  idAdministrativo: number;
  provincia?: CreationOptional<string | null>;
  localidad?: CreationOptional<string | null>;
}

class Estudiante extends Model<EstudianteAttributes, EstudianteCreationAttributes> {
  declare id: CreationOptional<number>;
  declare dni: string;
  declare nombre: string;
  declare apellido: string;
  declare email: string;
  declare telefono: string;
  declare domicilio: string;
  declare provincia: CreationOptional<string | null>;
  declare localidad: CreationOptional<string | null>;
  declare fechaDeNacimiento: string;
  declare foto: string | null;
  declare trabaja: boolean | null;
  declare activo: CreationOptional<boolean>;
  declare idUsuario: number;
  declare idAdministrativo: number;
}

Estudiante.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
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
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { msg: "El nombre es obligatorio" } },

    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { msg: "El apellido es obligatorio" } },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: { name: "email", msg: "El email ya está registrado" },
      validate: {
        isEmail: { msg: "Debe proporcionar un email válido" },
        notEmpty: { msg: "El email es obligatorio" },
      },
    },
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    domicilio: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    provincia: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    localidad: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    fechaDeNacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "fecha_de_nacimiento"
    },
    foto: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    trabaja: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    idAdministrativo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_administrativo",
      references: {
        model: "administrativos",
        key: "id"
      }
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_usuario",
      references: { model: "usuarios", key: "id" }
    }
  },
  {
    sequelize,
    tableName: "estudiantes",
    timestamps: true,
    // Opcional: índices para optimizar consultas
    indexes: [
      { fields: ["dni"] },
      { fields: ["email"] },
      { fields: ["id_administrativo"] },
      { fields: ["id_usuario"] },
      { name: "idx_est_dni_email", unique: true, fields: ["dni", "email"] }
    ]
  }
)


export default Estudiante;