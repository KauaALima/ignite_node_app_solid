import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { env } from './env'
import { ZodError } from 'zod'
import { usersRoutes } from './http/controller/users/routes'
import { gymsRoutes } from './http/controller/gyms/routes'
import { checkInRoutes } from './http/controller/check-ins/routes'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInRoutes)

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    reply
      .status(400)
      .send({ message: 'Validate error', issues: error.format() })
  }

  if (env.NODE_ENV === 'production') {
    console.log(error)
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
