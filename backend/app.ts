import express from 'express';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';
const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.use(express.urlencoded({ extended: false }))
app.use('/api', express.static(path.join(__dirname, '/views')));

export default app
