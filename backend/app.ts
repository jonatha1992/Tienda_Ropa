import express from 'express';
import morgan from 'morgan';
// import multer, { diskStorage } from 'multer';
// import path from 'path';
import cors from 'cors';
// import fileUpload from 'express-fileupload';
const app = express()

// const Diskstorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.resolve(__dirname + '/public/uploads'))
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// })


app.use(express.json())
app.use(morgan('dev'))
app.use(cors())
// app.use(fileUpload({
//     useTempFiles: true,
//     tempFileDir: path.resolve(__dirname + '/public/uploads')
// }))

// app.use(multer({
//     storage: Diskstorage,
// }).single('image'));

app.use(express.urlencoded({ extended: false }))

app.use(express.static("frontend"));


export default app
