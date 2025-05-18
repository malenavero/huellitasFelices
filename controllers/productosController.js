const Producto = require('../models/Producto');
const { CATEGORIAS_PRODUCTO } = require('../utils/constants.js');
const { returnJSON } = require('./utils.js');

module.exports = {
  // GET
  async listar(req, res) {
    const categoria = req.query.categoria;
    let productos;

    if (categoria) {
      productos = await Producto.findByCategoria(categoria);
    } else {
      productos = await Producto.findAll();
    }

    if (returnJSON(req)) {
      return res.status(200).json(productos);
    }

    return res.status(200).render('productos/index', {
      productos,
      categorias: CATEGORIAS_PRODUCTO,
      categoriaSeleccionada: categoria || ''
    });
  },

  // GET
  async detalle(req, res) {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      if (returnJSON(req)) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      } else {
        return res.status(404).render('errors/404', { mensaje: 'Producto no encontrado' });
      }
    }

    if (returnJSON(req)) {
      return res.status(200).json(producto);
    }

    return res.status(200).render('productos/detalle', { producto });
  },

  // POST
  async crear(req, res) {
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

      if (returnJSON(req)) {
        return res.status(201).json(nuevoProducto);
      }

      const productos = await Producto.findAll();
      return res.status(201).render('productos/index', {
        productos,
        categorias: CATEGORIAS_PRODUCTO,
        categoriaSeleccionada: ''
      });
    } catch (error) {
      console.error('Error al crear producto:', error);
      return res.status(500).json({ error: 'Error al crear producto' });
    }
  },

  // PUT
  async actualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const datosActualizados = req.body;

      const productoActualizado = await Producto.update(id, datosActualizados);

      if (!productoActualizado) {
        if (returnJSON(req)) {
          return res.status(404).json({ error: 'Producto no encontrado' });
        } else {
          return res.status(404).render('errors/404', { mensaje: 'Producto no encontrado' });
        }
      }

      if (returnJSON(req)) {
        return res.status(200).json(productoActualizado);
      }

      return res.status(200).render('productos/detalle', { producto: productoActualizado });
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      return res.status(500).json({ error: 'Error al actualizar producto' });
    }
  },

  // DELETE
  async eliminar(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const eliminado = await Producto.delete(id);
      if (!eliminado) {
        if (returnJSON(req)) {
          return res.status(404).json({ error: 'Producto no encontrado' });
        } else {
          return res.status(404).render('errors/404', { mensaje: 'Producto no encontrado' });
        }
      }

      if (returnJSON(req)) {
        return res.status(200).json({ mensaje: `Producto ${id} eliminado` });
      }

      const productos = await Producto.findAll();
      return res.status(200).render('productos/index', {
        productos,
        categorias: CATEGORIAS_PRODUCTO,
        categoriaSeleccionada: ''
      });
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      return res.status(500).json({ error: 'Error al eliminar producto' });
    }
  }
};
