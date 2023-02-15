"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
// import multer, { diskStorage } from 'multer';
// import path from 'path';
const cors_1 = __importDefault(require("cors"));
// import fileUpload from 'express-fileupload';
const app = (0, express_1.default)();
// const Diskstorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.resolve(__dirname + '/public/uploads'))
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// })
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)());
// app.use(fileUpload({
//     useTempFiles: true,
//     tempFileDir: path.resolve(__dirname + '/public/uploads')
// }))
// app.use(multer({
//     storage: Diskstorage,
// }).single('image'));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static("frontend"));
exports.default = app;
