import { test } from '@japa/runner'

test.group('Routes.user', () => {
  test('Registering with valid fields should create a new user', async ({ client, assert }) => {
    const res = await client.post('/api/v1/users/register').json({
      username: 'Testuser',
      email: 'testuser@gmail.com',
      password: '12345678',
    })
    // res.dumpBody()
    res.assertStatus(200)
    const body = res.body()
    assert.properties(body, ['success', 'message', 'token', 'user'])
    assert.properties(body.user, ['id', 'username', 'email', 'role', 'createdAt', 'updatedAt'])
    assert.exists(body.token)
    res.assertBodyContains({
      success: true,
      user: { email: 'testuser@gmail.com', role: 'PROSPECT', username: 'Testuser' },
    })
  })

  test('Registering with faulty data should fail', async ({ client, assert }, data) => {
    const res = await client.post('/api/v1/users/register').json(data)
    // res.dumpBody()
    res.assertStatus(400)
    const body = res.body()
    assert.properties(body, ['success', 'message', 'detail', 'errors'])
    assert.isObject(body.errors)
    res.assertBodyContains({
      success: false,
      message: 'Bad Request',
      detail: 'Faulty data',
    })
  }).with([
    { username: '', email: 'someuser@gmail.com', password: '12345678' },
    { username: 'User', email: '', password: '12345678' },
    { username: 'User', email: 'user@gmail.com', password: '12345678' },
    { username: 'User', email: 'newuser@gmail.com', password: '' },
    { username: 'User', email: 'newuser@gmail.com', password: '1234567' },
  ])

  test('Login with valid credentials should succeed', async ({ client, assert }) => {
    const res = await client.post('/api/v1/users/login').json({
      email: 'user@gmail.com',
      password: '12345678',
    })
    res.assertStatus(200)
    const body = res.body()
    assert.properties(body, ['success', 'message', 'token', 'user'])
    assert.properties(body.user, ['id', 'username', 'email', 'role', 'createdAt', 'updatedAt'])
    assert.exists(body.token)
    res.assertBodyContains({
      success: true,
      user: { email: 'user@gmail.com', role: 'USER', username: 'user' },
    })
  })

  test('Login with invalid credentials should fail', async ({ client, assert }, data) => {
    const res = await client.post('/api/v1/users/login').json(data)
    // res.dumpBody()
    res.assertStatus(401)
    const body = res.body()
    assert.properties(body, ['success', 'message', 'detail', 'errors'])
    assert.isObject(body.errors)
    res.assertBodyContains({
      success: false,
      message: 'Unauthorized',
      detail: 'Wrong email and/or password',
      errors: {},
    })
  }).with([
    { email: 'some+user@gmail.com', password: '' },
    { email: 'user@gmail.com', password: '123' },
    { email: 'email@123.123.123.123', password: '' },
  ])
})
