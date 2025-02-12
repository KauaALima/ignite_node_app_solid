import type { User } from '@prisma/client'
import type { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from './erros/resource-not-found'

interface GetUserProfilRequest {
  userId: string
}

interface GetUserProfilResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfilRequest): Promise<GetUserProfilResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
