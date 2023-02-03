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
exports.ActualizarProducto = exports.EliminarProducto = exports.CrearProducto = exports.ObtenerProducto = exports.ListarProductos = void 0;
const models_1 = require("../models");
const ListarProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Productos = yield models_1.BEProducto.find({
            relations: {
                categoria: true,
                detalles: {
                    talle: true,
                    color: true
                }
            }
        });
        return res.json(Productos);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.ListarProductos = ListarProductos;
const ObtenerProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = parseInt(req.params.id);
        const Producto = yield models_1.BEProducto.findOne({
            where: { id: Id }, relations: {
                categoria: true,
                detalles: {
                    talle: true,
                    color: true
                }
            }
        });
        return res.json(Producto);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.ObtenerProducto = ObtenerProducto;
const CrearProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, descripcion, detalles, categoria } = req.body;
        console.log(req.body);
        if (!nombre || !descripcion || !categoria)
            return res.status(400).json({ message: "Por favor ,  llene todos los campos " });
        else {
            let newProducto = new models_1.BEProducto();
            newProducto.nombre = nombre;
            newProducto.descripcion = descripcion;
            newProducto.categoria = categoria;
            yield newProducto.save();
            newProducto.detalles = detalles.map((detalle) => {
                let newDetalle = new models_1.BEDetalle();
                newDetalle.id = parseInt(String(newProducto.id) + String(detalle.color.id) + String(detalle.talle.id));
                newDetalle.color = detalle.color;
                newDetalle.producto = new models_1.BEProducto;
                newDetalle.producto.id = newProducto.id;
                newDetalle.talle = detalle.talle;
                newDetalle.stock = detalle.stock;
                newDetalle.save();
                return newDetalle;
            });
            return res.json(newProducto);
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.CrearProducto = CrearProducto;
const EliminarProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = parseInt(req.params.id);
        console.log(Id);
        yield models_1.BEProducto.delete({ id: Id });
        return res.json(`Producto ${Id} Borrado satisfactoriamente`);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.EliminarProducto = EliminarProducto;
const ActualizarProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = parseInt(req.params.id);
        const { nombre, descripcion, detalles, categoria } = req.body;
        let producto = yield models_1.BEProducto.findOne({
            where: { id: Id }, relations: {
                categoria: true,
                detalles: {
                    talle: true,
                    color: true
                }
            }
        });
        return res.json(producto);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.ActualizarProducto = ActualizarProducto;
