const express = require("express");
const router = express.Router();
const VentasController = require("../controllers/ventas_controller");
const autorizarRol = require("../middlewares/autorizarRol");

// Middleware para autorizar acceso a rutas de ventas
router.use(autorizarRol("admin", "gerencia", "ventas", "recepcion"));

router.get("/checkout", VentasController.mostrarResumen);
router.post("/pagar", VentasController.confirmarPago);
router.get("/:id", VentasController.detalle);
router.get("/", VentasController.listar);


module.exports = router;
