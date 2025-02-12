import { expect, describe, it, beforeEach } from 'vitest'
import { GetUserProfileUseCase } from './get-user-profile'
import { InMemoryRepository } from '../repositories/In-memory/in-memory-users-repository'
import { ResourceNotFoundError } from './erros/resource-not-found'

let usersRepository: InMemoryRepository
let sut: GetUserProfileUseCase

describe('Get user profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'Kauã',
      email: 'teste@email.com',
      password_hash: '123',
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual(expect.any(String))
  })

  it('should be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'not-exist',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
