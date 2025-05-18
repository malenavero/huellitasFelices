const { body } = require('express-validator');
const {
  normalizarCamposTexto,
  asignarDefaults,
  manejoErrores,
  validarTexto,
  validarDuplicado
} = require('./utils');

const Paciente = require('../models/Paciente.js');

const validarResponsableTexto = [
  ...validarTexto('responsable.nombre', 100),
  ...validarTexto('responsable.telefono', 50),
  ...validarTexto('responsable.direccion', 255),
];

// === CREATE ===
const validarPacienteCreate = [
  normalizarCamposTexto(['nombre', 'especie', 'raza', 'responsable.nombre']),
  asignarDefaults({ 'raza': '' }),

  // obligatios
  body('nombre')
    .exists({ checkFalsy: true }).withMessage('Nombre obligatorio'),
  ...validarTexto('nombre', 100),

  body('especie')
    .exists({ checkFalsy: true }).withMessage('Especie obligatoria'),
  ...validarTexto('especie', 50),

  
  body('responsable.nombre')
  .exists({ checkFalsy: true }).withMessage('Nombre del responsable obligatorio'),
  
  body('responsable.telefono')
  .exists({ checkFalsy: true }).withMessage('Teléfono del responsable obligatorio'),
  
  body('responsable.email')
  .exists({ checkFalsy: true }).withMessage('Email del responsable obligatorio')
  .isEmail().withMessage('Email inválido'),
  
  ...validarResponsableTexto,
  
  // opcionales
  ...validarTexto('raza', 50),

  //duplicados
  validarDuplicado(Paciente, ['nombre', 'responsable.email']),

  manejoErrores
];

// === UPDATE ===
const validarPacienteUpdate = [
  normalizarCamposTexto(['nombre', 'especie', 'raza', 'responsable.nombre']),

  body('nombre').optional(),
  ...validarTexto('nombre', 100),

  body('especie').optional(),
  ...validarTexto('especie', 50),

  body('raza').optional(),
  ...validarTexto('raza', 50),

  body('responsable.nombre').optional(),
  body('responsable.telefono').optional(),
  body('responsable.direccion').optional(),

  body('responsable.email').optional()
    .isEmail().withMessage('Email inválido'),

  ...validarResponsableTexto,

  validarDuplicado(Paciente, ['nombre', 'responsable.email']),

  manejoErrores
];

module.exports = {
  validarPacienteCreate,
  validarPacienteUpdate
};
