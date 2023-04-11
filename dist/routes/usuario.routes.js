"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const controllers_1 = require("../controllers");
_1.router.post("/User", controllers_1.VerificarUsuario);
_1.router.post("/RegisterUser", controllers_1.RegistrarUsuario);
exports.default = _1.router;
//# sourceMappingURL=usuario.routes.js.map