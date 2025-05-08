// routes/productos.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/productosController');
const Producto = require('../models/Producto');
const categorias = Producto.getCategorias();

router.get('/', (req, res) => {
  controller.listar(req, res, categorias);
});

router.get('/:id', controller.verProducto);

module.exports = router;
