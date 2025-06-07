const { body } = require("express-validator");
const { CATEGORIAS_PRODUCTO } = require("../utils/constants.js");

const {
  validarFecha,
  normalizarCamposTexto,
  manejoErrores,
  validarTexto,
  campoObligatorio
} = require("./utils.js");

const validarNombre = validarTexto("nombre", 100);

const validarCategoria = [
  body("categoria")
    .if(body("categoria").exists({ checkFalsy: true }))
    .custom(value => {
      if (!CATEGORIAS_PRODUCTO.includes(value)) {
        throw new Error(`Categoría inválida. Las válidas son: ${CATEGORIAS_PRODUCTO.join(", ")}`);
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

const validarStock = [
  body("stock")
    .if(body("stock").exists({ checkFalsy: true }))
    .isInt({ min: 0 })
    .withMessage("Stock debe ser un entero positivo"),
];

const validarFechaVencimiento = [
  body("fechaVencimiento")
    .if(body("fechaVencimiento").exists({ checkFalsy: true }))
    .custom(validarFecha)
];

const validarDescripcion = validarTexto("descripcion", 255);

// CREATE
const validarProductoCreate = [
  normalizarCamposTexto(["nombre", "categoria"]),

  campoObligatorio("nombre", "Nombre obligatorio"),
  ...validarNombre,

  campoObligatorio("categoria", "Categoría obligatoria"),
  ...validarCategoria,

  campoObligatorio("precio", "Precio obligatorio"),
  ...validarPrecio,

  body("stock").optional(),
  ...validarStock,

  body("descripcion").optional(),
  ...validarDescripcion,

  body("fechaVencimiento")
    .custom((value, { req }) => {
      const cat = req.body.categoria;
      if ((cat === "farmacia" || cat === "comida") && !value) {
        throw new Error("Fecha de vencimiento es obligatoria para farmacia y comida");
      }
      return true;
    }),
  ...validarFechaVencimiento,

  manejoErrores,
];

// UPDATE
const validarProductoUpdate = [
  normalizarCamposTexto(["nombre", "categoria"]),

  body("nombre").optional(),
  ...validarNombre,

  body("categoria").optional(),
  ...validarCategoria,

  body("precio").optional(),
  ...validarPrecio,

  body("stock").optional(),
  ...validarStock,

  body("descripcion").optional(),
  ...validarDescripcion,

  body("fechaVencimiento").optional(),
  ...validarFechaVencimiento,

  manejoErrores,
];

const validarCantidad = [
  campoObligatorio("cantidad", "Cantidad es obligatoria"),
  body("cantidad")
    .isInt({ min: 1 })
    .withMessage("Cantidad debe ser un entero positivo"),
  manejoErrores
];

module.exports = {
  validarProductoCreate,
  validarProductoUpdate,
  validarCantidad
};
