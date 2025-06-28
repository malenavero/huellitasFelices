const VentasService = require("../services/ventas_service");
const CarritosService = require("../services/carritos_service");
const { returnJSON, handleError } = require("./utils");
const { METODOS_PAGO } = require("../utils/constants");

module.exports = {
  // Mostrar resumen (checkout) para completar pago
  async mostrarResumen(req, res) {
    try {
      const carrito = CarritosService.obtenerCarrito(req.session);

      if (!carrito.items.length) {
        return handleError(req, res, 400, "El carrito está vacío");
      }

      if (returnJSON(req)) {
        const resumenCarrito = {
          items: carrito.items,
          total: carrito.total,
          metodosPagoDisponibles: METODOS_PAGO,
        };
        return res.status(200).json(resumenCarrito);
      }

      return res.render("ventas/checkout", { carrito, METODOS_PAGO });
    } catch (error) {
      console.error("Error al mostrar resumen:", error);
      return handleError(req, res, 500, "Error al mostrar resumen");
    }
  },


  // Confirmar pago, crear venta y mostrar comprobante
  async confirmarPago(req, res) {
    try {
      const carrito = CarritosService.obtenerCarrito(req.session);

      if (!carrito.items.length) {
        return handleError(req, res, 400, "El carrito está vacío");
      }

      const { metodoPago } = req.body;
      const userId = req.session.usuario.id;

      const ventaConfirmada = await VentasService.crearYConfirmarVenta(userId, carrito, metodoPago);
      // Vaciar carrito si el pago fue exitoso
      CarritosService.vaciarCarrito(req.session);

      if (returnJSON(req)) {
        return res.status(200).json(ventaConfirmada);
      }

      return res.redirect(`/ventas/${ventaConfirmada._id}`);
    } catch (error) {
      console.error("Error al confirmar pago:", error);
      return handleError(req, res, 500, "Error al confirmar pago");
    }
  },

  // Mostrar detalle de una venta ya concretada
  async detalle(req, res) {
    try {
      const userId = req.session.usuario.id;

      const venta = await VentasService.obtenerVentaPorId(req.params.id, userId);

      if (!venta) {
        return handleError(req, res, 404, "Venta no encontrada");
      }
      if (returnJSON(req)) {
        return res.status(200).json(venta);
      }
      const usuarioNombre = req.session.usuario.nombre;
      return res.render("ventas/comprobante", { venta, usuarioNombre });
    } catch (error) {
      console.error("Error al obtener detalle de venta:", error);
      return handleError(req, res, 500, "Error al obtener detalle de venta");
    }
  },


  // Listar ventas del usuario
  async listar(req, res) {
    try {
      const { filtro } = req.query; // 'hoy', 'semana', 'mes'
      const userId = req.session.usuario.id;
      const ventas = await VentasService.listarVentasPorUsuarioConFiltro(userId, filtro);

      if (returnJSON(req)) return res.status(200).json(ventas);

      return res.render("ventas/listado", { ventas, filtroSeleccionado: filtro });
    } catch (error) {
      console.error("Error al listar ventas:", error);
      return handleError(req, res, 500, "Error al listar ventas");
    }
  }

};
