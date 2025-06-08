const Busqueda = require("../models/busqueda_model");

const busquedas = [
  {
    tipo: "perdida",
    nombre: "Firulais",
    zona: "Villa Crespo",
    descripcion: "Cariñoso, da la patita",
    contacto: "1133224455",
    animal: "perro",
    color: "marrón"
  },
  {
    tipo: "encontrada",
    nombre: "Nina",
    zona: "Flores",
    descripcion: "Gatita rescatada, busca hogar responsable",
    contacto: "1144556677",
    animal: "gato",
    color: "blanco"
  },
  {
    tipo: "perdida",
    zona: "Caballito",
    descripcion: "Conejo blanco con manchas negras",
    contacto: "1122003344",
    animal: "conejo",
    color: "blanco y negro"
  },
  {
    tipo: "encontrada",
    nombre: "Lola",
    zona: "Almagro",
    descripcion: "Cachorra muy juguetona y sociable",
    contacto: "1177889900",
    animal: "perro",
    color: "negro y mancha blanca en el ocico"
  },
  {
    tipo: "perdida",
    nombre: "Mishka",
    zona: "Palermo",
    descripcion: "Gata con collar rosa, se escapó del balcón",
    contacto: "1155337799",
    animal: "gato",
    color: "gris"
  }
];

async function seedBusquedas() {
  try {
    const count = await Busqueda.countDocuments();
    if (count === 0) {
      await Busqueda.insertMany(busquedas);
      console.log("✅ Búsquedas iniciales creadas.");
    } else {
      console.log("ℹ️ Búsquedas ya existen. Seed no ejecutado.");
    }
  } catch (error) {
    console.error("❌ Error al ejecutar el seed de búsquedas:", error);
  }
}

module.exports = seedBusquedas;
