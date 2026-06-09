import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../../../config/database/conexion.js';

interface NotificacionAttributes extends InferAttributes<notificacionXEmail> {
  id: number;
  emisor: string;
  receptor: string;
  asunto: string;
  mensaje: string;
  enviado: boolean;
  prioridad: string;// "baja", "media", "alta"
  fechaCreacion: Date;
}
interface NotificacionCreationAttributes extends InferCreationAttributes<notificacionXEmail> {
  emisor: string;
  receptor: string;
  asunto: string;
  mensaje: string;
}
class notificacionXEmail extends Model<NotificacionAttributes, NotificacionCreationAttributes> {
  declare id: CreationOptional<number>;
  declare emisor: string;
  declare receptor: string;
  declare asunto: string;
  declare mensaje: string;
  declare enviado: CreationOptional<boolean>;
  declare prioridad: CreationOptional<string>;
  declare fechaCreacion: CreationOptional<Date>;
}

notificacionXEmail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    emisor: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    receptor: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    asunto: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    enviado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    prioridad: {
      type: DataTypes.ENUM('baja', 'media', 'alta'),
      allowNull: false,
      defaultValue: 'baja'
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'notificaciones_x_email',
    timestamps: false,
  }
);

export default notificacionXEmail;