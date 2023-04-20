import { router } from ".";
import {
    RegistrarUsuario,
    VerificarUsuario
} from "../controllers";


router.post("/User", VerificarUsuario);
router.post("/RegisterUser", RegistrarUsuario);


export default router