import { router } from ".";
import path from "path";
import {
    CrearProducto,
    EliminarProducto,
    ListarProductos,
    ActualizarProducto,
    ObtenerProducto,
    MostrarNovedades
} from "../controllers";


router.get("/productos", ListarProductos);

router.get("/producto/:id", ObtenerProducto);

router.post("/producto", CrearProducto);

router.delete("/producto", EliminarProducto);

router.put("/producto/:id", ActualizarProducto);

export default router
