const express = require("express");
const router = express.Router();
const carritosController = require("../controllers/carritos_controller.js");
const autorizarRol = require("../middlewares/autorizarRol");

// Middleware para autorizar acceso a rutas de carritos
router.use(autorizarRol("admin", "gerencia", "ventas","recepcion"));

/*
En este caso no documentamos swagger ya que el carrito es de sesion, es decir no se guarda en la DB

*/

// Mostrar carrito
router.get("/", carritosController.mostrar);

// Agregar producto
router.post("/agregar", carritosController.agregar);

// Eliminar producto
router.post("/eliminar", carritosController.eliminar);

// Actualizar carrito
router.post("/actualizar", carritosController.actualizar);

// Vaciar carrito
router.post("/vaciar", carritosController.vaciar);

module.exports = router;
