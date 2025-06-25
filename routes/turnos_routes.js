const express = require("express");
const router = express.Router();
const controller = require("../controllers/turnos_controller");
const autorizarRol = require("../middlewares/autorizarRol");
const { validarTurnoCreate, validarTurnoUpdate } = require("../middlewares/validaciones_turnos");

// Middleware para autorizar acceso a rutas de turnos
router.use(autorizarRol("admin", "gerencia", "clinica", "peluqueria","recepcion"));

// GET VISTAS
/**
 * @swagger
 * /turnos/crear:
 *   get:
 *     summary: Renderiza el formulario de registro de turnos
 *     tags:
 *       - Turnos (Vistas)
 *     responses:
 *       200:
 *         description: Formulario HTML de creación
 */
router.get("/crear", controller.formCrear);

/**
 * @swagger
 * /turnos/{id}/editar:
 *   get:
 *     summary: Renderiza el formulario de edición para un turno
 *     tags:
 *       - Turnos (Vistas)
 *     responses:
 *       200:
 *         description: Formulario HTML de edición
 *       404:
 *         description: Turno no encontrado
 */
router.get("/:id/editar", controller.formEditar);

// GET
/**
 * @swagger
 * /turnos:
 *   get:
 *     summary: Obtiene todos los turnos
 *     tags:
 *       - Turnos
 *     responses:
 *       200:
 *         description: Lista de turnos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Turno'
 */
router.get("/", (req, res) => {
  controller.listar(req, res);
});


/**
 * @swagger
 * /turnos/{id}:
 *   get:
 *     summary: Obtiene un turno por ID
 *     tags:
 *       - Turnos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del turno
 *     responses:
 *       200:
 *         description: Turno encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Turno'
 *       404:
 *         description: Turno no encontrado
 */
router.get("/:id", controller.detalle);


// POST
/**
 * @swagger
 * /turnos:
 *   post:
 *     summary: Crea un nuevo turno
 *     tags:
 *       - Turnos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TurnoInput'
 *     responses:
 *       201:
 *         description: Turno creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Turno'
 *       400:
 *         description: Error de validación
 */

router.post("/", validarTurnoCreate, controller.crear);

// PUT
/**
 * @swagger
 * /turnos/{id}:
 *   put:
 *     summary: Actualiza un turno por ID
 *     tags:
 *       - Turnos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del turno a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TurnoUpdateInput'
 *     responses:
 *       200:
 *         description: Turno actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Turno'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Turno no encontrado
 */
router.put("/:id", validarTurnoUpdate, controller.actualizar);


// DELETE
/**
 * @swagger
 * /turnos/{id}:
 *   delete:
 *     summary: Elimina un turno por ID
 *     tags:
 *       - Turnos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del turno a eliminar
 *     responses:
 *       200:
 *         description: Turno eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *       404:
 *         description: Turno no encontrado
 */
router.delete("/:id", controller.eliminar);

module.exports = router;
