"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const BECategoria_1 = require("./models/BECategoria");
const BEProducto_1 = require("./models/BEProducto");
const BEDetalle_1 = require("./models/BEDetalle");
const BETalle_1 = require("./models/BETalle");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: '1234',
    database: 'Typeorm',
    port: 5432,
    entities: [BECategoria_1.categoria, BEProducto_1.producto, BEDetalle_1.detalle, BETalle_1.talle],
    logging: true,
    synchronize: true
});
