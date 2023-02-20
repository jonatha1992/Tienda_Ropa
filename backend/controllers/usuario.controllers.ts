import { Request, Response } from 'express'
import { BEUsuario } from "../models";

export const VerificarUsuario = async (req: Request, res: Response) => {
    try {
        let posibleUsuario = req.body as BEUsuario
        const usuario = await BEUsuario.findOne({
            where: {
                email: posibleUsuario.email,
                password: posibleUsuario.password
            }
        });
        if (!usuario) {
            return res.status(400).json({ message: "Usuario No verificado" });
        } else {
            return res.status(200).json({ verificado: true });
        }
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}
