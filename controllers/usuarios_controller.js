const {
  findAll,
  findById,
  create,
  update,
  deleteUser,
} = require("../services/usuarios_service");

const { ROLES } = require("../utils/constants.js");
const { returnJSON, hashPassword, urls, handleError, handleDuplicados } = require("./utils.js");

async function getListParams(query = {}) {
  const usuarios = await findAll(query);
  return {
    usuarios,
    roles: ROLES,
    ...urls,
  };
}

async function renderListView(res, status = 200, query = {}) {
  const params = await getListParams(query);
  return res.status(status).render("usuarios/index", params);
}

async function listar(req, res) {
  const usuarios = await findAll(req.query);
  if (returnJSON(req)) {
    return res.status(200).json(usuarios);
  }
  return renderListView(res, 200, req.query);
}

async function detalle(req, res) {
  try {
    const usuario = await findById(req.params.id);

    if (!usuario) {
      return handleError(req, res, 404, "Usuario no encontrado");
    }

    if (returnJSON(req)) {
      return res.status(200).json(usuario);
    }

    return res.status(200).render("usuarios/detalle", { usuario });
  } catch (error) {
    console.error(error);
    return handleError(req, res, 500, "Error al obtener el usuario");
  }
}

async function formEditar(req, res) {
  const usuario = await findById(req.params.id);
  if (!usuario) {
    return handleError(req, res, 404, "Usuario no encontrado");
  }

  return res.render("usuarios/form", {
    modo: "editar",
    usuario,
    roles: ROLES,
  });
}

function formCrear(req, res) {
  return res.render("usuarios/form", {
    modo: "crear",
    usuario: {},
    errores: [],
    roles: ROLES,
  });
}

async function crear(req, res) {
  try {
    const { nombre, apellido, password, telefono, direccion, correo, rol } = req.body;

    const passEncriptada = await hashPassword(password);

    const nuevoUsuario = await create({
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

    if (error.code == 11000) {
      const modo = "crear";
      return handleDuplicados({
        campos: error.campos,
        req, res, modo,
        vista: "usuarios/form",
        datos: {
          modo,
          usuario: req.body,
          roles: ROLES,
          errores: [],
        },
        campoFallback: "correo",
      });
    }

    return handleError(req, res, 500, "Error al crear el usuario");
  }
}

async function actualizar(req, res) {
  try {
    const id = req.params.id;
    const datosActualizados = { ...req.body };

    if (datosActualizados.password) {
      datosActualizados.password = await hashPassword(datosActualizados.password);
    }

    const usuarioActualizado = await update(id, datosActualizados);

    if (!usuarioActualizado) {
      return handleError(req, res, 404, "Usuario no encontrado");
    }

    if (returnJSON(req)) {
      return res.status(200).json(usuarioActualizado);
    }
    return renderListView(res, 201, req.query);

  } catch (error) {
    console.error(error);

    if (error.code == 11000) {
      const modo = "editar";
      const usuario = {
        ...req.body,
        _id: req.params.id,
      };

      return handleDuplicados({
        campos: error.campos,
        req, res, modo,
        vista: "usuarios/form",
        datos: {
          modo,
          usuario,
          roles: ROLES,
          errores: [],
        },
        campoFallback: "correo",
      });
    }

    return handleError(req, res, 500, "Error al actualizar el usuario");
  }
}

async function eliminar(req, res) {
  try {
    const id = req.params.id;

    const eliminado = await deleteUser(id);
    if (!eliminado) {
      return handleError(req, res, 404, "Usuario no encontrado");
    }

    if (returnJSON(req)) {
      return res.status(200).json({ message: "Usuario eliminado" });
    }
    return renderListView(res, 201, req.query);

  } catch (error) {
    console.error(error);
    return handleError(req, res, 500, "Error al eliminar el usuario");
  }
}

module.exports = {
  listar,
  detalle,
  formEditar,
  formCrear,
  crear,
  actualizar,
  eliminar,
};
