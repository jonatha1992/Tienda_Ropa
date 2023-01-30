import { Request, Response } from 'express'
import { BEColor } from "../models";



export const ListarColores = async (req: Request, res: Response) => {
    try {
        const BETalles = await BEColor.find();
        res.json(BETalles);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}
export const Obtenercolor = async (req: Request, res: Response) => {
    try {
        const Id = parseInt(req.params.id);
        const Color = await BEColor.findOneBy({ id: Id })
        res.status(200).json(Color);
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
            res.status(204).json(`Talle ${Id} Borrado satisfactoriamente`)
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const ActualizarColor = async (req: Request, res: Response) => {
    const Id = parseInt(req.params.id);
    try {
        const Talle = await BEColor.findOneBy({ id: Id });
        if (!Talle) return res.status(404).json({ message: "Not user found" });

        await BEColor.update({ id: Id }, req.body);
        return res.sendStatus(204);

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};