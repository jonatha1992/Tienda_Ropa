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
exports.ActualizarProducto = exports.EliminarProducto = exports.CrearProducto = exports.ObtenerProducto = exports.MostrarNovedades = exports.ListarProductos = void 0;
const models_1 = require("../models");
const ListarProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Destacado, Categoria, IdCategoria } = req.query;
        let Productos;
        if (Destacado === "true") {
            Productos = yield models_1.BEProducto.find({
                order: {
                    updateAt: "DESC",
                },
                relations: {
                    categoria: true,
                    color: true,
                    stock: true,
                },
                take: 20,
            });
        }
        else if (Categoria === "true") {
            let idcategoria = parseInt(IdCategoria);
            Productos = yield models_1.BEProducto.find({
                order: {
                    updateAt: "DESC",
                },
                relations: {
                    categoria: true,
                    color: true,
                    stock: true,
                },
                where: {
                    categoria: {
                        id: idcategoria,
                    },
                },
            });
        }
        else {
            Productos = yield models_1.BEProducto.find({
                relations: {
                    categoria: true,
                    color: true,
                    stock: true,
                },
            });
            Productos.sort((a, b) => a.id - b.id);
        }
        return res.status(200).json(Productos);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.ListarProductos = ListarProductos;
const MostrarNovedades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Productos = yield models_1.BEProducto.find({
            relations: {
                categoria: true,
                color: true,
                stock: true,
            },
        });
        return res.json(Productos);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.MostrarNovedades = MostrarNovedades;
const ObtenerProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = parseInt(req.params.id);
        if (Id === 0) {
            return res
                .status(404)
                .json({ message: "No se encontro el codigo buscacdo" });
        }
        else {
            const Producto = yield models_1.BEProducto.findOne({
                where: { id: Id },
                relations: {
                    categoria: true,
                    color: true,
                    stock: true,
                },
            });
            if (Producto != null) {
                return res.status(200).json(Producto);
            }
            else {
                return res.status(404).json({
                    mensaje: "No se pudo encontrar el codigo buscado",
                });
            }
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.ObtenerProducto = ObtenerProducto;
const CrearProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { titulo, descripcion, stock, categoria, imagen, color, precio } = req.body;
        const ID = parseInt(req.body.id);
        if (!titulo ||
            !descripcion ||
            !categoria ||
            !imagen ||
            !color ||
            !precio) {
            return res
                .status(400)
                .json({ message: "Por favor ,  llene todos los campos " });
        }
        else {
            const producto = yield models_1.BEProducto.findOne({ where: { id: ID } });
            if (producto) {
                return res
                    .status(401)
                    .json({
                    message: "El Codigo de articulo ya se encuentra utlizado",
                });
            }
            else {
                let newStock = new models_1.BEStock();
                newStock.S = parseInt(stock.S);
                newStock.M = parseInt(stock.M);
                newStock.L = parseInt(stock.L);
                newStock.XL = parseInt(stock.XL);
                yield newStock.save();
                let newProducto = new models_1.BEProducto();
                newProducto.id = ID;
                newProducto.titulo = titulo;
                newProducto.descripcion = descripcion;
                newProducto.categoria = categoria;
                newProducto.color = color;
                newProducto.imagen = imagen;
                newProducto.precio = precio;
                newProducto.stock = newStock;
                yield newProducto.save();
                return res.status(200).json(newProducto);
            }
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
        if (Id === undefined || Id === 0) {
            return res
                .status(404)
                .json("Error el producto no se puede eliminar");
        }
        else {
            const productoExistente = yield models_1.BEProducto.findOne({
                where: {
                    id: Id,
                },
            });
            if (productoExistente) {
                yield models_1.BEProducto.delete({ id: Id });
                return res
                    .status(200)
                    .json(`Producto ${Id} Borrado satisfactoriamente`);
            }
            else {
                return res
                    .status(404)
                    .json(`Producto ${Id} No se encontro`);
            }
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.EliminarProducto = EliminarProducto;
// export const ObtenerUltimoID = async (req: Request, res: Response) => {
//      try {
//           const Id = parseInt(req.params.id);
//           console.log(Id);
//           await BEProducto.delete({ id: Id });
//           return res.json(`Producto ${Id} Borrado satisfactoriamente`);
//      } catch (error: any) {
//           return res.status(500).json({ message: error.message });
//      }
// };
const ActualizarProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = parseInt(req.params.id);
        const { titulo, descripcion, stock, categoria, color } = req.body;
        const newProducto = req.body;
        let producto = yield models_1.BEProducto.findOne({
            where: { id: Id },
        });
        if (producto != null) {
            producto.titulo = newProducto.titulo;
            producto.descripcion = newProducto.descripcion;
            producto.categoria = newProducto.categoria;
            producto.color = newProducto.color;
            producto.imagen = newProducto.imagen;
            producto.precio = newProducto.precio;
            producto.stock = newProducto.stock;
            yield producto.save();
            return res.status(200).json(producto);
        }
        else {
            return res
                .status(404)
                .json({ message: "el Producto no se encontrado" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.ActualizarProducto = ActualizarProducto;
//# sourceMappingURL=producto.controllers.js.map