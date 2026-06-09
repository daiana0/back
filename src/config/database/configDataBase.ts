import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const database: string = process.env.DB_NAME!;
const username: string = process.env.DB_USER_M!;
const password: string = process.env.DB_PASSWORD!;
const host: string = process.env.DB_HOST!;
const dialect: string = process.env.DB_DIALECT_M!;

if (
    database === undefined ||
    username === undefined ||
    password === undefined ||
    host === undefined ||
    dialect === undefined
) {
    throw new Error("Faltan variables de entorno para la conexión a la base de datos");
}

export { Sequelize, database, username, password, host, dialect };