import { test } from '@japa/runner'
// import * as request from 'supertest'

// import app from '../src/app.js'

test.group('Routes.root', (group) => {
  group.setup(() => {})

  group.teardown(async () => {})

  test('Calling root endpoint should return expected JSON', async ({ client }) => {
    const req = client.get('/')
    req.accept('json')
    const res = await req.send()
    // res.dumpBody()
    res.assertStatus(200)
    res.assertBody({ message: 'Service running OK' })
  })

  test('Calling /ping should return text Pong', async ({ client }) => {
    const req = client.get('/ping')
    req.accept('text')
    const res = await req.send()
    // res.dumpBody()
    res.assertStatus(200)
    res.assertTextIncludes('Pong')
  })
})
