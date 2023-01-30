import { Router } from "express";
import {
    CrearColor, ListarColores, Obtenercolor, EliminarColor, ActualizarColor
} from "../controllers";

const router = Router();

router.get("/colors", ListarColores);

router.get("/color/:id", Obtenercolor);

router.post("/color", CrearColor);

router.delete("/color/:id", EliminarColor);

router.put("/color/:id", ActualizarColor);

export default router