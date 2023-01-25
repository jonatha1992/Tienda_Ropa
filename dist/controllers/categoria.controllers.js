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
exports.ActualizarCategoria = exports.EliminarCategoria = exports.CrearCategoria = exports.ObtenerCategoria = exports.ListarCategorias = void 0;
const BECategoria_1 = require("../models/BECategoria");
const ListarCategorias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const BEcategorias = yield BECategoria_1.BECategoria.find();
        res.json(BEcategorias);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.ListarCategorias = ListarCategorias;
const ObtenerCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = parseInt(req.params.id);
        const Categoria = yield BECategoria_1.BECategoria.findOneBy({ id: Id });
        res.status(200).json(Categoria);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.ObtenerCategoria = ObtenerCategoria;
const CrearCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre } = req.body;
        const NewBECategoria = new BECategoria_1.BECategoria();
        NewBECategoria.nombre = nombre;
        yield NewBECategoria.save();
        return res.status(200).json(NewBECategoria);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.CrearCategoria = CrearCategoria;
const EliminarCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = parseInt(req.params.id);
        const result = yield BECategoria_1.BECategoria.delete({ id: Id });
        if (result.affected === 0)
            return res.status(404).json({ message: "Categoria no encontrada" });
        else
            res.status(204).json(`Categoria ${Id} Borrado satisfactoriamente`);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.EliminarCategoria = EliminarCategoria;
const ActualizarCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Id = parseInt(req.params.id);
    try {
        const categoria = yield BECategoria_1.BECategoria.findOneBy({ id: Id });
        if (!categoria)
            return res.status(404).json({ message: "Not user found" });
        yield BECategoria_1.BECategoria.update({ id: Id }, req.body);
        return res.sendStatus(204);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
exports.ActualizarCategoria = ActualizarCategoria;
