import { Request, Response } from 'express'
import { talle as BETalle } from "../models/BETalle";



export const ListarTalles = async (req: Request, res: Response) => {
    try {
        const BETalles = await BETalle.find();
        res.json(BETalles);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}
export const ObtenerTalle = async (req: Request, res: Response) => {
    try {
        const Id = parseInt(req.params.id);
        const Talle = await BETalle.findOneBy({ id: Id })
        res.status(200).json(Talle);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const CrearTalle = async (req: Request, res: Response) => {
    try {
        const { nombre } = req.body
        const NewBETalle = new BETalle();
        NewBETalle.nombre = nombre
        await NewBETalle.save()
        return res.status(200).json(NewBETalle)

    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const EliminarTalle = async (req: Request, res: Response) => {
    try {
        const Id = parseInt(req.params.id);
        const result = await BETalle.delete({ id: Id });
        if (result.affected === 0)
            return res.status(404).json({ message: "Talle no encontrada" });
        else
            res.status(204).json(`Talle ${Id} Borrado satisfactoriamente`)
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export const ActualizarTalle = async (req: Request, res: Response) => {
    const Id = parseInt(req.params.id);
    try {
        const Talle = await BETalle.findOneBy({ id: Id });
        if (!Talle) return res.status(404).json({ message: "Not user found" });

        await BETalle.update({ id: Id }, req.body);
        return res.sendStatus(204);

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};