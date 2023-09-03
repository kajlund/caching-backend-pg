/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
import { readFile } from 'fs/promises'

import bcrypt from 'bcryptjs'

const users = JSON.parse(await readFile(new URL('./users.json', import.meta.url)))

export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('Users').del()

  for (let u of users) {
    u.password = await bcrypt.hash(u.password, 12)
  }

  await knex('Users').insert(users)
}
