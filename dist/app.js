"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
//rutas paginas
app.get("/alta", function (req, res) {
    res.status(200).sendFile(path_1.default.join(__dirname, 'public/altaProducto.html'));
});
app.get("/login", function (req, res) {
    res.status(200).sendFile(path_1.default.join(__dirname, 'public/login.html'));
});
// console.log(path.resolve(__dirname, 'public'))
// app.use(express.static('dist/views'));
// app.use(express.static('frontend'));
exports.default = app;
