const Turno = require("../models/turno_model");
const Paciente = require("../models/paciente_model");
const { getDuplicatedError } = require("./utils");

module.exports = {
  async findAll(query = {}) {
    const filtro = {};

    if (query.servicio) filtro.servicio = query.servicio;

    if (query.fecha) {
      const fechaDate = new Date(query.fecha);
      filtro.fecha = {
        $gte: fechaDate,
        $lt: new Date(fechaDate.getTime() + 24 * 60 * 60 * 1000) // hasta fin del día
      };
    }

    if (query.pacienteId) {
      filtro.pacienteId = query.pacienteId;
    }

    const turnos = await Turno.find(filtro)
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

    try {
      return await Turno.create({
        fecha: new Date(fecha),
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
