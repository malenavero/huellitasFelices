const DBHandler = require('./DBHandler');
const db = new DBHandler('busquedas.json');
const { getNewId, parseBoolean } = require('./utils.js');

class Busqueda {
  constructor(data) {
    this.id = data.id;
    this.tipo = data.tipo;
    this.nombre = data.nombre || null;
    this.zona = data.zona;
    this.fecha = data.fecha || new Date().toISOString().slice(0, 10);
    this.descripcion = data.descripcion || '';
    this.contacto = data.contacto;
    this.imagen = data.imagen || null;
    this.animal = data.animal;
    this.color = data.color || null;
    this.activa = typeof data.activa === 'boolean' ? data.activa : true;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

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

    return result.map(b => new Busqueda(b));
  }

  static async findById(id) {
    const data = await db.readData();
    const found = data.find(b => parseInt(b.id) === parseInt(id));
    return found ? new Busqueda(found) : null;
  }

  static async create(fields) {
    const busquedas = await db.readData();
    const nuevoId = getNewId(busquedas);
    const now = new Date().toISOString();

    const nuevaBusqueda = {
      id: nuevoId,
      tipo: fields.tipo,
      nombre: fields.nombre || null,
      zona: fields.zona,
      fecha: fields.fecha || new Date().toISOString().slice(0, 10),
      descripcion: fields.descripcion || '',
      contacto: fields.contacto,
      imagen: fields.imagen || null,
      animal: fields.animal,
      color: fields.color || null,
      activa: typeof fields.activa === 'boolean' ? fields.activa : true,
      createdAt: now,
      updatedAt: now
    };

    busquedas.push(nuevaBusqueda);
    await db.writeData(busquedas);

    return new Busqueda(nuevaBusqueda);
  }

  // Actualiza esta instancia y la guarda en DB
  async update(updatedFields) {
    this.updatedAt = new Date().toISOString();

    Object.assign(this, updatedFields);

    const data = await db.readData();
    const index = data.findIndex(b => b.id === this.id);
    if (index === -1) return false;

    data[index] = this;
    await db.writeData(data);
    return true;
  }

  // Elimina esta instancia de la DB
  async delete() {
    const data = await db.readData();
    const index = data.findIndex(b => b.id === this.id);
    if (index === -1) return false;

    data.splice(index, 1);
    await db.writeData(data);
    return true;
  }
}

module.exports = Busqueda;
