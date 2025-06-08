// scripts/seed_usuarios.js

const Usuario = require("../models/usuario_model.js");

const usuarios = [
  {
    nombre: "Emanuel",
    apellido: "Escalante",
    telefono: "1122334455",
    direccion: "Calle Ficticia 123",
    correo: "emanuel@huellitasfelices.com",
    password: "$2b$10$7Z406ZlN1VaHBmhMe1ZFKO.pBHbisEimshsaty4t27jltRlRUZ8qu",
    rol: "gerencia",
  },
  {
    nombre: "Gonzalo",
    apellido: "Gomez",
    telefono: "1166778899",
    direccion: "Av. Mascotas 456",
    correo: "gonzalo@huellitasfelices.com",
    password: "$2b$10$7Z406ZlN1VaHBmhMe1ZFKO.pBHbisEimshsaty4t27jltRlRUZ8qu",
    rol: "ventas",
  },
  {
    nombre: "Susana",
    apellido: "Fernandez",
    telefono: "1133445566",
    direccion: "Calle Canina 789",
    correo: "susana@huellitasfelices.com",
    password: "$2b$10$7Z406ZlN1VaHBmhMe1ZFKO.pBHbisEimshsaty4t27jltRlRUZ8qu",
    rol: "peluqueria",
  },
  {
    nombre: "Cristian",
    apellido: "Sosa",
    telefono: "1177889900",
    direccion: "Paseo de los Patitas 101",
    correo: "cristian@huellitasfelices.com",
    password: "$2b$10$7Z406ZlN1VaHBmhMe1ZFKO.pBHbisEimshsaty4t27jltRlRUZ8qu",
    rol: "peluqueria",
  },
  {
    nombre: "Laura",
    apellido: "Martinez",
    telefono: "1199887766",
    direccion: "Ruta 3 Km 25",
    correo: "laura@ejemplo.com",
    password: "$2b$10$7Z406ZlN1VaHBmhMe1ZFKO.pBHbisEimshsaty4t27jltRlRUZ8qu",
    rol: "admin",
  },
  {
    nombre: "Diego",
    apellido: "Ruiz",
    telefono: "1155443322",
    direccion: "Av. Felina 33",
    correo: "diego@ejemplo.com",
    password: "$2b$10$7Z406ZlN1VaHBmhMe1ZFKO.pBHbisEimshsaty4t27jltRlRUZ8qu",
    rol: "admin",
  },
  {
    nombre: "Paula",
    apellido: "Nuñez",
    telefono: "1122113344",
    direccion: "Barrio Mascotero 18",
    correo: "paula@ejemplo.com",
    password: "$2b$10$7Z406ZlN1VaHBmhMe1ZFKO.pBHbisEimshsaty4t27jltRlRUZ8qu",
    rol: "clinica",
  },
  {
    nombre: "Hugo",
    apellido: "Salas",
    telefono: "1177332211",
    direccion: "Calle del Gato 777",
    correo: "hugo@ejemplo.com",
    password: "$2b$10$7Z406ZlN1VaHBmhMe1ZFKO.pBHbisEimshsaty4t27jltRlRUZ8qu",
    rol: "ventas",
  },
  {
    nombre: "Valeria",
    apellido: "Mendez",
    telefono: "1133992277",
    direccion: "Esquina Perruna 9",
    correo: "valeria@ejemplo.com",
    password: "$2b$10$7Z406ZlN1VaHBmhMe1ZFKO.pBHbisEimshsaty4t27jltRlRUZ8qu",
    rol: "recepcion",
  },
  {
    nombre: "nicolás",
    apellido: "pereyra",
    telefono: "1155337799",
    direccion: "av. salud animal 100",
    correo: "nicolas@ejemplo.com",
    password: "$2b$10$7Z406ZlN1VaHBmhMe1ZFKO.pBHbisEimshsaty4t27jltRlRUZ8qu",
    rol: "gerencia",
  }
];

async function seedUsuarios() {
  try {
    const count = await Usuario.countDocuments();
    if (count === 0) {
      await Usuario.insertMany(usuarios);
      console.log("✅ Usuarios iniciales creados.");
    } else {
      console.log("ℹ️ Usuarios ya existen. Seed no ejecutado.");
    }
  } catch (error) {
    console.error("❌ Error al ejecutar el seed de usuarios:", error);
  }
}

module.exports = seedUsuarios;
