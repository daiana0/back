import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../../../config/database/conexion.js";
import bcrypt from "bcrypt";

interface AdministrativoAttributes extends InferAttributes<Administrativo> {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  contrasenia: string;
  telefono: string;
  domicilio: string;
  idRol: number;
  activo: boolean;
}

interface AdministrativoCreationAttributes extends InferCreationAttributes<Administrativo> {
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  contrasenia: string;
  telefono: string;
  domicilio: string;
  idRol: number;
  activo: CreationOptional<boolean>;
}

class Administrativo extends Model<AdministrativoAttributes, AdministrativoCreationAttributes> {
  declare id: CreationOptional<number>;
  declare nombre: string;
  declare apellido: string;
  declare email: string;
  declare dni: string;
  declare contrasenia: string;
  declare telefono: string;
  declare domicilio: string;
  declare idRol: number;
  declare activo: CreationOptional<boolean>;

  async validarContrasenia(contraseniaIngresada: string): Promise<boolean> {
    if (!this.contrasenia) return false;
    return bcrypt.compare(contraseniaIngresada, this.contrasenia);
  }
}

Administrativo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "El nombre es obligatorio" },
      },
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "El apellido es obligatorio" },
      },
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
    contrasenia: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    domicilio: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    idRol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_rol",
      references: {
        model: "roles",
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
    tableName: "administrativos",
    timestamps: true,
    paranoid: false,
    indexes: [
      { unique: true, fields: ["email"] },
      { unique: true, fields: ["dni"] },
    ],
    hooks: {
      beforeValidate: (administrativo: Administrativo) => {
        if (administrativo.email) {
          administrativo.email = administrativo.email.trim().toLowerCase();
        }
        if (administrativo.contrasenia) {
          administrativo.contrasenia = administrativo.contrasenia.trim();
        }
        if (administrativo.nombre) administrativo.nombre = administrativo.nombre.trim();
        if (administrativo.apellido) administrativo.apellido = administrativo.apellido.trim();
        if (administrativo.dni) administrativo.dni = administrativo.dni.trim();
      },
      beforeCreate: async (administrativo: Administrativo) => {
        if (administrativo.contrasenia) {
          const salt = await bcrypt.genSalt(10);
          administrativo.contrasenia = await bcrypt.hash(administrativo.contrasenia, salt);
        }
      },
      beforeUpdate: async (administrativo: Administrativo) => {
        if (administrativo.changed("contrasenia") && administrativo.contrasenia) {
          const salt = await bcrypt.genSalt(10);
          administrativo.contrasenia = await bcrypt.hash(administrativo.contrasenia, salt);
        }
      },
    },
  }
);

export default Administrativo;