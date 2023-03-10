import { Request, Response } from 'express'
import { BECategoria } from "../models";



export const ListarCategorias = async (req: Request, res: Response) => {
    try {
        const BEcategorias = await BECategoria.find();
        return res.json(BEcategorias);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}
export const ObtenerCategoria = async (req: Request, res: Response) => {
    try {
        const Id = parseInt(req.params.id);
        const Categoria = await BECategoria.findOneBy({ id: Id })
        return res.status(200).json(Categoria);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const CrearCategoria = async (req: Request, res: Response) => {
    try {
        const { nombre } = req.body
        const NewBECategoria = new BECategoria();
        NewBECategoria.nombre = nombre
        await NewBECategoria.save()
        return res.status(200).json(NewBECategoria)

    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const EliminarCategoria = async (req: Request, res: Response) => {
    try {
        const Id = parseInt(req.params.id);
        const result = await BECategoria.delete({ id: Id });
        if (result.affected === 0)
            return res.status(404).json({ message: "Categoria no encontrada" });
        else
            return res.status(204).json(`Categoria ${Id} Borrado satisfactoriamente`)
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const ActualizarCategoria = async (req: Request, res: Response) => {
    const Id = parseInt(req.params.id);
    try {
        const categoria = await BECategoria.findOneBy({ id: Id });
        if (!categoria) {

            return res.status(404).json({ message: "Not user found" });
        }
        else {
            await BECategoria.update({ id: Id }, req.body);
            return res.sendStatus(204).json(categoria);
        }
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};