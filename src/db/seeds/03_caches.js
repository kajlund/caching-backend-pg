/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

import { readFile } from 'fs/promises'

const caches = JSON.parse(await readFile(new URL('./caches.json', import.meta.url)))

import db from '../db.js'

const finUserByEmail = async (email) => {
  const user = await db.knex('Users').where('email', email).first()
  if (user) {
    return user
  }
  return null
}

const findPlaceByName = async (name) => {
  let nameParam = name ? name.trim() : ''
  if (nameParam) {
    const place = await db.knex('Places').where('nameSv', nameParam).orWhere('nameFi', nameParam).first()
    if (place) {
      return place
    }
  }
  return null
}

export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('Caches').del()

  const user = await finUserByEmail('kaj.lund@gmail.com')

  for (const key in caches) {
    let place = await findPlaceByName(caches[key].municipality)

    let cache = {
      gc: caches[key].cacheId,
      cacheType: caches[key].cacheType,
      name: caches[key].name,
      coords: caches[key].coords,
      verified: caches[key].verifiedCoords,
    }
    if (place) {
      cache.placeId = place.id
    }
    if (user) {
      cache.userId = user.id
    }
    await knex('Caches').insert(cache)
  }
}
