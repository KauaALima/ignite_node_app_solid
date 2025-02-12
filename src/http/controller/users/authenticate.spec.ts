import { expect, describe, it, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import request from 'supertest'
describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'JhonDo@email.com',
      password: '1231dasd',
    })

    const response = await request(app.server).post('/session').send({
      email: 'JhonDo@email.com',
      password: '1231dasd',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
