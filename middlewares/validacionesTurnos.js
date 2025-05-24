const { body } = require("express-validator");
const Turno = require("../models/Turno");
const Paciente = require("../models/Paciente");
const { SERVICIOS } = require("../utils/constants.js");
const {
  validarFecha,
  normalizarCamposTexto,
  manejoErrores,
  validarDuplicado,
  validarDecimal
} = require("./utils.js");

const validarServicio = [
  body("servicio")
    .if(body("servicio").exists({ checkFalsy: true }))
    .custom(value => {
      if (!SERVICIOS.includes(value)) {
        throw new Error(`Servicio inválido. Los válidos son: ${SERVICIOS.join(", ")}`);
      }
      return true;
    }),
];

const validarHora = [
  body("hora")
    .if(body("hora").exists({ checkFalsy: true }))
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage("Hora inválida. Use el formato HH:mm"),
];

const validarPacienteId = [
  body("pacienteId")
    .exists({ checkFalsy: true }).withMessage("El paciente es obligatorio")
    .isInt({ min: 1 }).withMessage("ID de paciente inválido")
    .bail()
    .custom(async (id) => {
      const pacientes = await Paciente.findAll();
      const existe = pacientes.some(p => p.id === parseInt(id));
      if (!existe) {
        throw new Error("El paciente indicado no existe");
      }
      return true;
    }),
];

// Validación CREATE
const validarTurnoCreate = [
  normalizarCamposTexto(["servicio"]),

  body("fecha")
    .exists({ checkFalsy: true })
    .withMessage("La fecha es obligatoria")
    .bail()
    .custom(validarFecha),

  body("hora")
    .exists({ checkFalsy: true })
    .withMessage("La hora es obligatoria"),
  ...validarHora,

  ...validarPacienteId,

  body("servicio").optional(),
  ...validarServicio,

  body("precio")
    .exists({ checkFalsy: true })
    .withMessage("El precio es obligatorio"),
  ...validarDecimal("precio"),

  validarDuplicado(Turno, ["fecha", "hora", "servicio"]),
  manejoErrores,
];

// Validación UPDATE: todos opcionales, validar solo si están presentes
const validarTurnoUpdate = [
  normalizarCamposTexto(["servicio"]),

  body("fecha")
    .optional()
    .custom(validarFecha),

  ...validarHora.map(val => val.optional()),

  body("pacienteId")
    .optional()
    .isInt({ min: 1 }).withMessage("ID de paciente inválido")
    .bail()
    .custom(async (id) => {
      const pacientes = await Paciente.findAll();
      const existe = pacientes.some(p => p.id === parseInt(id));
      if (!existe) {
        throw new Error(`El paciente ${id} no existe`);
      }
      return true;
    }),

  body("servicio").optional(),
  ...validarServicio,

  ...validarDecimal("precio").map(val => val.optional()),

  validarDuplicado(Turno, ["fecha", "hora", "servicio"]),
  manejoErrores,
];

module.exports = {
  validarTurnoCreate,
  validarTurnoUpdate,
};
