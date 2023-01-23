import "reflect-metadata"
import app from './app'
import { AppDataSource } from './database'

import indexRoutesCategorias from './routes/categoria.routes'
import indexRoutesProducto from './routes/producto.routes'

async function main() {
    await AppDataSource.initialize();
    app.listen(3000, () => {
        console.log('server on port', 3000)
    })
}
app.use(indexRoutesCategorias)
app.use(indexRoutesProducto)

main();



