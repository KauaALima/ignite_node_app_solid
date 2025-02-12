import { expect, describe, it, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import request from 'supertest'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'JhonDo@email.com',
      password: '1231dasd',
    })

    expect(response.statusCode).toEqual(201)
  })
})
