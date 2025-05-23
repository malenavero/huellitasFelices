// models/Turno.js
const DBHandler = require('./DBHandler');
const db = new DBHandler('turnos.json');

class Turno {
  constructor({
    id,
    fecha,
    hora,
    pacienteId,
    servicio,
    precio,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.id = id;
    this.fecha = fecha;
    this.hora = hora;
    this.pacienteId = pacienteId;
    this.servicio = servicio;
    this.precio = precio;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static async findAll(query = {}) {
    const data = await db.readData();
    let filteredData = data;
    if (query.servicio) {
        filteredData = data.filter(p => p.servicio === query.servicio);
    }
    if (query.fecha) {
        filteredData = data.filter(p => p.fecha === query.fecha);
    }
    if (query.pacienteId) {
        filteredData = data.filter(p => p.pacienteId === query.pacienteId);
    }
    // aca podmeos agregar si pensamos mas campos de filtrado
    return filteredData;  
  }

  static async findById(id) {
    const data = await db.readData();
    return data.find(t => parseInt(t.id) === parseInt(id));
  }

  static async create({ fecha, hora, pacienteId, servicio, precio}) {
    const turnos = await db.readData();
    const nuevoId = db.getNewId(turnos)
    const now = new Date().toISOString();

    const nuevoTurno = {
      id: nuevoId,
      fecha,
      hora,
      pacienteId,
      servicio,
      precio,
      createdAt: now,
      updatedAt: now
    };

    turnos.push(nuevoTurno);
    await db.writeData(turnos);

    return nuevoTurno;
  }

  static async update(id, updatedFields) {
    return await db.updateData(id, updatedFields);
  }

  static async delete(id) {
    return await db.deleteData(id);
  }
}

module.exports = Turno;
