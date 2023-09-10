/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
import { readFile } from 'fs/promises'

import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

let users
let isTest = !!process.env.NODE_ENV === 'test'
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10)

if (isTest) {
  users = JSON.parse(await readFile(new URL('./users-test.json', import.meta.url)))
} else {
  users = JSON.parse(await readFile(new URL('./users.json', import.meta.url)))
}

export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('Users').del()

  // Hash passwords
  for (let u of users) {
    u.password = await bcrypt.hash(u.password, SALT_ROUNDS)
  }
  await knex('Users').insert(users)
}
