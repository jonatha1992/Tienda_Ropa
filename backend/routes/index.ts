import { Router } from "express";
import path  from 'path' ;


export const router = Router(); 


router.get("/", (req, res) =>{
	res.status(200).sendFile(path.resolve(__dirname, '../views/index.html'));
});

 router.get("/alta", function (req, res) {
    res.status(200).sendFile(path.join(__dirname, '../views/NewAltaProducto.html'))
});
 router.get("/login", function (req, res) {
    res.status(200).sendFile(path.join(__dirname, '../views/login.html'))
});




