import { Sequelize, database, username, password, host, dialect } from "./configDataBase.js";

const sequelize = new Sequelize(database, username, password, {
    host,
    dialect: dialect as "mysql",
    logging: false
});

export default sequelize;