import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryRepository } from '../repositories/In-memory/in-memory-users-repository'
import { hash } from 'bcrypt'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './erros/invalid-credentials-error'

let usersRepository: InMemoryRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to Authenticate', async () => {
    await usersRepository.create({
      name: 'Kaua',
      email: 'teste@email.com',
      password_hash: await hash('123', 6),
    })

    const { user } = await sut.execute({
      email: 'teste@email.com',
      password: '123',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should be able to Authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'teste@email.com',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should be able to Authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'Kaua',
      email: 'teste@email.com',
      password_hash: await hash('123', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'teste@email.com',
        password: '1233',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
