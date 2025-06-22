const mongoose = require("mongoose");
const { METODOS_PAGO, ESTADOS_VENTA } = require("../utils/constants");

const itemVentaSchema = new mongoose.Schema({
  productoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Producto",
    required: true
  },
  nombreProducto: {
    type: String,
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1
  },
  precioUnitario: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
});

const ventaSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  items: {
    type: [itemVentaSchema],
    required: true
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  pago: {
    metodo: {
     type: String,
      enum: METODOS_PAGO,
      required: true
    },
    detalles: {
      // aca iria tipo numero de tarjeta, nombre, etc, lo que cargue en el coso de la tarjeta en caso de haber. 
      // por ahora dejemoslo vacio
    }
  }, 
  estado: {
    type: String,
    enum: ESTADOS_VENTA,
    default: "pendiente"
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  },
  updatedAt: {
    type: Date,
    default: () => new Date()
  },
  fechaPago: Date,
  observaciones: String
});

ventaSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

ventaSchema.pre("findOneAndUpdate", function (next) {
  this._update.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Venta", ventaSchema);
