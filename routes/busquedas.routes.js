const express = require("express");
const router = express.Router();
const controller = require("../controllers/busquedasController");
const { validarBusquedaCreate, validarBusquedaUpdate } = require("../middlewares/validacionesBusquedas");
const { ANIMALES_VALIDOS, TIPOS_BUSQUEDA } = require("../utils/constants.js");

// GET VISTAS
/**
 * @swagger
 * /busquedas/crear:
 *   get:
 *     summary: Renderiza el formulario de creación de busquedas
 *     tags:
 *       - Búsquedas (Vistas)
 *     responses:
 *       200:
 *         description: Formulario HTML de creación
 */
router.get("/crear", (req, res) => {
  res.render("busquedas/form", {
    modo: "crear",
    busqueda: {},
    errores: [],
    ANIMALES_VALIDOS,
    TIPOS_BUSQUEDA
  });
});

/**
 * @swagger
 * /busquedas/{id}/editar:
 *   get:
 *     summary: Renderiza el formulario de edición para una busqueda
 *     tags:
 *       - Búsquedas (Vistas)
 *     responses:
 *       200:
 *         description: Formulario HTML de edición
 *       404:
 *         description: Busqueda no encontrada
 */
router.get("/:id/editar", controller.formEditar);


// GET 

/**
 * @swagger
 * /busquedas:
 *   get:
 *     summary: Obtiene todos los busquedas
 *     tags:
 *       - Búsquedas
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtra por categoría
 *     responses:
 *       200:
 *         description: Lista de busquedas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Busqueda'
 */
router.get("/", (req, res) => {
  controller.listar(req, res);
});

/**
 * @swagger
 * /busquedas/{id}:
 *   get:
 *     summary: Obtiene una busqueda por ID
 *     tags:
 *       - Búsquedas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la busqueda
 *     responses:
 *       200:
 *         description: Busqueda encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Busqueda'
 *       404:
 *         description: Busqueda no encontrada
 */
router.get("/:id", controller.detalle);


// POST

/**
 * @swagger
 * /busquedas:
 *   post:
 *     summary: Crea una nueva busqueda
 *     tags:
 *       - Búsquedas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BusquedaInput'
 *     responses:
 *       201:
 *         description: Busqueda creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Busqueda'
 *       400:
 *         description: Error de validación
 */
router.post("/", validarBusquedaCreate, controller.crear);


// PUT
/**
 * @swagger
 * /busquedas/{id}:
 *   put:
 *     summary: Actualiza una busqueda por ID
 *     tags:
 *       - Búsquedas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la busqueda a actualizar
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BusquedaUpdateInput'
 *     responses:
 *       200:
 *         description: Busqueda actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Busqueda'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Busqueda no encontrada
 */
router.put("/:id", validarBusquedaUpdate, controller.actualizar);


// DELETE

/**
 * @swagger
 * /busquedas/{id}:
 *   delete:
 *     summary: Elimina una busqueda por ID
 *     tags:
 *       - Búsquedas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la busqueda a eliminar
 *     responses:
 *       200:
 *         description: Busqueda <numero> eliminado
 *       404:
 *         description: Busqueda no encontrada
 */
router.delete("/:id", controller.eliminar);

module.exports = router;