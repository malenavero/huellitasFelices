const { body } = require("express-validator");
const Paciente = require("../models/paciente_model");
const { SERVICIOS } = require("../utils/constants.js");

const {
  validarFecha,
  normalizarCamposTexto,
  campoObligatorio,
  generarManejoErrores,
} = require("./utils.js");

const validarHora = [
  body("hora")
    .if(body("hora").exists({ checkFalsy: true }))
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage("Hora inválida. Use el formato HH:mm"),
];

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

const validarPrecio = [
  body("precio")
    .if(body("precio").exists({ checkFalsy: true }))
    .isFloat({ min: 0.01 })
    .withMessage("Precio debe ser un número positivo"),
];

const validarPacienteId = [
  body("pacienteId")
    .if(body("pacienteId").exists({ checkFalsy: true }))
    .custom(async id => {
      const existe = await Paciente.exists({ _id: id });
      if (!existe) {
        throw new Error("El paciente indicado no existe");
      }
      return true;
    }),
];

// CREATE
const validarTurnoCreate = [
  normalizarCamposTexto(["servicio"]),

  campoObligatorio("fecha", "La fecha es obligatoria"),
  body("fecha").custom(validarFecha),

  campoObligatorio("hora", "La hora es obligatoria"),
  ...validarHora,

  campoObligatorio("pacienteId", "El paciente es obligatorio"),
  ...validarPacienteId,

  campoObligatorio("servicio", "El servicio es obligatorio"),
  ...validarServicio,

  campoObligatorio("precio", "El precio es obligatorio"),
  ...validarPrecio,

  generarManejoErrores({
    vista: "turnos/form",
    obtenerDatos: async req => {
    const pacientes = await Paciente.find().lean();
      return {
        turno: req.body,
        servicios: SERVICIOS,
        pacientes
      };
    }
  })
];

// UPDATE
const validarTurnoUpdate = [
  normalizarCamposTexto(["servicio"]),

  body("fecha").optional().custom(validarFecha),
  ...validarHora.map(val => val.optional()),
  ...validarPacienteId.map(val => val.optional()),
  ...validarServicio.map(val => val.optional()),
  ...validarPrecio.map(val => val.optional()),

  generarManejoErrores({
    vista: "turnos/form",
    obtenerDatos: async req => {
      const pacientes = await Paciente.find().lean();
        return {
          turno: req.body,
          servicios: SERVICIOS,
          pacientes
        };
      }
    })
];

module.exports = {
  validarTurnoCreate,
  validarTurnoUpdate
};
