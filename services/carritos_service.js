const Producto = require("../models/producto_model.js");

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

async function agregarProducto(session, productoId, cantidad) {
  inicializarCarrito(session);

  const carrito = session.carrito;

  const producto = await Producto.findById(productoId).lean();
  if (!producto) throw new Error("Producto no encontrado");

  if (producto.stock < cantidad) {
    throw new Error(`Stock insuficiente para ${producto.nombre}`);
  }

  // Ver si ya estaba en el carrito
  const itemExistente = carrito.items.find(item => item.producto === productoId);

  if (itemExistente) {
    // Sumar cantidad y subtotal
    const nuevaCantidad = itemExistente.cantidad + cantidad;

    if (nuevaCantidad > producto.stock) {
      throw new Error(`No hay suficiente stock para ${producto.nombre} (máximo: ${producto.stock})`);
    }

    itemExistente.cantidad = nuevaCantidad;
    itemExistente.stockDisponible = producto.stock - cantidad;
    itemExistente.subtotal = itemExistente.cantidad * itemExistente.precioUnitario;
  } else {
    // Agregar nuevo item
    carrito.items.push({
      producto: producto._id.toString(),
      nombre: producto.nombre,
      cantidad,
      precioUnitario: producto.precio,
      subtotal: producto.precio * cantidad,
      stockDisponible: producto.stock - cantidad
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
