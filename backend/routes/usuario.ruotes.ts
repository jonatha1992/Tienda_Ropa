import { Router } from "express";
import {
    VerificarUsuario
} from "../controllers";

const router = Router();

router.post("/usuario", VerificarUsuario);


export default router