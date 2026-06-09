import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../../../config/database/conexion.js";
import bcrypt from "bcrypt";

interface DocenteAttributes extends InferAttributes<Docente> {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  contrasenia: string;
  dni: string;
  titulo: string;
  especialidad: string | null;
  domicilio: string;
  telefono: string;
  foto: string | null;
  idAdministrativo: number;
  activo: CreationOptional<boolean>;
}

interface DocenteCreationAttributes extends InferCreationAttributes<Docente> {
  nombre: string;
  apellido: string;
  email: string;
  contrasenia: string;
  dni: string;
  titulo: string;
  especialidad: string | null;
  domicilio: string;
  telefono: string;
  foto: string | null;
  idAdministrativo: number;
}

class Docente extends Model<DocenteAttributes, DocenteCreationAttributes> {
  declare id: CreationOptional<number>;
  declare nombre: string;
  declare apellido: string;
  declare email: string;
  declare contrasenia: string;
  declare dni: string;
  declare titulo: string;
  declare especialidad: string | null;
  declare domicilio: string;
  declare telefono: string;
  declare foto: string | null;
  declare idAdministrativo: number;
  declare activo: CreationOptional<boolean>;

  async validarContrasenia(contraseniaIngresada: string): Promise<boolean> {
    if (!this.contrasenia) return false;
    return bcrypt.compare(contraseniaIngresada, this.contrasenia);
  }
}

Docente.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    contrasenia: {
      type: DataTypes.STRING(100),
      allowNull: false,
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
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    especialidad: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    domicilio: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    foto: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    idAdministrativo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_administrativo",
      references: {
        model: "administrativos",
        key: "id",
      },
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "docentes",
    createdAt: "fecha_de_alta",
    paranoid: false,
    indexes: [
      { unique: true, fields: ["email"] },
      { unique: true, fields: ["dni"] },
    ],
    hooks: {
      beforeValidate: (docente: Docente) => {
        if (docente.email) docente.email = docente.email.trim().toLowerCase();
        if (docente.contrasenia) docente.contrasenia = docente.contrasenia.trim();
        if (docente.nombre) docente.nombre = docente.nombre.trim();
        if (docente.apellido) docente.apellido = docente.apellido.trim();
        if (docente.dni) docente.dni = docente.dni.trim();
      },
      beforeCreate: async (docente: Docente) => {
        if (docente.contrasenia) {
          const salt = await bcrypt.genSalt(10);
          docente.contrasenia = await bcrypt.hash(docente.contrasenia, salt);
        }
      },
      beforeUpdate: async (docente: Docente) => {
        if (docente.changed("contrasenia") && docente.contrasenia) {
          const salt = await bcrypt.genSalt(10);
          docente.contrasenia = await bcrypt.hash(docente.contrasenia, salt);
        }
      },
    },
  }
);

export default Docente;