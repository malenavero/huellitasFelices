// routes/productos.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/productosController');
const { validarProductoCreate, validarProductoUpdate, validarCantidad } = require('../middlewares/validacionesProductos');
const { CATEGORIAS_PRODUCTO } = require('../utils/constants.js');

/**
 * @swagger
 * /productos/crear:
 *   get:
 *     summary: Renderiza el formulario de creación de productos
 *     tags:
 *       - Productos (Vistas)
 *     responses:
 *       200:
 *         description: Formulario HTML de creación
 */
router.get('/crear', (req, res) => {
  res.render('productos/form', {
    modo: 'crear',
    producto: {},
    categorias: CATEGORIAS_PRODUCTO,
    errores: []
  });
});

/**
 * @swagger
 * /productos/{id}/editar:
 *   get:
 *     summary: Renderiza el formulario de edición para un producto
 *     tags:
 *       - Productos (Vistas)
 *     responses:
 *       200:
 *         description: Formulario HTML de edición
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id/editar', controller.formEditar);

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Obtiene todos los productos
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtra por categoría
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 */
router.get('/', (req, res) => {
  controller.listar(req, res);
});

/**
 * @swagger
 * /productos/{id}:
 *   get:
 *     summary: Obtiene un producto por ID
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id', controller.detalle);

/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags:
 *       - Productos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductoInput'
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       400:
 *         description: Error de validación
 */
router.post('/', validarProductoCreate, controller.crear);

/**
 * @swagger
 * /productos/{id}/vender:
 *   post:
 *     summary: Vende una cantidad de un producto específico, disminuyendo su stock
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a vender
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cantidad:
 *                 type: integer
 *                 description: Cantidad a vender (entero positivo)
 *                 example: 1
 *             required:
 *               - cantidad
 *     responses:
 *       200:
 *         description: Producto vendido correctamente, con stock actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       400:
 *         description: Cantidad inválida o stock insuficiente
 *       404:
 *         description: Producto no encontrado
 */
router.post('/:id/vender', validarCantidad, controller.vender);

/**
 * @swagger
 * /productos/{id}:
 *   put:
 *     summary: Actualiza un producto por ID
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a actualizar
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductoUpdateInput'
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Producto no encontrado
 */
router.put('/:id', validarProductoUpdate, controller.actualizar);

/**
 * @swagger
 * /productos/{id}:
 *   delete:
 *     summary: Elimina un producto por ID
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto <numero> eliminado
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/:id', controller.eliminar);



module.exports = router;
