// models/busqueda_model.js

const mongoose = require("mongoose");
const {  TIPOS_BUSQUEDA, ANIMALES_VALIDOS } = require("../utils/constants");

const busquedaSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true,
    enum: TIPOS_BUSQUEDA
  },
  nombre: {
    type: String,
    default: null,
    trim: true
  },
  zona: {
    type: String,
    required: true,
    trim: true
  },
  fecha: {
    type: Date,
    default: () => new Date()
  },
  descripcion: {
    type: String,
    default: "",
    trim: true
  },
  contacto: {
    type: String,
    required: true,
    trim: true
  },
  imagen: {
    type: String,
    default: null
  },
  animal: {
    type: String,
    required: true,
    enum: ANIMALES_VALIDOS

  },
  color: {
    type: String,
    default: null,
    trim: true
  },
  activa: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  },
  updatedAt: {
    type: Date,
    default: () => new Date()
  }
});

busquedaSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

busquedaSchema.pre("findOneAndUpdate", function (next) {
  this._update.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Busqueda", busquedaSchema);
