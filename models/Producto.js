// models/Producto.js
const DBHandler = require('./DBHandler');
const db = new DBHandler('productos.json');
const categorias = ['farmacia', 'comida', 'otros'];
class Producto {
  constructor({ id, nombre, categoria, precio, stock, descripcion }) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;
    this.stock = stock;
    this.descripcion = descripcion;
  }

  static async findAll() {
    const data = await db.readData();
    return data;
  }

  static async findByCategoria(categoria) {
    const data = await db.readData();
    return data.filter(p => p.categoria === categoria);
  }

  static async findById(id) {
    const data = await db.readData();
    return data.find(p => p.id === id);
  }

  static async create(productoData) {
    const data = await db.readData();
    const nuevo = new Producto(productoData);
    data.push(nuevo);
    await db.writeData(data);
    return nuevo;
  }

  static async update(id, updatedFields) {
    const data = await db.readData();
    const index = data.findIndex(p => p.id === id);
    if (index === -1) return null;

    data[index] = { ...data[index], ...updatedFields };
    await db.writeData(data);
    return data[index];
  }

  static async delete(id) {
    let data = await db.readData();
    data = data.filter(p => p.id !== id);
    await db.writeData(data);
  }

  static getCategorias() {
    return categorias;
  }
}

module.exports = Producto;
