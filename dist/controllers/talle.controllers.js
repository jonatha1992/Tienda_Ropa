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
exports.ActualizarTalle = exports.EliminarTalle = exports.CrearTalle = exports.ObtenerTalle = exports.ListarTalles = void 0;
const BETalle_1 = require("../models/BETalle");
const ListarTalles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const BETalles = yield BETalle_1.BETalle.find();
        res.json(BETalles);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.ListarTalles = ListarTalles;
const ObtenerTalle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = parseInt(req.params.id);
        const Talle = yield BETalle_1.BETalle.findOneBy({ id: Id });
        res.status(200).json(Talle);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.ObtenerTalle = ObtenerTalle;
const CrearTalle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre } = req.body;
        const NewBETalle = new BETalle_1.BETalle();
        NewBETalle.nombre = nombre;
        yield NewBETalle.save();
        return res.status(200).json(NewBETalle);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.CrearTalle = CrearTalle;
const EliminarTalle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = parseInt(req.params.id);
        const result = yield BETalle_1.BETalle.delete({ id: Id });
        if (result.affected === 0)
            return res.status(404).json({ message: "Talle no encontrada" });
        else
            res.status(204).json(`Talle ${Id} Borrado satisfactoriamente`);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.EliminarTalle = EliminarTalle;
const ActualizarTalle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Id = parseInt(req.params.id);
    try {
        const Talle = yield BETalle_1.BETalle.findOneBy({ id: Id });
        if (!Talle)
            return res.status(404).json({ message: "Not user found" });
        yield BETalle_1.BETalle.update({ id: Id }, req.body);
        return res.sendStatus(204);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
exports.ActualizarTalle = ActualizarTalle;
