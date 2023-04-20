import { router } from ".";
import {
    CrearCategoria, ListarCategorias, ObtenerCategoria, EliminarCategoria, ActualizarCategoria,
} from "../controllers";


router.get("/categorias", ListarCategorias);

router.get("/categoria/:id", ObtenerCategoria);

router.post("/categoria", CrearCategoria);

router.delete("/categoria/:id", EliminarCategoria);

router.put("/categoria/:id", ActualizarCategoria);

export default router