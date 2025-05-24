const Turno = require("../models/Turno");
const Paciente = require("../models/Paciente");
const { returnJSON, handleError, urls } = require("./utils.js");
const { SERVICIOS } = require("../utils/constants.js");

async function getListParams(query = {}) {
  const turnos = await Turno.findAll(query);
  const pacientes = await Paciente.findAll();

  const hoy = new Date().toISOString().split('T')[0]; // formato YYYY-MM-DD

  // Mapa de ID → nombre de paciente
  const mapaPacientes = {};
  pacientes.forEach((p) => {
    const nombre = p.nombre;
    const nombreCapitalizado = nombre.charAt(0).toUpperCase() + nombre.slice(1);
    mapaPacientes[p.id] = nombreCapitalizado;
  });

  const turnosFiltradosYOrdenados = turnos
    .filter(t => t.fecha >= hoy)
    .sort((a, b) => {
      if (a.fecha === b.fecha) {
        return a.hora.localeCompare(b.hora);
      }
      return a.fecha.localeCompare(b.fecha);
    })
    .map((turno) => ({
      ...turno,
      nombrePaciente: mapaPacientes[turno.pacienteId] || "Paciente desconocido",
    }));

  return {
    turnos: turnosFiltradosYOrdenados,
    ...urls,
  };
}


async function renderListView(res, status = 200, query = {}) {
  const params = await getListParams(query);
  return res.status(status).render("turnos/index", params);
}

module.exports = {
  // GET
  async listar(req, res) {
    try {
      if (returnJSON(req)) {
        const turnos = await Turno.findAll(req.query);
        return res.status(200).json(turnos);
      }
      return renderListView(res, 200, req.query);
    } catch (error) {
      return handleError(req, res, 500, 'Error al listar turnos');
    }
  },

  async detalle(req, res) {
    const turno = await Turno.findById(req.params.id);
    if (!turno) {
      return handleError(req, res, 404, (message = "Turno no encontrado"));
    }

    // Buscamos el paciente asociado al turno y agregamos su nombre
    const paciente = await Paciente.findById(parseInt(turno.pacienteId));
    turno.nombrePaciente = paciente ? paciente.nombre : "Desconocido";

    if (returnJSON(req)) {
      return res.status(200).json(turno);
    }

    return res.status(200).render("turnos/detalle", { turno });
  },

  async formEditar(req, res) {
    const turno = await Turno.findById(req.params.id);
    if (!turno) {
      return handleError(req, res, 404, (message = "Turno no encontrado"));
    }
    const pacientes = await Paciente.findAll();
    res.render("turnos/form", {
      modo: "editar",
      turno,
      pacientes,
      servicios: SERVICIOS
    });
  },

  async formCrear(req, res) {
    const pacientes = await Paciente.findAll();

    res.render("turnos/form", {
      modo: 'crear',
      turno: {},
      errores: [],
      pacientes,
      servicios: SERVICIOS
    });
  },


  // POST (crear)
  async crear(req, res) {
    try {
      // El middleware ya validó req.body y pacienteId existe

      const { fecha, hora, pacienteId, motivo, precio, servicio } = req.body;
      const nuevoTurno = await Turno.create({
        fecha,
        hora,
        pacienteId,
        motivo,
        precio,
        servicio,
      });

      if (returnJSON(req)) {
        return res.status(201).json(nuevoTurno);
      }

      return renderListView(res, 201, req.query);
    } catch (error) {
      handleError(req, res, 500, (message = "Error al crear turno"));
    }
  },

  // PUT (actualizar)
  async actualizar(req, res) {
    try {
      const id = parseInt(req.params.id);

      const turnoActualizado = await Turno.update(id, req.body);

      if (!turnoActualizado) {
        return handleError(req, res, 404, (message = "Turno no encontrado"));
      }

      if (returnJSON(req)) {
        return res.status(200).json(turnoActualizado);
      }

      return renderListView(res, 200, req.query);
    } catch (error) {
      return handleError(
        req,
        res,
        500,
        (message = "Error al actualizar turno")
      );
    }
  },

  // DELETE
  async eliminar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const idEliminado = await Turno.delete(id);
      if (!idEliminado) {
        return handleError(req, res, 404, (message = "Turno no encontrado"));
      }

      if (returnJSON(req)) {
        return res
          .status(200)
          .json({ mensaje: `Turno ${idEliminado} eliminado` });
      }

      return renderListView(res, 200, req.query);
    } catch (error) {
      return handleError(req, res, 500, (message = "Error al eliminar turno"));
    }
  },
};
