const Turno = require("../models/turno_model");
const Paciente = require("../models/paciente_model");

module.exports = {
  async findAll(query = {}) {
    const filtro = {};

    if (query.servicio) filtro.servicio = query.servicio;
    if (query.fecha) filtro.fecha = query.fecha;
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
        fecha,
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
      if (err.code === 11000) {
        const campos = Object.keys(err.keyPattern || {});
        const errorDuplicado = new Error();
        errorDuplicado.code = 11000;
        errorDuplicado.campos = campos;
        throw errorDuplicado;
      }
      throw err;
    }
  },

  async update(id, updatedFields) {
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
      if (err.code === 11000) {
        const campos = Object.keys(err.keyPattern || {});
        const mensaje = `Ya existe un turno con ${campos.join(" y ")}`;
        const errorDuplicado = new Error(mensaje);
        errorDuplicado.code = 11000;
        errorDuplicado.keyPattern = err.keyPattern;
        throw errorDuplicado;
      }
      throw err;
    }
  },


  async delete(id) {
    const deleted = await Turno.findByIdAndDelete(id);
    return deleted ? deleted._id : null;
  }
};
