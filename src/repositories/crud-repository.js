const AppError = require("../utils/Error-handler/AppError");
const { StatusCodes } = require("http-status-codes");

/**
 * @class CrudFunctions
 * @description Generic CRUD utility class.
 * Supports create, read, update, and delete operations with consistent error handling.
 */
class CrudFunctions {

  constructor(model) {
    this.model = model;
  }

  async create(data) {
    try {
      const response = await this.model.create(data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async find(id) {
    try {
      const response = await this.model.findByPk(id);
      if (!response) {
        throw new AppError(
          `Resource not found for the ID ${id}`,
          StatusCodes.NOT_FOUND
        );
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  async findAll(options = {}) {
    try {
      const response = await this.model.findAll(options);
      return response;
    } catch (error) {
      console.log(`Error retrieving data from ${this.model.name}`);
      throw error;
    }
  }


  async update(id, data) {
    try {
      const response = await this.model.update(data, {
        where: { id }
      });

      if (!response[0]) {
        throw new AppError(
          `Resource not found for the ID ${id}`,
          StatusCodes.NOT_FOUND
        );
      }

      return response;
    } catch (error) {
      console.log(`Error updating data in ${this.model.name}`);
      throw error;
    }
  }

  async delete(id) {
    try {
      const response = await this.model.destroy({
        where: { id }
      });

      if (!response) {
        throw new AppError(
          `Resource not found for the ID ${id}`,
          StatusCodes.NOT_FOUND
        );
      }

      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CrudFunctions;