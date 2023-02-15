import { json, Request, Response } from 'express'

import { BEProducto, BEStock } from "../models";


export const ListarProductos = async (req: Request, res: Response) => {
    try {
        const Productos = await BEProducto.find({
            relations: {
                categoria: true,
                color: true,
                stock: true
            }
        });
        return res.json(Productos);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}
export const ObtenerProducto = async (req: Request, res: Response) => {
    try {
        const Id = parseInt(req.params.id);
        const Producto = await BEProducto.findOne({
            where: { id: Id }, relations: {
                categoria: true,
                color: true,
                stock: true
            }
        })
        return res.json(Producto);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const CrearProducto = async (req: Request, res: Response) => {
    try {
        const { nombre, descripcion, stock, categoria, image, color, precio } = req.body;
        const producto = req.body as BEProducto;
        // console.log(req.body)
        console.log(producto)

        if (!nombre || !descripcion || !categoria)
            return res.status(400).json({ message: "Por favor ,  llene todos los campos " });
        else {


            let newStock = new BEStock()
            newStock.S = stock.S
            newStock.L = stock.L
            newStock.M = stock.M
            newStock.XL = stock.XL
            await newStock.save()

            let newProducto = new BEProducto()
            newProducto.nombre = nombre
            newProducto.descripcion = descripcion
            newProducto.categoria = categoria
            newProducto.color = color
            newProducto.image = image
            newProducto.precio = precio
            newProducto.stock = newStock
            await newProducto.save()


            return res.json(newProducto);

        }


    }
    catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const SubirImagen = async (req: Request, res: Response) => {
    try {
        console.log(req.files)
        return res.send("Subiendo imagen")
    }
    catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const EliminarProducto = async (req: Request, res: Response) => {
    try {
        const Id = parseInt(req.params.id);
        console.log(Id)
        await BEProducto.delete({ id: Id });

        return res.json(`Producto ${Id} Borrado satisfactoriamente`)
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const ActualizarProducto = async (req: Request, res: Response) => {
    try {
        const Id = parseInt(req.params.id);
        const { nombre, descripcion, detalles, categoria } = req.body;

        let producto = await BEProducto.findOne({
            where: { id: Id }, relations: {
                categoria: true,
                color: true,
                stock: true
            }
        })

        return res.json(producto);

    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}