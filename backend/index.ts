import "reflect-metadata"
import app from './app'
import { AppDataSource } from './database'

import indexRoutesCategorias from './routes/categoria.routes'
import indexRoutesProducto from './routes/producto.routes'
import indexRoutesColor from './routes/color.routes'
import indexRoutesTalle from './routes/talle.routes'
import indexRoutesDetalle from './routes/detalle.routes'

async function main() {
    await AppDataSource.initialize();
    app.listen(3000, () => {
        console.log('server on port', 3000)
    })
    app.get("/", function (req, res) {
        res.status(200).sendFile('./index.html');
    });
}
app.use(indexRoutesProducto)
app.use(indexRoutesCategorias)
app.use(indexRoutesColor)
app.use(indexRoutesTalle)
app.use(indexRoutesDetalle)

app.get("/prueba", function (req, res) {
    res.status(200).sendFile('./pruebita.html');
});

main();



