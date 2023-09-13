/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

import { readFile } from 'fs/promises'
import crypto from 'crypto'

import dotenv from 'dotenv'

dotenv.config()

let isTest = process.env.NODE_ENV === 'test'

export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('Places').del()

  if (isTest) {
    const places = JSON.parse(await readFile(new URL('./places-test.json', import.meta.url)))
    await knex('Places').insert(places)
  } else {
    const municiplalities = JSON.parse(await readFile(new URL('./places.json', import.meta.url)))
    const places = []
    for (const key in municiplalities) {
      places.push({
        id: crypto.randomUUID(),
        code: parseInt(key, 10),
        nameFi: municiplalities[key].KUNTANIMIFI,
        nameSv: municiplalities[key].KUNTANIMISV,
        provinceFi: municiplalities[key].MAAKUNTANIMIFI,
        provinceSv: municiplalities[key].MAAKUNTANIMISV,
      })
    }

    await knex('Places').insert(places)
  }
}
