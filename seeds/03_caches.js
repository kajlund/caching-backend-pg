/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

import { readFile } from 'fs/promises'
import dotenv from 'dotenv'

dotenv.config()

let caches
let isTest = !!process.env.NODE_ENV === 'test'

if (isTest) {
  caches = JSON.parse(await readFile(new URL('./caches-test.json', import.meta.url)))
} else {
  caches = JSON.parse(await readFile(new URL('./caches.json', import.meta.url)))
}

import db from '../src/db/db.js'

const findUserByEmail = async (email) => {
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

  if (isTest) {
    await knex('Caches').insert(caches)
  } else {
    const user = await findUserByEmail('kaj.lund@gmail.com')

    for (const key in caches) {
      let place = await findPlaceByName(caches[key].municipality)

      let cache = {
        gc: caches[key].cacheId,
        cacheType: caches[key].cacheType,
        name: caches[key].name,
        coords: caches[key].coords,
        verified: caches[key].verifiedCoords,
        createdAt: caches[key].createdAt,
        updatedAt: caches[key].updatedAt,
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
}
