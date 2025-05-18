// middlewares/validacionesProductos.js
const { body } = require('express-validator');
const Producto = require('../models/Producto');
const { validarFecha, normalizarCamposTexto, asignarDefaults, manejoErrores, validarDuplicado, validarTexto } = require('./utils.js');

// Validadores generales sin .exists ni .optional porque eso depende de si es create o update
const validarNombre = validarTexto('nombre', 100);

const validarCategoria = [
  body('categoria')
    .if(body('categoria').exists({ checkFalsy: true }))
    .custom(value => {
      const categoriasValidas = Producto.getCategorias();
      if (!categoriasValidas.includes(value)) {
        throw new Error(`Categoría inválida. Las válidas son: ${categoriasValidas.join(', ')}`);
      }
      return true;
    }),
];

const validarPrecio = [
  body('precio')
    .if(body('precio').exists({ checkFalsy: true }))
    .isFloat({ min: 0.01 })
    .withMessage('Precio debe ser un número positivo'),
];

const validarStock = [
  body('stock')
    .if(body('stock').exists({ checkFalsy: true }))
    .isInt({ min: 0 })
    .withMessage('Stock debe ser un entero positivo'),
];

const validarFechaVencimiento = [
  body('fechaVencimiento')
    .if(body('fechaVencimiento').exists({ checkFalsy: true }))
    .custom(validarFecha)
];

const validarDescripcion = validarTexto('descripcion', 255);

// Validación CREATE 
const validarProductoCreate = [
  normalizarCamposTexto(['nombre', 'categoria']),
  asignarDefaults({
    descripcion: "",
    fechaVencimiento: "",
    stock: 0
  }),

  body('nombre')
    .exists({ checkFalsy: true })
    .withMessage('Nombre obligatorio'),
  validarDuplicado(Producto, ["nombre"]),
  ...validarNombre,

  body('categoria')
    .exists({ checkFalsy: true })
    .withMessage('Categoría obligatoria'),
  ...validarCategoria,

  body('precio')
    .exists({ checkFalsy: true })
    .withMessage('Precio obligatorio'),
  ...validarPrecio,

  // stock es opcional
  body('stock').optional(),
  ...validarStock,

  // descripcion opcional
  body('descripcion').optional(),
  ...validarDescripcion,

  // fechaVencimiento obligatorio para farmacia/comida
  body('fechaVencimiento')
    .custom((value, { req }) => {
      const cat = req.body.categoria;
      if ((cat === 'farmacia' || cat === 'comida') && !value) {
        throw new Error('Fecha de vencimiento es obligatoria para farmacia y comida');
      }
      return true;
    }),

  ...validarFechaVencimiento,

  manejoErrores,
];

// Validación UPDATE: todos opcionales, validar solo si están
const validarProductoUpdate = [
  normalizarCamposTexto(['nombre', 'categoria']),

  body('nombre').optional(),
  validarDuplicado(Producto, ["nombre"]),
  ...validarNombre,

  body('categoria').optional(),
  ...validarCategoria,

  body('precio').optional(),
  ...validarPrecio,

  body('stock').optional(),
  ...validarStock,

  body('descripcion').optional(),
  ...validarDescripcion,

  body('fechaVencimiento').optional(),
  ...validarFechaVencimiento,

  manejoErrores,
];

module.exports = {
  validarProductoCreate,
  validarProductoUpdate,
};
