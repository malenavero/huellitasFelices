// routes/productos.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/productosController');
const { validarProductoCreate, validarProductoUpdate } = require('../middlewares/validacionesProducto');
const Producto = require('../models/Producto');
const categorias = Producto.getCategorias();

router.get('/', (req, res) => {
  controller.listar(req, res, categorias);
});
router.get('/:id', controller.verProducto);
router.post('/', validarProductoCreate, controller.crearProducto);
router.put('/:id', validarProductoUpdate, controller.actualizarProducto);
router.delete('/:id', controller.eliminarProducto);

module.exports = router;
