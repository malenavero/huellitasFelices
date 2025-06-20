const CarritosService = require("../services/carritos_service.js");
const { returnJSON } = require("./utils.js");

module.exports = {
  mostrar(req, res) {
    const carrito = CarritosService.obtenerCarrito(req.session);

    if (returnJSON(req)) {
      return res.status(200).json(carrito);
    }

    return res.render("carrito/index", { carrito });
  },

  async agregar(req, res) {
    try {
      const { productoId, cantidad } = req.body;
      const cantidadNum = parseInt(cantidad, 10);

      if (!productoId || isNaN(cantidadNum) || cantidadNum <= 0) {
        return res.status(400).send("Datos inválidos");
      }

      await CarritosService.agregarProducto(req.session, productoId, cantidadNum);

      if (returnJSON(req)) {
        return res.status(200).json({ mensaje: "Producto agregado", carrito: req.session.carrito });
      }

      return res.redirect("/carrito");
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      return res.status(400).send(error.message);
    }
  },

  eliminar(req, res) {
    const { productoId } = req.body;
    if (!productoId) return res.status(400).send("Falta productoId");

    CarritosService.eliminarProducto(req.session, productoId);

    if (returnJSON(req)) {
      return res.status(200).json({ mensaje: "Producto eliminado", carrito: req.session.carrito });
    }

    return res.redirect("/carrito");
  },

  vaciar(req, res) {
    CarritosService.vaciarCarrito(req.session);

    if (returnJSON(req)) {
      return res.status(200).json({ mensaje: "Carrito vaciado" });
    }

    return res.redirect("/carrito");
  },

  async actualizar(req, res) {
    const { productoId, accion } = req.body;
    if (!productoId || !["add", "remove"].includes(accion)) {
      return res.status(400).send("Datos inválidos");
    }

    const carrito = req.session.carrito || { items: [] };
    const item = carrito.items.find(i => i.producto === productoId);
    if (!item) {
      return res.redirect("/carrito");
    }

    if (accion === "add") {
      item.cantidad++;
    } else if (accion === "remove" && item.cantidad > 1) {
      item.cantidad--;
    }

    item.subtotal = item.cantidad * item.precioUnitario;
    carrito.total = carrito.items.reduce((acc, i) => acc + i.subtotal, 0);

    req.session.carrito = carrito;
    return res.redirect("/carrito");
  }
};
