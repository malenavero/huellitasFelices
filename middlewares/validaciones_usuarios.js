const { body } = require("express-validator");
const { ROLES } = require("../utils/constants.js");
const {
  normalizarCamposTexto,
  generarManejoErrores,
  validarTexto,
  asignarDefaults,
} = require("./utils");


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
    "email",
    "rol",
  ]),
  asignarDefaults({ direccion: "" }),

  // obligatorios
  body("nombre").exists({ checkFalsy: true }).withMessage("Nombre obligatorio"),
  ...validarTexto("nombre", 100),

  body("apellido").exists({ checkFalsy: true }).withMessage("Apellido obligatorio"),
  ...validarTexto("apellido", 100),

  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Contraseña obligatoria")
    .isLength({ min: 5 })
    .withMessage("La contraseña debe tener al menos 5 caracteres"),

  body("email")
    .exists({ checkFalsy: true })
    .withMessage("Correo obligatorio")
    .isEmail()
    .withMessage("Correo inválido"),

  body("telefono").exists({ checkFalsy: true }).withMessage("Teléfono obligatorio"),
  ...validarTexto("telefono", 50),

  body("rol").exists({ checkFalsy: true }).withMessage("Rol obligatorio"),
  ...validarUsuarioRol,

  body("direccion").optional(),
  ...validarTexto("direccion", 255),

  generarManejoErrores({
    vista: "usuarios/form",
    obtenerDatos: req => ({
      usuario: {...req.body, _id: req.params.id},
      roles: ROLES
    })
  })
];

const validarUsuarioUpdate = [
  normalizarCamposTexto([
    "nombre",
    "apellido",
    "password",
    "telefono",
    "direccion",
    "email",
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

  body("email").optional().isEmail().withMessage("Correo inválido"),

  body("telefono").optional(),
  ...validarTexto("telefono", 50),

  body("rol").optional(),
  ...validarUsuarioRol,

  body("direccion").optional(),
  ...validarTexto("direccion", 255),

  generarManejoErrores({
    vista: "usuarios/form",
    obtenerDatos: req => ({
      usuario: {...req.body, _id: req.params.id},
      roles: ROLES
    })
  })
];

const validarLogin = [
  normalizarCamposTexto(["email", "password"]),

  body("email")
    .exists({ checkFalsy: true })
    .withMessage("Correo obligatorio")
    .isEmail()
    .withMessage("Correo inválido"),

  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Contraseña obligatoria"),

  generarManejoErrores({
    vista: "login",
    obtenerDatos: req => ({
      email: req.body.email
    })
  })
];

module.exports = {
  validarUsuarioCreate,
  validarUsuarioUpdate,
  validarLogin,
};
