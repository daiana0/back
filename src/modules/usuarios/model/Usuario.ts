import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../../../config/database/conexion.js";
import bcrypt from "bcrypt";

interface UsuarioAttributes extends InferAttributes<Usuario> {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  contrasenia: string;
  activo: boolean;
}

interface UsuarioCreationAttributes extends InferCreationAttributes<Usuario> {
  nombre: string;
  apellido: string;
  email: string;
  contrasenia: string;
}

class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes> {
  declare id: CreationOptional<number>;
  declare nombre: string;
  declare apellido: string;
  declare email: string;
  declare contrasenia: string;
  declare activo: CreationOptional<boolean>;


  async validarContrasenia(contraseniaIngresada: string): Promise<boolean> {
    if (!this.contrasenia) return false;
    return bcrypt.compare(contraseniaIngresada, this.contrasenia);
  }
}

Usuario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "usuarios",
    timestamps: true,
    paranoid: false,
    indexes: [{ unique: true, fields: ["email"] }],
    hooks: {
      beforeValidate: (usuario: Usuario) => {
        if (usuario.email) usuario.email = usuario.email.trim().toLowerCase();
        if (usuario.contrasenia) usuario.contrasenia = usuario.contrasenia.trim();
        if (usuario.nombre) usuario.nombre = usuario.nombre.trim();
        if (usuario.apellido) usuario.apellido = usuario.apellido.trim();
      },
      beforeCreate: async (usuario: Usuario) => {
        if (usuario.contrasenia) {
          const salt = await bcrypt.genSalt(10);
          usuario.contrasenia = await bcrypt.hash(usuario.contrasenia, salt);
        }
      },
      beforeUpdate: async (usuario: Usuario) => {
        if (usuario.changed("contrasenia") && usuario.contrasenia) {
          const salt = await bcrypt.genSalt(10);
          usuario.contrasenia = await bcrypt.hash(usuario.contrasenia, salt);
        }
      },
    },
  }
);

export default Usuario;