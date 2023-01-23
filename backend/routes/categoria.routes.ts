import { Router } from "express";
import {
    CrearCategoria, ListarCategorias, ObtenerCategoria, EliminarCategoria, ActualizarCategoria,
} from "../controllers/categoria.controllers";

const router = Router();

router.get("/categorias", ListarCategorias);

router.get("/categoria/:id", ObtenerCategoria);

router.post("/categoria", CrearCategoria);

router.delete("/producto/:id", EliminarCategoria);

router.put("/producto/:id", ActualizarCategoria);

export default router