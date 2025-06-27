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
/**
 * @swagger
 * /carrito:
 *   get:
 *     summary: Mostrar el carrito actual
 *     tags: [Carrito]
 *     responses:
 *       200:
 *         description: Carrito actual en sesión
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carrito'
 */
router.get("/", carritosController.mostrar);

// Agregar producto
/**
 * @swagger
 * /carrito/agregar:
 *   post:
 *     summary: Agregar un producto al carrito
 *     tags: [Carrito]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productoId, cantidad, precio]
 *             properties:
 *               productoId:
 *                 type: string
 *               cantidad:
 *                 type: integer
 *               precio:
 *                 type: number
 *               esServicio:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Producto agregado al carrito
 */
router.post("/agregar", carritosController.agregar);

// Eliminar producto
/**
 * @swagger
 * /carrito/eliminar:
 *   post:
 *     summary: Eliminar un producto del carrito
 *     tags: [Carrito]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productoId]
 *             properties:
 *               productoId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto eliminado
 */
router.post("/eliminar", carritosController.eliminar);

// Actualizar carrito
/**
 * @swagger
 * /carrito/actualizar:
 *   post:
 *     summary: Actualizar cantidad de un producto (sumar/restar)
 *     tags: [Carrito]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productoId, accion]
 *             properties:
 *               productoId:
 *                 type: string
 *               accion:
 *                 type: string
 *                 enum: [add, remove]
 *     responses:
 *       200:
 *         description: Carrito actualizado
 */
router.post("/actualizar", carritosController.actualizar);

// Vaciar carrito
/**
 * @swagger
 * /carrito/vaciar:
 *   post:
 *     summary: Vaciar el carrito
 *     tags: [Carrito]
 *     responses:
 *       200:
 *         description: Carrito vaciado
 */
router.post("/vaciar", carritosController.vaciar);

module.exports = router;
