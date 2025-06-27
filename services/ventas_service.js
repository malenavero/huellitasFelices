const Venta = require("../models/venta_model");
const Producto = require("../models/producto_model");
const Turno = require("../models/turno_model");

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}


async function crearYConfirmarVenta(usuarioId, carrito, metodoPago) {
  const items = carrito.items.map(item => ({
    productoId: item.producto,
    nombreProducto: item.nombre,
    cantidad: item.cantidad,
    precioUnitario: item.precioUnitario,
    subtotal: item.subtotal
  }));

  const nuevaVenta = await Venta.create({
    usuarioId: usuarioId.toString(),
    items,
    total: carrito.total,
    pago: {
      metodo: metodoPago,
      detalles: {}
    },
    estado: "pagado",
    fechaPago: new Date()
  });

  // Descontar stock

  for (const item of nuevaVenta.items) {
    const productoExiste = await Producto.exists({ _id: item.productoId });
    const turnoExiste = await Turno.exists({ _id: item.productoId });

    if (productoExiste) {
      // Producto  -> descontar stock
      await Producto.findByIdAndUpdate(item.productoId, {
        $inc: { stock: -item.cantidad }
      });
    } else if (turnoExiste){
      // Servicio -> marcar turno como pagado
      await Turno.findByIdAndUpdate(item.productoId, {
        $set: { pagado: true }
      });
    } else {
      throw new Error("INVALID_PRODUCT");
    }
  }
 
  return nuevaVenta;
}

async function listarVentasPorUsuario(usuarioId) {
  return Venta.find({ usuarioId }).sort({ createdAt: -1 });
}

async function listarVentasPorUsuarioConFiltro(usuarioId, filtro) {
  const ahora = new Date();
let desde;

switch (filtro) {
  case "hoy":
    desde = startOfDay(ahora);
    break;
  case "semana":
    desde = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
    break;
  case "mes":
    { 
      const mesPasado = new Date(ahora);
      mesPasado.setMonth(ahora.getMonth() - 1);
      desde = mesPasado;
      break;
    }
  default:
    desde = null;
  }


  const query = { usuarioId };
  if (desde) {
    query.createdAt = { $gte: desde };
  }

  return Venta.find(query).sort({ createdAt: -1 });
}

async function obtenerVentaPorId(id, usuarioId) {
  return Venta.findOne({ _id: id, usuarioId });
}


module.exports = {
  crearYConfirmarVenta,
  listarVentasPorUsuario,
  obtenerVentaPorId,
  listarVentasPorUsuarioConFiltro
};
