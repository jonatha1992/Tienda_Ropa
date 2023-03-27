import { DataSource } from 'typeorm';
import { BECategoria, BEProducto, BEColor, BEStock, BEUsuario } from './models';


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

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'tiendaropa.internal',
    username: 'postgres',
    password: 'ujxRNhmNI9DeXfk',
    database: 'TiendaRopa',
    port: 5432,
    entities: [BECategoria, BEProducto, BEStock, BEColor, BEUsuario],
    logging: true,
    synchronize: false,
});