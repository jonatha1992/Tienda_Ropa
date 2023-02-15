"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const models_1 = require("./models");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'Pentagono123',
    database: 'TiendaRopa',
    port: 5432,
    entities: [models_1.BECategoria, models_1.BEProducto, models_1.BEStock, models_1.BEColor],
    logging: true,
    synchronize: true
});
