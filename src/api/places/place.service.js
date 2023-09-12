import pkg from 'validator'

import { BadRequestError, NotFoundError } from '../../utils/errors.js'
import db from '../../db/db.js'
import { findMany, findOne, createOne, updateOne, deleteOne } from '../../utils/dao.js'

const { isLength } = pkg
const table = 'Places'

const validateInsert = async (payload = {}) => {
  const errors = {}
  const data = {
    code: payload.code ? parseInt(payload.code.trim()) : 0,
    nameFi: payload.nameFi ? payload.nameFi.trim() : '',
    nameSv: payload.nameSv ? payload.nameSv.trim() : '',
    provinceFi: payload.provinceFi ? payload.provinceFi.trim() : '',
    provinceSv: payload.provinceSv ? payload.provinceSv.trim() : '',
  }

  if (!data.code) {
    errors.code = 'The code must be a valid number'
  } else {
    const found = await findOne(table, { code: data.code })
    if (found) {
      errors.code = `Code: ${data.code} already exists`
    }
  }

  if (!isLength(data.nameFi, { min: 2, max: 200 })) {
    errors.nameFi = 'Place name must be between 2 and 50 characters log'
  }

  if (!isLength(data.nameSv, { min: 2, max: 200 })) {
    errors.nameSv = 'Place name must be between 2 and 50 characters log'
  }

  if (!isLength(data.provinceFi, { min: 2, max: 200 })) {
    errors.provinceFi = 'Province name must be between 2 and 50 characters log'
  }

  if (!isLength(data.provinceSv, { min: 2, max: 200 })) {
    errors.provinceSv = 'Province name must be between 2 and 50 characters log'
  }

  const isValid = Object.keys(errors).length === 0
  return { isValid, errors, data }
}

const validateUpdate = async (payload = {}) => {
  const errors = {}
  const { nameFi, nameSv, provinceFi, provinceSv } = payload
  const data = {}

  // Add update attributes only if values provided
  if (nameFi && nameFi.trim()) {
    data.nameFi = nameFi.trim()
  }
  if (nameSv && nameSv.trim()) {
    data.nameSv = nameSv.trim()
  }
  if (provinceFi && provinceFi.trim()) {
    data.provinceFi = provinceFi.trim()
  }
  if (provinceSv && provinceSv.trim()) {
    data.provinceSv = provinceSv.trim()
  }

  if (data.nameFi && !isLength(data.nameFi, { min: 2, max: 200 })) {
    errors.nameFi = 'Place name must be between 2 and 50 characters log'
  }

  if (data.nameSv && !isLength(data.nameSv, { min: 2, max: 200 })) {
    errors.nameSv = 'Place name must be between 2 and 50 characters log'
  }

  if (data.provinceFi && !isLength(data.provinceFi, { min: 2, max: 200 })) {
    errors.provinceFi = 'Province name must be between 2 and 50 characters log'
  }

  if (data.provinceSv && !isLength(data.provinceSv, { min: 2, max: 200 })) {
    errors.provinceSv = 'Province name must be between 2 and 50 characters log'
  }

  if (Object.keys(data).length === 0) {
    errors.fields = 'Empty payload. Nothing to update'
  }

  const isValid = Object.keys(errors).length === 0
  return { isValid, errors, data }
}

export const findPlaces = async (qryParams) => {
  const query = {
    filter: qryParams.filter ? qryParams.filter.trim() : '',
    sort: qryParams.sort ? qryParams.sort.trim() : 'nameSv',
    limit: qryParams.limit ? parseInt(qryParams.limit.trim()) : 25,
    skip: qryParams.skip ? parseInt(qryParams.skip.trim()) : 0,
  }

  let result
  // If a filter is set allow part str
  if (query.filter) {
    const expr = query.filter + '%'
    result = await db
      .knex(table)
      .whereILike('nameSv', expr)
      .orWhereILike('nameFi', expr)
      .orWhereILike('provinceSv', expr)
      .orWhereILike('provinceFi', expr)
  } else {
    result = await findMany(table, query)
  }

  return {
    success: true,
    message: `Found ${result.length} places`,
    query,
    data: result,
  }
}

export const getPlaceById = async (id) => {
  const place = await findOne(table, { id })
  if (!place) {
    throw new NotFoundError(`Place with id: ${id} was not found`)
  }

  return {
    success: true,
    message: `Found ${place.nameSv}`,
    data: place,
  }
}

export const createPlace = async (payload) => {
  const validate = await validateInsert(payload)
  if (!validate.isValid) throw new BadRequestError('Faulty data', validate.errors)

  const result = await createOne(table, validate.data)

  return {
    success: true,
    message: `Created place: ${result.nameSv}`,
    data: result,
  }
}

export const updatePlace = async (id, payload) => {
  // Ensure it exists
  const found = await findOne(table, { id })
  if (!found) {
    throw new NotFoundError(`Place with id: ${id} was not found`)
  }

  const validate = await validateUpdate(payload)
  if (!validate.isValid) throw new BadRequestError('Faulty data', validate.errors)

  const result = await updateOne(table, id, validate.data)

  return {
    success: true,
    message: `Updated place: ${result.nameSv}`,
    data: result,
  }
}

export const deletePlace = async (id) => {
  // Ensure it exists
  const found = await findOne(table, { id })
  if (!found) {
    throw new NotFoundError(`Place with id: ${id} was not found`)
  }
  const result = await deleteOne(table, id)

  return {
    success: true,
    message: `Deleted place: ${result.nameSv}`,
    data: result,
  }
}
