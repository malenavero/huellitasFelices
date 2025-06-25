const express = require("express");
const router = express.Router();
const controller = require("../controllers/pacientes_controller.js");
const autorizarRol = require("../middlewares/autorizarRol");
const {
  validarPacienteCreate,
  validarPacienteUpdate
} = require("../middlewares/validaciones_pacientes.js");


// Middleware para autorizar acceso a rutas de pacientes
router.use(autorizarRol("admin", "gerencia", "clinica"));


// GET VISTAS
/**
 * @swagger
 * /pacientes/crear:
 *   get:
 *     summary: Renderiza el formulario de registro de pacientes
 *     tags:
 *       - Pacientes (Vistas)
 *     responses:
 *       200:
 *         description: Formulario HTML de creación
 */
router.get("/crear", controller.formCrear);


/**
 * @swagger
 * /pacientes/{id}/editar:
 *   get:
 *     summary: Renderiza el formulario de edición para un paciente
 *     tags:
 *       - Pacientes (Vistas)
 *     responses:
 *       200:
 *         description: Formulario HTML de edición
 *       404:
 *         description: Paciente no encontrado
 */
router.get("/:id/editar", controller.formEditar);


//GET
/**
 * @swagger
 * /pacientes:
 *   get:
 *     tags:
 *       - Pacientes
 *     summary: Listar todos los pacientes
 *     responses:
 *       200:
 *         description: Lista de pacientes con edad calculada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Paciente'
 */
router.get("/", controller.listar);


/**
 * @swagger
 * /pacientes/{id}:
 *   get:
 *     tags:
 *       - Pacientes
 *     summary: Obtener paciente por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del paciente a obtener
 *     responses:
 *       200:
 *         description: Paciente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paciente'
 *       404:
 *         description: Paciente no encontrado
 */
router.get("/:id", controller.detalle);


// POST
/**
 * @swagger
 * /pacientes:
 *   post:
 *     tags:
 *       - Pacientes
 *     summary: Crear un nuevo paciente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PacienteInput'
 *     responses:
 *       201:
 *         description: Paciente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paciente'
 *       400:
 *         description: Datos inválidos para creación
 */
router.post("/", validarPacienteCreate, controller.crear);


/**
 * @swagger
 * /pacientes/{id}/consultas:
 *   post:
 *     tags:
 *       - Pacientes
 *     summary: Agrega una nueva consulta al historial del paciente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del paciente
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               motivo:
 *                 type: string
 *                 example: "Vacunación anual"
 *               notas:
 *                 type: string
 *                 example: "Sin efectos adversos"
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-01"
 *     responses:
 *       200:
 *         description: Consulta agregada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Paciente no encontrado
 */
router.post("/:id/consultas", controller.addConsulta);

// PUT
/**
 * @swagger
 * /pacientes/{id}:
 *   put:
 *     tags:
 *       - Pacientes
 *     summary: Actualizar un paciente por Id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del paciente a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PacienteUpdateInput'
 *     responses:
 *       200:
 *         description: Paciente actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paciente'
 *       400:
 *         description: Datos inválidos para actualización
 *       404:
 *         description: Paciente no encontrado
 */
router.put("/:id", validarPacienteUpdate, controller.actualizar);

// DELETE
/**
 * @swagger
 * /pacientes/{id}:
 *   delete:
 *     tags:
 *       - Pacientes
 *     summary: Eliminar un paciente por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del paciente a eliminar
 *     responses:
 *       200:
 *         description: Paciente eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Paciente 5 eliminado
 *       404:
 *         description: Paciente no encontrado
 */
router.delete("/:id", controller.eliminar);

module.exports = router;
