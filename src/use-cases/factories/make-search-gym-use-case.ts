import { PrismaGymRepository } from '../../repositories/prisma/prisma-gym-repository'
import { SearchGymUseCase } from '../search-gym'

export function makeSearchGymUseCase() {
  const prismaGymRepository = new PrismaGymRepository()
  const useCase = new SearchGymUseCase(prismaGymRepository)

  return useCase
}
