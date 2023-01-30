import { Router } from "express";
import {
    CrearProducto,
    EliminarProducto,
    ListarProductos,
    //   ActualizarProducto,
    ObtenerProducto
} from "../controllers";

const router = Router();

router.get("/productos", ListarProductos);

router.get("/producto/:id", ObtenerProducto);

router.post("/producto", CrearProducto);

router.delete("/producto/:id", EliminarProducto);

router.put("/producto/:id", ActualizarProducto);

export default router