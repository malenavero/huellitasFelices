// models/turno_model.js

const mongoose = require("mongoose");

const turnoSchema = new mongoose.Schema({
  fecha: {
    type: String,
    required: true,
    match: [/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"]
  },
  hora: {
    type: String,
    required: true,
    match: [/^\d{2}:\d{2}$/, "Hora inválida"]
  },
  servicio: {
    type: String,
    required: true,
    trim: true
  },
  precio: {
    type: Number,
    required: true,
    min: [0, "Precio debe ser un número positivo"]
  },
  paciente: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "Paciente", required: true },
    nombre: String,
    responsable: {
      nombre: String,
      email: String,
      telefono: String,
    }
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

// indice único para evitar turnos duplicados en fecha + hora + servicio
turnoSchema.index(
  { fecha: 1, hora: 1, servicio: 1 },
  { unique: true, name: "turno_unico_por_fecha_hora_servicio" }
);


// Hook para mantener actualizado el campo `updatedAt`
turnoSchema.pre("findOneAndUpdate", function (next) {
  this._update.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Turno", turnoSchema);
