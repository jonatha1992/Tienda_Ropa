import { router } from ".";
import {
    CrearColor, ListarColores, Obtenercolor, EliminarColor, ActualizarColor
} from "../controllers";


router.get("/colores", ListarColores);

router.get("/color/:id", Obtenercolor);

router.post("/color", CrearColor);

router.delete("/color/:id", EliminarColor);

router.put("/color/:id", ActualizarColor);

export default router