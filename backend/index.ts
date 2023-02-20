import "reflect-metadata"
import app from './app'
import path from 'path'
import { AppDataSource } from './database'
import indexRoutesCategorias from './routes/categoria.routes'
import indexRoutesProducto from './routes/producto.routes'
import indexRoutesColor from './routes/color.routes'
import indexRoutesUsuario from './routes/usuario.ruotes'

async function main() {
    await AppDataSource.initialize();

    app.listen(3000, () => {
        console.log('server on port', 3000)
    })
}

app.use(indexRoutesProducto)
app.use(indexRoutesCategorias)
app.use(indexRoutesColor)
app.use(indexRoutesUsuario)

main();



