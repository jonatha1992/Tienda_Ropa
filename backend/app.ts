import express from 'express';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';
const app = express()

import {router} from './routes';

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())
app.use(express.urlencoded({ extended: false }))


app.use(express.static(path.resolve(__dirname, 'public')));

//rutas paginas
app.use("/", router);




// app.use("/alta", function (req, res) {
//     res.status(200).sendFile(path.join(__dirname, 'public/view/NewAltaProducto.html'))
// });

// app.get("/login", function (req, res) {
//     res.status(200).sendFile(path.join(__dirname, 'public/view/login.html'))
// });
// app.get("/", function (req, res) {
//     res.status(200).sendFile(path.join(__dirname, 'public/view/index.html'))
// });




// console.log(path.resolve(__dirname, 'public'))
// app.use(express.static('dist/views'));
// app.use(express.static('frontend'));



export default app
