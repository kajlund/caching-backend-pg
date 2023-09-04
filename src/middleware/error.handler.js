import log from '../utils/log.js'
import { statusCodes, reasonPhrases } from '../utils/statuscodes.js'
import { AppError } from '../utils/errors.js'

export default (err, req, res, _next) => {
  if (!err.isAppError) {
    log.error(err)
  }

  const error = {
    statusCode: err.status || err.statusCode || statusCodes.INTERNAL_SERVER_ERROR,
  }

  // Knex DB Errors
  if (err.code) {
    // Faulty UUID format will generate Knex error
    if (err.code === '22P02') {
      error.statusCode = statusCodes.BAD_REQUEST
      error.message = reasonPhrases.BAD_REQUEST
      error.detail = 'Faulty uuid format'
    }
    // Unique constraint error
    if (err.code === '23505') {
      error.statusCode = statusCodes.BAD_REQUEST
      error.message = reasonPhrases.BAD_REQUEST
      error.detail = err.detail
    }
    if (err.code === '42703') {
      error.statusCode = statusCodes.BAD_REQUEST
      error.message = reasonPhrases.BAD_REQUEST
      error.detail = 'Database error: Check field names'
    }
  }

  if (err instanceof AppError) {
    error.message = err.message
    error.detail = err.detail
    if (err.errors) error.errors = err.errors
  }

  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
    detail: error.detail || '',
    errors: error.errors || {},
  })
}
