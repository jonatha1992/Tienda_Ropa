"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
router.get("/productos", controllers_1.ListarProductos);
router.get("/producto/:id", controllers_1.ObtenerProducto);
router.post("/producto", controllers_1.CrearProducto);
router.delete("/producto/:id", controllers_1.EliminarProducto);
router.put("/producto/:id", controllers_1.ActualizarProducto);
exports.default = router;
//# sourceMappingURL=producto.routes.js.map