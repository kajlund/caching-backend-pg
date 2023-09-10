import dotenv from 'dotenv'

dotenv.config()

export default {
  development: {
    client: 'pg',
    connection: process.env.DB_CONNECTION_DEV,
    pool: {
      min: 2,
      max: 10,
    },
  },

  test: {
    client: 'pg',
    connection: process.env.DB_CONNECTION_TEST,
    pool: {
      min: 2,
      max: 10,
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DB_CONNECTION,
    pool: {
      min: 2,
      max: 10,
    },
  },
}
