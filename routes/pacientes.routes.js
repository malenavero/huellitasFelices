const express = require('express');
const router = express.Router();
const controller = require('../controllers/pacientesController');
const {
  validarPacienteCreate,
  validarPacienteUpdate
} = require('../middlewares/validacionesPacientes');

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
router.get('/', controller.listar);
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
 *           type: integer
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
router.get('/:id', controller.verPaciente);
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
router.post('/', validarPacienteCreate, controller.crearPaciente);
/**
 * @swagger
 * /pacientes/{id}:
 *   put:
 *     tags:
 *       - Pacientes
 *     summary: Actualizar un paciente existente
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
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
router.put('/:id', validarPacienteUpdate, controller.actualizarPaciente);

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
 *           type: integer
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
router.delete('/:id', controller.eliminarPaciente);

module.exports = router;
