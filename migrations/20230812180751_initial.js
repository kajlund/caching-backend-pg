/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

  await knex.schema.createTable('Users', (table) => {
    // table.increments('id')
    table.uuid('id', { useBinaryUuid: false, primaryKey: true })
    table.string('username').notNullable().defaultTo('')
    table.string('email').notNullable().unique()
    table.string('password').notNullable()
    table.string('role').notNullable().defaultTo('PROSPECT')
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable('Places', (table) => {
    // table.increments('id')
    table.uuid('id', { useBinaryUuid: false, primaryKey: true })
    table.integer('code').notNullable().unique().index()
    table.string('nameFi').notNullable().defaultTo('').index()
    table.string('nameSv').notNullable().defaultTo('').index()
    table.string('provinceFi').notNullable().defaultTo('')
    table.string('provinceSv').notNullable().defaultTo('')
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable('Caches', (table) => {
    //table.increments('id')
    table.uuid('id', { useBinaryUuid: false, primaryKey: true })
    table.string('gc').notNullable().unique().index()
    table.string('cacheType').notNullable().defaultTo('').index()
    table.string('name').notNullable().defaultTo('').index()
    table.string('coords').notNullable().defaultTo('')
    table.boolean('verified').notNullable().defaultTo(false)
    table
      .uuid('placeId', { useBinaryUuid: false })
      .references('id')
      .inTable('Places')
      .nullable()
      .defaultTo(null)
      .onDelete('SET NULL')
    table
      .uuid('userId', { useBinaryUuid: false })
      .references('id')
      .inTable('Users')
      .nullable()
      .defaultTo(null)
      .onDelete('SET NULL')
    table.datetime('deletedAt', { precision: 6 }).nullable().defaultTo(null)
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable('Comments', (table) => {
    // table.increments('id')
    table.uuid('id', { useBinaryUuid: false, primaryKey: true })
    table
      .uuid('cacheId', { useBinaryUuid: false })
      .references('id')
      .inTable('Caches')
      .nullable()
      .defaultTo(null)
      .onDelete('CASCADE')
    table
      .uuid('userId', { useBinaryUuid: false })
      .references('id')
      .inTable('Users')
      .nullable()
      .defaultTo(null)
      .onDelete('SET NULL')
    table.text('comment').notNullable().defaultTo('')
    table.timestamps(true, true, true)
  })

  return true
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('Comments')
  await knex.schema.dropTableIfExists('Caches')
  await knex.schema.dropTableIfExists('Users')
  await knex.schema.dropTableIfExists('Places')

  return true
}
