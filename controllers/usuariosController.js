const Usuario = require('../models/Usuario');
const { ROLES } = require('../utils/constants.js');
const { returnJSON, hashPassword, comparePassword, urls, handleError } = require('./utils.js');

async function getListParams(query = {}) {
  const usuarios = await Usuario.findAll(query);
  return {
    usuarios,
    roles: ROLES,
    ...urls,
  };
}

async function renderListView(res, status = 200, query = {}) {
  const params = await getListParams(query);
  return res.status(status).render('usuarios/index', params);
}

module.exports = {
  // GET
  async listar(req, res) {
    if (returnJSON(req)) {
      const usuarios = await Usuario.findAll(req.query);
      return res.status(200).json(usuarios);
    }

    return renderListView(res, 200, req.query);
  },

  // GET
  async detalle(req, res) {
    try {
      const usuario = await Usuario.findById(req.params.id);

      if (!usuario) {
        handleError(req, res, 404, 'Usuario no encontrado');
      }

      if (returnJSON(req)) {
        return res.status(200).json(usuario);
      }

      return res.status(200).render('usuarios/detalle', { usuario });
    } catch (error) {
      console.error(error);
      handleError(req, res, 500, 'Error al obtener el usuario');
    }
  },

  async formEditar(req, res) {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return handleError(req, res, 404, 'Usuario no encontrado');
    }
    res.render('usuarios/form', {
      modo: 'editar',
      usuario,
      roles: ROLES,
    });
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
      return renderListView(res, 201, req.query);

    } catch (error) {
      console.error(error);
      handleError(req, res, 500, 'Error al crear el usuario');
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
        handleError(req, res, 404, 'Usuario no encontrado');
      }

      if (returnJSON(req)) {
        return res.status(200).json(usuarioActualizado);
      }
      return renderListView(res, 201, req.query);

    } catch (error) {
      console.error(error);
      handleError(req, res, 500, 'Error al actualizar el usuario');
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
        handleError(req, res, 404, 'Usuario no encontrado');
      }

      if (returnJSON(req)) {
        return res.status(200).json({ message: 'Usuario eliminado' });
      }
      return renderListView(res, 201, req.query);

    } catch (error) {
      console.error(error);
      handleError(req, res, 500, 'Error al eliminar el usuario');
    }
  },

  // POST - Login de un usuario
  async login(req, res) {
    try {
      const { correo, password } = req.body;
      const usuario = await Usuario.findByEmail(correo);

      if (!usuario) {
        handleError(req, res, 401, 'Credenciales inválidas');
      }

      const passwordValido = await comparePassword(password, usuario.password);

      if (!passwordValido) {
        handleError(req, res, 401, 'Credenciales inválidas');
      }

      if (returnJSON(req)) {
        return res.status(200).json(usuario);
      }
      return res.status(200).redirect('/index');
      
    } catch (error) {
      console.error(error);
      handleError(req, res, 500, 'Error al iniciar sesión');
    }
  },
};
