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
exports.EliminarProducto = exports.CrearProducto = exports.ObtenerProducto = exports.ListarProductos = void 0;
const BEProducto_1 = require("../models/BEProducto");
const ListarProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Productos = yield BEProducto_1.BEProducto.find({ relations: ['categoria'] });
        res.json(Productos);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.ListarProductos = ListarProductos;
const ObtenerProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = parseInt(req.params.id);
        const Producto = yield BEProducto_1.BEProducto.findOneBy({ id: Id });
        res.json(Producto);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.ObtenerProducto = ObtenerProducto;
const CrearProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, descripcion, color, detalles, categoria } = req.body;
        console.log(req.body);
        if (!nombre || !descripcion || !categoria || !color)
            return res.status(400).json({ message: "Por favor ,  llene todos los campos " });
        else {
            const newProducto = new BEProducto_1.BEProducto();
            newProducto.nombre = nombre;
            newProducto.descripcion = descripcion;
            newProducto.detalles = detalles;
            newProducto.color = color;
            newProducto.categoria = categoria;
            yield newProducto.save();
            res.json(newProducto);
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
        yield BEProducto_1.BEProducto.delete({ id: Id });
        res.json(`Producto ${Id} Borrado satisfactoriamente`);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.EliminarProducto = EliminarProducto;
// export const ActualizarProducto = async (req: Request, res: Response) => {
//     try {
//         const Id = parseInt(req.params.id);
//         const { nombre, descripcion, talle, color, stock } = req.body;
//         await pool.query(`UPDATE producto SET nombre = ${nombre} , descripcion = ${descripcion} , talle = ${talle} , color =
//              ${color} , stock = ${stock} WHERE id = ${Id}`)
//         const newProducto = new producto(Id, nombre, descripcion, color)
//         res.json(newProducto);
//     } catch (error: any) {
//         return res.status(500).json({ message: error.message });
//     }
// }
