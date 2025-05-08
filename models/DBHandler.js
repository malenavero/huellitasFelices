// models/DBHandler.js
// Esta clase la creamos para gestionar todo lo que es leer/escribir archivos json
const fs = require('fs').promises;
const path = require('path');

class DBHandler {
  constructor(fileName) {
    this.filePath = path.join(__dirname, '..', 'data', fileName);
  }

  async readData() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error leyendo el archivo:', err);
      return [];
    }
  }

  async writeData(data) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Error escribiendo el archivo:', err);
    }
  }
}

module.exports = DBHandler;
