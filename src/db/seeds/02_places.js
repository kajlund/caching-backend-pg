/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

import { readFile } from 'fs/promises'

const municiplalities = JSON.parse(await readFile(new URL('./places.json', import.meta.url)))

export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('Places').del()

  const places = []
  for (const key in municiplalities) {
    places.push({
      code: parseInt(key, 10),
      nameFi: municiplalities[key].KUNTANIMIFI,
      nameSv: municiplalities[key].KUNTANIMISV,
      provinceFi: municiplalities[key].MAAKUNTANIMIFI,
      provinceSv: municiplalities[key].MAAKUNTANIMISV,
    })
  }

  await knex('Places').insert(places)
}
