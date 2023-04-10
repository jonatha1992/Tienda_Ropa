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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrarUsuario = exports.VerificarUsuario = void 0;
const models_1 = require("../models");
const VerificarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let posibleUsuario = req.body;
        console.log('consulta ', posibleUsuario);
        const usuario = yield models_1.BEUsuario.findOne({
            where: {
                email: posibleUsuario.email,
                password: posibleUsuario.password
            }
        });
        if (!usuario) {
            return res.status(400).json({ verificado: false });
        }
        else {
            return res.status(200).json({ verificado: true });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.VerificarUsuario = VerificarUsuario;
const RegistrarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password } = req.body;
        console.log('consulta ', req.body);
        const usuario = yield models_1.BEUsuario.findOne({
            where: {
                email: email
            }
        });
        if (usuario != null)
            return res.status(400).json({ message: "el nombre del usuario ya se encuentra logueado" });
        else {
            let nuevoUser = new models_1.BEUsuario;
            nuevoUser.email = email;
            nuevoUser.password = password;
            yield nuevoUser.save();
            if (!nuevoUser) {
                return res.status(400).json({ verificado: false });
            }
            else {
                return res.status(200).json({ verificado: true });
            }
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.RegistrarUsuario = RegistrarUsuario;
//# sourceMappingURL=usuario.controllers.js.map