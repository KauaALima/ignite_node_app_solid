import { PrismaCheckInRepository } from '../../repositories/prisma/prisma-check-in-repository'
import { PrismaGymRepository } from '../../repositories/prisma/prisma-gym-repository'
import { CheckInUseCase } from '../check-in'

export function makeCheckInUseCase() {
  const prismaCheckInRepository = new PrismaCheckInRepository()
  const prismaGymRepository = new PrismaGymRepository()
  const useCase = new CheckInUseCase(
    prismaCheckInRepository,
    prismaGymRepository,
  )

  return useCase
}
