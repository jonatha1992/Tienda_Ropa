import { Request, Response } from 'express'
import { And } from 'typeorm';
import { BEUsuario } from "../models";

export const VerificarUsuario = async (req: Request, res: Response) => {
    try {
        let posibleUsuario = req.body as BEUsuario
        console.log('consulta ', posibleUsuario)
        const usuario = await BEUsuario.findOne({
            where: {
                email: posibleUsuario.email,
                password: posibleUsuario.password
            }
        });
        console.log('respuesta', usuario)
        if (!usuario) {
            return res.status(400).json({ verificado: false });
        } else {
            return res.status(200).json({ verificado: true });
        }
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}
