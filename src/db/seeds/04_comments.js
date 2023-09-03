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

const finCacheIdByGC = async (gc) => {
  let cacheId = ''
  const cache = await db.knex('Caches').where('gc', gc).first()
  if (cache) {
    cacheId = cache.id
  }
  // console.log(`userId = ${userId}`)
  return cacheId
}

export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('Comments').del()

  let commentList = []
  const userId = await finUserIdByEmail('kaj.lund@gmail.com')

  for (const key in caches) {
    let cacheId = await finCacheIdByGC(caches[key].cacheId)
    let note = caches[key].notes
    if (cacheId && note) {
      commentList.push({ cacheId, userId, comment: note })
    }
  }

  if (commentList.length) {
    // console.log(commentList)
    await knex('Comments').insert(commentList)
  }
}
