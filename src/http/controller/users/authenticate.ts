import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '../../../use-cases/erros/invalid-credentials-error'
import { makeAuthenticateUseCase } from '../../../use-cases/factories/make-authenticate-use-case'
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authtenticateUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authtenticateUserSchema.parse(request.body)

  try {
    const authtenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authtenticateUseCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
