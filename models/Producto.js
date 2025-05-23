const DBHandler = require('./DBHandler');
const db = new DBHandler('productos.json');
const { getNewId } = require('./utils.js');

class Producto {
  static async findAll(query = {}) {
    const data = await db.readData();
    let filteredData = data;
    if (query.categoria) {
      filteredData = data.filter(p => p.categoria === query.categoria);
    }
    return filteredData;
  }

  static async findById(id) {
    const data = await db.readData();
    return data.find(p => parseInt(p.id) === parseInt(id));
  }

  static async create({ nombre, categoria, precio, stock, descripcion, fechaVencimiento }) {
    const productos = await db.readData();
    const nuevoId = getNewId(productos);

    const now = new Date().toISOString();
    const nuevoProducto = {
      id: nuevoId,
      nombre,
      categoria,
      precio: parseFloat(precio),
      stock: stock !== undefined ? parseInt(stock) : 0,
      descripcion: descripcion || '',
      fechaVencimiento: fechaVencimiento || null,
      createdAt: now,
      updatedAt: now
    };

    productos.push(nuevoProducto);
    await db.writeData(productos);

    return nuevoProducto;
  }

  static async update(id, updatedFields) {
    const productos = await db.readData();
    const productId = parseInt(id);
    const index = productos.findIndex(p => parseInt(p.id) === productId);
    if (index === -1) return null;

    productos[index] = {
      ...productos[index],
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };

    await db.writeData(productos);
    return productos[index];
  }

  static async delete(id) {
    const productos = await db.readData();
    const productId = parseInt(id);
    const index = productos.findIndex(p => parseInt(p.id) === productId);
    if (index === -1) return null;

    productos.splice(index, 1);
    await db.writeData(productos);
    return productId;
  }

  static async vender(id, cantidad = 1) {
    const productos = await db.readData();
    const productId = parseInt(id);
    const index = productos.findIndex(p => parseInt(p.id) === productId);
    if (index === -1) {
      throw new Error('Producto no encontrado');
    }

    if (productos[index].stock < cantidad) {
      throw new Error('Stock insuficiente');
    }

    productos[index].stock -= cantidad;
    productos[index].updatedAt = new Date().toISOString();

    await db.writeData(productos);
    return productos[index];
  }
}

module.exports = Producto;
