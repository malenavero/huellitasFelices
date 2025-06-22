const Venta = require("../models/venta_model");
const Producto = require("../models/producto_model");


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
    usuarioId,
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
    await Producto.findByIdAndUpdate(item.productoId, {
      $inc: { stock: -item.cantidad }
    });
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
