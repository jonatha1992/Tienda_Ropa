"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
router.get("/colores", controllers_1.ListarColores);
router.get("/color/:id", controllers_1.Obtenercolor);
router.post("/color", controllers_1.CrearColor);
router.delete("/color/:id", controllers_1.EliminarColor);
router.put("/color/:id", controllers_1.ActualizarColor);
exports.default = router;
//# sourceMappingURL=color.routes.js.map