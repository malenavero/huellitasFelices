const Paciente = require('../models/Paciente');
const { returnJSON } = require('./utils.js');

module.exports = {
  async listar(req, res) {
    try {
      const pacientes = await Paciente.findAll();

      if (returnJSON(req)) {
        return res.status(200).json(pacientes);
      }

      return res.status(200).render('pacientes/index', { pacientes });
    } catch (error) {
      console.error('Error al listar pacientes:', error);
      return res.status(500).json({ error: 'Error al listar pacientes' });
    }
  },

  async detalle(req, res) {
    try {
      const paciente = await Paciente.findById(req.params.id);

      if (!paciente) {
        if (returnJSON(req)) {
          return res.status(404).json({ error: 'Paciente no encontrado' });
        } else {
          return res.status(404).render('errors/404', { mensaje: 'Paciente no encontrado' });
        }
      }

      if (returnJSON(req)) {
        return res.status(200).json(paciente);
      }

      return res.status(200).render('pacientes/detalle', { paciente });
    } catch (error) {
      console.error('Error al obtener detalle de paciente:', error);
      return res.status(500).json({ error: 'Error al obtener paciente' });
    }
  },

  async crear(req, res) {
    try {
      const nuevoPaciente = await Paciente.create(req.body);

      if (returnJSON(req)) {
        return res.status(201).json(nuevoPaciente);
      }

      const pacientes = await Paciente.findAll();
      return res.status(201).render('pacientes/index', { pacientes });
    } catch (error) {
      console.error('Error al crear paciente:', error);
      return res.status(500).json({ error: 'Error al crear paciente' });
    }
  },

  async actualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const actualizado = await Paciente.update(id, req.body);

      if (!actualizado) {
        if (returnJSON(req)) {
          return res.status(404).json({ error: 'Paciente no encontrado' });
        } else {
          return res.status(404).render('errors/404', { mensaje: 'Paciente no encontrado' });
        }
      }

      if (returnJSON(req)) {
        return res.status(200).json(actualizado);
      }

      return res.status(200).render('pacientes/detalle', { paciente: actualizado });
    } catch (error) {
      console.error('Error al actualizar paciente:', error);
      return res.status(500).json({ error: 'Error al actualizar paciente' });
    }
  },

  async eliminar(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const eliminado = await Paciente.delete(id);

      if (!eliminado) {
        if (returnJSON(req)) {
          return res.status(404).json({ error: 'Paciente no encontrado' });
        } else {
          return res.status(404).render('errors/404', { mensaje: 'Paciente no encontrado' });
        }
      }

      if (returnJSON(req)) {
        return res.status(200).json({ mensaje: `Paciente ${id} eliminado` });
      }

      const pacientes = await Paciente.findAll();
      return res.status(200).render('pacientes/index', { pacientes });
    } catch (error) {
      console.error('Error al eliminar paciente:', error);
      return res.status(500).json({ error: 'Error al eliminar paciente' });
    }
  }
};
