import { Request, Response } from 'express'
import { BEDetalle } from "../models";



export const ListarDetalles = async (req: Request, res: Response) => {
    try {
        const BEDetalles = await BEDetalle.find();
        res.json(BEDetalles);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}
export const ObtenerDetalle = async (req: Request, res: Response) => {
    try {
        const Id = parseInt(req.params.id);
        const detalle = await BEDetalle.findOneBy({ id: Id })
        res.status(200).json(detalle);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const CrearDetalle = async (req: Request, res: Response) => {
    try {
        const { producto, talle, color, stock } = req.body
        const NewBEdetalle = new BEDetalle();
        if (!producto || !talle || !color || stock) {
            return res.status(400).json({ message: "Por favor ,  llene todos los campos " });
        }
        else {
            NewBEdetalle.talle = talle
            NewBEdetalle.color = color
            NewBEdetalle.stock = stock
            await NewBEdetalle.save()
            return res.status(200).json(NewBEdetalle)
        }

    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const EliminarDetalle = async (req: Request, res: Response) => {
    try {
        const Id = parseInt(req.params.id);
        const result = await BEDetalle.delete({ id: Id });
        if (result.affected === 0)
            return res.status(404).json({ message: "Talle no encontrada" });
        else
            res.status(204).json(`Talle ${Id} Borrado satisfactoriamente`)
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const Actualizardetalle = async (req: Request, res: Response) => {
    const Id = parseInt(req.params.id);
    try {
        const Talle = await BEDetalle.findOneBy({ id: Id });
        if (!Talle) return res.status(404).json({ message: "Not user found" });

        await BEDetalle.update({ id: Id }, req.body);
        return res.sendStatus(204);

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};