import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInRepository } from '../repositories/In-memory/in-memory-check-in-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './erros/resource-not-found'
import { LateCheckInValidationError } from './erros/late-check-validate-error'

let checkInRepository: InMemoryCheckInRepository
let sut: ValidateCheckInUseCase

describe('Validate check-in Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository()
    sut = new ValidateCheckInUseCase(checkInRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate check in', async () => {
    const createCheckIn = await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should be not able to validate an inexistent check in', async () => {
    expect(() =>
      sut.execute({
        checkInId: 'Not found',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be not able to validate the check in after 20 minutes of this cration', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const createCheckIn = await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const twentyOneMinutesMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesMs)

    expect(() =>
      sut.execute({
        checkInId: createCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
