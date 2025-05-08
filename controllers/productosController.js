// controllers/productosController.js

const Producto = require('../models/Producto');

module.exports = {
  async listar(req, res, categorias) {
    const categoria = req.query.categoria; // Obtener la categoría desde la query
    let productos;

    if (categoria) {
      productos = await Producto.findByCategoria(categoria);
    } else {
      productos = await Producto.findAll();
    }

    
    res.render('productos', {
      productos,
      categorias,
      categoriaSeleccionada: categoria || ''
    });
    
  },

  async verProducto(req, res) {
    const producto = await Producto.findById(req.params.id);
    if (producto) {
      res.render('productoDetalle', { producto });
    } else {
      res.status(404).send('Producto no encontrado');
    }
  }
};
