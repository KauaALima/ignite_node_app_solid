import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymRepository } from '../repositories/In-memory/in-memory-gym-repository'
import { SearchGymUseCase } from './search-gym'

let gymRepository: InMemoryGymRepository
let sut: SearchGymUseCase

describe('Search Gym Use Case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymRepository()
    sut = new SearchGymUseCase(gymRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymRepository.create({
      title: 'Gym 1',
      description: null,
      phone: null,
      latitude: -3.8273024,
      longitude: -38.4958464,
    })

    const { gyms } = await sut.execute({
      query: 'Gym 1',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Gym 1' })])
  })

  it('should be able to search for gyms last pagination', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymRepository.create({
        title: `Type gym-${i}`,
        description: null,
        phone: null,
        latitude: -3.8273024,
        longitude: -38.4958464,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Type',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Type gym-21' }),
      expect.objectContaining({ title: 'Type gym-22' }),
    ])
  })
})
