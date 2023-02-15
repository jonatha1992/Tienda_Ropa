import { DataSource } from 'typeorm';
import { BECategoria, BEProducto, BEColor, BEStock } from './models';


export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: '1234',
    database: 'TiendaRopa',
    port: 5432,
    entities: [BECategoria, BEProducto, BEStock, BEColor],
    logging: true,
    synchronize: false
});