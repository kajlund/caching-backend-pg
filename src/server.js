import http from 'http'

import dotenv from 'dotenv'

dotenv.config()

import log from './utils/log.js'
import app from './app.js'

log.info('Starting server')
http.createServer(app).listen(process.env.PORT, () => {
  log.info(`Server listening on port ${process.env.PORT}`)
})
