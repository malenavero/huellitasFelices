const Usuario = require('../models/Usuario');
const { returnJSON, hashPassword, comparePassword } = require('./utils.js');

module.exports = {
  // GET
  async listar(req, res) {
    const usuarios = await Usuario.findAll();

    if (returnJSON(req)) {
      return res.status(200).json(usuarios);
    }

    return res.status(200).render('usuarios/index', { usuarios });
  },

  // GET
  async detalle(req, res) {
    try {
      const usuario = await Usuario.findById(req.params.id);
      
      if (!usuario) {
        if (returnJSON(req)) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        } else {
          return res
            .status(404)
            .render('errors/404', { mensaje: 'Usuario no encontrado' });
        }
      }

      if (returnJSON(req)) {
        return res.status(200).json(usuario);
      }

      return res.status(200).render('usuarios/detalle', { usuario });

    }catch (error) {
      console.error(error);
      if (returnJSON(req)) {
        return res.status(500).json({ error: 'Error al obtener el usuario' });
      }
    }
  },

  // POST - Registro de un nuevo usuario
  async crear(req, res) {
    try {
      const { nombre, apellido, password, telefono, direccion, correo, rol } =
        req.body;

      passEncriptada = await hashPassword(password);

      const nuevoUsuario = await Usuario.create({
        nombre,
        apellido,
        password: passEncriptada,
        telefono,
        direccion,
        correo,
        rol,
      });

      if (returnJSON(req)) {
        return res.status(201).json(nuevoUsuario);
      }
      const usuarios = await Usuario.findAll();
      return res.status(201).render('usuarios/index', { usuarios });
    } catch (error) {
      console.error(error);
      if (returnJSON(req)) {
        return res.status(500).json({ error: 'Error al crear el usuario' });
      }
      return res
        .status(500)
        .render('errors/500', { mensaje: 'Error al crear el usuario' });
    }
  },

  // PUT - Actualizar un usuario
  async actualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const datosActualizados = req.body;

      if (datosActualizados.password) {
        passEncriptada = await hashPassword(datosActualizados.password);
        datosActualizados.password = passEncriptada;
      } 

      const usuarioActualizado = await Usuario.update(id, datosActualizados);

      if (!usuarioActualizado) {
        if (returnJSON(req)) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        } else {
          return res
            .status(404)
            .render('errors/404', { mensaje: 'Usuario no encontrado' });
        }
      }

      if (returnJSON(req)) {
        return res.status(200).json(usuarioActualizado);
      }

      return res
        .status(200)
        .render('usuarios/detalle', { usuario: usuarioActualizado });
    } catch (error) {
      console.error(error);
      if (returnJSON(req)) {
        return res
          .status(500)
          .json({ error: 'Error al actualizar el usuario' });
      }
    }
  },
  // DELETE - Eliminar un usuario
  async eliminar(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }
      const eliminado = await Usuario.delete(id);

      if (!eliminado) {
        if (returnJSON(req)) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        } else {
          return res
            .status(404)
            .render('errors/404', { mensaje: 'Usuario no encontrado' });
        }
      }

      if (returnJSON(req)) {
        return res.status(200).json({ message: 'Usuario eliminado' });
      }

      const usuarios = await Usuario.findAll();
      return res.status(200).render('usuarios/index', { usuarios });
    } catch (error) {
      console.error(error);
      if (returnJSON(req)) {
        return res.status(500).json({ error: 'Error al eliminar el usuario' });
      }
    }
  },

  // POST - Login de un usuario
  async login(req, res) {
    try {
      const { correo, password } = req.body;
      const usuario = await Usuario.findByEmail(correo);

      if (!usuario) {
        if (returnJSON(req)) {
          return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        return res
          .status(401)
          .render('errors/401', { mensaje: 'Credenciales inválidas' });
      }

      const passwordValido = await comparePassword(password, usuario.password);

      if (!passwordValido) {
        if (returnJSON(req)) {
          return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        return res
          .status(401)
          .render('errors/401', { mensaje: 'Credenciales inválidas' });
      }

      if (returnJSON(req)) {
        return res.status(200).json(usuario);
      }

      return res.status(200).redirect('/index');
    } catch (error) {
      console.error(error);
      if (returnJSON(req)) {
        return res.status(500).json({ error: 'Error al iniciar sesión' });
      }
    }
  },
};
