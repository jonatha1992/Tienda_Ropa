import { DataSource } from 'typeorm';
import { categoria } from './models/BECategoria';
import { producto } from './models/BEProducto';
import { detalle } from './models/BEDetalle';
import { talle } from './models/BETalle';


export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: '1234',
    database: 'Typeorm',
    port: 5432,
    entities: [categoria, producto, detalle, talle],
    logging: true,
    synchronize: true
});