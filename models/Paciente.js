const DBHandler = require('./DBHandler');
const db = new DBHandler('pacientes.json');
const { getNewId } = require('./utils.js');

class Paciente {
  constructor({
    id,
    nombre,
    especie,
    raza,
    fechaNacimiento,
    responsable,
    fichaMedica = [],
    consultas = [],
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.nombre = nombre;
    this.especie = especie;
    this.raza = raza;
    this.fechaNacimiento = fechaNacimiento;
    this.responsable = responsable;
    this.fichaMedica = fichaMedica;
    this.consultas = consultas;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  get edad() {
    return Paciente.calcularEdad(this.fechaNacimiento);
  }

  static calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return null;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  static async findAll(query = {}) {
    const pacientes = await db.readData();
    let pacientesFiltrados = pacientes;

    if (query.nombre) {
      pacientesFiltrados = pacientesFiltrados.filter(p => p.nombre === query.nombre);
    }

    return pacientesFiltrados.map(p => new Paciente(p));
  }

  static async findById(id) {
    const pacientes = await db.readData();
    const paciente = pacientes.find(p => parseInt(p.id) === parseInt(id));
    if (!paciente) return null;
    return new Paciente(paciente);
  }

  async save() {
    const pacientes = await db.readData();
    const index = pacientes.findIndex(p => p.id === this.id);
    const now = new Date().toISOString();

    if (index === -1) {
      // Nuevo paciente
      this.id = getNewId(pacientes);
      this.createdAt = now;
      this.updatedAt = now;
      pacientes.push(this);
    } else {
      // Actualización
      this.updatedAt = now;
      pacientes[index] = this;
    }

    await db.writeData(pacientes);
    return this;
  }

  static async update(id, updatedFields) {
    // Opcional: podés dejar este helper o eliminarlo si preferís solo save()
    const paciente = await Paciente.findById(id);
    if (!paciente) return null;

    Object.assign(paciente, updatedFields);
    return paciente.save();
  }

  static async delete(id) {
    return await db.deleteData(id);
  }

  static async addConsulta(id, nuevaConsulta) {
    const paciente = await Paciente.findById(id);
    if (!paciente) return null;

    if (!paciente.consultas) paciente.consultas = [];
    if (!nuevaConsulta.fecha) nuevaConsulta.fecha = new Date().toISOString();
    paciente.consultas.push(nuevaConsulta);

    return paciente.save();
  }
}

module.exports = Paciente;
