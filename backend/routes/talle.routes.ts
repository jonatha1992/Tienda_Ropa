import { Router } from "express";
import {
    ListarTalles, ObtenerTalle, CrearTalle, EliminarTalle, ActualizarTalle,
} from "../controllers";

const router = Router();

router.get("/talles", ListarTalles);

router.get("/talle/:id", ObtenerTalle);

router.post("/talle", CrearTalle);

router.delete("/talle/:id", EliminarTalle);

router.put("/talle/:id", ActualizarTalle);

export default router