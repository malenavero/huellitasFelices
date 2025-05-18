const express = require('express');
const router = express.Router();
const controller = require('../controllers/pacientesController');
const {
  validarPacienteCreate,
  validarPacienteUpdate
} = require('../middlewares/validacionesPacientes');

router.get('/', controller.listar);
router.get('/:id', controller.verPaciente);
router.post('/', validarPacienteCreate, controller.crearPaciente);
router.put('/:id', validarPacienteUpdate, controller.actualizarPaciente);
router.delete('/:id', controller.eliminarPaciente);

module.exports = router;
