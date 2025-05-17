// models/Producto.js
const DBHandler = require('./DBHandler');
const db = new DBHandler('productos.json');
const categorias = ['farmacia', 'comida', 'otro'];

class Producto {
  constructor({
    id,
    nombre,
    categoria,
    precio,
    stock = 0,
    fechaVencimiento = null,
    descripcion = '',
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;
    this.stock = stock;
    this.fechaVencimiento = fechaVencimiento;
    this.descripcion = descripcion;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static getCategorias() {
    return categorias;
  }

  static async findAll() {
    return await db.readData();
  }

  static async findById(id) {
    const data = await db.readData();
    return data.find(p => parseInt(p.id) === parseInt(id));
  }
  
  static async findByCategoria(categoria) {
    const data = await db.readData();
    return data.filter(p => p.categoria === categoria);
  } 

  static async create({ nombre, categoria, precio, stock, descripcion, fechaVencimiento }) {
    const productos = await db.readData();
  
    const nuevoId = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;
    const nuevoProducto = {
      id: nuevoId,
      nombre,
      categoria,
      precio: parseFloat(precio),
      stock: stock !== undefined ? parseInt(stock) : 0,
      descripcion,
      fechaVencimiento,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  
    productos.push(nuevoProducto);
    await db.writeData(productos);
  
    return nuevoProducto;
  }
  
  static async update(id, updatedFields) {
    return await db.updateData(id, updatedFields);
  }
  
  static async delete(id) {
    return await db.deleteData(id);
  }
  
}

module.exports = Producto;
