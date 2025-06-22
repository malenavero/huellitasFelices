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

    if (query.pacienteId) filtro["paciente._id"] = query.pacienteId;

    const turnos = await Turno.find(filtro).lean();

    return turnos.map(t => ({
      ...t,
      paciente: t.paciente || {}
    }));
  },

  async findById(id) {
    const turno = await Turno.findById(id).lean();
    if (!turno) return null;

    return {
      ...turno,
      paciente: turno.paciente || {}
    };
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
        paciente: {
          _id: pacienteId,
          nombre: pacienteExiste.nombre,
          responsable: pacienteExiste.responsable
        }
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
      if (!pacienteExiste) {
        throw new Error("Paciente no existe. No se puede actualizar turno.");
      }

      updatedFields.paciente = {
        _id: pacienteExiste._id,
        nombre: pacienteExiste.nombre,
        responsable: pacienteExiste.responsable
      };
    }

    delete updatedFields.pacienteId;

    try {
      const updated = await Turno.findByIdAndUpdate(
        id,
        { $set: updatedFields },
        { new: true, runValidators: true }
      ).lean();

      return updated ? { ...updated, paciente: updated.paciente || {} } : null;
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
