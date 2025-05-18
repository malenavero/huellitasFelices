const DBHandler = require('./DBHandler');
const db = new DBHandler('pacientes.json');

class Paciente {
  constructor({ id, nombre, especie, raza, fechaNacimiento, responsable, fichaMedica = [], createdAt, updatedAt }) {
    this.id = id;
    this.nombre = nombre;
    this.especie = especie;
    this.raza = raza;
    this.fechaNacimiento = fechaNacimiento; // AAAA-MM-DD
    this.responsable = responsable;
    this.fichaMedica = fichaMedica;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Método para calcular edad en años basado en fechaNacimiento
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

  // Cuando listamos, agregamos la edad calculada
  static async findAll() {
    const pacientes = await db.readData();
    return pacientes.map(p => ({
      ...p,
      edad: this.calcularEdad(p.fechaNacimiento)
    }));
  }

  static async findById(id) {
    const pacientes = await db.readData();
    const paciente = pacientes.find(p => parseInt(p.id) === parseInt(id));
    if (!paciente) return null;
    return {
      ...paciente,
      edad: this.calcularEdad(paciente.fechaNacimiento)
    };
  }

  static async create({ nombre, especie, raza, fechaNacimiento, responsable }) {
    const pacientes = await db.readData();
    const nuevoId = pacientes.length > 0 ? pacientes[pacientes.length - 1].id + 1 : 1;

    const nuevoPaciente = {
      id: nuevoId,
      nombre,
      especie,
      raza,
      fechaNacimiento,
      responsable,
      fichaMedica: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    pacientes.push(nuevoPaciente);
    await db.writeData(pacientes);
    return {
      ...nuevoPaciente,
      edad: this.calcularEdad(fechaNacimiento)
    };
  }

  static async update(id, updatedFields) {
    // Actualizamos los datos
    const pacienteActualizado = await db.updateData(id, updatedFields);
    if (!pacienteActualizado) return null;

    // Calculamos edad con fechaNacimiento actualizada o previa
    const fechaNac = updatedFields.fechaNacimiento || pacienteActualizado.fechaNacimiento;
    return {
      ...pacienteActualizado,
      edad: this.calcularEdad(fechaNac)
    };
  }

  static async delete(id) {
    return await db.deleteData(id);
  }
}

module.exports = Paciente;
