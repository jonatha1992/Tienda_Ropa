"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const controllers_1 = require("../controllers");
_1.router.get("/colores", controllers_1.ListarColores);
_1.router.get("/color/:id", controllers_1.Obtenercolor);
_1.router.post("/color", controllers_1.CrearColor);
_1.router.delete("/color/:id", controllers_1.EliminarColor);
_1.router.put("/color/:id", controllers_1.ActualizarColor);
exports.default = _1.router;
//# sourceMappingURL=color.routes.js.map