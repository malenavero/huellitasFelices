// middlewares/validacionesProductos.js
const { body, validationResult } = require('express-validator');
const Producto = require('../models/Producto');


const validarFecha = (value) => {
  if (!value) return true; // si no viene, no valida aquí

  // Regex para formato aaaa-mm-dd
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(value)) {
    throw new Error('Formato de fecha inválido. Use aaaa-mm-dd');
  }

  // Validar que sea fecha real
  const [year, month, day] = value.split('-').map(Number);

  const fecha = new Date(year, month - 1, day);// getMonth() va de 0 a 11 por eso restamos un mes
  if (
    fecha.getFullYear() !== year ||
    fecha.getMonth() + 1 !== month ||
    fecha.getDate() !== day
  ) {
    throw new Error('Fecha inválida');
  }

  return true;
};

// Normalización 
const normalizarCampos = (req, res, next) => {
  // Normalizar 
  if (typeof req.body.nombre === 'string') {
    req.body.nombre = req.body.nombre.trim().toLowerCase();
  }

  if (typeof req.body.categoria === 'string') {
    req.body.categoria = req.body.categoria.toLowerCase();
  }

  // Para campos opcionales, solo ponemos default si es POST para no pisar los anterior al updatear
  if (req.method === 'POST') {
    if (typeof req.body.descripcion === 'undefined') req.body.descripcion = '';
    if (typeof req.body.fechaVencimiento === 'undefined') req.body.fechaVencimiento = '';
    if (typeof req.body.stock === 'undefined' || req.body.stock === '') req.body.stock = 0;
  }

  next();
};


// Validadores  sin .exists ni .optional porque eso depende de si es create o update
const validarNombre = [
  body('nombre')
    .if(body('nombre').exists({ checkFalsy: true }))
    .isLength({ max: 100 }).withMessage('Nombre máximo 100 caracteres')
    .custom(async (value, { req }) => {
      if (!value) return true; // si no viene, se valida en create/update con exists/optional
      const productos = await Producto.findAll();
      const idActual = req.params.id ? parseInt(req.params.id) : null;
      const existe = productos.some(p => p.nombre.toLowerCase() === value.toLowerCase() && p.id !== idActual);
      if (existe) throw new Error('Ya existe un producto con ese nombre');
      return true;
    }),
];

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

const validarDescripcion = [
  body('descripcion')
    .if(body('descripcion').exists({ checkFalsy: true }))
    .isLength({ max: 255 })
    .withMessage('Descripción muy larga'),
];

const manejoErrores = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const erroresFormateados = errores.array().map(err => ({
      campo: err.path,
      mensaje: err.msg,
    }));
    return res.status(400).json({ errores: erroresFormateados });
  }
  next();
};

// Validación CREATE 
const validarProductoCreate = [
  normalizarCampos,

  body('nombre')
    .exists({ checkFalsy: true })
    .withMessage('Nombre obligatorio'),
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
      if (cat !== 'farmacia' && cat !== 'comida') {
        // Si no es farmacia o comida no valido
        if (!value) return true;
      }
      return true;
    }),
  ...validarFechaVencimiento,

  manejoErrores,
];

// Validación UPDATE: todos opcionales, validar solo si están
const validarProductoUpdate = [
  normalizarCampos,

  body('nombre').optional(),
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
