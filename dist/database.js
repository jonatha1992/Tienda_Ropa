"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const BECategoria_1 = require("./models/BECategoria");
const BEProducto_1 = require("./models/BEProducto");
const BEDetalle_1 = require("./models/BEDetalle");
const BETalle_1 = require("./models/BETalle");
const BEColor_1 = require("./models/BEColor");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: '1234',
    database: 'Typeorm',
    port: 5432,
    entities: [BECategoria_1.BECategoria, BEProducto_1.BEProducto, BEDetalle_1.BEDetalle, BETalle_1.BETalle, BEColor_1.BEColor],
    logging: true,
    synchronize: true
});
