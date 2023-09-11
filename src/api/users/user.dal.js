import db from '../../db/db.js'

export const findUser = async (qry) => {
  const result = await db.knex('Users').where(qry).first()
  return result
}

export const saveUser = async (userData) => {
  const result = await db.knex('Users').insert(userData).returning('*')
  return result.length ? result[0] : null // Return created one or null
}
