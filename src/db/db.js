import knex from 'knex'

import knexfile from '../../knexfile.js'
import log from '../utils/log.js'

const environment = process.env.NODE_ENV || 'development'
const myKnex = knex(knexfile[environment])

const db = {
  knex: myKnex,
  connect: async () => {
    try {
      await myKnex('knex_migrations')
      log.info('Postgres connected')
    } catch (err) {
      log.error({ err }, 'Database connection error:')
    }
  },
  disconnect: async () => {
    try {
      await myKnex.destroy()
      log.info('Postgres connection closed')
    } catch (err) {
      log.error({ err }, 'Database disconnection error:')
    }
  },
}

export default db
