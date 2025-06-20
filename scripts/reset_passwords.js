require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Usuario = require("../models/usuario_model.js");

async function resetPasswords() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectado a MongoDB");

    const passwordNuevo = "12345";
    const saltRounds = 10;
    const hashNuevo = await bcrypt.hash(passwordNuevo, saltRounds);

    const result = await Usuario.updateMany(
      {},
      { $set: { password: hashNuevo } }
    );

    console.log(`Contraseñas actualizadas en ${result.modifiedCount} usuarios`);

    await mongoose.disconnect();
    console.log("Desconectado de MongoDB");
  } catch (error) {
    console.error("Error al actualizar contraseñas:", error);
    process.exit(1);
  }
}

resetPasswords();
