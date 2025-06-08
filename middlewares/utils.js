// middlewares/utils.js

const { validationResult, body } = require("express-validator");

function validarFecha(value) {
    if (!value) return true;
  
    // Regex para formato aaaa-mm-dd
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(value)) {
      throw new Error("Formato de fecha inválido. Use aaaa-mm-dd");
    }
  
    // Validar que sea fecha real
    const [year, month, day] = value.split("-").map(Number);
  
    const fecha = new Date(year, month - 1, day);// getMonth() va de 0 a 11 por eso restamos un mes
    if (
      fecha.getFullYear() !== year ||
      fecha.getMonth() + 1 !== month ||
      fecha.getDate() !== day
    ) {
      throw new Error("Fecha inválida");
    }
  
    return true;
  };


function normalizarCamposTexto(campos = []) {
    return (req, res, next) => {
      campos.forEach(campo => {
        if (typeof req.body[campo] === "string") {
          req.body[campo] = req.body[campo].trim().toLowerCase();
        }
      });
      next();
    };
  }

function asignarDefaults(defaults = {}) {
  return (req, res, next) => {
    if (req.method === "POST") {
      for (const campo in defaults) {
        if (
          req.body[campo] === undefined || 
          req.body[campo] === null || 
          req.body[campo] === ""
        ) {
          req.body[campo] = defaults[campo];
        }
      }
    }
    next();
  };
}

function generarManejoErrores({ vista, obtenerDatos }) {
  return async function manejoErrores(req, res, next) {
    const errores = validationResult(req);
    if (errores.isEmpty()) return next();

    const erroresFormateados = errores.array().map(err => ({
      campo: err.path,
      mensaje: err.msg
    }));

    if (req.accepts(["html", "json"]) === "json") {
      return res.status(400).json({ errores: erroresFormateados });
    }

    const modo = req.method === "PUT" ? "editar" : "crear";

    let datosExtra = {};
    if (obtenerDatos) {
      datosExtra = await obtenerDatos(req);
    }

    return res.status(400).render(vista, {
      modo,
      errores: erroresFormateados,
      ...datosExtra
    });
  };
}


function validarTexto(campo, max = 100) {
  return [
    body(campo)
      .if(body(campo).exists({ checkFalsy: true }))
      .isString().withMessage(`${campo} debe ser texto`)
      .isLength({ max }).withMessage(`${campo} máximo ${max} caracteres`)
  ];
}

function validarDecimal(campo) {
  return [
    body(campo)
      .if(body(campo).exists({ checkFalsy: true }))
      .isFloat({ min: 0.01 })
      .withMessage(`${campo} debe ser un número positivo`),
  ];
} 

function validarEntero(campo) {
  return [
    body(campo)
      .if(body(campo).exists({ checkFalsy: true }))
      .isInt({ min: 1 })
      .withMessage(`${campo} debe ser un número entero positivo`),
  ];
} 

function campoObligatorio(campo, mensaje = `${campo} es obligatorio`) {
  return body(campo)
    .exists({ checkFalsy: true })
    .withMessage(mensaje);
}

  

  module.exports = {
    validarFecha,
    normalizarCamposTexto,
    asignarDefaults,
    generarManejoErrores,
    validarTexto,
    validarDecimal,
    validarEntero,
    campoObligatorio
  };