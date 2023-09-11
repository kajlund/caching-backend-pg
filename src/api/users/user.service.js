import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pkg from 'validator'

const { isLength, isEmail } = pkg

import { BadRequestError, UnautorizedError } from '../../utils/errors.js'
import { findOne, createOne } from '../../utils/dao.js'

const table = 'Users'

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10)

const validateNewUser = async (payload = {}) => {
  const errors = {}
  const data = {
    username: payload.username ? payload.username.trim() : '',
    email: payload.email ? payload.email.trim() : '',
    password: payload.password ? payload.password.trim() : '',
  }

  if (!data.username || !isLength(data.username, { min: 2, max: 200 })) {
    errors.username = 'The username is mandatory and must be between 2 and 200 characters long'
  }

  if (!isEmail(data.email)) {
    errors.email = 'Email must be a valid email address'
  } else {
    const found = await findOne(table, { email: data.email })
    if (found) {
      errors.email = `Email: ${data.email} already registered`
    }
  }

  if (!isLength(data.password, { min: 8, max: 200 })) {
    errors.password = 'Password must be between 8 and 200 characters long'
  } else {
    data.password = await bcrypt.hash(data.password, SALT_ROUNDS)
  }

  const isValid = Object.keys(errors).length === 0
  return { isValid, errors, data }
}

export const loginUser = async (payload) => {
  const { email, password } = payload
  const user = await findOne(table, { email })
  if (!user) throw new UnautorizedError('Wrong email and/or password')
  const pwdOK = await bcrypt.compare(password, user.password)
  if (!pwdOK) throw new UnautorizedError('Wrong email and/or password')
  user.password = undefined
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWTSecret)
  return {
    success: true,
    message: `Login ok. User: ${user.username}`,
    token,
    user,
  }
}

export const registerUser = async (payload) => {
  const validate = await validateNewUser(payload)
  if (!validate.isValid) throw new BadRequestError('Faulty data', validate.errors)
  const user = await createOne(table, validate.data)
  user.password = undefined
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWTSecret)
  return {
    success: true,
    message: `Registered user: ${user.username}`,
    token,
    user,
  }
}
