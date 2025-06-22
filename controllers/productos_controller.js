const ProductoService = require("../services/productos_service.js");
const CarritosService = require("../services/carritos_service.js");
const { CATEGORIAS_PRODUCTO } = require("../utils/constants.js");
const { returnJSON, handleError, urls, handleDuplicados } = require("./utils.js");

async function getListParams(req, query = {}) {
  const productos = await ProductoService.findAll(query);
  const carrito = CarritosService.obtenerCarrito(req.session);
  const productosConStockTemporal = productos.map(producto => {
      const itemEnCarrito = carrito.items.find(i => i.producto === producto._id.toString());
      const stockDisponible = itemEnCarrito ? producto.stock - itemEnCarrito.cantidad : producto.stock;
      return {
        ...producto,
        stock: stockDisponible >= 0 ? stockDisponible : 0
      };
    });
  return {
    productos: productosConStockTemporal,
    categorias: CATEGORIAS_PRODUCTO,
    categoriaSeleccionada: query.categoria || "",
    nombreBuscado: query.nombre || "",
    ocultarSinStock: !!query.ocultarSinStock,
    ...urls
  };

}

async function renderListView(req, res, status = 200, query = {}) {
  const params = await getListParams(req, query);
  return res.status(status).render("productos/index", params);
}

module.exports = {
  async listar(req, res) {
    const productos = await ProductoService.findAll(req.query);
    
    if (returnJSON(req)) {
      return res.status(200).json(productos);
    }
    return renderListView(req, res, 200, req.query);
  },

  async detalle(req, res) {
    const producto = await ProductoService.findById(req.params.id);
    if (!producto) return handleError(req, res, 404, "Producto no encontrado");

    if (returnJSON(req)) return res.status(200).json(producto);

    return res.status(200).render("productos/detalle", { producto });
  },

  async formEditar(req, res) {
    const producto = await ProductoService.findById(req.params.id);
    if (!producto) return handleError(req, res, 404, "Producto no encontrado");

    return res.render("productos/form", {
      modo: "editar",
      producto,
      categorias: CATEGORIAS_PRODUCTO
    });
  },

  formCrear(req, res) {
    return res.render("productos/form", {
      modo: "crear",
      producto: {},
      errores: [],
      categorias: CATEGORIAS_PRODUCTO,
    });
  },

  async crear(req, res) {
    try {
      const nuevoProducto = await ProductoService.create(req.body);

      if (returnJSON(req)) {
        return res.status(201).json(nuevoProducto);
      }

      return renderListView(req, res, 201, req.query);
    } catch (error) {
      console.log("Error:", error);


      if (error.code == 11000) {
        const modo = "crear";
      
        return handleDuplicados({
          campos: error.campos,
          req, res, modo,
          vista: "productos/form",
          datos: {
            modo,
            producto: req.body,
            categorias: CATEGORIAS_PRODUCTO,
            errores: []
          },
          campoFallback: "nombre"
        });       
      };

      // Error inesperado
      return handleError(req, res, 500, "Error al crear producto");
    }
  },


  async actualizar(req, res) {
    try {
      const productoActualizado = await ProductoService.update(req.params.id, req.body);

      if (!productoActualizado) {
        return handleError(req, res, 404, "Producto no encontrado");
      }

      if (returnJSON(req)) {
        return res.status(200).json(productoActualizado);
      }

      return renderListView(req, res, 200, req.query);
    } catch (error) {
      console.log("Error:", error);
      if (error.code == 11000) {
        const modo = "editar";
        const producto = {
          ...req.body,
          _id: req.params.id
        }
      
        return handleDuplicados({
          campos: error.campos,
          req, res, modo,
          vista: "productos/form",
          datos: {
            modo,
            producto,
            categorias: CATEGORIAS_PRODUCTO,
            errores: []
          },
          campoFallback: "nombre"
        });       
      };

      return handleError(req, res, 500, "Error al actualizar producto");
    }
  },

  async eliminar(req, res) {
    try {
      const idEliminado = await ProductoService.delete(req.params.id);

      if (!idEliminado) {
        return handleError(req, res, 404, "Producto no encontrado");
      }

      if (returnJSON(req)) {
        return res.status(200).json({ mensaje: `Producto ${idEliminado} eliminado` });
      }

      return renderListView(req, res, 200, req.query);
    } catch (error) {
      console.log("Error:", error);
      return handleError(req, res, 500, "Error al eliminar producto");
    }
  },

  async vender(req, res) {
    try {
      const cantidad = parseInt(req.body.cantidad, 10) || 1;
      if (cantidad <= 0) {
        return handleError(req, res, 400, "Cantidad debe ser un número positivo");
      }

      const productoVendido = await ProductoService.vender(req.params.id, cantidad);

      if (returnJSON(req)) {
        return res.status(200).json(productoVendido);
      }

      return renderListView(req, res, 200, req.query);
    } catch (error) {
      if (error.message === "Producto no encontrado") {
        return handleError(req, res, 404, error.message);
      }
      if (error.message === "Stock insuficiente") {
        return handleError(req, res, 400, error.message);
      }

      console.log("Error:", error);
      return handleError(req, res, 500, "Error al vender producto");
    }
  }
};
