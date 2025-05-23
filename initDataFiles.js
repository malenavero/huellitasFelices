// initDataFiles.js
const fs = require('fs');
const path = require('path');

const dataFiles = [
  'data/busquedas.json',
  'data/pacientes.json',
  'data/turnos.json',
  'data/productos.json',
];

function ensureDataFilesExist() {
  dataFiles.forEach(filePath => {
    const fullPath = path.resolve(__dirname, filePath);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, '[]', 'utf8');
      console.log(`Archivo creado: ${fullPath}`);
    }
  });
}

module.exports = ensureDataFilesExist;
