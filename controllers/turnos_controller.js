const TurnoService = require("../services/turnos_service");
const PacienteService = require("../services/pacientes_service");

const { returnJSON, handleError, urls, handleDuplicados } = require("./utils.js");
const { SERVICIOS } = require("../utils/constants.js");

async function getListParams(query = {}, errors = []) {
  const turnos = await TurnoService.findAll(query);
  const pacientes = await PacienteService.findAll();
  const servicios = SERVICIOS;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const mañana = new Date(hoy);
  mañana.setDate(hoy.getDate() + 1);

  const ocultarPasados = !!query.ocultarPasados;
  const soloHoy = !!query.soloHoy;

  const turnosFiltrados = turnos.filter(t => {
    const fechaTurno = new Date(
      t.fecha.getFullYear(),
      t.fecha.getMonth(),
      t.fecha.getDate()
    );

    if (soloHoy) {
      return fechaTurno >= hoy && fechaTurno < mañana;
    }
    if (ocultarPasados) {
      return fechaTurno >= hoy;
    }
    return true;
  });

  const turnosOrdenados = turnosFiltrados.sort((a, b) => {
    const fechaA = new Date(`${a.fecha}T${a.hora}`);
    const fechaB = new Date(`${b.fecha}T${b.hora}`);
    return fechaA - fechaB;
  });

  return {
    turnos: turnosOrdenados,
    servicios,
    pacientes,
    query,
    ocultarPasados,
    ...urls,
    errors
  };
}



async function renderListView(res, status = 200, query = {}, errors = []) {
  const params = await getListParams(query, errors);
  return res.status(status).render("turnos/index", params);
}

async function cargarFormParams({ modo, turno, errores = [] }) {
  const pacientes = await PacienteService.findAll() || [];
  const servicios = SERVICIOS;


  turno = turno || {};
  turno.paciente = turno.paciente || {};

  const horasDisponibles = [];
  for (let h = 8; h <= 20; h++) {
    ["00", "30"].forEach(min => {
      const hora = `${h.toString().padStart(2, "0")}:${min}`;
      horasDisponibles.push(hora);
    });
  }

  const pacienteId = (turno.pacienteId || "").toString();
  
  return {
    modo,
    turno,
    pacienteId,
    errores,
    pacientes,
    servicios,
    horasDisponibles
  };

}


module.exports = {
  async listar(req, res) {
    try {
      if (returnJSON(req)) {
        const turnos = await TurnoService.findAll(req.query);
        return res.status(200).json(turnos);
      }
      return renderListView(res, 200, req.query);
    } catch (error) {
      console.log("Error: ", error);
      return handleError(req, res, 500, "Error al listar turnos");
    }
  },

  async detalle(req, res) {
    const turno = await TurnoService.findById(req.params.id);
    if (!turno) return handleError(req, res, 404, "Turno no encontrado");

    turno.paciente = turno.paciente || {};
    turno.nombrePaciente = turno.paciente.nombre || "Desconocido";

    if (returnJSON(req)) return res.status(200).json(turno);

    return res.status(200).render("turnos/detalle", { turno });
  },

  async formEditar(req, res) {
    const turno = await TurnoService.findById(req.params.id);
    if (!turno) return handleError(req, res, 404, "Turno no encontrado");

    turno.paciente = turno.paciente || {};

    const params = await cargarFormParams({ modo: "editar", turno });
    return res.render("turnos/form", params);
  },

  async formCrear(req, res) {
    const params = await cargarFormParams({ modo: "crear", turno: {} });
    return res.render("turnos/form", params);
  },

  async crear(req, res) {
    try {
      const nuevoTurno = await TurnoService.create(req.body);

      if (returnJSON(req)) return res.status(201).json(nuevoTurno);

      return renderListView(res, 201, req.query);
    } catch (error) {
      console.log("Error:", error);
      if (error.code == 11000) {
        const modo = "crear";
        const turno = {
          ...req.body,
          _id: req.params.id
        }
        return handleDuplicados({
          campos: error.campos,
          req, res, modo,
          vista: "turnos/form",
          datos: await cargarFormParams({ modo, turno }),
          campoFallback: "fecha"
        });       
      };

      return handleError(req, res, 500, "Error al crear turno");
    }
  },

  async actualizar(req, res) {
    try {
      const id = req.params.id;
      const turnoActualizado = await TurnoService.update(id, req.body);

      if (!turnoActualizado) return handleError(req, res, 404, "Turno no encontrado");

      if (returnJSON(req)) return res.status(200).json(turnoActualizado);

      return renderListView(res, 200, req.query);
    } catch (error) {
      console.log("Error:", error);

      if (error.code === 11000) {
        const modo = "editar";
        const turno = {
          ...req.body,
          _id: req.params.id
        }

        const campos = Object.keys(error.keyPattern || {});
        return handleDuplicados({
          campos,
          req,
          res,
          modo,
          vista: "turnos/form",
          datos: await cargarFormParams({ modo, turno }),
          campoFallback: "fecha"
        });       
      }

      return handleError(req, res, 500, "Error al actualizar turno");
    }
  },

  async eliminar(req, res) {
    try {
      const id = req.params.id;
      const idEliminado = await TurnoService.delete(id);

      if (!idEliminado) return handleError(req, res, 404, "Turno no encontrado");

      if (returnJSON(req)) {
        return res.status(200).json({ mensaje: `Turno ${idEliminado} eliminado` });
      }

      return renderListView(res, 200, req.query);
    } catch (error) {
      console.log("Error:", error);
      return handleError(req, res, 500, "Error al eliminar turno");
    }
  },
};
