const Usuario = require("../models/usuario_model");
const { getDuplicatedError } = require("./utils");

async function findAll() {
  return await Usuario.find().lean();
}

async function findById(id) {
  return await Usuario.findById(id).lean();
}

async function findOneByQuery(query) {
  console.log("USUARIOS EXISTENTES", Usuario.find().lean())
    console.log("query", query)

  return await Usuario.findOne(query).lean();
}

async function create(data) {
  try {
    const nuevoUsuario = new Usuario(data);
    return await nuevoUsuario.save();
  } catch (err) {
    if (err.code === 11000) {
      throw getDuplicatedError(err);
    }
    throw err;
  }
}

async function update(id, updatedFields) {
  try {
    return await Usuario.findByIdAndUpdate(
      id,
      { ...updatedFields, updatedAt: new Date() },
      {
        new: true,
        runValidators: true
      }
    ).lean();
  } catch (err) {
    if (err.code === 11000) {
      throw getDuplicatedError(err);
    }
    throw err;
  }
}

async function deleteUser(id) {
  const resultado = await Usuario.findByIdAndDelete(id);
  return resultado ? resultado._id : null;
}

module.exports = {
  findAll,
  findById,
  findOneByQuery,
  create,
  update,
  deleteUser
};
