// models/turno_model.js

const mongoose = require("mongoose");
const { SERVICIOS } = require("../utils/constants");

const turnoSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: true,
  },
  hora: {
    type: String,
    required: true,
    match: [/^\d{2}:\d{2}$/, "Hora inválida"]
  },
  servicio: {
    type: String,
    required: true,
    enum: SERVICIOS
  },
  precio: {
    type: Number,
    required: true,
    min: [0, "Precio debe ser un número positivo"]
  },
  pacienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Paciente",
    required: true
  },
  pagado: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// indice único para evitar turnos duplicados en fecha + hora + servicio
turnoSchema.index(
  { fecha: 1, hora: 1, servicio: 1 },
  { unique: true, name: "turno_unico_por_fecha_hora_servicio" }
);


module.exports = mongoose.model("Turno", turnoSchema);
