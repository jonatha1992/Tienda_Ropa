"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
router.get("/categorias", controllers_1.ListarCategorias);
router.get("/categoria/:id", controllers_1.ObtenerCategoria);
router.post("/categoria", controllers_1.CrearCategoria);
router.delete("/producto/:id", controllers_1.EliminarCategoria);
router.put("/producto/:id", controllers_1.ActualizarCategoria);
exports.default = router;
//# sourceMappingURL=categoria.routes.js.map