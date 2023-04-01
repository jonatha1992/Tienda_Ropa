import { Request, Response } from 'express'
import { BEColor } from "../models/BEColor";



export const ListarColores = async (req: Request, res: Response) => {
    try {
        const BEColores = await BEColor.find();
        return res.json(BEColores);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}
export const Obtenercolor = async (req: Request, res: Response) => {
    try {
        const Id = parseInt(req.params.id);
        const Color = await BEColor.findOneBy({ id: Id })
        return res.status(200).json(Color);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const CrearColor = async (req: Request, res: Response) => {
    try {
        const { nombre } = req.body
        const NewColor = new BEColor();
        NewColor.nombre = nombre
        await NewColor.save()
        return res.status(200).json(NewColor)

    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const EliminarColor = async (req: Request, res: Response) => {
    try {
        const Id = parseInt(req.params.id);
        const result = await BEColor.delete({ id: Id });
        if (result.affected === 0)
            return res.status(404).json({ message: "Talle no encontrada" });
        else
            return res.status(204).json(`Talle ${Id} Borrado satisfactoriamente`)
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const ActualizarColor = async (req: Request, res: Response) => {
    const Id = parseInt(req.params.id);
    try {
        const Color = await BEColor.findOneBy({ id: Id });
        if (!Color) {
            return res.status(404).json({ message: "Not user found" });
        } else {
            await BEColor.update({ id: Id }, req.body);
            return res.sendStatus(204).json(Color);
        }

    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};