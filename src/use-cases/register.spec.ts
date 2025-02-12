import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcrypt'
import { UserAlreadyExistsError } from './erros/user-already-exists'
import { InMemoryRepository } from '../repositories/In-memory/in-memory-users-repository'

let usersRepository: InMemoryRepository
let registerUseCase: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryRepository()
    registerUseCase = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await registerUseCase.execute({
      name: 'Kauã',
      email: 'teste@email.com',
      password: '123',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user passaword upon registration', async () => {
    const usersRepository = new InMemoryRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'Kauã',
      email: 'teste@email.com',
      password: '123',
    })

    const passwordCompare = await compare('123', user.password_hash)

    expect(passwordCompare).toBe(true)
  })

  it('should be able to register', async () => {
    const usersRepository = new InMemoryRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    await registerUseCase.execute({
      name: 'Kauã',
      email: 'teste@email.com',
      password: '123',
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'Kauã',
        email: 'teste@email.com',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
