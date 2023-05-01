import { json, Request, Response } from "express";
import { parse } from "express-form-data";
import { Any } from "typeorm";

import { BEProducto, BEStock } from "../models";

export const ListarProductos = async (req: Request, res: Response) => {
     try {
          const { Destacado, Categoria, IdCategoria } = req.query;

          let Productos;

          if (Destacado === "true") {
               Productos = await BEProducto.find({
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
          } else if (Categoria === "true") {
               let idcategoria: number = parseInt(IdCategoria as string);

               Productos = await BEProducto.find({
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
          } else {
               Productos = await BEProducto.find({
                    relations: {
                         categoria: true,
                         color: true,
                         stock: true,
                    },
               });
               Productos.sort((a, b) => a.id - b.id);

          }
          return res.status(200).json(Productos);
     } catch (error: any) {
          return res.status(500).json({ message: error.message });
     }
};

export const MostrarNovedades = async (req: Request, res: Response) => {
     try {
          const Productos = await BEProducto.find({
               relations: {
                    categoria: true,
                    color: true,
                    stock: true,
               },
          });
          return res.json(Productos);
     } catch (error: any) {
          return res.status(500).json({ message: error.message });
     }
};
export const ObtenerProducto = async (req: Request, res: Response) => {
     try {
          const Id = parseInt(req.params.id);
          if (Id === 0) {
               return res
                    .status(404)
                    .json({ message: "No se encontro el codigo buscacdo" });
          } else {
               const Producto = await BEProducto.findOne({
                    where: { id: Id },
                    relations: {
                         categoria: true,
                         color: true,
                         stock: true,
                    },
               });

               if (Producto != null) {
                    return res.status(200).json(Producto);
               } else {
                    return res.status(404).json({
                         mensaje: "No se pudo encontrar el codigo buscado",
                    });
               }
          }
     } catch (error: any) {
          return res.status(500).json({ message: error.message });
     }
};

export const CrearProducto = async (req: Request, res: Response) => {
     try {
          const {
               titulo,
               descripcion,
               stock,
               categoria,
               imagen,
               color,
               precio
          } = req.body;
           const ID = parseInt(req.body.id);
          if (
               !titulo ||
               !descripcion ||
               !categoria ||
               !imagen ||
               !color ||
               !precio
          ) {
               return res
                    .status(400)
                    .json({ message: "Por favor ,  llene todos los campos " });
          } else {
               const producto = await BEProducto.findOne({ where: { id: ID } });
               if (producto) {
                    return res
                         .status(401)
                         .json({
                              message: "El Codigo de articulo ya se encuentra utlizado",
                         });
               } else {
                    let newStock = new BEStock();
                    newStock.S = parseInt(stock.S);
                    newStock.M = parseInt(stock.M);
                    newStock.L = parseInt(stock.L);
                    newStock.XL = parseInt(stock.XL);
                    await newStock.save();

                    let newProducto = new BEProducto();
                    newProducto.id = ID
                    newProducto.titulo = titulo;
                    newProducto.descripcion = descripcion;
                    newProducto.categoria = categoria;
                    newProducto.color = color;
                    newProducto.imagen = imagen;
                    newProducto.precio = precio;
                    newProducto.stock = newStock;
                    await newProducto.save();
                    return res.status(200).json(newProducto);
               }
          }
     } catch (error: any) {
          return res.status(500).json({ message: error.message });
     }
};

export const EliminarProducto = async (req: Request, res: Response) => {
     try {
          const Id = parseInt(req.params.id);
          if (Id === undefined || Id === 0) {
               return res
                    .status(404)
                    .json("Error el producto no se puede eliminar");
          } else {
               const productoExistente = await BEProducto.findOne({
                    where: {
                         id: Id,
                    },
               });

               if (productoExistente) {
                    await BEProducto.delete({ id: Id });
                    return res
                         .status(200)
                         .json(`Producto ${Id} Borrado satisfactoriamente`);
               } else {
                    return res
                         .status(404)
                         .json(`Producto ${Id} No se encontro`);
               }
          }
     } catch (error: any) {
          return res.status(500).json({ message: error.message });
     }
};

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

export const ActualizarProducto = async (req: Request, res: Response) => {
     try {
          const Id = parseInt(req.params.id);

          const { titulo, descripcion, stock, categoria, color } = req.body;
          const newProducto = req.body as BEProducto;
          let producto = await BEProducto.findOne({
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
               await producto.save();
               return res.status(200).json(producto);
          } else {
               return res
                    .status(404)
                    .json({ message: "el Producto no se encontrado" });
          }
     } catch (error: any) {
          return res.status(500).json({ message: error.message });
     }
};
