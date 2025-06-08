const { body } = require("express-validator");
const { normalizarCamposTexto, generarManejoErrores, validarTexto, validarFecha } = require("./utils.js");
const { TIPOS_BUSQUEDA, ANIMALES_VALIDOS } = require("../utils/constants.js");

const validarNombre = validarTexto("nombre", 100);
const validarZona = validarTexto("zona", 100);
const validarDescripcion = validarTexto("descripcion", 255);
const validarContacto = validarTexto("contacto", 100);
const validarColor = validarTexto("color", 50);

const camposTexto = ["nombre", "zona", "descripcion", "contacto", "color"];

const validarBusquedaCreate = [
  normalizarCamposTexto(camposTexto),

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

  generarManejoErrores({
    vista: "busquedas/form",
    obtenerDatos: req => ({
      modo: "crear",
      busqueda: req.body,
      TIPOS_BUSQUEDA,
      ANIMALES_VALIDOS
    })
  })
];

const validarBusquedaUpdate = [
  normalizarCamposTexto(camposTexto),

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

  generarManejoErrores({
    vista: "busquedas/form",
    obtenerDatos: req => ({
      modo: "editar",
      busqueda: { ...req.body, _id: req.params.id },
      TIPOS_BUSQUEDA,
      ANIMALES_VALIDOS
    })
  })
];

module.exports = {
  validarBusquedaCreate,
  validarBusquedaUpdate
};
