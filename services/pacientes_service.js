const Paciente = require("../models/paciente_model.js");
const { getDuplicatedError } = require("./utils");

module.exports = {
  /**
   * Obtiene todos los pacientes, opcionalmente filtrados por nombre (case-insensitive).
   */
  async findAll(query = {}) {
    const filtro = {};
    if (query.nombre) {
      filtro.nombre = { $regex: query.nombre, $options: "i" };
    }

    const pacientes = await Paciente.find(filtro).lean();
    return pacientes || [];
  },


  /**
   * Busca un paciente por su ObjectId.
   */
  async findById(id) {
    return await Paciente.findById(id).lean();
  },

  /**
   * Crea un nuevo paciente.
   */
  async create(data) {
    try {
      const nuevo = new Paciente(data);
      return await nuevo.save();
    } catch (err) {
        if (err.code === 11000) {
          throw getDuplicatedError(err);
        }
        throw err;
      }    
  },

  /**
   * Actualiza un paciente. Devuelve el documento actualizado.
   */
  async update(id, updatedFields) {
    try {
      return Paciente.findByIdAndUpdate(
        id,
        { $set: updatedFields },
        { new: true, runValidators: true }
      ).lean();

    } catch (err) {
      if (err.code === 11000) {
          const errorDuplicado = getDuplicatedError(err);
          throw errorDuplicado;
        } 
      throw err;
    }
  },

  /**
   * Elimina un paciente. Devuelve el _id eliminado (o null si no existía).
   */
  async delete(id) {
    const res = await Paciente.findByIdAndDelete(id);
    return res ? res._id : null;
  },
};
