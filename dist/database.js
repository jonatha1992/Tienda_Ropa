"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const index_1 = require("./models/index");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: '1234',
    database: 'TiendaRopa',
    port: 5432,
    entities: [index_1.BECategoria, index_1.BEProducto, index_1.BEDetalle, index_1.BETalle, index_1.BEColor],
    logging: true,
    synchronize: true
});
