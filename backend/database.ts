import { DataSource } from 'typeorm';
import { BECategoria, BEProducto, BEColor, BEDetalle, BETalle } from './models';


export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'Pentagono123',
    database: 'TiendaRopa',
    port: 5432,
    entities: [BECategoria, BEProducto, BEDetalle, BETalle, BEColor],
    logging: true,
    synchronize: false
});