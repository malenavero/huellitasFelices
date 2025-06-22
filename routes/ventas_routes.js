const express = require("express");
const router = express.Router();
const VentasController = require("../controllers/ventas_controller");

router.get("/checkout", VentasController.mostrarResumen);
router.post("/pagar", VentasController.confirmarPago);
router.get("/:id", VentasController.detalle);
router.get("/", VentasController.listar);


module.exports = router;
