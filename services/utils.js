// services/utils.js

function getDuplicatedError(err) {
  const campos = Object.keys(err.keyPattern || err.keyValue || {});
  const errorDuplicado = new Error();
  errorDuplicado.name = "Duplicado";
  errorDuplicado.code = 11000;
  errorDuplicado.campos = campos;
  return errorDuplicado;
}

module.exports = { getDuplicatedError };

