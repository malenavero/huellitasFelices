const DBHandler = require("./DBHandler");
const Paciente = require("./Paciente");
const db = new DBHandler("turnos.json");
const { getNewId } = require("./utils.js");

class Turno {
  constructor({
    id,
    fecha,
    hora,
    pacienteId,
    servicio,
    precio,
    paciente = null,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.id = id;
    this.fecha = fecha;
    this.hora = hora;
    this.pacienteId = pacienteId;
    this.servicio = servicio;
    this.precio = precio;
    this.paciente = paciente; // puede ser null o instancia Paciente
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  async cargarPaciente() {
    if (!this.paciente && this.pacienteId) {
      const pacienteData = await Paciente.findById(this.pacienteId);
      if (pacienteData) {
        this.paciente = new Paciente(pacienteData);
      }
    }
    return this.paciente;
  }

  static async findAll(query = {}) {
    const data = await db.readData();

    let filteredData = data;

    if (query.servicio) {
      filteredData = filteredData.filter(p => p.servicio === query.servicio);
    }
    if (query.fecha) {
      filteredData = filteredData.filter(p => p.fecha === query.fecha);
    }
    if (query.pacienteId) {
      filteredData = filteredData.filter(p => p.pacienteId === query.pacienteId);
    }

    return filteredData.map(item => new Turno(item));
  }

  static async findById(id) {
    const data = await db.readData();
    const turnoData = data.find(t => parseInt(t.id) === parseInt(id));
    if (!turnoData) return null;
    return new Turno(turnoData);
  }

  static async create({ fecha, hora, pacienteId, servicio, precio }) {
    // Validar existencia paciente antes de crear turno
    const pacienteData = await Paciente.findById(pacienteId);
    if (!pacienteData) {
      throw new Error("Paciente no existe. No se puede crear turno.");
    }

    const turnos = await db.readData();
    const nuevoId = getNewId(turnos);
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

    return new Turno({ ...nuevoTurno, paciente: new Paciente(pacienteData) });
  }

  static async update(id, updatedFields) {
    // Si se intenta actualizar pacienteId, validar que exista el paciente
    if (updatedFields.pacienteId) {
      const pacienteData = await Paciente.findById(updatedFields.pacienteId);
      if (!pacienteData) {
        throw new Error("Paciente no existe. No se puede actualizar turno.");
      }
    }

    const updated = await db.updateData(id, updatedFields);
    if (!updated) return null;

    return Turno.findById(id);
  }

  static async delete(id) {
    return await db.deleteData(id);
  }
}

module.exports = Turno;
