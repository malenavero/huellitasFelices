const Turno = require('../models/Turno');
const { returnJSON } = require('./utils.js');

module.exports = {
  async listar(req, res) {
    try {
      const turnos = await Turno.findAll();

      if (returnJSON(req)) {
        return res.status(200).json(turnos);
      }

      return res.status(200).render('turnos/index', { turnos });
    } catch (error) {
      console.error('Error al obtener los turnos:', error);
      return res.status(500).render('errors/500', { mensaje: 'Error al obtener los turnos' });
    }
  },

  async detalle(req, res) {
    try {
      const id = req.params.id;
      const turno = await Turno.findById(id);

      if (!turno) {
        if (returnJSON(req)) {
          return res.status(404).json({ error: 'Turno no encontrado' });
        } else {
          return res.status(404).render('errors/404', { mensaje: 'Turno no encontrado' });
        }
      }

      if (returnJSON(req)) {
        return res.status(200).json(turno);
      }

      return res.status(200).render('turnos/detalle', { turno });
    } catch (error) {
      console.error('Error al obtener el turno:', error);
      return res.status(500).render('errors/500', { mensaje: 'Error al obtener el turno' });
    }
  },

  async crear(req, res) {
    try {
      const { fecha, hora, pacienteId, servicio } = req.body;
      const nuevoTurno = await Turno.create({ fecha, hora, pacienteId, servicio });

      if (returnJSON(req)) {
        return res.status(201).json(nuevoTurno);
      }

      const turnos = await Turno.findAll();
      return res.status(201).render('turnos/index', { turnos });
    } catch (error) {
      console.error('Error al crear turno:', error);
      return res.status(500).json({ error: 'Error al crear turno' });
    }
  },

  async actualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const datosActualizados = req.body;

      const turnoActualizado = await Turno.update(id, datosActualizados);

      if (!turnoActualizado) {
        if (returnJSON(req)) {
          return res.status(404).json({ error: 'Turno no encontrado' });
        } else {
          return res.status(404).render('errors/404', { mensaje: 'Turno no encontrado' });
        }
      }

      if (returnJSON(req)) {
        return res.status(200).json(turnoActualizado);
      }

      return res.status(200).render('turnos/detalle', { turno: turnoActualizado });
    } catch (error) {
      console.error('Error al actualizar turno:', error);
      return res.status(500).json({ error: 'Error al actualizar turno' });
    }
  },

  async eliminar(req, res) {
    try {
      const id = req.params.id;
      const turnoExistente = await Turno.findById(id);

      if (!turnoExistente) {
        if (returnJSON(req)) {
          return res.status(404).json({ error: 'Turno no encontrado' });
        } else {
          return res.status(404).render('errors/404', { mensaje: 'Turno no encontrado' });
        }
      }

      await Turno.delete(id);

      if (returnJSON(req)) {
        return res.status(200).json({ mensaje: 'Turno eliminado correctamente' });
      }

      const turnos = await Turno.findAll();
      return res.status(200).render('turnos/index', { turnos });
    } catch (error) {
      console.error('Error al eliminar turno:', error);
      return res.status(500).json({ error: 'Error al eliminar turno' });
    }
  }
};
