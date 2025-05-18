const Paciente = require('../models/Paciente');

module.exports = {
  async listar(req, res) {
    const pacientes = await Paciente.findAll();
    return res.json(pacientes);
  },

  async verPaciente(req, res) {
    const paciente = await Paciente.findById(req.params.id);
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
    res.json(paciente);
  },

  async crearPaciente(req, res) {
    try {
      const nuevoPaciente = await Paciente.create(req.body);
      res.status(201).json(nuevoPaciente);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear paciente' });
    }
  },

  async actualizarPaciente(req, res) {
    try {
      const actualizado = await Paciente.update(parseInt(req.params.id), req.body);
      if (!actualizado) return res.status(404).json({ error: 'Paciente no encontrado' });
      res.json(actualizado);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar paciente' });
    }
  },

  async eliminarPaciente(req, res) {
    try {
      const eliminado = await Paciente.delete(parseInt(req.params.id));
      if (!eliminado) return res.status(404).json({ error: 'Paciente no encontrado' });
      res.json({ mensaje: `Paciente ${req.params.id} eliminado` });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar paciente' });
    }
  }
};
