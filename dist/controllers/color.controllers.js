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
exports.ActualizarColor = exports.EliminarColor = exports.CrearColor = exports.Obtenercolor = exports.ListarColores = void 0;
const BEColor_1 = require("../models/BEColor");
const ListarColores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const BEColores = yield BEColor_1.BEColor.find();
        return res.json(BEColores);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.ListarColores = ListarColores;
const Obtenercolor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = parseInt(req.params.id);
        const Color = yield BEColor_1.BEColor.findOneBy({ id: Id });
        return res.status(200).json(Color);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.Obtenercolor = Obtenercolor;
const CrearColor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre } = req.body;
        const NewColor = new BEColor_1.BEColor();
        NewColor.nombre = nombre;
        yield NewColor.save();
        return res.status(200).json(NewColor);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.CrearColor = CrearColor;
const EliminarColor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = parseInt(req.params.id);
        const result = yield BEColor_1.BEColor.delete({ id: Id });
        if (result.affected === 0)
            return res.status(404).json({ message: "Talle no encontrada" });
        else
            return res.status(204).json(`Talle ${Id} Borrado satisfactoriamente`);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.EliminarColor = EliminarColor;
const ActualizarColor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Id = parseInt(req.params.id);
    try {
        const Color = yield BEColor_1.BEColor.findOneBy({ id: Id });
        if (!Color) {
            return res.status(404).json({ message: "Not user found" });
        }
        else {
            yield BEColor_1.BEColor.update({ id: Id }, req.body);
            return res.sendStatus(204).json(Color);
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.ActualizarColor = ActualizarColor;
//# sourceMappingURL=color.controllers.js.map