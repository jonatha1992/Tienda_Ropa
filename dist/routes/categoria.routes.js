"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const controllers_1 = require("../controllers");
_1.router.get("/categorias", controllers_1.ListarCategorias);
_1.router.get("/categoria/:id", controllers_1.ObtenerCategoria);
_1.router.post("/categoria", controllers_1.CrearCategoria);
_1.router.delete("/categoria/:id", controllers_1.EliminarCategoria);
_1.router.put("/categoria/:id", controllers_1.ActualizarCategoria);
exports.default = _1.router;
//# sourceMappingURL=categoria.routes.js.map