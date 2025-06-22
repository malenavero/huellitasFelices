const Turno = require("../models/turno_model");
const Paciente = require("../models/paciente_model");
const { getDuplicatedError } = require("./utils");

module.exports = {
  async findAll(query = {}) {
    const filtro = {};

    if (query.servicio) filtro.servicio = query.servicio;

    if (query.fecha) {
      const [year, month, day] = query.fecha.split("-").map(Number);
      const desde = new Date(year, month - 1, day); // local
      const hasta = new Date(year, month - 1, day + 1); // día siguiente

      filtro.fecha = { $gte: desde, $lt: hasta };
    }


    if (query.pacienteId) {
      filtro.pacienteId = query.pacienteId;
    }

    const turnos = await Turno.find(filtro)
    .sort({ fecha: 1, hora: 1 }) // más viejo a más nuevo
    .populate("pacienteId") // Esto trae el objeto Paciente
    .lean();


    return turnos;
  },

  async findById(id) {
    const turno = await Turno.findById(id)
      .populate("pacienteId")
      .lean();
    if (!turno) return null;
   
    return turno;
  },

  async create(data) {
    const { fecha, hora, precio, servicio, pacienteId } = data;

    const pacienteExiste = await Paciente.findById(pacienteId);
    if (!pacienteExiste) {
      throw new Error("Paciente no existe. No se puede crear turno.");
    }
    const [year, month, day] = fecha.split("-").map(Number);

    try {
      return await Turno.create({
        fecha: new Date(year, month - 1, day),
        hora,
        precio,
        servicio,
        pacienteId
      });
    } catch (err) {
      if (err.code === 11000) throw getDuplicatedError(err);
      throw err;
    }
  },
  async update(id, updatedFields) {
    if (updatedFields.fecha) {
      updatedFields.fecha = new Date(updatedFields.fecha);
    }

    if (updatedFields.pacienteId) {
      const pacienteExiste = await Paciente.findById(updatedFields.pacienteId);
      if (!pacienteExiste) throw new Error("Paciente no existe. No se puede actualizar turno.");
    }

    try {
      const updated = await Turno.findByIdAndUpdate(
        id,
        { $set: updatedFields },
        { new: true, runValidators: true }
      )
      .populate("pacienteId") // <- populamos el paciente para mostrar info
      .lean();

      return updated;
    } catch (err) {
      if (err.code === 11000) throw getDuplicatedError(err);
      throw err;
    }
  },


  async delete(id) {
    const deleted = await Turno.findByIdAndDelete(id);
    return deleted ? deleted._id : null;
  }
};
