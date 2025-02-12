import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeFetchUsersCheckInsHistoryUseCase } from '../../../use-cases/factories/make-fetch-users-check-ins-history-use-case'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const fetchCheckInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = fetchCheckInHistoryQuerySchema.parse(request.query)

  const fetchUsersCheckInsHistoryUseCase =
    makeFetchUsersCheckInsHistoryUseCase()

  const { checkIns } = await fetchUsersCheckInsHistoryUseCase.execute({
    userId: request.user.sub,
    page,
  })

  return reply.status(200).send({ checkIns })
}
