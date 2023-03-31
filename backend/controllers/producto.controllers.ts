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
          }

          console.log(Productos);
          return res.json(Productos);
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
          const Producto = await BEProducto.findOne({
               where: { id: Id },
               relations: {
                    categoria: true,
                    color: true,
                    stock: true,
               },
          });
          return res.json(Producto);
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
               precio,
          } = req.body;
          const producto = req.body as BEProducto;
          console.log(producto);

          if (!titulo || !descripcion || !categoria)
               return res
                    .status(400)
                    .json({ message: "Por favor ,  llene todos los campos " });
          else {
               let newStock = new BEStock();
               newStock.S = parseInt(stock.s);
               newStock.L = parseInt(stock.l);
               newStock.M = parseInt(stock.m);
               newStock.XL = parseInt(stock.xl);
               await newStock.save();

               let newProducto = new BEProducto();
               newProducto.titulo = titulo;
               newProducto.descripcion = descripcion;
               newProducto.categoria = categoria;
               newProducto.color = color;
               newProducto.imagen = imagen;
               newProducto.precio = precio;
               newProducto.stock = newStock;
               await newProducto.save();

               return res.json(newProducto);
          }
     } catch (error: any) {
          return res.status(500).json({ message: error.message });
     }
};

export const EliminarProducto = async (req: Request, res: Response) => {
     try {
          const Id = parseInt(req.params.id);
          console.log(Id);
          await BEProducto.delete({ id: Id });

          return res.json(`Producto ${Id} Borrado satisfactoriamente`);
     } catch (error: any) {
          return res.status(500).json({ message: error.message });
     }
};

export const ActualizarProducto = async (req: Request, res: Response) => {
     try {
          const Id = parseInt(req.params.id);
          const { titulo, descripcion, detalles, categoria } = req.body;

          let producto = await BEProducto.findOne({
               where: { id: Id },
               relations: {
                    categoria: true,
                    color: true,
                    stock: true,
               },
          });

          return res.json(producto);
     } catch (error: any) {
          return res.status(500).json({ message: error.message });
     }
};
