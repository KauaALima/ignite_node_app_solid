import { expect, describe, it, beforeAll, afterAll } from 'vitest'
import { app } from '../../../app'
import request from 'supertest'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user'
import { prisma } from '../../../lib/prisma'

describe('Create Check In (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create Check In', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        description: 'Soma description',
        phone: '19999999',
        latitude: -3.8273024,
        longitude: -38.4958464,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -3.8273024,
        longitude: -38.4958464,
      })

    expect(response.statusCode).toEqual(201)
  })
})
