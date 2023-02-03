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
exports.Actualizardetalle = exports.EliminarDetalle = exports.CrearDetalle = exports.ObtenerDetalle = exports.ListarDetalles = void 0;
const models_1 = require("../models");
const ListarDetalles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const BEDetalles = yield models_1.BEDetalle.find();
        return res.json(BEDetalles);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.ListarDetalles = ListarDetalles;
const ObtenerDetalle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = parseInt(req.params.id);
        const detalle = yield models_1.BEDetalle.findOneBy({ id: Id });
        return res.status(200).json(detalle);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.ObtenerDetalle = ObtenerDetalle;
const CrearDetalle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { producto, talle, color, stock } = req.body;
        const NewBEdetalle = new models_1.BEDetalle();
        if (!producto || !talle || !color || stock) {
            return res.status(400).json({ message: "Por favor ,  llene todos los campos " });
        }
        else {
            NewBEdetalle.talle = talle;
            NewBEdetalle.color = color;
            NewBEdetalle.stock = stock;
            yield NewBEdetalle.save();
            return res.status(200).json(NewBEdetalle);
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.CrearDetalle = CrearDetalle;
const EliminarDetalle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = parseInt(req.params.id);
        const result = yield models_1.BEDetalle.delete({ id: Id });
        if (result.affected === 0)
            return res.status(404).json({ message: "Talle no encontrada" });
        else
            return res.status(204).json(`Talle ${Id} Borrado satisfactoriamente`);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.EliminarDetalle = EliminarDetalle;
const Actualizardetalle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Id = parseInt(req.params.id);
    try {
        const Talle = yield models_1.BEDetalle.findOneBy({ id: Id });
        if (!Talle) {
            return res.status(404).json({ message: "Not user found" });
        }
        else {
            yield models_1.BEDetalle.update({ id: Id }, req.body);
            return res.sendStatus(204);
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.Actualizardetalle = Actualizardetalle;
