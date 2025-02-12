import type { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/prisma'
import request from 'supertest'
import { hash } from 'bcrypt'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'JhonDo@email.com',
      password_hash: await hash('1231dasd', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const authResponse = await request(app.server).post('/session').send({
    email: 'JhonDo@email.com',
    password: '1231dasd',
  })

  const { token } = authResponse.body

  return {
    token,
  }
}
