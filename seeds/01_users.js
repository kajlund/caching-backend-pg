/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
import { readFile } from 'fs/promises'
import crypto from 'crypto'

import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

let isTest = process.env.NODE_ENV === 'test'
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10)

export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('Users').del()
  if (isTest) {
    const users = JSON.parse(await readFile(new URL('./users-test.json', import.meta.url)))
    for (let u of users) {
      u.password = await bcrypt.hash(u.password, SALT_ROUNDS)
    }
    await knex('Users').insert(users)
  } else {
    const users = JSON.parse(await readFile(new URL('./users.json', import.meta.url)))
    // Hash passwords
    for (let u of users) {
      if (!u.id) {
        u.id = crypto.randomUUID()
      }
      u.password = await bcrypt.hash(u.password, SALT_ROUNDS)
    }
    await knex('Users').insert(users)
  }
}
