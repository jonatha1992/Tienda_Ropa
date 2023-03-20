import { Router } from "express";
import {
    RegistrarUsuario,
    VerificarUsuario
} from "../controllers";

const router = Router();

router.post("/User", VerificarUsuario);
router.post("/RegisterUser", RegistrarUsuario);


export default router