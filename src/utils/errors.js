import { reasonPhrases, statusCodes } from './statuscodes.js'

export class AppError extends Error {
  constructor(
    message = reasonPhrases.INTERNAL_SERVER_ERROR,
    statusCode = statusCodes.INTERNAL_SERVER_ERROR,
    detail = '',
  ) {
    super(message)
    this.name = this.constructor.name
    this.isAppError = true
    this.statusCode = statusCode
    this.detail = detail
    Error.captureStackTrace(this, this.constructor)
  }
}

export class BadRequestError extends AppError {
  constructor(detail = '', errors = {}) {
    super(reasonPhrases.BAD_REQUEST, statusCodes.BAD_REQUEST, detail)
    this.errors = errors
  }
}

export class NotFoundError extends AppError {
  constructor(detail = '') {
    super(reasonPhrases.NOT_FOUND, statusCodes.NOT_FOUND, detail)
  }
}

export class InternalServerError extends AppError {
  constructor(detail = '') {
    super(reasonPhrases.INTERNAL_SERVER_ERROR, statusCodes.INTERNAL_SERVER_ERROR, detail)
  }
}
