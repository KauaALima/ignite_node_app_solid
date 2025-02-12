import { expect, describe, it, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import request from 'supertest'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user'
describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to crate Gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Soma description',
        phone: '19999999',
        latitude: -3.8273024,
        longitude: -38.4958464,
      })

    expect(response.statusCode).toEqual(201)
  })
})
