const Producto = require("../models/producto_model.js");
const { getDuplicatedError } = require("./utils");

module.exports = {
  async findAll(query = {}) {
    const filtro = {};

    if (query.categoria) filtro.categoria = query.categoria;

    if (query.nombre) {
      filtro.nombre = { $regex: query.nombre, $options: "i" };
    }

    if (query.ocultarSinStock) {
      filtro.stock = { $gt: 0 };
    }

    return await Producto.find(filtro).lean();
  },


  async findById(id) {
    return await Producto.findById(id).lean();
  },


  async create(data) {
    try {
      const nuevoProducto = new Producto(data);
      return await nuevoProducto.save();
    } catch (err) {
      if (err.code === 11000) {
          throw getDuplicatedError(err);
        } 
      throw err;
    }
  },


  async update(id, updatedFields) {
    try {
      return await Producto.findByIdAndUpdate(id, updatedFields, {
        new: true,
        runValidators: true
      }).lean();
    } catch (err) {
      if (err.code === 11000) {
          throw getDuplicatedError(err);
        }
      throw err;
    }
  },


  async delete(id) {
    const resultado = await Producto.findByIdAndDelete(id);
    return resultado ? resultado._id : null;
  },

  async validarStock(id, cantidad) {
    const producto = await Producto.findById(id);
    if (!producto) throw new Error("Producto no encontrado");
    if (producto.stock < cantidad) throw new Error("Stock insuficiente");
    return producto;
  },

  async descontarStock(id, cantidad) {
    await Producto.findByIdAndUpdate(id, { $inc: { stock: -cantidad } });
  }


};
