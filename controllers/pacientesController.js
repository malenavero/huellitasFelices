const Paciente = require("../models/Paciente");
const { returnJSON, handleError, urls } = require("./utils.js");

async function getListParams(query = {}) {
  const pacientes = await Paciente.findAll(query);
  return {
    pacientes,
    ...urls
  }
}

async function renderListView(res, status = 200, query = {}) {
  const params = await getListParams(query)
  return res.status(status).render("pacientes/index", params);
}

module.exports = {
  // GET
  async listar(req, res) {
    if (returnJSON(req)) {
      const pacientes = await Paciente.findAll(req.query);
      return res.status(200).json(pacientes);
    }
    return renderListView(res, 200, req.query);
  },

  async detalle(req, res) {
    const paciente = await Paciente.findById(req.params.id);
    if (!paciente) {
      return handleError(req, res, 404, "Paciente no encontrado")
    }

    if (returnJSON(req)) {
      return res.status(200).json(paciente);
    }

    return res.status(200).render("pacientes/detalle", { 
      paciente,
      responsable: paciente.responsable || {}
    });
  },

  async formEditar(req, res) {
    const paciente = await Paciente.findById(req.params.id);
    if (!paciente) {
      return handleError(req, res, 404, "Paciente no encontrado")
    }
    res.render("pacientes/form", {
      modo: "editar",
      paciente,
      responsable: paciente.responsable || {}
    });
  },

  // POST 
  async crear(req, res) {
    try {
      const paciente = new Paciente(req.body);
      await paciente.save();

      if (returnJSON(req)) {
        return res.status(201).json(paciente);
      }

      return renderListView(res, 201, req.query);
    } catch (error) {
      console.log("Error: ", error);
      return handleError(req, res, 500, "Error al crear paciente");
    }
  },

  // PUT
  async actualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const paciente = await Paciente.findById(id);

      if (!paciente) {
        return handleError(req, res, 404, "Paciente no encontrado");
      }

      Object.assign(paciente, req.body);
      await paciente.save();

      if (returnJSON(req)) {
        return res.status(200).json(paciente);
      }

      return renderListView(res, 200, req.query);
    } catch (error) {
      console.log("Error: ", error);
      return handleError(req, res, 500, "Error al actualizar paciente");
    }
  },

  // DELETE
  async eliminar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const idEliminado = await Paciente.delete(id);
      if (!idEliminado) {
        return handleError(req, res, 404, "Paciente no encontrado")
      }

      if (returnJSON(req)) {
        return res.status(200).json({ mensaje: `Paciente ${idEliminado} eliminado` });
      }

      return renderListView(res, 200, req.query);

    } catch (error) {
      console.log("Error: ", error);
      return handleError(req, res, 500, "Error al eliminar paciente");
    }
  }
};
