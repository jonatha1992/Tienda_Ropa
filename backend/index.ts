import "reflect-metadata"
import app from './app'
import { AppDataSource } from './database'
import path from 'path';

import indexRoutesCategorias from './routes/categoria.routes'
import indexRoutesProducto from './routes/producto.routes'
import indexRoutesColor from './routes/color.routes'
import express from "express";

async function main() {
    await AppDataSource.initialize();
    app.listen(3000, () => {
        console.log('server on port', 3000)
    })
}

app.get("/alta", function (req, res) {
    res.status(200).sendFile('altaProducto.html')
});

// app.get("/", function (req, res) {
//     res.status(200).sendFile('index.html')
// });

app.use(indexRoutesProducto)
app.use(indexRoutesCategorias)
app.use(indexRoutesColor)

main();



