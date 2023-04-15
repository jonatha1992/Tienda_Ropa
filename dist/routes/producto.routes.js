"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const controllers_1 = require("../controllers");
_1.router.get("/productos", controllers_1.ListarProductos);
_1.router.get("/producto/:id", controllers_1.ObtenerProducto);
_1.router.post("/producto", controllers_1.CrearProducto);
_1.router.delete("/producto", controllers_1.EliminarProducto);
_1.router.put("/producto/:id", controllers_1.ActualizarProducto);
exports.default = _1.router;
//# sourceMappingURL=producto.routes.js.map