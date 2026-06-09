import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../../../config/database/conexion.js';

interface TokenBlacklistAttributes extends InferAttributes<TokenBlacklist> {
  id: number;
  jti: string;
  exp: Date;
}

interface TokenBlacklistCreationAttributes extends InferCreationAttributes<TokenBlacklist> {
  jti: string;
  exp: Date;
}

class TokenBlacklist extends Model<TokenBlacklistAttributes, TokenBlacklistCreationAttributes> {
  declare id: CreationOptional<number>;
  declare jti: string;
  declare exp: Date;
}

TokenBlacklist.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    jti: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    exp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'token_blacklist',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['jti'] },
    ],
  }
);

export default TokenBlacklist;