import express from 'express';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';
const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')));

app.get("/alta", function (req, res) {
    res.status(200).sendFile(path.join(__dirname, 'public/altaProducto.html'))
});




// console.log(path.resolve(__dirname, 'public'))
// app.use(express.static('dist/views'));
// app.use(express.static('frontend'));



export default app
