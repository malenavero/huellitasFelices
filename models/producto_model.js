// producto_model.js

const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true, // índice único
    trim: true,
    lowercase: true,
    maxlength: 100
  },
  categoria: {
    type: String,
    enum: ["farmacia", "comida", "otros"],
    required: true
  },
  precio: {
    type: Number,
    min: [0.01, "Precio debe ser un número positivo"]
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, "Stock no puede ser negativo"]
  },
  descripcion: {
    type: String,
    default: "",
    maxlength: 255
  },
  fechaVencimiento: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Producto", productoSchema);
