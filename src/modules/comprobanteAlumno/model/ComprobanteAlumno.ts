import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../../../config/database/conexion.js";

interface ComprobanteAlumnoAttributes extends InferAttributes<ComprobanteAlumno> {
  id: number;
  idMovimientoFinanciero: number;
  urlComprobante: string;
  concepto: string;
  fechaCarga: Date;
  estado: string;
  fechaConfirmacion: Date | null;
  idAdministrativo: number | null;
}

interface ComprobanteAlumnoCreationAttributes extends InferCreationAttributes<ComprobanteAlumno> {
  idMovimientoFinanciero: number;
  urlComprobante: string;
  concepto: string;
  estado: string;
  fechaConfirmacion: Date | null;
  idAdministrativo: number | null;
}

class ComprobanteAlumno extends Model<ComprobanteAlumnoAttributes, ComprobanteAlumnoCreationAttributes> {
  declare id: CreationOptional<number>;
  declare idMovimientoFinanciero: number;
  declare urlComprobante: string;
  declare concepto: string;
  declare fechaCarga: CreationOptional<Date>;
  declare estado: string;
  declare fechaConfirmacion: Date | null;
  declare idAdministrativo: number | null;
}

ComprobanteAlumno.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idMovimientoFinanciero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_movimiento_financiero",
      references: { model: "movimientos_financieros", key: "id" },
    },
    urlComprobante: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: "url_comprobante",
    },
    concepto: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    fechaCarga: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "fecha_carga",
    },
    estado: {
      type: DataTypes.ENUM("VALIDADO", "NO_VALIDADO"),
      defaultValue: "NO_VALIDADO",
    },
    fechaConfirmacion: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "fecha_confirmacion",
    },
    idAdministrativo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "id_administrativo",
      references: { model: "administrativos", key: "id" }
    },
  },
  {
    sequelize,
    tableName: "comprobantes_alumnos",
    timestamps: false,
  }
);

export default ComprobanteAlumno;