// middlewares/validaciones_pacientes.js

const { body } = require("express-validator");
const {
  normalizarCamposTexto,
  asignarDefaults,
  generarManejoErrores,
  validarTexto,
  validarFecha
} = require("./utils");

const { ANIMALES_VALIDOS } = require("../utils/constants.js");

function parsearAlergiasComoArray(req, res, next) {
  const valor = req.body?.fichaMedica?.alergias;
  if (typeof valor === "string") {
    req.body.fichaMedica.alergias = valor
      .split(",")
      .map(a => a.trim())
      .filter(a => a.length > 0);
  }
  next();
}


// === Validadores comunes ===
const validarNombre = validarTexto("nombre", 100);

const validarEspecie = [
  body("especie")
    .if(body("especie").exists({ checkFalsy: true }))
    .custom(value => {
      if (!ANIMALES_VALIDOS.includes(value)) {
        throw new Error(`Especie inválida. Las válidas son: ${ANIMALES_VALIDOS.join(", ")}`);
      }
      return true;
    }),
];

const validarRaza = validarTexto("fichaMedica.raza", 50);

const validarFechaNacimiento = [
  body("fichaMedica.fechaNacimiento")
    .optional({ checkFalsy: true })
    .custom(validarFecha)
];

const validarNotas = validarTexto("fichaMedica.notas", 255);

const validarAlergias = [
  body("fichaMedica.alergias")
    .optional({ checkFalsy: true })
    .isArray()
    .withMessage("Alergias debe ser un array de strings")
];

const validarPeso = [
  body("fichaMedica.peso")
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("El peso debe ser un número positivo")
];

const validarEmail = [
  body("responsable.email")
    .isEmail()
    .withMessage("Email inválido")
];

const validarResponsableTexto = [
  ...validarTexto("responsable.nombre", 100),
  ...validarTexto("responsable.telefono", 50),
];

// === CREATE ===
const validarPacienteCreate = [
  parsearAlergiasComoArray,
  normalizarCamposTexto([
    "nombre", "especie",
    "responsable.nombre", "responsable.email", "responsable.telefono",
    "fichaMedica.raza", "fichaMedica.notas"
  ]),
  asignarDefaults({ "fichaMedica.raza": "" }),

  body("nombre").exists({ checkFalsy: true }).withMessage("Nombre obligatorio"),
  ...validarNombre,

  body("especie").exists({ checkFalsy: true }).withMessage("Especie obligatoria"),
  ...validarEspecie,

  body("responsable.nombre").exists({ checkFalsy: true }).withMessage("Nombre del responsable obligatorio"),
  body("responsable.email").exists({ checkFalsy: true }).withMessage("Email del responsable obligatorio"),
  ...validarEmail,
  ...validarResponsableTexto,

  // Validaciones ficha médica
  ...validarRaza,
  ...validarFechaNacimiento,
  ...validarPeso,
  ...validarAlergias,
  ...validarNotas,

  generarManejoErrores({
    vista: "pacientes/form",
    obtenerDatos: req => ({
      paciente: req.body,
      animales_validos: ANIMALES_VALIDOS
    })
  })
];

// === UPDATE ===
const validarPacienteUpdate = [
  parsearAlergiasComoArray,
  normalizarCamposTexto([
    "nombre", "especie",
    "responsable.nombre", "responsable.email", "responsable.telefono",
    "fichaMedica.raza", "fichaMedica.notas"
  ]),

  body("nombre").optional(),
  ...validarNombre,

  body("especie").optional(),
  ...validarEspecie,

  body("responsable.nombre").optional(),
  body("responsable.email").optional(),
  ...validarEmail,
  ...validarResponsableTexto,

  // Validaciones ficha médica
  ...validarRaza,
  ...validarFechaNacimiento,
  ...validarPeso,
  ...validarAlergias,
  ...validarNotas,

  generarManejoErrores({
    vista: "pacientes/form",
    obtenerDatos: req => ({
      paciente: req.body,
      animales_validos: ANIMALES_VALIDOS
    })
  })
];

module.exports = {
  validarPacienteCreate,
  validarPacienteUpdate
};
