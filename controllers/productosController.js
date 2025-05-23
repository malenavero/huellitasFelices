// controllers/productoController.js

const Producto = require('../models/Producto');
const { CATEGORIAS_PRODUCTO } = require('../utils/constants.js');
const { returnJSON, handleError, urls} = require('./utils.js');

async function getListParams(query = {}) {
  const productos = await Producto.findAll(query);
  return {
    productos,
    categorias: CATEGORIAS_PRODUCTO,
    categoriaSeleccionada: query.categoria || '',
    ...urls
  }
}

async function renderListView(res, status = 200, query = {}) {
  const params = await getListParams(query)
  return res.status(status).render('productos/index', params);
}

module.exports = {
  // GET
  async listar(req, res) {

    if (returnJSON(req)) {
      const productos = await Producto.findAll(req.query);    
      return res.status(200).json(productos);
    }
    return renderListView(res, 200, req.query);
  },

  async detalle(req, res) {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return handleError(req, res, 404, message = 'Producto no encontrado')
    }

    if (returnJSON(req)) {
      return res.status(200).json(producto);
    }

    return res.status(200).render('productos/detalle', { producto });
  },

  async formEditar(req, res) {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return handleError(req, res, 404, message = 'Producto no encontrado')
    }
    res.render('productos/form', {
      modo: 'editar',
      producto,
      categorias: CATEGORIAS_PRODUCTO
    });
  },

  // POST
  async crear(req, res) {
    try {
      const { nombre, categoria, precio, stock, descripcion, fechaVencimiento } = req.body;

      const nuevoProducto = await Producto.create({
        nombre,
        categoria,
        precio: parseFloat(precio),
        stock: stock ? parseInt(stock) : 0,
        descripcion: descripcion || '',
        fechaVencimiento: fechaVencimiento || null     
      });

      if (returnJSON(req)) {
        return res.status(201).json(nuevoProducto);
      }

      return renderListView(res, 201, req.query);
    } catch (error) {
      handleError(req, res, 500, message = 'Error al crear producto');
    }
  },

  // PUT
  async actualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const datosActualizados = req.body;

      const productoActualizado = await Producto.update(id, datosActualizados);

      if (!productoActualizado) {
        return handleError(req, res, 404, message = 'Producto no encontrado')
      }

      if (returnJSON(req)) {
        return res.status(200).json(productoActualizado);
      }
      return renderListView(res, 201, req.query);
    } catch (error) {
      return handleError(req, res, 500, message = 'Error al actualizar producto')
    }
  },

  // DELETE
  async eliminar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const idEliminado = await Producto.delete(id);
      if (!idEliminado) {
        return handleError(req, res, 404, message = 'Producto no encontrado')
      }

      if (returnJSON(req)) {
        return res.status(200).json({ mensaje: `Producto ${idEliminado} eliminado` });
      }

      return renderListView(res, 200, req.query);

    } catch (error) {
      return handleError(req, res, 500, message = 'Error al eliminar producto')
    }
  }
}
