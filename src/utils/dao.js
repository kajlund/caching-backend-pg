import db from '../db/db.js'

export const findMany = async (table, query) => {
  const { filter, sort, limit, skip } = query
  const result = await db.knex(table).where(filter).orderBy(sort).limit(limit).offset(skip)
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
