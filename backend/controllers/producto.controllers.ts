import { Request, Response } from 'express'
import { BEProducto } from "../models/BEProducto";
import { BEDetalle } from "../models/BEDetalle";
import { BECategoria } from '../models/BECategoria';



export const ListarProductos = async (req: Request, res: Response) => {
    try {
        const Productos = await BEProducto.find({ relations: ['categoria'] });
        res.json(Productos);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}
export const ObtenerProducto = async (req: Request, res: Response) => {
    try {
        const Id = parseInt(req.params.id);
        const Producto = await BEProducto.findOneBy({ id: Id })
        res.json(Producto);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const CrearProducto = async (req: Request, res: Response) => {
    try {
        const { nombre, descripcion, color, detalles, categoria } = req.body;
        console.log(req.body)
        if (!nombre || !descripcion || !categoria || !color)
            return res.status(400).json({ message: "Por favor ,  llene todos los campos " });
        else {

            const newProducto = new BEProducto()
            newProducto.nombre = nombre
            newProducto.descripcion = descripcion
            newProducto.detalles = detalles
            newProducto.categoria = categoria
            await newProducto.save()
            res.json(newProducto)
        }
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const EliminarProducto = async (req: Request, res: Response) => {
    try {
        const Id = parseInt(req.params.id);
        await BEProducto.delete({ id: Id });

        res.json(`Producto ${Id} Borrado satisfactoriamente`)
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

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