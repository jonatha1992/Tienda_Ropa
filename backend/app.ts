import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())
app.use(express.urlencoded({ extended: false }))

app.use(express.static("frontend"));


export default app
