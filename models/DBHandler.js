// models/DBHandler.js
// Esta clase la creamos para gestionar todo lo que es leer/escribir archivos json
const fs = require("fs").promises;
const path = require("path");

class DBHandler {
  constructor(fileName) {
    this.filePath = path.join(__dirname, "..", "data", fileName);
  }

  async readData() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      console.error("Error leyendo el archivo:", err);
      throw err;
    }
  }

  async writeData(data) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("Error escribiendo el archivo:", err);
      throw err;
    }
  }

  async updateData(id, updatedFields) {
    const data = await this.readData();
    const index = data.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const original = data[index];
    data[index] = {
      ...original,
      ...updatedFields,
      responsable: {
        ...original.responsable,
        ...updatedFields.responsable,
      },
      updatedAt: new Date().toISOString(),
    };

    await this.writeData(data);
    return data[index];
  }

  async deleteData(id) {
    const data = await this.readData();
    const initialLength = data.length;
    const newData = data.filter((item) => parseInt(item.id) !== parseInt(id));

    if (newData.length === initialLength) {
      return null;
    }

    await this.writeData(newData);
    return id;
  }

  getNewId(data) {
    return data.length > 0 ? data[data.length - 1].id + 1 : 1;
  }
}

module.exports = DBHandler;
