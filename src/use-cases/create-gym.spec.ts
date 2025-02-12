import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymRepository } from '../repositories/In-memory/in-memory-gym-repository'
import { CreateGymUseCase } from './create-gym'

let gymRepository: InMemoryGymRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymRepository()
    sut = new CreateGymUseCase(gymRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Gym 1',
      description: null,
      phone: null,
      latitude: -3.8273024,
      longitude: -38.4958464,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
