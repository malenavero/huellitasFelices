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



module.exports = {
    returnJSON,
    hashPassword,
    comparePassword
}