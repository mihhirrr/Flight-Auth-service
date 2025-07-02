
class AppError extends Error {

  constructor(message, StatusCode) {
    super(message);
    this.name = this.constructor.name;
    this.StatusCode = StatusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;