// middlewares/utils.js

const { validationResult, body } = require("express-validator");

function validarFecha(value) {
    if (!value) return true; // si no viene, no valida aquí
  
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
  return function manejoErrores(req, res, next) {
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

    const datosExtra = obtenerDatos ? obtenerDatos(req) : {};

    return res.status(400).render(vista, {
      modo,
      errores: erroresFormateados,
      ...datosExtra
    });
  };
}




  /**
 * validarDuplicado recibe un Modelo y un array de campos a verificar como combinación única.
 * 
 * Ejemplo:
 * validarDuplicado(Paciente, ['nombre', 'responsable.email'])
 */
// Aca use el siguiente prompt para IA: 
/**
 * Necesito una función para validar duplicados en un middleware de express. Quiero que reciba un modelo y los campos a chequear
 * El modelo va a tener un findAll
 * Debe validar que el id sea distinto, porque si es un update puede que coincida
 * Debe tener en cuenta campos anidados como "responsable.email"
 */
function validarDuplicado(Modelo, campos = []) {
    return body(campos[0])
      .if(body(campos[0]).exists({ checkFalsy: true }))
      .custom(async (value, { req }) => {
        // Obtenemos todos los registros
        const registros = await Modelo.findAll();
  
        // Id actual para evitar conflicto en update
        const idActual = req.params.id ? parseInt(req.params.id) : null;
  
        // Chequeamos si existe un registro que tenga la misma combinación de campos
        const existeDuplicado = registros.some(r => {
          if (idActual && r.id === idActual) return false;
  
          return campos.every(campo => {
            // campo puede ser anidado, ej: 'responsable.email'
            const valorReq = campo.split(".").reduce((acc, key) => acc && acc[key], req.body);
            const valorRegistro = campo.split(".").reduce((acc, key) => acc && acc[key], r);
  
            if (typeof valorReq === "string" && typeof valorRegistro === "string") {
              return valorReq.toLowerCase() === valorRegistro.toLowerCase();
            }
            return valorReq === valorRegistro;
          });
        });
  
        if (existeDuplicado) {
          throw new Error(`Ya existe un ${Modelo.name.toLowerCase()} con esa combinación de ${campos.join(", ")}`);
        }
  
        return true;
      });
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
    validarDuplicado,
    validarTexto,
    validarDecimal,
    validarEntero,
    campoObligatorio
  };