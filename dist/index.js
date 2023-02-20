"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const app_1 = __importDefault(require("./app"));
const database_1 = require("./database");
const categoria_routes_1 = __importDefault(require("./routes/categoria.routes"));
const producto_routes_1 = __importDefault(require("./routes/producto.routes"));
const color_routes_1 = __importDefault(require("./routes/color.routes"));
const usuario_ruotes_1 = __importDefault(require("./routes/usuario.ruotes"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.AppDataSource.initialize();
        app_1.default.listen(3000, () => {
            console.log('server on port', 3000);
        });
    });
}
app_1.default.use(producto_routes_1.default);
app_1.default.use(categoria_routes_1.default);
app_1.default.use(color_routes_1.default);
app_1.default.use(usuario_ruotes_1.default);
main();
