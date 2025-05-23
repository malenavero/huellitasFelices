const {getNewId, parseBoolean} = require('./utils.js')
const DBHandler = require('./DBHandler');
const db = new DBHandler('busquedas.json');

class Busqueda {
  static async findAll(query = {}) {
    const data = await db.readData();
    let result = data;

    if (query.tipo) {
      result = result.filter(b => b.tipo === query.tipo);
    }

    if (query.animal) {
      result = result.filter(b => b.animal.toLowerCase() === query.animal.toLowerCase());
    }

    if (query.nombre) {
      result = result.filter(b => b.nombre?.toLowerCase().includes(query.nombre.toLowerCase()));
    }

    const activaBool = parseBoolean(query.activa);
    if (activaBool !== null) {
      result = result.filter(b => b.activa === activaBool);
    }

    return result;
  }

  static async findById(id) {
    const data = await db.readData();
    return data.find(b => parseInt(b.id) === parseInt(id));
  }

  static async create({ tipo, nombre, zona, fecha, descripcion, contacto, imagen, animal, color, activa }) {
    const busquedas = await db.readData();
    const nuevoId = getNewId(busquedas);
    const now = new Date().toISOString();

    const fechaFinal = fecha || new Date().toISOString().slice(0, 10);
    const activaFinal = typeof activa === 'boolean' ? activa : true;

    const nuevaBusqueda = {
      id: nuevoId,
      tipo, // 'perdida' o 'encontrada'
      nombre: nombre || null,
      zona,
      fecha: fechaFinal,
      descripcion: descripcion || '',
      contacto,
      imagen: imagen || null,
      animal, // gato, perro, etc
      color: color || null,
      activa: activaFinal,
      createdAt: now,
      updatedAt: now
    };

    busquedas.push(nuevaBusqueda);
    await db.writeData(busquedas);
    return nuevaBusqueda;
  }

  static async update(id, updatedFields) {
    updatedFields.updatedAt = new Date().toISOString();
    const busquedaId = parseInt(id);
    return db.updateData(busquedaId, updatedFields);
  }

  static async delete(id) {
    const busquedaId = parseInt(id);
    return db.deleteData(busquedaId);
  }
}

module.exports = Busqueda;
