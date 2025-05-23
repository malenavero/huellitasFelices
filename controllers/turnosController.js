const Turno = require('../models/Turno');
const { returnJSON, handleError, urls} = require('./utils.js');

async function getListParams(query = {}) {
  const turnos = await Turno.findAll(query);
  return {
    turnos,
    ...urls
  }
}

async function renderListView(res, status = 200, query = {}) {
  const params = await getListParams(query)
  return res.status(status).render('turnos/index', params);
}

module.exports = {
   // GET
  async listar(req, res) {

    if (returnJSON(req)) {
      const turnos = await Turno.findAll(req.query);    
      return res.status(200).json(turnos);
    }
    return renderListView(res, 200, req.query);
  },

  async detalle(req, res) {
    const turno = await Turno.findById(req.params.id);
    if (!turno) {
      return handleError(req, res, 404, message = 'Turno no encontrado')
    }

    if (returnJSON(req)) {
      return res.status(200).json(turno);
    }

    return res.status(200).render('turnos/detalle', { turno });
  },

  async formEditar(req, res) {
    const turno = await Turno.findById(req.params.id);
    if (!turno) {
      return handleError(req, res, 404, message = 'Turno no encontrado')
    }
    res.render('turnos/form', {
      modo: 'editar',
      turno
    });
  },

  // POST
  async crear(req, res) {
    try {
      const { fecha, hora, pacienteId, servicio } = req.body;
      const nuevoTurno = await Turno.create({ fecha, hora, pacienteId, servicio });

      if (returnJSON(req)) {
        return res.status(201).json(nuevoTurno);
      }

      return renderListView(res, 201, req.query);
    } catch (error) {
      handleError(req, res, 500, message = 'Error al crear turno');
    }
  },

  // PUT
  async actualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const datosActualizados = req.body;

      const turnoActualizado = await Turno.update(id, datosActualizados);

      if (!turnoActualizado) {
        return handleError(req, res, 404, message = 'Turno no encontrado')
      }

      if (returnJSON(req)) {
        return res.status(200).json(turnoActualizado);
      }
      return renderListView(res, 201, req.query);
    } catch (error) {
      return handleError(req, res, 500, message = 'Error al actualizar turno')
    }
  },

  // DELETE
  async eliminar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const idEliminado = await Turno.delete(id);
      if (!idEliminado) {
        return handleError(req, res, 404, message = 'Turno no encontrado')
      }

      if (returnJSON(req)) {
        return res.status(200).json({ mensaje: `Turno ${idEliminado} eliminado` });
      }

      return renderListView(res, 200, req.query);

    } catch (error) {
      return handleError(req, res, 500, message = 'Error al eliminar turno')
    }
  }
};
