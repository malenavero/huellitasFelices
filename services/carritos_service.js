const Producto = require("../models/producto_model.js");
const Turno = require("../models/turno_model");

function inicializarCarrito(session) {
  if (session && !session.carrito) {
    session.carrito = {
      items: [],
      total: 0
    };
  }
}

function calcularTotal(carrito) {
  return carrito.items.reduce((acc, item) => acc + item.subtotal, 0);
}

async function agregarProducto(session, productoId, cantidad, precioUnitario, esServicio = false) {
  inicializarCarrito(session);

  const carrito = session.carrito;

  let producto;

  if (esServicio) {
    producto = await Turno.findById(productoId);
    producto.nombre = `Servicio ${esServicio}`
    producto.esServicio = true;
  } else {
    producto = await Producto.findById(productoId).lean();
    if (!producto) throw new Error("Producto no encontrado");
  }

  if (producto.stock !== Infinity && producto.stock < cantidad) {
    throw new Error(`Stock insuficiente para ${producto.nombre}`);
  }

  // Ver si ya estaba en el carrito
  const itemExistente = carrito.items.find(item => item.producto === productoId);

  const precioFinal = (typeof precioUnitario === "number" && !isNaN(precioUnitario)) ? precioUnitario : producto.precio;

  if (itemExistente) {
    const nuevaCantidad = itemExistente.cantidad + cantidad;

    if (producto.stock !== Infinity && nuevaCantidad > producto.stock) {
      throw new Error(`No hay suficiente stock para ${producto.nombre} (máximo: ${producto.stock})`);
    }

    itemExistente.cantidad = nuevaCantidad;
    itemExistente.stockDisponible = producto.stock === Infinity ? Infinity : producto.stock - nuevaCantidad;
    itemExistente.precioUnitario = precioFinal;
    itemExistente.subtotal = itemExistente.cantidad * itemExistente.precioUnitario;
  } else {
    carrito.items.push({
      producto: productoId,
      nombre: producto.nombre,
      cantidad,
      precioUnitario: precioFinal,
      subtotal: precioFinal * cantidad,
      stockDisponible: producto.stock === Infinity ? Infinity : producto.stock - cantidad,
      esServicio: !!producto.esServicio
    });
  }

  carrito.total = calcularTotal(carrito);
}


function eliminarProducto(session, productoId) {
  if (!session.carrito) return;

  const carrito = session.carrito;
  carrito.items = carrito.items.filter(item => item.producto !== productoId);
  carrito.total = calcularTotal(carrito);
}

function vaciarCarrito(session) {
  session.carrito = {
    items: [],
    total: 0
  };
}

function obtenerCarrito(session) {
  if(session) {
    inicializarCarrito(session);
    return session.carrito;
  }
  return {
    items: []
  } 
}

module.exports = {
  agregarProducto,
  eliminarProducto,
  vaciarCarrito,
  obtenerCarrito
};
