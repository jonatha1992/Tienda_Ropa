import { Router } from "express";
import {
    VerificarUsuario
} from "../controllers";

const router = Router();

router.get("/usuario", VerificarUsuario);


export default router