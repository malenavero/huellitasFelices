const express = require("express");
const router = express.Router();
const controller = require("../controllers/turnosController");
const {
  validarTurnoCreate,
  validarTurnoUpdate,
} = require("../middlewares/validacionesTurnos");

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

router.get("/crear", (req, res) => {
  res.render("turnos/form", {
    modo: "crear",
    turno: {},
    errores: [],
  });
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
router.get("/:id/editar", controller.formEditar);

router.post("/", validarTurnoCreate, controller.crear);

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
