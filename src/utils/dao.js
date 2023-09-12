import db from '../db/db.js'

export const findMany = async (table, query) => {
  const { filter, sort, limit, skip } = query
  const flt = filter ? filter : {}
  const result = await db.knex(table).where(flt).orderBy(sort).limit(limit).offset(skip)
  return result
}

export const findOne = async (table, qry) => {
  const result = await db.knex(table).where(qry).first()
  return result
}

export const createOne = async (table, data) => {
  const result = await db.knex(table).insert(data).returning('*')
  return result.length ? result[0] : null // Return created one or null
}

export const updateOne = async (table, id, data) => {
  data.updatedAt = new Date().toISOString()
  const result = await db.knex(table).where('id', id).update(data).returning('*')
  return result.length ? result[0] : null // Returns updated object or null
}

export const deleteOne = async (table, id) => {
  const result = await db.knex(table).where('id', id).del(['*'])
  return result.length ? result[0] : null // Returns deleted one or null
}
