import { json, Request, Response } from 'express'
import { BEProducto, BEDetalle } from "../models";


export const ListarProductos = async (req: Request, res: Response) => {
    try {
        const Productos = await BEProducto.find({
            relations: {
                categoria: true,
                detalles: {
                    talle: true,
                    color: true
                }
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
                detalles: {
                    talle: true,
                    color: true
                }
            }
        })
        return res.json(Producto);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const CrearProducto = async (req: Request, res: Response) => {
    try {
        const { nombre, descripcion, detalles, categoria } = req.body;
        console.log(req.body)
        if (!nombre || !descripcion || !categoria)
            return res.status(400).json({ message: "Por favor ,  llene todos los campos " });
        else {

            let newProducto = new BEProducto()
            newProducto.nombre = nombre
            newProducto.descripcion = descripcion
            newProducto.categoria = categoria
            await newProducto.save()

            newProducto.detalles = detalles.map((detalle: BEDetalle) => {

                let newDetalle = new BEDetalle()
                newDetalle.id = parseInt(String(newProducto.id) + String(detalle.color.id) + String(detalle.talle.id))
                newDetalle.color = detalle.color
                newDetalle.producto = new BEProducto
                newDetalle.producto.id = newProducto.id
                newDetalle.talle = detalle.talle
                newDetalle.stock = detalle.stock
                newDetalle.save()
                return newDetalle
            })

            return res.json(newProducto);
        }
    } catch (error: any) {
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
                detalles: {
                    talle: true,
                    color: true
                }
            }
        })

        return res.json(producto);

    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}