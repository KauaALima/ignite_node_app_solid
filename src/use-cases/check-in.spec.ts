import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInRepository } from '../repositories/In-memory/in-memory-check-in-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymRepository } from '../repositories/In-memory/in-memory-gym-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInRepository: InMemoryCheckInRepository
let gymRepository: InMemoryGymRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository()
    gymRepository = new InMemoryGymRepository()
    sut = new CheckInUseCase(checkInRepository, gymRepository)

    gymRepository.create({
      id: 'gym-01',
      title: 'Gym 1',
      phone: '',
      description: null,
      latitude: new Decimal(-3.8273024),
      longitude: new Decimal(-38.4958464),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -3.8273024,
      userLongitude: -38.4958464,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -3.8273024,
      userLongitude: -38.4958464,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -3.8273024,
        userLongitude: -38.4958464,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice in but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -3.8273024,
      userLongitude: -38.4958464,
    })

    vi.setSystemTime(new Date(2022, 0, 22, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -3.8273024,
      userLongitude: -38.4958464,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be able to check in twice in on distant gym', async () => {
    gymRepository.create({
      id: 'gym-02',
      title: 'Gym 2',
      phone: '',
      description: '',
      latitude: new Decimal(-3.7163062),
      longitude: new Decimal(-38.4945167),
    })

    expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -3.8273024,
        userLongitude: -38.4958464,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
