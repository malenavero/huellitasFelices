// models/usuarios_model.js
const mongoose = require("mongoose");
const { ROLES } = require("../utils/constants");

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  password: { type: String, required: true },
  telefono: { type: String },
  direccion: { type: String },
  correo: { type: String, required: true, unique: true },
  rol: { 
    type: String,
    enum: ROLES,
  }
}, {
  timestamps: true
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;
