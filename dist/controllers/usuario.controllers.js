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
exports.VerificarUsuario = void 0;
const models_1 = require("../models");
const VerificarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let posibleUsuario = req.body;
        const usuario = yield models_1.BEUsuario.findOne({
            where: {
                email: posibleUsuario.email,
                password: posibleUsuario.password
            }
        });
        if (!usuario) {
            return res.status(400).json({ message: "Usuario No verificado" });
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
