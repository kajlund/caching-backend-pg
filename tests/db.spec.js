import { test } from '@japa/runner'

import db from '../src/db/db.js'

test.group('Database.Connection', () => {
  test('calling connect', async ({ assert }) => {
    await db.connect()
    assert.isOk(db.knex.client.pool)
    assert.isAbove(db.knex.client.pool.numFree(), 0)
  })

  test('calling disconnect', async ({ assert }) => {
    await db.disconnect()
    assert.isUndefined(db.knex.client.pool)
  })
})
