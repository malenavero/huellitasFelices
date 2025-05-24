const bcrypt = require('bcrypt');

function returnJSON(req) {
    const accept = req.headers.accept || '';
    return (
      !accept ||
      accept === '*/*' ||
      accept.includes('application/json') ||
      req.query.format === 'json'
    );
  }


function hashPassword(password) {
  // Encripta la contraseña en texto plano del usuario
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
}

function comparePassword(password, hash) {
  // Compara la contraseña en texto plano con el hash almacenado en db
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}


function handleError(req, res, status, message = '') {
  if (returnJSON(req)) {
    return res.status(status).json({ error: message });
  } else {
    return res.status(status).render(`errors/${status}`, { mensaje: message });
  }
}

const urls = {
  productosUrl: '/productos',
  pacientesUrl: '/pacientes',
  turnosUrl: '/turnos',
  busquedasUrl: '/busquedas',
  usuariosUrl: '/usuarios',
  documentacionUrl: '/documentacion'
}

module.exports = {
    returnJSON,
    hashPassword,
    comparePassword,
    handleError,
    urls
}