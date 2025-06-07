const PacienteService = require("../services/pacientes_service.js");
const { ANIMALES_VALIDOS } = require("../utils/constants.js");
const { returnJSON, handleError, urls } = require("./utils.js");

async function getListParams(query = {}) {
  const pacientes = await PacienteService.findAll(query);
  return {
    pacientes,
    ...urls
  };
}

async function renderListView(res, status = 200, query = {}) {
  const params = await getListParams(query);
  return res.status(status).render("pacientes/index", params);
}

async function getFormParams(data = {}, errores = [], modo = "crear") {
  return {
    modo,
    paciente: data,
    errores,
    animales_validos: ANIMALES_VALIDOS,
    ...urls
  };
}

module.exports = {
  // GET /pacientes
  async listar(req, res) {
    try {
      const pacientes = await PacienteService.findAll(req.query);
      if (returnJSON(req)) {
        return res.status(200).json(pacientes);
      }
      return renderListView(res, 200, req.query);
    } catch (error) {
      console.error("Error listando pacientes:", error);
      return handleError(req, res, 500, "Error al listar pacientes");
    }
  },

  // GET /pacientes/:id
  async detalle(req, res) {
    try {
      const paciente = await PacienteService.findById(req.params.id);
      if (!paciente) {
        return handleError(req, res, 404, "Paciente no encontrado");
      }
      if (returnJSON(req)) {
        return res.status(200).json(paciente);
      }
      return res.status(200).render("pacientes/detalle", {
        paciente,
        responsable: paciente.responsable || {}
      });
    } catch (error) {
      console.error("Error obteniendo paciente:", error);
      return handleError(req, res, 500, "Error al obtener paciente");
    }
  },

  // GET /pacientes/:id/editar
  async formEditar(req, res) {
    try {
      const paciente = await PacienteService.findById(req.params.id);
      if (!paciente) {
        return handleError(req, res, 404, "Paciente no encontrado");
      }
      const params = await getFormParams(paciente, [], "editar");
      return res.render("pacientes/form", params);
    } catch (error) {
      console.error("Error en formEditar:", error);
      return handleError(req, res, 500, "Error al cargar formulario de edición");
    }
  },

  // GET /pacientes/crear
  formCrear(req, res) {
    return res.render("pacientes/form", {
      modo: "crear",
      paciente: { fichaMedica: {}, responsable: {} },
      errores: [],
      animales_validos: ANIMALES_VALIDOS,
      ...urls
    });
  },

  // POST /pacientes
  async crear(req, res) {
    try {
      const nuevo = await PacienteService.create(req.body);

      if (returnJSON(req)) {
        return res.status(201).json(nuevo);
      }
      return renderListView(res, 201, req.query);
    } catch (error) {
      console.error("Error creando paciente:", error);

      if (error.message.includes("nombre") && error.message.includes("responsable.email")) {
        const errores = [{
          campo: "nombre",
          mensaje: "Ya existe un paciente con ese nombre y ese email de responsable"
        }];

        if (returnJSON(req)) {
          return res.status(400).json({ errores });
        }

        const params = await getFormParams(req.body, errores, "crear");
        return res.status(400).render("pacientes/form", params);
      }

      return handleError(req, res, 500, "Error al crear paciente");
    }
  },

  // PUT /pacientes/:id
  async actualizar(req, res) {
    try {
      const actualizado = await PacienteService.update(req.params.id, req.body);

      if (!actualizado) {
        return handleError(req, res, 404, "Paciente no encontrado");
      }

      if (returnJSON(req)) {
        return res.status(200).json(actualizado);
      }

      return renderListView(res, 200, req.query);
    } catch (error) {
      console.error("Error actualizando paciente:", error);

      if (error.message.includes("nombre") && error.message.includes("responsable.email")) {
        const errores = [{
          campo: "nombre",
          mensaje: "Ya existe un paciente con ese nombre y ese email de responsable"
        }];

        if (returnJSON(req)) {
          return res.status(400).json({ errores });
        }

        const params = await getFormParams(req.body, errores, "editar");
        return res.status(400).render("pacientes/form", params);
      }

      return handleError(req, res, 500, "Error al actualizar paciente");
    }
  },

  // DELETE /pacientes/:id
  async eliminar(req, res) {
    try {
      const eliminadoId = await PacienteService.delete(req.params.id);
      if (!eliminadoId) {
        return handleError(req, res, 404, "Paciente no encontrado");
      }
      if (returnJSON(req)) {
        return res.status(200).json({ mensaje: `Paciente ${eliminadoId} eliminado` });
      }
      return renderListView(res, 200, req.query);
    } catch (error) {
      console.error("Error eliminando paciente:", error);
      return handleError(req, res, 500, "Error al eliminar paciente");
    }
  },

  // POST /pacientes/:id/consultas
  async addConsulta(req, res) {
    try {
      const consulta = await PacienteService.addConsulta(req.params.id, req.body);
      if (returnJSON(req)) {
        return res.status(201).json(consulta);
      }
      return renderListView(res, 200, req.query);
    } catch (error) {
      console.error("Error agregando consulta:", error);
      return handleError(req, res, 500, "Error al agregar consulta");
    }
  }
};
