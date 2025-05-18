// controllers/productosControllers.js

const Producto = require('../models/Producto');

module.exports = {
  // GET
  async listar(req, res, categorias) {
    // Por ahora implementé solo el filtro por categoría, deberiamos pensar una mejor manera de modularizar tema filtros?
    const categoria = req.query.categoria;
    let productos;

    if (categoria) {
      productos = await Producto.findByCategoria(categoria);
    } else {
      productos = await Producto.findAll();
    }

    if ((req.headers.accept && req.headers.accept.includes('application/json')) || req.query.format === 'json') {
      return res.json(productos);
    }

    res.render('productos', {
      productos,
      categorias,
      categoriaSeleccionada: categoria || ''
    });
  },

  // GET
  async verProducto(req, res) {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).send('Producto no encontrado');
    }

    if ((req.headers.accept && req.headers.accept.includes('application/json')) || req.query.format === 'json') {
      return res.json(producto);
    }

    res.render('productoDetalle', { producto });
  },

  // POST
  async crearProducto(req, res) {
    try {
      const { nombre, categoria, precio, stock, descripcion, fechaVencimiento } = req.body;
  
      const nuevoProducto = await Producto.create({
        nombre,
        categoria,
        precio,
        stock,
        descripcion,
        fechaVencimiento
      });
  
      if ((req.headers.accept && req.headers.accept.includes('application/json')) || req.query.format === 'json') {
        return res.status(201).json(nuevoProducto);
      }
  
      res.redirect('/productos');
    } catch (error) {
      console.error('Error al crear producto:', error);
      res.status(500).json({ error: 'Error al crear producto' });
    }
  },
  

  // PUT
  async actualizarProducto(req, res) {
    try {
      const id = parseInt(req.params.id);
      const datosActualizados = req.body;

      const productoActualizado = await Producto.update(id, datosActualizados);

      if (!productoActualizado) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      if ((req.headers.accept && req.headers.accept.includes('application/json')) || req.query.format === 'json') {
        return res.json(productoActualizado);
      }

      res.redirect('/productos/' + id);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json({ error: 'Error al actualizar producto' });
    }
  },

 // DELETE
async eliminarProducto(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const eliminado = await Producto.delete(id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (
      !req.headers.accept || 
      req.headers.accept === '*/*' || 
      req.headers.accept.includes('application/json') || 
      req.query.format === 'json'
    ) {
      return res.json({ mensaje: `Producto ${id} eliminado` });
    }
    

    res.redirect('/productos');
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
}
};
