const Busqueda = require("../models/busqueda_model.js"); // Asumo que ya lo nombraste así
const mongoose = require("mongoose");

async function findAll(query = {}) {
  const filtro = {};

  if (query.tipo) {
    filtro.tipo = query.tipo;
  }

  if (query.animal) {
    filtro.animal = new RegExp(query.animal, "i"); // la i es para case insensitive
  }

  if (query.nombre) {
    filtro.nombre = new RegExp(query.nombre, "i");
  }

  if (query.activa !== undefined) {
    const activa = query.activa === "true" || query.activa === true;
    filtro.activa = activa;
  }

  const resultados = await Busqueda.find(filtro).sort({ createdAt: -1 });
  return resultados;
}

async function findById(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  return await Busqueda.findById(id);
}

async function create(data) {
  const nuevaBusqueda = new Busqueda(data);
  return await nuevaBusqueda.save();
}

async function update(id, data) {
  if (!mongoose.isValidObjectId(id)) return null;

  const actualizada = await Busqueda.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  );

  return actualizada;
}

async function eliminar(id) {
  if (!mongoose.isValidObjectId(id)) return null;

  const resultado = await Busqueda.findByIdAndDelete(id);
  return resultado ? resultado._id : null;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  delete: eliminar
};
