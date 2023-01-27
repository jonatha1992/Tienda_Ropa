import { DataSource } from 'typeorm';
import { BECategoria } from './models/BECategoria';
import { BEProducto } from './models/BEProducto';
import { BEDetalle } from './models/BEDetalle';
import { BETalle } from './models/BETalle';
import { BEColor } from './models/BEColor';


export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: '1234',
    database: 'Typeorm',
    port: 5432,
    entities: [BECategoria, BEProducto, BEDetalle, BETalle, BEColor],
    logging: true,
    synchronize: true
});