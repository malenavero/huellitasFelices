const Producto = require("../models/producto_model");

const productos = [
  {
    nombre: "alimento balanceado cachorro",
    categoria: "comida",
    precio: 12000,
    stock: 30,
    descripcion: "Alimento seco para cachorros de todas las razas",
  },
  {
    nombre: "vacuna antirrábica",
    categoria: "farmacia",
    precio: 2500,
    stock: 50,
    descripcion: "Vacuna obligatoria anual para perros y gatos",
  },
  {
    nombre: "cepillo dental canino",
    categoria: "otros",
    precio: 1500,
    stock: 20,
    descripcion: "Cepillo suave para higiene bucal de perros",
  },
  {
    nombre: "pipeta antipulgas gato",
    categoria: "farmacia",
    precio: 3200,
    stock: 40,
    descripcion: "Pipeta mensual contra pulgas para gatos",
  },
  {
    nombre: "alimento húmedo adulto",
    categoria: "comida",
    precio: 800,
    stock: 100,
    descripcion: "Comida en lata para perros adultos"
  }
];

async function seedProductos() {
  try {
    const count = await Producto.countDocuments();
    if (count === 0) {
      await Producto.insertMany(productos);
      console.log("✅ Productos iniciales creados.");
    } else {
      console.log("ℹ️ Productos ya existen. Seed no ejecutado.");
    }
  } catch (error) {
    console.error("❌ Error al ejecutar el seed de productos:", error);
  }
}

module.exports = seedProductos;
