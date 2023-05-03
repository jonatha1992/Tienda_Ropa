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
const routes_1 = require("./routes");
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.resolve(__dirname, 'public')));
//rutas paginas
app.use("/", routes_1.router);
routes_1.router.get("/", (req, res) => {
    res.status(200).sendFile(path_1.default.resolve(__dirname, 'public/views/index.html'));
});
routes_1.router.get("/alta", function (req, res) {
    res.status(200).sendFile(path_1.default.join(__dirname, 'public/views/NewAltaProducto.html'));
});
routes_1.router.get("/login", function (req, res) {
    res.status(200).sendFile(path_1.default.join(__dirname, 'public/views/login.html'));
});
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
exports.default = app;
//# sourceMappingURL=app.js.map