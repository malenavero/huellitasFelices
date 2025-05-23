const DBHandler = require('./DBHandler');
const db = new DBHandler('productos.json');

class Producto {
  static async findAll(query = {}) {
    const data = await db.readData();
    let filteredData = data;
    if (query.categoria) {
        filteredData = data.filter(p => p.categoria === query.categoria);
    }
    // aca podmeos agregar si pensamos mas campos de filtrado
    return filteredData;  
  }

  static async findById(id) {
    const data = await db.readData();
    return data.find(p => parseInt(p.id) === parseInt(id));
  }

  static async create({ nombre, categoria, precio, stock, descripcion, fechaVencimiento }) {
    const productos = await db.readData();
    const nuevoId = db.getNewId(productos)

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
    const productId = parseInt(id);
    return db.updateData(productId, updatedFields);
  }

  static async delete(id) {
    const productId = parseInt(id);
    return db.deleteData(productId);
  }
}

module.exports = Producto;
