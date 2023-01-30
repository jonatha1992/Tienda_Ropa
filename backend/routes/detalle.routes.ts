import { Router } from "express";
import {
    ListarDetalles, ObtenerDetalle, CrearDetalle, EliminarDetalle, Actualizardetalle,
} from "../controllers";

const router = Router();

router.get("/detalles", ListarDetalles);

router.get("/detalle/:id", ObtenerDetalle);

router.post("/detalle", CrearDetalle);

router.delete("/detalle/:id", EliminarDetalle);

router.put("/detalle/:id", Actualizardetalle);

export default router