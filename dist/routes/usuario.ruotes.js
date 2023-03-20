"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
router.post("/User", controllers_1.VerificarUsuario);
router.post("/RegisterUser", controllers_1.RegistrarUsuario);
exports.default = router;
