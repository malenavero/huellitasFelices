const { body } = require("express-validator");
const { ROLES } = require("../utils/constants.js");
const {
  normalizarCamposTexto,
  manejoErrores,
  validarTexto,
  validarDuplicado,
  asignarDefaults,
} = require("./utils");

const Usuario = require("../models/Usuario.js");

const validarUsuarioRol = [
  body("rol")
    .if(body("rol").exists({ checkFalsy: true }))
    .custom((value) => {
      if (!ROLES.includes(value)) {
        throw new Error(`Rol inválido. Los válidos son: ${ROLES.join(", ")}`);
      }
      return true;
    }),
];

const validarUsuarioCreate = [
  normalizarCamposTexto([
    "nombre",
    "apellido",
    "password",
    "telefono",
    "direccion",
    "correo",
    "rol",
  ]),
  asignarDefaults({ direccion: "" }),

  // obligatorios
  body("nombre").exists({ checkFalsy: true }).withMessage("Nombre obligatorio"),
  ...validarTexto("nombre", 100),

  body("apellido")
    .exists({ checkFalsy: true })
    .withMessage("Apellido obligatorio"),
  ...validarTexto("apellido", 100),

  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Contraseña obligatoria")
    .isLength({ min: 5 })
    .withMessage("La contraseña debe tener al menos 5 caracteres"),

  body("correo")
    .exists({ checkFalsy: true })
    .withMessage("Correo obligatorio")
    .isEmail()
    .withMessage("Correo inválido"),

  body("telefono")
    .exists({ checkFalsy: true })
    .withMessage("Teléfono obligatorio"),
  ...validarTexto("telefono", 50),

  body("rol").exists({ checkFalsy: true }).withMessage("Rol obligatorio"),
  ...validarUsuarioRol,

  // opcionales
  body("direccion").optional(),
  ...validarTexto("direccion", 255),

  //duplicados
  validarDuplicado(Usuario, ["correo"]),

  manejoErrores,
];

const validarUsuarioUpdate = [
  normalizarCamposTexto([
    "nombre",
    "apellido",
    "password",
    "telefono",
    "direccion",
    "correo",
    "rol",
  ]),

  body("nombre").optional(),
  ...validarTexto("nombre", 100),

  body("apellido").optional(),
  ...validarTexto("apellido", 100),

  body("password")
    .optional()
    .isLength({ min: 5 })
    .withMessage("La contraseña debe tener al menos 5 caracteres"),

  body("correo").optional().isEmail().withMessage("Correo inválido"),

  body("telefono").optional(),
  ...validarTexto("telefono", 50),

  body("rol").optional(),
  ...validarUsuarioRol,

  body("direccion").optional(),
  ...validarTexto("direccion", 255),

  validarDuplicado(Usuario, ["correo"]),

  manejoErrores,
];

const validarLogin = [
  normalizarCamposTexto(["correo", "password"]),

  body("correo")
    .exists({ checkFalsy: true })
    .withMessage("Correo obligatorio")
    .isEmail()
    .withMessage("Correo inválido"),

  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Contraseña obligatoria"),

  manejoErrores,
];

module.exports = {
  validarUsuarioCreate,
  validarUsuarioUpdate,
  validarLogin,
};
