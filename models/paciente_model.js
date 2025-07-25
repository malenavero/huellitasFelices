// models/paciente_model.js

const mongoose = require("mongoose");
const { ANIMALES_VALIDOS } = require("../utils/constants.js");

// Subesquema para la ficha médica 
const fichaMedicaSchema = new mongoose.Schema({
  peso: {
    type: Number,
    min: [0, "Peso debe ser un número positivo"],
    default: null
  },
  raza: {
    type: String,
    trim: true,
    default: ""
  },
  fechaNacimiento: {
    type: Date,
    default: null
  },
  alergias: {
    type: [String],
    default: []
  },
  notas: {
    type: String,
    trim: true,
    default: ""
  },
  updatedAt: {
    type: Date,
    default: () => new Date()
  }
}, { _id: false });


// Subesquema para las consultas
const consultaSchema = new mongoose.Schema({
  fecha: { type: Date, default: () => new Date() },
  motivo: { type: String, required: true, trim: true },
  notas: { type: String, default: "", trim: true }
}, { _id: false });


// Subesquema para el responsable
const responsableSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, "Email inválido"]
  },
  telefono: { type: String, trim: true, default: "" }
}, { _id: false });



// Esquema principal
const pacienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    trim: true,
    maxlength: [100, "Máximo 100 caracteres"]
  },
  especie: {
    type: String,
    enum: {
      values: ANIMALES_VALIDOS,
      message: `Especie inválida. Válidas: ${ANIMALES_VALIDOS.join(", ")}`
    },
    required: [true, "La especie es obligatoria"]
  },

  responsable: {
    type: responsableSchema,
    required: [true, "Responsable obligatorio"]
  },

  fichaMedica: {
    type: fichaMedicaSchema,
    default: () => ({})
  },

  consultas: {
    type: [consultaSchema],
    default: []
  },
}, {
  timestamps: true
});

// Índice compuesto para evitar duplicados
pacienteSchema.index(
  { nombre: 1, "responsable.email": 1 },
  { unique: true, name: "nombre_responsable_email_unique" }
);

// Virtual para edad actualizada
pacienteSchema.virtual("edad").get(function () {
  const nacimiento = this.fichaMedica?.fechaNacimiento;
  if (!nacimiento) return null;
  const hoy = new Date();
  const nac = new Date(nacimiento);
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad;
});


// Hooks para fechas de actualizacion de los embebidos
pacienteSchema.pre("save", function (next) {
  if (this.fichaMedica) this.fichaMedica.updatedAt = new Date();
  next();
});
pacienteSchema.pre("findOneAndUpdate", function (next) {
  if (this._update.fichaMedica) {
    this._update["fichaMedica.updatedAt"] = new Date();
  }
  next();
});



pacienteSchema.set("toJSON", { virtuals: true });
pacienteSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Paciente", pacienteSchema);
