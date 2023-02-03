"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
router.get("/detalles", controllers_1.ListarDetalles);
router.get("/detalle/:id", controllers_1.ObtenerDetalle);
router.post("/detalle", controllers_1.CrearDetalle);
router.delete("/detalle/:id", controllers_1.EliminarDetalle);
router.put("/detalle/:id", controllers_1.Actualizardetalle);
exports.default = router;
