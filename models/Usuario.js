const DBHandler = require('./DBHandler');
const db = new DBHandler('usuarios.json');

class Usuario {
  constructor({ id, nombre, apellido, password, telefono, direccion, correo, rol, createdAt, updatedAt }) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.password = password;
    this.telefono = telefono;
    this.direccion = direccion;
    this.correo = correo;
    this.rol = rol;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  
  static async findAll() {
    return await db.readData();
  }

  static async findById(id) {
    const usuarios = await db.readData();
    const usuario = usuarios.find((u) => parseInt(u.id) === parseInt(id));
    
    if (!usuario) return null;
    return usuario;
  }

  static async findByEmail(correo) {
    const usuarios = await db.readData();
    const usuario = usuarios.find((u) => u.correo === correo);
    if (!usuario) return null;
    return usuario;
  }

  // Registra un nuevo usuario
  static async create({ nombre, apellido, password, telefono, direccion, correo, rol }) {
    const usuarios = await db.readData();
    const nuevoId = usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1;

    const nuevoUsuario = {
      id: nuevoId,
      nombre,
      apellido,
      password,
      telefono,
      direccion,
      correo,
      rol,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    usuarios.push(nuevoUsuario);
    await db.writeData(usuarios);

    return nuevoUsuario;
  }

  static async update(id, updatedFields) {
    // Actualizamos los datos
    const usuarioActualizado = await db.updateData(id, updatedFields);
    if (!usuarioActualizado) return null;

    return usuarioActualizado;
  }

  static async delete(id) {
    return await db.deleteData(id);
  }
}

module.exports = Usuario;
