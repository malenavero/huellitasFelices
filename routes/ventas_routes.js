const express = require("express");
const router = express.Router();
const VentasController = require("../controllers/ventas_controller");
const autorizarRol = require("../middlewares/autorizarRol");

// Middleware para autorizar acceso a rutas de ventas
router.use(autorizarRol("admin", "gerencia", "ventas", "recepcion"));

/**
 * @swagger
 * /ventas/checkout:
 *   get:
 *     summary: Muestra el resumen del carrito antes de confirmar el pago
 *     tags:
 *       - Ventas
 *     responses:
 *       200:
 *         description: Vista HTML con el resumen del carrito
 *       400:
 *         description: El carrito está vacío
 *       500:
 *         description: Error interno al mostrar el resumen
 */
router.get("/checkout", VentasController.mostrarResumen);

/**
 * @swagger
 * /ventas/pagar:
 *   post:
 *     summary: Confirma el pago, genera una venta y redirige al comprobante
 *     tags:
 *       - Ventas
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               metodoPago:
 *                 type: string
 *                 description: Método de pago elegido
 *                 example: "efectivo"
 *     responses:
 *       302:
 *         description: Redirección al comprobante de venta
 *       400:
 *         description: El carrito está vacío
 *       500:
 *         description: Error al confirmar el pago
 */
router.post("/pagar", VentasController.confirmarPago);

/**
 * @swagger
 * /ventas/{id}:
 *   get:
 *     summary: Muestra el comprobante de una venta por su ID
 *     tags:
 *       - Ventas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Vista HTML del comprobante de venta
 *       404:
 *         description: Venta no encontrada
 *       500:
 *         description: Error al obtener el detalle
 */
router.get("/:id", VentasController.detalle);

/**
 * @swagger
 * /ventas:
 *   get:
 *     summary: Lista todas las ventas del usuario autenticado (por filtro si aplica)
 *     tags:
 *       - Ventas
 *     parameters:
 *       - in: query
 *         name: filtro
 *         schema:
 *           type: string
 *           enum: [hoy, semana, mes]
 *         description: Filtra las ventas por rango de tiempo
 *     responses:
 *       200:
 *         description: Lista de ventas en JSON o vista HTML según el tipo de solicitud
 *       500:
 *         description: Error al listar las ventas
 */
router.get("/", VentasController.listar);

module.exports = router;
