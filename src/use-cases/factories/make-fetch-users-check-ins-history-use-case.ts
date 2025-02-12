import { PrismaCheckInRepository } from '../../repositories/prisma/prisma-check-in-repository'
import { FetchUsersCheckInsHistoryUseCase } from '../fetch-users-check-ins-history'

export function makeFetchUsersCheckInsHistoryUseCase() {
  const prismaCheckInRepository = new PrismaCheckInRepository()
  const useCase = new FetchUsersCheckInsHistoryUseCase(prismaCheckInRepository)

  return useCase
}
