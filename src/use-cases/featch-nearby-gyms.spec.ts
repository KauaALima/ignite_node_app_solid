import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymRepository } from '../repositories/In-memory/in-memory-gym-repository'
import { FetchNearbyGymsUseCase } from './featch-nearby-gyms'

let gymRepository: InMemoryGymRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch nearby gyms Use Case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymRepository()
    sut = new FetchNearbyGymsUseCase(gymRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymRepository.create({
      title: 'Gym 1',
      description: null,
      phone: null,
      latitude: -3.8273024,
      longitude: -38.4958464,
    })

    await gymRepository.create({
      title: 'Gym 2',
      description: null,
      phone: null,
      latitude: -3.7163062,
      longitude: -38.4945167,
    })

    const { gyms } = await sut.execute({
      userLatitude: -3.7163062,
      userLongitude: -38.4945167,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Gym 2' })])
  })
})
