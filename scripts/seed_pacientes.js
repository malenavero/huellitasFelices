const Paciente = require("../models/paciente_model");

const pacientes = [
  {
    nombre: "Kuru",
    especie: "perro",
    responsable: {
      nombre: "Emilio López",
      email: "emilio@mail.com",
      telefono: "1122334455"
    },
    fichaMedica: {
      peso: 12.5,
      raza: "Labrador",
      fechaNacimiento: new Date("2019-06-15"),
      alergias: ["Polen"]
    }
  },
  {
    nombre: "Michi",
    especie: "gato",
    responsable: {
      nombre: "Carlos Ruiz",
      email: "carlos@mail.com",
      telefono: "1133557799"
    },
    fichaMedica: {
      peso: 4.3,
      raza: "Siames",
      fechaNacimiento: new Date("2021-03-10"),
    }
  },
  {
    nombre: "Rocky",
    especie: "perro",
    responsable: {
      nombre: "Andrea Gómez",
      email: "andrea@mail.com",
      telefono: "1177889900"
    },
    fichaMedica: {
      peso: 20.2,
      raza: "Pitbull"
    }
  },
  {
    nombre: "Luna",
    especie: "gato",
    responsable: {
      nombre: "Federico Pérez",
      email: "fede@mail.com"
    },
    fichaMedica: {
      raza: "Persa"
    }
  },
  {
    nombre: "Coco",
    especie: "conejo",
    responsable: {
      nombre: "Valeria Montes",
      email: "valeria@mail.com"
    }
  }
];

async function seedPacientes() {
  try {
    const count = await Paciente.countDocuments();
    if (count === 0) {
      await Paciente.insertMany(pacientes);
      console.log("✅ Pacientes iniciales creados.");
    } else {
      console.log("ℹ️ Pacientes ya existen. Seed no ejecutado.");
    }
  } catch (error) {
    console.error("❌ Error al ejecutar el seed de pacientes:", error);
  }
}

module.exports = seedPacientes;
