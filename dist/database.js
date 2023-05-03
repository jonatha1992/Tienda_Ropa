"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const models_1 = require("./models");
// export const AppDataSource = new DataSource({
//     type: 'postgres',
//     host: 'localhost',
//     username: 'postgres',
//     password: '1234',
//     database: 'TiendaRopa',
//     port: 5432,
//     entities: [BECategoria, BEProducto, BEStock, BEColor, BEUsuario],
//     logging: true,
//     synchronize: false,
// });
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'containers-us-west-168.railway.app',
    username: 'postgres',
    password: 'skeq68otyuRGni92ux5A',
    database: 'railway',
    port: 6263,
    entities: [models_1.BECategoria, models_1.BEProducto, models_1.BEStock, models_1.BEColor, models_1.BEUsuario],
    logging: true,
    synchronize: true
});
//# sourceMappingURL=database.js.map