import pino from 'pino'
import dotenv from 'dotenv'

dotenv.config()

const cnf = {
  level: process.env.LOG_LEVEL || 'info',
}

// Disable when running tests
if (process.env.NODE_ENV === 'test') {
  cnf.enabled = false
}

if (process.env.NODE_ENV === 'development') {
  cnf.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  }
}

const log = pino(cnf)
log.debug({ cnf }, 'Pino logger configured')

export default log
