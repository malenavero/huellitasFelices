const { body } = require("express-validator");
const { normalizarCamposTexto, manejoErrores, validarTexto, validarFecha } = require("./utils.js");
const { TIPOS_BUSQUEDA, ANIMALES_VALIDOS } = require("../utils/constants.js");

const validarNombre = validarTexto("nombre", 100);
const validarZona = validarTexto("zona", 100);
const validarDescripcion = validarTexto("descripcion", 255);
const validarContacto = validarTexto("contacto", 100);
const validarColor = validarTexto("color", 50);

const validarBusquedaCreate = [
  normalizarCamposTexto(["nombre", "zona", "descripcion", "contacto", "color"]),

  body("tipo")
    .exists({ checkFalsy: true }).withMessage("Tipo es obligatorio")
    .isIn(TIPOS_BUSQUEDA).withMessage(`Tipo inválido, debe ser uno de: ${TIPOS_BUSQUEDA.join(", ")}`),

  body("nombre").optional({ nullable: true }),
  ...validarNombre,

  body("zona")
    .exists({ checkFalsy: true }).withMessage("Zona es obligatoria"),
  ...validarZona,

  body("fecha").optional()
    .custom(validarFecha).withMessage("Fecha inválida"),

  body("descripcion").optional(),
  ...validarDescripcion,

  body("contacto")
    .exists({ checkFalsy: true }).withMessage("Contacto es obligatorio"),
  ...validarContacto,

  body("animal")
    .exists({ checkFalsy: true }).withMessage("Animal es obligatorio")
    .isIn(ANIMALES_VALIDOS).withMessage(`Animal inválido, debe ser uno de: ${ANIMALES_VALIDOS.join(", ")}`),

  body("color").optional(),
  ...validarColor,

  manejoErrores,
];

const validarBusquedaUpdate = [
  normalizarCamposTexto(["nombre", "zona", "descripcion", "contacto", "color"]),

  body("tipo").optional()
    .isIn(TIPOS_BUSQUEDA).withMessage(`Tipo inválido, debe ser uno de: ${TIPOS_BUSQUEDA.join(", ")}`),

  body("nombre").optional({ nullable: true }),
  ...validarNombre,

  body("zona").optional(),
  ...validarZona,

  body("fecha").optional()
    .custom(validarFecha).withMessage("Fecha inválida"),

  body("descripcion").optional(),
  ...validarDescripcion,

  body("contacto").optional(),
  ...validarContacto,

  body("animal").optional()
    .isIn(ANIMALES_VALIDOS).withMessage(`Animal inválido, debe ser uno de: ${ANIMALES_VALIDOS.join(", ")}`),

  body("color").optional(),
  ...validarColor,

  body("activa").optional()
    .isBoolean().withMessage("Activa debe ser un valor booleano"),

  manejoErrores,
];

module.exports = {
  validarBusquedaCreate,
  validarBusquedaUpdate,
};
