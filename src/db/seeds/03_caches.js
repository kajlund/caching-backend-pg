/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

import { readFile } from 'fs/promises'

const caches = JSON.parse(await readFile(new URL('./caches.json', import.meta.url)))

import db from '../db.js'

const finUserIdByEmail = async (email) => {
  let userId = ''
  const user = await db.knex('Users').where('email', email).first()
  if (user) {
    userId = user.id
  }
  // console.log(`userId = ${userId}`)
  return userId
}

const findPlaceIdByName = async (name) => {
  let placeId = ''
  let nameParam = name ? name.toLowerCase().trim() : ''
  if (nameParam) {
    const place = await db
      .knex('Places')
      .whereRaw(`lower('nameSv') = ?`, [`${nameParam}`])
      .orWhereRaw(`lower('nameFi') = ?`, [`${nameParam}`])
      .first()
    if (place) {
      placeId = place.id
    }
  }
  // console.log(`placeId = ${placeId}`)
  return placeId
}

export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('Caches').del()

  let cacheList = []
  const userId = await finUserIdByEmail('kaj.lund@gmail.com')

  for (const key in caches) {
    let placeId = await findPlaceIdByName(caches[key].municipality)

    let cache = {
      gc: caches[key].cacheId,
      cacheType: caches[key].cacheType,
      name: caches[key].name,
      coords: caches[key].coords,
      verified: caches[key].verifiedCoords,
      placeId,
      userId,
    }
    cacheList.push(cache)
    if (cacheList.length >= 100) {
      // console.log(cacheList)
      await knex('Caches').insert(cacheList)
      cacheList = []
    }
  }
  if (cacheList.length) {
    await knex('Caches').insert(cacheList)
  }
}
